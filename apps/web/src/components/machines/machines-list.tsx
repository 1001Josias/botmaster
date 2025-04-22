'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  MoreVertical,
  Edit,
  Trash2,
  Server,
  Activity,
  PowerOff,
  RefreshCw,
  Terminal,
  Cpu,
  HardDrive,
  MemoryStickIcon as Memory,
  Globe,
  ShieldAlert,
} from 'lucide-react'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'

// Dados de exemplo para as máquinas
const machines = [
  {
    id: 'MCH-001',
    name: 'Production Server 1',
    status: 'online',
    ip: '192.168.1.101',
    location: 'AWS US-East',
    os: 'Ubuntu 22.04 LTS',
    cpu: 65,
    memory: 48,
    disk: 32,
    workers: 5,
    lastSeen: '2023-03-15T14:30:00',
    autoRestart: true,
  },
  {
    id: 'MCH-002',
    name: 'Production Server 2',
    status: 'online',
    ip: '192.168.1.102',
    location: 'AWS US-East',
    os: 'Ubuntu 22.04 LTS',
    cpu: 42,
    memory: 35,
    disk: 28,
    workers: 4,
    lastSeen: '2023-03-15T14:35:00',
    autoRestart: true,
  },
  {
    id: 'MCH-003',
    name: 'Development Server',
    status: 'online',
    ip: '192.168.1.103',
    location: 'AWS US-West',
    os: 'Debian 11',
    cpu: 25,
    memory: 30,
    disk: 45,
    workers: 3,
    lastSeen: '2023-03-15T14:32:00',
    autoRestart: false,
  },
  {
    id: 'MCH-004',
    name: 'Testing Server',
    status: 'maintenance',
    ip: '192.168.1.104',
    location: 'GCP Europe',
    os: 'CentOS 8',
    cpu: 0,
    memory: 0,
    disk: 22,
    workers: 0,
    lastSeen: '2023-03-15T10:15:00',
    autoRestart: false,
  },
  {
    id: 'MCH-005',
    name: 'Backup Server',
    status: 'offline',
    ip: '192.168.1.105',
    location: 'Azure East Asia',
    os: 'Ubuntu 20.04 LTS',
    cpu: 0,
    memory: 0,
    disk: 75,
    workers: 0,
    lastSeen: '2023-03-14T22:45:00',
    autoRestart: true,
  },
  {
    id: 'MCH-006',
    name: 'Processing Server',
    status: 'online',
    ip: '192.168.1.106',
    location: 'AWS US-East',
    os: 'Ubuntu 22.04 LTS',
    cpu: 78,
    memory: 82,
    disk: 55,
    workers: 8,
    lastSeen: '2023-03-15T14:29:00',
    autoRestart: true,
  },
]

export function MachinesList() {
  const [page, setPage] = useState(1)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Online
          </Badge>
        )
      case 'offline':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Offline
          </Badge>
        )
      case 'maintenance':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Manutenção
          </Badge>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const getProgressColor = (value: number) => {
    if (value < 50) return 'bg-green-500'
    if (value < 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const toggleAutoRestart = (machineId: string) => {
    // Em uma aplicação real, isso enviaria uma requisição para a API
    console.log(`Alterando auto restart da máquina ${machineId}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Máquinas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Sistema</TableHead>
              <TableHead>Recursos</TableHead>
              <TableHead>Workers</TableHead>
              <TableHead>Auto Restart</TableHead>
              <TableHead>Último Contato</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {machines.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-blue-500" />
                    <div>
                      <div>{machine.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="font-mono">{machine.id}</span>
                        <span>•</span>
                        <Globe className="h-3 w-3" />
                        <span className="font-mono">{machine.ip}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(machine.status)}</TableCell>
                <TableCell>{machine.location}</TableCell>
                <TableCell>{machine.os}</TableCell>
                <TableCell>
                  <div className="space-y-1 w-[120px]">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Cpu className="h-3 w-3 text-blue-500" />
                        <span>CPU</span>
                      </div>
                      <span>{machine.cpu}%</span>
                    </div>
                    <Progress value={machine.cpu} className={getProgressColor(machine.cpu)} />

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Memory className="h-3 w-3 text-purple-500" />
                        <span>RAM</span>
                      </div>
                      <span>{machine.memory}%</span>
                    </div>
                    <Progress value={machine.memory} className={getProgressColor(machine.memory)} />

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <HardDrive className="h-3 w-3 text-orange-500" />
                        <span>Disco</span>
                      </div>
                      <span>{machine.disk}%</span>
                    </div>
                    <Progress value={machine.disk} className={getProgressColor(machine.disk)} />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{machine.workers}</Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={machine.autoRestart}
                    onCheckedChange={() => toggleAutoRestart(machine.id)}
                    disabled={machine.status !== 'online'}
                  />
                </TableCell>
                <TableCell>{formatDate(machine.lastSeen)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {machine.status === 'online' ? (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <PowerOff className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Activity className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Terminal className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/machines/${machine.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Reiniciar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ShieldAlert className="mr-2 h-4 w-4" />
                          Modo de Segurança
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  )
}
