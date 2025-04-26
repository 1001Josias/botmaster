"use client"

import type { Process, ProcessExecution } from "@/lib/types/process"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlayCircle, PauseCircle, StopCircle, RefreshCw, Clock, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ProcessExecutionHeaderProps {
  execution: ProcessExecution
  process: Process
}

export function ProcessExecutionHeader({ execution, process }: ProcessExecutionHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-blue-500 text-white"
      case "completed":
        return "bg-green-500 text-white"
      case "failed":
        return "bg-red-500 text-white"
      case "cancelled":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <PlayCircle className="h-5 w-5 mr-1" />
      case "completed":
        return <StopCircle className="h-5 w-5 mr-1" />
      case "failed":
        return <AlertCircle className="h-5 w-5 mr-1" />
      case "cancelled":
        return <PauseCircle className="h-5 w-5 mr-1" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "running":
        return "Em execução"
      case "completed":
        return "Concluído"
      case "failed":
        return "Falhou"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  const getDuration = () => {
    if (!execution.startedAt) return "N/A"

    const start = new Date(execution.startedAt)
    const end = execution.completedAt ? new Date(execution.completedAt) : new Date()

    return formatDistanceToNow(start, {
      addSuffix: false,
      locale: ptBR,
      includeSeconds: true,
    })
  }

  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{process.name}</h1>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            <span>Execução #{execution.id.substring(0, 8)}</span>
            <span>•</span>
            <span>Versão {execution.version}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={`flex items-center ${getStatusColor(execution.status)}`}>
            {getStatusIcon(execution.status)}
            {getStatusText(execution.status)}
          </Badge>

          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {getDuration()}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {execution.status === "running" && (
          <>
            <Button variant="outline" size="sm">
              <PauseCircle className="h-4 w-4 mr-2" />
              Pausar
            </Button>
            <Button variant="outline" size="sm" className="text-destructive">
              <StopCircle className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </>
        )}

        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>
    </div>
  )
}

