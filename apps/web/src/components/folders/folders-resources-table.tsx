'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Workflow,
  Database,
  Bot,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  MoveRight,
  Search,
  Plus,
  Folder,
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface Resource {
  id: string
  name: string
  type: 'workflow' | 'queue' | 'worker'
  status: 'active' | 'inactive' | 'error'
  createdAt: string
  updatedAt: string
}

// Dados de exemplo
const resources: Record<string, Resource[]> = {
  '1': [
    {
      id: 'r1',
      name: 'Processamento de Pedidos',
      type: 'workflow',
      status: 'active',
      createdAt: '2023-01-15',
      updatedAt: '2023-03-10',
    },
    {
      id: 'r2',
      name: 'Fila de Emails',
      type: 'queue',
      status: 'active',
      createdAt: '2023-01-20',
      updatedAt: '2023-03-05',
    },
    {
      id: 'r3',
      name: 'Worker de Notificações',
      type: 'worker',
      status: 'inactive',
      createdAt: '2023-02-01',
      updatedAt: '2023-02-28',
    },
  ],
  '1-1': [
    {
      id: 'r4',
      name: 'Workflow de Pedidos',
      type: 'workflow',
      status: 'active',
      createdAt: '2023-01-10',
      updatedAt: '2023-03-15',
    },
    {
      id: 'r5',
      name: 'Workflow de Faturamento',
      type: 'workflow',
      status: 'active',
      createdAt: '2023-01-12',
      updatedAt: '2023-03-12',
    },
  ],
  '1-2': [
    {
      id: 'r6',
      name: 'Fila de Processamento',
      type: 'queue',
      status: 'active',
      createdAt: '2023-01-05',
      updatedAt: '2023-03-01',
    },
    {
      id: 'r7',
      name: 'Fila de Notificações',
      type: 'queue',
      status: 'error',
      createdAt: '2023-01-08',
      updatedAt: '2023-02-20',
    },
  ],
  '2': [
    {
      id: 'r8',
      name: 'Workflow de Teste',
      type: 'workflow',
      status: 'inactive',
      createdAt: '2023-02-10',
      updatedAt: '2023-03-05',
    },
    {
      id: 'r9',
      name: 'Worker de Teste',
      type: 'worker',
      status: 'active',
      createdAt: '2023-02-15',
      updatedAt: '2023-03-10',
    },
  ],
}

interface FoldersResourcesTableProps {
  selectedFolder: string | null
}

export function FoldersResourcesTable({ selectedFolder }: FoldersResourcesTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [resourceType, setResourceType] = useState('all')

  const folderResources = selectedFolder && resources[selectedFolder] ? resources[selectedFolder] : []

  const filteredResources = folderResources.filter((resource) => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = resourceType === 'all' || resource.type === resourceType
    return matchesSearch && matchesType
  })

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'workflow':
        return <Workflow className="h-4 w-4 text-blue-500" />
      case 'queue':
        return <Database className="h-4 w-4 text-purple-500" />
      case 'worker':
        return <Bot className="h-4 w-4 text-orange-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Ativo
          </Badge>
        )
      case 'inactive':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Inativo
          </Badge>
        )
      case 'error':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Erro
          </Badge>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Recursos do Folder</CardTitle>
            <CardDescription>
              {selectedFolder
                ? `Gerenciando recursos ${filteredResources.length > 0 ? `(${filteredResources.length})` : ''}`
                : 'Selecione um folder para visualizar seus recursos'}
            </CardDescription>
          </div>
          {selectedFolder && (
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar recursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full sm:w-[250px]"
                />
              </div>
              <Select value={resourceType} onValueChange={setResourceType}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Tipo de recurso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="workflow">Workflows</SelectItem>
                  <SelectItem value="queue">Queues</SelectItem>
                  <SelectItem value="worker">Workers</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Recurso
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {selectedFolder ? (
          filteredResources.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Atualizado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getResourceIcon(resource.type)}
                          {resource.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {resource.type === 'workflow' && 'Workflow'}
                          {resource.type === 'queue' && 'Queue'}
                          {resource.type === 'worker' && 'Worker'}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(resource.status)}</TableCell>
                      <TableCell>{formatDate(resource.createdAt)}</TableCell>
                      <TableCell>{formatDate(resource.updatedAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoveRight className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Folder className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Nenhum recurso encontrado</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Este folder não possui recursos ou nenhum recurso corresponde aos filtros aplicados.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Recurso
              </Button>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <Folder className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum folder selecionado</h3>
            <p className="text-sm text-muted-foreground">
              Selecione um folder na árvore ou no grid para visualizar seus recursos.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
