'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WorkerFormDialog } from './worker-form-dialog'

export function WorkersHeader() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false)

  const handleSaveWorker = (worker: any) => {
    console.log('Worker criado:', worker)
    // Aqui você implementaria a lógica para salvar o worker no backend
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workers</h1>
          <p className="text-muted-foreground">Gerencie e monitore seus workers de processamento</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="notification">Notificação</SelectItem>
              <SelectItem value="processing">Processamento</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setOpenCreateDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Worker
          </Button>
        </div>
      </div>

      <WorkerFormDialog open={openCreateDialog} onOpenChange={setOpenCreateDialog} onSave={handleSaveWorker} />
    </>
  )
}
