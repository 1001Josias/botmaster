'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreVertical, Edit, Trash2, BarChart, Pause, Play, Loader2 } from 'lucide-react'
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
import { queuesApi, type Queue } from '@/lib/api/queues'

interface QueuesTableProps {
  refreshTrigger?: number
}

export function QueuesTable({ refreshTrigger }: QueuesTableProps) {
  const [queues, setQueues] = useState<Queue[]>([])
  const [loading, setLoading] = useState(true)
  const [editQueue, setEditQueue] = useState<Queue | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deleteQueue, setDeleteQueue] = useState<Queue | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Load queues on component mount and when refresh trigger changes
  useEffect(() => {
    loadQueues()
  }, [refreshTrigger])

  const loadQueues = async () => {
    try {
      setLoading(true)
      const response = await queuesApi.getAll()
      setQueues(response.queues)
    } catch (error) {
      console.error('Failed to load queues:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao carregar as filas. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

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

  const getActionButton = (status: string, queue: Queue) => {
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Filas de Processamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">Carregando filas...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleEditQueue = (queue: Queue) => {
    setEditQueue(queue)
    setIsEditDialogOpen(true)
  }

  const handleUpdateQueue = async (data: any) => {
    if (!editQueue) return
    
    try {
      await queuesApi.update(editQueue.id, data)
      toast({
        title: 'Fila atualizada',
        description: `A fila "${editQueue.name}" foi atualizada com sucesso.`,
      })
      await loadQueues()
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error('Failed to update queue:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar a fila. Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteClick = (queue: Queue) => {
    setDeleteQueue(queue)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteQueue) return
    
    try {
      await queuesApi.delete(deleteQueue.id)
      toast({
        title: 'Fila excluída',
        description: `A fila "${deleteQueue.name}" foi excluída com sucesso.`,
      })
      await loadQueues()
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error('Failed to delete queue:', error)
      toast({
        title: 'Erro', 
        description: 'Falha ao excluir a fila. Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  const handlePauseQueue = async (queue: Queue) => {
    try {
      await queuesApi.pause(queue.id)
      toast({
        title: 'Fila pausada',
        description: `A fila "${queue.name}" foi pausada com sucesso.`,
      })
      await loadQueues()
    } catch (error) {
      console.error('Failed to pause queue:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao pausar a fila. Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  const handleResumeQueue = async (queue: Queue) => {
    try {
      await queuesApi.resume(queue.id)
      toast({
        title: 'Fila retomada',
        description: `A fila "${queue.name}" foi retomada com sucesso.`,
      })
      await loadQueues()
    } catch (error) {
      console.error('Failed to resume queue:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao retomar a fila. Tente novamente.',
        variant: 'destructive',
      })
    }
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
              {queues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-muted-foreground">
                      Nenhuma fila encontrada.
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                queues.map((queue) => (
                  <TableRow key={queue.id}>
                    <TableCell className="font-medium">{queue.name}</TableCell>
                    <TableCell>{queue.folderKey}</TableCell>
                    <TableCell>{getStatusBadge(queue.status)}</TableCell>
                    <TableCell className="text-right">-</TableCell> {/* TODO: Add pending count from stats */}
                    <TableCell className="text-right">-</TableCell> {/* TODO: Add processed count from stats */}
                    <TableCell className="text-right">-</TableCell> {/* TODO: Add failed count from stats */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={0} className="bg-gray-200" /> {/* TODO: Calculate load percentage */}
                        <span className="text-xs">0%</span>
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
                ))
              )}
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
          onSubmit={loadQueues}
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
