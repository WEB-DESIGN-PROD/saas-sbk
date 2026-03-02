// Types globaux pour l'application

export interface User {
  id: string
  email: string
  name?: string
  image?: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  user: User
  token: string
  expiresAt: Date
}

// ─── Plan & Abonnement ───────────────────────────────────────────────────────

export type AccountType = 'Free' | 'Freemium' | 'Paid'

export type SubscriptionPlan = 'Pro' | 'Team' | 'Enterprise' | null

export interface UserPlan {
  accountType: AccountType
  subscriptionPlan: SubscriptionPlan
  extraCredits: number
}
