"use client"

import { useState } from "react"
import { MarketplaceItemCard } from "@/components/marketplace/marketplace-item-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function MarketplaceGrid() {
  const [activeTab, setActiveTab] = useState("popular")

  // Dados simulados para os itens do marketplace
  const items = [
    {
      id: "item-1",
      name: "Email Automation Worker",
      description: "Automatize o envio de emails com templates personalizados",
      type: "worker",
      author: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      pricing: {
        type: "free" as const,
      },
      rating: 4.5,
      reviewCount: 28,
      downloads: 1250,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "item-2",
      name: "Data Processing Workflow",
      description: "Workflow para processamento e transformação de dados",
      type: "workflow",
      author: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      pricing: {
        type: "paid" as const,
        price: 29.99,
      },
      rating: 4.7,
      reviewCount: 42,
      downloads: 890,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "item-3",
      name: "Customer Onboarding Process",
      description: "Processo completo para onboarding de novos clientes",
      type: "process",
      author: {
        name: "BotMaster Team",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      pricing: {
        type: "subscription" as const,
        subscriptionPlans: ["premium"],
      },
      rating: 4.9,
      reviewCount: 76,
      downloads: 2100,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "item-4",
      name: "API Integration Worker",
      description: "Worker para integração com APIs externas",
      type: "worker",
      author: {
        name: "Tech Solutions",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      pricing: {
        type: "free" as const,
      },
      rating: 4.2,
      reviewCount: 15,
      downloads: 750,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "item-5",
      name: "Report Generation Workflow",
      description: "Gere relatórios automatizados em diversos formatos",
      type: "workflow",
      author: {
        name: "Reporting Experts",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      pricing: {
        type: "paid" as const,
        price: 19.99,
      },
      rating: 4.6,
      reviewCount: 33,
      downloads: 1100,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "item-6",
      name: "Sales Pipeline Process",
      description: "Processo BPMN para gestão de pipeline de vendas",
      type: "process",
      author: {
        name: "Sales Automation Inc",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      pricing: {
        type: "subscription" as const,
        subscriptionPlans: ["premium", "enterprise"],
      },
      rating: 4.8,
      reviewCount: 54,
      downloads: 1800,
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Explore o Marketplace</h2>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="popular">Populares</TabsTrigger>
            <TabsTrigger value="recent">Recentes</TabsTrigger>
            <TabsTrigger value="free">Gratuitos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <MarketplaceItemCard key={item.id} item={item} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button variant="outline">Carregar mais</Button>
      </div>
    </div>
  )
}

