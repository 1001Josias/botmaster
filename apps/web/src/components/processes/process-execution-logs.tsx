'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Eye } from 'lucide-react'

// Dados de exemplo para execuções de processos
const executionLogs = [
  {
    id: 'exec-001',
    startedAt: '2023-05-15T10:30:00Z',
    completedAt: '2023-05-15T10:35:00Z',
    status: 'completed',
    initiatedBy: 'Sarah Johnson',
    duration: '5m 0s',
    nodesExecuted: 7,
    result: 'success',
  },
  {
    id: 'exec-002',
    startedAt: '2023-05-14T14:20:00Z',
    completedAt: '2023-05-14T14:28:00Z',
    status: 'completed',
    initiatedBy: 'Michael Chen',
    duration: '8m 0s',
    nodesExecuted: 7,
    result: 'success',
  },
  {
    id: 'exec-003',
    startedAt: '2023-05-13T09:15:00Z',
    completedAt: '2023-05-13T09:18:00Z',
    status: 'failed',
    initiatedBy: 'Jessica Williams',
    duration: '3m 0s',
    nodesExecuted: 4,
    result: 'error',
  },
  {
    id: 'exec-004',
    startedAt: '2023-05-12T16:45:00Z',
    completedAt: '2023-05-12T16:52:00Z',
    status: 'completed',
    initiatedBy: 'David Rodriguez',
    duration: '7m 0s',
    nodesExecuted: 7,
    result: 'success',
  },
  {
    id: 'exec-005',
    startedAt: '2023-05-11T11:30:00Z',
    completedAt: '2023-05-11T11:36:00Z',
    status: 'completed',
    initiatedBy: 'Sarah Johnson',
    duration: '6m 0s',
    nodesExecuted: 7,
    result: 'success',
  },
]

export function ProcessLogs({ id }: { id: string }) {
  const router = useRouter()
  const [filter, setFilter] = useState('all')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>
      case 'running':
        return <Badge className="bg-blue-500">Running</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'success':
        return <Badge className="bg-green-500">Success</Badge>
      case 'error':
        return <Badge className="bg-red-500">Error</Badge>
      case 'warning':
        return <Badge className="bg-yellow-500">Warning</Badge>
      default:
        return <Badge className="bg-gray-500">{result}</Badge>
    }
  }

  const handleViewExecution = (executionId: string) => {
    router.push(`/dashboard/processes/executions/${executionId}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Execution History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>
                All
              </Button>
              <Button
                variant={filter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('completed')}
              >
                Completed
              </Button>
              <Button
                variant={filter === 'failed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('failed')}
              >
                Failed
              </Button>
            </div>
            <Button variant="outline" size="sm">
              Export Logs
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Execution ID</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Initiated By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {executionLogs
                .filter((log) => filter === 'all' || log.status === filter)
                .map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono">{log.id}</TableCell>
                    <TableCell>{formatDate(log.startedAt)}</TableCell>
                    <TableCell>{log.duration}</TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell>{getResultBadge(log.result)}</TableCell>
                    <TableCell>{log.initiatedBy}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewExecution(log.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
