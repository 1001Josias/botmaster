import { WorkflowsHeader } from '@/components/workflows/workflows-header'
import { WorkflowsList } from '@/components/workflows/workflows-list'
import { WorkflowsStats } from '@/components/workflows/workflows-stats'

export default function WorkflowsPage() {
  return (
    <div className="space-y-6">
      <WorkflowsHeader />
      <WorkflowsStats />
      <WorkflowsList />
    </div>
  )
}
