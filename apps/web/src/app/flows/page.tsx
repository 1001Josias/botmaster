import { FlowsHeader } from '@/components/flows/flows-header'
import { FlowsStats } from '@/components/flows/flows-stats'
import { FlowsList } from '@/components/flows/flows-list'

export default function FlowsPage() {
  return (
    <div className="space-y-6">
      <FlowsHeader />
      <FlowsStats />
      <FlowsList />
    </div>
  )
}
