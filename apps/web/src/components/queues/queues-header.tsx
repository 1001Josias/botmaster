'use client'

import { useState } from 'react'
import { Button } from '@/components/Button'
import { PlusCircle } from 'lucide-react'
import { QueueFormDialog } from './queue-form-dialog'

interface QueuesHeaderProps {
  onQueueCreated?: () => void
}

export function QueuesHeader({ onQueueCreated }: QueuesHeaderProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleCreateQueue = () => {
    // Notify parent component to refresh
    onQueueCreated?.()
    setIsCreateDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Filas</h1>
        <p className="text-muted-foreground">Gerencie e monitore suas filas de processamento</p>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Fila
        </Button>
      </div>

      <QueueFormDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
        onSubmit={handleCreateQueue} 
      />
    </div>
  )
}
