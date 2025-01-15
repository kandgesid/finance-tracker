"use client"

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectItem,
    SelectValue
} from "./ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { useGetSummary } from "@/features/summary/api/use-get-summary";


export const AccountFilter = () => {
    const router = useRouter();
    const pathname = usePathname();
    
    const params = useSearchParams();
    const accountId = params.get("accountId") || "all";
    const from = params.get("from") || "";
    const to = params.get("to") || "";


    const {
        data: accounts,
        isLoading: isLoadingAccounts
    } = useGetAccounts();

    const {isLoading: isLoadingSummary} = useGetSummary()

    function stringifyWithSkipEmpty(obj: any) {
        const filteredObj = Object.fromEntries(
          Object.entries(obj).filter(([_, value]) => value !== '')
        );
        return qs.stringify(filteredObj, { skipNulls: true });
    }
      
    const onChange = (newValue: string) => {
        
        const query = {
            accountId: newValue,
            from,
            to
        };
        if(newValue === "all"){
            query.accountId = ""
        }

        const queryString = stringifyWithSkipEmpty(query);
        const url = `${pathname}?${queryString}`;
        router.push(url);
    };

    return (
        <Select
            value={accountId}
            onValueChange={onChange}
            disabled={isLoadingAccounts || isLoadingSummary}
        >
            <SelectTrigger
                className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-whhite/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition"
            >
                <SelectValue placeholder="Select account"/>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">
                    All accounts
                </SelectItem>
                {accounts?.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                        {account.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};