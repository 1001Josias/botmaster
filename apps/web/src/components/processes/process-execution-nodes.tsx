'use client'

import type { Process, ProcessExecution } from '@/lib/types/process'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format, formatDistanceStrict } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CheckCircle2, Clock, XCircle, AlertTriangle } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface ProcessExecutionNodesProps {
  execution: ProcessExecution
  process: Process
}

export function ProcessExecutionNodes({ execution, process }: ProcessExecutionNodesProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm:ss', { locale: ptBR })
  }

  const getNodeLabel = (nodeId: string) => {
    const node = process.nodes.find((n) => n.id === nodeId)
    return node?.data.label || nodeId
  }

  const getNodeType = (nodeId: string) => {
    const node = process.nodes.find((n) => n.id === nodeId)
    return node?.data.type || 'unknown'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'skipped':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      default:
        return <Clock className="h-5 w-5 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'skipped':
        return 'bg-amber-100 text-amber-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const getDuration = (startedAt: string, completedAt?: string) => {
    if (!completedAt) return 'Em andamento'

    const start = new Date(startedAt)
    const end = new Date(completedAt)

    return formatDistanceStrict(start, end, { locale: ptBR })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nós Executados</CardTitle>
        <CardDescription>Detalhes da execução de cada nó do processo</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <Accordion type="multiple" className="w-full">
            {execution.executedNodes.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">Nenhum nó foi executado ainda.</div>
            ) : (
              execution.executedNodes.map((node, index) => (
                <AccordionItem key={node.nodeId} value={node.nodeId}>
                  <AccordionTrigger className="hover:bg-muted/50 px-4">
                    <div className="flex items-center gap-3 text-left">
                      {getStatusIcon(node.status)}
                      <div>
                        <div className="font-medium">{getNodeLabel(node.nodeId)}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {getNodeType(node.nodeId)}
                          </Badge>
                          <span>•</span>
                          <span>{formatDate(node.startedAt)}</span>
                          {node.completedAt && (
                            <>
                              <span>•</span>
                              <span>Duração: {getDuration(node.startedAt, node.completedAt)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Status</h4>
                        <Badge className={getStatusColor(node.status)}>
                          {node.status === 'completed'
                            ? 'Concluído'
                            : node.status === 'failed'
                              ? 'Falhou'
                              : node.status === 'skipped'
                                ? 'Ignorado'
                                : node.status}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1">Tempo de Execução</h4>
                        <div className="text-sm">
                          <div>Início: {formatDate(node.startedAt)}</div>
                          {node.completedAt && <div>Término: {formatDate(node.completedAt)}</div>}
                          <div className="mt-1 text-muted-foreground">
                            Duração: {getDuration(node.startedAt, node.completedAt)}
                          </div>
                        </div>
                      </div>

                      {node.output && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Saída</h4>
                          <div className="bg-muted p-2 rounded text-xs">
                            <pre>{JSON.stringify(node.output, null, 2)}</pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))
            )}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
