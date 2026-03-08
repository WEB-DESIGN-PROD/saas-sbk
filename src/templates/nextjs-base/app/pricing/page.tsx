import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { prisma } from "@/lib/db/client"

function formatPrice(price: number, period: string | null) {
  if (price === -1) return { amount: "Sur mesure", period: null }
  if (price === 0) return { amount: "Gratuit", period: null }
  const amount = (price / 100).toFixed(2).replace(".00", "") + "€"
  return { amount, period: period === "month" ? "/mois" : period === "year" ? "/an" : null }
}

export default async function PricingPage() {
  const plans = await prisma.plan.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  })

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

          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan) => {
              const { amount, period } = formatPrice(plan.price, plan.period)
              return (
                <Card
                  key={plan.id}
                  className={plan.popular ? "border-primary shadow-lg" : ""}
                >
                  {plan.popular && (
                    <div className="bg-primary px-3 py-1 text-center text-sm text-primary-foreground rounded-t-xl">
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
                  <CardContent>
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

          <div className="mt-16 text-center">
            <p className="text-muted-foreground">
              Tous les plans incluent 14 jours d&apos;essai gratuit.{" "}
              <Link href="/contact" className="underline underline-offset-4">
                Des questions ?
              </Link>
            </p>
          </div>
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
