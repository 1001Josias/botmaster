"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Star, Clock, Shield } from "lucide-react"

export function SubscriptionBenefits() {
  const benefits = [
    {
      icon: <Download className="h-6 w-6 text-primary" />,
      title: "Acesso Premium",
      description: "Acesso ilimitado a todos os recursos premium do marketplace",
    },
    {
      icon: <Star className="h-6 w-6 text-primary" />,
      title: "Conteúdo Exclusivo",
      description: "Workflows e processes exclusivos para assinantes",
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Acesso Antecipado",
      description: "Seja o primeiro a acessar novos recursos e atualizações",
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Suporte Prioritário",
      description: "Obtenha ajuda rápida quando precisar",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Benefícios da Assinatura</CardTitle>
            <CardDescription>Desbloqueie todo o potencial do BotMaster com uma assinatura</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Economize até 40%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-3">{benefit.icon}</div>
              <h3 className="font-medium mb-1">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

