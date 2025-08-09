'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Copy, Download, MoreHorizontal, RefreshCw, Loader2 } from 'lucide-react'
import type { QueueItem, QueueItemStatus } from '@/lib/types/queue-item'
import { useRouter } from 'next/navigation'
import { ExportDialog } from './export-dialog'
import { queueItemsApi } from '@/lib/api/queue-items'
import { toast } from '@/components/ui/use-toast'

const getStatusBadgeVariant = (status: QueueItemStatus) => {
  switch (status) {
    case 'waiting':
      return { variant: 'outline' as const, label: 'Aguardando' }
    case 'processing':
      return { variant: 'default' as const, label: 'Processando' }
    case 'completed':
      return { variant: 'default' as const, label: 'Concluído' }
    case 'error':
      return { variant: 'destructive' as const, label: 'Erro' }
    case 'cancelled':
      return { variant: 'secondary' as const, label: 'Cancelado' }
  }
}

export function QueueItemsTable() {
  const router = useRouter()
  const [queueItems, setQueueItems] = useState<QueueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showExportDialog, setShowExportDialog] = useState(false)

  // Load queue items on component mount and when pagination changes
  useEffect(() => {
    loadQueueItems()
  }, [currentPage])

  const loadQueueItems = async () => {
    try {
      setLoading(true)
      const response = await queueItemsApi.getAll({
        page: currentPage,
        pageSize,
      })
      setQueueItems(response.items)
      setTotalItems(response.total)
    } catch (error) {
      console.error('Failed to load queue items:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao carregar os itens da fila. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === queueItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(queueItems.map((item) => item.id))
    }
  }

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const handleRetryItem = async (item: QueueItem) => {
    try {
      await queueItemsApi.retry(item.id)
      toast({
        title: 'Item reenviado',
        description: `O item "${item.jobName}" foi reenviado para processamento.`,
      })
      await loadQueueItems()
    } catch (error) {
      console.error('Failed to retry item:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao reenviar o item. Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  const handleCancelItem = async (item: QueueItem) => {
    try {
      await queueItemsApi.cancel(item.id)
      toast({
        title: 'Item cancelado',
        description: `O item "${item.jobName}" foi cancelado.`,
      })
      await loadQueueItems()
    } catch (error) {
      console.error('Failed to cancel item:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao cancelar o item. Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDuration = (ms: number | null) => {
    if (ms === null) return '-'

    const seconds = Math.floor(ms / 1000)
    if (seconds < 60) return `${seconds}s`

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const handleRowClick = (id: string) => {
    router.push(`/queue-items/${id}`)
  }

  const totalPages = Math.ceil(totalItems / pageSize)

  if (loading) {
    return (
      <div className="rounded-md border">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2 text-sm text-muted-foreground">Carregando itens da fila...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      {selectedItems.length > 0 && (
        <div className="bg-muted/50 p-2 flex items-center justify-between">
          <div className="text-sm">{selectedItems.length} item(s) selecionado(s)</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedItems([])}>
              Cancelar
            </Button>
            <Button size="sm" onClick={() => setShowExportDialog(true)}>
              <Download className="mr-2 h-4 w-4" />
              Exportar Selecionados
            </Button>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox
                checked={selectedItems.length === queueItems.length && queueItems.length > 0}
                onCheckedChange={toggleSelectAll}
                aria-label="Selecionar todos"
              />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Job</TableHead>
            <TableHead>Worker</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead>Duração</TableHead>
            <TableHead>Tentativas</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queueItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">
                <div className="text-muted-foreground">
                  Nenhum item encontrado na fila.
                </div>
              </TableCell>
            </TableRow>
          ) : (
            queueItems.map((item) => {
              const statusBadge = getStatusBadgeVariant(item.status)

              return (
                <TableRow
                  key={item.id}
                  className="cursor-pointer"
                  onClick={(e) => {
                    // Prevent navigation when clicking on checkbox or dropdown
                    const target = e.target as HTMLElement
                    if (target.closest('button') || target.closest('[role="checkbox"]') || target.closest('[data-state]'))
                      return

                    handleRowClick(item.id)
                  }}
                >
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => toggleSelectItem(item.id)}
                    aria-label={`Selecionar item ${item.id}`}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.jobName}</TableCell>
                <TableCell>{item.workerName}</TableCell>
                <TableCell>
                  <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                </TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
                <TableCell>{formatDuration(item.processingTime)}</TableCell>
                <TableCell>{`${item.attempts}/${item.maxAttempts}`}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleRowClick(item.id)}>Ver detalhes</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {item.status === 'error' && (
                        <DropdownMenuItem onClick={() => handleRetryItem(item)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Reprocessar
                        </DropdownMenuItem>
                      )}
                      {(item.status === 'waiting' || item.status === 'processing') && (
                        <DropdownMenuItem onClick={() => handleCancelItem(item)}>
                          Cancelar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar ID
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between px-4 py-2 border-t">
        <div className="text-sm text-muted-foreground">
          Mostrando {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalItems)} de {totalItems} items
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} selectedIds={selectedItems} />
    </div>
  )
}
