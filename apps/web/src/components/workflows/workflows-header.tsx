import { Button } from '@/components/Button'
import { PlusCircle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function WorkflowsHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Workflows</h1>
        <p className="text-muted-foreground">Gerencie e monitore seus fluxos de trabalho automatizados</p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="paused">Pausados</SelectItem>
            <SelectItem value="error">Com erro</SelectItem>
          </SelectContent>
        </Select>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Workflow
        </Button>
      </div>
    </div>
  )
}
