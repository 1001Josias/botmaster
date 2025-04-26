import { SubscriptionsHeader } from '@/components/marketplace/subscriptions-header'
import { SubscriptionPlans } from '@/components/marketplace/subscription-plans'
import { UserSubscriptions } from '@/components/marketplace/user-subscriptions'
import { SubscriptionBenefits } from '@/components/marketplace/subscription-benefits'

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <SubscriptionsHeader />
      <SubscriptionBenefits />
      <SubscriptionPlans />
      <UserSubscriptions />
    </div>
  )
}
