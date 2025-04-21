'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { cn } from '@/lib/utils'

// Dados de exemplo
const jobStatusData = [
  { name: 'Em andamento', value: 24, color: '#3b82f6' },
  { name: 'Sucesso', value: 1842, color: '#10b981' },
  { name: 'Falha', value: 18, color: '#ef4444' },
  { name: 'Cancelado', value: 5, color: '#f59e0b' },
]

const flowStatusData = [
  { name: 'Ativo', value: 85, color: '#3b82f6' },
  { name: 'Pausado', value: 12, color: '#f59e0b' },
  { name: 'Erro', value: 8, color: '#ef4444' },
  { name: 'Finalizado', value: 23, color: '#10b981' },
]

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-md shadow-md p-3">
        <p className="font-medium">{`${payload[0].name}`}</p>
        <p className="text-sm">{`Total: ${payload[0].value}`}</p>
        <p className="text-xs text-muted-foreground">{`${(payload[0].payload.percent * 100).toFixed(1)}%`}</p>
      </div>
    )
  }

  return null
}

export function DashboardCharts() {
  const [activeJobSegment, setActiveJobSegment] = useState<string | null>(null)
  const [activeFlowSegment, setActiveFlowSegment] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Preparar dados com percentuais
  const prepareData = (data: any[]) => {
    const total = data.reduce((sum, entry) => sum + entry.value, 0)
    return data.map((entry) => ({
      ...entry,
      percent: entry.value / total,
    }))
  }

  const jobData = prepareData(jobStatusData)
  const flowData = prepareData(flowStatusData)

  const handleJobClick = (data: any) => {
    setActiveJobSegment(activeJobSegment === data.name ? null : data.name)
    // Aqui você poderia disparar um evento para filtrar outros componentes
    console.log(`Filtrar por status de job: ${data.name}`)
  }

  const handleFlowClick = (data: any) => {
    setActiveFlowSegment(activeFlowSegment === data.name ? null : data.name)
    // Aqui você poderia disparar um evento para filtrar outros componentes
    console.log(`Filtrar por status de flow: ${data.name}`)
  }

  if (!isLoaded) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-1/3 rounded-md bg-muted animate-pulse"></div>
              <div className="h-4 w-1/2 rounded-md bg-muted animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full rounded-md bg-muted animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Status dos Jobs</CardTitle>
          <CardDescription>Distribuição de jobs por status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={jobData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  onClick={handleJobClick}
                  animationDuration={1000}
                  animationBegin={200}
                >
                  {jobData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={activeJobSegment === entry.name ? '#000' : 'transparent'}
                      strokeWidth={activeJobSegment === entry.name ? 2 : 0}
                      className="transition-all duration-200 hover:opacity-80 cursor-pointer"
                      style={{
                        filter: activeJobSegment && activeJobSegment !== entry.name ? 'opacity(0.6)' : 'none',
                        transform: activeJobSegment === entry.name ? 'scale(1.05)' : 'scale(1)',
                        transformOrigin: 'center',
                        transition: 'transform 0.3s, filter 0.3s',
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  formatter={(value, entry, index) => (
                    <span className={cn('text-sm', activeJobSegment === value ? 'font-bold' : 'font-normal')}>
                      {value}
                    </span>
                  )}
                  onClick={(data) => handleJobClick(data)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status dos Flows</CardTitle>
          <CardDescription>Distribuição de flows por status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={flowData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  onClick={handleFlowClick}
                  animationDuration={1000}
                  animationBegin={200}
                >
                  {flowData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={activeFlowSegment === entry.name ? '#000' : 'transparent'}
                      strokeWidth={activeFlowSegment === entry.name ? 2 : 0}
                      className="transition-all duration-200 hover:opacity-80 cursor-pointer"
                      style={{
                        filter: activeFlowSegment && activeFlowSegment !== entry.name ? 'opacity(0.6)' : 'none',
                        transform: activeFlowSegment === entry.name ? 'scale(1.05)' : 'scale(1)',
                        transformOrigin: 'center',
                        transition: 'transform 0.3s, filter 0.3s',
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  formatter={(value, entry, index) => (
                    <span className={cn('text-sm', activeFlowSegment === value ? 'font-bold' : 'font-normal')}>
                      {value}
                    </span>
                  )}
                  onClick={(data) => handleFlowClick(data)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
