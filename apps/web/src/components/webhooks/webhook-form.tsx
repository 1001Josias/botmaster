'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { WebhookEventType } from '@/lib/types/webhook'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { WebhookTest } from '@/components/webhooks/webhook-test'

// Dados de exemplo - em produção, estes viriam de uma API
const eventCategories = [
  {
    name: 'Queue',
    events: [
      { id: 'queue.item.added', label: 'Item Adicionado' },
      { id: 'queue.item.processed', label: 'Item Processado' },
    ],
  },
  {
    name: 'Worker',
    events: [
      { id: 'worker.started', label: 'Iniciado' },
      { id: 'worker.completed', label: 'Concluído' },
      { id: 'worker.failed', label: 'Falhou' },
    ],
  },
  {
    name: 'Workflow',
    events: [
      { id: 'workflow.started', label: 'Iniciado' },
      { id: 'workflow.completed', label: 'Concluído' },
      { id: 'workflow.failed', label: 'Falhou' },
    ],
  },
  {
    name: 'Process',
    events: [
      { id: 'process.started', label: 'Iniciado' },
      { id: 'process.completed', label: 'Concluído' },
      { id: 'process.failed', label: 'Falhou' },
    ],
  },
  {
    name: 'Job',
    events: [
      { id: 'job.created', label: 'Criado' },
      { id: 'job.started', label: 'Iniciado' },
      { id: 'job.completed', label: 'Concluído' },
      { id: 'job.failed', label: 'Falhou' },
    ],
  },
  {
    name: 'Flow',
    events: [
      { id: 'flow.started', label: 'Iniciado' },
      { id: 'flow.completed', label: 'Concluído' },
      { id: 'flow.failed', label: 'Falhou' },
    ],
  },
]

interface WebhookFormProps {
  isEditing: boolean
}

export function WebhookForm({ isEditing }: WebhookFormProps) {
  const router = useRouter()
  const [name, setName] = useState(isEditing ? 'Notificação de Fila' : '')
  const [url, setUrl] = useState(isEditing ? 'https://example.com/webhooks/queue' : '')
  const [active, setActive] = useState(true)
  const [selectedEvents, setSelectedEvents] = useState<WebhookEventType[]>(
    isEditing ? (['queue.item.added', 'queue.item.processed'] as WebhookEventType[]) : []
  )
  const [headers, setHeaders] = useState(
    isEditing ? [{ key: 'Authorization', value: 'Bearer token123' }] : [{ key: '', value: '' }]
  )
  const [retryCount, setRetryCount] = useState(isEditing ? 3 : 5)
  const [retryInterval, setRetryInterval] = useState(isEditing ? 60 : 30)
  const [secret, setSecret] = useState(isEditing ? 'webhook_secret_123' : '')

  const handleAddHeader = () => {
    setHeaders([...headers, { key: '', value: '' }])
  }

  const handleRemoveHeader = (index: number) => {
    const newHeaders = [...headers]
    newHeaders.splice(index, 1)
    setHeaders(newHeaders)
  }

  const handleHeaderChange = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers]
    if (newHeaders[index]) {
      newHeaders[index][field] = value
    }
    setHeaders(newHeaders)
  }

  const handleEventToggle = (event: WebhookEventType) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== event))
    } else {
      setSelectedEvents([...selectedEvents, event])
    }
  }

  const handleCategoryToggle = (categoryEvents: WebhookEventType[]) => {
    const allSelected = categoryEvents.every((event) => selectedEvents.includes(event))

    if (allSelected) {
      // Remove all events in this category
      setSelectedEvents(selectedEvents.filter((event) => !categoryEvents.includes(event)))
    } else {
      // Add all events in this category that aren't already selected
      const eventsToAdd = categoryEvents.filter((event) => !selectedEvents.includes(event))
      setSelectedEvents([...selectedEvents, ...eventsToAdd])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!name || !url || selectedEvents.length === 0) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    // Remover headers vazios
    const filteredHeaders = headers.filter((h) => h.key.trim() !== '' && h.value.trim() !== '')

    const webhookData = {
      name,
      url,
      active,
      events: selectedEvents,
      headers: filteredHeaders,
      retryCount,
      retryInterval,
      secret,
    }

    console.log('Dados do webhook:', webhookData)

    // Redirecionar para a lista de webhooks
    router.push('/webhooks')
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/webhooks')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{isEditing ? 'Editar Webhook' : 'Novo Webhook'}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push('/webhooks')}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>{isEditing ? 'Salvar Alterações' : 'Criar Webhook'}</Button>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="headers">Cabeçalhos</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
          {isEditing && <TabsTrigger value="test">Testar</TabsTrigger>}
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>Configure as informações básicas do seu webhook</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do webhook" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://exemplo.com/webhook"
                />
                <p className="text-sm text-muted-foreground">
                  A URL que receberá as requisições POST com os dados do evento
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="active" checked={active} onCheckedChange={setActive} />
                <Label htmlFor="active">Ativo</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Eventos</CardTitle>
              <CardDescription>Selecione os eventos que acionarão este webhook</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {eventCategories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.name}`}
                        checked={category.events.every((e) => selectedEvents.includes(e.id as WebhookEventType))}
                        onCheckedChange={() =>
                          handleCategoryToggle(category.events.map((e) => e.id as WebhookEventType))
                        }
                      />
                      <Label htmlFor={`category-${category.name}`} className="font-medium">
                        {category.name}
                      </Label>
                    </div>
                    <div className="ml-6 space-y-1">
                      {category.events.map((event) => (
                        <div key={event.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={event.id}
                            checked={selectedEvents.includes(event.id as WebhookEventType)}
                            onCheckedChange={() => handleEventToggle(event.id as WebhookEventType)}
                          />
                          <Label htmlFor={event.id}>{event.label}</Label>
                        </div>
                      ))}
                    </div>
                    {category !== eventCategories[eventCategories.length - 1] && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="headers">
          <Card>
            <CardHeader>
              <CardTitle>Cabeçalhos HTTP</CardTitle>
              <CardDescription>
                Configure cabeçalhos personalizados para autenticação ou outros propósitos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {headers.map((header, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="Nome do cabeçalho"
                      value={header.key}
                      onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Valor do cabeçalho"
                      value={header.value}
                      onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveHeader(index)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={handleAddHeader} className="mt-2">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Cabeçalho
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Avançadas</CardTitle>
              <CardDescription>Configure opções avançadas como retentativas e segurança</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="retryCount">Número de Retentativas</Label>
                <Input
                  id="retryCount"
                  type="number"
                  min="0"
                  max="10"
                  value={retryCount}
                  onChange={(e) => setRetryCount(Number.parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">
                  Quantas vezes o sistema tentará reenviar o webhook em caso de falha
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="retryInterval">Intervalo de Retentativa (segundos)</Label>
                <Input
                  id="retryInterval"
                  type="number"
                  min="5"
                  max="3600"
                  value={retryInterval}
                  onChange={(e) => setRetryInterval(Number.parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">Tempo de espera entre as tentativas de reenvio</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="secret">Segredo (opcional)</Label>
                <Input
                  id="secret"
                  type="password"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Segredo para assinatura"
                />
                <p className="text-sm text-muted-foreground">
                  Um segredo usado para assinar as requisições com HMAC SHA-256
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isEditing && (
          <TabsContent value="test">
            <WebhookTest webhookId="1" webhookUrl={url} webhookEvents={selectedEvents} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
