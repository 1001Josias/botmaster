import { QueueItemsHeader } from "@/components/queue-items/queue-items-header"
import { QueueItemsFilters } from "@/components/queue-items/queue-items-filters"
import { QueueItemsTable } from "@/components/queue-items/queue-items-table"
import { QueueItemsStats } from "@/components/queue-items/queue-items-stats"

export default function QueueItemsPage() {
  return (
    <div className="flex flex-col gap-6">
      <QueueItemsHeader />
      <QueueItemsStats />
      <QueueItemsFilters />
      <QueueItemsTable />
    </div>
  )
}

