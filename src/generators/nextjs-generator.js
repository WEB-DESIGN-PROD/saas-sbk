import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { writeFile } from '../utils/file-utils.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Génère le projet Next.js en copiant le template shadcn-base
 * puis en superposant les fichiers de configuration spécifiques (Better Auth, Prisma, etc.)
 */
export function generateNextjsProject(projectPath, config) {
  const shadcnBaseDir = path.join(__dirname, '../templates/shadcn-base');
  const templatesDir = path.join(__dirname, '../templates/nextjs-base');

  // 1. Copier le template shadcn-base (base identique à test-template)
  //    Inclut : components/ui/*, app/globals.css, tsconfig.json, next.config.ts, etc.
  fs.cpSync(shadcnBaseDir, projectPath, { recursive: true });

  // 2. Copier les fichiers de configuration spécifiques par-dessus
  copyConfigFiles(projectPath, config, templatesDir);

  // 3. Générer lib/auth/config.ts, lib/auth/client.ts et app/login/page.tsx dynamiquement
  generateAuthConfig(projectPath, config);
  generateAuthClient(projectPath, config);
  generateLoginPage(projectPath, config);

  // 3b. Générer lib/email/client.ts dynamiquement selon le provider
  if (config.email && config.email.provider !== 'none') {
    generateEmailClient(projectPath, config);
  }

  // 4. Copier les variantes conditionnelles (OAuth, Stripe, email, etc.)
  copyConditionalVariants(projectPath, config, replacementsForVariants(config));

  // 5. Générer .gitignore
  generateGitignore(projectPath);

  // 6. Générer README.md
  generateReadme(projectPath, config);

  logger.successWithComment('Structure du projet Next.js créée', 'Votre application web');
}

/**
 * Copie les fichiers de configuration spécifiques par-dessus le template shadcn-base
 * (Better Auth, Prisma, pages auth, layout, etc.)
 */
