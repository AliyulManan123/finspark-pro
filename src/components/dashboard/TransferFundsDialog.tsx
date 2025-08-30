import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addTransaction, getAccounts } from '@/services/api';
import { Icons } from '../ui/icons';
import { useAuth } from '@/contexts/AuthContext';

const transferSchema = z.object({
  description: z.string().min(2, { message: 'Description must be at least 2 characters.' }),
  amount: z.coerce.number().positive({ message: 'Amount must be positive.' }),
  from_account_id: z.string({ required_error: 'Please select source account.' }),
  to_account_id: z.string({ required_error: 'Please select destination account.' }),
}).refine((data) => data.from_account_id !== data.to_account_id, {
  message: "Source and destination accounts must be different",
  path: ["to_account_id"],
});

type TransferFormData = z.infer<typeof transferSchema>;

interface TransferFundsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TransferFundsDialog: React.FC<TransferFundsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      description: '',
      amount: 0,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        description: '',
        amount: 0,
        from_account_id: undefined,
        to_account_id: undefined,
      });
    }
  }, [open, form]);

  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
    enabled: open,
  });

  const transferMutation = useMutation({
    mutationFn: async (data: TransferFormData) => {
      if (!user) throw new Error('User not authenticated');
      
      // Create two transactions: one outgoing from source, one incoming to destination
      const outgoingTransaction = {
        user_id: user.id,
        account_id: data.from_account_id,
        to_account_id: data.to_account_id,
        amount: -Math.abs(data.amount), // Negative for outgoing
        type: 'transfer' as const,
        description: `Transfer to ${accounts?.find(a => a.id === data.to_account_id)?.name || 'account'}: ${data.description}`,
      };

      const incomingTransaction = {
        user_id: user.id,
        account_id: data.to_account_id,
        to_account_id: data.from_account_id,
        amount: Math.abs(data.amount), // Positive for incoming
        type: 'transfer' as const,
        description: `Transfer from ${accounts?.find(a => a.id === data.from_account_id)?.name || 'account'}: ${data.description}`,
      };

      // Execute both transactions
      await Promise.all([
        addTransaction(outgoingTransaction),
        addTransaction(incomingTransaction)
      ]);
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Transfer completed successfully.' });
      queryClient.invalidateQueries({ queryKey: ['recentTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['financialSummary'] });
      queryClient.invalidateQueries({ queryKey: ['allTransactions'] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to complete transfer: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: TransferFormData) => {
    transferMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transfer Funds</DialogTitle>
          <DialogDescription>
            Move money between your accounts.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Monthly savings transfer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="from_account_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Account</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger disabled={isLoadingAccounts}>
                        <SelectValue placeholder="Select source account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts?.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} (${account.balance.toString()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="to_account_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Account</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger disabled={isLoadingAccounts}>
                        <SelectValue placeholder="Select destination account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts?.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} (${account.balance.toString()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={transferMutation.isPending}>
                {transferMutation.isPending && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Transfer Funds
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};