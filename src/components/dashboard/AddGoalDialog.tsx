import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { addGoal } from '@/services/api';
import { Icons } from '../ui/icons';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const goalSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  target_amount: z.coerce.number().positive({ message: 'Target amount must be positive.' }),
  description: z.string().optional(),
  target_date: z.date().optional(),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface AddGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddGoalDialog: React.FC<AddGoalDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: '',
      target_amount: 0,
      description: '',
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: '',
        target_amount: 0,
        description: '',
        target_date: undefined,
      });
    }
  }, [open, form]);

  const addGoalMutation = useMutation({
    mutationFn: addGoal,
    onSuccess: () => {
      toast({ title: 'Success', description: 'Savings goal created successfully.' });
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create goal: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: GoalFormData) => {
    if (!user) return;
    const goalData = {
      user_id: user.id,
      name: values.name,
      target_amount: values.target_amount,
      description: values.description,
      target_date: values.target_date ? format(values.target_date, 'yyyy-MM-dd') : undefined,
    };
    addGoalMutation.mutate(goalData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Savings Goal</DialogTitle>
          <DialogDescription>
            Set a new savings goal to help track your financial targets.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Emergency Fund" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="target_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="target_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Target Date (Optional)</FormLabel>
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
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
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
                          date < new Date() || date < new Date("1900-01-01")
                        }
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What is this goal for?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={addGoalMutation.isPending}>
                {addGoalMutation.isPending && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Goal
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};