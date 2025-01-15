"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { Suspense, useState } from "react";
import { UploadButton } from "./upload-button";
import { ImportCard } from "./import-card";
import { transactions as transactionSchema } from "@/db/schema";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { toast } from "sonner";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";


enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT"
};

const INITIAL_IMPORT_RESULTS = {
    data: [],
    error: [],
    meta: {},
};
function TransactionPageComp() {
    return (
        <Suspense>
            < TransactionsPage />
        </Suspense>
       
    );
}
const TransactionsPage = () => {
    const [AccountDialouge, confirm] = useSelectAccount();
    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        console.log(results);
        setImportResults(results);
        setVariant(VARIANTS.IMPORT);
    };

    const onCancleImport = () => {
        setVariant(VARIANTS.LIST);
        setImportResults(INITIAL_IMPORT_RESULTS);
    };

    const newTransaction = useNewTransaction();
    const deleteTransactions = useBulkDeleteTransactions();
    const createBulkTransactions = useBulkCreateTransactions();
    const transactionsQuery = useGetTransactions();
    const transactions = transactionsQuery.data || [];
    const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending;


    const onSubmitImport = async (
        values: typeof transactionSchema.$inferInsert[]
    ) => {
        const accountId = await confirm();

        if(!accountId){
            return toast.error("Please select an account to continue");
        }

        const data = values.map((value) => ({
            ...value,
            accountId: accountId as string,
        }));

        
        createBulkTransactions.mutate(data, {
            onSuccess: () => {
                onCancleImport();
            },
        });
    }
    if(transactionsQuery.isLoading){
        return (
            <div className="max-w-screen-2xl mx-auto w-full pd-10 -mt-24">
                <Card className="border-none drop-shadow-sm">
                    <CardHeader>
                        <Skeleton className="h-8 w-8" />
                    </CardHeader>
                    <CardContent className="h-[500px] w-full flex items-center
                    justify-center">
                        <Loader2 className="size-6 text-slate-300 animate-spin" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if(variant == VARIANTS.IMPORT){
        return (
            <>
                <AccountDialouge />
                <ImportCard 
                    data={importResults.data}
                    onCancle={onCancleImport}
                    onSubmit={onSubmitImport}
                />
            </>
        );
    }
    return (
        <div className="max-w-screen-2xl mx-auto w-full pd-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row 
                lg:justify-between lg:items-center">
                    <CardTitle className="text-xl line-clamp-1">
                        Transaction History
                    </CardTitle>
                    <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
                        <Button 
                            size="sm" 
                            onClick={newTransaction.onOpen}
                            className="w-full lg:w-auto"
                        >
                            <Plus className="size-4 mr-2"/>
                            Add new
                        </Button>
                        <UploadButton 
                            onUpload={onUpload}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable 
                        columns={columns} 
                        data={transactions} 
                        filterKey="payee"
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id);
                            deleteTransactions.mutate({ids})
                        }}
                        disabled={isDisabled}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default TransactionPageComp;