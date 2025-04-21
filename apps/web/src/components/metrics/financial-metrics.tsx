"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Dados de exemplo para os gráficos
const paybackData = [
  { name: "Automação de Onboarding", investment: 120000, savings: 15000, paybackMonths: 8 },
  { name: "Processamento de Faturas", investment: 85000, savings: 12000, paybackMonths: 7.1 },
  { name: "Reconciliação Bancária", investment: 95000, savings: 18000, paybackMonths: 5.3 },
  { name: "Geração de Relatórios", investment: 65000, savings: 8000, paybackMonths: 8.1 },
  { name: "Atendimento ao Cliente", investment: 110000, savings: 22000, paybackMonths: 5 },
  { name: "Integração de Sistemas", investment: 150000, savings: 25000, paybackMonths: 6 },
]

const roiTrendData = [
  { month: "Jan", roi: 110, payback: 9.5 },
  { month: "Fev", roi: 115, payback: 9.2 },
  { month: "Mar", roi: 120, payback: 8.8 },
  { month: "Abr", roi: 125, payback: 8.5 },
  { month: "Mai", roi: 135, payback: 8.0 },
  { month: "Jun", roi: 145, payback: 7.5 },
  { month: "Jul", roi: 160, payback: 7.0 },
  { month: "Ago", roi: 175, payback: 6.5 },
  { month: "Set", roi: 190, payback: 6.0 },
  { month: "Out", roi: 210, payback: 5.5 },
  { month: "Nov", roi: 230, payback: 5.0 },
  { month: "Dez", roi: 250, payback: 4.5 },
]

const investmentBreakdownData = [
  { name: "Desenvolvimento", value: 45, color: "#3b82f6" },
  { name: "Licenças", value: 20, color: "#10b981" },
  { name: "Infraestrutura", value: 15, color: "#8b5cf6" },
  { name: "Treinamento", value: 10, color: "#f59e0b" },
  { name: "Manutenção", value: 10, color: "#ef4444" },
]

const projectFinancialsData = [
  {
    project: "Automação de Onboarding",
    investment: "R$ 120.000",
    annualSavings: "R$ 180.000",
    roi: "150%",
    payback: "8 meses",
    npv: "R$ 320.000",
    irr: "65%",
  },
  {
    project: "Processamento de Faturas",
    investment: "R$ 85.000",
    annualSavings: "R$ 144.000",
    roi: "169%",
    payback: "7.1 meses",
    npv: "R$ 245.000",
    irr: "72%",
  },
  {
    project: "Reconciliação Bancária",
    investment: "R$ 95.000",
    annualSavings: "R$ 216.000",
    roi: "227%",
    payback: "5.3 meses",
    npv: "R$ 380.000",
    irr: "85%",
  },
  {
    project: "Geração de Relatórios",
    investment: "R$ 65.000",
    annualSavings: "R$ 96.000",
    roi: "148%",
    payback: "8.1 meses",
    npv: "R$ 170.000",
    irr: "62%",
  },
  {
    project: "Atendimento ao Cliente",
    investment: "R$ 110.000",
    annualSavings: "R$ 264.000",
    roi: "240%",
    payback: "5 meses",
    npv: "R$ 420.000",
    irr: "90%",
  },
]

export function FinancialMetrics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Período de Payback por Projeto</CardTitle>
            <CardDescription>Tempo necessário para recuperar o investimento (em meses)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                paybackMonths: {
                  label: "Payback (meses)",
                  color: '#3b82f6',
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paybackData} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="paybackMonths" fill="var(--color-paybackMonths)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendência de ROI e Payback</CardTitle>
            <CardDescription>Evolução do ROI (%) e período de payback (meses)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                roi: {
                  label: "ROI (%)",
                  color: '#3b82f6',
                },
                payback: {
                  label: "Payback (meses)",
                  color: '#10b981',
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={roiTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="roi"
                    stroke="var(--color-roi)"
                    strokeWidth={2}
                    name="ROI (%)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="payback"
                    stroke="var(--color-payback)"
                    strokeWidth={2}
                    name="Payback (meses)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Investimentos</CardTitle>
            <CardDescription>Alocação de recursos por categoria</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full max-w-md">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={investmentBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  >
                    {investmentBreakdownData.map((entry, index) => (
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
            <CardTitle>Análise de Investimento vs. Economia</CardTitle>
            <CardDescription>Comparação entre investimento e economia anual (R$)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                investment: {
                  label: "Investimento (R$)",
                  color: '#3b82f6',
                },
                savings: {
                  label: "Economia Anual (R$)",
                  color: '#10b981',
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paybackData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="investment" fill="var(--color-investment)" name="Investimento (R$)" />
                  <Bar dataKey="savings" fill="var(--color-savings)" name="Economia Mensal (R$)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Análise Financeira de Projetos</CardTitle>
          <CardDescription>Métricas financeiras detalhadas por projeto</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projeto</TableHead>
                <TableHead>Investimento</TableHead>
                <TableHead>Economia Anual</TableHead>
                <TableHead>ROI</TableHead>
                <TableHead>Payback</TableHead>
                <TableHead>VPL</TableHead>
                <TableHead>TIR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectFinancialsData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.project}</TableCell>
                  <TableCell>{item.investment}</TableCell>
                  <TableCell>{item.annualSavings}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {item.roi}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.payback}</TableCell>
                  <TableCell>{item.npv}</TableCell>
                  <TableCell>{item.irr}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

