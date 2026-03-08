import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { prisma } from "@/lib/db/client";
import { Shield, Database, Layers, CreditCard, Mail, HardDrive, type LucideIcon } from "lucide-react";

// Map nom icône → composant Lucide
const ICONS: Record<string, LucideIcon> = {
  Shield, Database, Layers, CreditCard, Mail, HardDrive,
};

const TESTIMONIALS = [
  { name: "Sophie M.", role: "Fondatrice, StartupX", text: "Ce starter kit m'a fait gagner des semaines de développement. L'architecture est propre et extensible.", avatar: "SM" },
  { name: "Thomas L.", role: "CTO, DevAgency", text: "L'intégration Better Auth + Prisma est au top. Exactement ce dont j'avais besoin pour démarrer rapidement.", avatar: "TL" },
  { name: "Clara B.", role: "Développeuse indépendante", text: "La dashboard est magnifique out-of-the-box et les composants Shadcn UI sont parfaitement intégrés.", avatar: "CB" },
  { name: "Marc D.", role: "Lead Dev, FinTech Solutions", text: "Le système de facturation Stripe est déjà configuré. J'ai pu lancer mon SaaS en production en moins d'une semaine.", avatar: "MD" },
  { name: "Léa R.", role: "CEO, ContentFlow", text: "Le module blog avec RBAC est exactement ce qu'il me fallait. Les rôles éditeur et contributeur fonctionnent parfaitement.", avatar: "LR" },
  { name: "Antoine V.", role: "Développeur fullstack", text: "MinIO intégré dès le départ, emails transactionnels Resend prêts à l'emploi. Rien à configurer, tout fonctionne.", avatar: "AV" },
];

