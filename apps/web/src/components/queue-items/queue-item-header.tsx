'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Copy, Download, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import type { QueueItemStatus } from '@/lib/types/queue-item'

interface QueueItemHeaderProps {
  id: string
}

export function QueueItemHeader({ id }: QueueItemHeaderProps) {
  const router = useRouter()

  // Dados simulados para demonstração
  const item = {
    id,
    status: 'completed' as QueueItemStatus,
    jobName: 'Processamento de Dados',
    workerName: 'Worker de Análise',
  }

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

  const statusBadge = getStatusBadgeVariant(item.status)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push('/queue-items')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{item.id}</h1>
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
          </div>
          <p className="text-muted-foreground">
            {item.jobName} • {item.workerName}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Copy className="mr-2 h-4 w-4" />
          Copiar ID
        </Button>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Baixar Logs
        </Button>
        <Button size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reprocessar
        </Button>
      </div>
    </div>
  )
}
