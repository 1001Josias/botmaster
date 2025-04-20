"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Calendar, User, Workflow, AlertTriangle, Play } from "lucide-react"

interface FlowDetailsProps {
  id: string
}

export function FlowDetails({ id }: FlowDetailsProps) {
  // Dados de exemplo - em uma aplicação real, estes dados viriam de uma API
  const flowDetails = {
    id,
    name: "Processamento de Pedido #789",
    workflow: "Processamento de Pedidos",
    status: "completed",
    duration: "1m 12s",
    jobCount: 8,
    completedJobs: 8,
    startedAt: "2023-03-15T14:30:00",
    completedAt: "2023-03-15T14:31:12",
    initiatedBy: "João Silva",
    description: "Fluxo de processamento automático do pedido #789 incluindo validação, pagamento, estoque e envio.",
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium text-green-700">Concluído</span>
          </div>
        )
      case "running":
        return (
          <div className="flex items-center gap-2">
            <Play className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-blue-700">Em Execução</span>
          </div>
        )
      case "failed":
        return (
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="font-medium text-red-700">Falha</span>
          </div>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes do Flow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Nome</h3>
              <p className="text-base font-medium">{flowDetails.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Workflow</h3>
              <div className="flex items-center gap-2">
                <Workflow className="h-4 w-4 text-blue-500" />
                <p className="text-base">{flowDetails.workflow}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              {getStatusBadge(flowDetails.status)}
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Descrição</h3>
              <p className="text-sm">{flowDetails.description}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Iniciado por</h3>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <p className="text-base">{flowDetails.initiatedBy}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Iniciado em</h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-base">{formatDate(flowDetails.startedAt)}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Concluído em</h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-base">{formatDate(flowDetails.completedAt)}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Duração</h3>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-base">{flowDetails.duration}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Jobs</h3>
              <p className="text-base">
                {flowDetails.completedJobs}/{flowDetails.jobCount} concluídos
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

