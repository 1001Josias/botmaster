import { WebhooksHeader } from '@/components/webhooks/webhooks-header'
import { WebhooksStats } from '@/components/webhooks/webhooks-stats'
import { WebhooksList } from '@/components/webhooks/webhooks-list'

export default function WebhooksPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <WebhooksHeader />
      <WebhooksStats />
      <WebhooksList />
    </div>
  )
}
