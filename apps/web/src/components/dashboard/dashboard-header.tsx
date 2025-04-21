import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Share2 } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu ambiente de automação e orquestração</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-8">
          <RefreshCw className="mr-2 h-3.5 w-3.5" />
          Atualizar
        </Button>
        <Button variant="outline" size="sm" className="h-8">
          <Download className="mr-2 h-3.5 w-3.5" />
          Exportar
        </Button>
        <Button variant="outline" size="sm" className="h-8">
          <Share2 className="mr-2 h-3.5 w-3.5" />
          Compartilhar
        </Button>
      </div>
    </div>
  )
}

