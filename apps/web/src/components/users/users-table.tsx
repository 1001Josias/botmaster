'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Edit, Trash2, ShieldAlert, Lock, Mail, Pencil } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
const users = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@example.com',
    role: 'admin',
    status: 'active',
    lastActive: 'Há 5 minutos',
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@example.com',
    role: 'user',
    status: 'active',
    lastActive: 'Há 10 minutos',
  },
  {
    id: '3',
    name: 'Pedro Santos',
    email: 'pedro.santos@example.com',
    role: 'user',
    status: 'inactive',
    lastActive: 'Há 3 dias',
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana.costa@example.com',
    role: 'manager',
    status: 'active',
    lastActive: 'Há 1 hora',
  },
  {
    id: '5',
    name: 'Carlos Ferreira',
    email: 'carlos.ferreira@example.com',
    role: 'user',
    status: 'active',
    lastActive: 'Há 30 minutos',
  },
  {
    id: '6',
    name: 'Lúcia Pereira',
    email: 'lucia.pereira@example.com',
    role: 'admin',
    status: 'active',
    lastActive: 'Agora',
  },
  {
    id: '7',
    name: 'Roberto Almeida',
    email: 'roberto.almeida@example.com',
    role: 'user',
    status: 'blocked',
    lastActive: 'Há 1 mês',
  },
]

const roleLabels = {
  admin: 'Administrador',
  manager: 'Gerente',
  user: 'Usuário',
}

export function UsersTable() {
  const router = useRouter()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteUser = async () => {
    try {
      // Simulação de chamada à API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: 'Usuário excluído',
        description: `O usuário ${selectedUser.name} foi excluído com sucesso.`,
      })

      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao excluir o usuário.',
        variant: 'destructive',
      })
    }
  }

  const handleUpdateUser = (data: any) => {
    console.log('Atualizar usuário:', { ...selectedUser, ...data })
    // Aqui você implementaria a lógica para atualizar um usuário
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Ativo
          </Badge>
        )
      case 'inactive':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Inativo
          </Badge>
        )
      case 'blocked':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Bloqueado
          </Badge>
        )
      default:
        return null
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Admin
          </Badge>
        )
      case 'manager':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Gerente
          </Badge>
        )
      case 'user':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Usuário
          </Badge>
        )
      default:
        return null
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Usuários</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último Acesso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>{user.lastActive}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                    </Button>
                    {user.role === 'admin' && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ShieldAlert className="h-4 w-4" />
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/users/${user.id}`)}>
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>

      {selectedUser && (
        <UserFormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          initialData={{
            name: selectedUser.name,
            email: selectedUser.email,
            role: selectedUser.role,
            isActive: selectedUser.isActive,
          }}
          onSubmit={handleUpdateUser}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário {selectedUser?.name}? Esta ação não pode ser desfeita.
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
    </Card>
  )
}
