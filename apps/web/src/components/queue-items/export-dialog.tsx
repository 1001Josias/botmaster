'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useState } from 'react'
import type { ExportOptions } from '@/lib/types/queue-item'
import { Loader2 } from 'lucide-react'

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedIds: string[]
}

export function ExportDialog({ open, onOpenChange, selectedIds }: ExportDialogProps) {
  const [format, setFormat] = useState<'csv' | 'json'>('csv')
  const [compress, setCompress] = useState(false)
  const [fields, setFields] = useState<string[]>([
    'id',
    'status',
    'jobName',
    'workerName',
    'createdAt',
    'processingTime',
  ])
  const [isExporting, setIsExporting] = useState(false)
  const [exportResult, setExportResult] = useState<{
    success: boolean
    downloadUrl?: string
    fileName?: string
    itemCount?: number
  } | null>(null)

  const availableFields = [
    { id: 'id', label: 'ID' },
    { id: 'jobId', label: 'ID do Job' },
    { id: 'jobName', label: 'Nome do Job' },
    { id: 'workerId', label: 'ID do Worker' },
    { id: 'workerName', label: 'Nome do Worker' },
    { id: 'workerVersion', label: 'Versão do Worker' },
    { id: 'status', label: 'Status' },
    { id: 'createdAt', label: 'Data de Criação' },
    { id: 'startedAt', label: 'Data de Início' },
    { id: 'finishedAt', label: 'Data de Término' },
    { id: 'processingTime', label: 'Tempo de Processamento' },
    { id: 'attempts', label: 'Tentativas' },
    { id: 'priority', label: 'Prioridade' },
    { id: 'tags', label: 'Tags' },
    { id: 'payload', label: 'Payload' },
    { id: 'result', label: 'Resultado' },
    { id: 'error', label: 'Erro' },
  ]

  const toggleField = (fieldId: string) => {
    setFields((prev) => (prev.includes(fieldId) ? prev.filter((id) => id !== fieldId) : [...prev, fieldId]))
  }

  const handleExport = async () => {
    setIsExporting(true)

    // Simulação de exportação
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const exportOptions: ExportOptions = {
      format,
      fields,
      compress,
      selectedIds: selectedIds.length > 0 ? selectedIds : undefined,
    }

    console.log('Exportando com opções:', exportOptions)

    setExportResult({
      success: true,
      downloadUrl: '#',
      fileName: `queue-items-export-${new Date().toISOString().slice(0, 10)}.${format}${compress ? '.zip' : ''}`,
      itemCount: selectedIds.length > 0 ? selectedIds.length : 235,
    })

    setIsExporting(false)
  }

  const handleClose = () => {
    if (!isExporting) {
      setExportResult(null)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Exportar Queue Items</DialogTitle>
          <DialogDescription>
            {selectedIds.length > 0
              ? `Exportar ${selectedIds.length} item(s) selecionado(s)`
              : 'Exportar todos os items com os filtros atuais'}
          </DialogDescription>
        </DialogHeader>

        {!exportResult ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Formato de Exportação</h4>
                <RadioGroup
                  defaultValue={format}
                  onValueChange={(value) => setFormat(value as 'csv' | 'json')}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="csv" id="csv" />
                    <Label htmlFor="csv">CSV</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="json" id="json" />
                    <Label htmlFor="json">JSON</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Campos a Exportar</h4>
                <div className="grid grid-cols-2 gap-2">
                  {availableFields.map((field) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`field-${field.id}`}
                        checked={fields.includes(field.id)}
                        onCheckedChange={() => toggleField(field.id)}
                      />
                      <Label htmlFor={`field-${field.id}`}>{field.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="compress"
                  checked={compress}
                  onCheckedChange={(checked) => setCompress(checked === true)}
                />
                <Label htmlFor="compress">Compactar arquivo (ZIP)</Label>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Limite máximo: 10.000 items por exportação</p>
                <p>Os dados exportados estarão disponíveis por 24 horas</p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={isExporting}>
                Cancelar
              </Button>
              <Button onClick={handleExport} disabled={isExporting || fields.length === 0}>
                {isExporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Exportando...
                  </>
                ) : (
                  'Exportar'
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center text-center">
            {exportResult.success ? (
              <>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6 text-green-600"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Exportação Concluída</h3>
                <p className="text-muted-foreground mb-4">{exportResult.itemCount} item(s) exportado(s) com sucesso</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleClose}>
                    Fechar
                  </Button>
                  <Button asChild>
                    <a href={exportResult.downloadUrl} download={exportResult.fileName}>
                      Baixar Arquivo
                    </a>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6 text-red-600"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Erro na Exportação</h3>
                <p className="text-muted-foreground mb-4">Ocorreu um erro ao exportar os items. Tente novamente.</p>
                <Button onClick={handleClose}>Fechar</Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