function copyConfigFiles(projectPath, config, templatesDir) {
  const hasEmail = config.email && config.email.provider !== 'none';
  const loginMethod = config.auth?.loginMethod || 'email-password';

  // Variables de remplacement
  const allLanguages = [
    ...(config.i18n?.defaultLanguage ? [config.i18n.defaultLanguage] : ['fr']),
    ...(config.i18n?.languages || []).filter(l => l !== config.i18n?.defaultLanguage),
  ];

  // L'inscription est toujours email + mot de passe + vérification email
  // {{AUTH_ENTRY_URL}} pointe toujours vers /register
  const registerRedirect = hasEmail ? '/verify-email' : '/dashboard';

  const replacements = {
    '{{PROJECT_NAME}}': config.projectName,
    '{{THEME}}': config.theme || 'system',
    '{{DEFAULT_LANGUAGE}}': config.i18n?.defaultLanguage || 'fr',
    '{{AVAILABLE_LANGUAGES}}': allLanguages.join(','),
    '{{REGISTER_REDIRECT}}': registerRedirect,
    '{{PASSWORDLESS_LINK_SECTION}}': '', // plus utilisé — login page générée dynamiquement
    '{{AUTH_ENTRY_URL}}': '/register',   // toujours /register
  };

  const hasI18n = config.i18n && config.i18n.languages && config.i18n.languages.length > 1;

  // Fichiers toujours copiés (écrasent le shadcn-base)
  // Note: lib/auth/config.ts, lib/auth/client.ts et app/login/page.tsx sont générés dynamiquement
  // Note: si i18n activé, les pages publiques sont dans app/[locale]/ (variant i18n)
  const alwaysCopy = [
    'app/layout.tsx',
    'app/error.tsx',
    'app/not-found.tsx',
    // app/login/page.tsx est généré dynamiquement par generateLoginPage()
    // app/register/page.tsx est toujours présent (inscription universelle)
    'app/register/page.tsx',
    // Pages publiques : copiées seulement si i18n désactivé (sinon variant i18n les fournit)
    ...(hasI18n ? [] : [
      'app/page.tsx',
      'app/pricing/page.tsx',
      'app/about/page.tsx',
    ]),
    'app/dashboard/layout.tsx',
    'app/dashboard/page.tsx',
    'app/dashboard/account/page.tsx',
    'app/dashboard/settings/page.tsx',
    'app/api/auth/[...all]/route.ts',
    'lib/db/client.ts',
    'lib/dal.ts',
    'components/auth/logout-button.tsx',
    'components/auth/github-button.tsx',
    'components/app-sidebar.tsx',
    'components/site-header.tsx',
    'components/nav-user.tsx',
    'components/nav-main.tsx',
    'components/nav-secondary.tsx',
    // navbar/footer : copiés depuis nextjs-base si pas i18n (le variant i18n fournit les versions i18n)
    ...(hasI18n ? [] : [
      'components/navbar.tsx',
      'components/navbar-client.tsx',
      'components/footer.tsx',
    ]),
    'components/copy-command.tsx',
    'components/scroll-animations.tsx',
    'components/theme-provider.tsx',
    'components/theme-toggle.tsx',
    'types/index.ts',
    'prisma/schema.prisma',
    'lib/subscription/helpers.ts',
    'components/ui/dialog.tsx',
    'components/billing/buy-credits-dialog.tsx',
    'app/dashboard/billing/page.tsx',
    'app/api/user/plan/route.ts',
    // Pages publiques contact/slug : copiées seulement si i18n désactivé
    ...(hasI18n ? [] : [
      'app/contact/page.tsx',
      'app/contact/layout.tsx',
      'app/[slug]/page.tsx',
    ]),
    'app/loading.tsx',
    'DEVELOPMENT.md',
    // API Contact (formulaire de contact)
    'app/api/contact/route.ts',
    // API publiques (landing page : features, FAQ, tarifs, pages)
    'app/api/public/faq/route.ts',
    'app/api/public/features/route.ts',
    'app/api/public/pricing/route.ts',
    'app/api/public/pages/[slug]/route.ts',
    // Seed Prisma (données initiales)
    'prisma/seed.ts',
  ];

  // Fichiers conditionnels
  const conditionalCopy = [];

  if (hasEmail) {
    conditionalCopy.push('lib/email/templates.ts');
    // verify-email : toujours présent quand email provider (inscription universelle)
    conditionalCopy.push('app/verify-email/page.tsx');
  }

  // forgot-password / reset-password : seulement si loginMethod = email-password
  if (hasEmail && loginMethod === 'email-password') {
    conditionalCopy.push(
      'app/forgot-password/page.tsx',
      'app/reset-password/page.tsx',
    );
  }
  if (config.storage && config.storage.enabled) {
    conditionalCopy.push(
      'lib/storage/client.ts',
      'lib/storage/minio-client.ts',
      'app/api/media/route.ts',
      'app/api/media/upload/route.ts',
      'app/dashboard/media/page.tsx',
      'components/media/upload-dialog.tsx',
    );
    if (config.admin && config.admin.enabled) {
      conditionalCopy.push('app/admin/media/page.tsx');
    }
  }
  if (config.ai && config.ai.providers && config.ai.providers.length > 0) {
    conditionalCopy.push('lib/ai/client.ts');
  }

  if (config.admin && config.admin.enabled) {
    conditionalCopy.push(
      'app/admin/layout.tsx',
      'app/admin/page.tsx',
      'app/admin/account/page.tsx',
      'app/admin/settings/page.tsx',
      'app/admin/users/page.tsx',
      'components/admin/section-cards-admin.tsx',
      'components/admin/admin-chart-signups.tsx',
      'components/admin/users-table.tsx',
      'components/section-cards.tsx',
      'components/chart-area-interactive.tsx',
      'components/data-table.tsx',
      'components/admin/invite-user-button.tsx',
      'components/admin/roles-permissions-card.tsx',
      'components/admin/auto-refresh.tsx',
      'components/impersonation-banner.tsx',
      'app/api/admin/stats/route.ts',
      'app/api/admin/users/route.ts',
      'app/api/admin/users/[id]/route.ts',
      'app/api/admin/invitations/route.ts',
      'app/api/admin/invitations/[id]/route.ts',
      // Gestion du SAAS (pages, features, FAQ, tarifs)
      'app/admin/pages/page.tsx',
      'app/admin/features/page.tsx',
      'app/admin/faq/page.tsx',
      'app/admin/pricing/page.tsx',
      'components/admin/pages-manager.tsx',
      'components/admin/features-manager.tsx',
      'components/admin/faq-manager.tsx',
      'components/admin/pricing-manager.tsx',
      'app/api/admin/pages/route.ts',
      'app/api/admin/pages/[id]/route.ts',
      'app/api/admin/pages/reorder/route.ts',
      'app/api/admin/features/route.ts',
      'app/api/admin/features/[id]/route.ts',
      'app/api/admin/features/reorder/route.ts',
      'app/api/admin/faq/route.ts',
      'app/api/admin/faq/[id]/route.ts',
      'app/api/admin/faq/reorder/route.ts',
      'app/api/admin/pricing/route.ts',
      'app/api/admin/pricing/[id]/route.ts',
      'app/api/admin/credit-packs/route.ts',
      'app/api/admin/credit-packs/[id]/route.ts',
      'app/api/public/credit-packs/route.ts',
    );
  }

  // InputOTP composant : seulement si loginMethod = otp
  if (loginMethod === 'otp') {
    conditionalCopy.push('components/ui/input-otp.tsx');
  }

  // Copie blog
  if (config.saasType === 'blog') {
    const blogPublicFiles = [
      'app/blog/layout.tsx',
      'app/blog/page.tsx',
      'app/blog/[slug]/page.tsx',
      'app/blog/categorie/[slug]/page.tsx',
      'app/blog/tag/[slug]/page.tsx',
      'app/blog/preview/[id]/page.tsx',
      'app/feed.xml/route.ts',
      'components/blog/article-card.tsx',
      'components/blog/markdown-preview.tsx',
    ];
    for (const f of blogPublicFiles) {
      conditionalCopy.push(f);
    }

    const blogMgmtBase = config.admin?.enabled ? 'admin' : 'dashboard';
    const blogMgmtFiles = [
      `app/${blogMgmtBase}/blog/page.tsx`,
      `app/${blogMgmtBase}/blog/new/page.tsx`,
      `app/${blogMgmtBase}/blog/[id]/edit/page.tsx`,
      `app/${blogMgmtBase}/blog/categories/page.tsx`,
      'app/api/blog/posts/route.ts',
      'app/api/blog/posts/[id]/route.ts',
      'app/api/blog/categories/route.ts',
      'app/api/blog/categories/[id]/route.ts',
      'app/api/blog/check-slug/route.ts',
      'app/api/blog/tags/route.ts',
      'components/blog/article-editor.tsx',
      'components/blog/articles-table.tsx',
      'components/blog/tag-input.tsx',
      'components/blog/category-manager.tsx',
      'components/blog/categories-card.tsx',
    ];
    for (const f of blogMgmtFiles) {
      conditionalCopy.push(f);
    }
  }

  for (const file of [...alwaysCopy, ...conditionalCopy]) {
    const src = path.join(templatesDir, file);
    const dest = path.join(projectPath, file);

    if (!fs.existsSync(src)) continue;

    fs.mkdirSync(path.dirname(dest), { recursive: true });

    let content = fs.readFileSync(src, 'utf-8');
    for (const [key, value] of Object.entries(replacements)) {
      content = content.replaceAll(key, value);
    }
    fs.writeFileSync(dest, content, 'utf-8');
  }

  // Injecter @plugin "@tailwindcss/typography" dans globals.css si blog activé
  if (config.saasType === 'blog') {
    const globalsCssPath = path.join(projectPath, 'app/globals.css');
    if (fs.existsSync(globalsCssPath)) {
      let css = fs.readFileSync(globalsCssPath, 'utf-8');
      if (!css.includes('@tailwindcss/typography')) {
        css = css.replace('@import "tailwindcss";', '@import "tailwindcss";\n@plugin "@tailwindcss/typography";');
        fs.writeFileSync(globalsCssPath, css, 'utf-8');
      }
    }
  }
}

