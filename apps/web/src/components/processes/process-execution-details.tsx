'use client'

import type { Process, ProcessExecution } from '@/lib/types/process'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ProcessExecutionDetailsProps {
  execution: ProcessExecution
  process: Process
}

export function ProcessExecutionDetails({ execution, process }: ProcessExecutionDetailsProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm:ss", { locale: ptBR })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações da Execução</CardTitle>
          <CardDescription>Detalhes sobre esta execução do processo</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">ID da Execução</dt>
              <dd className="mt-1 text-sm">{execution.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Versão do Processo</dt>
              <dd className="mt-1 text-sm">{execution.version}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Status</dt>
              <dd className="mt-1">
                <Badge
                  variant={
                    execution.status === 'completed'
                      ? 'secondary'
                      : execution.status === 'running'
                        ? 'default'
                        : execution.status === 'failed'
                          ? 'destructive'
                          : 'outline'
                  }
                >
                  {execution.status === 'running'
                    ? 'Em execução'
                    : execution.status === 'completed'
                      ? 'Concluído'
                      : execution.status === 'failed'
                        ? 'Falhou'
                        : 'Cancelado'}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Iniciado em</dt>
              <dd className="mt-1 text-sm">{formatDate(execution.startedAt)}</dd>
            </div>
            {execution.completedAt && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Concluído em</dt>
                <dd className="mt-1 text-sm">{formatDate(execution.completedAt)}</dd>
              </div>
            )}
            {execution.currentNodeId && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Nó Atual</dt>
                <dd className="mt-1 text-sm">
                  {process.nodes.find((n) => n.id === execution.currentNodeId)?.data.label || execution.currentNodeId}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Execução</CardTitle>
          <CardDescription>Entrada e saída do processo</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="input">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="input">Entrada</TabsTrigger>
              <TabsTrigger value="output">Saída</TabsTrigger>
            </TabsList>

            <TabsContent value="input" className="mt-4">
              <ScrollArea className="h-[200px] rounded-md border p-4">
                <pre className="text-xs">{JSON.stringify(execution.input, null, 2)}</pre>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="output" className="mt-4">
              {execution.output ? (
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <pre className="text-xs">{JSON.stringify(execution.output, null, 2)}</pre>
                </ScrollArea>
              ) : (
                <div className="text-sm text-muted-foreground p-4 border rounded-md">
                  Nenhuma saída disponível ainda.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
