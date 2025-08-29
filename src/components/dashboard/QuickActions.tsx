import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';

const quickActions = [
  {
    title: 'Add Income',
    description: 'Record new income',
    icon: Icons.plus,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    title: 'Add Expense',
    description: 'Record new expense',
    icon: Icons.minus,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  {
    title: 'Transfer Funds',
    description: 'Between accounts',
    icon: Icons.arrowLeftRight,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'Set Budget',
    description: 'Create new budget',
    icon: Icons.target,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
];

export const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icons.zap className="w-5 h-5" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start h-auto p-4"
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
  );
};