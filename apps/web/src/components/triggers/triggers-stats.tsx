'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, AlertTriangle, Workflow, Bot, Loader2 } from 'lucide-react'
import { triggersApi, type TriggerStats } from '@/lib/api/triggers'

export function TriggersStats() {
  const [stats, setStats] = useState<TriggerStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await triggersApi.getStats()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch trigger stats')
        console.error('Failed to fetch trigger stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </CardTitle>
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-12 bg-muted animate-pulse rounded mb-1" />
              <div className="h-3 w-20 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="md:col-span-2 lg:col-span-4">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Erro ao carregar estatísticas: {error}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const workflowsPercentage = stats?.total ? Math.round((stats.byType.schedule + stats.byType.webhook) / stats.total * 100) : 0
  const workersPercentage = stats?.total ? Math.round((stats.byType.event + stats.byType.data) / stats.total * 100) : 0
  const errorPercentage = stats?.total ? Math.round((stats.error / stats.total) * 100) : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Triggers</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.total || 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats?.active || 0} ativos, {stats?.inactive || 0} inativos
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Agendamento/Webhook</CardTitle>
          <Workflow className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(stats?.byType.schedule || 0) + (stats?.byType.webhook || 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            {workflowsPercentage}% do total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Evento/Dados</CardTitle>
          <Bot className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(stats?.byType.event || 0) + (stats?.byType.data || 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            {workersPercentage}% do total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Com Erro</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.error || 0}</div>
          <p className="text-xs text-muted-foreground">
            {errorPercentage}% do total
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
