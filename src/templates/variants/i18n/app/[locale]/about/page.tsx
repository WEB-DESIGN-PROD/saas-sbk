import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ScrollAnimations } from "@/components/scroll-animations"
import { CopyCommand } from "@/components/copy-command"
import { getTranslations } from "next-intl/server"
import { ArrowRight, Sparkles, Check, Zap, Shield, Users, Target } from "lucide-react"

const TECH_STACK = [
  "Next.js 16+", "React 19", "TypeScript", "Prisma + PostgreSQL",
  "Better Auth", "Tailwind CSS v4", "Shadcn UI", "Stripe",
  "Resend", "MinIO S3", "Docker", "Claude Code",
]

const APP_NAME = "{{PROJECT_NAME}}"

export default async function AboutPage() {
  const t = await getTranslations("about")

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
                  {t("hero_badge")}
                </span>
              </div>
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight lg:text-6xl" data-gsap="title">
              <span className="block bg-gradient-to-b from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent pb-1">
                {t("hero_title", { name: APP_NAME })}
              </span>
            </h1>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground leading-relaxed" data-gsap="subtitle">
              {t("hero_subtitle")}
            </p>

          </div>
        </section>

        {/* Mission & Valeurs — Bento */}
        <section className="py-24">
          <div className="container mx-auto px-4">

            <div className="mb-16 text-center">
              <div className="badge-beam mb-4" data-gsap="badge">
                <div className="badge-beam-ring" />
                <div className="badge-beam-inner">
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{t("bento_badge")}</span>
                </div>
              </div>
              <h2 className="text-4xl font-bold tracking-tight lg:text-5xl" data-gsap="title">
                <span className="bg-gradient-to-b from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent">
                  {t("bento_title")}
                </span>
              </h2>
              <p className="mt-4 text-muted-foreground text-lg" data-gsap="subtitle">{t("bento_subtitle")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]" data-gsap="stagger">

              {/* Mission — wide + tall */}
              <div
                data-gsap="card"
                className="group relative md:col-span-2 md:row-span-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-sm hover:border-white/[0.14] transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-primary/10 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/[0.08] ring-1 ring-primary/[0.15] relative mb-6">
                  <div className="absolute inset-0 rounded-xl bg-primary/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Target className="h-5 w-5 text-primary relative" />
                </div>
                <div className="flex-1 flex flex-col justify-center space-y-4 text-muted-foreground leading-relaxed">
                  <h3 className="text-xl font-bold text-foreground">{t("mission_title")}</h3>
                  <p className="text-sm">
                    {t("mission_text1", { name: APP_NAME })}
                  </p>
                  <p className="text-sm">
                    {t("mission_text2")}
                  </p>
                </div>
              </div>

              {/* Simplicité */}
              <div
                data-gsap="card"
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm hover:border-white/[0.14] transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.08] ring-1 ring-primary/[0.15] relative">
                  <div className="absolute inset-0 rounded-xl bg-primary/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Zap className="h-5 w-5 text-primary relative" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">{t("simplicity_title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("simplicity_desc")}</p>
                </div>
              </div>

              {/* Qualité */}
              <div
                data-gsap="card"
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm hover:border-white/[0.14] transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/[0.08] ring-1 ring-emerald-400/[0.15] relative">
                  <div className="absolute inset-0 rounded-xl bg-emerald-400/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Shield className="h-5 w-5 text-emerald-400 relative" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">{t("quality_title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("quality_desc")}</p>
                </div>
              </div>

              {/* Innovation */}
              <div
                data-gsap="card"
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm hover:border-white/[0.14] transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/[0.08] ring-1 ring-cyan-400/[0.15] relative">
                  <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Sparkles className="h-5 w-5 text-cyan-400 relative" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">{t("innovation_title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("innovation_desc")}</p>
                </div>
              </div>

              {/* Communauté — wide */}
              <div
                data-gsap="card"
                className="group md:col-span-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm hover:border-white/[0.14] transition-all duration-300 overflow-hidden flex items-center gap-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/[0.08] ring-1 ring-violet-400/[0.15] relative">
                  <div className="absolute inset-0 rounded-xl bg-violet-400/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Users className="h-5 w-5 text-violet-400 relative" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">{t("community_title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("community_desc")}</p>
                </div>
              </div>

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
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{t("stack_badge")}</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold tracking-tight" data-gsap="title">
                <span className="bg-gradient-to-b from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent">
                  {t("stack_title")}
                </span>
              </h2>
              <p className="mt-3 text-muted-foreground" data-gsap="subtitle">{t("stack_subtitle")}</p>
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
                    <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{t("cta_badge")}</span>
                  </div>
                </div>
                <h2 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl" data-gsap="title">
                  <span className="bg-gradient-to-b from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent">
                    {t("cta_title")}
                  </span>
                </h2>
                <p className="mb-10 text-muted-foreground text-lg max-w-sm mx-auto" data-gsap="subtitle">
                  {t("cta_desc")}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link href="/register">
                    <Button size="lg" className="gap-2 h-12 px-6 shadow-lg hover:shadow-[0_0_30px_hsl(var(--primary)/30%)] transition-all duration-300">
                      {t("cta_button")} <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button variant="outline" size="lg" className="h-12 px-6 border-white/[0.12] hover:border-white/[0.22] transition-all duration-300">
                      {t("cta_pricing")}
                    </Button>
                  </Link>
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
