'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

interface ItemAuthorProps {
  id: string
}

export function ItemAuthor({ id }: ItemAuthorProps) {
  // Dados simulados para o autor
  const author = {
    id: 'author-1',
    name: 'BotMaster Team',
    avatar: '/placeholder.svg?height=80&width=80',
    bio: 'Equipe oficial do BotMaster, criando recursos de alta qualidade para automação.',
    itemCount: 24,
    followers: 1250,
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Sobre o autor</h2>

        <div className="flex flex-col items-center text-center">
          <Avatar className="h-16 w-16">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{author.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <h3 className="font-medium mt-2">{author.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{author.bio}</p>

          <div className="flex gap-4 mt-3">
            <div className="text-center">
              <p className="font-medium">{author.itemCount}</p>
              <p className="text-xs text-muted-foreground">Itens</p>
            </div>
            <div className="text-center">
              <p className="font-medium">{author.followers}</p>
              <p className="text-xs text-muted-foreground">Seguidores</p>
            </div>
          </div>

          <Button className="mt-4 w-full" variant="outline" asChild>
            <Link href={`/marketplace/author/${author.id}`}>Ver perfil</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
