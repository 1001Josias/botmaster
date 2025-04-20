import { FoldersHeader } from '@/components/folders/folders-header'
import { FoldersStats } from '@/components/folders/folders-stats'
import { FoldersManagement } from '@/components/folders/folders-management'

export const metadata = {
  title: 'Folders',
  description: 'Manage your folders',
}

export default function FoldersPage() {
  return (
    <div className="space-y-6">
      <FoldersHeader />
      <FoldersStats />
      <FoldersManagement />
    </div>
  )
}
