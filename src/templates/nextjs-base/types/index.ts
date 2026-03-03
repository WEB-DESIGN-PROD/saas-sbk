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

// ─── Rôles ───────────────────────────────────────────────────────────────────

export type Role = 'member' | 'admin' | 'co-admin' | 'editor' | 'contributor'

export type StaffRole = 'admin' | 'co-admin' | 'editor' | 'contributor'

export const STAFF_ROLES: Role[] = ['admin', 'co-admin', 'editor', 'contributor']

export const ROLE_LABELS: Record<Role, string> = {
  'admin':       'Super Admin',
  'co-admin':    'Co-Admin',
  'editor':      'Éditeur',
  'contributor': 'Contributeur',
  'member':      'Membre',
}

export const INVITATION_ROLES: Array<{ value: string; label: string }> = [
  { value: 'co-admin',    label: 'Co-Admin' },
  { value: 'editor',      label: 'Éditeur' },
  { value: 'contributor', label: 'Contributeur' },
]
