import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function PricingPage() {
  const plans = [
    {
      name: "Gratuit",
      price: "0€",
      description: "Pour commencer",
      features: [
        "1 projet",
        "Fonctionnalités de base",
        "Support communautaire",
        "Mises à jour régulières"
      ],
      cta: "Commencer gratuitement",
      href: "/register"
    },
    {
      name: "Pro",
      price: "29€",
      period: "/mois",
      description: "Pour les professionnels",
      features: [
        "Projets illimités",
        "Toutes les fonctionnalités",
        "Support prioritaire",
        "Analyses avancées",
        "API access"
      ],
      cta: "Commencer l'essai",
      href: "/register",
      popular: true
    },
    {
      name: "Entreprise",
      price: "Sur mesure",
      description: "Pour les grandes équipes",
      features: [
        "Tout du plan Pro",
        "Support dédié",
        "SLA garanti",
        "Formation sur site",
        "Facturation personnalisée"
      ],
      cta: "Nous contacter",
      href: "/contact"
    }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            my-saas
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm font-medium hover:underline">
              Tarifs
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline">
              À propos
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Connexion
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Créer un compte
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
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
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={plan.popular ? "border-primary shadow-lg" : ""}
              >
                {plan.popular && (
                  <div className="bg-primary px-3 py-1 text-center text-sm text-primary-foreground">
                    Plus populaire
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <svg
                          className="mt-0.5 h-5 w-5 text-primary"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-muted-foreground">
              Tous les plans incluent 14 jours d'essai gratuit.{" "}
              <Link href="/contact" className="underline underline-offset-4">
                Des questions ?
              </Link>
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 my-saas. Tous droits réservés.
        </div>
      </footer>
    </div>
  )
}
