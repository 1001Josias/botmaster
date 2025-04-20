import { Button } from '@/components/Button'
import { PlusCircle } from 'lucide-react'

export function QueuesHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Queues</h1>
        <p className="text-muted-foreground">Gerencie e monitore suas filas de processamento</p>
      </div>
      <div className="flex items-center gap-2">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Queue
        </Button>
      </div>
    </div>
  )
}
