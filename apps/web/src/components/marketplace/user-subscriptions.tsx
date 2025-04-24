'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function UserSubscriptions() {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  // Dados simulados para a assinatura do usuário
  const subscription = {
    id: 'sub_123456',
    plan: 'Premium',
    status: 'active',
    startDate: '2023-10-15',
    nextBillingDate: '2023-11-15',
    amount: 9.99,
    paymentMethod: 'Visa ****4242',
  }

  // Dados simulados para o histórico de pagamentos
  const billingHistory = [
    {
      id: 'inv_123456',
      date: '2023-10-15',
      amount: 9.99,
      status: 'paid',
    },
    {
      id: 'inv_123455',
      date: '2023-09-15',
      amount: 9.99,
      status: 'paid',
    },
    {
      id: 'inv_123454',
      date: '2023-08-15',
      amount: 9.99,
      status: 'paid',
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sua Assinatura</CardTitle>
          <CardDescription>Detalhes da sua assinatura atual e status</CardDescription>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{subscription.plan}</h3>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Ativo
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Renovação em {new Date(subscription.nextBillingDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" asChild>
                    <a href="/settings/billing">Atualizar pagamento</a>
                  </Button>
                  <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Cancelar</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cancelar assinatura</DialogTitle>
                        <DialogDescription>
                          Tem certeza que deseja cancelar sua assinatura Premium? Você perderá acesso a todos os
                          recursos premium no final do período atual.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                          Voltar
                        </Button>
                        <Button variant="destructive">Confirmar cancelamento</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Histórico de pagamentos</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Fatura</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billingHistory.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                        <TableCell>{invoice.id}</TableCell>
                        <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Pago
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">Você não possui nenhuma assinatura ativa no momento</p>
              <Button asChild>
                <a href="#plans">Ver planos disponíveis</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
