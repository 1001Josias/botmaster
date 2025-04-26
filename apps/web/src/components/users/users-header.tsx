'use client'

import { useState } from 'react'
import { PlusCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { UserFormDialog } from './user-form-dialog'

export function UsersHeader() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleCreateUser = (data: any) => {
    console.log('Criar usuário:', data)
    // Aqui você implementaria a lógica para criar um usuário
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Usuários</h1>
        <p className="text-muted-foreground">Gerencie os usuários do sistema e suas permissões.</p>
      </div>
      <Button onClick={() => setIsCreateDialogOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Novo Usuário
      </Button>

      <UserFormDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onSubmit={handleCreateUser} />
    </div>
  )
}
