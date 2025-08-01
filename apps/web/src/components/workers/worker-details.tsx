'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Play, Pause, RefreshCw, Trash2, Server, Clock, Repeat, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WorkerFormDialog } from './worker-form-dialog'
import { WorkerVersions } from './worker-version'
import { ExecuteWorkerDialog } from './execute-worker-dialog'
import { fetchWorkerById, deleteWorker, updateWorkerStatus, Worker } from '@/lib/api/workers'
import { useToast } from '@/hooks/use-toast'

interface WorkerDetailsProps {
  id: string
}

export function WorkerDetails({ id }: WorkerDetailsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [worker, setWorker] = useState<Worker | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openExecuteDialog, setOpenExecuteDialog] = useState(false)

  // Load worker data
  const loadWorker = async () => {
    try {
      setLoading(true)
      setError(null)
      const workerId = parseInt(id)
      if (isNaN(workerId)) {
        throw new Error('Invalid worker ID')
      }
      const workerData = await fetchWorkerById(workerId)
      setWorker(workerData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load worker')
      toast({
        title: 'Error',
        description: 'Failed to load worker details',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    loadWorker()
  }, [id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active
          </Badge>
        )
      case 'inactive':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Inactive
          </Badge>
        )
      case 'archived':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Archived
          </Badge>
        )
      default:
        return null
    }
  }

  const handleSaveWorker = () => {
    setOpenEditDialog(false)
    loadWorker()
    toast({
      title: 'Success',
      description: 'Worker updated successfully',
    })
  }

  const handleToggleStatus = async () => {
    if (!worker) return
    
    try {
      const newStatus = worker.status === 'active' ? 'inactive' : 'active'
      await updateWorkerStatus(worker.id, { status: newStatus })
      setWorker({ ...worker, status: newStatus })
      toast({
        title: 'Success',
        description: `Worker ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      })
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update worker status',
        variant: 'destructive',
      })
    }
  }

  const handleRestart = () => {
    // TODO: Implement worker restart API call
    toast({
      title: 'Info',
      description: 'Worker restart functionality coming soon',
    })
  }

  const handleDelete = async () => {
    if (!worker) return
    
    if (confirm(`Are you sure you want to delete "${worker.name}"?`)) {
      try {
        await deleteWorker(worker.id)
        toast({
          title: 'Success',
          description: 'Worker deleted successfully',
        })
        router.push('/workers')
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to delete worker',
          variant: 'destructive',
        })
      }
    }
  }

  const handleExecute = (version: string, options: any, machines: string[]) => {
    // TODO: Implement worker execution API call
    toast({
      title: 'Info',
      description: 'Worker execution functionality coming soon',
    })
    console.log(`Executing worker ${id} with version ${version}`, { options, machines })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading worker details...</span>
        </div>
      </div>
    )
  }

  if (error || !worker) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center text-destructive">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>{error || 'Worker not found'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{worker.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge(worker.status)}
              <span className="text-sm text-muted-foreground">{worker.scope}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRestart}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Restart
          </Button>
          <Button variant="outline" onClick={handleToggleStatus}>
            {worker.status === 'active' ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Deactivate
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Activate
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => setOpenExecuteDialog(true)}>
            <Play className="h-4 w-4 mr-2" />
            Execute
          </Button>
          <Button variant="outline" onClick={() => setOpenEditDialog(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">Description</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {worker.description || 'No description available'}
            </p>
          </div>

          {worker.tags && worker.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {worker.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Server className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Scope</span>
              </div>
              <span className="text-sm font-medium capitalize">{worker.scope}</span>
            </div>

            {worker.scopeRef && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm ml-6">Scope Reference</span>
                </div>
                <span className="text-sm font-medium">{worker.scopeRef}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium">Created</h3>
              <p className="text-sm text-muted-foreground mt-1">{formatDate(worker.createdAt)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Last Updated</h3>
              <p className="text-sm text-muted-foreground mt-1">{formatDate(worker.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Recent Logs</h3>
            <div className="text-center p-8 text-muted-foreground">
              <p>Logs functionality coming soon</p>
              <p className="text-xs mt-2">Worker logs will be displayed here once the logging API is implemented</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="mt-6">
          <WorkerVersions workerId={id} />
        </TabsContent>
      </Tabs>

      <WorkerFormDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        worker={worker}
        onSave={handleSaveWorker}
      />
      <ExecuteWorkerDialog
        open={openExecuteDialog}
        onOpenChange={setOpenExecuteDialog}
        workerId={id}
        workerVersions={['latest', '1.0.0', '1.1.0', '1.2.0']}
        onExecute={handleExecute}
      />
    </div>
  )
}
