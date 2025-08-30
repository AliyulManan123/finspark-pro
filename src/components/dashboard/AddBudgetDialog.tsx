import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { addBudget, getCategories } from '@/services/api';
import { Icons } from '../ui/icons';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const budgetSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  amount: z.coerce.number().positive({ message: 'Amount must be positive.' }),
  category_id: z.string({ required_error: 'Please select a category.' }),
  period_start: z.date({ required_error: 'Please select a start date.' }),
  period_end: z.date({ required_error: 'Please select an end date.' }),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

interface AddBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddBudgetDialog: React.FC<AddBudgetDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      name: '',
      amount: 0,
    },
  });

  React.useEffect(() => {
    if (open) {
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      form.reset({
        name: '',
        amount: 0,
        category_id: undefined,
        period_start: today,
        period_end: nextMonth,
      });
    }
  }, [open, form]);

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories', 'expense'],
    queryFn: () => getCategories('expense'),
    enabled: open,
  });

  const addBudgetMutation = useMutation({
    mutationFn: addBudget,
    onSuccess: () => {
      toast({ title: 'Success', description: 'Budget created successfully.' });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create budget: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: BudgetFormData) => {
    if (!user) return;
    const budgetData = {
      user_id: user.id,
      name: values.name,
      amount: values.amount,
      category_id: values.category_id,
      period_start: format(values.period_start, 'yyyy-MM-dd'),
      period_end: format(values.period_end, 'yyyy-MM-dd'),
    };
    addBudgetMutation.mutate(budgetData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
          <DialogDescription>
            Set a spending limit for a specific category and time period.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Monthly Groceries" {...field} />
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
                  <FormLabel>Budget Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger disabled={isLoadingCategories}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="period_start"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "MMM dd")
                            ) : (
                              <span>Start date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="period_end"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "MMM dd")
                            ) : (
                              <span>End date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            form.getValues("period_start") && date < form.getValues("period_start")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={addBudgetMutation.isPending}>
                {addBudgetMutation.isPending && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Budget
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};