'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QueueItemInfo } from './queue-item-info'
import { QueueItemLogs } from './queue-item-logs'
import { QueueItemPayload } from './queue-item-payload'
import { QueueItemJson } from './queue-item-json'

interface QueueItemDetailsProps {
  id: string
}

export function QueueItemDetails({ id }: QueueItemDetailsProps) {
  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="info">Informações</TabsTrigger>
        <TabsTrigger value="logs">Logs e Resultados</TabsTrigger>
        <TabsTrigger value="payload">Payload</TabsTrigger>
        <TabsTrigger value="json">JSON Raw</TabsTrigger>
      </TabsList>
      <TabsContent value="info">
        <QueueItemInfo id={id} />
      </TabsContent>
      <TabsContent value="logs">
        <QueueItemLogs id={id} />
      </TabsContent>
      <TabsContent value="payload">
        <QueueItemPayload id={id} />
      </TabsContent>
      <TabsContent value="json">
        <QueueItemJson id={id} />
      </TabsContent>
    </Tabs>
  )
}
