'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, RotateCcw } from 'lucide-react'

// Mock data for process versions
const versions = [
  {
    id: 'v1.2',
    version: '1.2',
    createdAt: '2023-05-20T14:45:00Z',
    createdBy: 'Michael Chen',
    notes: 'Added error handling for invalid customer data',
    current: true,
  },
  {
    id: 'v1.1',
    version: '1.1',
    createdAt: '2023-05-18T09:30:00Z',
    createdBy: 'Sarah Johnson',
    notes: 'Updated verification steps',
    current: false,
  },
  {
    id: 'v1.0',
    version: '1.0',
    createdAt: '2023-05-15T10:30:00Z',
    createdBy: 'Sarah Johnson',
    notes: 'Initial version',
    current: false,
  },
]

export function ProcessHistory({ id }: { id: string }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Version History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Version</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versions.map((version) => (
              <TableRow key={version.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {version.version}
                    {version.current && <Badge className="bg-green-500">Current</Badge>}
                  </div>
                </TableCell>
                <TableCell>{formatDate(version.createdAt)}</TableCell>
                <TableCell>{version.createdBy}</TableCell>
                <TableCell>{version.notes}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    {!version.current && (
                      <Button variant="outline" size="sm">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Restore
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
