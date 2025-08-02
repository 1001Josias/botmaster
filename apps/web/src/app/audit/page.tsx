'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AuditLogs } from '@/components/audit/audit-logs'
import { AuditFilters } from '@/components/audit/audit-filters'
import { AuditStats } from '@/components/audit/audit-stats'
import { Download, Filter, Search } from 'lucide-react'

export default function AuditPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Auditoria</h1>
          <p className="text-muted-foreground">Visualize e analise todas as ações realizadas no sistema</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>

      <AuditStats />

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-3/4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Logs de Auditoria</CardTitle>
                  <CardDescription>Histórico completo de ações realizadas no sistema</CardDescription>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar logs..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                <TabsList>
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="users">Usuários</TabsTrigger>
                  <TabsTrigger value="workflows">Workflows</TabsTrigger>
                  <TabsTrigger value="processes">Processos</TabsTrigger>
                  <TabsTrigger value="workers">Workers</TabsTrigger>
                  <TabsTrigger value="queues">Filas</TabsTrigger>
                  <TabsTrigger value="settings">Configurações</TabsTrigger>
                </TabsList>
              </Tabs>

              {showFilters && <AuditFilters className="mb-4" />}

              <AuditLogs category={activeTab} searchQuery={searchQuery} />
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>Últimas ações realizadas no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 mt-1.5 rounded-full ${getActivityColor(activity.category)}`} />
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.user} • {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Funções auxiliares
const formatTimeAgo = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds} segundos atrás`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutos atrás`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} horas atrás`
  return `${Math.floor(diffInSeconds / 86400)} dias atrás`
}

const getActivityColor = (category: string) => {
  switch (category) {
    case 'user':
      return 'bg-blue-500'
    case 'workflow':
      return 'bg-purple-500'
    case 'process':
      return 'bg-green-500'
    case 'worker':
      return 'bg-orange-500'
    case 'queue':
      return 'bg-yellow-500'
    case 'settings':
      return 'bg-gray-500'
    default:
      return 'bg-primary'
  }
}

// Dados de exemplo
const recentActivities = [
  {
    action: 'Criou um novo workflow',
    user: 'João Silva',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    category: 'workflow',
  },
  {
    action: 'Atualizou configurações de segurança',
    user: 'Maria Oliveira',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    category: 'settings',
  },
  {
    action: 'Executou processo de aprovação',
    user: 'Carlos Santos',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    category: 'process',
  },
  {
    action: 'Adicionou novo usuário',
    user: 'Ana Costa',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    category: 'user',
  },
  {
    action: 'Modificou worker de processamento',
    user: 'Pedro Almeida',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    category: 'worker',
  },
  {
    action: 'Criou nova fila de prioridade',
    user: 'Lucia Ferreira',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    category: 'queue',
  },
]