const TECH_LOGOS = [
  { name: "Docker", svg: null },
  { name: "Shadcn UI", svg: null },
  { name: "MinIO", svg: null },
  { name: "Next.js", svg: <svg viewBox="0 0 180 180" fill="currentColor" className="h-7 w-7"><path d="M90 0C40.3 0 0 40.3 0 90s40.3 90 90 90 90-40.3 90-90S139.7 0 90 0zm39.6 129.3L54.3 51H42v78.1h10.9V63.8l68.8 71.7c2.7-1.9 5.3-4 7.9-6.2zm-30.6-78.4h10.8V129H99V50.9z"/></svg> },
  { name: "React", svg: <svg viewBox="0 0 841.9 595.3" fill="#61DAFB" className="h-7 w-auto"><g><circle cx="420.9" cy="296.5" r="45.7"/><path d="M420.9 128.3c-20.1 0-39.3 1.4-56.6 3.9C324.8 97 279.3 75 251 75c-10.9 0-20.3 2.4-27.7 7.5-16.1 11-22.3 33.1-17.4 62.1 1.3 7.8 3.5 16 6.4 24.4C194.3 182.9 185 198 185 213c0 15 9.2 30.1 27.2 44 -2.9 8.4-5 16.6-6.4 24.4-4.9 29 1.3 51.1 17.4 62.1 7.4 5.1 16.8 7.5 27.7 7.5 28.3 0 73.8-22 113.3-57.2 17.3 2.5 36.5 3.9 56.6 3.9 20.1 0 39.3-1.4 56.6-3.9 39.5 35.2 85 57.2 113.3 57.2 10.9 0 20.3-2.4 27.7-7.5 16.1-11 22.3-33.1 17.4-62.1-1.3-7.8-3.5-16-6.4-24.4 18-13.9 27.2-29 27.2-44 0-15-9.2-30.1-27.2-44 2.9-8.4 5-16.6 6.4-24.4 4.9-29-1.3-51.1-17.4-62.1C611.2 77.4 601.8 75 590.9 75c-28.3 0-73.8 22-113.3 57.2-17.4-2.5-36.6-3.9-56.7-3.9zm0 45.8c10.2 0 20.3.5 30.1 1.4-9.7 13.1-19.2 27.8-28 43.9-8.8 16.1-16.5 32.2-23.1 48-6.6-15.8-14.3-31.9-23.1-48-8.8-16.1-18.4-30.8-28-43.9 9.8-.9 19.9-1.4 30.1-1.4h42zm-128.5 20.3c3.7 4.6 7.4 9.5 11 14.7-4.5-.2-9-.3-13.4-.3-4.5 0-9 .1-13.4.3 3.6-5.2 7.3-10.1 11-14.7zm257 0c3.7 4.6 7.4 9.5 11 14.7-4.4-.2-8.9-.3-13.4-.3-4.5 0-9 .1-13.4.3 3.7-5.2 7.4-10.1 10.8-14.7zM247.4 238.5c2 4.7 4.1 9.4 6.3 14-2.2 4.6-4.3 9.3-6.3 14-10.5-4.6-19.7-9.5-27.3-14.5 7.6-4.9 16.8-9.8 27.3-13.5zm347.1 0c10.5 3.8 19.7 8.7 27.3 13.5-7.6 5.1-16.8 9.9-27.3 14.5-2-4.7-4.1-9.4-6.3-14 2.2-4.6 4.3-9.3 6.3-14zM420.9 302c7.3 0 14.4-.3 21.3-.8-3.6 6.1-7.2 12-10.8 17.6-3.5 5.5-7 10.8-10.5 15.8-3.5-5-7-10.3-10.5-15.8-3.6-5.6-7.2-11.5-10.8-17.6 6.9.5 14 .8 21.3.8zm80.6-10.5c-2 4.7-4.1 9.4-6.3 14 2.2 4.6 4.3 9.3 6.3 14 10.5-4.6 19.7-9.5 27.3-14.5-7.6-4.9-16.8-9.8-27.3-13.5zm-161.2 0c-10.5 3.8-19.7 8.7-27.3 13.5 7.6 5.1 16.8 9.9 27.3 14.5 2-4.7 4.1-9.4 6.3-14-2.2-4.6-4.3-9.3-6.3-14z"/></g></svg> },
  { name: "TypeScript", svg: <svg viewBox="0 0 400 400" className="h-7 w-7"><rect width="400" height="400" rx="50" fill="#3178C6"/><path d="M87.6 200.5v22.4h35.7v101h27.2v-101h35.7v-22.4H87.6zm162.3 0v123.4h27.3v-51.3h2.7l27.3 51.3h31.7l-29-52.3c13.7-4.2 22.2-15.7 22.2-30.7 0-20-13.6-40.4-44.4-40.4h-37.8zm27.3 22.4h8.5c13.4 0 19.2 6.5 19.2 17.2 0 10.6-5.8 17.2-19.2 17.2h-8.5v-34.4z" fill="white"/></svg> },
  { name: "Prisma", svg: <svg viewBox="0 0 256 310" className="h-7 w-5"><path d="M255.113 208.893L148.418 1.85a16.63 16.63 0 0 0-14.745-1.792 16.63 16.63 0 0 0-10.454 11.287L.113 273.283a16.63 16.63 0 0 0 3.28 15.432 16.63 16.63 0 0 0 14.744 5.38l150.037-25.056a16.63 16.63 0 0 0 13.462-15.432V98.38l56.19 119.594a16.63 16.63 0 0 0 15.103 9.602 16.63 16.63 0 0 0 2.184-.145 16.63 16.63 0 0 0 14.072-13.606 16.63 16.63 0 0 0-14.072-5.032z" fill="currentColor"/></svg> },
  { name: "Tailwind", svg: <svg viewBox="0 0 248 31" fill="#38BDF8" className="h-5 w-auto"><path fillRule="evenodd" clipRule="evenodd" d="M25.517 0C18.712 0 14.46 3.382 12.758 10.146c2.552-3.382 5.529-4.65 8.931-3.805 1.941.482 3.329 1.882 4.864 3.432 2.502 2.524 5.398 5.445 11.722 5.445 6.804 0 11.057-3.382 12.758-10.145-2.551 3.382-5.528 4.65-8.93 3.804-1.942-.482-3.33-1.882-4.865-3.431C34.736 2.92 31.841 0 25.517 0zM12.758 15.218C5.954 15.218 1.701 18.6 0 25.364c2.552-3.382 5.529-4.65 8.93-3.805 1.942.482 3.33 1.882 4.865 3.432 2.502 2.524 5.397 5.445 11.722 5.445 6.804 0 11.057-3.382 12.758-10.145-2.552 3.382-5.529 4.65-8.931 3.805-1.941-.482-3.329-1.882-4.864-3.432-2.502-2.524-5.398-5.446-11.722-5.446z"/></svg> },
  { name: "Stripe", svg: <svg viewBox="0 0 60 25" fill="#635BFF" className="h-5 w-auto"><path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.87zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z"/></svg> },
  { name: "Resend", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg> },
];

export default async function Home() {
  const [features, faqs] = await Promise.all([
    prisma.feature.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.faq.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero + Marquee = 100vh */}
      <main className="flex-1">
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          {/* Hero */}
          <section className="flex-1 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <h1 className="mb-6 text-5xl font-bold tracking-tight">
                Bienvenue sur {{PROJECT_NAME}}
              </h1>
              <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
                Votre SAAS est prêt à démarrer. Commencez à construire votre application.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link href="{{AUTH_ENTRY_URL}}">
                  <Button size="lg">Commencer gratuitement</Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline">En savoir plus</Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Marquee — noms tech avec fondu sur les bords */}
          <section className="border-y bg-muted/30 py-8 overflow-hidden shrink-0">
            <div
              className="relative"
              style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}
            >
              <div className="flex gap-16 animate-marquee whitespace-nowrap">
                {[...TECH_LOGOS, ...TECH_LOGOS, ...TECH_LOGOS, ...TECH_LOGOS].map((logo, i) => (
                  <span key={i} className="text-sm font-semibold tracking-wide text-muted-foreground shrink-0">
                    {logo.name}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Features */}
        {features.length > 0 && (
          <section className="border-t bg-muted/50 py-24">
            <div className="container mx-auto px-4">
              <h2 className="mb-4 text-center text-3xl font-bold">Fonctionnalités</h2>
              <p className="mb-12 text-center text-muted-foreground">Tout ce dont vous avez besoin, déjà intégré.</p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => {
                  const Icon = feature.icon ? (ICONS[feature.icon] ?? Layers) : Layers;
                  return (
                    <div key={feature.id} className="rounded-xl border bg-card p-6 space-y-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Testimonials */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-4 text-center text-3xl font-bold">Ce qu&apos;ils en disent</h2>
            <p className="mb-12 text-center text-muted-foreground">Ils ont utilisé {{PROJECT_NAME}} pour lancer leur projet.</p>
            <div className="grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="rounded-xl border bg-card p-6 space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="border-t bg-muted/50 py-24">
            <div className="container mx-auto max-w-2xl px-4">
              <h2 className="mb-4 text-center text-3xl font-bold">Questions fréquentes</h2>
              <p className="mb-12 text-center text-muted-foreground">Tout ce que vous devez savoir.</p>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <details key={faq.id} className="group rounded-xl border bg-card">
                    <summary className="flex cursor-pointer items-center justify-between p-5 font-medium text-sm list-none">
                      {faq.question}
                      <svg className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="px-5 pb-5 text-sm text-muted-foreground">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
