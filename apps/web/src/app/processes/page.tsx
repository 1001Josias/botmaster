import { ProcessesHeader } from '@/components/processes/processes-header'
import { ProcessesStats } from '@/components/processes/processes-stats'
import { ProcessesList } from '@/components/processes/processes-list'

export default function ProcessesPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <ProcessesHeader />
      <ProcessesStats />
      <ProcessesList />
    </div>
  )
}
