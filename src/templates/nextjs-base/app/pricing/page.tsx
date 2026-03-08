import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { prisma } from "@/lib/db/client"
import { Coins } from "lucide-react"

function formatPlanPrice(price: number, period: string | null) {
  if (price === -1) return { amount: "Sur mesure", period: null }
  if (price === 0) return { amount: "Gratuit", period: null }
  const amount = (price / 100).toFixed(2).replace(".00", "") + "€"
  return { amount, period: period === "month" ? "/mois" : period === "year" ? "/an" : null }
}

function formatPackPrice(price: number) {
  return (price / 100).toFixed(2).replace(".00", "") + "€"
}

export default async function PricingPage() {
  const [plans, creditPacks] = await Promise.all([
    prisma.plan.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.creditPack.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
  ])

  const basePricePerCredit = creditPacks.length > 0 ? creditPacks[0].price / creditPacks[0].credits : null

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">
              Tarifs simples et transparents
            </h1>
            <p className="text-xl text-muted-foreground">
              Choisissez le plan qui correspond à vos besoins
            </p>
          </div>

          {/* Plans d'abonnement */}
          <div className="grid gap-8 md:grid-cols-3 items-stretch">
            {plans.map((plan) => {
              const { amount, period } = formatPlanPrice(plan.price, plan.period)
              return (
                <Card
                  key={plan.id}
                  className={`flex flex-col overflow-hidden ${plan.popular ? "border-primary shadow-lg" : ""}`}
                >
                  {plan.popular && (
                    <div className="bg-primary px-3 py-1.5 text-center text-sm font-medium text-primary-foreground">
                      Plus populaire
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{amount}</span>
                      {period && <span className="text-muted-foreground">{period}</span>}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <svg className="mt-0.5 h-5 w-5 text-primary shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                      <Link href={plan.href}>{plan.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          <div className="mt-10 text-center">
            <p className="text-muted-foreground">
              Tous les plans incluent 14 jours d&apos;essai gratuit.{" "}
              <Link href="/contact" className="underline underline-offset-4">
                Des questions ?
              </Link>
            </p>
          </div>

          {/* Packs de crédits */}
          {creditPacks.length > 0 && (
            <div className="mt-24">
              <div className="mb-12 text-center">
                <h2 className="mb-3 text-3xl font-bold tracking-tight">Packs de crédits</h2>
                <p className="text-lg text-muted-foreground">
                  Achetez des crédits à la carte — ils n&apos;expirent jamais
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-6">
                {creditPacks.map((pack) => {
                  const pricePerCredit = pack.price / pack.credits
                  const discount = basePricePerCredit && basePricePerCredit !== pricePerCredit
                    ? Math.round((1 - pricePerCredit / basePricePerCredit) * 100)
                    : null

                  return (
                    <div
                      key={pack.id}
                      className={`relative rounded-xl border bg-card p-6 flex flex-col gap-4 w-full sm:w-64 ${pack.popular ? "border-primary shadow-lg" : ""}`}
                    >
                      {pack.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground px-3 py-1">
                            Populaire
                          </Badge>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          {pack.name}
                        </span>
                        {discount !== null && discount > 0 && (
                          <Badge variant="secondary" className="text-xs text-green-600 dark:text-green-400">
                            -{discount}%
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-baseline gap-1.5">
                        <Coins className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-3xl font-bold">{pack.credits.toLocaleString()}</span>
                        <span className="text-muted-foreground text-sm">crédits</span>
                      </div>

                      <p className="text-sm text-muted-foreground">{pack.description}</p>

                      <div className="mt-auto space-y-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-bold">{formatPackPrice(pack.price)}</span>
                          <span className="text-xs text-muted-foreground">
                            {((pricePerCredit / 100) * 100).toFixed(1)}c / crédit
                          </span>
                        </div>
                        <Button className="w-full" variant={pack.popular ? "default" : "outline"} asChild>
                          <Link href="/register">Acheter</Link>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 {{PROJECT_NAME}}. Tous droits réservés.
        </div>
      </footer>
    </div>
  )
}
