'use client'

import { useState, useEffect } from 'react'
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
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/use-toast'
import { queuesApi, type Queue } from '@/lib/api/queues'

// Schema validation for the form
const queueFormSchema = z.object({
  name: z.string().min(3, {
    message: 'O nome deve ter pelo menos 3 caracteres.',
  }),
  description: z.string().optional(),
  concurrency: z.number().int().min(1).max(100),
  retryLimit: z.number().int().min(0).max(10),
  retryDelay: z.number().int().min(0),
  isActive: z.boolean(),
  priority: z.number().int().min(1).max(10),
})

type QueueFormValues = z.infer<typeof queueFormSchema>

interface QueueFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Queue | null
  onSubmit?: () => void
}

export function QueueFormDialog({ open, onOpenChange, initialData, onSubmit }: QueueFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const defaultValues: Partial<QueueFormValues> = {
    name: initialData?.name || '',
    description: initialData?.description || '',
    concurrency: initialData?.concurrency || 5,
    retryLimit: initialData?.retryLimit || 3,
    retryDelay: initialData?.retryDelay || 60000, // 1 minute in ms
    isActive: initialData?.isActive ?? true,
    priority: initialData?.priority || 5,
  }

  const form = useForm<QueueFormValues>({
    resolver: zodResolver(queueFormSchema),
    defaultValues,
  })

  // Reset form when initialData changes
  useEffect(() => {
    form.reset(defaultValues)
  }, [initialData])

  const handleSubmit = async (data: QueueFormValues) => {
    setIsSubmitting(true)
    try {
      if (initialData) {
        // Update existing queue
        await queuesApi.update(initialData.id, data)
        toast({
          title: 'Fila atualizada',
          description: `A fila "${data.name}" foi atualizada com sucesso.`,
        })
      } else {
        // Create new queue
        await queuesApi.create(data)
        toast({
          title: 'Fila criada',
          description: `A fila "${data.name}" foi criada com sucesso.`,
        })
      }
      
      onSubmit?.()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error('Failed to save queue:', error)
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar a fila.',
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
          <DialogTitle>{initialData ? 'Editar Fila' : 'Nova Fila'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Edite os detalhes da fila existente.' : 'Preencha os detalhes para criar uma nova fila.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da fila" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva o propósito desta fila" {...field} />
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
