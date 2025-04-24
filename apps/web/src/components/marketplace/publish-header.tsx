'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function PublishHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/marketplace">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </Link>
          </Button>
        </div>
        <h1 className="text-2xl font-bold tracking-tight mt-2">Publicar no Marketplace</h1>
        <p className="text-muted-foreground">Compartilhe seus recursos com a comunidade BotMaster</p>
      </div>
    </div>
  )
}
