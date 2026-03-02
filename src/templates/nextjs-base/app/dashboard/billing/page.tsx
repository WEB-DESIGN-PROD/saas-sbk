import { verifySession, getUserPlan } from '@/lib/dal'
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
import { CreditCard, Zap, Users, Building2, Coins } from 'lucide-react'

const PLANS = [
  {
    key: 'Pro',
    icon: Zap,
    label: 'Pro',
    price: '29€ / mois',
    description: 'Pour les indépendants et les petites équipes.',
    features: ['Accès complet à toutes les fonctionnalités', 'Support prioritaire', 'Jusqu\'à 5 utilisateurs', 'Crédits mensuels inclus'],
  },
  {
    key: 'Team',
    icon: Users,
    label: 'Team',
    price: '79€ / mois',
    description: 'Collaborez efficacement en équipe.',
    features: ['Tout le plan Pro', 'Jusqu\'à 20 utilisateurs', 'Gestion des rôles', 'Tableau de bord équipe', 'Crédits partagés'],
  },
  {
    key: 'Enterprise',
    icon: Building2,
    label: 'Enterprise',
    price: 'Sur devis',
    description: 'Pour les grandes organisations.',
    features: ['Tout le plan Team', 'Utilisateurs illimités', 'SLA garanti', 'Support dédié', 'Déploiement sur site possible'],
  },
]

export default async function BillingPage() {
  const { userId } = await verifySession()
  const plan = await getUserPlan(userId)

  const planLabel = getFullPlanLabel(plan.accountType, plan.subscriptionPlan)
  const accountBadgeClass = getAccountTypeBadgeClass(plan.accountType)
  const planBadgeClass = plan.subscriptionPlan ? getPlanBadgeClass(plan.subscriptionPlan) : ''

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
                  <p>Vous bénéficiez d'un accès complet à toutes les fonctionnalités de votre plan <strong>{plan.subscriptionPlan}</strong>.</p>
                )}
              </div>
              {isPaid(plan.accountType) && (
                <Button variant="outline" size="sm">Gérer l'abonnement</Button>
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
                Les crédits s'ajoutent à votre quota mensuel et n'expirent pas.
              </p>
              <Button size="sm">Acheter des crédits</Button>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* ── Plans disponibles ── */}
        <div>
          <h2 className="text-lg font-semibold mb-1">Passer à un plan supérieur</h2>
          <p className="text-sm text-muted-foreground mb-4">Choisissez le plan adapté à vos besoins</p>

          <div className="grid gap-4 md:grid-cols-3">
            {PLANS.map((p) => {
              const Icon = p.icon
              const isCurrentPlan = isPaid(plan.accountType) && plan.subscriptionPlan === p.key

              return (
                <Card key={p.key} className={isCurrentPlan ? 'border-primary ring-1 ring-primary' : ''}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-base">{p.label}</CardTitle>
                      {isCurrentPlan && (
                        <Badge variant="outline" className="ml-auto text-xs">Plan actuel</Badge>
                      )}
                    </div>
                    <div className="text-2xl font-bold">{p.price}</div>
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
                    >
                      {isCurrentPlan ? 'Plan actuel' : `Passer au plan ${p.label}`}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