/**
 * Génère lib/auth/client.ts dynamiquement avec les plugins client correspondant
 * aux plugins serveur activés (magicLink, emailOtp).
 */
function generateAuthClient(projectPath, config) {
  const hasMagicLink = config.auth?.methods?.includes('magiclink');
  const hasOtp = config.auth?.methods?.includes('otp');
  const hasAdmin = config.admin?.enabled && config.admin?.email;

  const clientPluginImports = [];
  const clientPluginInits = [];

  if (hasMagicLink) {
    clientPluginImports.push('magicLinkClient');
    clientPluginInits.push('magicLinkClient()');
  }
  if (hasOtp) {
    clientPluginImports.push('emailOTPClient');
    clientPluginInits.push('emailOTPClient()');
  }
  if (hasAdmin) {
    clientPluginImports.push('adminClient');
    clientPluginInits.push('adminClient()');
  }

  let lines = [];
  lines.push('import { createAuthClient } from "better-auth/react"');

  if (clientPluginImports.length > 0) {
    lines.push(`import { ${clientPluginImports.join(', ')} } from "better-auth/client/plugins"`);
  }

  lines.push('');
  lines.push('export const authClient = createAuthClient({');
  lines.push('  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",');

  if (clientPluginInits.length > 0) {
    lines.push(`  plugins: [${clientPluginInits.join(', ')}],`);
  }

  lines.push('})');
  lines.push('');
  lines.push('export const { signIn, signUp, signOut, useSession } = authClient');
  lines.push('');

  const dest = path.join(projectPath, 'lib/auth/client.ts');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, lines.join('\n'), 'utf-8');
}

/**
 * Génère lib/email/client.ts dynamiquement selon le provider choisi.
 * Évite d'inclure nodemailer si provider=resend (et vice-versa),
 * ce qui résout l'erreur "Module not found: Can't resolve 'nodemailer'" de Next.js.
 */
