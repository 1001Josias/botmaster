'use client'

import { useState } from 'react'
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
import { ChevronLeft, ChevronRight, Copy, Download, MoreHorizontal, RefreshCw } from 'lucide-react'
import type { QueueItem, QueueItemStatus } from '@/lib/types/queue-item'
import { useRouter } from 'next/navigation'
import { ExportDialog } from './export-dialog'

// Dados simulados para demonstração
const mockQueueItems: QueueItem[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `qi-${i + 1}`,
  jobId: `job-${Math.floor(Math.random() * 5) + 1}`,
  jobName: `Job ${Math.floor(Math.random() * 5) + 1}`,
  workerId: `worker-${Math.floor(Math.random() * 3) + 1}`,
  workerName: `Worker ${Math.floor(Math.random() * 3) + 1}`,
  workerVersion: `1.${Math.floor(Math.random() * 10)}`,
  status: ['waiting', 'processing', 'completed', 'error', 'cancelled'][
    Math.floor(Math.random() * 5)
  ] as QueueItemStatus,
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  startedAt: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 5000000000).toISOString() : null,
  finishedAt: Math.random() > 0.4 ? new Date(Date.now() - Math.random() * 1000000000).toISOString() : null,
  processingTime: Math.random() > 0.4 ? Math.floor(Math.random() * 60000) : null,
  payload: { data: `Sample payload ${i + 1}` },
  result: Math.random() > 0.4 ? { result: `Result ${i + 1}` } : null,
  error: Math.random() > 0.8 ? `Error message ${i + 1}` : null,
  attempts: Math.floor(Math.random() * 3) + 1,
  maxAttempts: 3,
  priority: Math.floor(Math.random() * 5) + 1,
  tags: ['tag1', 'tag2'].slice(0, Math.floor(Math.random() * 3)),
  metadata: { source: `Source ${i + 1}` },
}))

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
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showExportDialog, setShowExportDialog] = useState(false)

  const toggleSelectAll = () => {
    if (selectedItems.length === mockQueueItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(mockQueueItems.map((item) => item.id))
    }
  }

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
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
                checked={selectedItems.length === mockQueueItems.length && mockQueueItems.length > 0}
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
          {mockQueueItems.map((item) => {
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
                      <DropdownMenuItem>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reprocessar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Baixar logs
                      </DropdownMenuItem>
                      <DropdownMenuItem>
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
        <div className="text-sm text-muted-foreground">Mostrando 1-10 de 235 items</div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            1
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            2
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            3
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} selectedIds={selectedItems} />
    </div>
  )
}
