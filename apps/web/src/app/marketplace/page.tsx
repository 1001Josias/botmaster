import { MarketplaceHeader } from '@/components/marketplace/marketplace-header'
import { MarketplaceFilters } from '@/components/marketplace/marketplace-filters'
import { MarketplaceFeatured } from '@/components/marketplace/marketplace-featured'
import { MarketplaceGrid } from '@/components/marketplace/marketplace-grid'
import { MarketplaceCollections } from '@/components/marketplace/marketplace-collections'

export default function MarketplacePage() {
  return (
    <div className="space-y-6">
      <MarketplaceHeader />
      <MarketplaceFilters />
      <MarketplaceFeatured />
      <MarketplaceCollections />
      <MarketplaceGrid />
    </div>
  )
}
