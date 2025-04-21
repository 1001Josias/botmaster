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
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

// Dados de exemplo para os gráficos
const errorRateData = [
  { day: '01/03', rate: 2.5 },
  { day: '02/03', rate: 2.3 },
  { day: '03/03', rate: 2.1 },
  { day: '04/03', rate: 1.8 },
  { day: '05/03', rate: 1.9 },
  { day: '06/03', rate: 1.7 },
  { day: '07/03', rate: 1.5 },
  { day: '08/03', rate: 1.3 },
  { day: '09/03', rate: 1.2 },
  { day: '10/03', rate: 1.0 },
  { day: '11/03', rate: 0.9 },
  { day: '12/03', rate: 0.8 },
  { day: '13/03', rate: 0.7 },
  { day: '14/03', rate: 0.5 },
]

const slaData = [
  { name: 'Dentro do SLA', value: 92, color: '#10b981' },
  { name: 'Fora do SLA', value: 8, color: '#ef4444' },
]

const errorTypeData = [
  { type: 'Conexão de API', count: 45 },
  { type: 'Timeout', count: 32 },
  { type: 'Validação de Dados', count: 28 },
  { type: 'Permissões', count: 15 },
  { type: 'Configuração', count: 12 },
  { type: 'Outros', count: 8 },
]

const incidentData = [
  {
    id: 'INC-001',
    description: 'Falha na integração com API de pagamentos',
    severity: 'Alta',
    status: 'Resolvido',
    timeToResolve: '45 min',
    impact: '120 transações afetadas',
  },
  {
    id: 'INC-002',
    description: 'Timeout em processamento de relatórios',
    severity: 'Média',
    status: 'Resolvido',
    timeToResolve: '30 min',
    impact: '5 relatórios atrasados',
  },
  {
    id: 'INC-003',
    description: 'Erro de validação em formulário de cadastro',
    severity: 'Baixa',
    status: 'Resolvido',
    timeToResolve: '15 min',
    impact: '8 cadastros afetados',
  },
  {
    id: 'INC-004',
    description: 'Falha na sincronização de estoque',
    severity: 'Alta',
    status: 'Em Andamento',
    timeToResolve: '-',
    impact: 'Estoque parcialmente desatualizado',
  },
  {
    id: 'INC-005',
    description: 'Erro em notificações push',
    severity: 'Média',
    status: 'Resolvido',
    timeToResolve: '25 min',
    impact: '50 notificações não enviadas',
  },
]

const reliabilityData = [
  { workflow: 'Processamento de Pedidos', uptime: 99.95, mttr: 12, mtbf: 720 },
  { workflow: 'Sincronização de Estoque', uptime: 99.8, mttr: 18, mtbf: 480 },
  { workflow: 'Geração de Relatórios', uptime: 99.99, mttr: 5, mtbf: 960 },
  { workflow: 'Processamento de Pagamentos', uptime: 99.9, mttr: 15, mtbf: 640 },
  { workflow: 'Envio de Notificações', uptime: 99.85, mttr: 10, mtbf: 720 },
]

export function QualityMetrics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Erro</CardTitle>
            <CardDescription>Percentual de execuções com erro ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={errorRateData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={2} name="Taxa de Erro (%)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cumprimento de SLA</CardTitle>
            <CardDescription>Percentual de execuções dentro do SLA acordado</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full max-w-md">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={slaData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  >
                    {slaData.map((entry, index) => (
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
            <CardTitle>Tipos de Erro</CardTitle>
            <CardDescription>Distribuição dos erros por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={errorTypeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incidentes Recentes</CardTitle>
            <CardDescription>Últimos incidentes reportados</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Severidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tempo de Resolução</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidentData.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-mono text-xs">{incident.id}</TableCell>
                    <TableCell className="font-medium">{incident.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          incident.severity === 'Alta'
                            ? 'bg-red-50 text-red-700'
                            : incident.severity === 'Média'
                              ? 'bg-yellow-50 text-yellow-700'
                              : 'bg-blue-50 text-blue-700'
                        }
                      >
                        {incident.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          incident.status === 'Resolvido' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                        }
                      >
                        {incident.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{incident.timeToResolve}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Confiabilidade dos Workflows</CardTitle>
          <CardDescription>Métricas de confiabilidade dos principais workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow</TableHead>
                <TableHead className="text-right">Uptime</TableHead>
                <TableHead className="text-right">MTTR (min)</TableHead>
                <TableHead className="text-right">MTBF (horas)</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reliabilityData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.workflow}</TableCell>
                  <TableCell className="text-right">{item.uptime}%</TableCell>
                  <TableCell className="text-right">{item.mttr}</TableCell>
                  <TableCell className="text-right">{item.mtbf}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        item.uptime >= 99.9
                          ? 'bg-green-50 text-green-700'
                          : item.uptime >= 99.5
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-red-50 text-red-700'
                      }
                    >
                      {item.uptime >= 99.9 ? 'Excelente' : item.uptime >= 99.5 ? 'Bom' : 'Precisa Melhorar'}
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
