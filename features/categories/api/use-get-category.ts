import { useQuery } from "@tanstack/react-query";

import {client} from "@/lib/hono"

export const useGetCategory = (id?: string) => {
    const query = useQuery({
        enabled: !!id,
        queryKey: ["category", {id}],
        queryFn: async () => {
            const resposne = await client.api.categories[":id"].$get({
                param: {id},
            });

            if(!resposne.ok){
                throw new Error("Failed to fetch category");
            }

            const { data } = await resposne.json();
            return data;
        }
    });

    return query;
};