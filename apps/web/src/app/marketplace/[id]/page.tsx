import { ItemDetails } from '@/components/marketplace/item-details'
import { ItemScreenshots } from '@/components/marketplace/item-screenshots'
import { ItemRequirements } from '@/components/marketplace/item-requirements'
import { ItemInstallation } from '@/components/marketplace/item-installation'
import { ItemReviews } from '@/components/marketplace/item-reviews'
import { ItemAuthor } from '@/components/marketplace/item-author'
import { ItemRelated } from '@/components/marketplace/item-related'

export default function MarketplaceItemPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <ItemDetails id={params.id} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ItemScreenshots id={params.id} />
          <ItemRequirements id={params.id} />
          <ItemReviews id={params.id} />
        </div>
        <div className="space-y-6">
          <ItemInstallation id={params.id} />
          <ItemAuthor id={params.id} />
          <ItemRelated id={params.id} />
        </div>
      </div>
    </div>
  )
}
