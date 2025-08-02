import { QueueItemDetails } from '@/components/queue-items/queue-item-details'
import { QueueItemHeader } from '@/components/queue-items/queue-item-header'

export default function QueueItemPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-6">
      <QueueItemHeader id={params.id} />
      <QueueItemDetails id={params.id} />
    </div>
  )
}
