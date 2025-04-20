import { UsersHeader } from '@/components/users/users-header'
import { UsersTable } from '@/components/users/users-table'
import { UsersStats } from '@/components/users/users-stats'

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <UsersHeader />
      <UsersStats />
      <UsersTable />
    </div>
  )
}
