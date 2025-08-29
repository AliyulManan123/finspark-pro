import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';

const recentTransactions = [
  {
    id: 1,
    description: 'Salary Payment',
    amount: 5240.00,
    type: 'income' as const,
    category: 'Salary',
    date: '2024-01-15',
    account: 'Checking Account',
  },
  {
    id: 2,
    description: 'Grocery Shopping',
    amount: -120.50,
    type: 'expense' as const,
    category: 'Food',
    date: '2024-01-14',
    account: 'Credit Card',
  },
  {
    id: 3,
    description: 'Electric Bill',
    amount: -89.25,
    type: 'expense' as const,
    category: 'Utilities',
    date: '2024-01-13',
    account: 'Checking Account',
  },
  {
    id: 4,
    description: 'Investment Dividend',
    amount: 45.80,
    type: 'income' as const,
    category: 'Investment',
    date: '2024-01-12',
    account: 'Investment Account',
  },
  {
    id: 5,
    description: 'Gas Station',
    amount: -65.00,
    type: 'expense' as const,
    category: 'Transportation',
    date: '2024-01-11',
    account: 'Credit Card',
  },
];

export const RecentTransactions = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Icons.receipt className="w-5 h-5" />
          <span>Recent Transactions</span>
        </CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'income'
                      ? 'bg-success/10 text-success'
                      : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {transaction.type === 'income' ? (
                    <Icons.arrowUpRight className="w-5 h-5" />
                  ) : (
                    <Icons.arrowDownRight className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-sm text-muted-foreground">
                    {transaction.category} • {transaction.account}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`font-semibold ${
                    transaction.type === 'income'
                      ? 'text-success'
                      : 'text-foreground'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : ''}
                  ${Math.abs(transaction.amount).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};