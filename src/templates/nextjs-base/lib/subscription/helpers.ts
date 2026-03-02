import type { AccountType, SubscriptionPlan } from '@/types'

// ─── Prédicats ────────────────────────────────────────────────────────────────

export function isFree(accountType: AccountType): boolean {
  return accountType === 'Free'
}

export function isFreemium(accountType: AccountType): boolean {
  return accountType === 'Freemium'
}

export function isPaid(accountType: AccountType): boolean {
  return accountType === 'Paid'
}

export function hasCredits(extraCredits: number): boolean {
  return extraCredits > 0
}

// ─── Labels ───────────────────────────────────────────────────────────────────

export function getAccountTypeLabel(accountType: AccountType): string {
  const labels: Record<AccountType, string> = {
    Free: 'Gratuit',
    Freemium: 'Freemium',
    Paid: 'Payant',
  }
  return labels[accountType]
}

export function getPlanLabel(subscriptionPlan: SubscriptionPlan): string {
  return subscriptionPlan ?? ''
}

export function getFullPlanLabel(accountType: AccountType, subscriptionPlan: SubscriptionPlan): string {
  if (accountType === 'Paid' && subscriptionPlan) {
    return subscriptionPlan
  }
  return getAccountTypeLabel(accountType)
}

// ─── Classes CSS (badges) ─────────────────────────────────────────────────────

export function getAccountTypeBadgeClass(accountType: AccountType): string {
  const classes: Record<AccountType, string> = {
    Free:     'bg-secondary text-secondary-foreground',
    Freemium: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    Paid:     'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  }
  return classes[accountType]
}

export function getPlanBadgeClass(subscriptionPlan: SubscriptionPlan): string {
  const classes: Record<string, string> = {
    Pro:        'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
    Team:       'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
    Enterprise: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  }
  return subscriptionPlan ? (classes[subscriptionPlan] ?? '') : ''
}

// ─── Accès aux fonctionnalités ─────────────────────────────────────────────────

/**
 * Vérifie si l'utilisateur peut accéder à une fonctionnalité premium.
 * Les utilisateurs Freemium avec crédits et les utilisateurs Paid y ont accès.
 */
export function canAccessPremium(accountType: AccountType, extraCredits: number): boolean {
  return isPaid(accountType) || (isFreemium(accountType) && hasCredits(extraCredits))
}

/**
 * Vérifie si l'utilisateur a un abonnement actif (Paid).
 */
export function hasActiveSubscription(accountType: AccountType): boolean {
  return isPaid(accountType)
}
