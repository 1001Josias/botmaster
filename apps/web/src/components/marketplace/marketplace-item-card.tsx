'use client'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Download } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface MarketplaceItemCardProps {
  item: {
    id: string
    name: string
    description: string
    type: string
    author: {
      name: string
      avatar: string
    }
    pricing: {
      type: 'free' | 'paid' | 'subscription'
      price?: number
      subscriptionPlans?: string[]
    }
    rating: number
    reviewCount: number
    downloads: number
    image: string
  }
}

export function MarketplaceItemCard({ item }: MarketplaceItemCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-40">
        <Image src={item.image || '/placeholder.svg'} alt={item.name} fill className="object-cover" />
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm capitalize">
            {item.type}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            {item.pricing.type === 'free' && 'Gratuito'}
            {item.pricing.type === 'paid' && `$${item.pricing.price}`}
            {item.pricing.type === 'subscription' && 'Assinatura'}
          </Badge>
        </div>
      </div>
      <CardContent className="flex-1 p-4">
        <div className="space-y-2">
          <h3 className="font-semibold line-clamp-1">{item.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Image
              src={item.author.avatar || '/placeholder.svg'}
              alt={item.author.name}
              width={20}
              height={20}
              className="rounded-full"
            />
            <span className="text-xs">{item.author.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-xs font-medium">{item.rating}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Download className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{item.downloads}</span>
        </div>
        <Button size="sm" asChild>
          <Link href={`/marketplace/${item.id}`}>Ver detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
