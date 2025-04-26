'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/use-toast'

// Esquema de validação para o formulário
const queueFormSchema = z.object({
  name: z.string().min(3, {
    message: 'O nome deve ter pelo menos 3 caracteres.',
  }),
  description: z.string().optional(),
  folder: z.string().min(1, {
    message: 'Selecione uma pasta.',
  }),
  concurrency: z.number().int().min(1).max(100),
  retryLimit: z.number().int().min(0).max(10),
  retryDelay: z.number().int().min(0),
  isActive: z.boolean(),
  priority: z.number().int().min(1).max(10),
})

type QueueFormValues = z.infer<typeof queueFormSchema>

// Dados de exemplo para as pastas
const folders = [
  { id: '1', name: 'Produção' },
  { id: '2', name: 'Desenvolvimento' },
  { id: '3', name: 'Testes' },
]

interface QueueFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: QueueFormValues
  onSubmit: (data: QueueFormValues) => void
}

export function QueueFormDialog({ open, onOpenChange, initialData, onSubmit }: QueueFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues: Partial<QueueFormValues> = {
    name: '',
    description: '',
    folder: '',
    concurrency: 5,
    retryLimit: 3,
    retryDelay: 60000, // 1 minuto em ms
    isActive: true,
    priority: 5,
    ...initialData,
  }

  const form = useForm<QueueFormValues>({
    resolver: zodResolver(queueFormSchema),
    defaultValues,
  })

  const handleSubmit = async (data: QueueFormValues) => {
    setIsSubmitting(true)
    try {
      // Simulate a API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSubmit(data)
      toast({
        title: initialData ? 'Queue atualizada' : 'Queue criada',
        description: initialData
          ? `A queue "${data.name}" foi atualizada com sucesso.`
          : `A queue "${data.name}" foi criada com sucesso.`,
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar a queue.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Queue' : 'Nova Queue'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Edite os detalhes da queue existente.' : 'Preencha os detalhes para criar uma nova queue.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da queue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="folder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pasta</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma pasta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {folders.map((folder) => (
                          <SelectItem key={folder.id} value={folder.name}>
                            {folder.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva o propósito desta queue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="concurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Concorrência</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        {...field}
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Número máximo de jobs simultâneos</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="retryLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limite de Retentativas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={10}
                        {...field}
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Número máximo de retentativas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="retryDelay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Atraso de Retentativa (ms)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Tempo entre retentativas em ms</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        {...field}
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>1 (baixa) a 10 (alta)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Ativa</FormLabel>
                      <FormDescription>A queue processará jobs quando ativa</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : initialData ? 'Salvar alterações' : 'Criar Queue'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
