import { FolderStructure } from '@/components/folder-structure'
import { FolderView } from '@/components/folder-view'
import { DashboardHeader } from '@/components/dashboard-header'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <FolderStructure />
        </div>
        <div className="md:col-span-2">
          <FolderView />
        </div>
      </div>
    </div>
  )
}
