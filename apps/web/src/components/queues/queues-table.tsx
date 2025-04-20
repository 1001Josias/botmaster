'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreVertical, Edit, Trash2, BarChart, Pause, Play } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

const queues = [
  {
    id: 'Q-001',
    name: 'Processamento de Emails',
    folder: 'Produção',
    status: 'active',
    pending: 12,
    processed: 4582,
    failed: 8,
    load: 25,
  },
  {
    id: 'Q-002',
    name: 'Notificações Push',
    folder: 'Produção',
    status: 'active',
    pending: 45,
    processed: 12450,
    failed: 21,
    load: 65,
  },
  {
    id: 'Q-003',
    name: 'Processamento de Pagamentos',
    folder: 'Produção',
    status: 'paused',
    pending: 0,
    processed: 3254,
    failed: 5,
    load: 0,
  },
  {
    id: 'Q-004',
    name: 'Importação de Dados',
    folder: 'Desenvolvimento',
    status: 'error',
    pending: 156,
    processed: 4235,
    failed: 8,
    load: 85,
  },
]

export function QueuesTable() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Ativa
          </Badge>
        )
      case 'paused':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pausada
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

  const getLoadColor = (load: number) => {
    if (load < 30) return 'bg-green-500'
    if (load < 70) return 'bg-yellow-500'
    return 'bg-red-500'
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
      <CardHeader>
        <CardTitle>Filas de Processamento</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Folder</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Pendentes</TableHead>
              <TableHead className="text-right">Processadas</TableHead>
              <TableHead className="text-right">Falhas</TableHead>
              <TableHead>Carga</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queues.map((queue) => (
              <TableRow key={queue.id}>
                <TableCell className="font-medium">{queue.name}</TableCell>
                <TableCell>{queue.folder}</TableCell>
                <TableCell>{getStatusBadge(queue.status)}</TableCell>
                <TableCell className="text-right">{queue.pending}</TableCell>
                <TableCell className="text-right">{queue.processed.toLocaleString()}</TableCell>
                <TableCell className="text-right">{queue.failed}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={queue.load} className={getLoadColor(queue.load)} />
                    <span className="text-xs">{queue.load}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {getActionButton(queue.status)}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <BarChart className="h-4 w-4" />
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
      </CardContent>
    </Card>
  )
}