function generateEmailClient(projectPath, config) {
  const isResend = config.email.provider === 'resend';
  let content;

  const sharedFunctions = `
function emailLayout(title: string, preheader: string, body: string, buttonUrl: string, buttonLabel: string, footer: string): string {
  return \`<!DOCTYPE html>
<html lang="fr" style="color-scheme:light only;">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5 !important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#09090b !important;">
  <div style="display:none;max-height:0;overflow:hidden">\${preheader}</div>
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5 !important;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff !important;border-radius:12px;border:1px solid #e4e4e7;">
        <tr><td style="background-color:#18181b !important;padding:20px 32px;border-radius:12px 12px 0 0;">
          <span style="color:#ffffff !important;font-size:16px;font-weight:700;letter-spacing:-0.01em;">{{PROJECT_NAME}}</span>
        </td></tr>
        <tr><td style="padding:40px 32px 32px;background-color:#ffffff !important;">
          <h1 style="margin:0 0 16px;color:#09090b !important;font-size:22px;font-weight:700;line-height:1.3;">\${title}</h1>
          \${body}
          <table cellpadding="0" cellspacing="0" style="margin-top:32px;">
            <tr><td style="border-radius:8px;background-color:#18181b !important;">
              <a href="\${buttonUrl}" style="display:inline-block;padding:13px 28px;color:#ffffff !important;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;letter-spacing:0.01em;background-color:#18181b !important;">\${buttonLabel}</a>
            </td></tr>
          </table>
          <p style="margin:20px 0 0;color:#71717a !important;font-size:12px;line-height:1.5;">Ou copiez ce lien dans votre navigateur :<br><a href="\${buttonUrl}" style="color:#71717a !important;word-break:break-all;">\${buttonUrl}</a></p>
        </td></tr>
        <tr><td style="padding:20px 32px;background-color:#f8f8f8 !important;border-top:1px solid #e4e4e7;border-radius:0 0 12px 12px;">
          <p style="margin:0;color:#71717a !important;font-size:12px;line-height:1.6;">\${footer}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>\`
}

export async function sendInvitationEmail(to: string, role: string, appUrl: string) {
  const roleLabels: Record<string, string> = {
    'co-admin': 'Co-Admin',
    'editor': 'Éditeur',
    'contributor': 'Contributeur',
  }
  const roleLabel = roleLabels[role] || role
  const body = \`
    <p style="margin:0 0 8px;color:#3f3f46;font-size:15px;line-height:1.6">Vous avez été invité(e) à rejoindre l'équipe en tant que <strong style="color:#09090b">\${roleLabel}</strong>.</p>
    <p style="margin:0;color:#3f3f46;font-size:15px;line-height:1.6">Créez votre compte en cliquant sur le bouton ci-dessous. Votre rôle sera attribué automatiquement à l'inscription.</p>
  \`
  await sendEmail({
    to,
    subject: \`Invitation à rejoindre l'équipe — rôle \${roleLabel}\`,
    html: emailLayout(
      'Vous avez été invité(e)',
      \`Invitation avec le rôle \${roleLabel}\`,
      body,
      \`\${appUrl}/register\`,
      'Créer mon compte',
      "Cette invitation expire dans 7 jours. Si vous n'attendiez pas cet email, vous pouvez l'ignorer."
    ),
  })
}

export async function sendPendingReviewEmail(to: string, postTitle: string, postId: string, authorName: string, appUrl: string) {
  const body = \`
    <p style="margin:0 0 16px;color:#3f3f46;font-size:15px;line-height:1.6">Un article est en attente de validation.</p>
    <table cellpadding="0" cellspacing="0" style="border:1px solid #e4e4e7;border-radius:8px;overflow:hidden;width:100%">
      <tr><td style="padding:12px 16px;background-color:#fafafa;border-bottom:1px solid #e4e4e7">
        <span style="color:#71717a;font-size:12px;font-weight:500;text-transform:uppercase;letter-spacing:0.05em">Titre</span>
        <p style="margin:4px 0 0;color:#09090b;font-size:14px;font-weight:600">\${postTitle}</p>
      </td></tr>
      <tr><td style="padding:12px 16px">
        <span style="color:#71717a;font-size:12px;font-weight:500;text-transform:uppercase;letter-spacing:0.05em">Auteur</span>
        <p style="margin:4px 0 0;color:#09090b;font-size:14px">\${authorName}</p>
      </td></tr>
    </table>
  \`
  await sendEmail({
    to,
    subject: \`Article en attente — \${postTitle}\`,
    html: emailLayout(
      'Article en attente de validation',
      \`"\${postTitle}" par \${authorName}\`,
      body,
      \`\${appUrl}/admin/blog/\${postId}/edit\`,
      "Voir et valider l'article",
      'Vous recevez cet email car vous êtes administrateur ou co-administrateur de la plateforme.'
    ),
  })
}
`;

  if (isResend) {
    content = `// Client email Resend
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(options: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  await resend.emails.send({
    from: options.from || process.env.EMAIL_FROM || 'noreply@example.com',
    to: options.to,
    subject: options.subject,
    html: options.html,
  })
}
${sharedFunctions}`;
  } else {
    content = `// Client email SMTP (Nodemailer)
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendEmail(options: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  await transporter.sendMail({
    from: options.from || process.env.EMAIL_FROM || 'noreply@example.com',
    to: options.to,
    subject: options.subject,
    html: options.html,
  })
}
${sharedFunctions}`;
  }

  const dest = path.join(projectPath, 'lib/email/client.ts');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content.replaceAll('{{PROJECT_NAME}}', config.projectName), 'utf-8');
}

