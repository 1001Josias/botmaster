'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter, RefreshCw } from 'lucide-react'

// Mock data for process execution logs
const executionLogs = [
  {
    id: 'exec1',
    startedAt: '2023-05-25T10:30:00Z',
    completedAt: '2023-05-25T10:35:00Z',
    status: 'completed',
    initiatedBy: 'System',
    duration: '5m',
  },
  {
    id: 'exec2',
    startedAt: '2023-05-24T14:45:00Z',
    completedAt: '2023-05-24T14:50:00Z',
    status: 'completed',
    initiatedBy: 'John Doe',
    duration: '5m',
  },
  {
    id: 'exec3',
    startedAt: '2023-05-23T09:15:00Z',
    completedAt: '2023-05-23T09:18:00Z',
    status: 'failed',
    initiatedBy: 'System',
    duration: '3m',
  },
  {
    id: 'exec4',
    startedAt: '2023-05-22T16:20:00Z',
    completedAt: '2023-05-22T16:25:00Z',
    status: 'completed',
    initiatedBy: 'Jane Smith',
    duration: '5m',
  },
]

export function ProcessLogs({ id }: { id: string }) {
  const [searchTerm, setSearchTerm] = useState('')

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
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const filteredLogs = executionLogs.filter(
    (log) =>
      log.initiatedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Execution Logs</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Started</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Initiated By</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{formatDate(log.startedAt)}</TableCell>
                <TableCell>{formatDate(log.completedAt)}</TableCell>
                <TableCell>{getStatusBadge(log.status)}</TableCell>
                <TableCell>{log.initiatedBy}</TableCell>
                <TableCell>{log.duration}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
