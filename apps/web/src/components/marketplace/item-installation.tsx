'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Download, Check, AlertCircle } from 'lucide-react'

interface ItemInstallationProps {
  id: string
}

export function ItemInstallation({ id }: ItemInstallationProps) {
  const [installState, setInstallState] = useState<'idle' | 'installing' | 'success' | 'error'>('idle')
  const [progress, setProgress] = useState(0)

  // Dados simulados para o item
  const item = {
    id,
    name: 'Advanced Data Processing Workflow',
    pricing: {
      type: 'subscription' as const,
    },
  }

  const handleInstall = () => {
    setInstallState('installing')
    setProgress(0)

    // Simulação do progresso de instalação
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setInstallState('success')
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Instalação</h2>
          {item.pricing.type === 'subscription' && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Incluído na assinatura
            </Badge>
          )}
        </div>

        {installState === 'idle' && (
          <Button className="w-full" onClick={handleInstall}>
            <Download className="mr-2 h-4 w-4" />
            Instalar agora
          </Button>
        )}

        {installState === 'installing' && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-center text-muted-foreground">Instalando... {progress}%</p>
          </div>
        )}

        {installState === 'success' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-500">
              <Check className="h-5 w-5" />
              <span>Instalado com sucesso!</span>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <a href={`/dashboard/workflows`}>Ir para Workflows</a>
            </Button>
          </div>
        )}

        {installState === 'error' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              <span>Erro na instalação. Tente novamente.</span>
            </div>
            <Button className="w-full" onClick={handleInstall}>
              Tentar novamente
            </Button>
          </div>
        )}

        <div className="pt-2">
          <Button variant="link" className="h-auto p-0 text-sm" asChild>
            <a href={`/marketplace/download/${id}`} download>
              Baixar arquivo
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