/**
 * Génère app/login/page.tsx selon la méthode de connexion choisie (loginMethod).
 *
 * L'inscription est toujours email/password + vérification.
 * loginMethod contrôle uniquement la page de connexion après inscription.
 *
 * - email-password → formulaire email + mot de passe + lien "mot de passe oublié"
 * - magiclink      → formulaire email → envoi lien magic link
 * - otp            → étape 1 email → étape 2 code OTP
 */
function generateLoginPage(projectPath, config) {
  const loginMethod = config.auth?.loginMethod || 'email-password';
  const hasGithub = config.auth?.methods?.includes('github');
  const hasGoogle = config.auth?.methods?.includes('google');
  const hasSocial = hasGithub || hasGoogle;

  // Boutons sociaux communs à tous les cas
  const githubImport = hasGithub ? '\nimport { GitHubButton } from "@/components/auth/github-button"' : '';
  const googleImport = hasGoogle ? '\nimport { GoogleButton } from "@/components/auth/google-button"' : '';
  const socialButtons = !hasSocial ? '' : `
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">ou</span>
                </div>
              </div>${hasGithub ? '\n              <GitHubButton />' : ''}${hasGoogle ? '\n              <GoogleButton />' : ''}
            </div>`;

  let content;

  if (loginMethod === 'email-password') {
    // ── Email + mot de passe ──
    content = `"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signIn } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"${githubImport}${googleImport}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await signIn.email({ email, password })
      if (result.error) {
        toast.error("Échec de la connexion", { description: result.error.message || "Email ou mot de passe incorrect" })
        return
      }
      router.push("/dashboard")
    } catch (error: any) {
      toast.error("Erreur de connexion", { description: error?.message || "Une erreur est survenue" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription>Entrez vos identifiants pour accéder à votre compte</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pb-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="nom@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link href="/forgot-password" className="text-sm text-muted-foreground hover:underline">Mot de passe oublié ?</Link>
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>${socialButtons}
            <p className="text-center text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link href="/register" className="font-medium underline underline-offset-4">Créer un compte</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
`;

  } else if (loginMethod === 'magiclink') {
    // ── Magic Link ──
    content = `"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { authClient } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"${githubImport}${googleImport}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await authClient.signIn.magicLink({ email, callbackURL: "/dashboard" })
      if (result.error) {
        toast.error("Erreur", { description: result.error.message || "Impossible d'envoyer le lien" })
        return
      }
      setSent(true)
    } catch {
      toast.error("Erreur", { description: "Une erreur est survenue. Réessayez." })
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-2 text-4xl">✉️</div>
            <CardTitle className="text-2xl font-bold">Vérifiez vos emails</CardTitle>
            <CardDescription>Un lien de connexion a été envoyé à {email}. Il expire dans 15 minutes.</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <button className="text-sm text-muted-foreground hover:underline" onClick={() => setSent(false)}>Renvoyer un lien</button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription>Entrez votre email pour recevoir un lien de connexion</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pb-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="nom@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Envoi en cours..." : "Recevoir un lien de connexion"}
            </Button>${socialButtons}
            <p className="text-center text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link href="/register" className="font-medium underline underline-offset-4">Créer un compte</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
`;

  } else {
    // ── OTP ──
    content = `"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authClient } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"${githubImport}${googleImport}

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await authClient.emailOtp.sendVerificationOtp({ email, type: "sign-in" })
      if (result.error) {
        toast.error("Erreur", { description: result.error.message || "Impossible d'envoyer le code" })
        return
      }
      setStep("otp")
      toast.success("Code envoyé !", { description: "Vérifiez votre boîte mail." })
    } catch {
      toast.error("Erreur", { description: "Une erreur est survenue. Réessayez." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast.error("Code incomplet", { description: "Entrez les 6 chiffres du code." })
      return
    }
    setIsLoading(true)
    try {
      const result = await authClient.signIn.emailOtp({ email, otp })
      if (result.error) {
        toast.error("Code invalide", { description: result.error.message || "Code incorrect ou expiré" })
        return
      }
      router.push("/dashboard")
    } catch {
      toast.error("Erreur", { description: "Une erreur est survenue. Réessayez." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription>
            {step === "email" ? "Entrez votre email pour recevoir un code de connexion" : \`Code envoyé à \${email}\`}
          </CardDescription>
        </CardHeader>
        {step === "email" ? (
          <form onSubmit={handleSendOtp}>
            <CardContent className="space-y-4 pb-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="nom@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Envoi en cours..." : "Recevoir un code"}
              </Button>${socialButtons}
              <p className="text-center text-sm text-muted-foreground">
                Pas encore de compte ?{" "}
                <Link href="/register" className="font-medium underline underline-offset-4">Créer un compte</Link>
              </p>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <CardContent className="pb-6">
              <div className="space-y-3">
                <Label>Code à 6 chiffres</Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={isLoading}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-center text-xs text-muted-foreground">Ce code expire dans 10 minutes</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                {isLoading ? "Vérification..." : "Se connecter"}
              </Button>
              <button type="button" className="text-sm text-muted-foreground hover:underline" onClick={() => { setStep("email"); setOtp("") }}>
                Changer d'email
              </button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
`;
  }

  const dest = path.join(projectPath, 'app/login/page.tsx');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content, 'utf-8');
}

