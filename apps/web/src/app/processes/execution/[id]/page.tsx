'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ProcessExecutionHeader } from '@/components/processes/process-execution-header'
import { ProcessExecutionDiagram } from '@/components/processes/process-execution-diagram'
import { ProcessExecutionDetails } from '@/components/processes/process-execution-details'
import { ProcessLogs } from '@/components/processes/process-execution-logs'
import { ProcessExecutionNodes } from '@/components/processes/process-execution-nodes'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ProcessExecution, Process } from '@/lib/types/process'
import { Skeleton } from '@/components/ui/skeleton'

// Mock data - em produção, isso viria de uma API
const fetchProcessExecution = async (id: string): Promise<ProcessExecution> => {
  // Simulando uma chamada de API
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id,
    processId: 'proc-123',
    version: '1.0.0',
    status: 'running',
    startedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutos atrás
    currentNodeId: 'node-3',
    executedNodes: [
      {
        nodeId: 'node-1',
        startedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        completedAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
        status: 'completed',
        output: { success: true, data: { message: 'Processo iniciado' } },
      },
      {
        nodeId: 'node-2',
        startedAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
        completedAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        status: 'completed',
        output: { success: true, data: { result: 42 } },
      },
      {
        nodeId: 'node-3',
        startedAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        status: 'completed',
      },
    ],
    input: { requestId: '12345', parameters: { threshold: 10 } },
    logs: [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        nodeId: 'node-1',
        message: 'Processo iniciado',
        level: 'info',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
        nodeId: 'node-1',
        message: 'Nó inicial concluído',
        level: 'info',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 3.5).toISOString(),
        nodeId: 'node-2',
        message: 'Processando dados',
        level: 'info',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        nodeId: 'node-2',
        message: 'Dados processados com sucesso',
        level: 'info',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        nodeId: 'node-3',
        message: 'Iniciando validação',
        level: 'info',
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
        nodeId: 'node-3',
        message: 'Aviso: Valor próximo ao limite',
        level: 'warning',
        data: { value: 9.5, threshold: 10 },
      },
    ],
  }
}

const fetchProcess = async (id: string): Promise<Process> => {
  // Simulando uma chamada de API
  await new Promise((resolve) => setTimeout(resolve, 800))

  return {
    id: 'proc-123',
    name: 'Processo de Aprovação de Crédito',
    description: 'Fluxo de aprovação de crédito para novos clientes',
    status: 'active',
    version: '1.0.0',
    nodes: [
      {
        id: 'node-1',
        type: 'bpmn-start-event',
        position: { x: 100, y: 100 },
        data: { label: 'Início', type: 'start' },
      },
      {
        id: 'node-2',
        type: 'bpmn-task',
        position: { x: 250, y: 100 },
        data: {
          label: 'Verificar Dados',
          type: 'task',
          implementation: {
            resourceType: 'worker',
            resourceId: 'worker-data-validation',
            configuration: { timeout: 30 },
          },
        },
      },
      {
        id: 'node-3',
        type: 'bpmn-service-task',
        position: { x: 400, y: 100 },
        data: {
          label: 'Análise de Crédito',
          type: 'service',
          implementation: {
            resourceType: 'worker',
            resourceId: 'worker-credit-analysis',
            configuration: { threshold: 10 },
          },
        },
      },
      {
        id: 'node-4',
        type: 'bpmn-gateway',
        position: { x: 550, y: 100 },
        data: { label: 'Aprovado?', type: 'gateway' },
      },
      {
        id: 'node-5',
        type: 'bpmn-task',
        position: { x: 700, y: 50 },
        data: { label: 'Aprovar Crédito', type: 'task' },
      },
      {
        id: 'node-6',
        type: 'bpmn-task',
        position: { x: 700, y: 150 },
        data: { label: 'Rejeitar Crédito', type: 'task' },
      },
      {
        id: 'node-7',
        type: 'bpmn-end-event',
        position: { x: 850, y: 100 },
        data: { label: 'Fim', type: 'end' },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2', type: 'smoothstep' },
      { id: 'e2-3', source: 'node-2', target: 'node-3', type: 'smoothstep' },
      { id: 'e3-4', source: 'node-3', target: 'node-4', type: 'smoothstep' },
      { id: 'e4-5', source: 'node-4', target: 'node-5', type: 'smoothstep', label: 'Sim' },
      { id: 'e4-6', source: 'node-4', target: 'node-6', type: 'smoothstep', label: 'Não' },
      { id: 'e5-7', source: 'node-5', target: 'node-7', type: 'smoothstep' },
      { id: 'e6-7', source: 'node-6', target: 'node-7', type: 'smoothstep' },
    ],
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-02-20T14:45:00Z',
    createdBy: 'user-123',
    lastUpdatedBy: 'user-456',
  }
}

export default function ProcessExecutionPage() {
  const params = useParams()
  const executionId = params.id as string

  const [execution, setExecution] = useState<ProcessExecution | null>(null)
  const [process, setProcess] = useState<Process | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const executionData = await fetchProcessExecution(executionId)
        setExecution(executionData)

        const processData = await fetchProcess(executionData.processId)
        setProcess(processData)
      } catch (error) {
        console.error('Error loading process execution:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Configurar atualização automática se o processo estiver em execução
    if (execution?.status === 'running') {
      const interval = setInterval(() => {
        loadData()
      }, 60000) // Atualizar a cada 5 segundos

      setRefreshInterval(interval)
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    }
  }, [executionId, execution?.status])

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-[400px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    )
  }

  if (!execution || !process) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Execução não encontrada ou ocorreu um erro ao carregar os dados.
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <ProcessExecutionHeader execution={execution} process={process} />

      <ProcessExecutionDiagram execution={execution} process={process} />

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="nodes">Nós</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <ProcessExecutionDetails execution={execution} process={process} />
        </TabsContent>

        <TabsContent value="nodes" className="mt-4">
          <ProcessExecutionNodes execution={execution} process={process} />
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <ProcessLogs id={execution.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
