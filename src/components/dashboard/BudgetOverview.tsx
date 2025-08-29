import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Skeleton } from '../ui/skeleton';
import { EmptyState } from '../common/EmptyState';

type BudgetWithRelations = {
    id: string;
    name: string;
    amount: number;
    spent: number | null;
    categories: {
        name: string;
        color: string | null;
    } | null;
}

interface BudgetOverviewProps {
    budgets: BudgetWithRelations[] | undefined;
    isLoading: boolean;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({ budgets, isLoading }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Icons.pieChart className="w-5 h-5" />
          <span>Budget Overview</span>
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link to="/budgets">Manage Budgets</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
        {isLoading && Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-2">
                <div className="flex justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-3 w-16" />
            </div>
        ))}
        {!isLoading && (!budgets || budgets.length === 0) && (
            <EmptyState
                icon="pieChart"
                title="No Budgets Created"
                description="Create budgets to track your spending against your goals."
            />
        )}
          {!isLoading && budgets && budgets.map((item, index) => {
            const spent = item.spent || 0;
            const percentage = (spent / item.amount) * 100;
            const isOverBudget = percentage > 100;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{item.name} ({item.categories?.name})</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${spent.toFixed(2)} / ${item.amount.toFixed(2)}
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

