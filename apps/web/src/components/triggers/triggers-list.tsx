'use client'

import { useState, useEffect, useCallback } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  MoreVertical,
  Edit,
  Trash2,
  Zap,
  Clock,
  Globe,
  Calendar,
  Database,
  PlayCircle,
  PauseCircle,
  BarChart2,
  Workflow,
  ArrowUpRight,
  Bot,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { triggersApi, type Trigger, type PaginatedTriggers, type GetTriggersQuery } from '@/lib/api/triggers'

interface TriggersListProps {
  filters?: {
    search: string
    type: string
  }
}

export function TriggersList({ filters }: TriggersListProps) {
  const [triggers, setTriggers] = useState<PaginatedTriggers | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  const fetchTriggers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const query: GetTriggersQuery = { 
        page, 
        limit,
        ...(filters?.search && { search: filters.search }),
        ...(filters?.type && { type: filters.type as any }),
      }
      
      const data = await triggersApi.getTriggers(query)
      setTriggers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch triggers')
      console.error('Failed to fetch triggers:', err)
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  useEffect(() => {
    fetchTriggers()
  }, [fetchTriggers])

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [filters])

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'schedule':
        return <Calendar className="h-4 w-4 text-blue-500" />
      case 'webhook':
        return <Globe className="h-4 w-4 text-purple-500" />
      case 'event':
        return <Zap className="h-4 w-4 text-orange-500" />
      case 'data':
        return <Database className="h-4 w-4 text-green-500" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case 'schedule':
        return 'Agendamento'
      case 'webhook':
        return 'Webhook'
      case 'event':
        return 'Evento'
      case 'data':
        return 'Condição de Dados'
      default:
        return type
    }
  }

  const formatDate = (dateString: string | null | undefined) => {
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

  const formatConfiguration = (trigger: Trigger) => {
    switch (trigger.type) {
      case 'schedule':
        if (trigger.cronExpression) {
          return (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm font-mono">{trigger.cronExpression}</span>
            </div>
          )
        }
        if (trigger.scheduleFrequency) {
          return (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">{trigger.scheduleFrequency}</span>
            </div>
          )
        }
        break
      case 'webhook':
        return (
          <div className="flex items-center gap-1">
            <Globe className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-mono">{trigger.webhookEndpoint}</span>
          </div>
        )
      case 'event':
        return (
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-mono">{trigger.eventSource}.{trigger.eventName}</span>
          </div>
        )
      case 'data':
        return (
          <div className="flex items-center gap-1">
            <Database className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-mono">{trigger.dataCondition}</span>
          </div>
        )
    }
    return '-'
  }

  const handleToggleStatus = async (trigger: Trigger) => {
    try {
      const newStatus = !trigger.isActive
      await triggersApi.toggleTriggerStatus(trigger.id, newStatus)
      toast.success(`Trigger ${newStatus ? 'ativado' : 'desativado'} com sucesso`)
      fetchTriggers() // Refresh the list
    } catch (err) {
      toast.error('Erro ao alterar status do trigger')
      console.error('Failed to toggle trigger status:', err)
    }
  }

  const handleExecuteTrigger = async (trigger: Trigger) => {
    try {
      const result = await triggersApi.executeTrigger(trigger.id)
      toast.success(result.message)
      fetchTriggers() // Refresh to update execution count
    } catch (err) {
      toast.error('Erro ao executar trigger')
      console.error('Failed to execute trigger:', err)
    }
  }

  const handleDeleteTrigger = async (trigger: Trigger) => {
    if (!confirm(`Tem certeza que deseja excluir o trigger "${trigger.name}"?`)) {
      return
    }

    try {
      await triggersApi.deleteTrigger(trigger.id)
      toast.success('Trigger excluído com sucesso')
      fetchTriggers() // Refresh the list
    } catch (err) {
      toast.error('Erro ao excluir trigger')
      console.error('Failed to delete trigger:', err)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lista de Triggers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Carregando triggers...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lista de Triggers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Erro ao carregar triggers: {error}
              </p>
              <Button variant="outline" className="mt-2" onClick={fetchTriggers}>
                Tentar novamente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!triggers || triggers.data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lista de Triggers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Zap className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhum trigger encontrado
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Triggers ({triggers.pagination.total})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Configuração</TableHead>
              <TableHead>Última Execução</TableHead>
              <TableHead>Próxima Execução</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {triggers.data.map((trigger) => (
              <TableRow key={trigger.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">TRG-{trigger.id.toString().padStart(3, '0')}</span>
                    <span>{trigger.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(trigger.type)}
                    <span>{getTypeName(trigger.type)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {trigger.targetType === 'workflow' ? (
                      <>
                        <Workflow className="h-4 w-4 text-blue-500" />
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <Link href={`/workflows/${trigger.workflowId}`}>
                            <span className="flex items-center gap-1">
                              {trigger.workflowId}
                              <ArrowUpRight className="h-3 w-3" />
                            </span>
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4 text-orange-500" />
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <Link href={`/workers/${trigger.workerId}`}>
                            <span className="flex items-center gap-1">
                              {trigger.workerId}
                              <ArrowUpRight className="h-3 w-3" />
                            </span>
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={trigger.isActive}
                      onCheckedChange={() => handleToggleStatus(trigger)}
                    />
                    {getStatusBadge(trigger.status)}
                  </div>
                </TableCell>
                <TableCell>
                  {formatConfiguration(trigger)}
                </TableCell>
                <TableCell>{formatDate(trigger.lastRunAt)}</TableCell>
                <TableCell>{formatDate(trigger.nextRunAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {trigger.isActive ? (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleToggleStatus(trigger)}
                      >
                        <PauseCircle className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleToggleStatus(trigger)}
                      >
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <BarChart2 className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/triggers/${trigger.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExecuteTrigger(trigger)}>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Executar Agora
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteTrigger(trigger)}
                        >
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
        
        {triggers.pagination.totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setPage(Math.max(1, page - 1))}
                    className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, triggers.pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink 
                        onClick={() => setPage(pageNum)}
                        isActive={page === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}
                
                {triggers.pagination.totalPages > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setPage(Math.min(triggers.pagination.totalPages, page + 1))}
                    className={page === triggers.pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
