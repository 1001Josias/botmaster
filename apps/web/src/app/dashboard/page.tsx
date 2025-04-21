import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { DashboardFilters } from '@/components/dashboard/dashboard-filters'
import { DashboardKPIs } from '@/components/dashboard/dashboard-kpis'
import { DashboardCharts } from '@/components/dashboard/dashboard-charts'
import { DashboardTable } from '@/components/dashboard/dashboard-table'
import { DashboardTrends } from '@/components/dashboard/dashboard-trends'
import { DashboardPerformance } from '@/components/dashboard/dashboard-performance'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <DashboardFilters />
      <DashboardKPIs />
      <DashboardCharts />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardTable />
        </div>
        <div>
          <DashboardPerformance />
        </div>
      </div>
      <DashboardTrends />
    </div>
  )
}
