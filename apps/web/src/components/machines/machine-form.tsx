'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Esquema de validação para o formulário
const machineFormSchema = z.object({
  name: z.string().min(2, {
    message: 'O nome deve ter pelo menos 2 caracteres.',
  }),
  description: z.string().optional(),
  location: z.string().min(1, {
    message: 'A localização é obrigatória.',
  }),
  ip: z.string().min(1, {
    message: 'O endereço IP é obrigatório.',
  }),
  os: z.string().min(1, {
    message: 'O sistema operacional é obrigatório.',
  }),
  cpuCores: z.string().min(1, {
    message: 'O número de cores de CPU é obrigatório.',
  }),
  memoryGB: z.string().min(1, {
    message: 'A quantidade de memória é obrigatória.',
  }),
  diskGB: z.string().min(1, {
    message: 'A capacidade de disco é obrigatória.',
  }),
  autoRestart: z.boolean(),
  maxWorkers: z.string().min(1, {
    message: 'O número máximo de workers é obrigatório.',
  }),
  sshKey: z.string().optional(),
  apiKey: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(['online', 'offline', 'maintenance']),
})

type MachineFormValues = z.infer<typeof machineFormSchema>

// Dados de exemplo para os selects
const locations = [
  { id: 'aws-us-east', name: 'AWS US-East' },
  { id: 'aws-us-west', name: 'AWS US-West' },
  { id: 'aws-eu', name: 'AWS Europe' },
  { id: 'gcp-us', name: 'GCP US' },
  { id: 'gcp-eu', name: 'GCP Europe' },
  { id: 'azure-us', name: 'Azure US' },
  { id: 'azure-eu', name: 'Azure Europe' },
  { id: 'azure-asia', name: 'Azure East Asia' },
  { id: 'on-premise', name: 'On-Premise' },
]

const operatingSystems = [
  { id: 'ubuntu-22.04', name: 'Ubuntu 22.04 LTS' },
  { id: 'ubuntu-20.04', name: 'Ubuntu 20.04 LTS' },
  { id: 'debian-11', name: 'Debian 11' },
  { id: 'centos-8', name: 'CentOS 8' },
  { id: 'rhel-8', name: 'Red Hat Enterprise Linux 8' },
  { id: 'windows-server-2022', name: 'Windows Server 2022' },
  { id: 'windows-server-2019', name: 'Windows Server 2019' },
]

interface MachineFormProps {
  isEdit: boolean
  machineId?: string
}

export function MachineForm({ isEdit, machineId }: MachineFormProps) {
  const router = useRouter()

  // Valores padrão para edição (simulados)
  const defaultValues: Partial<MachineFormValues> = isEdit
    ? {
        name: 'Production Server 1',
        description: 'Servidor principal para processamento de jobs em produção',
        location: 'aws-us-east',
        ip: '192.168.1.101',
        os: 'ubuntu-22.04',
        cpuCores: '8',
        memoryGB: '32',
        diskGB: '500',
        autoRestart: true,
        maxWorkers: '10',
        sshKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...',
        apiKey: 'api_key_123456789',
        tags: 'production,high-priority,critical',
        status: 'online',
      }
    : {
        autoRestart: true,
        status: 'offline',
      }

  const form = useForm<MachineFormValues>({
    resolver: zodResolver(machineFormSchema),
    defaultValues,
  })

  function onSubmit(values: MachineFormValues) {
    console.log(values)
    // Em uma aplicação real, aqui você enviaria os dados para a API

    // Redirecionar para a lista de máquinas
    router.push('/machines')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="resources">Recursos</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Configure as informações básicas da máquina</CardDescription>
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
                          <Input placeholder="Nome da máquina" {...field} />
                        </FormControl>
                        <FormDescription>Um nome descritivo para identificar esta máquina.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status Inicial</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status inicial" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="offline">Offline</SelectItem>
                            <SelectItem value="maintenance">Manutenção</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>O status inicial da máquina após a criação.</FormDescription>
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
                        <Textarea
                          placeholder="Descreva o propósito desta máquina"
                          className="resize-none"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>
                        Uma descrição opcional para ajudar a entender o propósito desta máquina.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Localização</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a localização" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location.id} value={location.id}>
                                {location.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>A localização física ou na nuvem desta máquina.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço IP</FormLabel>
                        <FormControl>
                          <Input placeholder="192.168.1.100" {...field} />
                        </FormControl>
                        <FormDescription>O endereço IP para conexão com a máquina.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="os"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sistema Operacional</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o sistema operacional" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {operatingSystems.map((os) => (
                            <SelectItem key={os.id} value={os.id}>
                              {os.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>O sistema operacional instalado na máquina.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="production,critical,high-priority" {...field} />
                      </FormControl>
                      <FormDescription>Tags separadas por vírgula para categorizar a máquina.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="autoRestart"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Auto Restart</FormLabel>
                        <FormDescription>
                          Reiniciar automaticamente o agente jobmaster em caso de falha.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recursos da Máquina</CardTitle>
                <CardDescription>Configure os recursos de hardware disponíveis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="cpuCores"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cores de CPU</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>Número de cores de CPU disponíveis.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="memoryGB"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Memória (GB)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>Quantidade de memória RAM em GB.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="diskGB"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disco (GB)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>Capacidade de armazenamento em GB.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="maxWorkers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Máximo de Workers</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Número máximo de workers que podem ser executados simultaneamente.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>Configure as credenciais de acesso à máquina</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="sshKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chave SSH</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC..."
                          className="resize-none font-mono text-xs h-32"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>Chave SSH pública para acesso à máquina.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chave de API</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription>Chave de API para autenticação do agente jobmaster.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push('/machines')}>
            Cancelar
          </Button>
          <Button type="submit">{isEdit ? 'Salvar Alterações' : 'Criar Máquina'}</Button>
        </div>
      </form>
    </Form>
  )
}
