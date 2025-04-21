import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function FoldersHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Folders</h1>
        <p className="text-muted-foreground">Organize e gerencie a estrutura de pastas para seus recursos</p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os folders</SelectItem>
            <SelectItem value="production">Produção</SelectItem>
            <SelectItem value="development">Desenvolvimento</SelectItem>
            <SelectItem value="archived">Arquivados</SelectItem>
          </SelectContent>
        </Select>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Folder
        </Button>
      </div>
    </div>
  )
}
