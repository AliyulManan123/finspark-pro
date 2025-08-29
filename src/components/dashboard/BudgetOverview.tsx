import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';

const budgetCategories = [
  {
    category: 'Food & Dining',
    spent: 450,
    budget: 600,
    color: 'bg-blue-500',
  },
  {
    category: 'Transportation',
    spent: 280,
    budget: 300,
    color: 'bg-green-500',
  },
  {
    category: 'Entertainment',
    spent: 150,
    budget: 200,
    color: 'bg-purple-500',
  },
  {
    category: 'Utilities',
    spent: 220,
    budget: 250,
    color: 'bg-orange-500',
  },
];

export const BudgetOverview = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Icons.pieChart className="w-5 h-5" />
          <span>Budget Overview</span>
        </CardTitle>
        <Button variant="outline" size="sm">
          Manage Budgets
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {budgetCategories.map((item, index) => {
            const percentage = (item.spent / item.budget) * 100;
            const isOverBudget = percentage > 100;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${item.spent} / ${item.budget}
                  </div>
                </div>
                <div className="space-y-1">
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className="h-2"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span 
                      className={
                        isOverBudget 
                          ? 'text-destructive font-medium' 
                          : 'text-muted-foreground'
                      }
                    >
                      {percentage.toFixed(0)}% used
                    </span>
                    {isOverBudget && (
                      <span className="text-destructive font-medium">
                        Over budget!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};