'use client'

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  MoreVertical,
  Play,
  Pause,
  RefreshCw,
  Edit,
  Trash2,
  Bot,
  Search,
  ExternalLink,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { WorkerFormDialog } from './worker-form-dialog'
import { fetchWorkers, deleteWorker, updateWorkerStatus, Worker, GetWorkersParams } from '@/lib/api/workers'
import { useToast } from '@/hooks/use-toast'

interface WorkersGridRef {
  refreshData: () => void
}

export const WorkersGrid = forwardRef<WorkersGridRef>((props, ref) => {
  const router = useRouter()
  const { toast } = useToast()
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  
  // Filtering and pagination state
  const [filters, setFilters] = useState<GetWorkersParams>({
    page: 1,
    limit: 12,
    search: '',
    status: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  })

  // Load workers data
  const loadWorkers = async (params?: GetWorkersParams) => {
    try {
      setLoading(true)
      setError(null)
      const currentFilters = params || filters
      const response = await fetchWorkers(currentFilters)
      setWorkers(response.workers)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workers')
      toast({
        title: 'Error',
        description: 'Failed to load workers',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Expose refresh method to parent
  useImperativeHandle(ref, () => ({
    refreshData: () => loadWorkers()
  }))

  // Initial load
  useEffect(() => {
    loadWorkers()
  }, [])

  // Handle filter changes
  const handleFilterChange = (key: keyof GetWorkersParams, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 }
    setFilters(newFilters)
    loadWorkers(newFilters)
  }

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      const newFilters = { ...filters, page: newPage }
      setFilters(newFilters)
      loadWorkers(newFilters)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Ativo
          </Badge>
        )
      case 'inactive':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Inativo
          </Badge>
        )
      case 'archived':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Arquivado
          </Badge>
        )
      default:
        return null
    }
  }

  const getActionButton = (worker: Worker) => {
    if (worker.status === 'active') {
      return (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => handleStatusChange(worker, 'inactive')}
        >
          <Pause className="h-4 w-4" />
        </Button>
      )
    }
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        onClick={() => handleStatusChange(worker, 'active')}
      >
        <Play className="h-4 w-4" />
      </Button>
    )
  }

  const handleStatusChange = async (worker: Worker, newStatus: 'active' | 'inactive' | 'archived') => {
    try {
      await updateWorkerStatus(worker.id, { status: newStatus })
      toast({
        title: 'Success',
        description: `Worker status updated to ${newStatus}`,
      })
      loadWorkers()
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update worker status',
        variant: 'destructive',
      })
    }
  }

  const handleEditWorker = (worker: Worker) => {
    setEditingWorker(worker)
    setOpenEditDialog(true)
  }

  const handleSaveWorker = () => {
    setOpenEditDialog(false)
    setEditingWorker(null)
    loadWorkers()
    toast({
      title: 'Success',
      description: 'Worker updated successfully',
    })
  }

  const handleDeleteWorker = async (worker: Worker) => {
    if (confirm(`Are you sure you want to delete "${worker.name}"?`)) {
      try {
        await deleteWorker(worker.id)
        toast({
          title: 'Success',
          description: 'Worker deleted successfully',
        })
        loadWorkers()
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to delete worker',
          variant: 'destructive',
        })
      }
    }
  }

  const handleViewDetails = (worker: Worker) => {
    router.push(`/workers/${worker.id}`)
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center text-destructive">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Workers</CardTitle>
          
          {/* Filters */}
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workers..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onValueChange={(value) => {
                const [sortBy, sortOrder] = value.split('-')
                setFilters({ ...filters, sortBy: sortBy as any, sortOrder: sortOrder as any })
                loadWorkers({ ...filters, sortBy: sortBy as any, sortOrder: sortOrder as any })
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
                <SelectItem value="createdAt-desc">Newest</SelectItem>
                <SelectItem value="createdAt-asc">Oldest</SelectItem>
                <SelectItem value="updatedAt-desc">Recently Updated</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={() => loadWorkers()} variant="outline" size="icon">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading workers...</span>
            </div>
          ) : workers.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              No workers found
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workers.map((worker) => (
                  <Card key={worker.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4 text-blue-500" />
                          <CardTitle className="text-base">{worker.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(worker.status)}
                          <span className="text-xs text-muted-foreground">{worker.scope}</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(worker)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditWorker(worker)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteWorker(worker)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {worker.description || 'No description'}
                      </p>
                      {worker.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {worker.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {worker.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{worker.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <div className="text-xs text-muted-foreground">
                        <span>Updated: {new Date(worker.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getActionButton(worker)}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} workers
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, pagination.page - 2) + i
                        if (pageNum > pagination.totalPages) return null
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === pagination.page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <WorkerFormDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        worker={editingWorker}
        onSave={handleSaveWorker}
      />
    </>
  )
})
