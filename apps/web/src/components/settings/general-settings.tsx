'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

const formSchema = z.object({
  organizationName: z.string().min(2, {
    message: 'O nome da organização deve ter pelo menos 2 caracteres.',
  }),
  subdomain: z.string().min(3, {
    message: 'O subdomínio deve ter pelo menos 3 caracteres.',
  }),
  description: z.string().optional(),
  timezone: z.string(),
  language: z.string(),
  enableAnalytics: z.boolean(),
})

export function GeneralSettings() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: 'Minha Organização',
      subdomain: 'minhaorg',
      description: 'Descrição da minha organização',
      timezone: 'America/Sao_Paulo',
      language: 'pt-BR',
      enableAnalytics: true,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações Gerais</h3>
        <p className="text-sm text-muted-foreground">Configure as informações básicas da sua organização.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="organizationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Organização</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da sua organização" {...field} />
                </FormControl>
                <FormDescription>Este é o nome que será exibido em toda a plataforma.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subdomain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subdomínio</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Input {...field} />
                    <span className="ml-2">.botmaster.com</span>
                  </div>
                </FormControl>
                <FormDescription>Este é o URL que seus usuários usarão para acessar a plataforma.</FormDescription>
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
                  <Textarea placeholder="Descreva sua organização" className="resize-none" {...field} />
                </FormControl>
                <FormDescription>Uma breve descrição da sua organização.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuso Horário</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Idioma</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="enableAnalytics"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Analytics</FormLabel>
                  <FormDescription>Habilitar coleta de dados de uso para melhorar a plataforma.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Salvar Alterações</Button>
        </form>
      </Form>
    </div>
  )
}
