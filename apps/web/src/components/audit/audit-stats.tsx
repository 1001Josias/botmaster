'use client'

import type React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Activity, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react'

export function AuditStats() {
  return (
    <Tabs defaultValue="today" className="space-y-4">
      <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="today">Hoje</TabsTrigger>
          <TabsTrigger value="week">Esta Semana</TabsTrigger>
          <TabsTrigger value="month">Este Mês</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="today" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total de Ações"
            value="124"
            description="Ações registradas hoje"
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            trend="+12% em relação a ontem"
            trendUp={true}
          />

          <StatsCard
            title="Usuários Ativos"
            value="18"
            description="Usuários distintos"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            trend="+3 em relação a ontem"
            trendUp={true}
          />

          <StatsCard
            title="Ações Críticas"
            value="7"
            description="Exclusões e modificações importantes"
            icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
            trend="-2 em relação a ontem"
            trendUp={false}
          />

          <StatsCard
            title="Tempo Médio"
            value="2.3s"
            description="Tempo médio de resposta"
            icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            trend="+0.1s em relação a ontem"
            trendUp={false}
          />
        </div>
      </TabsContent>

      <TabsContent value="week" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total de Ações"
            value="876"
            description="Ações registradas esta semana"
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            trend="+8% em relação à semana passada"
            trendUp={true}
          />

          <StatsCard
            title="Usuários Ativos"
            value="32"
            description="Usuários distintos"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            trend="+5 em relação à semana passada"
            trendUp={true}
          />

          <StatsCard
            title="Ações Críticas"
            value="42"
            description="Exclusões e modificações importantes"
            icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
            trend="+3 em relação à semana passada"
            trendUp={false}
          />

          <StatsCard
            title="Tempo Médio"
            value="2.1s"
            description="Tempo médio de resposta"
            icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            trend="-0.2s em relação à semana passada"
            trendUp={true}
          />
        </div>
      </TabsContent>

      <TabsContent value="month" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total de Ações"
            value="3,542"
            description="Ações registradas este mês"
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            trend="+15% em relação ao mês passado"
            trendUp={true}
          />

          <StatsCard
            title="Usuários Ativos"
            value="45"
            description="Usuários distintos"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            trend="+8 em relação ao mês passado"
            trendUp={true}
          />

          <StatsCard
            title="Ações Críticas"
            value="156"
            description="Exclusões e modificações importantes"
            icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
            trend="+12 em relação ao mês passado"
            trendUp={false}
          />

          <StatsCard
            title="Tempo Médio"
            value="2.2s"
            description="Tempo médio de resposta"
            icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            trend="-0.3s em relação ao mês passado"
            trendUp={true}
          />
        </div>
      </TabsContent>
    </Tabs>
  )
}

interface StatsCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend: string
  trendUp: boolean
}

function StatsCard({ title, value, description, icon, trend, trendUp }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className={`flex items-center text-xs mt-2 ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
          {trendUp ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
          {trend}
        </div>
      </CardContent>
    </Card>
  )
}
