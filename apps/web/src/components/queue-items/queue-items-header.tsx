"use client"

import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"
import { ExportDialog } from "./export-dialog"
import { useState } from "react"

export function QueueItemsHeader() {
  const [showExportDialog, setShowExportDialog] = useState(false)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Queue Items</h1>
        <p className="text-muted-foreground">Visualize, audite e exporte itens de fila para análise</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
        <Button onClick={() => setShowExportDialog(true)}>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>
      <ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} selectedIds={[]} />
    </div>
  )
}

