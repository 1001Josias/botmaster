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
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

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
    </div>
  )
}

