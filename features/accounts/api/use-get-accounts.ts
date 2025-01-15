import { useQuery } from "@tanstack/react-query";

import {client} from "@/lib/hono"

export const useGetAccounts = () => {
    const query = useQuery({
        queryKey: ["accounts"],
        queryFn: async () => {
            const resposne = await client.api.accounts.$get();

            if(!resposne.ok){
                throw new Error("Failed to fetch accounts");
            }

            const { data } = await resposne.json();
            return data;
        }
    });

    return query;
};