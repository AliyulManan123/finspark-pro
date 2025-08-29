import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Skeleton } from '../ui/skeleton';
import { EmptyState } from '../common/EmptyState';

// Perluas tipe transaksi untuk menyertakan relasi
type TransactionWithRelations = {
    id: string;
    description: string | null;
    amount: number;
    type: "income" | "expense" | "transfer";
    transaction_date: string;
    categories: {
        name: string;
    } | null;
    accounts: {
        name: string;
    } | null;
}

interface RecentTransactionsProps {
    transactions: TransactionWithRelations[] | undefined;
    isLoading: boolean;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, isLoading }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Icons.receipt className="w-5 h-5" />
          <span>Recent Transactions</span>
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link to="/transactions">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading && Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-1">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <div className="text-right space-y-1">
                    <Skeleton className="h-5 w-20 ml-auto" />
                    <Skeleton className="h-4 w-24 ml-auto" />
                </div>
            </div>
          ))}
          {!isLoading && (!transactions || transactions.length === 0) && (
            <EmptyState 
                icon="receipt"
                title="No Transactions Yet"
                description="Your recent transactions will appear here once you add them."
            />
          )}
          {!isLoading && transactions && transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'income'
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-red-500/10 text-red-500'
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
                    {transaction.categories?.name || 'Uncategorized'} • {transaction.accounts?.name}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`font-semibold ${
                    transaction.type === 'income'
                      ? 'text-green-500'
                      : 'text-foreground'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : ''}
                  ${Math.abs(transaction.amount).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

