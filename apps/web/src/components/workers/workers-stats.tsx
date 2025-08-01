'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bot, CheckCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react'
import { fetchWorkers } from '@/lib/api/workers'

interface WorkerStats {
  total: number
  active: number
  inactive: number
  archived: number
}

export function WorkersStats() {
  const [stats, setStats] = useState<WorkerStats>({
    total: 0,
    active: 0,
    inactive: 0,
    archived: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        
        // Fetch all workers to calculate stats
        const [totalResponse, activeResponse, inactiveResponse, archivedResponse] = await Promise.all([
          fetchWorkers({ page: 1, limit: 1 }), // Just to get total count
          fetchWorkers({ page: 1, limit: 1, status: 'active' }),
          fetchWorkers({ page: 1, limit: 1, status: 'inactive' }),
          fetchWorkers({ page: 1, limit: 1, status: 'archived' }),
        ])

        setStats({
          total: totalResponse.pagination.total,
          active: activeResponse.pagination.total,
          inactive: inactiveResponse.pagination.total,
          archived: archivedResponse.pagination.total,
        })
      } catch (error) {
        console.error('Failed to load worker stats:', error)
        // Keep default values on error
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const getActivePercentage = () => {
    if (stats.total === 0) return 0
    return Math.round((stats.active / stats.total) * 100)
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
          <Bot className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            {stats.active} active, {stats.inactive} inactive
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.active}</div>
          <p className="text-xs text-muted-foreground">
            {getActivePercentage()}% of total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inactive Workers</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.inactive}</div>
          <p className="text-xs text-muted-foreground">
            Ready to activate
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Archived Workers</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.archived}</div>
          <p className="text-xs text-muted-foreground">
            No longer in use
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
