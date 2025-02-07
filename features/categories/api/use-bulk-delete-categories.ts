import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>["json"];


export const useBulkDeleteCategories = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.categories["bulk-delete"]["$post"]({json});
            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Failed to delete categories: ${error}`);
            }
           
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Categories deleted successfully");
            queryClient.invalidateQueries({queryKey: ["categories"]});
            queryClient.invalidateQueries({queryKey: ["summary"]});
        },
        onError: () => {
            toast.error("Failed to delete categories");
        },
    });

    return mutation;
};