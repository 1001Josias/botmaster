'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

export function SubscriptionPlans() {
  // Dados simulados para os planos de assinatura
  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Para usuários individuais e pequenos projetos',
      price: 0,
      interval: 'month',
      features: ['Acesso a recursos gratuitos', 'Até 5 downloads por mês', 'Suporte da comunidade'],
      popular: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Para profissionais e equipes pequenas',
      price: 9.99,
      interval: 'month',
      features: [
        'Acesso a todos os recursos Premium',
        'Downloads ilimitados',
        'Atualizações prioritárias',
        'Suporte por email',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Para empresas e grandes equipes',
      price: 29.99,
      interval: 'month',
      features: [
        'Tudo do Premium',
        'Acesso antecipado a novos recursos',
        'Suporte prioritário 24/7',
        'Treinamento personalizado',
        'Licença para múltiplos usuários',
      ],
      popular: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Planos de Assinatura</h2>
        <p className="text-muted-foreground">Escolha o plano que melhor atende às suas necessidades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`flex flex-col ${plan.popular ? 'border-primary shadow-md' : ''}`}>
            {plan.popular && (
              <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                Mais popular
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground ml-1">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={plan.id === 'free' ? 'outline' : 'default'}>
                {plan.id === 'free' ? 'Atual' : 'Assinar'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
