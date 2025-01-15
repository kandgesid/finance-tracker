import { client } from "@/lib/hono"
import { convertAmountFromMiliunits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation";



export const useGetSummary = () => {
    const params = useSearchParams();
    const accountId = params.get("accountId") || "";
    const from = params.get("from") || "";
    const to = params.get("to") || "";

    const query = useQuery({
        queryKey: ["summary", {from, to, accountId}],
        queryFn: async () => {
            const resposne = await client.api.summary.$get({
                query: {
                    from,
                    to, 
                    accountId
                }
            })

            if(!resposne.ok){
                throw new Error("Failed to fetch summary");
            }

            const { data } = await resposne.json();
            return {
                ...data,
                remainingAmount: convertAmountFromMiliunits(data.remainingAmount),
                expensesAmount: convertAmountFromMiliunits(data.expensesAmount),
                incomeAmount: convertAmountFromMiliunits(data.incomeAmount),
                categories: data.categories.map((category) => ({
                    ...category,
                    value: convertAmountFromMiliunits(category.value),
                })),
                days: data.days.map((day) => ({
                    ...day,
                    income: convertAmountFromMiliunits(day.income),
                    expenses: convertAmountFromMiliunits(day.expenses),
                })),
            }
        }
    });

    return query;
} 