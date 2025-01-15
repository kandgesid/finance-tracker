import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$delete"]>;



export const useDeleteCategory = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async () => {
            const response = await client.api.categories[":id"]["$delete"]({
                param: {id}
            });
            
            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Failed to delete category: ${error}`);
            }
           
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Category deleted successfully");
            queryClient.invalidateQueries({queryKey: ["categories"]});
            queryClient.invalidateQueries({queryKey: ["category", { id }]});
            queryClient.invalidateQueries({queryKey: ["transactions"]});
            queryClient.invalidateQueries({queryKey: ["summary"]});
        },
        onError: () => {
            toast.error("Failed to delete category.");
        },
    });

    return mutation;
};