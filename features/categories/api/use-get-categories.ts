import { useQuery } from "@tanstack/react-query";

import {client} from "@/lib/hono"

export const useGetCategories = () => {
    const query = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const resposne = await client.api.categories.$get();

            if(!resposne.ok){
                throw new Error("Failed to fetch categories");
            }

            const { data } = await resposne.json();
            return data;
        }
    });

    return query;
};