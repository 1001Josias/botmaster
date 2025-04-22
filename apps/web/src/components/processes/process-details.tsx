'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, Play } from 'lucide-react'
import { ProcessDiagram } from './process-diagram'
import { ProcessHistory } from './process-history'
import { ProcessLogs } from './process-logs'

// Mock data for a process
const processData = {
  id: '1',
  name: 'Customer Onboarding',
  description: 'Process for onboarding new customers',
  status: 'active',
  version: '1.2',
  createdAt: '2023-05-15T10:30:00Z',
  updatedAt: '2023-05-20T14:45:00Z',
  createdBy: 'Sarah Johnson',
  lastUpdatedBy: 'Michael Chen',
}

export function ProcessDetails({ id }: { id: string }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('diagram')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500">Pending Implementation</Badge>
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleImplementProcess = () => {
    router.push(`/processes/implementation/${id}`)
  }

  const handleSimulateProcess = () => {
    // In a real application, this would trigger a simulation
    console.log('Simulate process', id)
  }

  const handleExportProcess = () => {
    // In a real application, this would export the process
    console.log('Export process', id)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/processes')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{processData.name}</h1>
            <div className="flex items-center gap-2">
              {getStatusBadge(processData.status)}
              <span className="text-sm text-muted-foreground">Version {processData.version}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          {processData.status === 'pending' && <Button onClick={handleImplementProcess}>Implement Process</Button>}
          {processData.status === 'active' && (
            <Button onClick={handleSimulateProcess}>
              <Play className="mr-2 h-4 w-4" />
              Simulate
            </Button>
          )}
          <Button variant="outline" onClick={handleExportProcess}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Process Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">{processData.description}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Created By</p>
              <p className="text-sm text-muted-foreground">
                {processData.createdBy} on {formatDate(processData.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Last Updated By</p>
              <p className="text-sm text-muted-foreground">
                {processData.lastUpdatedBy} on {formatDate(processData.updatedAt)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-sm text-muted-foreground">{getStatusBadge(processData.status)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="diagram">Diagram</TabsTrigger>
          <TabsTrigger value="history">Version History</TabsTrigger>
          <TabsTrigger value="logs">Execution Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="diagram" className="mt-4">
          <ProcessDiagram id={id} />
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <ProcessHistory id={id} />
        </TabsContent>
        <TabsContent value="logs" className="mt-4">
          <ProcessLogs id={id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
