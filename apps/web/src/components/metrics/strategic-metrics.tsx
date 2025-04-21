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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Dados de exemplo para os gráficos
const forecastData = [
  { month: "Jan", actual: 120, forecast: 120 },
  { month: "Fev", actual: 132, forecast: 125 },
  { month: "Mar", actual: 145, forecast: 130 },
  { month: "Abr", actual: 160, forecast: 140 },
  { month: "Mai", actual: 178, forecast: 150 },
  { month: "Jun", actual: 195, forecast: 160 },
  { month: "Jul", actual: 210, forecast: 170 },
  { month: "Ago", actual: 230, forecast: 180 },
  { month: "Set", actual: 245, forecast: 190 },
  { month: "Out", actual: 260, forecast: 200 },
  { month: "Nov", forecast: 210 },
  { month: "Dez", forecast: 220 },
]

const maturityData = [
  { subject: "Cobertura de Processos", A: 85, fullMark: 100 },
  { subject: "Complexidade", A: 70, fullMark: 100 },
  { subject: "Governança", A: 65, fullMark: 100 },
  { subject: "Integração", A: 80, fullMark: 100 },
  { subject: "Monitoramento", A: 75, fullMark: 100 },
  { subject: "Segurança", A: 90, fullMark: 100 },
]

const opportunityData = [
  { name: "Financeiro", value: 35, potential: 85, gap: 50 },
  { name: "Operações", value: 65, potential: 95, gap: 30 },
  { name: "RH", value: 25, potential: 80, gap: 55 },
  { name: "Vendas", value: 45, potential: 90, gap: 45 },
  { name: "Marketing", value: 30, potential: 75, gap: 45 },
]

const initiativeData = [
  {
    name: "Automação de Onboarding",
    status: "Em Progresso",
    completion: 65,
    impact: "Alto",
    roi: 320,
    timeline: "Q2 2023",
  },
  {
    name: "Integração ERP-CRM",
    status: "Planejado",
    completion: 20,
    impact: "Alto",
    roi: 280,
    timeline: "Q3 2023",
  },
  {
    name: "Automação de Relatórios",
    status: "Concluído",
    completion: 100,
    impact: "Médio",
    roi: 180,
    timeline: "Q1 2023",
  },
  {
    name: "Chatbot de Atendimento",
    status: "Em Progresso",
    completion: 45,
    impact: "Alto",
    roi: 250,
    timeline: "Q2 2023",
  },
  {
    name: "Automação de Backups",
    status: "Concluído",
    completion: 100,
    impact: "Baixo",
    roi: 120,
    timeline: "Q1 2023",
  },
]

export function StrategicMetrics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Previsão de Crescimento</CardTitle>
            <CardDescription>Automações atuais vs. previsão para os próximos meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={forecastData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} name="Automações Atuais" />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Previsão"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maturidade da Automação</CardTitle>
            <CardDescription>Avaliação de maturidade em diferentes dimensões</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={maturityData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Maturidade" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Oportunidades por Departamento</CardTitle>
            <CardDescription>Automação atual vs. potencial</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={opportunityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" name="Automação Atual (%)" />
                <Bar dataKey="potential" fill="#10b981" name="Potencial (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Iniciativas Estratégicas</CardTitle>
            <CardDescription>Status das principais iniciativas de automação</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Iniciativa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>ROI Est.</TableHead>
                  <TableHead>Timeline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initiativeData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          item.status === "Concluído"
                            ? "bg-green-50 text-green-700"
                            : item.status === "Em Progresso"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-yellow-50 text-yellow-700"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={item.completion} className="w-[60px]" />
                        <span className="text-xs">{item.completion}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.roi}%</TableCell>
                    <TableCell>{item.timeline}</TableCell>
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

