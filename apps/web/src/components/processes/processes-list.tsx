'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Activity, Edit, Eye, MoreHorizontal, Play, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Mock data for processes
const processes = [
  {
    id: '1',
    name: 'Customer Onboarding',
    description: 'Process for onboarding new customers',
    status: 'active',
    lastUpdated: '2023-05-15T10:30:00Z',
    version: '1.2',
    owner: 'Sarah Johnson',
  },
  {
    id: '2',
    name: 'Invoice Processing',
    description: 'Automated invoice processing workflow',
    status: 'pending',
    lastUpdated: '2023-05-10T14:45:00Z',
    version: '1.0',
    owner: 'Michael Chen',
  },
  {
    id: '3',
    name: 'Employee Offboarding',
    description: 'Process for offboarding employees',
    status: 'active',
    lastUpdated: '2023-05-08T09:15:00Z',
    version: '2.1',
    owner: 'Jessica Williams',
  },
  {
    id: '4',
    name: 'Expense Approval',
    description: 'Workflow for expense approvals',
    status: 'pending',
    lastUpdated: '2023-05-05T16:20:00Z',
    version: '1.1',
    owner: 'David Rodriguez',
  },
  {
    id: '5',
    name: 'Product Return',
    description: 'Customer product return process',
    status: 'completed',
    lastUpdated: '2023-04-28T11:10:00Z',
    version: '1.3',
    owner: 'Emily Taylor',
  },
]

export function ProcessesList() {
  const router = useRouter()

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
    })
  }

  const handleViewProcess = (id: string) => {
    router.push(`/processes/${id}`)
  }

  const handleEditProcess = (id: string) => {
    router.push(`/processes/editor?id=${id}`)
  }

  const handleImplementProcess = (id: string) => {
    router.push(`/processes/implementation/${id}`)
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Business Processes</CardTitle>
        <CardDescription>View and manage your business processes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {processes.map((process) => (
            <div
              key={process.id}
              className="flex flex-col items-start justify-between rounded-lg border p-4 md:flex-row md:items-center"
            >
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{process.name}</h3>
                  {getStatusBadge(process.status)}
                </div>
                <p className="text-sm text-muted-foreground">{process.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>Version: {process.version}</span>
                  <span>•</span>
                  <span>Updated: {formatDate(process.lastUpdated)}</span>
                  <span>•</span>
                  <span>Owner: {process.owner}</span>
                </div>
              </div>
              <div className="mt-2 flex w-full flex-col gap-2 md:mt-0 md:w-auto md:flex-row">
                {process.status === 'pending' && (
                  <Button variant="outline" size="sm" onClick={() => handleImplementProcess(process.id)}>
                    <Activity className="mr-2 h-4 w-4" />
                    Implement
                  </Button>
                )}
                {process.status === 'active' && (
                  <Button variant="outline" size="sm" onClick={() => console.log('Simulate process', process.id)}>
                    <Play className="mr-2 h-4 w-4" />
                    Simulate
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => handleViewProcess(process.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEditProcess(process.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleViewProcess(process.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    {process.status === 'pending' && (
                      <DropdownMenuItem onClick={() => handleImplementProcess(process.id)}>
                        <Activity className="mr-2 h-4 w-4" />
                        Implement
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
