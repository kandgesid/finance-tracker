import { useQuery } from "@tanstack/react-query";

import {client} from "@/lib/hono"

export const useGetAccount = (id?: string) => {
    const query = useQuery({
        enabled: !!id,
        queryKey: ["account", {id}],
        queryFn: async () => {
            const resposne = await client.api.accounts[":id"].$get({
                param: {id},
            });

            if(!resposne.ok){
                throw new Error("Failed to fetch account");
            }

            const { data } = await resposne.json();
            return data;
        }
    });

    return query;
};