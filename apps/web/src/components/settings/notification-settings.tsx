'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  slackNotifications: z.boolean(),
  slackWebhook: z.string().optional(),
  emailRecipients: z.string().optional(),
  notifyOnError: z.boolean(),
  notifyOnWarning: z.boolean(),
  notifyOnSuccess: z.boolean(),
})

export function NotificationSettings() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: false,
      slackNotifications: false,
      slackWebhook: undefined,
      emailRecipients: undefined,
      notifyOnError: true,
      notifyOnWarning: true,
      notifyOnSuccess: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações de Notificações</h3>
        <p className="text-sm text-muted-foreground">Configure como e quando você deseja receber notificações.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Canais de Notificação</h4>
            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Notificações por Email</FormLabel>
                    <FormDescription>Receba notificações por email.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch('emailNotifications') && (
              <FormField
                control={form.control}
                name="emailRecipients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destinatários de Email</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="email1@exemplo.com, email2@exemplo.com"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Lista de emails que receberão notificações, separados por vírgula.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="pushNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Notificações Push</FormLabel>
                    <FormDescription>Receba notificações push no navegador.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slackNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Notificações no Slack</FormLabel>
                    <FormDescription>Receba notificações em um canal do Slack.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch('slackNotifications') && (
              <FormField
                control={form.control}
                name="slackWebhook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do Webhook do Slack</FormLabel>
                    <FormControl>
                      <Input placeholder="https://hooks.slack.com/services/..." {...field} />
                    </FormControl>
                    <FormDescription>URL do webhook para enviar notificações para o Slack.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Eventos de Notificação</h4>
            <FormField
              control={form.control}
              name="notifyOnError"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Erros</FormLabel>
                    <FormDescription>Notificar quando ocorrerem erros.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notifyOnWarning"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Avisos</FormLabel>
                    <FormDescription>Notificar quando ocorrerem avisos.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notifyOnSuccess"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Sucessos</FormLabel>
                    <FormDescription>Notificar quando operações forem concluídas com sucesso.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit">Salvar Alterações</Button>
        </form>
      </Form>
    </div>
  )
}
