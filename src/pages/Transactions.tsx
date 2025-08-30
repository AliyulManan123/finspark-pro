import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { AddTransactionDialog } from '@/components/dashboard/AddTransactionDialog';
import { getAllTransactions } from '@/services/api';
import { EmptyState } from '@/components/common/EmptyState';

export const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['allTransactions'],
    queryFn: getAllTransactions,
  });

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTransactionBadge = (type: string) => {
    switch (type) {
      case 'income':
        return <Badge variant="default" className="bg-green-500/10 text-green-500">Income</Badge>;
      case 'expense':
        return <Badge variant="default" className="bg-red-500/10 text-red-500">Expense</Badge>;
      case 'transfer':
        return <Badge variant="default" className="bg-blue-500/10 text-blue-500">Transfer</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const formatAmount = (amount: number, type: string) => {
    const value = Math.abs(amount);
    const prefix = type === 'expense' ? '-' : '+';
    const color = type === 'expense' ? 'text-red-500' : 'text-green-500';
    return <span className={color}>{prefix}${value.toFixed(2)}</span>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">Manage and track all your financial transactions</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Icons.plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <EmptyState 
              title="No transactions found"
              description="Start by adding your first transaction"
              icon="creditCard"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction: any) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.description || 'No description'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {transaction.categories?.color && (
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: transaction.categories.color }}
                          />
                        )}
                        {transaction.categories?.name || 'Uncategorized'}
                      </div>
                    </TableCell>
                    <TableCell>{transaction.accounts?.name || 'Unknown'}</TableCell>
                    <TableCell>{getTransactionBadge(transaction.type)}</TableCell>
                    <TableCell className="text-right">
                      {formatAmount(transaction.amount, transaction.type)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddTransactionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
};