'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, ExternalLink, MoreHorizontal, Play, Trash } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import type { Webhook, WebhookStatus } from '@/lib/types/webhook'

// Dados de exemplo - em produção, estes viriam de uma API
const webhooks: Webhook[] = [
  {
    id: '1',
    name: 'Notificação de Fila',
    url: 'https://example.com/webhooks/queue',
    events: ['queue.item.added', 'queue.item.processed'],
    headers: [{ key: 'Authorization', value: 'Bearer token123' }],
    status: 'active',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z',
    retryCount: 3,
    retryInterval: 60,
    deliveries: [
      {
        id: 'd1',
        timestamp: '2023-05-15T12:30:00Z',
        status: 'success',
        responseCode: 200,
        responseBody: 'OK',
        requestBody: '{"event":"queue.item.added","data":{}}',
        attempt: 1,
        maxAttempts: 3,
      },
    ],
  },
  {
    id: '2',
    name: 'Notificação de Worker',
    url: 'https://example.com/webhooks/worker',
    events: ['worker.started', 'worker.completed', 'worker.failed'],
    headers: [{ key: 'X-API-Key', value: 'api123' }],
    status: 'active',
    createdAt: '2023-05-10T08:15:00Z',
    updatedAt: '2023-05-12T14:20:00Z',
    retryCount: 5,
    retryInterval: 30,
    deliveries: [
      {
        id: 'd2',
        timestamp: '2023-05-12T15:30:00Z',
        status: 'failed',
        responseCode: 500,
        responseBody: 'Internal Server Error',
        requestBody: '{"event":"worker.failed","data":{}}',
        attempt: 3,
        maxAttempts: 5,
      },
    ],
  },
  {
    id: '3',
    name: 'Notificação de Workflow',
    url: 'https://example.com/webhooks/workflow',
    events: ['workflow.started', 'workflow.completed', 'workflow.failed'],
    headers: [],
    status: 'inactive',
    createdAt: '2023-04-20T11:45:00Z',
    updatedAt: '2023-05-01T09:30:00Z',
    retryCount: 2,
    retryInterval: 120,
    deliveries: [],
  },
]

export function WebhooksList() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null)
  const [testDialogOpen, setTestDialogOpen] = useState(false)

  const getStatusBadge = (status: WebhookStatus) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Ativo
          </Badge>
        )
      case 'inactive':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Inativo
          </Badge>
        )
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Falha
          </Badge>
        )
    }
  }

  const handleDelete = (webhook: Webhook) => {
    setSelectedWebhook(webhook)
    setDeleteDialogOpen(true)
  }

  const handleTest = (webhook: Webhook) => {
    setSelectedWebhook(webhook)
    setTestDialogOpen(true)
  }

  const confirmDelete = () => {
    // Lógica para excluir o webhook
    console.log('Excluindo webhook:', selectedWebhook?.id)
    setDeleteDialogOpen(false)
  }

  const confirmTest = () => {
    // Lógica para testar o webhook
    console.log('Testando webhook:', selectedWebhook?.id)
    setTestDialogOpen(false)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Eventos</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Última Atualização</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {webhooks.map((webhook) => (
            <TableRow key={webhook.id}>
              <TableCell className="font-medium">{webhook.name}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                <div className="flex items-center">
                  <span className="truncate">{webhook.url}</span>
                  <a
                    href={webhook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {webhook.events.slice(0, 2).map((event) => (
                    <Badge key={event} variant="secondary" className="text-xs">
                      {event}
                    </Badge>
                  ))}
                  {webhook.events.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{webhook.events.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(webhook.status)}</TableCell>
              <TableCell>{new Date(webhook.updatedAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/webhooks/edit?id=${webhook.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTest(webhook)}>
                      <Play className="mr-2 h-4 w-4" />
                      Testar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDelete(webhook)} className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Webhook</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o webhook &quot;{selectedWebhook?.name}&quot;? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de teste de webhook */}
      <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Testar Webhook</DialogTitle>
            <DialogDescription>
              Envie uma requisição de teste para o webhook &quot;{selectedWebhook?.name}&quot;.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="test-event">Evento</Label>
              <select
                id="test-event"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {selectedWebhook?.events.map((event) => (
                  <option key={event} value={event}>
                    {event}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="test-payload">Payload (JSON)</Label>
              <textarea
                id="test-payload"
                rows={5}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue={`{\n  "event": "${selectedWebhook?.events[0]}",\n  "data": {\n    "id": "123",\n    "timestamp": "${new Date().toISOString()}"\n  }\n}`}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmTest}>Enviar Teste</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
