import { MetricsHeader } from '@/components/metrics/metrics-header'
import { MetricsOverview } from '@/components/metrics/metrics-overview'
import { MetricsTabs } from '@/components/metrics/metrics-tabs'

export default function MetricsPage() {
  return (
    <div className="space-y-6">
      <MetricsHeader />
      <MetricsOverview />
      <MetricsTabs />
    </div>
  )
}
