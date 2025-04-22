'use client'

import { useState } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { Cog, Database, Globe, Zap, Settings } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function WorkerNode({ data, isConnectable }: NodeProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Verificar se temos dados válidos
  if (!data) {
    console.error('Worker node received invalid data:', data)
    return (
      <div className="rounded-md border bg-red-50 p-3 shadow-sm">
        <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="h-3 w-3 bg-primary" />
        <div className="text-sm font-medium text-red-500">Invalid Worker Data</div>
        <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="h-3 w-3 bg-primary" />
      </div>
    )
  }

  // Get icon based on worker type
  const getIcon = () => {
    switch (data.type) {
      case 'data':
        return <Database className="h-4 w-4 text-blue-500" />
      case 'process':
        return <Cog className="h-4 w-4 text-amber-500" />
      case 'api':
        return <Globe className="h-4 w-4 text-green-500" />
      default:
        return <Zap className="h-4 w-4 text-purple-500" />
    }
  }

  return (
    <>
      <div className="rounded-md border bg-background p-3 shadow-sm">
        <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="h-3 w-3 bg-primary" />

        <div className="flex items-center gap-2">
          {getIcon()}
          <div className="text-sm font-medium">{data.label || data.name || 'Worker'}</div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto h-6 w-6 rounded-full p-0">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Configure</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Configure Worker: {data.name}</DialogTitle>
                <DialogDescription>Configure the inputs and settings for this worker.</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="info" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Info</TabsTrigger>
                  <TabsTrigger value="inputs">Inputs</TabsTrigger>
                  <TabsTrigger value="outputs">Outputs</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="worker-name">Name</Label>
                    <Input id="worker-name" value={data.name || ''} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="worker-type">Type</Label>
                    <Input id="worker-type" value={data.type || ''} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="worker-description">Description</Label>
                    <div className="rounded-md border p-2 text-sm">
                      {data.description || 'No description available.'}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="inputs" className="space-y-4 py-4">
                  {data.inputs && data.inputs.length > 0 ? (
                    data.inputs.map((input: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <Label htmlFor={`input-${index}`}>
                          {input.name} {input.required && <span className="text-red-500">*</span>}
                        </Label>
                        <Input
                          id={`input-${index}`}
                          placeholder={`Enter ${input.name}...`}
                          type={input.type === 'number' ? 'number' : 'text'}
                        />
                        <p className="text-xs text-muted-foreground">Type: {input.type}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">This worker has no configurable inputs.</div>
                  )}
                </TabsContent>

                <TabsContent value="outputs" className="space-y-4 py-4">
                  {data.outputs && data.outputs.length > 0 ? (
                    data.outputs.map((output: any, index: number) => (
                      <div key={index} className="space-y-1">
                        <Label>{output.name}</Label>
                        <p className="text-xs text-muted-foreground">Type: {output.type}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">Output information not available.</div>
                  )}
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="h-3 w-3 bg-primary" />
      </div>
    </>
  )
}
