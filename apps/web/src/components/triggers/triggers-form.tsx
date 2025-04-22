'use client'

import { z } from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Database, Globe, Workflow, Zap, Bot } from 'lucide-react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/Button'

// Esquema de validação para o formulário
const triggerFormSchema = z
  .object({
    name: z.string().min(2, {
      message: 'O nome deve ter pelo menos 2 caracteres.',
    }),
    type: z.enum(['schedule', 'webhook', 'event', 'data']),
    targetType: z.enum(['workflow', 'worker']),
    workflowId: z.string().optional(),
    workerId: z.string().optional(),
    description: z.string().optional(),
    isActive: z.boolean(),

    // Campos específicos por tipo
    schedule: z.string().optional(),
    cronExpression: z.string().optional(),
    webhookEndpoint: z.string().optional(),
    webhookMethod: z.enum(['POST', 'GET', 'PUT', 'DELETE']).optional(),
    webhookSecret: z.string().optional(),
    eventName: z.string().optional(),
    eventSource: z.string().optional(),
    dataSource: z.string().optional(),
    dataCondition: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.targetType === 'workflow') {
        return !!data.workflowId
      } else {
        return !!data.workerId
      }
    },
    {
      message: 'Você deve selecionar um workflow ou worker dependendo do tipo de destino',
      path: ['workflowId', 'workerId'],
    }
  )

type TriggerFormValues = z.infer<typeof triggerFormSchema>

// Dados de exemplo para os selects
const workflows = [
  { id: 'WF-001', name: 'Processamento de Pedidos' },
  { id: 'WF-002', name: 'Sincronização de Estoque' },
  { id: 'WF-003', name: 'Geração de Relatórios' },
  { id: 'WF-004', name: 'Processamento de Pagamentos' },
  { id: 'WF-007', name: 'Backup de Dados' },
  { id: 'WF-008', name: 'Onboarding de Usuário' },
  { id: 'WF-009', name: 'Notificação de Alerta' },
]

// Adicionar dados de exemplo para workers
const workers = [
  { id: 'W-001', name: 'Email Worker' },
  { id: 'W-002', name: 'Estoque Worker' },
  { id: 'W-003', name: 'Notificação Worker' },
  { id: 'W-004', name: 'Relatório Worker' },
  { id: 'W-005', name: 'Alerta Worker' },
]

const eventSources = [
  { id: 'user', name: 'Usuário' },
  { id: 'order', name: 'Pedido' },
  { id: 'payment', name: 'Pagamento' },
  { id: 'inventory', name: 'Estoque' },
  { id: 'system', name: 'Sistema' },
]

const dataSources = [
  { id: 'database', name: 'Banco de Dados' },
  { id: 'api', name: 'API Externa' },
  { id: 'queue', name: 'Fila' },
  { id: 'sensor', name: 'Sensor IoT' },
]

interface TriggerFormProps {
  isEdit: boolean
  triggerId?: string
}

