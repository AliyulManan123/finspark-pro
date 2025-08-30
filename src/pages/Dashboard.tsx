import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { FinancialOverview } from '@/components/dashboard/FinancialOverview';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { BudgetOverview } from '@/components/dashboard/BudgetOverview';
import { SavingsGoals } from '@/components/dashboard/SavingsGoals';
import { getFinancialSummary, getRecentTransactions, getBudgets, getSavingsGoals } from '@/services/api';

const Dashboard = () => {
  const { data: financialData, isLoading: isLoadingFinancial } = useQuery({
    queryKey: ['financialSummary'],
    queryFn: getFinancialSummary,
  });

  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['recentTransactions'],
    queryFn: () => getRecentTransactions(5),
  });

  const { data: budgets = [], isLoading: isLoadingBudgets } = useQuery({
    queryKey: ['budgets'],
    queryFn: getBudgets,
  });

  const { data: goals = [], isLoading: isLoadingGoals } = useQuery({
    queryKey: ['savingsGoals'],
    queryFn: getSavingsGoals,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader />
        <FinancialOverview 
          data={financialData}
          isLoading={isLoadingFinancial}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RecentTransactions 
              transactions={transactions}
              isLoading={isLoadingTransactions}
            />
            <BudgetOverview 
              budgets={budgets}
              isLoading={isLoadingBudgets}
            />
          </div>
          <div className="space-y-6">
            <QuickActions />
            <SavingsGoals 
              goals={goals}
              isLoading={isLoadingGoals}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;