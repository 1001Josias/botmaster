'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/Button'
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
  FileText,
  RotateCcw,
  StopCircle,
  Workflow,
  ArrowUpRight,
  Clock,
  ExternalLink,
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'

// Dados de exemplo
const flows = [
  {
    id: 'FLOW-001',
    name: 'Processamento de Pedido #789',
    workflow: 'Processamento de Pedidos',
    status: 'completed',
    duration: '1m 12s',
    jobCount: 8,
    completedJobs: 8,
    startedAt: '2023-03-15T14:30:00',
    completedAt: '2023-03-15T14:31:12',
    progress: 100,
  },
  {
    id: 'FLOW-002',
    name: 'Integração com ERP #123',
    workflow: 'Integração ERP',
    status: 'running',
    duration: '45s',
    jobCount: 6,
    completedJobs: 3,
    startedAt: '2023-03-15T14:31:00',
    completedAt: null,
    progress: 50,
  },
  {
    id: 'FLOW-003',
    name: 'Geração de Relatório Mensal',
    workflow: 'Relatórios',
    status: 'failed',
    duration: '2m 15s',
    jobCount: 5,
    completedJobs: 3,
    startedAt: '2023-03-15T14:29:00',
    completedAt: '2023-03-15T14:31:15',
    progress: 60,
  },
  {
    id: 'FLOW-004',
    name: 'Processamento de Pagamento #456',
    workflow: 'Processamento de Pagamentos',
    status: 'completed',
    duration: '35s',
    jobCount: 4,
    completedJobs: 4,
    startedAt: '2023-03-15T14:28:00',
    completedAt: '2023-03-15T14:28:35',
    progress: 100,
  },
  {
    id: 'FLOW-005',
    name: 'Sincronização de Estoque',
    workflow: 'Sincronização de Dados',
    status: 'running',
    duration: '1m 30s',
    jobCount: 7,
    completedJobs: 5,
    startedAt: '2023-03-15T14:30:30',
    completedAt: null,
    progress: 71,
  },
  {
    id: 'FLOW-006',
    name: 'Envio de Emails Marketing',
    workflow: 'Campanhas de Email',
    status: 'completed',
    duration: '3m 45s',
    jobCount: 12,
    completedJobs: 12,
    startedAt: '2023-03-15T14:25:00',
    completedAt: '2023-03-15T14:28:45',
    progress: 100,
  },
  {
    id: 'FLOW-007',
    name: 'Backup de Dados',
    workflow: 'Backup Automático',
    status: 'completed',
    duration: '5m 20s',
    jobCount: 3,
    completedJobs: 3,
    startedAt: '2023-03-15T14:20:00',
    completedAt: '2023-03-15T14:25:20',
    progress: 100,
  },
]

export function FlowsList() {
  const [page, setPage] = useState(1)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Concluído
          </Badge>
        )
      case 'running':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Em Execução
          </Badge>
        )
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Falha
          </Badge>
        )
      default:
        return null
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
      second: '2-digit',
    }).format(date)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Flows</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Workflow</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progresso</TableHead>
              <TableHead>Jobs</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Iniciado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flows.map((flow) => (
              <TableRow key={flow.id}>
                <TableCell className="font-mono text-xs">{flow.id}</TableCell>
                <TableCell className="font-medium">{flow.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-blue-500" />
                    <span>{flow.workflow}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(flow.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={flow.progress} className="w-[60px]" />
                    <span className="text-xs">{flow.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs">
                    {flow.completedJobs}/{flow.jobCount}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-4 text-muted-foreground" />
                    <span>{flow.duration}</span>
                  </div>
                </TableCell>
                <TableCell>{formatDate(flow.startedAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/dashboard/flows/${flow.id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                    {flow.status === 'running' && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <StopCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {flow.status === 'failed' && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/flows/${flow.id}`}>
                            <FileText className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowUpRight className="mr-2 h-4 w-4" />
                          Ver Workflow
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
