'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Download, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function MarketplaceFeatured() {
  // Dados simulados para o item em destaque
  const featuredItem = {
    id: 'featured-1',
    name: 'Advanced Data Processing Workflow',
    description: 'Um workflow completo para processamento de dados com integração a múltiplas fontes',
    type: 'workflow',
    author: {
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
    image: '/placeholder.svg?height=400&width=800',
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Em destaque</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/marketplace?featured=true">
            Ver todos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-[200px] md:h-auto">
            <Image
              src={featuredItem.image || '/placeholder.svg'}
              alt={featuredItem.name}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="capitalize">
                    {featuredItem.type}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">{featuredItem.rating}</span>
                    <span className="text-xs text-muted-foreground">({featuredItem.reviewCount})</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold">{featuredItem.name}</h3>
                <p className="text-muted-foreground">{featuredItem.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Image
                    src={featuredItem.author.avatar || '/placeholder.svg'}
                    alt={featuredItem.author.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="text-sm">{featuredItem.author.name}</span>
                </div>
                <div className="flex items-center gap-1 ml-auto">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{featuredItem.downloads}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Incluído na assinatura
              </Badge>
              <Button asChild>
                <Link href={`/marketplace/${featuredItem.id}`}>Ver detalhes</Link>
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
