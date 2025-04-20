'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/Button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreVertical, Play, Pause, RefreshCw, Edit, Trash2, Bot, Mail, Bell, FileText } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

// Dados de exemplo
const workers = [
  {
    id: 'W-001',
    name: 'Email Worker',
    type: 'email',
    status: 'active',
    folder: 'Produção',
    cpu: 25,
    memory: 40,
    tasks: 1245,
    lastActive: '2 minutos atrás',
  },
  {
    id: 'W-002',
    name: 'Notification Worker',
    type: 'notification',
    status: 'active',
    folder: 'Produção',
    cpu: 15,
    memory: 30,
    tasks: 3456,
    lastActive: '1 minuto atrás',
  },
  {
    id: 'W-003',
    name: 'Data Processing Worker',
    type: 'processing',
    status: 'paused',
    folder: 'Produção',
    cpu: 0,
    memory: 10,
    tasks: 2134,
    lastActive: '1 hora atrás',
  },
  {
    id: 'W-004',
    name: 'Report Generator',
    type: 'processing',
    status: 'error',
    folder: 'Desenvolvimento',
    cpu: 85,
    memory: 90,
    tasks: 567,
    lastActive: '5 minutos atrás',
  },
  {
    id: 'W-005',
    name: 'SMS Worker',
    type: 'notification',
    status: 'active',
    folder: 'Produção',
    cpu: 35,
    memory: 45,
    tasks: 1890,
    lastActive: '30 segundos atrás',
  },
  {
    id: 'W-006',
    name: 'PDF Generator',
    type: 'processing',
    status: 'active',
    folder: 'Produção',
    cpu: 55,
    memory: 60,
    tasks: 789,
    lastActive: '3 minutos atrás',
  },
]

export function WorkersGrid() {
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />
      case 'notification':
        return <Bell className="h-4 w-4 text-purple-500" />
      case 'processing':
        return <FileText className="h-4 w-4 text-orange-500" />
      default:
        return <Bot className="h-4 w-4" />
    }
  }

  const getProgressColor = (value: number) => {
    if (value < 50) return 'bg-green-500'
    if (value < 80) return 'bg-yellow-500'
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
        <CardTitle>Workers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workers.map((worker) => (
            <Card key={worker.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(worker.type)}
                    <CardTitle className="text-base">{worker.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(worker.status)}
                    <span className="text-xs text-muted-foreground">{worker.folder}</span>
                  </div>
                </div>
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
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reiniciar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>CPU</span>
                      <span>{worker.cpu}%</span>
                    </div>
                    <Progress value={worker.cpu} className={getProgressColor(worker.cpu)} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Memória</span>
                      <span>{worker.memory}%</span>
                    </div>
                    <Progress value={worker.memory} className={getProgressColor(worker.memory)} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <div className="text-xs text-muted-foreground">
                  <span>Tarefas: {worker.tasks.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  {getActionButton(worker.status)}
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
