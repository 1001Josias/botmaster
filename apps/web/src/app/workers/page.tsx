'use client'

import { useRef } from 'react'
import { WorkersHeader } from '@/components/workers/workers-header'
import { WorkersStats } from '@/components/workers/workers-stats'
import { WorkersGrid } from '@/components/workers/workers-grid'
import { WorkersActivity } from '@/components/workers/workers-activity'

export default function WorkersPage() {
  const gridRef = useRef<{ refreshData: () => void }>(null)

  const handleWorkerCreated = () => {
    // Trigger a refresh of the workers grid
    if (gridRef.current) {
      gridRef.current.refreshData()
    }
  }

  return (
    <div className="space-y-6">
      <WorkersHeader onWorkerCreated={handleWorkerCreated} />
      <WorkersStats />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WorkersGrid ref={gridRef} />
        </div>
        <div>
          <WorkersActivity />
        </div>
      </div>
    </div>
  )
}
