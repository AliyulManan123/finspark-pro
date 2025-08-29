import React, { useState } from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="finpro-theme">
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <SidebarTrigger className="lg:hidden" />
              </div>
              {children}
            </div>
          </main>
        </div>
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  );
};