export type ItemType = 'worker' | 'workflow' | 'process'
export type PricingType = 'free' | 'paid' | 'subscription'

export interface MarketplaceItem {
  id: string
  name: string
  description: string
  shortDescription: string
  version: string
  type: ItemType
  author: {
    id: string
    name: string
    avatar: string
  }
  pricing: {
    type: PricingType
    price?: number
    subscriptionPlans?: string[]
  }
  tags: string[]
  requirements: string[]
  screenshots: string[]
  videoUrl?: string
  downloads: number
  rating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
  featured?: boolean
  curated?: boolean
  curatedCollection?: string
}

export interface MarketplaceReview {
  id: string
  itemId: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  createdAt: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  interval: 'monthly' | 'yearly'
  features: string[]
  itemCount: number
}

export interface UserSubscription {
  id: string
  userId: string
  planId: string
  planName: string
  status: 'active' | 'canceled' | 'expired'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
}

export interface AuthorStats {
  totalItems: number
  totalDownloads: number
  totalRevenue: number
  itemStats: {
    itemId: string
    itemName: string
    downloads: number
    revenue: number
  }[]
}

export interface CuratedCollection {
  id: string
  name: string
  description: string
  coverImage: string
  itemIds: string[]
}
