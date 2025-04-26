'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { Info } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// Tipos
type AuditLog = {
  id: string
  timestamp: string
  user: {
    id: string
    name: string
    email: string
  }
  action: string
  category: string
  resourceType: string
  resourceId: string
  resourceName: string
  ipAddress: string
  userAgent: string
  details?: any
}

// Dados de exemplo
const auditLogsData: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    user: {
      id: 'user-001',
      name: 'João Silva',
      email: 'joao.silva@example.com',
    },
    action: 'create',
    category: 'workflows',
    resourceType: 'workflow',
    resourceId: 'wf-001',
    resourceName: 'Processamento de Pedidos',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: {
      previousState: null,
      newState: {
        name: 'Processamento de Pedidos',
        description: 'Workflow para processar novos pedidos',
        status: 'draft',
      },
    },
  },
  {
    id: 'log-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    user: {
      id: 'user-002',
      name: 'Maria Oliveira',
      email: 'maria.oliveira@example.com',
    },
    action: 'update',
    category: 'settings',
    resourceType: 'security-settings',
    resourceId: 'settings-001',
    resourceName: 'Configurações de Segurança',
    ipAddress: '192.168.1.2',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    details: {
      previousState: {
        mfaRequired: false,
        sessionTimeout: 30,
      },
      newState: {
        mfaRequired: true,
        sessionTimeout: 60,
      },
    },
  },
  {
    id: 'log-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    user: {
      id: 'user-003',
      name: 'Carlos Santos',
      email: 'carlos.santos@example.com',
    },
    action: 'execute',
    category: 'processes',
    resourceType: 'process',
    resourceId: 'proc-001',
    resourceName: 'Processo de Aprovação de Crédito',
    ipAddress: '192.168.1.3',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
    details: {
      executionId: 'exec-001',
      parameters: {
        clientId: 'client-123',
        amount: 5000,
      },
    },
  },
  {
    id: 'log-004',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    user: {
      id: 'user-004',
      name: 'Ana Costa',
      email: 'ana.costa@example.com',
    },
    action: 'create',
    category: 'users',
    resourceType: 'user',
    resourceId: 'user-005',
    resourceName: 'Pedro Almeida',
    ipAddress: '192.168.1.4',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)',
    details: {
      email: 'pedro.almeida@example.com',
      role: 'user',
    },
  },
  {
    id: 'log-005',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    user: {
      id: 'user-005',
      name: 'Pedro Almeida',
      email: 'pedro.almeida@example.com',
    },
    action: 'update',
    category: 'workers',
    resourceType: 'worker',
    resourceId: 'worker-001',
    resourceName: 'Worker de Processamento de Imagens',
    ipAddress: '192.168.1.5',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: {
      previousState: {
        status: 'inactive',
        concurrency: 2,
      },
      newState: {
        status: 'active',
        concurrency: 5,
      },
    },
  },
  {
    id: 'log-006',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    user: {
      id: 'user-006',
      name: 'Lucia Ferreira',
      email: 'lucia.ferreira@example.com',
    },
    action: 'create',
    category: 'queues',
    resourceType: 'queue',
    resourceId: 'queue-001',
    resourceName: 'Fila de Prioridade Alta',
    ipAddress: '192.168.1.6',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    details: {
      type: 'priority',
      maxItems: 1000,
    },
  },
  {
    id: 'log-007',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    user: {
      id: 'user-001',
      name: 'João Silva',
      email: 'joao.silva@example.com',
    },
    action: 'delete',
    category: 'workflows',
    resourceType: 'workflow',
    resourceId: 'wf-002',
    resourceName: 'Workflow Obsoleto',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: {
      previousState: {
        name: 'Workflow Obsoleto',
        status: 'inactive',
      },
      newState: null,
    },
  },
]

export function AuditLogs({ category = 'all', searchQuery = '' }: { category?: string; searchQuery?: string }) {
  const [page, setPage] = useState(1)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  // Filtrar logs com base na categoria e na busca
  const filteredLogs = auditLogsData.filter((log) => {
    const matchesCategory = category === 'all' || log.category === category
    const matchesSearch =
      searchQuery === '' ||
      log.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'create':
        return <Badge className="bg-green-500">Criação</Badge>
      case 'update':
        return <Badge className="bg-blue-500">Atualização</Badge>
      case 'delete':
        return <Badge className="bg-red-500">Exclusão</Badge>
      case 'execute':
        return <Badge className="bg-purple-500">Execução</Badge>
      case 'login':
        return <Badge className="bg-yellow-500">Login</Badge>
      case 'logout':
        return <Badge className="bg-gray-500">Logout</Badge>
      default:
        return <Badge>{action}</Badge>
    }
  }

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log)
    setDetailsOpen(true)
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data/Hora</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>Ação</TableHead>
            <TableHead>Recurso</TableHead>
            <TableHead>IP</TableHead>
            <TableHead className="text-right">Detalhes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{formatDate(log.timestamp)}</TableCell>
              <TableCell>
                <div className="font-medium">{log.user.name}</div>
                <div className="text-xs text-muted-foreground">{log.user.email}</div>
              </TableCell>
              <TableCell>{getActionBadge(log.action)}</TableCell>
              <TableCell>
                <div className="font-medium">{log.resourceName}</div>
                <div className="text-xs text-muted-foreground">{log.resourceType}</div>
              </TableCell>
              <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleViewDetails(log)}>
                  <Info className="h-4 w-4 mr-2" />
                  Detalhes
                </Button>
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
              <PaginationLink href="#">3</PaginationLink>
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

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Log de Auditoria</DialogTitle>
            <DialogDescription>Informações detalhadas sobre a ação realizada</DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Informações Básicas</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID:</span>
                      <span className="font-mono">{selectedLog.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data/Hora:</span>
                      <span>{formatDate(selectedLog.timestamp)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ação:</span>
                      <span>{getActionBadge(selectedLog.action)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Categoria:</span>
                      <span>{selectedLog.category}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium">Usuário</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nome:</span>
                      <span>{selectedLog.user.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{selectedLog.user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID:</span>
                      <span className="font-mono">{selectedLog.user.id}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium">Recurso</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nome:</span>
                      <span>{selectedLog.resourceName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span>{selectedLog.resourceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID:</span>
                      <span className="font-mono">{selectedLog.resourceId}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium">Informações Técnicas</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Endereço IP:</span>
                      <span className="font-mono">{selectedLog.ipAddress}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">User Agent:</span>
                      <span className="font-mono text-xs mt-1 break-all">{selectedLog.userAgent}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedLog.details && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Detalhes da Ação</h4>
                  <div className="bg-muted rounded-md p-4 overflow-auto max-h-60">
                    <pre className="text-xs">{JSON.stringify(selectedLog.details, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
