'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Folder, FolderOpen, MoreVertical, PlusCircle, Edit, Trash2, Archive, Share2, Copy, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FolderItem {
  id: string
  name: string
  type: 'folder'
  status?: 'active' | 'archived'
  resourceCount: number
  description?: string
  lastModified?: string
}

// Dados de exemplo
const folders: FolderItem[] = [
  {
    id: '1',
    name: 'Produção',
    type: 'folder',
    status: 'active',
    resourceCount: 32,
    description: 'Recursos em ambiente de produção',
    lastModified: '2 horas atrás',
  },
  {
    id: '1-1',
    name: 'Workflows',
    type: 'folder',
    status: 'active',
    resourceCount: 15,
    description: 'Workflows de produção',
    lastModified: '3 horas atrás',
  },
  {
    id: '1-2',
    name: 'Queues',
    type: 'folder',
    status: 'active',
    resourceCount: 10,
    description: 'Filas de processamento',
    lastModified: '5 horas atrás',
  },
  {
    id: '1-3',
    name: 'Workers',
    type: 'folder',
    status: 'active',
    resourceCount: 7,
    description: 'Workers de processamento',
    lastModified: '1 dia atrás',
  },
  {
    id: '2',
    name: 'Desenvolvimento',
    type: 'folder',
    status: 'active',
    resourceCount: 45,
    description: 'Recursos em desenvolvimento',
    lastModified: '30 minutos atrás',
  },
  {
    id: '2-1',
    name: 'Testes',
    type: 'folder',
    status: 'active',
    resourceCount: 20,
    description: 'Ambiente de testes',
    lastModified: '1 hora atrás',
  },
  {
    id: '3',
    name: 'Arquivados',
    type: 'folder',
    status: 'archived',
    resourceCount: 10,
    description: 'Recursos arquivados',
    lastModified: '1 mês atrás',
  },
]

interface FoldersGridProps {
  onSelectFolder: (folderId: string | null) => void
  selectedFolder: string | null
}

export function FoldersGrid({ onSelectFolder, selectedFolder }: FoldersGridProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredFolders = folders.filter(
    (folder) =>
      folder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (folder.description && folder.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar folders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
        {filteredFolders.map((folder) => (
          <Card
            key={folder.id}
            className={cn(
              'cursor-pointer hover:border-primary/50 transition-colors',
              selectedFolder === folder.id && 'border-primary'
            )}
            onClick={() => onSelectFolder(folder.id)}
          >
            <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
              <div className="flex items-center gap-2">
                {folder.status === 'archived' ? (
                  <Folder className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <FolderOpen className="h-5 w-5 text-blue-500" />
                )}
                <CardTitle className="text-base">{folder.name}</CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Subfolder
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Renomear
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartilhar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {folder.status !== 'archived' ? (
                    <DropdownMenuItem>
                      <Archive className="mr-2 h-4 w-4" />
                      Arquivar
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>
                      <FolderOpen className="mr-2 h-4 w-4" />
                      Restaurar
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-sm text-muted-foreground">{folder.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Badge variant="outline">{folder.resourceCount} recursos</Badge>
              <span className="text-xs text-muted-foreground">Modificado {folder.lastModified}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
