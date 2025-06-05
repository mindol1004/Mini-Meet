"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home, 
  Compass, 
  Users, 
  Bell, 
  MessageSquare, 
  Settings, 
  User, 
  LogOut,
  PlusSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth-provider';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const sidebarItems = [
    {
      name: 'Feed',
      path: '/feed',
      icon: Home,
    },
    {
      name: 'Discover',
      path: '/discover',
      icon: Compass,
    },
    {
      name: 'Connections',
      path: '/connections',
      icon: Users,
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: MessageSquare,
    },
    {
      name: 'Profile',
      path: `/profile/${user?.username}`,
      icon: User,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
    },
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <aside className="h-screen sticky top-0 border-r border-border flex flex-col w-64 py-6 px-3 hidden md:flex">
      <div className="flex items-center gap-2 px-4 mb-8">
        <motion.div
          initial={{ rotate: -10, scale: 0.9 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <Users className="h-6 w-6 text-primary" />
        </motion.div>
        <span className="font-bold text-xl">Connectify</span>
      </div>
      
      <motion.nav 
        className="space-y-2 flex-1"
        initial="hidden"
        animate="show"
        variants={container}
      >
        {sidebarItems.map((sidebarItem) => {
          const isActive = pathname === sidebarItem.path;
          return (
            <motion.div key={sidebarItem.name} variants={item}>
              <Link href={sidebarItem.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-primary text-primary-foreground font-medium"
                  )}
                >
                  <sidebarItem.icon className="mr-2 h-4 w-4" />
                  {sidebarItem.name}
                </Button>
              </Link>
            </motion.div>
          );
        })}
        
        <motion.div variants={item} className="mt-8">
          <Link href="/posts/new">
            <Button 
              className="w-full font-medium"
            >
              <PlusSquare className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </Link>
        </motion.div>
      </motion.nav>

      {user && (
        <div className="mt-auto pt-6 border-t border-border">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-secondary relative overflow-hidden">
              {user.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.displayName || user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <span className="text-primary font-medium">
                    {user.displayName?.[0] || user.username[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="font-medium truncate">{user.displayName || user.username}</p>
              <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            onClick={() => logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      )}
    </aside>
  );
}