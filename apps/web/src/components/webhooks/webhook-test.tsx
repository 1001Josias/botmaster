'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import type { WebhookEventType } from '@/lib/types/webhook'
import { Loader2, Send } from 'lucide-react'

interface WebhookTestProps {
  webhookId: string
  webhookUrl: string
  webhookEvents: WebhookEventType[]
}

export function WebhookTest({ webhookId, webhookUrl, webhookEvents }: WebhookTestProps) {
  const [selectedEvent, setSelectedEvent] = useState<WebhookEventType | ''>(
    webhookEvents.length > 0 && webhookEvents[0] ? webhookEvents[0] : ''
  )
  const [payload, setPayload] = useState(
    JSON.stringify(
      {
        event: webhookEvents.length > 0 && webhookEvents[0] ? webhookEvents[0] : '',
        data: {
          id: 'test-123',
          timestamp: new Date().toISOString(),
        },
      },
      null,
      2
    )
  )
  const [isSending, setIsSending] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    status?: number
    message: string
    responseTime?: number
  } | null>(null)

  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEvent = e.target.value as WebhookEventType
    setSelectedEvent(newEvent)

    try {
      const currentPayload = JSON.parse(payload) as { event: string; [key: string]: any }
      currentPayload.event = newEvent
      setPayload(JSON.stringify(currentPayload, null, 2))
    } catch (error) {
      // Se o payload não for um JSON válido, não atualizamos
      console.error('Erro ao atualizar o evento no payload:', error)
    }
  }

  const handleSendTest = async () => {
    setIsSending(true)
    setResult(null)

    try {
      // Simulação de envio - em produção, isso seria uma chamada real à API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulação de resposta
      const success = Math.random() > 0.3 // 70% de chance de sucesso

      setResult({
        success,
        status: success ? 200 : 500,
        message: success ? 'Webhook enviado com sucesso' : 'Erro ao enviar webhook',
        responseTime: Math.floor(Math.random() * 500) + 100, // Entre 100ms e 600ms
      })
    } catch (error) {
      setResult({
        success: false,
        message: 'Erro ao enviar webhook: ' + (error as Error).message,
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Testar Webhook</CardTitle>
          <CardDescription>Envie uma requisição de teste para o seu webhook</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="test-event">Evento</Label>
            <select
              id="test-event"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedEvent}
              onChange={handleEventChange}
            >
              {webhookEvents.length === 0 && <option value="">Nenhum evento disponível</option>}
              {webhookEvents.map((event) => (
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
              rows={10}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              URL: <span className="font-mono">{webhookUrl}</span>
            </p>
          </div>
          <Button onClick={handleSendTest} disabled={isSending || !selectedEvent}>
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Teste
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <Card className={result.success ? 'border-green-200' : 'border-red-200'}>
          <CardHeader className={result.success ? 'bg-green-50' : 'bg-red-50'}>
            <CardTitle className={result.success ? 'text-green-700' : 'text-red-700'}>
              {result.success ? 'Teste Enviado com Sucesso' : 'Falha no Envio do Teste'}
            </CardTitle>
            <CardDescription>{result.message}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-4">
            {result.status && (
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className="font-mono">{result.status}</span>
              </div>
            )}
            {result.responseTime && (
              <div className="flex justify-between">
                <span className="font-medium">Tempo de Resposta:</span>
                <span className="font-mono">{result.responseTime}ms</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium">Timestamp:</span>
              <span className="font-mono">{new Date().toISOString()}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
