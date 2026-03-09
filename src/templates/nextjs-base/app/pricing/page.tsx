import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ScrollAnimations } from "@/components/scroll-animations"
import { CopyCommand } from "@/components/copy-command"
import { prisma } from "@/lib/db/client"
import { Coins, Check, Sparkles, ArrowRight, Zap } from "lucide-react"

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
    <div className="relative flex min-h-screen flex-col overflow-x-clip">

      {/* Gradient orbs */}
      <div className="pointer-events-none absolute inset-0 h-screen overflow-hidden" aria-hidden>
        <div className="absolute top-1/3 left-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[160px] animate-pulse" />
        <div className="absolute top-1/2 right-1/4 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[130px] animate-pulse [animation-delay:2s]" />
        <div className="absolute bottom-20 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-cyan-500/08 blur-[120px] animate-pulse [animation-delay:4s]" />
      </div>

      <Navbar />
      <ScrollAnimations />

      <main className="flex-1">

        {/* Hero */}
        <section className="py-28 text-center relative z-10">
          <div className="container mx-auto px-4">

            <div className="badge-beam mb-8" data-gsap="badge">
              <div className="badge-beam-ring" />
              <div className="badge-beam-inner gap-2 px-4 py-1.5 text-sm">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Tarifs
                </span>
              </div>
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight lg:text-6xl" data-gsap="title">
              <span className="block bg-gradient-to-b from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent pb-1">
                Tarifs simples et transparents
              </span>
            </h1>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground leading-relaxed" data-gsap="subtitle">
              Choisissez le plan qui correspond à vos besoins
            </p>

          </div>
        </section>

        {/* Plans */}
        <section className="pb-20">
          <div className="container mx-auto px-4">

            <div className="grid gap-6 md:grid-cols-3 items-stretch" data-gsap="stagger">
              {plans.map((plan) => {
                const { amount, period } = formatPlanPrice(plan.price, plan.period)
                return (
                  <div
                    key={plan.id}
                    data-gsap="card"
                    className={`relative rounded-2xl border p-8 flex flex-col backdrop-blur-sm transition-all duration-300 ${
                      plan.popular
                        ? "border-emerald-400/30 bg-emerald-400/[0.04] shadow-[0_0_40px_rgba(52,211,153,0.08)]"
                        : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14]"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className="badge-beam">
                          <div className="badge-beam-ring" />
                          <div className="badge-beam-inner gap-1.5 px-3 py-1 text-xs">
                            <Zap className="h-3 w-3 text-emerald-400 shrink-0" />
                            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Plus populaire</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>

                    <div className="mb-8">
                      <span className="text-4xl font-bold">{amount}</span>
                      {period && <span className="text-muted-foreground ml-1 text-lg">{period}</span>}
                    </div>

                    <ul className="space-y-3 flex-1 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="mt-0.5 h-4 w-4 text-emerald-400 shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full transition-all duration-300 ${plan.popular ? "shadow-[0_0_25px_rgba(52,211,153,0.2)] hover:shadow-[0_0_35px_rgba(52,211,153,0.35)]" : "border-white/[0.12] hover:border-white/[0.22]"}`}
                      variant={plan.popular ? "default" : "outline"}
                      asChild
                    >
                      <Link href={plan.href}>{plan.cta}</Link>
                    </Button>
                  </div>
                )
              })}
            </div>

            <div className="mt-10 text-center">
              <p className="text-muted-foreground text-sm">
                Tous les plans incluent 14 jours d&apos;essai gratuit.{" "}
                <Link href="/contact" className="text-foreground underline underline-offset-4 hover:text-primary transition-colors">
                  Des questions ?
                </Link>
              </p>
            </div>

          </div>
        </section>

        {/* Credit packs */}
        {creditPacks.length > 0 && (
          <section className="py-24">
            <div className="container mx-auto px-4">

              <div className="mb-12 text-center">
                <div className="badge-beam mb-4" data-gsap="badge">
                  <div className="badge-beam-ring" />
                  <div className="badge-beam-inner gap-1.5">
                    <Coins className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Crédits</span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold tracking-tight" data-gsap="title">
                  <span className="bg-gradient-to-b from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent">
                    Packs de crédits
                  </span>
                </h2>
                <p className="mt-3 text-muted-foreground" data-gsap="subtitle">Achetez des crédits à la carte — ils n&apos;expirent jamais</p>
              </div>

              <div className="flex flex-wrap justify-center gap-6" data-gsap="stagger">
                {creditPacks.map((pack) => {
                  const pricePerCredit = pack.price / pack.credits
                  const discount = basePricePerCredit && basePricePerCredit !== pricePerCredit
                    ? Math.round((1 - pricePerCredit / basePricePerCredit) * 100)
                    : null

                  return (
                    <div
                      key={pack.id}
                      data-gsap="card"
                      className={`relative rounded-2xl border p-6 flex flex-col gap-4 w-full sm:w-64 backdrop-blur-sm transition-all duration-300 ${
                        pack.popular
                          ? "border-emerald-400/30 bg-emerald-400/[0.04] shadow-[0_0_30px_rgba(52,211,153,0.07)]"
                          : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14]"
                      }`}
                    >
                      {pack.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 border border-emerald-400/30 px-3 py-1 text-xs text-emerald-400 backdrop-blur-sm whitespace-nowrap">
                            Populaire
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          {pack.name}
                        </span>
                        {discount !== null && discount > 0 && (
                          <span className="rounded-full bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 text-xs text-emerald-400">
                            -{discount}%
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-1.5">
                        <Coins className="h-5 w-5 text-emerald-400 shrink-0" />
                        <span className="text-3xl font-bold">{pack.credits.toLocaleString()}</span>
                        <span className="text-muted-foreground text-sm">crédits</span>
                      </div>

                      <p className="text-sm text-muted-foreground">{pack.description}</p>

                      <div className="mt-auto space-y-3">
                        <div>
                          <span className="text-2xl font-bold">{formatPackPrice(pack.price)}</span>
                        </div>
                        <Button
                          className={`w-full transition-all duration-300 ${pack.popular ? "shadow-[0_0_20px_rgba(52,211,153,0.15)] hover:shadow-[0_0_30px_rgba(52,211,153,0.3)]" : "border-white/[0.12] hover:border-white/[0.22]"}`}
                          variant={pack.popular ? "default" : "outline"}
                          asChild
                        >
                          <Link href="/register">Acheter</Link>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>
          </section>
        )}

        {/* CTA */}
        <section className="pb-24 px-4">
          <div className="container mx-auto">
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] p-16 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-background to-violet-500/[0.06] backdrop-blur-sm" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/60" />
              <div className="pointer-events-none absolute top-0 left-1/4 h-64 w-64 rounded-full bg-primary/15 blur-[100px]" aria-hidden />
              <div className="pointer-events-none absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-violet-500/10 blur-[80px]" aria-hidden />

              <div className="relative z-10">
                <div className="badge-beam mb-4" data-gsap="badge">
                  <div className="badge-beam-ring" />
                  <div className="badge-beam-inner">
                    <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Démarrez maintenant</span>
                  </div>
                </div>
                <h2 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl" data-gsap="title">
                  <span className="bg-gradient-to-b from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent">
                    Prêt à lancer votre SaaS ?
                  </span>
                </h2>
                <p className="mb-10 text-muted-foreground text-lg max-w-sm mx-auto" data-gsap="subtitle">
                  Une commande. Tout est configuré. Vos fonctionnalités sont prêtes à être implémentées.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link href="{{AUTH_ENTRY_URL}}">
                    <Button size="lg" className="gap-2 h-12 px-6 shadow-lg hover:shadow-[0_0_30px_hsl(var(--primary)/30%)] transition-all duration-300">
                      Commencer gratuitement <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <CopyCommand />
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
