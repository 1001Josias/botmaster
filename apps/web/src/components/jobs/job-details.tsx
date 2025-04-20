'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Clock, Calendar, User, Bot, AlertTriangle, Play, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/Button'
import Link from 'next/link'

interface JobDetailsProps {
  id: string
}

export function JobDetails({ id }: JobDetailsProps) {
  // Dados de exemplo - em uma aplicação real, estes dados viriam de uma API
  const jobDetails = {
    id,
    name: 'Processamento de Email #1245',
    worker: 'Email Worker',
    workerId: 'W-001',
    flow: 'Processamento de Pedido #789',
    flowId: 'FLOW-001',
    status: 'completed',
    duration: '1.2s',
    startedAt: '2023-03-15T14:30:00',
    completedAt: '2023-03-15T14:30:01',
    initiatedBy: 'João Silva',
    description: 'Job responsável pelo processamento e envio de email de confirmação para o cliente.',
    parameters: {
      emailTemplate: 'order-confirmation',
      recipientEmail: 'cliente@exemplo.com',
      orderId: '789',
    },
    result: {
      success: true,
      messageId: 'MSG123456',
      deliveryStatus: 'sent',
    },
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium text-green-700">Concluído</span>
          </div>
        )
      case 'running':
        return (
          <div className="flex items-center gap-2">
            <Play className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-blue-700">Em Execução</span>
          </div>
        )
      case 'failed':
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
    if (!dateString) return '-'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Job</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Nome</h3>
                <p className="text-base font-medium">{jobDetails.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Worker</h3>
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-blue-500" />
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <Link href={`/workers/${jobDetails.workerId}`}>
                      <span className="flex items-center gap-1">
                        {jobDetails.worker}
                        <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </Link>
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Flow</h3>
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-purple-500" />
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <Link href={`/flows/${jobDetails.flowId}`}>
                      <span className="flex items-center gap-1">
                        {jobDetails.flow}
                        <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </Link>
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                {getStatusBadge(jobDetails.status)}
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Descrição</h3>
                <p className="text-sm">{jobDetails.description}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Iniciado por</h3>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-base">{jobDetails.initiatedBy}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Iniciado em</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-base">{formatDate(jobDetails.startedAt)}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Concluído em</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-base">{formatDate(jobDetails.completedAt)}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Duração</h3>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-base">{jobDetails.duration}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Parâmetros</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
              {JSON.stringify(jobDetails.parameters, null, 2)}
            </pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
              {JSON.stringify(jobDetails.result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
