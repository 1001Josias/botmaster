'use client'

import type React from 'react'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, Search, Database, Cog, Globe, Zap } from 'lucide-react'

interface WorkerItem {
  id: string
  name: string
  description: string
  type: string
  inputs?: { name: string; type: string; required: boolean }[]
  outputs?: { name: string; type: string }[]
}

interface WorkflowSidebarProps {
  workers: WorkerItem[]
  isLoading: boolean
}

export function WorkflowSidebar({ workers, isLoading }: WorkflowSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('')

  // Filter workers based on search term
  const filteredWorkers = workers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Group workers by type
  const dataWorkers = filteredWorkers.filter((w) => w.type === 'data')
  const processWorkers = filteredWorkers.filter((w) => w.type === 'process')
  const apiWorkers = filteredWorkers.filter((w) => w.type === 'api')
  const systemWorkers = filteredWorkers.filter((w) => w.type !== 'data' && w.type !== 'process' && w.type !== 'api')

  // Handle drag start - Corrigido para garantir que os dados são definidos corretamente
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, worker: WorkerItem) => {
    try {
      // Criar um objeto simplificado para evitar problemas de serialização
      const workerData = {
        id: worker.id,
        name: worker.name,
        description: worker.description || '',
        type: worker.type,
        // Garantir que inputs e outputs são arrays válidos
        inputs: worker.inputs || [],
        outputs: worker.outputs || [],
      }

      // Converter para string JSON
      const serializedData = JSON.stringify(workerData)

      // Definir os dados no evento de arrastar com o tipo MIME correto
      event.dataTransfer.setData('application/reactflow', serializedData)

      // Também definir como texto simples para compatibilidade entre navegadores
      event.dataTransfer.setData('text/plain', serializedData)

      // Definir o efeito permitido
      event.dataTransfer.effectAllowed = 'move'

      console.log('Drag started with data:', serializedData)
    } catch (error) {
      console.error('Failed to set drag data:', error)
    }
  }

  return (
    <div className="w-72 rounded-lg border bg-background shadow-sm">
      <div className="p-4">
        <h3 className="mb-2 font-medium">Available Workers</h3>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="process">Process</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[calc(100vh-20rem)]">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <TabsContent value="all" className="m-0">
                <WorkerList workers={filteredWorkers} onDragStart={onDragStart} />
              </TabsContent>

              <TabsContent value="data" className="m-0">
                <WorkerList workers={dataWorkers} onDragStart={onDragStart} />
              </TabsContent>

              <TabsContent value="process" className="m-0">
                <WorkerList workers={processWorkers} onDragStart={onDragStart} />
              </TabsContent>

              <TabsContent value="api" className="m-0">
                <WorkerList workers={apiWorkers} onDragStart={onDragStart} />
              </TabsContent>

              <TabsContent value="system" className="m-0">
                <WorkerList workers={systemWorkers} onDragStart={onDragStart} />
              </TabsContent>
            </>
          )}
        </ScrollArea>
      </Tabs>
    </div>
  )
}

interface WorkerListProps {
  workers: WorkerItem[]
  onDragStart: (event: React.DragEvent<HTMLDivElement>, worker: WorkerItem) => void
}

function WorkerList({ workers, onDragStart }: WorkerListProps) {
  if (workers.length === 0) {
    return <div className="flex h-20 items-center justify-center text-sm text-muted-foreground">No workers found</div>
  }

  return (
    <div className="space-y-1 p-2">
      {workers.map((worker) => (
        <div
          key={worker.id}
          className="flex cursor-grab items-center gap-3 rounded-md border border-transparent bg-background p-3 hover:border-border hover:bg-accent"
          draggable
          onDragStart={(event) => onDragStart(event, worker)}
        >
          <WorkerIcon type={worker.type} />
          <div className="space-y-1">
            <h4 className="text-sm font-medium leading-none">{worker.name}</h4>
            <p className="text-xs text-muted-foreground line-clamp-2">{worker.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function WorkerIcon({ type }: { type: string }) {
  switch (type) {
    case 'data':
      return <Database className="h-5 w-5 text-blue-500" />
    case 'process':
      return <Cog className="h-5 w-5 text-amber-500" />
    case 'api':
      return <Globe className="h-5 w-5 text-green-500" />
    default:
      return <Zap className="h-5 w-5 text-purple-500" />
  }
}
