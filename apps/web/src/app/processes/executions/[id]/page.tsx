'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, RefreshCw, PauseCircle, StopCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// Tipos simplificados para este exemplo
type ProcessExecution = {
  id: string
  processId: string
  processName: string
  status: 'running' | 'completed' | 'failed' | 'paused' | 'canceled'
  startedAt: string
  completedAt?: string
  currentNodeId?: string
  progress: number
  executedNodes: Array<{
    id: string
    name: string
    type: string
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
    startedAt?: string
    completedAt?: string
    duration?: number
    output?: any
  }>
  logs: Array<{
    timestamp: string
    level: 'info' | 'warning' | 'error' | 'debug'
    message: string
    nodeId?: string
    nodeName?: string
    data?: any
  }>
}

// Dados de exemplo
const mockExecution: ProcessExecution = {
  id: 'exec-123',
  processId: 'proc-456',
  processName: 'Processo de Aprovação de Crédito',
  status: 'running',
  startedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  progress: 65,
  executedNodes: [
    {
      id: 'node-1',
      name: 'Início',
      type: 'start',
      status: 'completed',
      startedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 9.8).toISOString(),
      duration: 12000,
    },
    {
      id: 'node-2',
      name: 'Verificar Dados do Cliente',
      type: 'task',
      status: 'completed',
      startedAt: new Date(Date.now() - 1000 * 60 * 9.8).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      duration: 108000,
      output: { valid: true, score: 85 },
    },
    {
      id: 'node-3',
      name: 'Análise de Crédito',
      type: 'service',
      status: 'completed',
      startedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      duration: 180000,
      output: { approved: true, limit: 5000, risk: 'low' },
    },
    {
      id: 'node-4',
      name: 'Decisão de Aprovação',
      type: 'gateway',
      status: 'completed',
      startedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 4.9).toISOString(),
      duration: 6000,
    },
    {
      id: 'node-5',
      name: 'Gerar Contrato',
      type: 'task',
      status: 'running',
      startedAt: new Date(Date.now() - 1000 * 60 * 4.9).toISOString(),
    },
  ],
  logs: [
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      level: 'info',
      message: 'Processo iniciado',
      nodeId: 'node-1',
      nodeName: 'Início',
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 9.8).toISOString(),
      level: 'info',
      message: 'Iniciando verificação de dados',
      nodeId: 'node-2',
      nodeName: 'Verificar Dados do Cliente',
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
      level: 'debug',
      message: 'Consultando base de dados de clientes',
      nodeId: 'node-2',
      nodeName: 'Verificar Dados do Cliente',
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 8.5).toISOString(),
      level: 'info',
      message: 'Dados do cliente validados com sucesso',
      nodeId: 'node-2',
      nodeName: 'Verificar Dados do Cliente',
      data: { score: 85 },
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      level: 'info',
      message: 'Iniciando análise de crédito',
      nodeId: 'node-3',
      nodeName: 'Análise de Crédito',
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
      level: 'warning',
      message: 'Histórico de crédito com pequenas pendências',
      nodeId: 'node-3',
      nodeName: 'Análise de Crédito',
      data: { pendingAmount: 120.5 },
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
      level: 'info',
      message: 'Calculando limite de crédito',
      nodeId: 'node-3',
      nodeName: 'Análise de Crédito',
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      level: 'info',
      message: 'Análise de crédito concluída',
      nodeId: 'node-3',
      nodeName: 'Análise de Crédito',
      data: { approved: true, limit: 5000 },
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 4.9).toISOString(),
      level: 'info',
      message: 'Decisão: Crédito aprovado',
      nodeId: 'node-4',
      nodeName: 'Decisão de Aprovação',
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 4.8).toISOString(),
      level: 'info',
      message: 'Iniciando geração de contrato',
      nodeId: 'node-5',
      nodeName: 'Gerar Contrato',
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      level: 'debug',
      message: 'Aplicando template de contrato',
      nodeId: 'node-5',
      nodeName: 'Gerar Contrato',
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
      level: 'info',
      message: 'Aguardando assinatura digital',
      nodeId: 'node-5',
      nodeName: 'Gerar Contrato',
    },
  ],
}

