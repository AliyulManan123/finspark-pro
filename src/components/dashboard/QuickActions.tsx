import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { AddTransactionDialog } from './AddTransactionDialog';
import { AddGoalDialog } from './AddGoalDialog';
import { AddBudgetDialog } from './AddBudgetDialog';
import { TransferFundsDialog } from './TransferFundsDialog';
import { useToast } from '@/hooks/use-toast';

const actionItems = [
  {
    title: 'Add Income',
    description: 'Record new income',
    icon: Icons.plus,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    type: 'income' as const,
  },
  {
    title: 'Add Expense',
    description: 'Record new expense',
    icon: Icons.minus,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    type: 'expense' as const,
  },
  {
    title: 'Transfer Funds',
    description: 'Between accounts',
    icon: Icons.arrowLeftRight,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    type: 'transfer' as const,
  },
  {
    title: 'Set Budget',
    description: 'Create new budget',
    icon: Icons.target,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    type: 'budget' as const,
  },
];

export const QuickActions = () => {
    const [dialog, setDialog] = useState<string | null>(null);
    const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
    const { toast } = useToast();

    const handleActionClick = (type: 'income' | 'expense' | 'transfer' | 'budget') => {
        if (type === 'income' || type === 'expense') {
            setTransactionType(type);
            setDialog('transaction');
        }
        if (type === 'transfer') setDialog('transfer');
        if (type === 'budget') setDialog('budget');
    }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icons.zap className="w-5 h-5" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {actionItems.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start h-auto p-4"
            onClick={() => handleActionClick(action.type)}
          >
            <div className="flex items-center space-x-3 w-full">
              <div className={`w-10 h-10 rounded-lg ${action.bgColor} flex items-center justify-center`}>
                <action.icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-sm text-muted-foreground">
                  {action.description}
                </div>
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>

    <AddTransactionDialog 
        open={dialog === 'transaction'}
        onOpenChange={(open) => !open && setDialog(null)}
        defaultType={transactionType}
    />
    <AddBudgetDialog 
        open={dialog === 'budget'}
        onOpenChange={(open) => !open && setDialog(null)}
    />
    <TransferFundsDialog
        open={dialog === 'transfer'}
        onOpenChange={(open) => !open && setDialog(null)}
    />
    </>
  );
};

