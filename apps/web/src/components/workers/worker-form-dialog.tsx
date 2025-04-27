"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

interface WorkerFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  worker?: Worker
  onSave: (worker: Worker) => void
}

interface Worker {
  id?: string
  name: string
  description: string
  type: string
  status: string
  folder: string
  concurrency: number
  memory: number
  timeout: number
  retries: number
  autoScale: boolean
  minInstances: number
  maxInstances: number
}

export function WorkerFormDialog({ open, onOpenChange, worker, onSave }: WorkerFormDialogProps) {
  const isEditing = !!worker?.id

  const [formData, setFormData] = useState<Worker>(
    worker || {
      name: "",
      description: "",
      type: "processing",
      status: "active",
      folder: "Produção",
      concurrency: 5,
      memory: 128,
      timeout: 30,
      retries: 3,
      autoScale: false,
      minInstances: 1,
      maxInstances: 5,
    },
  )

  const handleChange = (field: keyof Worker, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Worker" : "Novo Worker"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite as informações do worker existente."
              : "Preencha as informações para criar um novo worker."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="resources">Recursos</TabsTrigger>
              <TabsTrigger value="advanced">Avançado</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Nome do worker"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Descrição do worker"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="notification">Notificação</SelectItem>
                        <SelectItem value="processing">Processamento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="folder">Pasta</Label>
                    <Select value={formData.folder} onValueChange={(value) => handleChange("folder", value)}>
                      <SelectTrigger id="folder">
                        <SelectValue placeholder="Selecione a pasta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Produção">Produção</SelectItem>
                        <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
                        <SelectItem value="Testes">Testes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="paused">Pausado</SelectItem>
                      <SelectItem value="error">Erro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <Label htmlFor="concurrency">Concorrência: {formData.concurrency}</Label>
                  </div>
                  <Slider
                    id="concurrency"
                    min={1}
                    max={20}
                    step={1}
                    value={[formData.concurrency]}
                    onValueChange={(value) => handleChange('concurrency', value[0])}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <Label htmlFor="timeout">Timeout (segundos): {formData.timeout}</Label>
                  </div>
                  <Slider
                    id="timeout"
                    min={5}
                    max={300}
                    step={5}
                    value={[formData.timeout]}
                    onValueChange={(value) => handleChange("timeout", value[0])}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <Label htmlFor="retries">Tentativas de Retry: {formData.retries}</Label>
                  </div>
                  <Slider
                    id="retries"
                    min={0}
                    max={10}
                    step={1}
                    value={[formData.retries]}
                    onValueChange={(value) => handleChange("retries", value[0])}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoScale">Auto Scaling</Label>
                  <Switch
                    id="autoScale"
                    checked={formData.autoScale}
                    onCheckedChange={(checked) => handleChange("autoScale", checked)}
                  />
                </div>

                {formData.autoScale && (
                  <>
                    <div className="grid gap-2">
                      <div className="flex justify-between">
                        <Label htmlFor="minInstances">Instâncias Mínimas: {formData.minInstances}</Label>
                      </div>
                      <Slider
                        id="minInstances"
                        min={1}
                        max={10}
                        step={1}
                        value={[formData.minInstances]}
                        onValueChange={(value) => handleChange("minInstances", value[0])}
                      />
                    </div>

                    <div className="grid gap-2">
                      <div className="flex justify-between">
                        <Label htmlFor="maxInstances">Instâncias Máximas: {formData.maxInstances}</Label>
                      </div>
                      <Slider
                        id="maxInstances"
                        min={1}
                        max={20}
                        step={1}
                        value={[formData.maxInstances]}
                        onValueChange={(value) => handleChange("maxInstances", value[0])}
                      />
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? "Salvar Alterações" : "Criar Worker"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

