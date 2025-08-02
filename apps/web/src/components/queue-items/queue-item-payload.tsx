'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface QueueItemPayloadProps {
  id: string
}

export function QueueItemPayload({ id }: QueueItemPayloadProps) {
  const [copied, setCopied] = useState(false)

  // Dados simulados para demonstração
  const payload = {
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
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Payload Original</CardTitle>
          <CardDescription>Dados enviados para processamento</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
          {copied ? 'Copiado!' : 'Copiar'}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="formatted">
          <TabsList className="mb-4">
            <TabsTrigger value="formatted">Formatado</TabsTrigger>
            <TabsTrigger value="tree">Árvore</TabsTrigger>
          </TabsList>

          <TabsContent value="formatted">
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm max-h-[500px]">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </TabsContent>

          <TabsContent value="tree">
            <div className="bg-muted p-4 rounded-md overflow-auto max-h-[500px]">
              <TreeView data={payload} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface TreeViewProps {
  data: any
  level?: number
}

function TreeView({ data, level = 0 }: TreeViewProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const renderValue = (value: any, key: string) => {
    if (value === null) return <span className="text-muted-foreground">null</span>
    if (typeof value === 'boolean') return <span className="text-purple-500">{value.toString()}</span>
    if (typeof value === 'number') return <span className="text-blue-500">{value}</span>
    if (typeof value === 'string') return <span className="text-green-500">"{value}"</span>

    const isArray = Array.isArray(value)
    const isExpandable = isArray || typeof value === 'object'

    if (!isExpandable) return <span>{String(value)}</span>

    const prefix = isArray ? '[' : '{'
    const suffix = isArray ? ']' : '}'
    const count = isArray ? value.length : Object.keys(value).length

    return (
      <div>
        <span className="cursor-pointer hover:text-blue-500" onClick={() => toggleExpand(key)}>
          {prefix} {expanded[key] ? '' : `... ${count} ${isArray ? 'items' : 'properties'}`}{' '}
          {expanded[key] ? '' : suffix}
        </span>

        {expanded[key] && (
          <div className="pl-4 border-l border-muted-foreground/20">
            {isArray
              ? value.map((item: any, index: number) => (
                  <div key={index} className="py-1">
                    <span className="text-muted-foreground mr-2">{index}:</span>
                    {renderValue(item, `${key}.${index}`)}
                  </div>
                ))
              : Object.entries(value).map(([propKey, propValue]) => (
                  <div key={propKey} className="py-1">
                    <span className="text-muted-foreground mr-2">{propKey}:</span>
                    {renderValue(propValue, `${key}.${propKey}`)}
                  </div>
                ))}
            <div>{suffix}</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="font-mono text-sm">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="py-1">
          <span className="text-muted-foreground mr-2">{key}:</span>
          {renderValue(value, key)}
        </div>
      ))}
    </div>
  )
}
