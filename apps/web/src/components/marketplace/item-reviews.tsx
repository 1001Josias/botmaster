'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

interface ItemReviewsProps {
  id: string
}

export function ItemReviews({ id }: ItemReviewsProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  // Dados simulados para as avaliações
  const reviews = [
    {
      id: 'review-1',
      userName: 'João Silva',
      userAvatar: '/placeholder.svg?height=40&width=40',
      rating: 5,
      comment: 'Excelente workflow! Economizou horas do meu tempo e a integração foi perfeita.',
      createdAt: '2023-11-15T10:30:00Z',
    },
    {
      id: 'review-2',
      userName: 'Maria Oliveira',
      userAvatar: '/placeholder.svg?height=40&width=40',
      rating: 4,
      comment: 'Muito bom, mas poderia ter mais opções de configuração para casos específicos.',
      createdAt: '2023-10-22T14:15:00Z',
    },
    {
      id: 'review-3',
      userName: 'Carlos Mendes',
      userAvatar: '/placeholder.svg?height=40&width=40',
      rating: 5,
      comment: 'Simplesmente perfeito! Fácil de configurar e extremamente eficiente.',
      createdAt: '2023-09-05T09:45:00Z',
    },
  ]

  const handleSubmitReview = () => {
    // Lógica para enviar a avaliação
    console.log({ rating, comment })
    // Reset do formulário
    setRating(0)
    setComment('')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">Avaliações</h2>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={review.userAvatar} alt={review.userName} />
                  <AvatarFallback>{review.userName.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{review.userName}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm mt-2">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium mb-3">Deixe sua avaliação</h3>
          <div className="space-y-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className="p-0 bg-transparent border-none cursor-pointer"
                >
                  <Star className={`h-6 w-6 ${i < rating ? 'fill-primary text-primary' : 'text-muted'}`} />
                </button>
              ))}
            </div>
            <Textarea
              placeholder="Compartilhe sua experiência com este item..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
            <Button onClick={handleSubmitReview} disabled={rating === 0 || !comment.trim()}>
              Enviar avaliação
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
