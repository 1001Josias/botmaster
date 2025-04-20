import { QueuesHeader } from '@/components/queues/queues-header'
import { QueuesStats } from '@/components/queues/queues-stats'
import { QueuesTable } from '@/components/queues/queues-table'

export default function QueuesPage() {
  return (
    <div className="space-y-6">
      <QueuesHeader />
      <QueuesStats />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QueuesTable />
        </div>
      </div>
    </div>
  )
}
