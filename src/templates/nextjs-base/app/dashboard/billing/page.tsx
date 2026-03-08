import { verifySession, getUserPlan } from '@/lib/dal'
import { prisma } from '@/lib/db/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  getAccountTypeBadgeClass,
  getPlanBadgeClass,
  getFullPlanLabel,
  isFree,
  isFreemium,
  isPaid,
} from '@/lib/subscription/helpers'
import { BuyCreditsDialog } from '@/components/billing/buy-credits-dialog'
import { CreditCard, Zap, Coins } from 'lucide-react'

function formatPlanPrice(price: number, period: string | null) {
  if (price === -1) return 'Sur devis'
  if (price === 0) return 'Gratuit'
  const euros = (price / 100).toFixed(2).replace('.00', '') + '€'
  if (!period) return euros
  return `${euros} / ${period === 'month' ? 'mois' : 'an'}`
}

export default async function BillingPage() {
  const { userId } = await verifySession()

  const [plan, availablePlans, creditPacks] = await Promise.all([
    getUserPlan(userId),
    prisma.plan.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.creditPack.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
  ])

  const accountBadgeClass = getAccountTypeBadgeClass(plan.accountType)
  const planBadgeClass = plan.subscriptionPlan ? getPlanBadgeClass(plan.subscriptionPlan) : ''

  // Exclure le plan gratuit (price === 0) de la section "Passer à un plan supérieur"
  const upgradePlans = availablePlans.filter(p => p.price !== 0)

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-6 px-4 py-4 md:gap-8 md:py-6 lg:px-6">

        <div>
          <h1 className="text-2xl font-semibold">Facturation & Abonnement</h1>
          <p className="text-muted-foreground text-sm">Gérez votre plan et vos crédits</p>
        </div>

        {/* ── Plan actuel ── */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Plan actuel</CardTitle>
              </div>
              <CardDescription>Votre abonnement en cours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={accountBadgeClass}>{plan.accountType}</Badge>
                {plan.subscriptionPlan && (
                  <Badge className={planBadgeClass}>{plan.subscriptionPlan}</Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {isFree(plan.accountType) && (
                  <p>Vous utilisez le plan gratuit. Passez à un plan supérieur pour débloquer toutes les fonctionnalités.</p>
                )}
                {isFreemium(plan.accountType) && (
                  <p>Vous avez des crédits supplémentaires actifs. Abonnez-vous pour un accès illimité.</p>
                )}
                {isPaid(plan.accountType) && (
                  <p>Vous bénéficiez d&apos;un accès complet à toutes les fonctionnalités de votre plan <strong>{plan.subscriptionPlan}</strong>.</p>
                )}
              </div>
              {isPaid(plan.accountType) && (
                <Button variant="outline" size="sm">Gérer l&apos;abonnement</Button>
              )}
            </CardContent>
          </Card>

          {/* ── Crédits supplémentaires ── */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Crédits supplémentaires</CardTitle>
              </div>
              <CardDescription>Crédits achetés hors abonnement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{plan.extraCredits}</span>
                <span className="text-muted-foreground text-sm">crédit{plan.extraCredits !== 1 ? 's' : ''} disponible{plan.extraCredits !== 1 ? 's' : ''}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Les crédits s&apos;ajoutent à votre quota mensuel et n&apos;expirent pas.
              </p>
              <BuyCreditsDialog packs={creditPacks} />
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* ── Plans disponibles ── */}
        {upgradePlans.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Passer à un plan supérieur</h2>
            <p className="text-sm text-muted-foreground mb-4">Choisissez le plan adapté à vos besoins</p>

            <div className="grid gap-4 md:grid-cols-3">
              {upgradePlans.map((p) => {
                const isCurrentPlan = isPaid(plan.accountType) && plan.subscriptionPlan === p.name

                return (
                  <Card key={p.id} className={`${isCurrentPlan ? 'border-primary ring-1 ring-primary' : ''} ${p.popular ? 'border-primary shadow-md' : ''}`}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-base">{p.name}</CardTitle>
                        {p.popular && !isCurrentPlan && (
                          <Badge className="ml-auto text-xs">Populaire</Badge>
                        )}
                        {isCurrentPlan && (
                          <Badge variant="outline" className="ml-auto text-xs">Plan actuel</Badge>
                        )}
                      </div>
                      <div className="text-2xl font-bold">{formatPlanPrice(p.price, p.period)}</div>
                      <CardDescription>{p.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-1.5">
                        {p.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full"
                        variant={isCurrentPlan ? 'outline' : 'default'}
                        disabled={isCurrentPlan}
                        asChild={!isCurrentPlan}
                      >
                        {isCurrentPlan ? (
                          <span>Plan actuel</span>
                        ) : (
                          <a href={p.href}>{p.cta}</a>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
