'use client'

import { useState } from 'react'
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
} from 'lucide-react'
import Link from 'next/link'
import { Switch } from '@/components/ui/switch'

const triggers = [
  {
    id: 'TRG-001',
    name: 'Relatório Diário',
    type: 'schedule',
    targetType: 'workflow',
    workflow: 'Geração de Relatórios',
    workflowId: 'WF-003',
    status: 'active',
    schedule: '0 8 * * 1-5', // Cron expression: 8:00 AM de segunda a sexta
    lastRun: '2023-03-15T08:00:00',
    nextRun: '2023-03-16T08:00:00',
    executionCount: 245,
  },
  {
    id: 'TRG-002',
    name: 'Webhook de Pagamento',
    type: 'webhook',
    targetType: 'workflow',
    workflow: 'Processamento de Pagamentos',
    workflowId: 'WF-004',
    status: 'active',
    endpoint: '/api/webhooks/payment',
    lastRun: '2023-03-15T14:25:00',
    nextRun: null,
    executionCount: 1245,
  },
  {
    id: 'TRG-003',
    name: 'Monitoramento de Estoque',
    type: 'data',
    targetType: 'worker',
    worker: 'Estoque Worker',
    workerId: 'W-002',
    status: 'active',
    condition: 'quantity < threshold',
    lastRun: '2023-03-15T10:15:00',
    nextRun: null,
    executionCount: 56,
  },
  {
    id: 'TRG-004',
    name: 'Backup Semanal',
    type: 'schedule',
    targetType: 'workflow',
    workflow: 'Backup de Dados',
    workflowId: 'WF-007',
    status: 'active',
    schedule: '0 0 * * 0', // Cron expression: meia-noite de domingo
    lastRun: '2023-03-12T00:00:00',
    nextRun: '2023-03-19T00:00:00',
    executionCount: 52,
  },
  {
    id: 'TRG-005',
    name: 'Evento de Novo Usuário',
    type: 'event',
    targetType: 'worker',
    worker: 'Notificação Worker',
    workerId: 'W-003',
    status: 'inactive',
    event: 'user.created',
    lastRun: '2023-03-14T16:45:00',
    nextRun: null,
    executionCount: 328,
  },
  {
    id: 'TRG-006',
    name: 'Sincronização com CRM',
    type: 'schedule',
    targetType: 'workflow',
    workflow: 'Integração CRM',
    workflowId: 'WF-004',
    status: 'active',
    schedule: '*/30 * * * *', // Cron expression: a cada 30 minutos
    lastRun: '2023-03-15T14:30:00',
    nextRun: '2023-03-15T15:00:00',
    executionCount: 4562,
  },
  {
    id: 'TRG-007',
    name: 'Alerta de Temperatura',
    type: 'data',
    targetType: 'worker',
    worker: 'Alerta Worker',
    workerId: 'W-005',
    status: 'active',
    condition: 'temperature > 30',
    lastRun: '2023-03-15T13:12:00',
    nextRun: null,
    executionCount: 18,
  },
]

export function TriggersList() {
  const [page, setPage] = useState(1)

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

  const formatDate = (dateString: string | null) => {
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

  const formatSchedule = (schedule: string) => {
    // Simplificação para exibição - em uma aplicação real, você pode usar uma biblioteca para converter cron para texto legível
    const cronMap: Record<string, string> = {
      '0 8 * * 1-5': 'Diariamente às 8:00 (Seg-Sex)',
      '0 0 * * 0': 'Semanalmente aos domingos à meia-noite',
      '*/30 * * * *': 'A cada 30 minutos',
    }

    return cronMap[schedule] || schedule
  }

  const toggleTriggerStatus = (triggerId: string) => {
    // Em uma aplicação real, isso enviaria uma requisição para a API
    console.log(`Alterando status do trigger ${triggerId}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Triggers</CardTitle>
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
            {triggers.map((trigger) => (
              <TableRow key={trigger.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{trigger.id}</span>
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
                          <Link href={`/dashboard/workflows/${trigger.workflowId}`}>
                            <span className="flex items-center gap-1">
                              {trigger.workflow}
                              <ArrowUpRight className="h-3 w-3" />
                            </span>
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4 text-orange-500" />
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <Link href={`/dashboard/workers/${trigger.workerId}`}>
                            <span className="flex items-center gap-1">
                              {trigger.worker}
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
                      checked={trigger.status === 'active'}
                      onCheckedChange={() => toggleTriggerStatus(trigger.id)}
                    />
                    {getStatusBadge(trigger.status)}
                  </div>
                </TableCell>
                <TableCell>
                  {trigger.type === 'schedule' && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{formatSchedule(trigger.schedule || '')}</span>
                    </div>
                  )}
                  {trigger.type === 'webhook' && (
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-mono">{trigger.endpoint}</span>
                    </div>
                  )}
                  {trigger.type === 'event' && (
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-mono">{trigger.event}</span>
                    </div>
                  )}
                  {trigger.type === 'data' && (
                    <div className="flex items-center gap-1">
                      <Database className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-mono">{trigger.condition}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>{formatDate(trigger.lastRun)}</TableCell>
                <TableCell>{formatDate(trigger.nextRun)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {trigger.status === 'active' ? (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <PauseCircle className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
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
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Executar Agora
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
      </CardContent>
    </Card>
  )
}
