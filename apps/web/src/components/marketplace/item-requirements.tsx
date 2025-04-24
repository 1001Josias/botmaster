"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Check, AlertCircle } from "lucide-react"

interface ItemRequirementsProps {
  id: string
}

export function ItemRequirements({ id }: ItemRequirementsProps) {
  // Dados simulados para os requisitos
  const requirements = [
    {
      name: "BotMaster v2.0+",
      met: true,
    },
    {
      name: "Worker: Email Sender",
      met: true,
    },
    {
      name: "Worker: Data Transformer",
      met: false,
    },
    {
      name: "Acesso a API externa",
      met: true,
    },
  ]

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Requisitos</h2>

        <ul className="space-y-2">
          {requirements.map((req, index) => (
            <li key={index} className="flex items-center gap-2">
              {req.met ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              )}
              <span className={req.met ? "" : "text-muted-foreground"}>{req.name}</span>
              {!req.met && <span className="text-xs text-amber-500 ml-auto">Não instalado</span>}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

