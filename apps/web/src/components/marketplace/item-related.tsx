'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface ItemRelatedProps {
  id: string
}

export function ItemRelated({ id }: ItemRelatedProps) {
  // Dados simulados para itens relacionados
  const relatedItems = [
    {
      id: 'related-1',
      name: 'Data Visualization Workflow',
      type: 'workflow',
      rating: 4.6,
      image: '/placeholder.svg?height=80&width=120',
    },
    {
      id: 'related-2',
      name: 'API Integration Worker',
      type: 'worker',
      rating: 4.3,
      image: '/placeholder.svg?height=80&width=120',
    },
    {
      id: 'related-3',
      name: 'Data Export Process',
      type: 'process',
      rating: 4.7,
      image: '/placeholder.svg?height=80&width=120',
    },
  ]

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Itens relacionados</h2>

        <div className="space-y-4">
          {relatedItems.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative h-16 w-24 flex-shrink-0">
                <Image
                  src={item.image || '/placeholder.svg'}
                  alt={item.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{item.name}</h3>
                <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                <div className="flex items-center mt-1">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <span className="text-xs ml-1">{item.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link href={`/marketplace?related=${id}`}>Ver mais</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
