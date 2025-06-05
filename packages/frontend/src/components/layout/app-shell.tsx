import React from 'react';
import { Sidebar } from './sidebar';
import { MobileNav } from './mobile-nav';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <MobileNav />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pb-20 md:pb-0 max-w-4xl mx-auto px-4">
          {children}
        </main>
      </div>
    </div>
  );
}