export function TriggerForm({ isEdit, triggerId }: TriggerFormProps) {
  const router = useRouter()
  const [triggerType, setTriggerType] = useState<string>('schedule')

  // Adicionar estado para controlar o tipo de destino
  const [targetType, setTargetType] = useState<string>('workflow')

  // Valores padrão para edição (simulados)
  const defaultValues: Partial<TriggerFormValues> = isEdit
    ? {
        name: 'Relatório Diário',
        type: 'schedule',
        targetType: 'workflow',
        workflowId: 'WF-003',
        description: 'Gera relatórios diários às 8:00 de segunda a sexta',
        isActive: true,
        schedule: 'daily',
        cronExpression: '0 8 * * 1-5',
      }
    : {
        isActive: true,
        type: 'schedule',
        targetType: 'workflow',
      }

  const form = useForm<TriggerFormValues>({
    resolver: zodResolver(triggerFormSchema),
    defaultValues,
  })

  function onSubmit(values: TriggerFormValues) {
    console.log(values)
    // Em uma aplicação real, aqui você enviaria os dados para a API

    // Redirecionar para a lista de triggers
    router.push('/triggers')
  }

  // Atualiza o tipo de trigger quando o usuário muda a seleção
  const watchType = form.watch('type')
  if (watchType !== triggerType) {
    setTriggerType(watchType)
  }

  // Atualizar o tipo de destino quando o usuário muda a seleção
  const watchTargetType = form.watch('targetType')
  if (watchTargetType !== targetType) {
    setTargetType(watchTargetType)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Configure as informações básicas do trigger</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do trigger" {...field} />
                    </FormControl>
                    <FormDescription>Um nome descritivo para identificar este trigger.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Destino</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de destino" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="workflow">
                          <div className="flex items-center gap-2">
                            <Workflow className="h-4 w-4 text-blue-500" />
                            <span>Workflow</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="worker">
                          <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4 text-orange-500" />
                            <span>Worker</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Escolha se este trigger iniciará um workflow ou um worker.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {targetType === 'workflow' ? (
              <FormField
                control={form.control}
                name="workflowId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workflow</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um workflow" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {workflows.map((workflow) => (
                          <SelectItem key={workflow.id} value={workflow.id}>
                            <div className="flex items-center gap-2">
                              <Workflow className="h-4 w-4 text-blue-500" />
                              <span>{workflow.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>O workflow que será executado quando este trigger for acionado.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="workerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Worker</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um worker" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {workers.map((worker) => (
                          <SelectItem key={worker.id} value={worker.id}>
                            <div className="flex items-center gap-2">
                              <Bot className="h-4 w-4 text-orange-500" />
                              <span>{worker.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>O worker que será executado quando este trigger for acionado.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o propósito deste trigger"
                      className="resize-none"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Uma descrição opcional para ajudar a entender o propósito deste trigger.
                  </FormDescription>
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
                    <FormLabel className="text-base">Status</FormLabel>
                    <FormDescription>Ativar ou desativar este trigger.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tipo de Trigger</CardTitle>
            <CardDescription>Selecione o tipo de trigger e configure suas propriedades específicas</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Trigger</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de trigger" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="schedule">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span>Agendamento</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="webhook">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-purple-500" />
                          <span>Webhook</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="event">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-orange-500" />
                          <span>Evento</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="data">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-green-500" />
                          <span>Condição de Dados</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>O tipo de trigger determina como o workflow será iniciado.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-6">
              {triggerType === 'schedule' && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="schedule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequência</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a frequência" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="once">Uma vez</SelectItem>
                            <SelectItem value="hourly">A cada hora</SelectItem>
                            <SelectItem value="daily">Diariamente</SelectItem>
                            <SelectItem value="weekly">Semanalmente</SelectItem>
                            <SelectItem value="monthly">Mensalmente</SelectItem>
                            <SelectItem value="custom">Personalizado (Cron)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Com que frequência este trigger deve ser executado.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('schedule') === 'custom' && (
                    <FormField
                      control={form.control}
                      name="cronExpression"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expressão Cron</FormLabel>
                          <FormControl>
                            <Input placeholder="0 8 * * 1-5" {...field} />
                          </FormControl>
                          <FormDescription>
                            Expressão cron para agendamento personalizado (ex: 0 8 * * 1-5 para 8:00 de segunda a
                            sexta).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}

              {triggerType === 'webhook' && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="webhookEndpoint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endpoint</FormLabel>
                        <FormControl>
                          <Input placeholder="/api/webhooks/my-trigger" {...field} />
                        </FormControl>
                        <FormDescription>O caminho do endpoint que receberá as requisições HTTP.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="webhookMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Método HTTP</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o método HTTP" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>O método HTTP que o webhook aceitará.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="webhookSecret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Segredo do Webhook</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••••••••••" {...field} />
                        </FormControl>
                        <FormDescription>Um segredo para validar as requisições recebidas.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {triggerType === 'event' && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="eventSource"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fonte do Evento</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a fonte do evento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {eventSources.map((source) => (
                              <SelectItem key={source.id} value={source.id}>
                                {source.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>A origem do evento que acionará este trigger.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eventName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Evento</FormLabel>
                        <FormControl>
                          <Input placeholder="created, updated, deleted, etc." {...field} />
                        </FormControl>
                        <FormDescription>O nome específico do evento que acionará este trigger.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {triggerType === 'data' && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="dataSource"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fonte de Dados</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a fonte de dados" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {dataSources.map((source) => (
                              <SelectItem key={source.id} value={source.id}>
                                {source.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>A fonte de dados que será monitorada.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dataCondition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="quantity < threshold, temperature > 30, etc."
                            className="resize-none"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>A condição que, quando satisfeita, acionará o workflow.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push('/triggers')}>
              Cancelar
            </Button>
            <Button type="submit">{isEdit ? 'Salvar Alterações' : 'Criar Trigger'}</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
