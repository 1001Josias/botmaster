"use client"

import type { ProcessExecution } from "@/lib/types/process"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Info, AlertTriangle, AlertCircle } from "lucide-react"

interface ProcessExecutionLogsProps {
  execution: ProcessExecution
}

export function ProcessExecutionLogs({ execution }: ProcessExecutionLogsProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "HH:mm:ss", { locale: ptBR })
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "info":
        return "bg-blue-100 text-blue-800"
      case "warning":
        return "bg-amber-100 text-amber-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logs da Execução</CardTitle>
        <CardDescription>Registros de eventos durante a execução do processo</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border">
          <div className="p-4 space-y-2">
            {execution.logs.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">Nenhum log disponível para esta execução.</div>
            ) : (
              execution.logs.map((log, index) => (
                <div key={index} className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50">
                  <div className="mt-1">{getLevelIcon(log.level)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getLevelColor(log.level)}`}>{log.level.toUpperCase()}</Badge>
                        {log.nodeId && <span className="text-xs text-muted-foreground">Nó: {log.nodeId}</span>}
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(log.timestamp)}</span>
                    </div>
                    <p className="mt-1 text-sm">{log.message}</p>
                    {log.data && (
                      <div className="mt-1 text-xs bg-muted p-2 rounded">
                        <pre>{JSON.stringify(log.data, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

