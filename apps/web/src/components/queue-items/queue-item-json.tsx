'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Download } from 'lucide-react'
import { useState } from 'react'

interface QueueItemJsonProps {
  id: string
}

export function QueueItemJson({ id }: QueueItemJsonProps) {
  const [copied, setCopied] = useState(false)

  // Dados simulados para demonstração
  const queueItem = {
    id,
    jobId: 'job-123',
    jobName: 'Processamento de Dados',
    workerId: 'worker-456',
    workerName: 'Worker de Análise',
    workerVersion: '1.5',
    status: 'completed',
    createdAt: '2023-05-15T14:30:00Z',
    startedAt: '2023-05-15T14:30:05Z',
    finishedAt: '2023-05-15T14:31:25Z',
    processingTime: 80000,
    payload: {
      requestId: 'req-789',
      timestamp: '2023-05-15T14:29:55Z',
      source: 'API',
      user: 'user@example.com',
      data: {
        customerId: 'cust-123',
        orderId: 'order-456',
        items: [
          { id: 'item-1', name: 'Product A', quantity: 2, price: 29.99 },
          { id: 'item-2', name: 'Product B', quantity: 1, price: 49.99 },
        ],
        shipping: {
          address: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'USA',
        },
        payment: {
          method: 'credit_card',
          cardLast4: '1234',
          amount: 109.97,
          currency: 'USD',
        },
        options: {
          priority: 'standard',
          gift: false,
          notes: 'Please leave at the front door',
        },
      },
    },
    result: {
      success: true,
      processedItems: 150,
      skippedItems: 3,
      duration: 80000,
      summary: {
        totalRecords: 153,
        validRecords: 150,
        invalidRecords: 3,
      },
      details: {
        batchResults: [
          { batchId: 1, processed: 50, duration: 25000 },
          { batchId: 2, processed: 50, duration: 25000 },
          { batchId: 3, processed: 50, duration: 30000 },
        ],
      },
    },
    error: null,
    attempts: 1,
    maxAttempts: 3,
    priority: 2,
    tags: ['production', 'data-processing'],
    metadata: { source: 'API', requestId: 'req-789' },
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(queueItem, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(queueItem, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `queue-item-${id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>JSON Completo</CardTitle>
          <CardDescription>Representação completa do Queue Item em JSON</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            {copied ? 'Copiado!' : 'Copiar'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Baixar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="bg-muted p-4 rounded-md overflow-auto text-sm max-h-[600px]">
          {JSON.stringify(queueItem, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}
