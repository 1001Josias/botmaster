'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Worker, CreateWorkerInstallationDto, installWorker } from '@/lib/api/workers'
import { useToast } from '@/hooks/use-toast'

interface WorkerInstallationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  worker?: Worker | null
  onInstalled: () => void
}

export function WorkerInstallationDialog({ 
  open, 
  onOpenChange, 
  worker, 
  onInstalled 
}: WorkerInstallationDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState<CreateWorkerInstallationDto>({
    workerKey: worker?.key || '',
    priority: 5,
    defaultVersion: 'latest',
    installedBy: 1, // TODO: Get from auth context
    defaultProperties: {
      options: {
        maxConcurrent: 1,
        timeout: 60,
        processingMode: 'single',
        retryPolicy: {
          maxRetries: 3,
          retryDelay: 5,
          strategy: 'exponential',
        },
      },
    },
  })

  // Update form data when worker changes
  useState(() => {
    if (worker) {
      setFormData(prev => ({
        ...prev,
        workerKey: worker.key,
      }))
    }
  })

  const handleChange = (field: string, value: any) => {
    if (field.startsWith('options.')) {
      const optionField = field.replace('options.', '')
      setFormData(prev => ({
        ...prev,
        defaultProperties: {
          ...prev.defaultProperties,
          options: {
            ...prev.defaultProperties?.options,
            [optionField]: value,
          },
        },
      }))
    } else if (field.startsWith('retryPolicy.')) {
      const retryField = field.replace('retryPolicy.', '')
      setFormData(prev => ({
        ...prev,
        defaultProperties: {
          ...prev.defaultProperties,
          options: {
            ...prev.defaultProperties?.options,
            retryPolicy: {
              ...prev.defaultProperties?.options?.retryPolicy,
              [retryField]: value,
            },
          },
        },
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!worker) {
      toast({
        title: 'Error',
        description: 'No worker selected for installation',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      await installWorker(formData)
      toast({
        title: 'Success',
        description: `Worker "${worker.name}" installed successfully`,
      })
      onInstalled()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to install worker',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const priorityLabels: Record<number, string> = {
    0: 'Trivial',
    1: 'Lowest',
    2: 'Very Low',
    3: 'Low',
    4: 'Medium Low',
    5: 'Medium',
    6: 'Medium High',
    7: 'High',
    8: 'Very High',
    9: 'Highest',
    10: 'Critical',
  }

  if (!worker) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Install Worker</DialogTitle>
          <DialogDescription>
            Configure the installation settings for "{worker.name}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Worker Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm text-muted-foreground">{worker.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Key</Label>
                  <p className="text-sm text-muted-foreground font-mono">{worker.key}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground">
                  {worker.description || 'No description available'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Settings</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority: {priorityLabels[formData.priority || 5]}</Label>
                  <Slider
                    id="priority"
                    min={0}
                    max={10}
                    step={1}
                    value={[formData.priority || 5]}
                    onValueChange={(value) => handleChange('priority', value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Trivial</span>
                    <span>Critical</span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="defaultVersion">Default Version</Label>
                  <Select 
                    value={formData.defaultVersion} 
                    onValueChange={(value) => handleChange('defaultVersion', value)}
                  >
                    <SelectTrigger id="defaultVersion">
                      <SelectValue placeholder="Select version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest</SelectItem>
                      <SelectItem value="1.0.0">1.0.0</SelectItem>
                      <SelectItem value="1.1.0">1.1.0</SelectItem>
                      <SelectItem value="1.2.0">1.2.0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="maxConcurrent">
                    Max Concurrent Jobs: {formData.defaultProperties?.options?.maxConcurrent || 1}
                  </Label>
                  <Slider
                    id="maxConcurrent"
                    min={1}
                    max={20}
                    step={1}
                    value={[formData.defaultProperties?.options?.maxConcurrent || 1]}
                    onValueChange={(value) => handleChange('options.maxConcurrent', value[0])}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="timeout">
                    Timeout (seconds): {formData.defaultProperties?.options?.timeout || 60}
                  </Label>
                  <Slider
                    id="timeout"
                    min={10}
                    max={600}
                    step={10}
                    value={[formData.defaultProperties?.options?.timeout || 60]}
                    onValueChange={(value) => handleChange('options.timeout', value[0])}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="processingMode">Processing Mode</Label>
                  <Select 
                    value={formData.defaultProperties?.options?.processingMode || 'single'} 
                    onValueChange={(value) => handleChange('options.processingMode', value)}
                  >
                    <SelectTrigger id="processingMode">
                      <SelectValue placeholder="Select processing mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Job</SelectItem>
                      <SelectItem value="batch">Batch Processing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Retry Policy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="maxRetries">
                        Max Retries: {formData.defaultProperties?.options?.retryPolicy?.maxRetries || 3}
                      </Label>
                      <Slider
                        id="maxRetries"
                        min={0}
                        max={10}
                        step={1}
                        value={[formData.defaultProperties?.options?.retryPolicy?.maxRetries || 3]}
                        onValueChange={(value) => handleChange('retryPolicy.maxRetries', value[0])}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="retryDelay">
                        Retry Delay (seconds): {formData.defaultProperties?.options?.retryPolicy?.retryDelay || 5}
                      </Label>
                      <Slider
                        id="retryDelay"
                        min={1}
                        max={60}
                        step={1}
                        value={[formData.defaultProperties?.options?.retryPolicy?.retryDelay || 5]}
                        onValueChange={(value) => handleChange('retryPolicy.retryDelay', value[0])}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="retryStrategy">Retry Strategy</Label>
                      <Select 
                        value={formData.defaultProperties?.options?.retryPolicy?.strategy || 'exponential'} 
                        onValueChange={(value) => handleChange('retryPolicy.strategy', value)}
                      >
                        <SelectTrigger id="retryStrategy">
                          <SelectValue placeholder="Select retry strategy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="linear">Linear</SelectItem>
                          <SelectItem value="exponential">Exponential</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Installing...' : 'Install Worker'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}