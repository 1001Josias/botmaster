'use client'

import { Button } from '@/components/Button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Copy, RefreshCw } from 'lucide-react'

export function ApiSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações de API</h3>
        <p className="text-sm text-muted-foreground">Gerencie suas chaves de API e configurações de integração.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chaves de API</CardTitle>
          <CardDescription>Gerencie suas chaves de API para integração com outros sistemas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Chave de API</Label>
            <div className="flex gap-2">
              <Input id="api-key" value="sk_live_51NZXtGJ7BnJ8yTgZVOIhgGnJC6Fk2Jxxxx" readOnly type="password" />
              <Button variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL do Webhook</Label>
            <Input id="webhook-url" placeholder="https://seu-dominio.com/webhook" />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="webhook-enabled" />
            <Label htmlFor="webhook-enabled">Habilitar Webhooks</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Salvar Configurações</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Limites de API</CardTitle>
          <CardDescription>Configure os limites de requisições para sua API.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rate-limit">Limite de Requisições (por minuto)</Label>
            <Input id="rate-limit" type="number" defaultValue="100" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="concurrent-limit">Limite de Requisições Concorrentes</Label>
            <Input id="concurrent-limit" type="number" defaultValue="10" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Salvar Limites</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
