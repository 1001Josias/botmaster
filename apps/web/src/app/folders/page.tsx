import { FoldersHeader } from '@/components/folders/folders-header'
import { FoldersStats } from '@/components/folders/folders-stats'
import { FoldersExplorer } from '@/components/folders/folders-explorer'

export default function FoldersPage() {
  return (
    <div className="space-y-6">
      <FoldersHeader />
      <FoldersStats />
      <FoldersExplorer />
    </div>
  )
}
