import { PlusCircle, RefreshCw, Filter, Search } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/Button'

export function TriggersHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Triggers</h1>
        <p className="text-muted-foreground">Gerencie os gatilhos que iniciam seus workflows automaticamente</p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar triggers..." className="pl-8 w-full sm:w-[250px]" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="schedule">Agendamento</SelectItem>
            <SelectItem value="webhook">Webhook</SelectItem>
            <SelectItem value="event">Evento</SelectItem>
            <SelectItem value="data">Condição de Dados</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Trigger
        </Button>
      </div>
    </div>
  )
}
