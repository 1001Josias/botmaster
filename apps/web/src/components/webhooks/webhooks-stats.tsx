'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, CheckCircle, Clock, XCircle } from 'lucide-react'

export function WebhooksStats() {
  // Dados de exemplo - em produção, estes viriam de uma API
  const stats = {
    total: 12,
    active: 8,
    inactive: 3,
    failed: 1,
    deliveriesTotal: 1458,
    deliveriesSuccess: 1423,
    deliveriesFailed: 35,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Webhooks</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            {stats.active} ativos, {stats.inactive} inativos, {stats.failed} falhos
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Entregas Totais</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.deliveriesTotal}</div>
          <p className="text-xs text-muted-foreground">Últimas 24 horas</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Entregas com Sucesso</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.deliveriesSuccess}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.deliveriesSuccess / stats.deliveriesTotal) * 100).toFixed(1)}% de taxa de sucesso
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Entregas Falhas</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.deliveriesFailed}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.deliveriesFailed / stats.deliveriesTotal) * 100).toFixed(1)}% de taxa de falha
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
