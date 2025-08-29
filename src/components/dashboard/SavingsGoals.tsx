import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';

const savingsGoals = [
  {
    name: 'Emergency Fund',
    current: 5500,
    target: 10000,
    dueDate: '2024-12-31',
  },
  {
    name: 'Vacation',
    current: 1200,
    target: 3000,
    dueDate: '2024-07-15',
  },
  {
    name: 'New Car',
    current: 8500,
    target: 25000,
    dueDate: '2025-06-01',
  },
];

export const SavingsGoals = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Icons.target className="w-5 h-5" />
          <span>Savings Goals</span>
        </CardTitle>
        <Button variant="outline" size="sm">
          Add Goal
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {savingsGoals.map((goal, index) => {
            const percentage = (goal.current / goal.target) * 100;
            const remaining = goal.target - goal.current;
            
            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{goal.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Due: {new Date(goal.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      ${goal.current.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      of ${goal.target.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Progress value={percentage} className="h-3" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {percentage.toFixed(1)}% complete
                    </span>
                    <span className="text-muted-foreground">
                      ${remaining.toLocaleString()} remaining
                    </span>
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