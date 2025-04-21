'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  AreaChart,
  Area,
} from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

// Dados de exemplo para os gráficos
const timeData = [
  { month: 'Jan', manual: 320, automated: 180, saved: 140 },
  { month: 'Fev', manual: 320, automated: 160, saved: 160 },
  { month: 'Mar', manual: 320, automated: 140, saved: 180 },
  { month: 'Abr', manual: 320, automated: 120, saved: 200 },
  { month: 'Mai', manual: 320, automated: 100, saved: 220 },
  { month: 'Jun', manual: 320, automated: 90, saved: 230 },
  { month: 'Jul', manual: 320, automated: 80, saved: 240 },
  { month: 'Ago', manual: 320, automated: 70, saved: 250 },
  { month: 'Set', manual: 320, automated: 60, saved: 260 },
  { month: 'Out', manual: 320, automated: 50, saved: 270 },
  { month: 'Nov', manual: 320, automated: 40, saved: 280 },
  { month: 'Dez', manual: 320, automated: 30, saved: 290 },
]

const roiData = [
  { month: 'Jan', investment: 50000, savings: 35000, roi: 70 },
  { month: 'Fev', investment: 55000, savings: 42000, roi: 76 },
  { month: 'Mar', investment: 60000, savings: 48000, roi: 80 },
  { month: 'Abr', investment: 62000, savings: 52000, roi: 84 },
  { month: 'Mai', investment: 65000, savings: 58000, roi: 89 },
  { month: 'Jun', investment: 68000, savings: 65000, roi: 96 },
  { month: 'Jul', investment: 70000, savings: 72000, roi: 103 },
  { month: 'Ago', investment: 72000, savings: 80000, roi: 111 },
  { month: 'Set', investment: 75000, savings: 90000, roi: 120 },
  { month: 'Out', investment: 78000, savings: 100000, roi: 128 },
  { month: 'Nov', investment: 80000, savings: 110000, roi: 138 },
  { month: 'Dez', investment: 82000, savings: 120000, roi: 146 },
]

const departmentData = [
  { name: 'Financeiro', value: 35, color: '#3b82f6' },
  { name: 'Operações', value: 25, color: '#10b981' },
  { name: 'RH', value: 15, color: '#8b5cf6' },
  { name: 'Vendas', value: 12, color: '#f59e0b' },
  { name: 'Marketing', value: 8, color: '#ef4444' },
  { name: 'TI', value: 5, color: '#6366f1' },
]

const costSavingsData = [
  { category: 'Redução de Erros', value: 120000 },
  { category: 'Tempo de Funcionários', value: 280000 },
  { category: 'Processamento Mais Rápido', value: 95000 },
  { category: 'Redução de Sistemas Legados', value: 65000 },
  { category: 'Melhor Utilização de Recursos', value: 45000 },
]

const businessImpactData = [
  {
    metric: 'Tempo de Processamento de Pedidos',
    before: '48 horas',
    after: '2 horas',
    improvement: '96%',
    impact: 'Alto',
  },
  {
    metric: 'Taxa de Erro em Faturamento',
    before: '5.2%',
    after: '0.3%',
    improvement: '94%',
    impact: 'Alto',
  },
  {
    metric: 'Tempo de Onboarding de Clientes',
    before: '5 dias',
    after: '1 dia',
    improvement: '80%',
    impact: 'Médio',
  },
  {
    metric: 'Tempo de Geração de Relatórios',
    before: '24 horas',
    after: '10 minutos',
    improvement: '99%',
    impact: 'Alto',
  },
  {
    metric: 'Tempo de Resposta ao Cliente',
    before: '12 horas',
    after: '1 hora',
    improvement: '92%',
    impact: 'Alto',
  },
]

export function BusinessMetrics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Economia de Tempo</CardTitle>
            <CardDescription>Horas economizadas por mês com automação</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="manual"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name="Tempo Manual (h)"
                />
                <Area
                  type="monotone"
                  dataKey="automated"
                  stackId="1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  name="Tempo Automatizado (h)"
                />
                <Area
                  type="monotone"
                  dataKey="saved"
                  stackId="1"
                  stroke="#ffc658"
                  fill="#ffc658"
                  name="Tempo Economizado (h)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ROI da Automação</CardTitle>
            <CardDescription>Retorno sobre investimento ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={roiData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="investment" stroke="#8884d8" name="Investimento (R$)" />
                <Line yAxisId="left" type="monotone" dataKey="savings" stroke="#82ca9d" name="Economia (R$)" />
                <Line yAxisId="right" type="monotone" dataKey="roi" stroke="#ff7300" name="ROI (%)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Automação por Departamento</CardTitle>
            <CardDescription>Distribuição de automações por área de negócio</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full max-w-md">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Economia de Custos</CardTitle>
            <CardDescription>Economia por categoria (R$)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costSavingsData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" />
                <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Impacto nos Processos de Negócio</CardTitle>
          <CardDescription>Comparação antes e depois da automação</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Métrica</TableHead>
                <TableHead>Antes</TableHead>
                <TableHead>Depois</TableHead>
                <TableHead>Melhoria</TableHead>
                <TableHead>Impacto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {businessImpactData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.metric}</TableCell>
                  <TableCell>{item.before}</TableCell>
                  <TableCell>{item.after}</TableCell>
                  <TableCell>{item.improvement}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        item.impact === 'Alto'
                          ? 'bg-green-50 text-green-700'
                          : item.impact === 'Médio'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-blue-50 text-blue-700'
                      }
                    >
                      {item.impact}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
