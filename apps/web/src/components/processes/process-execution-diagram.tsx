'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import type { Process, ProcessExecution } from '@/lib/types/process'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BpmnStartEvent } from '@/components/processes/bpmn-nodes/bpmn-start-event'
import { BpmnEndEvent } from '@/components/processes/bpmn-nodes/bpmn-end-event'
import { BpmnTask } from '@/components/processes/bpmn-nodes/bpmn-task'
import { BpmnServiceTask } from '@/components/processes/bpmn-nodes/bpmn-service-task'
import { BpmnUserTask } from '@/components/processes/bpmn-nodes/bpmn-user-task'
import { BpmnGateway } from '@/components/processes/bpmn-nodes/bpmn-gateway'

// Importação dinâmica do ReactFlow para evitar problemas de SSR
const ReactFlow = dynamic(() => import('reactflow').then((mod) => mod.default), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full" />,
})

const Controls = dynamic(() => import('reactflow').then((mod) => mod.Controls), { ssr: false })

const MiniMap = dynamic(() => import('reactflow').then((mod) => mod.MiniMap), { ssr: false })

const ReactFlowProvider = dynamic(() => import('reactflow').then((mod) => mod.ReactFlowProvider), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full" />,
})

interface ProcessExecutionDiagramProps {
  execution: ProcessExecution
  process: Process
}

export function ProcessExecutionDiagram({ execution, process }: ProcessExecutionDiagramProps) {
  const [nodes, setNodes] = useState(process.nodes)
  const [edges, setEdges] = useState(process.edges)

  // Configurar os tipos de nós
  const nodeTypes = {
    'bpmn-start-event': BpmnStartEvent,
    'bpmn-end-event': BpmnEndEvent,
    'bpmn-task': BpmnTask,
    'bpmn-service-task': BpmnServiceTask,
    'bpmn-user-task': BpmnUserTask,
    'bpmn-gateway': BpmnGateway,
  }

  // Atualizar os nós com o status de execução
  useEffect(() => {
    if (!execution || !process) return

    const updatedNodes = process.nodes.map((node) => {
      // Encontrar o status de execução deste nó
      const nodeExecution = execution.executedNodes.find((n) => n.nodeId === node.id)

      // Definir o status do nó
      let status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped' | undefined = 'pending'
      if (nodeExecution) {
        status = nodeExecution.status
      } else if (node.id === execution.currentNodeId) {
        status = 'running'
      }

      // Atualizar os dados do nó com o status de execução
      return {
        ...node,
        data: {
          ...node.data,
          executionStatus: status,
          executionData: nodeExecution,
        },
      }
    })

    setNodes(updatedNodes)

    // Atualizar as arestas para mostrar o caminho de execução
    const updatedEdges = process.edges.map((edge) => {
      // Verificar se esta aresta faz parte do caminho de execução
      const sourceExecuted = execution.executedNodes.some((n) => n.nodeId === edge.source)
      const targetExecuted = execution.executedNodes.some((n) => n.nodeId === edge.target)
      const isCurrentPath = sourceExecuted && (targetExecuted || edge.target === execution.currentNodeId)

      return {
        ...edge,
        animated: isCurrentPath,
        style: isCurrentPath ? { stroke: '#3b82f6', strokeWidth: 2 } : {},
      }
    })

    setEdges(updatedEdges)
  }, [execution, process])

  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <div className="h-[500px] w-full">
          <ReactFlowProvider>
            <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView attributionPosition="bottom-right">
              <Controls />
              <MiniMap />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </CardContent>
    </Card>
  )
}
