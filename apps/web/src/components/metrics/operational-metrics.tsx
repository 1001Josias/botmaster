"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

// Dados de exemplo para os gráficos
const executionData = [
  { name: "01/03", workflows: 65, workers: 42, total: 107 },
  { name: "02/03", workflows: 59, workers: 45, total: 104 },
  { name: "03/03", workflows: 80, workers: 51, total: 131 },
  { name: "04/03", workflows: 81, workers: 49, total: 130 },
  { name: "05/03", workflows: 56, workers: 38, total: 94 },
  { name: "06/03", workflows: 55, workers: 40, total: 95 },
  { name: "07/03", workflows: 72, workers: 45, total: 117 },
  { name: "08/03", workflows: 90, workers: 52, total: 142 },
  { name: "09/03", workflows: 95, workers: 55, total: 150 },
  { name: "10/03", workflows: 102, workers: 58, total: 160 },
  { name: "11/03", workflows: 110, workers: 62, total: 172 },
  { name: "12/03", workflows: 105, workers: 60, total: 165 },
  { name: "13/03", workflows: 115, workers: 65, total: 180 },
  { name: "14/03", workflows: 120, workers: 68, total: 188 },
]

const statusData = [
  { name: "Concluído", value: 1245, color: "#10b981" },
  { name: "Em Execução", value: 42, color: "#3b82f6" },
  { name: "Falha", value: 18, color: "#ef4444" },
  { name: "Cancelado", value: 5, color: "#f59e0b" },
]

const durationData = [
  { name: "< 1s", count: 320 },
  { name: "1-5s", count: 520 },
  { name: "5-10s", count: 280 },
  { name: "10-30s", count: 120 },
  { name: "30-60s", count: 45 },
  { name: "1-5m", count: 20 },
  { name: "> 5m", count: 5 },
]

const topWorkflows = [
  { id: "WF-001", name: "Processamento de Pedidos", executions: 245, avgDuration: "1.2s", successRate: 99.2 },
  { id: "WF-002", name: "Sincronização de Estoque", executions: 189, avgDuration: "3.5s", successRate: 98.7 },
  { id: "WF-003", name: "Geração de Relatórios", executions: 156, avgDuration: "8.7s", successRate: 100 },
  { id: "WF-004", name: "Processamento de Pagamentos", executions: 132, avgDuration: "2.1s", successRate: 97.8 },
  { id: "WF-005", name: "Envio de Notificações", executions: 128, avgDuration: "0.8s", successRate: 99.5 },
]

const executionData2 = [
  { month: 'Jan', success: 1250, failed: 50, pending: 30 },
  { month: 'Fev', success: 1380, failed: 45, pending: 25 },
  { month: 'Mar', success: 1520, failed: 60, pending: 35 },
  { month: 'Abr', success: 1650, failed: 40, pending: 20 },
  { month: 'Mai', success: 1800, failed: 55, pending: 30 },
  { month: 'Jun', success: 1950, failed: 65, pending: 40 },
]

const cycleTimeData = [
  { month: 'Jan', avgCycleTime: 45, minCycleTime: 12, maxCycleTime: 120 },
  { month: 'Fev', avgCycleTime: 42, minCycleTime: 10, maxCycleTime: 115 },
  { month: 'Mar', avgCycleTime: 38, minCycleTime: 9, maxCycleTime: 105 },
  { month: 'Abr', avgCycleTime: 35, minCycleTime: 8, maxCycleTime: 95 },
  { month: 'Mai', avgCycleTime: 32, minCycleTime: 7, maxCycleTime: 90 },
  { month: 'Jun', avgCycleTime: 30, minCycleTime: 7, maxCycleTime: 85 },
]

const fteData = [
  { month: 'Jan', savedFTE: 3.2, automatedHours: 520 },
  { month: 'Fev', savedFTE: 3.5, automatedHours: 560 },
  { month: 'Mar', savedFTE: 3.8, automatedHours: 610 },
  { month: 'Abr', savedFTE: 4.2, automatedHours: 670 },
  { month: 'Mai', savedFTE: 4.6, automatedHours: 740 },
  { month: 'Jun', savedFTE: 5.1, automatedHours: 820 },
]

const resourceUtilizationData = [
  { resource: 'Worker 1', utilization: 85, jobs: 320, avgDuration: 45 },
  { resource: 'Worker 2', utilization: 72, jobs: 280, avgDuration: 38 },
  { resource: 'Worker 3', utilization: 90, jobs: 350, avgDuration: 52 },
  { resource: 'Worker 4', utilization: 65, jobs: 240, avgDuration: 32 },
  { resource: 'Worker 5', utilization: 78, jobs: 300, avgDuration: 42 },
]

