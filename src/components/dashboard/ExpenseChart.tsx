import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getAllTransactions } from '@/services/api';
import { Icons } from '@/components/ui/icons';

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

export const ExpenseChart = () => {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['allTransactions'],
    queryFn: getAllTransactions,
  });

  // Process data for expense categories
  const expenseData = React.useMemo(() => {
    const categoryExpenses: Record<string, number> = {};
    
    transactions
      .filter((t: any) => t.type === 'expense')
      .forEach((transaction: any) => {
        const categoryName = transaction.categories?.name || 'Uncategorized';
        categoryExpenses[categoryName] = (categoryExpenses[categoryName] || 0) + Math.abs(transaction.amount);
      });

    return Object.entries(categoryExpenses)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6 categories
  }, [transactions]);

  const totalExpenses = expenseData.reduce((sum, item) => sum + item.value, 0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <Icons.spinner className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (expenseData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <Icons.pieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No expense data available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            Total Expenses: <span className="font-medium">${totalExpenses.toFixed(2)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};