'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

interface ExecuteWorkerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workerId: string
  workerVersions: string[]
  onExecute: (version: string, options: any, machines: string[]) => void
}

const mockMachines = [
  { id: 'machine-1', name: 'Machine 1' },
  { id: 'machine-2', name: 'Machine 2' },
  { id: 'machine-3', name: 'Machine 3' },
]

export function ExecuteWorkerDialog({
  open,
  onOpenChange,
  workerId,
  workerVersions,
  onExecute,
}: ExecuteWorkerDialogProps) {
  const [selectedVersion, setSelectedVersion] = useState('latest')
  const [customOptions, setCustomOptions] = useState('')
  const [selectedMachines, setSelectedMachines] = useState<string[]>([])

  const handleExecute = () => {
    try {
      const options = customOptions ? JSON.parse(customOptions) : {}
      onExecute(selectedVersion, options, selectedMachines)
      onOpenChange(false)
    } catch (error) {
      alert('Opções personalizadas inválidas. Verifique o formato JSON.')
    }
  }

  const handleMachineToggle = (machineId: string) => {
    if (selectedMachines.includes(machineId)) {
      setSelectedMachines(selectedMachines.filter((id) => id !== machineId))
    } else {
      setSelectedMachines([...selectedMachines, machineId])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Executar Worker</DialogTitle>
          <DialogDescription>Configure as opções de execução para o worker {workerId}.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="version">Versão do Worker</Label>
            <Select value={selectedVersion} onValueChange={setSelectedVersion}>
              <SelectTrigger id="version">
                <SelectValue placeholder="Selecione a versão" />
              </SelectTrigger>
              <SelectContent>
                {workerVersions.map((version) => (
                  <SelectItem key={version} value={version}>
                    {version}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Máquinas</Label>
            <div className="flex flex-col space-y-1">
              {mockMachines.map((machine) => (
                <div key={machine.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={machine.id}
                    checked={selectedMachines.includes(machine.id)}
                    onCheckedChange={() => handleMachineToggle(machine.id)}
                  />
                  <Label
                    htmlFor={machine.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {machine.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="options">Opções Personalizadas (JSON)</Label>
            <Textarea
              id="options"
              placeholder="Ex: { 'param1': 'value1', 'param2': 123 }"
              value={customOptions}
              onChange={(e) => setCustomOptions(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleExecute}>
            Executar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
