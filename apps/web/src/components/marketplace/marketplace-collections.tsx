'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export function MarketplaceCollections() {
  // Dados simulados para as coleções
  const collections = [
    {
      id: 'collection-1',
      name: 'Automação para E-commerce',
      description: 'Recursos essenciais para automatizar operações de e-commerce',
      itemCount: 12,
      image: '/placeholder.svg?height=200&width=300',
    },
    {
      id: 'collection-2',
      name: 'Integrações Financeiras',
      description: 'Conecte-se a sistemas financeiros e automatize processos',
      itemCount: 8,
      image: '/placeholder.svg?height=200&width=300',
    },
    {
      id: 'collection-3',
      name: 'Geração de Relatórios',
      description: 'Crie e distribua relatórios automaticamente',
      itemCount: 10,
      image: '/placeholder.svg?height=200&width=300',
    },
    {
      id: 'collection-4',
      name: 'Gestão de Clientes',
      description: 'Melhore o relacionamento com clientes através da automação',
      itemCount: 15,
      image: '/placeholder.svg?height=200&width=300',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Coleções em destaque</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/marketplace?view=collections">
            Ver todas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 pb-4">
          {collections.map((collection) => (
            <Card key={collection.id} className="w-[300px] flex-shrink-0">
              <div className="relative h-40">
                <Image
                  src={collection.image || '/placeholder.svg'}
                  alt={collection.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{collection.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{collection.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-muted-foreground">{collection.itemCount} itens</span>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/marketplace/collections/${collection.id}`}>
                      Explorar
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
