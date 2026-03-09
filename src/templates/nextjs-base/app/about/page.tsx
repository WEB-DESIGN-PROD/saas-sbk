import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ScrollAnimations } from "@/components/scroll-animations"
import { CopyCommand } from "@/components/copy-command"
import { ArrowRight, Sparkles, Check, Zap, Shield, Users } from "lucide-react"

const VALUES = [
  {
    icon: Zap,
    label: "Simplicité",
    desc: "Des outils intuitifs et une documentation claire pour démarrer rapidement.",
    bg: "bg-primary/[0.08] group-hover:bg-primary/15",
    ring: "ring-primary/[0.15] group-hover:ring-primary/30",
    icon_color: "text-primary",
    glow: "bg-primary/10",
  },
  {
    icon: Shield,
    label: "Qualité",
    desc: "Code propre, bonnes pratiques et sécurité au cœur de notre approche.",
    bg: "bg-emerald-400/[0.08] group-hover:bg-emerald-400/15",
    ring: "ring-emerald-400/[0.15] group-hover:ring-emerald-400/30",
    icon_color: "text-emerald-400",
    glow: "bg-emerald-400/10",
  },
  {
    icon: Sparkles,
    label: "Innovation",
    desc: "Utilisation des technologies les plus modernes et performantes.",
    bg: "bg-cyan-400/[0.08] group-hover:bg-cyan-400/15",
    ring: "ring-cyan-400/[0.15] group-hover:ring-cyan-400/30",
    icon_color: "text-cyan-400",
    glow: "bg-cyan-400/10",
  },
  {
    icon: Users,
    label: "Communauté",
    desc: "Collaboration et partage de connaissances avec nos utilisateurs.",
    bg: "bg-violet-400/[0.08] group-hover:bg-violet-400/15",
    ring: "ring-violet-400/[0.15] group-hover:ring-violet-400/30",
    icon_color: "text-violet-400",
    glow: "bg-violet-400/10",
  },
]

const TECH_STACK = [
  "Next.js 16+", "React 19", "TypeScript", "Prisma + PostgreSQL",
  "Better Auth", "Tailwind CSS v4", "Shadcn UI", "Stripe",
  "Resend", "MinIO S3", "Docker", "Claude Code",
]

export default function AboutPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">

      {/* Gradient orbs */}
      <div className="pointer-events-none absolute inset-0 h-screen overflow-hidden" aria-hidden>
        <div className="absolute top-1/3 left-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[160px] animate-pulse" />
        <div className="absolute top-1/2 right-1/4 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[130px] animate-pulse [animation-delay:2s]" />
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
                  Notre histoire
                </span>
              </div>
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight lg:text-6xl" data-gsap="title">
              <span className="block bg-gradient-to-b from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent pb-1">
                À propos de {{PROJECT_NAME}}
              </span>
            </h1>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground leading-relaxed" data-gsap="subtitle">
              Notre mission et notre vision pour simplifier le développement SaaS moderne.
            </p>

          </div>
        </section>

        {/* Mission */}
        <section className="pb-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">

              <div className="mb-10 text-center">
                <div className="badge-beam mb-4" data-gsap="badge">
                  <div className="badge-beam-ring" />
                  <div className="badge-beam-inner">
                    <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Mission</span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold tracking-tight" data-gsap="title">
                  <span className="bg-gradient-to-b from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent">
                    Notre mission
                  </span>
                </h2>
              </div>

              <div
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-sm space-y-4 text-muted-foreground leading-relaxed"
                data-gsap="subtitle"
              >
                <p>
                  {{PROJECT_NAME}} a été créé avec la mission de simplifier et d&apos;accélérer
                  le développement de projets SaaS modernes. Nous croyons que chaque
                  développeur devrait avoir accès à une infrastructure de qualité
                  professionnelle sans avoir à réinventer la roue.
                </p>
                <p>
                  Notre plateforme combine les meilleures technologies du marché dans
                  un ensemble cohérent et prêt à l&apos;emploi, vous permettant de vous
                  concentrer sur ce qui compte vraiment : créer de la valeur pour vos utilisateurs.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24">
          <div className="container mx-auto px-4">

            <div className="mb-12 text-center">
              <div className="badge-beam mb-4" data-gsap="badge">
                <div className="badge-beam-ring" />
                <div className="badge-beam-inner">
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Valeurs</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold tracking-tight" data-gsap="title">
                <span className="bg-gradient-to-b from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent">
                  Nos valeurs
                </span>
              </h2>
            </div>

            <div className="mx-auto max-w-3xl grid gap-4 md:grid-cols-2" data-gsap="stagger">
              {VALUES.map(({ icon: Icon, label, desc, bg, ring, icon_color, glow }) => (
                <div
                  key={label}
                  data-gsap="card"
                  className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm hover:border-white/[0.14] transition-all duration-300"
                >
                  <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${bg} ring-1 ${ring} transition-all duration-300 relative`}>
                    <div className={`absolute inset-0 rounded-xl ${glow} blur-sm opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <Icon className={`h-5 w-5 ${icon_color} relative`} />
                  </div>
                  <h3 className="mb-2 font-semibold">{label}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Tech stack */}
        <section className="py-24">
          <div className="container mx-auto px-4">

            <div className="mb-12 text-center">
              <div className="badge-beam mb-4" data-gsap="badge">
                <div className="badge-beam-ring" />
                <div className="badge-beam-inner">
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Stack</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold tracking-tight" data-gsap="title">
                <span className="bg-gradient-to-b from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent">
                  Technologies
                </span>
              </h2>
              <p className="mt-3 text-muted-foreground" data-gsap="subtitle">Une stack moderne et éprouvée</p>
            </div>

            <div className="mx-auto max-w-2xl grid gap-3 sm:grid-cols-2" data-gsap="stagger">
              {TECH_STACK.map((tech) => (
                <div
                  key={tech}
                  data-gsap="card"
                  className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 backdrop-blur-sm hover:border-emerald-400/20 hover:bg-emerald-400/[0.02] transition-all duration-200"
                >
                  <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span className="text-sm">{tech}</span>
                </div>
              ))}
            </div>

          </div>
        </section>

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
