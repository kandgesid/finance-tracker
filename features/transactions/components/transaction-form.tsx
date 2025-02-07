import { insertAccountSchema, insertTransactionSchema } from "@/db/schema";
import {useForm } from "react-hook-form";
import { z } from "zod";
import {zodResolver} from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Select } from "@/components/select";
import { DatePicker } from "@/components/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { AmountInput } from "@/components/amount-input";
import { convertAmountToMiliunits } from "@/lib/utils";


const formSchema = z.object({
    date: z.coerce.date(),
    accountId: z.string(),
    categoryId: z.string().nullable().optional(),
    payee: z.string(),
    amount: z.string(),
    notes: z.string().nullable().optional()
});

const apiFormSchema = insertTransactionSchema.omit({
    id: true
});

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiFormSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: ApiFormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
    accountOptions: {label: string, value: string}[];
    categoryOptions: {label: string, value: string}[];
    onCreateAccount: (name: string) => void;
    onCreateCatergory: (name: string) => void;
}

export const TransactionForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
    accountOptions,
    categoryOptions,
    onCreateAccount,
    onCreateCatergory
}: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    });

    const handleSubmit = (values: FormValues) => {
        const amountInmiliunits = convertAmountToMiliunits(parseFloat(values.amount));
        onSubmit({
            ...values,
            amount: amountInmiliunits
        });
    };

    const handleDelete = () => {
        onDelete?.();
    };

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(handleSubmit)} 
                className="space-y-4 pt-4"
            >
                <FormField 
                    name="date"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormControl> 
                               <DatePicker 
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={disabled}
                               />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField 
                    name="accountId"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Account
                            </FormLabel>
                            <FormControl>
                                <Select
                                   placeholder="select an account"
                                   options={accountOptions}
                                   onCreate={onCreateAccount}
                                   value={field.value}
                                   onChange={field.onChange}
                                   disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField 
                    name="categoryId"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Catgory
                            </FormLabel>
                            <FormControl>
                                <Select
                                   placeholder="select an category"
                                   options={categoryOptions}
                                   onCreate={onCreateCatergory}
                                   value={field.value}
                                   onChange={field.onChange}
                                   disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField 
                    name="payee"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Payee
                            </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={disabled}
                                    placeholder="Add a payee"
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={field.onChange} 
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField 
                    name="amount"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Amount
                            </FormLabel>
                            <FormControl>
                                <AmountInput
                                    {...field}
                                    disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField 
                    name="notes"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Notes
                            </FormLabel>
                            <FormControl>
                                <Textarea 
                                    {...field}
                                    value={field.value ?? ""}
                                    placeholder="Optional notes"
                                    disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button className="w-full" disabled={disabled}>
                    {id ? "Save Changes" : "Create transaction"}
                </Button>
                {!!id && (
                    <Button
                    type="button"
                    disabled={disabled}
                    onClick={handleDelete}
                    className="w-full"
                    variant="outline"
                >
                    <Trash className="size-4 mr-2"/>
                    Delete transaction
                </Button>
            )}
            </form>
        </Form>
    );
}