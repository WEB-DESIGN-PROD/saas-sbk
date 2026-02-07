import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            {{PROJECT_NAME}}
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
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">
              À propos de {{PROJECT_NAME}}
            </h1>
            <p className="text-xl text-muted-foreground">
              Notre mission et notre vision
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Notre mission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  {{PROJECT_NAME}} a été créé avec la mission de simplifier et d'accélérer
                  le développement de projets SaaS modernes. Nous croyons que chaque
                  développeur devrait avoir accès à une infrastructure de qualité
                  professionnelle sans avoir à réinventer la roue.
                </p>
                <p>
                  Notre plateforme combine les meilleures technologies du marché dans
                  un ensemble cohérent et prêt à l'emploi, vous permettant de vous
                  concentrer sur ce qui compte vraiment : créer de la valeur pour vos
                  utilisateurs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nos valeurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 font-semibold">Simplicité</h3>
                    <p className="text-sm text-muted-foreground">
                      Des outils intuitifs et une documentation claire pour
                      démarrer rapidement.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold">Qualité</h3>
                    <p className="text-sm text-muted-foreground">
                      Code propre, bonnes pratiques et sécurité au cœur de
                      notre approche.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold">Innovation</h3>
                    <p className="text-sm text-muted-foreground">
                      Utilisation des technologies les plus modernes et
                      performantes.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold">Communauté</h3>
                    <p className="text-sm text-muted-foreground">
                      Collaboration et partage de connaissances avec nos
                      utilisateurs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technologies</CardTitle>
                <CardDescription>
                  Une stack moderne et éprouvée
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2 md:grid-cols-2">
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-sm">Next.js 15+</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-sm">React 19</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-sm">TypeScript</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-sm">Prisma + PostgreSQL</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-sm">Better Auth</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-sm">Tailwind CSS</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <h2 className="mb-4 text-2xl font-bold">Prêt à démarrer ?</h2>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Créer un compte</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">Voir les tarifs</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 {{PROJECT_NAME}}. Tous droits réservés.
        </div>
      </footer>
    </div>
  )
}
