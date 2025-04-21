'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Dados de exemplo
const executionData = [
  { date: '09/03', total: 120, success: 115, failed: 5 },
  { date: '10/03', total: 132, success: 128, failed: 4 },
  { date: '11/03', total: 145, success: 140, failed: 5 },
  { date: '12/03', total: 162, success: 155, failed: 7 },
  { date: '13/03', total: 180, success: 175, failed: 5 },
  { date: '14/03', total: 195, success: 190, failed: 5 },
  { date: '15/03', total: 205, success: 200, failed: 5 },
]

const durationData = [
  { name: '< 1s', count: 320 },
  { name: '1-5s', count: 520 },
  { name: '5-10s', count: 280 },
  { name: '10-30s', count: 120 },
  { name: '30-60s', count: 45 },
  { name: '1-5m', count: 20 },
  { name: '> 5m', count: 5 },
]

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-md shadow-md p-3">
        <p className="font-medium">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    )
  }

  return null
}

export function DashboardTrends() {
  const [activeTab, setActiveTab] = useState('executions')
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
          <div className="h-[300px] w-full rounded-md bg-muted animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <Tabs defaultValue="executions" value={activeTab} onValueChange={setActiveTab}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tendências</CardTitle>
              <CardDescription>Análise de tendências dos últimos 7 dias</CardDescription>
            </div>
            <TabsList>
              <TabsTrigger value="executions">Execuções</TabsTrigger>
              <TabsTrigger value="duration">Duração</TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="executions" className="m-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={executionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    animationDuration={1500}
                    name="Total"
                  />
                  <Line
                    type="monotone"
                    dataKey="success"
                    stroke="#10b981"
                    strokeWidth={2}
                    animationDuration={1500}
                    animationBegin={300}
                    name="Sucesso"
                  />
                  <Line
                    type="monotone"
                    dataKey="failed"
                    stroke="#ef4444"
                    strokeWidth={2}
                    animationDuration={1500}
                    animationBegin={600}
                    name="Falha"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="duration" className="m-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={durationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    animationDuration={1500}
                    name="Quantidade"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}
