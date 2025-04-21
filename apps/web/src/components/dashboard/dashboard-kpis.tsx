'use client'

import CountUp from 'react-countup'

import { Card, CardContent } from '@/components/ui/card'
import { Bot, Play, CheckCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface KPICardProps {
  title: string
  value: number
  change: number
  icon: React.ReactNode
  changeType?: 'positive' | 'negative' | 'neutral'
  className?: string
}

function KPICard({ title, value, change, icon, changeType = 'neutral', className }: KPICardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold tracking-tight">
                <CountUp end={value} duration={2} separator="," />
              </h3>
              <span
                className={cn(
                  'text-xs font-medium',
                  changeType === 'positive'
                    ? 'text-green-500'
                    : changeType === 'negative'
                      ? 'text-red-500'
                      : 'text-muted-foreground'
                )}
              >
                {change > 0 ? '+' : ''}
                {change}%
              </span>
            </div>
          </div>
          <div className="rounded-full p-2 bg-primary/10">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardKPIs() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex animate-pulse space-y-3">
                <div className="h-14 w-full rounded-md bg-muted"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Automações Ativas"
        value={128}
        change={5.2}
        changeType="positive"
        icon={<Bot className="h-5 w-5 text-primary" />}
      />
      <KPICard
        title="Jobs em Andamento"
        value={24}
        change={12.8}
        changeType="positive"
        icon={<Play className="h-5 w-5 text-blue-500" />}
      />
      <KPICard
        title="Jobs Concluídos Hoje"
        value={1842}
        change={8.7}
        changeType="positive"
        icon={<CheckCircle className="h-5 w-5 text-green-500" />}
      />
      <KPICard
        title="Falhas (24h)"
        value={18}
        change={-3.5}
        changeType="positive"
        icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
      />
    </div>
  )
}