/**
 * Génère lib/auth/config.ts dynamiquement selon les options de configuration
 */
function generateAuthConfig(projectPath, config) {
  const hasEmail = config.email && config.email.provider !== 'none';
  const loginMethod = config.auth?.loginMethod || 'email-password';
  const hasMagicLink = loginMethod === 'magiclink';
  const hasOtp = loginMethod === 'otp';
  const hasGithub = config.auth?.methods?.includes('github');
  const hasGoogle = config.auth?.methods?.includes('google');
  const hasAdmin = config.admin?.enabled && config.admin?.email;
  const appName = config.projectName;

  // Imports conditionnels
  const emailImports = [];
  if (hasEmail) {
    // sendVerification toujours (inscription universelle), sendReset seulement si loginMethod=email-password
    emailImports.push('sendVerificationEmail');
    if (loginMethod === 'email-password') emailImports.push('sendResetPasswordEmail');
    // sendEmail pour la notification admin (nouvelle inscription)
    if (hasAdmin) emailImports.push('sendEmail');
  }
  if (hasMagicLink) {
    emailImports.push('sendMagicLinkEmail');
  }
  if (hasOtp) {
    emailImports.push('sendOtpEmail');
  }

  const pluginImports = [];
  if (hasMagicLink) pluginImports.push('magicLink');
  if (hasOtp) pluginImports.push('emailOTP');
  if (hasAdmin) pluginImports.push('admin');

  // Construction du fichier
  let lines = [];

  lines.push('import { betterAuth } from "better-auth"');
  lines.push('import { prismaAdapter } from "better-auth/adapters/prisma"');
  lines.push('import { prisma } from "@/lib/db/client"');

  if (pluginImports.length > 0) {
    lines.push(`import { ${pluginImports.join(', ')} } from "better-auth/plugins"`);
  }

  if (emailImports.length > 0) {
    lines.push(`import { ${emailImports.join(', ')} } from "@/lib/email/templates"`);
  }

  lines.push('');
  lines.push('console.log("🔧 Initialisation Better Auth...")');
  lines.push('console.log("📦 DATABASE_URL:", process.env.DATABASE_URL ? "✅ Définie" : "❌ Manquante")');
  lines.push('');

  lines.push('export const auth = betterAuth({');
  lines.push('  database: prismaAdapter(prisma, {');
  lines.push('    provider: "postgresql",');
  lines.push('  }),');

  // emailAndPassword — toujours actif (inscription universelle)
  lines.push('  emailAndPassword: {');
  lines.push('    enabled: true,');
  if (hasEmail && loginMethod === 'email-password') {
    lines.push('    sendResetPassword: async ({ user, url }) => {');
    lines.push('      try {');
    lines.push(`        await sendResetPasswordEmail(user.email, user.name || user.email, url, "${appName}")`);
    lines.push('      } catch (err) { console.error("❌ Reset password email error:", err) }');
    lines.push('    },');
  }
  lines.push('  },');

  // emailVerification — toujours actif si provider email (inscription universelle)
  if (hasEmail) {
    lines.push('  emailVerification: {');
    lines.push('    sendOnSignUp: true,');
    lines.push('    autoSignInAfterVerification: true,');
    lines.push('    sendVerificationEmail: async ({ user, url }) => {');
    lines.push('      try {');
    lines.push('        const verifyUrl = new URL(url)');
    lines.push('        verifyUrl.searchParams.set("callbackURL", "/dashboard")');
    lines.push(`        await sendVerificationEmail(user.email, user.name || user.email, verifyUrl.toString(), "${appName}")`);
    lines.push('      } catch (err) { console.error("❌ Verification email error:", err) }');
    lines.push('    },');
    lines.push('  },');
  }

  // socialProviders
  lines.push('  socialProviders: {');
  if (hasGithub) {
    lines.push('    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? {');
    lines.push('      github: {');
    lines.push('        clientId: process.env.GITHUB_CLIENT_ID,');
    lines.push('        clientSecret: process.env.GITHUB_CLIENT_SECRET,');
    lines.push('      },');
    lines.push('    } : {}),');
  }
  if (hasGoogle) {
    lines.push('    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? {');
    lines.push('      google: {');
    lines.push('        clientId: process.env.GOOGLE_CLIENT_ID,');
    lines.push('        clientSecret: process.env.GOOGLE_CLIENT_SECRET,');
    lines.push('      },');
    lines.push('    } : {}),');
  }
  lines.push('  },');

  // plugins
  if (pluginImports.length > 0) {
    lines.push('  plugins: [');
    if (hasMagicLink) {
      lines.push('    magicLink({');
      lines.push('      sendMagicLink: async ({ email, url }) => {');
      lines.push('        try {');
      lines.push(`          await sendMagicLinkEmail(email, email, url, "${appName}")`);
      lines.push('        } catch (err) { console.error("❌ Magic link email error:", err) }');
      lines.push('      },');
      lines.push('    }),');
    }
    if (hasOtp) {
      lines.push('    emailOTP({');
      lines.push('      sendVerificationOTP: async ({ email, otp, type }) => {');
      lines.push('        try {');
      lines.push(`          await sendOtpEmail(email, otp, type, "${appName}")`);
      lines.push('        } catch (err) { console.error("❌ OTP email error:", err) }');
      lines.push('      },');
      lines.push('    }),');
    }
    if (hasAdmin) {
      lines.push('    admin({');
      lines.push('      defaultRole: "member",');
      lines.push('    }),');
    }
    lines.push('  ],');
  }

  // databaseHooks : attribution automatique du rôle admin/staff + notification email nouvelle inscription
  if (hasAdmin) {
    lines.push('  databaseHooks: {');
    lines.push('    user: {');
    lines.push('      create: {');
    lines.push('        after: async (user) => {');
    lines.push('          if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL) {');
    lines.push('            // Attribuer le rôle super admin');
    lines.push('            await prisma.user.update({ where: { id: user.id }, data: { role: "admin" } })');
    lines.push('          } else {');
    lines.push('            // Vérifier si l\'email correspond à une invitation staff');
    lines.push('            const invitation = await prisma.invitation.findUnique({');
    lines.push('              where: { email: user.email, accepted: false, expiresAt: { gt: new Date() } },');
    lines.push('            })');
    lines.push('            if (invitation) {');
    lines.push('              await prisma.user.update({ where: { id: user.id }, data: { role: invitation.role } })');
    lines.push('              await prisma.invitation.update({ where: { id: invitation.id }, data: { accepted: true } })');
    lines.push('            }');
    if (hasEmail) {
      lines.push('            // Notifier l\'admin d\'une nouvelle inscription (hors staff invité)');
      lines.push('            if (!invitation && process.env.ADMIN_EMAIL) {');
      lines.push('              try {');
      lines.push('                await sendEmail({');
      lines.push(`                  to: process.env.ADMIN_EMAIL,`);
      lines.push(`                  subject: \`[${appName}] Nouvelle inscription — \${user.name || user.email}\`,`);
      lines.push('                  html: `<h2>Nouvelle inscription</h2><ul><li><strong>Nom</strong> : ${user.name || "Non renseigné"}</li><li><strong>Email</strong> : ${user.email}</li><li><strong>Date</strong> : ${new Date().toLocaleString("fr-FR")}</li></ul>`,');
      lines.push('                })');
      lines.push('              } catch {}');
      lines.push('            }');
    }
    lines.push('          }');
    lines.push('        },');
    lines.push('      },');
    lines.push('    },');
    lines.push('  },');
  }

  lines.push('})');
  lines.push('');

  const content = lines.join('\n');
  const dest = path.join(projectPath, 'lib/auth/config.ts');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content, 'utf-8');
}

