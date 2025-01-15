import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]>["json"];


export const useEditTransaction = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            
            const response = await client.api.transactions[":id"]["$patch"]({
                json,
                param: {id}
            });
           
            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Failed to update transaction: ${error}`);
            }
           
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Transaction updated successfully");
            queryClient.invalidateQueries({queryKey: ["transactions"]});
            queryClient.invalidateQueries({queryKey: ["transaction", { id }]});
            queryClient.invalidateQueries({queryKey: ["summary"]});
        },
        onError: () => {
            toast.error("Failed to update transaction");
        },
    });

    return mutation;
};