'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { WorkerFormDialog } from './worker-form-dialog'
import { useToast } from '@/hooks/use-toast'

interface WorkersHeaderProps {
  onWorkerCreated?: () => void
}

export function WorkersHeader({ onWorkerCreated }: WorkersHeaderProps) {
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const { toast } = useToast()

  const handleSaveWorker = () => {
    setOpenCreateDialog(false)
    onWorkerCreated?.()
    toast({
      title: 'Success',
      description: 'Worker created successfully',
    })
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workers</h1>
          <p className="text-muted-foreground">Manage and monitor your processing workers</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <Button onClick={() => setOpenCreateDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Worker
          </Button>
        </div>
      </div>

      <WorkerFormDialog open={openCreateDialog} onOpenChange={setOpenCreateDialog} onSave={handleSaveWorker} />
    </>
  )
}
