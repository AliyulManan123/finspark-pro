import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { Skeleton } from '../ui/skeleton';

interface FinancialOverviewProps {
  isLoading: boolean;
  data: {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    netWorth: number;
  } | undefined;
}

const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '$--';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

export const FinancialOverview: React.FC<FinancialOverviewProps> = ({ data, isLoading }) => {

    const financialData = [
        {
          title: 'Total Balance',
          value: formatCurrency(data?.totalBalance),
          icon: Icons.wallet,
          description: 'Across all accounts',
        },
        {
          title: 'Monthly Income',
          value: formatCurrency(data?.monthlyIncome),
          icon: Icons.trendingUp,
          description: 'This month',
        },
        {
          title: 'Monthly Expenses',
          value: formatCurrency(data?.monthlyExpenses),
          icon: Icons.trendingDown,
          description: 'This month',
        },
        {
          title: 'Net Worth',
          value: formatCurrency(data?.netWorth),
          icon: Icons.barChart,
          description: 'Total assets',
        },
      ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {financialData.map((item, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <item.icon className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="text-2xl font-bold">{item.value}</div>
                    <p className="text-sm text-muted-foreground">
                        {item.description}
                    </p>
                </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

