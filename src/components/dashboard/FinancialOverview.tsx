import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';

const financialData = [
  {
    title: 'Total Balance',
    value: '$12,345.67',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: Icons.wallet,
    description: 'Across all accounts',
  },
  {
    title: 'Monthly Income',
    value: '$5,240.00',
    change: '+3.2%',
    changeType: 'positive' as const,
    icon: Icons.trendingUp,
    description: 'This month',
  },
  {
    title: 'Monthly Expenses',
    value: '$3,850.25',
    change: '-5.8%',
    changeType: 'negative' as const,
    icon: Icons.trendingDown,
    description: 'This month',
  },
  {
    title: 'Net Worth',
    value: '$45,890.12',
    change: '+8.7%',
    changeType: 'positive' as const,
    icon: Icons.barChart,
    description: 'Total assets',
  },
];

export const FinancialOverview = () => {
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
            <div className="space-y-2">
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="flex items-center space-x-1">
                <span
                  className={`text-sm font-medium ${
                    item.changeType === 'positive' 
                      ? 'text-success' 
                      : 'text-destructive'
                  }`}
                >
                  {item.change}
                </span>
                <span className="text-sm text-muted-foreground">
                  {item.description}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};