'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bot, Mail, Bell, FileText, CheckCircle, XCircle } from 'lucide-react'

// Dados de exemplo
const activities = [
  {
    id: '1',
    worker: 'Email Worker',
    type: 'email',
    action: 'Processou 50 emails',
    status: 'success',
    time: '2 minutos atrás',
  },
  {
    id: '2',
    worker: 'Notification Worker',
    type: 'notification',
    action: 'Enviou 25 notificações push',
    status: 'success',
    time: '5 minutos atrás',
  },
  {
    id: '3',
    worker: 'Report Generator',
    type: 'processing',
    action: 'Falha ao gerar relatório',
    status: 'error',
    time: '10 minutos atrás',
  },
  {
    id: '4',
    worker: 'Data Processing Worker',
    type: 'processing',
    action: 'Processou 100 registros',
    status: 'success',
    time: '15 minutos atrás',
  },
  {
    id: '5',
    worker: 'SMS Worker',
    type: 'notification',
    action: 'Enviou 15 SMS',
    status: 'success',
    time: '20 minutos atrás',
  },
  {
    id: '6',
    worker: 'PDF Generator',
    type: 'processing',
    action: 'Gerou 5 documentos PDF',
    status: 'success',
    time: '25 minutos atrás',
  },
  {
    id: '7',
    worker: 'Email Worker',
    type: 'email',
    action: 'Falha ao enviar 3 emails',
    status: 'error',
    time: '30 minutos atrás',
  },
]

export function WorkersActivity() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />
      case 'notification':
        return <Bell className="h-4 w-4 text-purple-500" />
      case 'processing':
        return <FileText className="h-4 w-4 text-orange-500" />
      default:
        return <Bot className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
              <div className="mt-0.5">{getTypeIcon(activity.type)}</div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.worker}</p>
                  {getStatusIcon(activity.status)}
                </div>
                <p className="text-sm text-muted-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
