'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Workflow,
  Database,
  Bot,
  Plus,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  MoveRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  List,
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

// Dados de exemplo
const resourcesData: Record<
  string,
  {
    id: string
    name: string
    type: string
    status: string
    lastRun: string
    executions: number
    avgDuration: string
  }[]
> = {
  'folder-0': [
    {
      id: 'r1',
      name: 'Processamento de Pedidos',
      type: 'workflow',
      status: 'active',
      lastRun: '2023-03-15T14:30:00',
      executions: 1245,
      avgDuration: '45s',
    },
    {
      id: 'r2',
      name: 'Fila de Emails',
      type: 'queue',
      status: 'active',
      lastRun: '2023-03-15T13:15:00',
      executions: 890,
      avgDuration: '1.2s',
    },
    {
      id: 'r3',
      name: 'Worker de Notificações',
      type: 'worker',
      status: 'inactive',
      lastRun: '2023-03-14T23:00:00',
      executions: 365,
      avgDuration: '2.1s',
    },
    {
      id: 'r4',
      name: 'Processamento de Pagamentos',
      type: 'workflow',
      status: 'active',
      lastRun: '2023-03-15T12:45:00',
      executions: 780,
      avgDuration: '1.5s',
    },
    {
      id: 'r5',
      name: 'Fila de Processamento',
      type: 'queue',
      status: 'active',
      lastRun: '2023-03-15T11:30:00',
      executions: 650,
      avgDuration: '0.8s',
    },
  ],
  'folder-1': [
    {
      id: 'r6',
      name: 'Workflow de Teste',
      type: 'workflow',
      status: 'active',
      lastRun: '2023-03-15T10:30:00',
      executions: 120,
      avgDuration: '1.8s',
    },
    {
      id: 'r7',
      name: 'Fila de Testes',
      type: 'queue',
      status: 'active',
      lastRun: '2023-03-15T09:45:00',
      executions: 85,
      avgDuration: '0.9s',
    },
    {
      id: 'r8',
      name: 'Worker de Desenvolvimento',
      type: 'worker',
      status: 'active',
      lastRun: '2023-03-15T08:30:00',
      executions: 65,
      avgDuration: '1.2s',
    },
  ],
  'folder-2': [
    {
      id: 'r9',
      name: 'Workflow de Pedidos',
      type: 'workflow',
      status: 'active',
      lastRun: '2023-03-15T14:30:00',
      executions: 1245,
      avgDuration: '45s',
    },
    {
      id: 'r10',
      name: 'Workflow de Faturamento',
      type: 'workflow',
      status: 'active',
      lastRun: '2023-03-15T13:15:00',
      executions: 890,
      avgDuration: '1.2s',
    },
    {
      id: 'r11',
      name: 'Workflow de Envio',
      type: 'workflow',
      status: 'error',
      lastRun: '2023-03-14T23:00:00',
      executions: 365,
      avgDuration: '2.1s',
    },
  ],
  'folder-3': [
    {
      id: 'r12',
      name: 'Workflow de Teste A',
      type: 'workflow',
      status: 'active',
      lastRun: '2023-03-15T10:30:00',
      executions: 120,
      avgDuration: '1.8s',
    },
    {
      id: 'r13',
      name: 'Workflow de Teste B',
      type: 'workflow',
      status: 'inactive',
      lastRun: '2023-03-15T09:45:00',
      executions: 85,
      avgDuration: '0.9s',
    },
    {
      id: 'r14',
      name: 'Worker de Teste',
      type: 'worker',
      status: 'active',
      lastRun: '2023-03-15T08:30:00',
      executions: 65,
      avgDuration: '1.2s',
    },
  ],
}

interface FolderResourcesProps {
  folderId: string
}

export function FolderResources({ folderId }: FolderResourcesProps) {
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const resources = resourcesData[folderId] || []

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = activeTab === 'all' || resource.type === activeTab
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'inactive':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
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
      <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-4">
        <CardTitle>Recursos</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar recursos..."
              className="pl-8 w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="bg-muted rounded-md p-1 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className={cn('h-8 w-8 p-0', viewMode === 'grid' && 'bg-background shadow-sm')}
              onClick={() => setViewMode('grid')}
            >
              <Database className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn('h-8 w-8 p-0', viewMode === 'list' && 'bg-background shadow-sm')}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Recurso
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="workflow">Workflows</TabsTrigger>
            <TabsTrigger value="queue">Queues</TabsTrigger>
            <TabsTrigger value="worker">Workers</TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredResources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhum recurso encontrado</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Não encontramos recursos que correspondam aos seus critérios de busca.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('')
                setActiveTab('all')
              }}
            >
              Limpar filtros
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getResourceIcon(resource.type)}
                      <h3 className="font-medium">{resource.name}</h3>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MoveRight className="mr-2 h-4 w-4" />
                          Mover
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    {getStatusIcon(resource.status)}
                    {getStatusBadge(resource.status)}
                    <span className="text-xs text-muted-foreground ml-auto">
                      Última execução: {formatDate(resource.lastRun)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <span className="text-muted-foreground">Execuções:</span>
                      <span className="font-medium">{resource.executions.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <span className="text-muted-foreground">Duração média:</span>
                      <span className="font-medium">{resource.avgDuration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Execução</TableHead>
                  <TableHead className="text-right">Execuções</TableHead>
                  <TableHead>Duração Média</TableHead>
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
                    <TableCell>{formatDate(resource.lastRun)}</TableCell>
                    <TableCell className="text-right">{resource.executions.toLocaleString()}</TableCell>
                    <TableCell>{resource.avgDuration}</TableCell>
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
                              <MoreHorizontal className="h-4 w-4" />
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
          </div>
        )}
      </CardContent>
    </Card>
  )
}
