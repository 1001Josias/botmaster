'use client'

import type React from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/Button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSidebarStore } from '@/lib/store/sidebar-store'
import {
  LayoutDashboard,
  Settings,
  Users,
  Workflow,
  Database,
  Bot,
  Menu,
  X,
  FolderTree,
  PlaySquare,
  ListTodo,
  Zap,
  Server,
  BarChart2,
  PenTool,
  Network,
  Webhook,
  ShoppingBag,
  Shield,
  ListCollapse,
} from 'lucide-react'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { collapsed, toggleCollapsed } = useSidebarStore()

  return (
    <div
      className={cn(
        'fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r bg-background transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <div className="border-b px-3 py-2 h-16 flex items-center justify-between">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
            <Bot className="h-6 w-6" />
            <span>BotMaster</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="flex items-center justify-center w-full">
            <Bot className="h-6 w-6" />
          </Link>
        )}
        <Button variant="ghost" size="icon" className={collapsed ? 'w-full' : 'ml-auto'} onClick={toggleCollapsed}>
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          <Link
            href="/dashboard"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname === '/dashboard' ? 'bg-accent text-accent-foreground' : 'transparent',
              collapsed && 'justify-center px-0'
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            {!collapsed && <span>Dashboard</span>}
          </Link>
          <Link
            href="/metrics"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname === '/metrics' ? 'bg-accent text-accent-foreground' : 'transparent',
              collapsed && 'justify-center px-0'
            )}
          >
            <BarChart2 className="h-4 w-4" />
            {!collapsed && <span>Metrics</span>}
          </Link>
          <Link
            href="/folders"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname === '/folders' ? 'bg-accent text-accent-foreground' : 'transparent',
              collapsed && 'justify-center px-0'
            )}
          >
            <FolderTree className="h-4 w-4" />
            {!collapsed && <span>Folders</span>}
          </Link>
          <Link
            href="/processes"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname === '/processes' ? 'bg-accent text-accent-foreground' : 'transparent',
              collapsed && 'justify-center px-0'
            )}
          >
            <Network className="h-4 w-4" />
            {!collapsed && <span>Processes</span>}
          </Link>
          <Link
            href="/workflows"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname === '/workflows' ? 'bg-accent text-accent-foreground' : 'transparent',
              collapsed && 'justify-center px-0'
            )}
          >
            <Workflow className="h-4 w-4" />
            {!collapsed && <span>Workflows</span>}
          </Link>
          <Link
            href="/workflow-editor"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname === '/workflow-editor' ? 'bg-accent text-accent-foreground' : 'transparent',
              collapsed && 'justify-center px-0'
            )}
          >
            <PenTool className="h-4 w-4" />
            {!collapsed && <span>Workflow Editor</span>}
          </Link>
          <Link
            href="/triggers"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname === '/triggers' ? 'bg-accent text-accent-foreground' : 'transparent',
              collapsed && 'justify-center px-0'
            )}
          >
            <Zap className="h-4 w-4" />
            {!collapsed && <span>Triggers</span>}
          </Link>
          <Link
            href="/flows"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname.startsWith('/flows') ? 'bg-accent text-accent-foreground' : 'transparent',
              collapsed && 'justify-center px-0'
            )}
          >
            <PlaySquare className="h-4 w-4" />
            {!collapsed && <span>Flows</span>}
          </Link>
          <Link
            href="/queues"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname === '/queues' ? 'bg-accent text-accent-foreground' : 'transparent',
              collapsed && 'justify-center px-0'
            )}
          >
            <Database className="h-4 w-4" />
            {!collapsed && <span>Queues</span>}
          </Link>
          <Link
            href="/queue-items"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname.startsWith('/queue-items') ? 'bg-accent' : 'transparent',
              collapsed ? 'justify-center' : ''
            )}
          >
            <ListCollapse className="h-5 w-5" />
            {!collapsed && <span>Queue Items</span>}
          </Link>
          <Link
            href="/workers"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname === '/workers' ? 'bg-accent text-accent-foreground' : 'transparent',
              collapsed && 'justify-center px-0'
            )}
          >
            <Bot className="h-4 w-4" />
            {!collapsed && <span>Workers</span>}
          </Link>
          <Link
            href="/machines"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname === '/machines' ? 'bg-accent text-accent-foreground' : 'transparent',
              collapsed && 'justify-center px-0'
            )}
          >
            <Server className="h-4 w-4" />
            {!collapsed && <span>Machines</span>}
          </Link>
          <Link
            href="/jobs"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname === '/jobs' ? 'bg-accent text-accent-foreground' : 'transparent',
              collapsed && 'justify-center px-0'
            )}
          >
            <ListTodo className="h-4 w-4" />
            {!collapsed && <span>Jobs</span>}
          </Link>
          <Link
            href="/webhooks"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname === '/webhooks' ? 'bg-accent' : 'transparent',
              collapsed ? 'justify-center' : ''
            )}
          >
            <Webhook className="h-5 w-5" />
            {!collapsed && <span>Webhooks</span>}
          </Link>
          <Link
            href="/marketplace"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname.startsWith('/marketplace') ? 'bg-accent' : 'transparent',
              collapsed ? 'justify-center' : ''
            )}
          >
            <ShoppingBag className="h-5 w-5" />
            {!collapsed && <span>Marketplace</span>}
          </Link>
          <Link
            href="/users"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname === '/users' ? 'bg-accent text-accent-foreground' : 'transparent',
              collapsed && 'justify-center px-0'
            )}
          >
            <Users className="h-4 w-4" />
            {!collapsed && <span>Users</span>}
          </Link>
          <Link
            href="/audit"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname === '/audit' ? 'bg-accent' : 'transparent',
              collapsed ? 'justify-center' : ''
            )}
          >
            <Shield className="h-5 w-5" />
            {!collapsed && <span>Audit Logs</span>}
          </Link>
          <Link
            href="/settings"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname === '/settings' ? 'bg-accent text-accent-foreground' : 'transparent',
              collapsed && 'justify-center px-0'
            )}
          >
            <Settings className="h-4 w-4" />
            {!collapsed && <span>Settings</span>}
          </Link>
        </nav>
      </ScrollArea>
    </div>
  )
}