/**
 * Retourne les variables de remplacement communes pour les variantes
 */
function replacementsForVariants(config) {
  const allLanguages = [
    ...(config.i18n?.defaultLanguage ? [config.i18n.defaultLanguage] : ['fr']),
    ...(config.i18n?.languages || []).filter(l => l !== config.i18n?.defaultLanguage),
  ];
  return {
    '{{PROJECT_NAME}}': config.projectName,
    '{{THEME}}': config.theme || 'system',
    '{{DEFAULT_LANGUAGE}}': config.i18n?.defaultLanguage || 'fr',
    '{{AVAILABLE_LANGUAGES}}': allLanguages.join(','),
  };
}

/**
 * Copie un fichier variant avec remplacement de variables
 */
function copyVariantFile(src, dest, replacements) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  let content = fs.readFileSync(src, 'utf-8');
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replaceAll(key, value);
  }
  fs.writeFileSync(dest, content, 'utf-8');
}

/**
 * Copie récursivement un dossier avec remplacement de variables dans chaque fichier
 */
function copyDirWithReplacements(srcDir, destDir, replacements) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirWithReplacements(srcPath, destPath, replacements);
    } else {
      copyVariantFile(srcPath, destPath, replacements);
    }
  }
}

/**
 * Copie les variantes conditionnelles selon la configuration
 */
