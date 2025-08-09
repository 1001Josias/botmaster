'use client'

import { useState, useCallback } from 'react'
import { TriggersHeader } from '@/components/triggers/triggers-header'
import { TriggersStats } from '@/components/triggers/triggers-stats'
import { TriggersList } from '@/components/triggers/triggers-list'

export default function TriggersPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [filters, setFilters] = useState({
    search: '',
    type: '',
  })

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  const handleSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }))
  }, [])

  const handleFilterType = useCallback((type: string) => {
    setFilters(prev => ({ ...prev, type }))
  }, [])

  return (
    <div className="space-y-6">
      <TriggersHeader 
        onSearch={handleSearch}
        onFilterType={handleFilterType}
        onRefresh={handleRefresh}
      />
      <TriggersStats key={`stats-${refreshKey}`} />
      <TriggersList 
        key={`list-${refreshKey}`}
        filters={filters}
      />
    </div>
  )
}
