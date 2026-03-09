import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CopyCommand } from "@/components/copy-command";
import { prisma } from "@/lib/db/client";
import {
  Shield, Database, Layers, CreditCard, Mail, HardDrive,
  ArrowRight, Sparkles, Check, type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Shield, Database, Layers, CreditCard, Mail, HardDrive,
};

const TECH_NAMES = [
  "Next.js", "React", "TypeScript", "Prisma", "Tailwind CSS",
  "Stripe", "Resend", "Better Auth", "Docker", "Shadcn UI", "MinIO", "PostgreSQL",
];

const TESTIMONIALS = [
  { name: "Sophie M.", role: "Fondatrice, StartupX", text: "Ce starter kit m'a fait gagner des semaines de développement. L'architecture est propre et extensible.", avatar: "SM" },
  { name: "Thomas L.", role: "CTO, DevAgency", text: "L'intégration Better Auth + Prisma est au top. Exactement ce dont j'avais besoin pour démarrer rapidement.", avatar: "TL" },
  { name: "Clara B.", role: "Développeuse indépendante", text: "La dashboard est magnifique out-of-the-box et les composants Shadcn UI sont parfaitement intégrés.", avatar: "CB" },
  { name: "Marc D.", role: "Lead Dev, FinTech Solutions", text: "Le système de facturation Stripe est déjà configuré. J'ai pu lancer mon SaaS en production en moins d'une semaine.", avatar: "MD" },
  { name: "Léa R.", role: "CEO, ContentFlow", text: "Le module blog avec RBAC est exactement ce qu'il me fallait. Les rôles éditeur et contributeur fonctionnent parfaitement.", avatar: "LR" },
  { name: "Antoine V.", role: "Développeur fullstack", text: "MinIO intégré dès le départ, emails transactionnels Resend prêts à l'emploi. Rien à configurer, tout fonctionne.", avatar: "AV" },
];

const STATS = [
  { value: "1", label: "commande pour démarrer" },
  { value: "<5min", label: "mise en route complète" },
  { value: "100%", label: "TypeScript strict" },
  { value: "∞", label: "extensible à l'infini" },
];

const STACK_ITEMS = ["N", "R", "TS", "P", "S", "🔐"];

