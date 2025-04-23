'use client'

import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function ProcessesHeader() {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Processes</h1>
        <p className="text-muted-foreground">Design and implement business processes using BPMN diagrams</p>
      </div>
      <Button onClick={() => router.push('/processes/editor')} className="md:w-auto">
        <PlusCircle className="mr-2 h-4 w-4" />
        New Process
      </Button>
    </div>
  )
}
