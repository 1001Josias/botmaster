import { Button } from '@/components/ui/button'
import { PlusCircle, RefreshCw, Filter } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import Link from 'next/link'

export function MachinesHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Máquinas</h1>
        <p className="text-muted-foreground">Gerencie as máquinas que executarão os jobs através do agente jobmaster</p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar máquinas..." className="pl-8 w-full sm:w-[250px]" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="maintenance">Manutenção</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button asChild>
          <Link href="/dashboard/machines/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Máquina
          </Link>
        </Button>
      </div>
    </div>
  )
}
