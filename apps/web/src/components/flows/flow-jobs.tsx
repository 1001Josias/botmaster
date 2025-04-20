'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/Button'
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface FlowJobsProps {
  id: string
}

export function FlowJobs({ id }: FlowJobsProps) {
  // Dados de exemplo - em uma aplicação real, estes dados viriam de uma API
  const jobs = [
    {
      id: 'JOB-001',
      name: 'Validação de Pedido',
      status: 'completed',
      duration: '0.3s',
      order: 1,
    },
    {
      id: 'JOB-002',
      name: 'Verificação de Estoque',
      status: 'completed',
      duration: '0.5s',
      order: 2,
    },
    {
      id: 'JOB-003',
      name: 'Processamento de Pagamento',
      status: 'completed',
      duration: '0.8s',
      order: 3,
    },
    {
      id: 'JOB-004',
      name: 'Reserva de Estoque',
      status: 'completed',
      duration: '0.2s',
      order: 4,
    },
    {
      id: 'JOB-005',
      name: 'Geração de Nota Fiscal',
      status: 'completed',
      duration: '0.4s',
      order: 5,
    },
    {
      id: 'JOB-006',
      name: 'Criação de Etiqueta',
      status: 'completed',
      duration: '0.3s',
      order: 6,
    },
    {
      id: 'JOB-007',
      name: 'Notificação de Envio',
      status: 'completed',
      duration: '0.2s',
      order: 7,
    },
    {
      id: 'JOB-008',
      name: 'Atualização de Status',
      status: 'completed',
      duration: '0.1s',
      order: 8,
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jobs do Flow</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <div key={job.id} className="relative">
                {index < jobs.length - 1 && <div className="absolute left-3.5 top-8 h-full w-0.5 bg-border" />}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                    {getStatusIcon(job.status)}
                  </div>
                  <div className="flex-1 rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{job.name}</div>
                      <Badge variant="outline" className="text-xs">
                        {job.order}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{job.duration}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 gap-1">
                        <FileText className="h-3 w-3" />
                        <span className="text-xs">Logs</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
