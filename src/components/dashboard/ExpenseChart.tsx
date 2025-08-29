import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Tables } from '@/integrations/supabase/types';
import { Skeleton } from '../ui/skeleton';
import { EmptyState } from '../common/EmptyState';

interface ExpenseChartProps {
  transactions: Tables<'transactions'>[] | undefined;
  isLoading: boolean;
}

const processChartData = (transactions: Tables<'transactions'>[]) => {
    const monthlyData: { [key: string]: { income: number; expense: number } } = {};
  
    transactions.forEach(t => {
      const month = new Date(t.transaction_date).toLocaleString('default', { month: 'short' });
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expense += Math.abs(t.amount);
      }
    });
  
    return Object.entries(monthlyData).map(([name, values]) => ({ name, ...values })).reverse();
  };

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions, isLoading }) => {
    const chartData = transactions ? processChartData(transactions) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs. Expense</CardTitle>
        <CardDescription>A look at your cash flow over recent months.</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
        {isLoading && <Skeleton className="h-full w-full" />}
        {!isLoading && (!chartData || chartData.length === 0) && (
            <div className="h-full">
                <EmptyState 
                    icon="barChart"
                    title="Not Enough Data"
                    description="We'll show a chart here once you have more transactions."
                />
            </div>
        )}
        {!isLoading && chartData && chartData.length > 0 && (
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value}`} />
              <Tooltip
                cursor={{ fill: 'hsl(var(--accent))' }}
                contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))'
                }}
              />
              <Bar dataKey="income" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
        </div>
      </CardContent>
    </Card>
  );
};

