"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Compass, 
  MessageSquare, 
  PlusSquare,
  User,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from './sidebar';

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Feed',
      path: '/feed',
      icon: Home,
    },
    {
      name: 'Create',
      path: '/posts/new',
      icon: PlusSquare,
    },
    {
      name: 'Discover',
      path: '/discover',
      icon: Compass,
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: MessageSquare,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
    },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            
            // Special case for Create button
            if (item.name === 'Create') {
              return (
                <Link href={item.path} key={item.name}>
                  <Button 
                    size="icon" 
                    className="rounded-full -mt-6 shadow-md bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <item.icon className="h-5 w-5" />
                  </Button>
                </Link>
              );
            }
            
            return (
              <Link 
                href={item.path} 
                key={item.name}
                className={cn(
                  "flex flex-col items-center py-3 px-4 text-xs",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Header with Menu */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border md:hidden">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">Connectify</span>
            </Link>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}