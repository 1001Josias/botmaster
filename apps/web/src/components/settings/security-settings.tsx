'use client'

import { Textarea } from '@/components/ui/textarea'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const formSchema = z.object({
  passwordPolicy: z.string(),
  mfaRequired: z.boolean(),
  sessionTimeout: z.string(),
  ipRestriction: z.boolean(),
  allowedIps: z.string().optional(),
})

export function SecuritySettings() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passwordPolicy: 'medium',
      mfaRequired: false,
      sessionTimeout: '30',
      ipRestriction: false,
      allowedIps: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações de Segurança</h3>
        <p className="text-sm text-muted-foreground">Configure as políticas de segurança da sua organização.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="passwordPolicy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Política de Senha</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma política de senha" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Básica (mínimo 6 caracteres)</SelectItem>
                    <SelectItem value="medium">Média (mínimo 8 caracteres, letras e números)</SelectItem>
                    <SelectItem value="high">Alta (mínimo 10 caracteres, letras, números e símbolos)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Define a complexidade mínima para senhas de usuários.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mfaRequired"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Autenticação de Dois Fatores (MFA)</FormLabel>
                  <FormDescription>Exigir que todos os usuários configurem MFA.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sessionTimeout"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempo Limite da Sessão (minutos)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Tempo de inatividade antes que o usuário seja desconectado automaticamente.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ipRestriction"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Restrição de IP</FormLabel>
                  <FormDescription>Limitar o acesso a endereços IP específicos.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          {form.watch('ipRestriction') && (
            <FormField
              control={form.control}
              name="allowedIps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IPs Permitidos</FormLabel>
                  <FormControl>
                    <Textarea placeholder="192.168.1.1, 10.0.0.1" className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>Lista de endereços IP permitidos, separados por vírgula.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button type="submit">Salvar Alterações</Button>
        </form>
      </Form>
    </div>
  )
}
