'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Play, Pause, MoreVertical, Edit, Copy, Trash2, FileText, Search } from 'lucide-react'

// Dados de exemplo
const workflows = [
  {
    id: 'WF-001',
    name: 'Processamento de Pedidos',
    folder: 'Produção',
    status: 'active',
    lastRun: '2023-03-15T14:30:00',
    executions: 1245,
    avgDuration: '45s',
  },
  {
    id: 'WF-002',
    name: 'Sincronização de Estoque',
    folder: 'Produção',
    status: 'active',
    lastRun: '2023-03-15T13:15:00',
    executions: 890,
    avgDuration: '1m 20s',
  },
  {
    id: 'WF-003',
    name: 'Envio de Relatórios Diários',
    folder: 'Produção',
    status: 'paused',
    lastRun: '2023-03-14T23:00:00',
    executions: 365,
    avgDuration: '2m 10s',
  },
  {
    id: 'WF-004',
    name: 'Integração com CRM',
    folder: 'Desenvolvimento',
    status: 'error',
    lastRun: '2023-03-15T10:45:00',
    executions: 56,
    avgDuration: '1m 5s',
  },
  {
    id: 'WF-005',
    name: 'Backup de Dados',
    folder: 'Produção',
    status: 'active',
    lastRun: '2023-03-15T12:00:00',
    executions: 730,
    avgDuration: '5m 30s',
  },
]

export function WorkflowsList() {
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Ativo
          </Badge>
        )
      case 'paused':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pausado
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
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const getActionButton = (status: string) => {
    if (status === 'active') {
      return (
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pause className="h-4 w-4" />
        </Button>
      )
    }
    return (
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Play className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Lista de Workflows</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar workflows..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Folder</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Última Execução</TableHead>
              <TableHead className="text-right">Execuções</TableHead>
              <TableHead>Duração Média</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflows.map((workflow) => (
              <TableRow key={workflow.id}>
                <TableCell className="font-medium">{workflow.name}</TableCell>
                <TableCell>{workflow.folder}</TableCell>
                <TableCell>{getStatusBadge(workflow.status)}</TableCell>
                <TableCell>{formatDate(workflow.lastRun)}</TableCell>
                <TableCell className="text-right">{workflow.executions.toLocaleString()}</TableCell>
                <TableCell>{workflow.avgDuration}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {getActionButton(workflow.status)}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <FileText className="h-4 w-4" />
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
      </CardContent>
    </Card>
  )
}
