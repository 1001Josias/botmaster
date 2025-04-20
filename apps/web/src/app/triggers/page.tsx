import { TriggersHeader } from '@/components/triggers/triggers-header'
import { TriggersStats } from '@/components/triggers/triggers-stats'
import { TriggersList } from '@/components/triggers/triggers-list'

export default function TriggersPage() {
  return (
    <div className="space-y-6">
      <TriggersHeader />
      <TriggersStats />
      <TriggersList />
    </div>
  )
}