const processMetricsData = [
  {
    process: 'Onboarding de Clientes',
    beforeCycleTime: '72 horas',
    afterCycleTime: '4 horas',
    improvement: '94%',
    fteReduction: '2.5',
  },
  {
    process: 'Processamento de Pedidos',
    beforeCycleTime: '48 horas',
    afterCycleTime: '2 horas',
    improvement: '96%',
    fteReduction: '1.8',
  },
  {
    process: 'Reconciliação Financeira',
    beforeCycleTime: '120 horas',
    afterCycleTime: '8 horas',
    improvement: '93%',
    fteReduction: '3.2',
  },
  {
    process: 'Geração de Relatórios',
    beforeCycleTime: '24 horas',
    afterCycleTime: '10 minutos',
    improvement: '99%',
    fteReduction: '0.8',
  },
  {
    process: 'Atendimento de Tickets',
    beforeCycleTime: '12 horas',
    afterCycleTime: '30 minutos',
    improvement: '96%',
    fteReduction: '1.5',
  },
]

export function OperationalMetrics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Execuções por Dia</CardTitle>
            <CardDescription>Total de execuções de workflows e workers por dia</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={executionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="workflows" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="workers" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status das Execuções</CardTitle>
            <CardDescription>Distribuição dos status de execução</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full max-w-md">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Duração</CardTitle>
            <CardDescription>Tempo de execução das automações</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={durationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Workflows</CardTitle>
            <CardDescription>Workflows mais executados no período</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workflow</TableHead>
                  <TableHead className="text-right">Execuções</TableHead>
                  <TableHead className="text-right">Duração Média</TableHead>
                  <TableHead className="text-right">Taxa de Sucesso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topWorkflows.map((workflow) => (
                  <TableRow key={workflow.id}>
                    <TableCell className="font-medium">{workflow.name}</TableCell>
                    <TableCell className="text-right">{workflow.executions}</TableCell>
                    <TableCell className="text-right">{workflow.avgDuration}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          workflow.successRate >= 99
                            ? "bg-green-50 text-green-700"
                            : workflow.successRate >= 95
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-red-50 text-red-700"
                        }
                      >
                        {workflow.successRate}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Execuções por Mês</CardTitle>
            <CardDescription>Total de execuções por status</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                success: {
                  label: 'Sucesso',
                  color: '#10b981',
                },
                failed: {
                  label: 'Falha',
                  color: '#ef4444',
                },
                pending: {
                  label: 'Pendente',
                  color: '#f59e0b',
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={executionData2} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="success" stackId="a" fill="var(--color-success)" name="Sucesso" />
                  <Bar dataKey="failed" stackId="a" fill="var(--color-failed)" name="Falha" />
                  <Bar dataKey="pending" stackId="a" fill="var(--color-pending)" name="Pendente" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cycle Time</CardTitle>
            <CardDescription>Tempo médio, mínimo e máximo de ciclo (minutos)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                avgCycleTime: {
                  label: 'Tempo Médio',
                  color: '#3b82f6',
                },
                minCycleTime: {
                  label: 'Tempo Mínimo',
                  color: '#10b981',
                },
                maxCycleTime: {
                  label: 'Tempo Máximo',
                  color: '#f59e0b',
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cycleTimeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgCycleTime"
                    stroke="var(--color-avgCycleTime)"
                    strokeWidth={2}
                    name="Tempo Médio"
                  />
                  <Line
                    type="monotone"
                    dataKey="minCycleTime"
                    stroke="var(--color-minCycleTime)"
                    strokeWidth={2}
                    name="Tempo Mínimo"
                  />
                  <Line
                    type="monotone"
                    dataKey="maxCycleTime"
                    stroke="var(--color-maxCycleTime)"
                    strokeWidth={2}
                    name="Tempo Máximo"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Economia de FTE</CardTitle>
            <CardDescription>FTEs economizados e horas automatizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                savedFTE: {
                  label: 'FTE Economizado',
                  color: '#3b82f6',
                },
                automatedHours: {
                  label: 'Horas Automatizadas',
                  color: '#10b981',
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={fteData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="savedFTE" fill="var(--color-savedFTE)" name="FTE Economizado" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="automatedHours"
                    stroke="var(--color-automatedHours)"
                    strokeWidth={2}
                    name="Horas Automatizadas"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Utilização de Recursos</CardTitle>
            <CardDescription>Taxa de utilização por worker (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                utilization: {
                  label: 'Utilização (%)',
                  color: '#3b82f6',
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={resourceUtilizationData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="resource" type="category" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="utilization" fill="var(--color-utilization)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Métricas de Processos</CardTitle>
          <CardDescription>Comparação de cycle time e redução de FTE por processo</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Processo</TableHead>
                <TableHead>Cycle Time Anterior</TableHead>
                <TableHead>Cycle Time Atual</TableHead>
                <TableHead>Melhoria</TableHead>
                <TableHead>Redução de FTE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processMetricsData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.process}</TableCell>
                  <TableCell>{item.beforeCycleTime}</TableCell>
                  <TableCell>{item.afterCycleTime}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {item.improvement}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.fteReduction}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