export default function ProcessExecutionPage() {
  const params = useParams()
  const router = useRouter()
  const executionId = params.id as string

  const [execution, setExecution] = useState<ProcessExecution | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('diagram')

  useEffect(() => {
    // Simulando carregamento de dados
    const loadData = async () => {
      setLoading(true)
      // Em um cenário real, aqui seria feita uma chamada à API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setExecution(mockExecution)
      setLoading(false)
    }

    loadData()

    // Atualização automática para processos em execução
    let interval: NodeJS.Timeout | null = null
    if (execution?.status === 'running') {
      interval = setInterval(() => {
        loadData()
      }, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [executionId])

  const handleRefresh = () => {
    setLoading(true)
    // Simulando atualização
    setTimeout(() => {
      setExecution(mockExecution)
      setLoading(false)
    }, 800)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString()
  }

  const formatDuration = (ms?: number) => {
    if (!ms) return '-'
    const seconds = Math.floor(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-blue-500">Em Execução</Badge>
      case 'completed':
        return <Badge className="bg-green-500">Concluído</Badge>
      case 'failed':
        return <Badge className="bg-red-500">Falha</Badge>
      case 'paused':
        return <Badge className="bg-yellow-500">Pausado</Badge>
      case 'canceled':
        return <Badge className="bg-gray-500">Cancelado</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  const getNodeStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-blue-500">Em Execução</Badge>
      case 'completed':
        return <Badge className="bg-green-500">Concluído</Badge>
      case 'failed':
        return <Badge className="bg-red-500">Falha</Badge>
      case 'pending':
        return <Badge className="bg-gray-500">Pendente</Badge>
      case 'skipped':
        return <Badge className="bg-purple-500">Ignorado</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  const getLogLevelBadge = (level: string) => {
    switch (level) {
      case 'info':
        return <Badge className="bg-blue-500">Info</Badge>
      case 'warning':
        return <Badge className="bg-yellow-500">Aviso</Badge>
      case 'error':
        return <Badge className="bg-red-500">Erro</Badge>
      case 'debug':
        return <Badge className="bg-gray-500">Debug</Badge>
      default:
        return <Badge className="bg-gray-500">{level}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  if (!execution) {
    return (
      <div className="container mx-auto py-6">
        <Card className="p-6 bg-destructive/10 text-destructive">
          <p>Execução não encontrada ou ocorreu um erro ao carregar os dados.</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push('/dashboard/processes')}>
            Voltar para Processos
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/processes')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{execution.processName}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Execução #{execution.id}</span>
              <span>•</span>
              {getStatusBadge(execution.status)}
              <span>•</span>
              <span>Iniciado em {formatDate(execution.startedAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {execution.status === 'running' && (
            <>
              <Button variant="outline" size="sm">
                <PauseCircle className="mr-2 h-4 w-4" />
                Pausar
              </Button>
              <Button variant="outline" size="sm" className="text-destructive">
                <StopCircle className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Progresso */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Progresso da Execução</h2>
            <span className="text-sm font-medium">{execution.progress}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${execution.progress}%` }}></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Início</p>
              <p className="font-medium">{formatDate(execution.startedAt)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Duração</p>
              <p className="font-medium">
                {execution.completedAt
                  ? formatDuration(new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime())
                  : formatDuration(Date.now() - new Date(execution.startedAt).getTime()) + ' (em andamento)'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Término</p>
              <p className="font-medium">{formatDate(execution.completedAt)}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Abas */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="diagram">Diagrama</TabsTrigger>
          <TabsTrigger value="nodes">Nós</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        {/* Diagrama */}
        <TabsContent value="diagram" className="mt-6">
          <Card className="p-6">
            <div className="flex justify-center items-center h-[400px] bg-muted/20 rounded-lg border border-dashed">
              <div className="text-center">
                <p className="text-muted-foreground">Visualização do diagrama de processo</p>
                <p className="text-sm text-muted-foreground">
                  (Em um cenário real, aqui seria renderizado o diagrama BPMN com o estado atual da execução)
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Nós */}
        <TabsContent value="nodes" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Nós Executados</h3>
            <div className="space-y-4">
              {execution.executedNodes.map((node) => (
                <div key={node.id} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-medium">{node.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Tipo: {node.type}</span>
                        <span>•</span>
                        {getNodeStatusBadge(node.status)}
                      </div>
                    </div>
                    <div className="text-sm">
                      <div>Início: {formatDate(node.startedAt)}</div>
                      <div>Duração: {formatDuration(node.duration)}</div>
                    </div>
                  </div>

                  {node.output && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-1">Saída:</p>
                      <pre className="bg-muted p-2 rounded-md text-xs overflow-auto">
                        {JSON.stringify(node.output, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Logs */}
        <TabsContent value="logs" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Logs de Execução</h3>
            <div className="space-y-2">
              {execution.logs.map((log, index) => (
                <div key={index} className="border-b pb-2 last:border-0">
                  <div className="flex items-start gap-2">
                    <div className="min-w-[180px] text-sm text-muted-foreground">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="min-w-[60px]">{getLogLevelBadge(log.level)}</div>
                    <div className="flex-1">
                      <p>{log.message}</p>
                      {log.nodeName && <p className="text-sm text-muted-foreground">Nó: {log.nodeName}</p>}
                      {log.data && (
                        <pre className="mt-1 bg-muted p-2 rounded-md text-xs overflow-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
