'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { QueueItem } from '@/lib/types/queue-item'
import { Badge } from '@/components/ui/badge'

interface QueueItemInfoProps {
  id: string
}

export function QueueItemInfo({ id }: QueueItemInfoProps) {
  // Dados simulados para demonstração
  const item: QueueItem = {
    id,
    jobId: 'job-123',
    jobName: 'Processamento de Dados',
    workerId: 'worker-456',
    workerName: 'Worker de Análise',
    workerVersion: '1.5',
    status: 'completed',
    createdAt: '2023-05-15T14:30:00Z',
    startedAt: '2023-05-15T14:30:05Z',
    finishedAt: '2023-05-15T14:31:25Z',
    processingTime: 80000,
    payload: { data: 'Sample payload data' },
    result: { success: true, processedItems: 150 },
    error: null,
    attempts: 1,
    maxAttempts: 3,
    priority: 2,
    tags: ['production', 'data-processing'],
    metadata: { source: 'API', requestId: 'req-789' },
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const formatDuration = (ms: number | null) => {
    if (ms === null) return '-'

    const seconds = Math.floor(ms / 1000)
    if (seconds < 60) return `${seconds} segundos`

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes} minutos e ${remainingSeconds} segundos`
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>Detalhes do item na fila</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium">ID:</div>
            <div className="text-sm">{item.id}</div>

            <div className="text-sm font-medium">Status:</div>
            <div className="text-sm">
              <Badge variant={item.status === 'completed' ? 'success' : 'default'}>
                {item.status === 'completed' ? 'Concluído' : item.status}
              </Badge>
            </div>

            <div className="text-sm font-medium">Prioridade:</div>
            <div className="text-sm">{item.priority}</div>

            <div className="text-sm font-medium">Tentativas:</div>
            <div className="text-sm">{`${item.attempts}/${item.maxAttempts}`}</div>

            <div className="text-sm font-medium">Tags:</div>
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tempos de Processamento</CardTitle>
          <CardDescription>Métricas de tempo de execução</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium">Criado em:</div>
            <div className="text-sm">{formatDate(item.createdAt)}</div>

            <div className="text-sm font-medium">Iniciado em:</div>
            <div className="text-sm">{formatDate(item.startedAt)}</div>

            <div className="text-sm font-medium">Finalizado em:</div>
            <div className="text-sm">{formatDate(item.finishedAt)}</div>

            <div className="text-sm font-medium">Tempo de Processamento:</div>
            <div className="text-sm">{formatDuration(item.processingTime)}</div>

            <div className="text-sm font-medium">Tempo de Espera:</div>
            <div className="text-sm">
              {item.startedAt && item.createdAt
                ? formatDuration(new Date(item.startedAt).getTime() - new Date(item.createdAt).getTime())
                : '-'}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Job</CardTitle>
          <CardDescription>Detalhes do job associado</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium">ID do Job:</div>
            <div className="text-sm">{item.jobId}</div>

            <div className="text-sm font-medium">Nome do Job:</div>
            <div className="text-sm">{item.jobName}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Worker</CardTitle>
          <CardDescription>Detalhes do worker que processou o item</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium">ID do Worker:</div>
            <div className="text-sm">{item.workerId}</div>

            <div className="text-sm font-medium">Nome do Worker:</div>
            <div className="text-sm">{item.workerName}</div>

            <div className="text-sm font-medium">Versão do Worker:</div>
            <div className="text-sm">{item.workerVersion}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Metadados</CardTitle>
          <CardDescription>Informações adicionais do item</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">{JSON.stringify(item.metadata, null, 2)}</pre>
        </CardContent>
      </Card>
    </div>
  )
}
