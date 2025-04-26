'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreVertical, Edit, Trash2, BarChart, Pause, Play } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { QueueFormDialog } from './queue-form-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from '@/components/ui/use-toast'

// Dados de exemplo
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
    description: 'Processa emails recebidos e envia notificações',
    concurrency: 5,
    retryLimit: 3,
    retryDelay: 60000,
    isActive: true,
    priority: 5,
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
    description: 'Envia notificações push para dispositivos móveis',
    concurrency: 10,
    retryLimit: 5,
    retryDelay: 30000,
    isActive: true,
    priority: 7,
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
    description: 'Processa transações de pagamento',
    concurrency: 3,
    retryLimit: 5,
    retryDelay: 120000,
    isActive: false,
    priority: 10,
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
    description: 'Importa dados de sistemas externos',
    concurrency: 2,
    retryLimit: 2,
    retryDelay: 300000,
    isActive: true,
    priority: 3,
  },
]

export function QueuesTable() {
  const [editQueue, setEditQueue] = useState<any | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deleteQueue, setDeleteQueue] = useState<any | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

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

  const getActionButton = (status: string, queue: any) => {
    if (status === 'active') {
      return (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handlePauseQueue(queue)}>
          <Pause className="h-4 w-4" />
        </Button>
      )
    }
    return (
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleResumeQueue(queue)}>
        <Play className="h-4 w-4" />
      </Button>
    )
  }

  const handleEditQueue = (queue: any) => {
    setEditQueue(queue)
    setIsEditDialogOpen(true)
  }

  const handleUpdateQueue = (data: any) => {
    console.log('Queue atualizada:', data)
    // Aqui você implementaria a lógica para atualizar a queue no backend
  }

  const handleDeleteClick = (queue: any) => {
    setDeleteQueue(queue)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    console.log('Queue excluída:', deleteQueue)
    // Aqui você implementaria a lógica para excluir a queue no backend
    toast({
      title: 'Queue excluída',
      description: `A queue "${deleteQueue.name}" foi excluída com sucesso.`,
    })
    setIsDeleteDialogOpen(false)
  }

  const handlePauseQueue = (queue: any) => {
    console.log('Queue pausada:', queue)
    toast({
      title: 'Queue pausada',
      description: `A queue "${queue.name}" foi pausada com sucesso.`,
    })
    // Aqui você implementaria a lógica para pausar a queue no backend
  }

  const handleResumeQueue = (queue: any) => {
    console.log('Queue retomada:', queue)
    toast({
      title: 'Queue retomada',
      description: `A queue "${queue.name}" foi retomada com sucesso.`,
    })
    // Aqui você implementaria a lógica para retomar a queue no backend
  }

  return (
    <>
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
                      {getActionButton(queue.status, queue)}
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
                          <DropdownMenuItem onClick={() => handleEditQueue(queue)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(queue)}>
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

      {/* Dialog de edição */}
      {editQueue && (
        <QueueFormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          initialData={editQueue}
          onSubmit={handleUpdateQueue}
        />
      )}

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a queue
              {deleteQueue && <strong> "{deleteQueue.name}"</strong>} e todos os seus dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
