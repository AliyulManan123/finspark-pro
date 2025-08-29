import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Tables } from '@/integrations/supabase/types';
import { Skeleton } from '../ui/skeleton';
import { EmptyState } from '../common/EmptyState';

interface SavingsGoalsProps {
    goals: Tables<'savings_goals'>[] | undefined;
    isLoading: boolean;
}

export const SavingsGoals: React.FC<SavingsGoalsProps> = ({ goals, isLoading }) => {
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
        {isLoading && Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-4 w-24 mt-1" />
                    </div>
                    <div className="text-right">
                        <Skeleton className="h-5 w-20 ml-auto" />
                        <Skeleton className="h-4 w-24 mt-1 ml-auto" />
                    </div>
                </div>
                <Skeleton className="h-3 w-full" />
            </div>
        ))}
         {!isLoading && (!goals || goals.length === 0) && (
            <EmptyState
                icon="target"
                title="No Savings Goals"
                description="Set up savings goals to work towards your financial dreams."
            />
        )}
          {!isLoading && goals && goals.map((goal, index) => {
            const current = goal.current_amount || 0;
            const percentage = (current / goal.target_amount) * 100;
            const remaining = goal.target_amount - current;
            
            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{goal.name}</div>
                    {goal.target_date && (
                        <div className="text-sm text-muted-foreground">
                        Due: {new Date(goal.target_date).toLocaleDateString()}
                        </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      ${current.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      of ${goal.target_amount.toLocaleString()}
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

