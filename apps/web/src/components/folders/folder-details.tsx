'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FolderOpen, Calendar, Users, Star, StarOff, Share2, Edit, Trash2, MoreHorizontal, Archive } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'

// Dados de exemplo
const folderData: Record<
  string,
  {
    id: string
    name: string
    description: string
    createdAt: string
    updatedAt: string
    createdBy: string
    resourceCount: number
    status: string
    path: string
  }
> = {
  'folder-0': {
    id: 'folder-0',
    name: 'Produção',
    description: 'Recursos em ambiente de produção',
    createdAt: '2023-01-15T10:30:00',
    updatedAt: '2023-03-15T14:45:00',
    createdBy: 'João Silva',
    resourceCount: 32,
    status: 'active',
    path: '/Produção',
  },
  'folder-1': {
    id: 'folder-1',
    name: 'Desenvolvimento',
    description: 'Recursos em ambiente de desenvolvimento',
    createdAt: '2023-01-20T11:15:00',
    updatedAt: '2023-03-14T16:30:00',
    createdBy: 'Maria Oliveira',
    resourceCount: 45,
    status: 'active',
    path: '/Desenvolvimento',
  },
  'folder-2': {
    id: 'folder-2',
    name: 'Workflows',
    description: 'Workflows de produção',
    createdAt: '2023-01-25T09:45:00',
    updatedAt: '2023-03-13T10:20:00',
    createdBy: 'Pedro Santos',
    resourceCount: 15,
    status: 'active',
    path: '/Produção/Workflows',
  },
  'folder-3': {
    id: 'folder-3',
    name: 'Testes',
    description: 'Ambiente de testes',
    createdAt: '2023-02-05T14:20:00',
    updatedAt: '2023-03-10T11:30:00',
    createdBy: 'Ana Costa',
    resourceCount: 20,
    status: 'active',
    path: '/Desenvolvimento/Testes',
  },
}

interface FolderDetailsProps {
  folderId: string
}

export function FolderDetails({ folderId }: FolderDetailsProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const folder = folderData[folderId] || {
    id: folderId,
    name: 'Folder não encontrado',
    description: '',
    createdAt: '',
    updatedAt: '',
    createdBy: '',
    resourceCount: 0,
    status: 'unknown',
    path: '/',
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FolderOpen className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-semibold">{folder.name}</h2>
              <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                {folder.status === 'active' ? 'Ativo' : 'Arquivado'}
              </Badge>
            </div>

            <p className="text-muted-foreground mb-4">{folder.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Criado em:</span>
                <span>{formatDate(folder.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Modificado em:</span>
                <span>{formatDate(folder.updatedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Criado por:</span>
                <span>{folder.createdBy}</span>
              </div>
              <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Caminho:</span>
                <span className="font-mono text-xs">{folder.path}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" onClick={() => setIsFavorite(!isFavorite)}>
              {isFavorite ? (
                <>
                  <StarOff className="h-4 w-4 mr-2" />
                  Remover favorito
                </>
              ) : (
                <>
                  <Star className="h-4 w-4 mr-2" />
                  Adicionar favorito
                </>
              )}
            </Button>

            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  Mais ações
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar folder
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive className="h-4 w-4 mr-2" />
                  Arquivar folder
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir folder
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
