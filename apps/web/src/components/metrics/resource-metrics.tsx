"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
import { Progress } from "@/components/ui/progress"

// Dados de exemplo para os gráficos
const resourceUsageData = [
  { hour: "00:00", cpu: 25, memory: 40, disk: 35 },
  { hour: "02:00", cpu: 20, memory: 38, disk: 35 },
  { hour: "04:00", cpu: 15, memory: 35, disk: 36 },
  { hour: "06:00", cpu: 18, memory: 37, disk: 36 },
  { hour: "08:00", cpu: 35, memory: 45, disk: 37 },
  { hour: "10:00", cpu: 55, memory: 55, disk: 38 },
  { hour: "12:00", cpu: 65, memory: 60, disk: 38 },
  { hour: "14:00", cpu: 70, memory: 65, disk: 39 },
  { hour: "16:00", cpu: 68, memory: 63, disk: 39 },
  { hour: "18:00", cpu: 60, memory: 58, disk: 40 },
  { hour: "20:00", cpu: 45, memory: 50, disk: 40 },
  { hour: "22:00", cpu: 30, memory: 45, disk: 41 },
]

const machineDistributionData = [
  { name: "AWS US-East", value: 45, color: "#3b82f6" },
  { name: "AWS US-West", value: 20, color: "#10b981" },
  { name: "GCP Europe", value: 15, color: "#8b5cf6" },
  { name: "Azure East Asia", value: 10, color: "#f59e0b" },
  { name: "On-Premise", value: 10, color: "#ef4444" },
]

const costData = [
  { month: "Jan", machines: 5000, storage: 2000, network: 1000, total: 8000 },
  { month: "Fev", machines: 5200, storage: 2100, network: 1100, total: 8400 },
  { month: "Mar", machines: 5500, storage: 2200, network: 1200, total: 8900 },
  { month: "Abr", machines: 5800, storage: 2300, network: 1300, total: 9400 },
  { month: "Mai", machines: 6000, storage: 2400, network: 1400, total: 9800 },
  { month: "Jun", machines: 6200, storage: 2500, network: 1500, total: 10200 },
  { month: "Jul", machines: 6500, storage: 2600, network: 1600, total: 10700 },
  { month: "Ago", machines: 6800, storage: 2700, network: 1700, total: 11200 },
  { month: "Set", machines: 7000, storage: 2800, network: 1800, total: 11600 },
  { month: "Out", machines: 7200, storage: 2900, network: 1900, total: 12000 },
  { month: "Nov", machines: 7500, storage: 3000, network: 2000, total: 12500 },
  { month: "Dez", machines: 7800, storage: 3100, network: 2100, total: 13000 },
]

const machineData = [
  {
    id: "MCH-001",
    name: "Production Server 1",
    location: "AWS US-East",
    cpu: 65,
    memory: 72,
    disk: 45,
    jobs: 245,
    status: "Online",
  },
  {
    id: "MCH-002",
    name: "Production Server 2",
    location: "AWS US-East",
    cpu: 58,
    memory: 65,
    disk: 40,
    jobs: 210,
    status: "Online",
  },
  {
    id: "MCH-003",
    name: "Development Server",
    location: "AWS US-West",
    cpu: 35,
    memory: 42,
    disk: 30,
    jobs: 120,
    status: "Online",
  },
  {
    id: "MCH-004",
    name: "Testing Server",
    location: "GCP Europe",
    cpu: 25,
    memory: 30,
    disk: 25,
    jobs: 85,
    status: "Online",
  },
  {
    id: "MCH-005",
    name: "Backup Server",
    location: "Azure East Asia",
    cpu: 15,
    memory: 25,
    disk: 75,
    jobs: 45,
    status: "Online",
  },
]

export function ResourceMetrics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Uso de Recursos</CardTitle>
            <CardDescription>Utilização de CPU, memória e disco ao longo do dia</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={resourceUsageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line type="monotone" dataKey="cpu" stroke="#ef4444" strokeWidth={2} name="CPU (%)" />
                <Line type="monotone" dataKey="memory" stroke="#3b82f6" strokeWidth={2} name="Memória (%)" />
                <Line type="monotone" dataKey="disk" stroke="#10b981" strokeWidth={2} name="Disco (%)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Máquinas</CardTitle>
            <CardDescription>Distribuição por localização/provedor</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full max-w-md">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={machineDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  >
                    {machineDistributionData.map((entry, index) => (
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
            <CardTitle>Custos de Infraestrutura</CardTitle>
            <CardDescription>Custos mensais por categoria (R$)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={costData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="machines" stackId="a" fill="#3b82f6" name="Máquinas" />
                <Bar dataKey="storage" stackId="a" fill="#10b981" name="Armazenamento" />
                <Bar dataKey="network" stackId="a" fill="#8b5cf6" name="Rede" />
                <Line type="monotone" dataKey="total" stroke="#ef4444" strokeWidth={2} name="Total" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Desempenho das Máquinas</CardTitle>
            <CardDescription>Utilização de recursos e jobs processados</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Máquina</TableHead>
                  <TableHead>CPU</TableHead>
                  <TableHead>Memória</TableHead>
                  <TableHead>Disco</TableHead>
                  <TableHead className="text-right">Jobs</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machineData.map((machine) => (
                  <TableRow key={machine.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{machine.name}</div>
                        <div className="text-xs text-muted-foreground">{machine.location}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={machine.cpu} className="w-[60px]" />
                        <span className="text-xs">{machine.cpu}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={machine.memory} className="w-[60px]" />
                        <span className="text-xs">{machine.memory}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={machine.disk} className="w-[60px]" />
                        <span className="text-xs">{machine.disk}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{machine.jobs}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {machine.status}
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

