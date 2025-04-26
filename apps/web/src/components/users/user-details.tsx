'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { UserFormDialog } from './user-form-dialog'
import { toast } from '@/components/ui/use-toast'

// Dados de exemplo
const getUserById = (id: string) => {
  const users = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao.silva@exemplo.com',
      role: 'admin' as 'admin' | 'manager' | 'user',
      isActive: true,
      createdAt: '2023-01-15T10:00:00Z',
      lastLogin: '2023-06-10T08:45:00Z',
      permissions: ['read', 'write', 'delete', 'admin'],
    },
    {
      id: '2',
      name: 'Maria Oliveira',
      email: 'maria.oliveira@exemplo.com',
      role: 'manager' as 'admin' | 'manager' | 'user',
      isActive: true,
      createdAt: '2023-02-20T14:30:00Z',
      lastLogin: '2023-06-09T16:20:00Z',
      permissions: ['read', 'write'],
    },
    {
      id: '3',
      name: 'Pedro Santos',
      email: 'pedro.santos@exemplo.com',
      role: 'user' as 'admin' | 'manager' | 'user',
      isActive: false,
      createdAt: '2023-03-10T09:15:00Z',
      lastLogin: '2023-05-25T11:30:00Z',
      permissions: ['read'],
    },
  ]

  return users.find((user) => user.id === id)
}

const roleLabels = {
  admin: 'Administrador',
  manager: 'Gerente',
  user: 'Usuário',
}

const permissionLabels = {
  read: 'Leitura',
  write: 'Escrita',
  delete: 'Exclusão',
  admin: 'Administração',
}

export function UserDetails({ id }: { id: string }) {
  const router = useRouter()
  const user = getUserById(id)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Usuário não encontrado.</p>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleUpdateUser = (data: any) => {
    console.log('Atualizar usuário:', { ...user, ...data })
    // Aqui você implementaria a lógica para atualizar um usuário

    toast({
      title: 'Usuário atualizado',
      description: `O usuário ${data.name} foi atualizado com sucesso.`,
    })
  }

  const confirmDeleteUser = async () => {
    try {
      // Simulação de chamada à API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: 'Usuário excluído',
        description: `O usuário ${user.name} foi excluído com sucesso.`,
      })

      setIsDeleteDialogOpen(false)
      router.push('/users')
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao excluir o usuário.',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => router.push('/users')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
          <Badge variant={user.isActive ? 'default' : 'secondary'}>{user.isActive ? 'Ativo' : 'Inativo'}</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-medium">Informações Gerais</h3>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt className="text-muted-foreground">ID:</dt>
                <dd>{user.id}</dd>
                <dt className="text-muted-foreground">Papel:</dt>
                <dd>{roleLabels[user.role as keyof typeof roleLabels]}</dd>
                <dt className="text-muted-foreground">Data de Criação:</dt>
                <dd>{formatDate(user.createdAt)}</dd>
                <dt className="text-muted-foreground">Último Login:</dt>
                <dd>{formatDate(user.lastLogin)}</dd>
              </dl>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium">Permissões</h3>
              <div className="flex flex-wrap gap-2">
                {user.permissions.map((permission) => (
                  <Badge key={permission} variant="outline">
                    {permissionLabels[permission as keyof typeof permissionLabels]}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <h3 className="mb-2 text-sm font-medium">Atividade Recente</h3>
            <p className="text-sm text-muted-foreground">Último login em {formatDate(user.lastLogin)}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </CardFooter>
      </Card>

      <UserFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        initialData={{
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        }}
        onSubmit={handleUpdateUser}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário {user.name}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
