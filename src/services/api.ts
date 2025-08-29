import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { PostgrestError } from '@supabase/supabase-js';

// Fetch recent transactions with a limit
export const getRecentTransactions = async (limit = 5): Promise<Tables<'transactions'>[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('transaction_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent transactions:', error);
    throw error;
  }
  return data || [];
};

// Fetch all transactions for chart
export const getAllTransactions = async (): Promise<Tables<'transactions'>[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('transaction_date', { ascending: false });
  
    if (error) {
      console.error('Error fetching all transactions:', error);
      throw error;
    }
    return data || [];
  };

// Fetch budget overview
export const getBudgets = async (): Promise<Tables<'budgets'>[]> => {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching budgets:', error);
      throw error;
    }
    return data || [];
};

// Fetch savings goals
export const getSavingsGoals = async (): Promise<Tables<'savings_goals'>[]> => {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('status', 'active')
      .order('target_date', { ascending: true });

    if (error) {
      console.error('Error fetching savings goals:', error);
      throw error;
    }
    return data || [];
};

// Fetch financial summary data
export const getFinancialSummary = async () => {
    const { data: accounts, error: accountsError } = await supabase.from('accounts').select('balance');
    if (accountsError) throw accountsError;
  
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
    // For income and expenses, we'll sum transactions from the current month
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
  
    const { data: incomeData, error: incomeError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('type', 'income')
      .gte('transaction_date', firstDayOfMonth);
    if (incomeError) throw incomeError;
  
    const monthlyIncome = incomeData.reduce((sum, t) => sum + t.amount, 0);
  
    const { data: expenseData, error: expenseError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('type', 'expense')
      .gte('transaction_date', firstDayOfMonth);
    if (expenseError) throw expenseError;
  
    const monthlyExpenses = expenseData.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
    return {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      netWorth: totalBalance, // Simplified for now
    };
  };

// Fetch accounts for selection
export const getAccounts = async (): Promise<Tables<'accounts'>[]> => {
    const { data, error } = await supabase.from('accounts').select('*').eq('is_active', true);
    if (error) throw error;
    return data || [];
}

// Fetch categories for selection
export const getCategories = async (type: 'income' | 'expense'): Promise<Tables<'categories'>[]> => {
    const { data, error } = await supabase.from('categories').select('*').eq('type', type);
    if (error) throw error;
    return data || [];
}

// Add a new transaction
export const addTransaction = async (transaction: TablesInsert<'transactions'>): Promise<{ data: Tables<'transactions'>[] | null, error: PostgrestError | null }> => {
    const { data, error } = await supabase.from('transactions').insert(transaction).select();
    return { data, error };
}

