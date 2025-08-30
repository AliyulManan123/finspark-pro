import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const profileSchema = z.object({
  full_name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  phone: z.string().optional(),
  timezone: z.string(),
  currency: z.string(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const Settings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      full_name: profile?.full_name || '',
      email: profile?.email || user?.email || '',
      phone: profile?.phone || '',
      timezone: profile?.timezone || 'UTC',
      currency: profile?.currency || 'USD',
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...data,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Profile updated successfully.' });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update profile: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      // In a real app, you might want to soft delete or clean up data
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Account deleted', description: 'Your account has been permanently deleted.' });
      signOut();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete account: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: ProfileFormData) => {
    updateProfileMutation.mutate(values);
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;
    
    setIsChangingPassword(true);
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    setIsChangingPassword(false);
    
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Password reset sent',
        description: 'Check your email for password reset instructions.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time</SelectItem>
                            <SelectItem value="America/Chicago">Central Time</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                            <SelectItem value="Asia/Jakarta">Jakarta Time</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                            <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                            <SelectItem value="IDR">IDR - Indonesian Rupiah</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Profile
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Password</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Change your password to keep your account secure.
              </p>
              <Button 
                variant="outline" 
                onClick={handleChangePassword}
                disabled={isChangingPassword}
              >
                {isChangingPassword && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Change Password
              </Button>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2 text-red-600">Danger Zone</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button 
                variant="destructive" 
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    deleteAccountMutation.mutate();
                  }
                }}
                disabled={deleteAccountMutation.isPending}
              >
                {deleteAccountMutation.isPending && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};