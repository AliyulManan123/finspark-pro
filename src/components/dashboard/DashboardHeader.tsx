import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';

export const DashboardHeader = () => {
  const { user } = useAuth();
  
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {getTimeOfDay()}, {user?.email?.split('@')[0] || 'User'}
        </h1>
        <p className="text-muted-foreground">
          Here's your financial overview for today
        </p>
      </div>
      
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Icons.zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Financial Health Score</h3>
              <div className="flex items-center space-x-2">
                <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-gradient-to-r from-success to-primary rounded-full" />
                </div>
                <span className="text-sm font-medium text-primary">75%</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Good progress! Consider increasing your savings rate.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};