function copyConditionalVariants(projectPath, config, replacements) {
  const variantsDir = path.join(__dirname, '../templates/variants');

  // Billing page si Stripe activé
  if (config.payments.enabled) {
    copyVariantFile(
      path.join(variantsDir, 'billing/billing-page.tsx'),
      path.join(projectPath, 'app/dashboard/billing/page.tsx'),
      replacements
    );
  }

  // Internationalisation (i18n) avec next-intl
  const hasI18n = config.i18n && config.i18n.languages && config.i18n.languages.length > 1;
  if (hasI18n) {
    const i18nDir = path.join(variantsDir, 'i18n');
    const allLanguages = [
      ...(config.i18n?.defaultLanguage ? [config.i18n.defaultLanguage] : ['fr']),
      ...(config.i18n?.languages || []).filter(l => l !== config.i18n?.defaultLanguage),
    ];
    const i18nReplacements = {
      ...replacements,
      '{{LOCALES_ARRAY}}': allLanguages.map(l => `'${l}'`).join(', '),
    };

    // Config next-intl
    copyVariantFile(path.join(i18nDir, 'i18n/routing.ts'), path.join(projectPath, 'i18n/routing.ts'), i18nReplacements);
    copyVariantFile(path.join(i18nDir, 'i18n/navigation.ts'), path.join(projectPath, 'i18n/navigation.ts'), i18nReplacements);
    copyVariantFile(path.join(i18nDir, 'i18n/request.ts'), path.join(projectPath, 'i18n/request.ts'), i18nReplacements);

    // Middleware i18n : proxy.ts dans le variant → middleware.ts dans le projet généré
    copyVariantFile(path.join(i18nDir, 'proxy.ts'), path.join(projectPath, 'middleware.ts'), i18nReplacements);

    // next.config.ts avec withNextIntl (remplace le shadcn-base)
    copyVariantFile(path.join(i18nDir, 'next.config.ts'), path.join(projectPath, 'next.config.ts'), i18nReplacements);

    // Composants navbar/footer avec i18n
    copyVariantFile(path.join(i18nDir, 'components/navbar.tsx'), path.join(projectPath, 'components/navbar.tsx'), i18nReplacements);
    copyVariantFile(path.join(i18nDir, 'components/navbar-client.tsx'), path.join(projectPath, 'components/navbar-client.tsx'), i18nReplacements);
    copyVariantFile(path.join(i18nDir, 'components/footer.tsx'), path.join(projectPath, 'components/footer.tsx'), i18nReplacements);

    // Pages publiques localisées (app/[locale]/...)
    const localeDir = path.join(i18nDir, 'app/[locale]');
    copyDirWithReplacements(localeDir, path.join(projectPath, 'app/[locale]'), i18nReplacements);

    // Fichiers de messages selon les langues configurées
    const availableMessages = ['fr', 'en', 'es', 'de'];
    for (const lang of allLanguages) {
      if (availableMessages.includes(lang)) {
        copyVariantFile(
          path.join(i18nDir, `messages/${lang}.json`),
          path.join(projectPath, `messages/${lang}.json`),
          i18nReplacements
        );
      }
    }
  }

  // Plus de pages /magic-link ou /otp séparées — la page /login gère tout selon loginMethod
}

function generateGitignore(projectPath) {
  const content = `# dependencies
node_modules
.pnp
.pnp.js
.yarn/install-state.gz

# testing
coverage

# next.js
.next/
out/
build
dist

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# prisma
prisma/dev.db
prisma/dev.db-journal

# claude
.claude/temp/
`;
  writeFile(path.join(projectPath, '.gitignore'), content);
}

function generateReadme(projectPath, config) {
  const hasDocker = config.database.type === 'docker' || (config.storage.enabled && config.storage.type === 'minio');
  const content = `# ${config.projectName}

Projet SAAS généré avec \`create-saas-sbk\`.

## Démarrage rapide

1. Installer les dépendances :
\`\`\`bash
npm install
\`\`\`

${hasDocker ? `2. Démarrer les services Docker :
\`\`\`bash
npm run docker:up
\`\`\`

` : ''}${hasDocker ? '3' : '2'}. Configurer la base de données :
\`\`\`bash
npm run db:push
\`\`\`

${hasDocker ? '4' : '3'}. Démarrer le serveur :
\`\`\`bash
npm run dev
\`\`\`

${hasDocker ? '5' : '4'}. Ouvrir [http://localhost:3000](http://localhost:3000)

## Documentation

Consultez \`.claude/README.md\` pour la documentation complète de la stack technique.
`;
  writeFile(path.join(projectPath, 'README.md'), content);
}
