'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus } from 'lucide-react'
import Link from 'next/link'

export function MarketplaceHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Marketplace</h1>
        <p className="text-muted-foreground">Descubra, adquira e instale recursos para o seu BotMaster</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar recursos..." className="w-full sm:w-[250px] pl-8" />
        </div>
        <Button asChild>
          <Link href="/marketplace/publish">
            <Plus className="mr-2 h-4 w-4" />
            Publicar
          </Link>
        </Button>
      </div>
    </div>
  )
}
