'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Maximize } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

interface ItemScreenshotsProps {
  id: string
}

export function ItemScreenshots({ id }: ItemScreenshotsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Dados simulados para as screenshots
  const screenshots = [
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800',
    '/placeholder.svg?height=600&width=800',
  ]

  const nextImage = () => {
    setCurrentIndex((currentIndex + 1) % screenshots.length)
  }

  const prevImage = () => {
    setCurrentIndex((currentIndex - 1 + screenshots.length) % screenshots.length)
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Screenshots</h2>

        <div className="relative">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={screenshots[currentIndex] || '/placeholder.svg'}
              alt={`Screenshot ${currentIndex + 1}`}
              fill
              className="object-cover"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <div className="relative aspect-video">
                  <Image
                    src={screenshots[currentIndex] || '/placeholder.svg'}
                    alt={`Screenshot ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {screenshots.map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className={`h-2 w-2 rounded-full p-0 ${index === currentIndex ? 'bg-primary' : 'bg-muted'}`}
              onClick={() => setCurrentIndex(index)}
            >
              <span className="sr-only">Ver screenshot {index + 1}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
