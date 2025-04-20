import { Button } from '@/components/Button'
import { PlusCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export function UsersHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Usuários</h1>
        <p className="text-muted-foreground">Gerencie os usuários e suas permissões</p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar usuários..." className="w-full sm:w-[250px] pl-8" />
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>
    </div>
  )
}
