'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Folder, FolderOpen, MoreHorizontal, PlusCircle, Edit, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'

interface FolderItem {
  id: string
  name: string
  type: 'folder'
  children?: FolderItem[]
  expanded?: boolean
}

// Dados de exemplo
const initialFolders: FolderItem[] = [
  {
    id: '1',
    name: 'Produção',
    type: 'folder',
    expanded: true,
    children: [
      {
        id: '1-1',
        name: 'Workflows',
        type: 'folder',
        children: [],
      },
      {
        id: '1-2',
        name: 'Queues',
        type: 'folder',
        children: [],
      },
    ],
  },
  {
    id: '2',
    name: 'Desenvolvimento',
    type: 'folder',
    children: [
      {
        id: '2-1',
        name: 'Testes',
        type: 'folder',
        children: [],
      },
    ],
  },
  {
    id: '3',
    name: 'Arquivados',
    type: 'folder',
    children: [],
  },
]

export function FolderStructure() {
  const [folders, setFolders] = useState<FolderItem[]>(initialFolders)
  const [searchTerm, setSearchTerm] = useState('')

  const toggleFolder = (folderId: string) => {
    const updateFolders = (items: FolderItem[]): FolderItem[] => {
      return items.map((item) => {
        if (item.id === folderId) {
          return { ...item, expanded: !item.expanded }
        }
        if (item.children) {
          return { ...item, children: updateFolders(item.children) }
        }
        return item
      })
    }

    setFolders(updateFolders(folders))
  }

  const renderFolderItem = (item: FolderItem, level = 0) => {
    const isExpanded = item.expanded

    return (
      <div key={item.id}>
        <div
          className={cn(
            'group flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent',
            level > 0 && 'ml-4'
          )}
        >
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleFolder(item.id)}>
            <Button variant="ghost" size="icon" className="h-5 w-5">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Folder className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm">{item.name}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Recurso
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Renomear
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isExpanded && item.children && item.children.length > 0 && (
          <div className="mt-1">{item.children.map((child) => renderFolderItem(child, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Estrutura de Folders</CardTitle>
        <div className="mt-2">
          <Input
            placeholder="Buscar folders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">{folders.map((folder) => renderFolderItem(folder))}</div>
      </CardContent>
    </Card>
  )
}
