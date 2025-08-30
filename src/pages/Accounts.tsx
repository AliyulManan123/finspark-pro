import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { getAccounts } from '@/services/api';
import { EmptyState } from '@/components/common/EmptyState';
import { AddAccountDialog } from '@/components/dashboard/AddAccountDialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const Accounts = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async (accountId: string) => {
      const { error } = await supabase
        .from('accounts')
        .update({ is_active: false })
        .eq('id', accountId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Account deactivated successfully.' });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to deactivate account: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'bank':
        return <Icons.building className="w-4 h-4" />;
      case 'cash':
        return <Icons.banknote className="w-4 h-4" />;
      case 'credit_card':
        return <Icons.creditCard className="w-4 h-4" />;
      case 'e_wallet':
        return <Icons.smartphone className="w-4 h-4" />;
      case 'investment':
        return <Icons.trendingUp className="w-4 h-4" />;
      default:
        return <Icons.wallet className="w-4 h-4" />;
    }
  };

  const getAccountTypeBadge = (type: string) => {
    const variants: Record<string, string> = {
      bank: 'bg-blue-500/10 text-blue-500',
      cash: 'bg-green-500/10 text-green-500',
      credit_card: 'bg-red-500/10 text-red-500',
      e_wallet: 'bg-purple-500/10 text-purple-500',
      investment: 'bg-orange-500/10 text-orange-500',
    };

    return (
      <Badge variant="default" className={variants[type] || 'bg-gray-500/10 text-gray-500'}>
        {type.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const totalBalance = accounts.reduce((sum, account) => sum + Number(account.balance), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Accounts</h1>
          <p className="text-muted-foreground">Manage your financial accounts</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Icons.plus className="w-4 h-4 mr-2" />
          Add Account
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Icons.dollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {accounts.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <EmptyState 
              title="No accounts found"
              description="Start by adding your first account"
              icon="creditCard"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account: any) => (
            <Card key={account.id} className="relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  {getAccountTypeIcon(account.type)}
                  <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {getAccountTypeBadge(account.type)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAccountMutation.mutate(account.id)}
                    disabled={deleteAccountMutation.isPending}
                  >
                    <Icons.trash className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  ${Number(account.balance).toFixed(2)}
                </div>
                {account.description && (
                  <p className="text-xs text-muted-foreground">{account.description}</p>
                )}
                <div className="text-xs text-muted-foreground mt-2">
                  Currency: {account.currency}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddAccountDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
};