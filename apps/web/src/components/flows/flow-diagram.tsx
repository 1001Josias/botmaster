'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/Button'
import { ZoomIn, ZoomOut, RotateCw } from 'lucide-react'

interface FlowDiagramProps {
  id: string
}

export function FlowDiagram({ id }: FlowDiagramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configurar o canvas para alta resolução
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    // Limpar o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Definir estilos
    ctx.font = '14px sans-serif'
    ctx.lineWidth = 2
    ctx.strokeStyle = '#3b82f6' // blue-500

    // Dados de exemplo para o diagrama
    const nodes = [
      { id: 1, name: 'Início', x: 100, y: 50, type: 'start' },
      { id: 2, name: 'Validação de Pedido', x: 100, y: 120, type: 'job' },
      { id: 3, name: 'Verificação de Estoque', x: 100, y: 190, type: 'job' },
      { id: 4, name: 'Processamento de Pagamento', x: 100, y: 260, type: 'job' },
      { id: 5, name: 'Reserva de Estoque', x: 100, y: 330, type: 'job' },
      { id: 6, name: 'Geração de Nota Fiscal', x: 300, y: 120, type: 'job' },
      { id: 7, name: 'Criação de Etiqueta', x: 300, y: 190, type: 'job' },
      { id: 8, name: 'Notificação de Envio', x: 300, y: 260, type: 'job' },
      { id: 9, name: 'Atualização de Status', x: 300, y: 330, type: 'job' },
      { id: 10, name: 'Fim', x: 300, y: 400, type: 'end' },
    ]

    const edges = [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
      { from: 6, to: 7 },
      { from: 7, to: 8 },
      { from: 8, to: 9 },
      { from: 9, to: 10 },
    ]

    // Desenhar as arestas
    edges.forEach((edge) => {
      const fromNode = nodes.find((n) => n.id === edge.from)
      const toNode = nodes.find((n) => n.id === edge.to)

      if (fromNode && toNode) {
        ctx.beginPath()

        // Se os nós estão na mesma coluna
        if (fromNode.x === toNode.x) {
          ctx.moveTo(fromNode.x, fromNode.y + 20)
          ctx.lineTo(toNode.x, toNode.y - 20)
        }
        // Se os nós estão em colunas diferentes
        else {
          ctx.moveTo(fromNode.x, fromNode.y + 20)
          ctx.lineTo(fromNode.x, fromNode.y + 35)
          ctx.lineTo(toNode.x, toNode.y - 35)
          ctx.lineTo(toNode.x, toNode.y - 20)
        }

        // Desenhar a seta
        const arrowSize = 8
        const angle = Math.atan2(toNode.y - 20 - (toNode.y - 35), toNode.x - toNode.x)
        ctx.lineTo(
          toNode.x - arrowSize * Math.cos(angle - Math.PI / 6),
          toNode.y - 20 - arrowSize * Math.sin(angle - Math.PI / 6)
        )
        ctx.moveTo(toNode.x, toNode.y - 20)
        ctx.lineTo(
          toNode.x - arrowSize * Math.cos(angle + Math.PI / 6),
          toNode.y - 20 - arrowSize * Math.sin(angle + Math.PI / 6)
        )

        ctx.stroke()
      }
    })

    // Desenhar os nós
    nodes.forEach((node) => {
      ctx.beginPath()

      if (node.type === 'start' || node.type === 'end') {
        // Círculo para início e fim
        ctx.fillStyle = node.type === 'start' ? '#3b82f6' : '#10b981'
        ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI)
        ctx.fill()

        // Texto
        ctx.fillStyle = '#ffffff'
        const textWidth = ctx.measureText(node.name).width
        ctx.fillText(node.name, node.x - textWidth / 2, node.y + 5)
      } else {
        // Retângulo para jobs
        ctx.fillStyle = '#ffffff'
        ctx.strokeStyle = '#3b82f6'
        ctx.roundRect(node.x - 80, node.y - 20, 160, 40, 5)
        ctx.stroke()
        ctx.fill()

        // Texto
        ctx.fillStyle = '#000000'
        const textWidth = ctx.measureText(node.name).width
        ctx.fillText(node.name, node.x - textWidth / 2, node.y + 5)
      }
    })
  }, [id])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Diagrama do Flow</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-[500px] w-full border rounded-md bg-background/50">
          <canvas ref={canvasRef} className="h-full w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
