import { JobsHeader } from '@/components/jobs/jobs-header'
import { JobsStats } from '@/components/jobs/jobs-stats'
import { JobsTable } from '@/components/jobs/jobs-table'

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <JobsHeader />
      <JobsStats />
      <JobsTable />
    </div>
  )
}
