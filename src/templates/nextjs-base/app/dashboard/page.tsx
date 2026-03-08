import { Terminal, Sparkles, BookOpen, Bot } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 p-8 md:p-12">

      {/* En-tête */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Bienvenue sur votre Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Votre espace membre est prêt. C&apos;est à vous de jouer !
        </p>
      </div>

      {/* Carte principale Claude Code */}
      <div className="w-full max-w-2xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Implémentez vos fonctionnalités</h2>
            <p className="text-sm text-muted-foreground">Utilisez Claude Code pour construire votre SaaS</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Cette page est votre point de départ. Lancez la commande ci-dessous dans Claude Code
          pour générer de nouvelles fonctionnalités adaptées à votre projet.
        </p>

        {/* Commande */}
        <div className="flex items-center gap-3 rounded-xl bg-background/80 border border-border px-4 py-3">
          <Terminal className="h-4 w-4 text-primary shrink-0" />
          <code className="text-sm font-mono text-primary">/generate-features</code>
          <span className="text-xs text-muted-foreground ml-auto">dans Claude Code</span>
        </div>

        {/* Ressources disponibles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="flex items-start gap-3 rounded-xl border border-border bg-background/60 p-4">
            <BookOpen className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Skills disponibles</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Next.js, Prisma, Better Auth, MinIO, Stripe, Resend…
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-border bg-background/60 p-4">
            <Bot className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Agents spécialisés</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Full-stack dev, code reviewer — disponibles dans{" "}
                <code className="text-xs">.claude/agents/</code>
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-md">
        Personnalisez cette page dans{" "}
        <code className="text-xs">app/dashboard/page.tsx</code>{" "}
        pour afficher le contenu pertinent à vos utilisateurs.
      </p>

    </div>
  )
}
