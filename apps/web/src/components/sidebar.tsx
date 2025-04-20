'use client'

import type React from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/Button'
import { ScrollArea } from '@/components/ui/scroll-area'
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
} from 'lucide-react'
import { useState } from 'react'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r bg-background transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
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
          <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-1 px-2">
            <Link
              href="/dashboard"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                pathname === '/dashboard' ? 'bg-accent text-accent-foreground' : 'transparent'
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              {!collapsed && <span>Dashboard</span>}
            </Link>
            <Link
              href="/folders"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                pathname === '/folders' ? 'bg-accent text-accent-foreground' : 'transparent'
              )}
            >
              <FolderTree className="h-4 w-4" />
              {!collapsed && <span>Folders</span>}
            </Link>
            <Link
              href="/workflows"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                pathname === '/workflows' ? 'bg-accent text-accent-foreground' : 'transparent'
              )}
            >
              <Workflow className="h-4 w-4" />
              {!collapsed && <span>Workflows</span>}
            </Link>
            <Link
              href="/triggers"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                pathname === '/dashboard/triggers' ? 'bg-accent text-accent-foreground' : 'transparent'
              )}
            >
              <Zap className="h-4 w-4" />
              {!collapsed && <span>Triggers</span>}
            </Link>
            <Link
              href="/flows"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                pathname.startsWith('/flows') ? 'bg-accent text-accent-foreground' : 'transparent'
              )}
            >
              <PlaySquare className="h-4 w-4" />
              {!collapsed && <span>Flows</span>}
            </Link>
            <Link
              href="/queues"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                pathname === '/queues' ? 'bg-accent text-accent-foreground' : 'transparent'
              )}
            >
              <Database className="h-4 w-4" />
              {!collapsed && <span>Queues</span>}
            </Link>
            <Link
              href="/workers"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                pathname === '/workers' ? 'bg-accent text-accent-foreground' : 'transparent'
              )}
            >
              <Bot className="h-4 w-4" />
              {!collapsed && <span>Workers</span>}
            </Link>
            <Link
              href="/jobs"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                pathname === '/jobs' ? 'bg-accent text-accent-foreground' : 'transparent'
              )}
            >
              <ListTodo className="h-4 w-4" />
              {!collapsed && <span>Jobs</span>}
            </Link>
            <Link
              href="/users"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                pathname === '/users' ? 'bg-accent text-accent-foreground' : 'transparent'
              )}
            >
              <Users className="h-4 w-4" />
              {!collapsed && <span>Usuários</span>}
            </Link>
            <Link
              href="/settings"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                pathname === '/settings' ? 'bg-accent text-accent-foreground' : 'transparent'
              )}
            >
              <Settings className="h-4 w-4" />
              {!collapsed && <span>Configurações</span>}
            </Link>
          </nav>
        </ScrollArea>
      </div>
    </div>
  )
}
