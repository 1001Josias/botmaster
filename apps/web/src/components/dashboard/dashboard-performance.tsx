'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Cpu, MemoryStickIcon as Memory, HardDrive, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PerformanceMetricProps {
  title: string
  value: number
  icon: React.ReactNode
  description?: string
  colorClass?: string
}

function PerformanceMetric({ title, value, icon, description, colorClass }: PerformanceMetricProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(value), 500)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{title}</span>
        </div>
        <span className="text-sm font-bold">{value}%</span>
      </div>
      <Progress value={progress} className={cn('h-2', colorClass)} />
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}

export function DashboardPerformance() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-1/3 rounded-md bg-muted animate-pulse"></div>
          <div className="h-4 w-1/2 rounded-md bg-muted animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-1/3 rounded-md bg-muted animate-pulse"></div>
                  <div className="h-4 w-[40px] rounded-md bg-muted animate-pulse"></div>
                </div>
                <div className="h-2 w-full rounded-md bg-muted animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho do Sistema</CardTitle>
        <CardDescription>Métricas de utilização de recursos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <PerformanceMetric
          title="CPU"
          value={65}
          icon={<Cpu className="h-4 w-4 text-blue-500" />}
          description="8 cores, 2.5 GHz"
          colorClass={65 < 50 ? 'bg-green-500' : 65 < 80 ? 'bg-yellow-500' : 'bg-red-500'}
        />

        <PerformanceMetric
          title="Memória"
          value={48}
          icon={<Memory className="h-4 w-4 text-purple-500" />}
          description="16 GB total"
          colorClass={48 < 50 ? 'bg-green-500' : 48 < 80 ? 'bg-yellow-500' : 'bg-red-500'}
        />

        <PerformanceMetric
          title="Disco"
          value={32}
          icon={<HardDrive className="h-4 w-4 text-orange-500" />}
          description="500 GB total"
          colorClass={32 < 50 ? 'bg-green-500' : 32 < 80 ? 'bg-yellow-500' : 'bg-red-500'}
        />

        <PerformanceMetric
          title="Tempo de Resposta"
          value={85}
          icon={<Clock className="h-4 w-4 text-green-500" />}
          description="Média: 120ms"
          colorClass={85 > 80 ? 'bg-green-500' : 85 > 50 ? 'bg-yellow-500' : 'bg-red-500'}
        />
      </CardContent>
    </Card>
  )
}
