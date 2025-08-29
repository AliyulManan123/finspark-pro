import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { FinancialOverview } from '@/components/dashboard/FinancialOverview';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { BudgetOverview } from '@/components/dashboard/BudgetOverview';
import { SavingsGoals } from '@/components/dashboard/SavingsGoals';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader />
        <FinancialOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RecentTransactions />
            <BudgetOverview />
          </div>
          <div className="space-y-6">
            <QuickActions />
            <SavingsGoals />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;