"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface QueueItemLogsProps {
  id: string
}

export function QueueItemLogs({ id }: QueueItemLogsProps) {
  // Dados simulados para demonstração
  const logs = [
    { timestamp: "2023-05-15T14:30:00Z", level: "info", message: "Item adicionado à fila" },
    { timestamp: "2023-05-15T14:30:05Z", level: "info", message: "Iniciando processamento" },
    { timestamp: "2023-05-15T14:30:10Z", level: "debug", message: "Carregando dados de entrada" },
    { timestamp: "2023-05-15T14:30:15Z", level: "debug", message: "Validando payload" },
    { timestamp: "2023-05-15T14:30:20Z", level: "info", message: "Processando lote 1/3" },
    { timestamp: "2023-05-15T14:30:45Z", level: "info", message: "Processando lote 2/3" },
    { timestamp: "2023-05-15T14:31:10Z", level: "info", message: "Processando lote 3/3" },
    { timestamp: "2023-05-15T14:31:20Z", level: "debug", message: "Finalizando processamento" },
    { timestamp: "2023-05-15T14:31:25Z", level: "info", message: "Processamento concluído com sucesso" },
  ]

  const result = {
    success: true,
    processedItems: 150,
    skippedItems: 3,
    duration: 80000,
    summary: {
      totalRecords: 153,
      validRecords: 150,
      invalidRecords: 3,
    },
    details: {
      batchResults: [
        { batchId: 1, processed: 50, duration: 25000 },
        { batchId: 2, processed: 50, duration: 25000 },
        { batchId: 3, processed: 50, duration: 30000 },
      ],
    },
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getLogLevelClass = (level: string) => {
    switch (level) {
      case "error":
        return "text-red-500"
      case "warn":
        return "text-yellow-500"
      case "info":
        return "text-blue-500"
      case "debug":
        return "text-gray-500"
      default:
        return ""
    }
  }

  return (
    <Tabs defaultValue="logs" className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="result">Resultado</TabsTrigger>
        </TabsList>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Baixar Logs
        </Button>
      </div>

      <TabsContent value="logs">
        <Card>
          <CardHeader>
            <CardTitle>Logs de Execução</CardTitle>
            <CardDescription>Registro cronológico de eventos durante o processamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-md overflow-hidden">
              <div className="p-4 space-y-2 font-mono text-sm max-h-[500px] overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index} className="flex">
                    <span className="text-muted-foreground mr-2">{formatDate(log.timestamp)}</span>
                    <span className={`mr-2 ${getLogLevelClass(log.level)}`}>[{log.level.toUpperCase()}]</span>
                    <span>{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="result">
        <Card>
          <CardHeader>
            <CardTitle>Resultado do Processamento</CardTitle>
            <CardDescription>Dados retornados após a execução</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium mb-2">Resumo</h3>
                <div className="bg-muted p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Status:</div>
                    <div className="text-sm text-green-500">Sucesso</div>

                    <div className="text-sm font-medium">Total de Registros:</div>
                    <div className="text-sm">{result.summary.totalRecords}</div>

                    <div className="text-sm font-medium">Registros Válidos:</div>
                    <div className="text-sm">{result.summary.validRecords}</div>

                    <div className="text-sm font-medium">Registros Inválidos:</div>
                    <div className="text-sm">{result.summary.invalidRecords}</div>

                    <div className="text-sm font-medium">Duração:</div>
                    <div className="text-sm">{(result.duration / 1000).toFixed(2)} segundos</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Detalhes por Lote</h3>
                <div className="bg-muted p-4 rounded-md">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-2">Lote</th>
                        <th className="text-left pb-2">Processados</th>
                        <th className="text-left pb-2">Duração</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.details.batchResults.map((batch) => (
                        <tr key={batch.batchId} className="border-b border-muted-foreground/20">
                          <td className="py-2">{batch.batchId}</td>
                          <td className="py-2">{batch.processed}</td>
                          <td className="py-2">{(batch.duration / 1000).toFixed(2)}s</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Resultado Completo</h3>
              <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">{JSON.stringify(result, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

