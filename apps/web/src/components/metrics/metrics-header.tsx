import { Button } from '@/components/ui/button'
import { Download, RefreshCw, Share2 } from 'lucide-react'
import { DatePickerWithRange } from '@/components/metrics/date-range-picker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function MetricsHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Métricas & Analytics</h1>
        <p className="text-muted-foreground">
          Visualize métricas de negócios, operacionais e estratégicas do seu ambiente de automação
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <DatePickerWithRange />
        <Select defaultValue="tenant">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Escopo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tenant">Toda a Organização</SelectItem>
            <SelectItem value="folder">Por Folder</SelectItem>
            <SelectItem value="workflow">Por Workflow</SelectItem>
            <SelectItem value="worker">Por Worker</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
        <Button variant="outline">
          <Share2 className="mr-2 h-4 w-4" />
          Compartilhar
        </Button>
      </div>
    </div>
  )
}
