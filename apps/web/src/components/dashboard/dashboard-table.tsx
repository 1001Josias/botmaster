'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, Play, AlertTriangle, XCircle, Clock, ExternalLink, MoreHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Dados de exemplo
const recentJobs = [
  {
    id: 'JOB-1234',
    name: 'Processamento de Pedidos #789',
    status: 'success',
    duration: '45s',
    startTime: new Date(2023, 2, 15, 14, 30, 0),
    workflow: 'Processamento de Pedidos',
    worker: 'Processing Worker',
  },
  {
    id: 'JOB-1233',
    name: 'Envio de Email #456',
    status: 'running',
    duration: '12s',
    startTime: new Date(2023, 2, 15, 14, 28, 0),
    workflow: 'Notificações',
    worker: 'Email Worker',
  },
  {
    id: 'JOB-1232',
    name: 'Sincronização de Estoque',
    status: 'failed',
    duration: '1m 20s',
    startTime: new Date(2023, 2, 15, 14, 25, 0),
    workflow: 'Sincronização de Dados',
    worker: 'Data Worker',
  },
  {
    id: 'JOB-1231',
    name: 'Geração de Relatório Mensal',
    status: 'success',
    duration: '2m 15s',
    startTime: new Date(2023, 2, 15, 14, 20, 0),
    workflow: 'Relatórios',
    worker: 'Report Worker',
  },
  {
    id: 'JOB-1230',
    name: 'Backup de Dados',
    status: 'success',
    duration: '5m 30s',
    startTime: new Date(2023, 2, 15, 14, 15, 0),
    workflow: 'Backup Automático',
    worker: 'Backup Worker',
  },
  {
    id: 'JOB-1229',
    name: 'Processamento de Pagamento #123',
    status: 'canceled',
    duration: '10s',
    startTime: new Date(2023, 2, 15, 14, 10, 0),
    workflow: 'Processamento de Pagamentos',
    worker: 'Payment Worker',
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'running':
      return <Play className="h-4 w-4 text-blue-500" />
    case 'failed':
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    case 'canceled':
      return <XCircle className="h-4 w-4 text-amber-500" />
    default:
      return null
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'success':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Sucesso
        </Badge>
      )
    case 'running':
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Em andamento
        </Badge>
      )
    case 'failed':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Falha
        </Badge>
      )
    case 'canceled':
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          Cancelado
        </Badge>
      )
    default:
      return null
  }
}

export function DashboardTable() {
  const [activeTab, setActiveTab] = useState('jobs')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-1/3 rounded-md bg-muted animate-pulse"></div>
          <div className="h-4 w-1/2 rounded-md bg-muted animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 w-full rounded-md bg-muted animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <Tabs defaultValue="jobs" value={activeTab} onValueChange={setActiveTab}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="jobs">Jobs Recentes</TabsTrigger>
              <TabsTrigger value="flows">Flows Recentes</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" className="h-8">
              <ExternalLink className="mr-2 h-3.5 w-3.5" />
              Ver todos
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="jobs" className="m-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Início</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentJobs.map((job) => (
                  <TableRow key={job.id} className="group">
                    <TableCell>
                      <div>
                        <div className="font-medium group-hover:text-primary transition-colors">{job.name}</div>
                        <div className="text-xs text-muted-foreground">{job.workflow}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        {getStatusBadge(job.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{job.duration}</span>
                      </div>
                    </TableCell>
                    <TableCell>{format(job.startTime, 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Ver logs</DropdownMenuItem>
                          <DropdownMenuItem>Reexecutar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="flows" className="m-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Início</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="group">
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    Selecione a aba "Jobs Recentes" para visualizar os dados
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}
