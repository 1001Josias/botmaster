'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Download, ArrowLeft, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface ItemDetailsProps {
  id: string
}

export function ItemDetails({ id }: ItemDetailsProps) {
  // Dados simulados para o item
  const item = {
    id,
    name: 'Advanced Data Processing Workflow',
    description:
      'Um workflow completo para processamento de dados com integração a múltiplas fontes. Inclui transformação, validação e exportação de dados para diversos formatos.',
    version: '1.2.3',
    type: 'workflow',
    author: {
      id: 'author-1',
      name: 'BotMaster Team',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    pricing: {
      type: 'subscription' as const,
      subscriptionPlans: ['premium', 'enterprise'],
    },
    rating: 4.8,
    reviewCount: 124,
    downloads: 3450,
    createdAt: '2023-05-15',
    updatedAt: '2023-11-20',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/marketplace">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
        <Badge variant="outline" className="capitalize">
          {item.type}
        </Badge>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{item.name}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src={item.author.avatar || '/placeholder.svg'}
                alt={item.author.name}
                width={24}
                height={24}
                className="rounded-full"
              />
              <Link href={`/marketplace/author/${item.author.id}`} className="text-sm hover:underline">
                {item.author.name}
              </Link>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="text-sm font-medium">{item.rating}</span>
              <span className="text-xs text-muted-foreground">({item.reviewCount} avaliações)</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{item.downloads} downloads</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Versão {item.version}</span>
            <span>•</span>
            <span>Atualizado em {new Date(item.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Heart className="h-4 w-4" />
            <span className="sr-only">Favoritar</span>
          </Button>

          {item.pricing.type === 'free' && <Button>Instalar</Button>}

          {item.pricing.type === 'paid' && <Button>Adquirir</Button>}

          {item.pricing.type === 'subscription' && (
            <Button>
              Instalar
              <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
                Incluído na assinatura
              </Badge>
            </Button>
          )}
        </div>
      </div>

      <div className="prose max-w-none dark:prose-invert">
        <p>{item.description}</p>
      </div>
    </div>
  )
}
