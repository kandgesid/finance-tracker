import { Button } from "@/components/ui/button"
import { useRef, useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { useCreateAccount } from "../api/use-create-account"
import { useGetAccounts } from "../api/use-get-accounts"
import { Select } from "@/components/select"




export const useSelectAccount = ():[() => JSX.Element, () => Promise<unknown>] => {

    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();
    const onCreateAccount = (name: string) => {
        accountMutation.mutate({name});
    };

    const accountOption = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id,
    }));

    const [promise, setPromise] = useState<{resolve: (value: string | undefined) => void} | null>(null);


    const selectValue = useRef<string>();



    const confirm = () => new Promise((resolve, reject) => {
        setPromise({resolve});
    });

    const handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        promise?.resolve(selectValue.current);
        handleClose();
    };

    const handleCancle = () => {
        promise?.resolve(undefined);
        handleClose();
    }

    const ConfirmationDialog = () => (
        <Dialog open={promise != null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Select Account
                    </DialogTitle>
                    <DialogDescription>PLease select an account to continue</DialogDescription>
                </DialogHeader>
                <Select 
                    placeholder="Select an account"
                    options={accountOption}
                    onCreate={onCreateAccount}
                    onChange={(value) => selectValue.current = value}
                    disabled={accountQuery.isLoading || accountMutation.isPending}
                />
                <DialogFooter className="pt-2">
                    <Button onClick={handleCancle} variant={"outline"}>
                        Cancle
                    </Button>

                    <Button onClick={handleConfirm} variant={"outline"}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    return [ConfirmationDialog, confirm];
}