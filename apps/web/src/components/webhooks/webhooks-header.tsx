'use client'

import Link from 'next/link'
import { PlusCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function WebhooksHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Webhooks</h1>
        <p className="text-muted-foreground">Configure webhooks para receber notificações de eventos do BotMaster</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
        <Button asChild>
          <Link href="/webhooks/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Webhook
          </Link>
        </Button>
      </div>
    </div>
  )
}