export default async function Home() {
  const [features, faqs] = await Promise.all([
    prisma.feature.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.faq.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />

      {/* ─── HERO + MARQUEE = 100vh ─── */}
      <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden relative">

        {/* Gradient orbs — liquid glass background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute top-1/3 left-1/4 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[180px] animate-pulse" />
          <div className="absolute top-1/2 right-1/4 h-[500px] w-[500px] rounded-full bg-violet-500/15 blur-[150px] animate-pulse [animation-delay:2s]" />
          <div className="absolute bottom-20 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px] animate-pulse [animation-delay:4s]" />
        </div>

        {/* HERO */}
        <section className="relative flex-1 flex items-center justify-center">

          {/* Floating glass cards — decorative, large screens only */}
          <div className="hidden xl:block" aria-hidden>

            {/* Card: Users */}
            <div className="animate-float-slow absolute top-12 right-32 w-52 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_20px_40px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                <span className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase">Utilisateurs actifs</span>
              </div>
              <div className="text-2xl font-bold text-foreground mb-3">2,847</div>
              <div className="space-y-2">
                {["Sophie M.", "Thomas L.", "Clara B."].map((name) => (
                  <div key={name} className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/20 ring-1 ring-primary/30 text-[10px] flex items-center justify-center text-primary font-bold">
                      {name[0]}
                    </div>
                    <span className="text-xs text-muted-foreground">{name}</span>
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
                  </div>
                ))}
              </div>
            </div>

            {/* Card: Revenue */}
            <div className="animate-float-medium absolute bottom-12 right-24 w-48 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_20px_40px_rgba(0,0,0,0.3)]">
              <div className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">MRR</div>
              <div className="text-2xl font-bold text-foreground">€12,840</div>
              <div className="flex items-center gap-1 text-xs text-emerald-400 mt-0.5">
                <span>↑</span><span>+24.3%</span>
              </div>
              <div className="mt-3 flex items-end gap-0.5 h-10">
                {[35, 55, 40, 75, 50, 90, 68].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-primary/50"
                    style={{ height: `${h}%`, opacity: 0.4 + (i / 7) * 0.6 }}
                  />
                ))}
              </div>
            </div>

            {/* Card: Stack */}
            <div className="animate-float-slow absolute top-24 left-20 w-44 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_20px_40px_rgba(0,0,0,0.3)] [animation-delay:3s]">
              <div className="text-[11px] text-muted-foreground uppercase tracking-wide mb-3">Stack inclus</div>
              <div className="grid grid-cols-3 gap-1.5">
                {STACK_ITEMS.map((item, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[11px] font-bold text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
                    {item}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Hero content */}
          <div className="container mx-auto px-4 text-center relative z-10">

            {/* Badge */}
            <div className="badge-beam mb-8">
              <div className="badge-beam-ring" />
              <div className="badge-beam-inner gap-2 px-4 py-1.5 text-sm">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Next.js 16 · Vibe Coding · IA Ready
                </span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-6xl font-bold tracking-tight lg:text-7xl xl:text-8xl leading-none">
              <span className="block bg-gradient-to-b from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent pb-1">
                De l&apos;idée à la production
              </span>
              <span className="block bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                sans friction
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Tout est prêt. Maintenant utilisez Claude Code pour générer les nouvelles fonctionnalités de votre SaaS.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              <Link href="{{AUTH_ENTRY_URL}}">
                <Button size="lg" className="gap-2 h-12 px-6 shadow-[0_0_25px_rgba(0,0,0,0.3)] hover:shadow-[0_0_35px_hsl(var(--primary)/30%)] transition-all duration-300">
                  Commencer gratuitement <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <CopyCommand />
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {["Better Auth", "Prisma ORM", "Stripe", "Resend", "MinIO S3", "Admin panel"].map((f) => (
                <span key={f} className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm hover:border-white/[0.15] hover:text-foreground transition-all duration-200">
                  <Check className="h-3 w-3 text-primary shrink-0" />
                  {f}
                </span>
              ))}
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.04] px-3 py-1 text-xs text-emerald-400 backdrop-blur-sm">
                <Sparkles className="h-3 w-3 shrink-0" />
                /generate-features
              </span>
            </div>

          </div>
        </section>

        {/* MARQUEE */}
        <section className="py-7 overflow-hidden shrink-0">
          <div
            className="relative"
            style={{ maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)" }}
          >
            <div className="flex gap-20 animate-marquee whitespace-nowrap items-center">
              {[...TECH_NAMES, ...TECH_NAMES, ...TECH_NAMES, ...TECH_NAMES].map((name, i) => (
                <span key={i} className="text-xl font-bold tracking-tight shrink-0 bg-gradient-to-b from-foreground to-muted-foreground/30 bg-clip-text text-transparent">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Fade bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" aria-hidden />
      </div>
      {/* ─── END HERO + MARQUEE ─── */}

      <main className="flex-1">

        {/* ─── FEATURES BENTO GRID ─── */}
        {features.length > 0 && (
          <section className="py-28">
            <div className="container mx-auto px-4">

              <div className="mb-16 text-center">
                <div className="badge-beam mb-4">
                  <div className="badge-beam-ring" />
                  <div className="badge-beam-inner">
                    <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Fonctionnalités</span>
                  </div>
                </div>
                <h2 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
                  <span className="bg-gradient-to-b from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent">
                    Tout ce dont vous avez besoin
                  </span>
                </h2>
                <p className="text-muted-foreground text-lg">Déjà intégré, déjà testé, prêt à être personnalisé.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
                {features.map((feature, index) => {
                  const Icon = feature.icon ? (ICONS[feature.icon] ?? Layers) : Layers;
                  const isWide = index === 0 || index === features.length - 1;
                  const isTall = index === 1;
                  const accentColors = [
                    { bg: "bg-primary/[0.08] group-hover:bg-primary/15", ring: "ring-primary/[0.15] group-hover:ring-primary/30", icon: "text-primary", glow: "bg-primary/10" },
                    { bg: "bg-emerald-400/[0.08] group-hover:bg-emerald-400/15", ring: "ring-emerald-400/[0.15] group-hover:ring-emerald-400/30", icon: "text-emerald-400", glow: "bg-emerald-400/10" },
                    { bg: "bg-cyan-400/[0.08] group-hover:bg-cyan-400/15", ring: "ring-cyan-400/[0.15] group-hover:ring-cyan-400/30", icon: "text-cyan-400", glow: "bg-cyan-400/10" },
                    { bg: "bg-violet-400/[0.08] group-hover:bg-violet-400/15", ring: "ring-violet-400/[0.15] group-hover:ring-violet-400/30", icon: "text-violet-400", glow: "bg-violet-400/10" },
                  ];
                  const accent = accentColors[index % accentColors.length];
                  return (
                    <div
                      key={feature.id}
                      className={[
                        "group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 backdrop-blur-sm",
                        "transition-all duration-500 hover:border-white/[0.14] hover:bg-white/[0.03]",
                        "hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]",
                        isWide ? "md:col-span-2" : "",
                        isTall ? "md:row-span-2" : "",
                      ].filter(Boolean).join(" ")}
                    >
                      {/* Glow blob */}
                      <div className={`pointer-events-none absolute -top-1/2 -right-1/2 h-3/4 w-3/4 rounded-full ${accent.glow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                      {/* Top border gradient */}
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 via-emerald-400/30 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative z-10 h-full flex flex-col">
                        <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ring-1 group-hover:scale-110 transition-all duration-300 ${accent.bg} ${accent.ring}`}>
                          <Icon className={`h-5 w-5 ${accent.icon}`} />
                        </div>
                        <h3 className="mb-2 font-semibold text-foreground text-base leading-tight">{feature.title}</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground flex-1">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </section>
        )}


        {/* ─── TESTIMONIALS ─── */}
        <section className="py-28">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <div className="badge-beam mb-4">
                <div className="badge-beam-ring" />
                <div className="badge-beam-inner">
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Témoignages</span>
                </div>
              </div>
              <h2 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
                <span className="bg-gradient-to-b from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent">
                  Ce qu&apos;ils en disent
                </span>
              </h2>
              <p className="text-muted-foreground text-lg">Ils ont lancé leur projet avec <code className="font-mono text-sm">npm create saas-sbk@latest</code>.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {TESTIMONIALS.map((t, i) => {
                const glowColors = ["bg-primary/10", "bg-emerald-400/10", "bg-cyan-400/10"];
                const quoteColors = ["text-primary/25", "text-emerald-400/25", "text-cyan-400/25"];
                const avatarColors = [
                  "bg-primary/10 text-primary ring-primary/20",
                  "bg-emerald-400/10 text-emerald-400 ring-emerald-400/20",
                  "bg-cyan-400/10 text-cyan-400 ring-cyan-400/20",
                ];
                return (
                  <div
                    key={t.name}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.03] hover:-translate-y-0.5"
                  >
                    <div className={`pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full ${glowColors[i % 3]} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    {/* Quote mark */}
                    <div className={`mb-4 text-4xl font-serif leading-none select-none ${quoteColors[i % 3]}`}>&ldquo;</div>
                    <p className="relative mb-5 text-sm leading-relaxed text-muted-foreground">
                      {t.text}
                    </p>
                    <div className="relative flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ring-1 shrink-0 ${avatarColors[i % 3]}`}>
                        {t.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        {faqs.length > 0 && (
          <section className="py-28">
            <div className="container mx-auto max-w-2xl px-4">
              <div className="mb-16 text-center">
                <div className="badge-beam mb-4">
                  <div className="badge-beam-ring" />
                  <div className="badge-beam-inner">
                    <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">FAQ</span>
                  </div>
                </div>
                <h2 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
                  <span className="bg-gradient-to-b from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent">
                    Questions fréquentes
                  </span>
                </h2>
                <p className="text-muted-foreground text-lg">Tout ce que vous devez savoir.</p>
              </div>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <details
                    key={faq.id}
                    className="group rounded-2xl border border-white/[0.07] bg-white/[0.015] backdrop-blur-sm transition-all hover:border-white/[0.12] overflow-hidden open:border-primary/20 open:bg-primary/[0.02]"
                  >
                    <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-medium text-sm list-none select-none gap-4">
                      <span>{faq.question}</span>
                      <svg className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── FINAL CTA ─── */}
        <section className="pb-24 px-4">
          <div className="container mx-auto">
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] p-16 text-center">
              {/* Glass background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-background to-violet-500/[0.06] backdrop-blur-sm" />
              {/* Top shine */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              {/* Bottom vignette */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/60" />
              {/* Orbs */}
              <div className="pointer-events-none absolute top-0 left-1/4 h-64 w-64 rounded-full bg-primary/15 blur-[100px]" aria-hidden />
              <div className="pointer-events-none absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-violet-500/10 blur-[80px]" aria-hidden />

              <div className="relative z-10">
                <div className="badge-beam mb-4">
                  <div className="badge-beam-ring" />
                  <div className="badge-beam-inner">
                    <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Démarrez maintenant</span>
                  </div>
                </div>
                <h2 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
                  <span className="bg-gradient-to-b from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent">
                    Prêt à lancer votre SaaS ?
                  </span>
                </h2>
                <p className="mb-10 text-muted-foreground text-lg max-w-sm mx-auto">
                  Une commande. Tout configuré. Vos fonctionnalités prêtes à implémenter.
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
  );
}
