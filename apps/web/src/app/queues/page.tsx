'use client'

import { useState, useRef } from 'react'
import { QueuesHeader } from '@/components/queues/queues-header'
import { QueuesStats } from '@/components/queues/queues-stats'
import { QueuesTable } from '@/components/queues/queues-table'

export default function QueuesPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <QueuesHeader onQueueCreated={handleRefresh} />
      <QueuesStats />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QueuesTable refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  )
}
