# Guide d'intégration Better Auth

Ce guide vous aide à finaliser l'intégration Better Auth dans votre projet généré.

## 🚀 Configuration automatique

Votre projet a été généré avec Better Auth pré-configuré :

✅ Configuration serveur (`lib/auth/config.ts`)
✅ Client navigateur (`lib/auth/client.ts`)
✅ Routes API (`app/api/auth/[...all]/route.ts`)
✅ Schéma Prisma compatible
✅ Middleware de protection des routes

## 📝 Étape 1 : Base de données

### Appliquer le schéma Prisma

```bash
# Synchroniser le schéma avec la base de données
npm run db:push

# Ou créer une migration
npm run db:migrate
```

Le schéma inclut les tables nécessaires :
- `User` - Utilisateurs
- `Account` - Comptes liés (OAuth, email/password)
- `Session` - Sessions actives
- `VerificationToken` - Tokens de vérification

## 🔐 Étape 2 : Connexion des formulaires

### Page de connexion

Remplacez le TODO dans `app/login/page.tsx` :

```typescript
"use client"

import { signIn } from "@/lib/auth/client"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await signIn.email({
        email,
        password,
      })

      router.push("/dashboard")
    } catch (error) {
      setError("Email ou mot de passe incorrect")
    } finally {
      setIsLoading(false)
    }
  }

  // ... reste du composant
}
```

### Page d'inscription

Remplacez le TODO dans `app/register/page.tsx` :

```typescript
"use client"

import { signUp } from "@/lib/auth/client"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await signUp.email({
        email,
        password,
        name,
      })

      // Optionnel : Envoyer un email de bienvenue
      // await fetch("/api/email/welcome", {
      //   method: "POST",
      //   body: JSON.stringify({ email, name }),
      // })

      router.push("/dashboard")
    } catch (error) {
      setError("Erreur lors de l'inscription")
    } finally {
      setIsLoading(false)
    }
  }

  // ... reste du composant
}
```

## 🔒 Étape 3 : Protection des routes

### Middleware

Le middleware est déjà configuré dans `middleware.ts` mais vous devez activer la vérification de session :

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Récupérer le token de session
  const sessionToken = request.cookies.get('better-auth.session_token')?.value

  // Protéger les routes dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!sessionToken) {
      const url = new URL('/login', request.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
  }

  // Rediriger si déjà connecté
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (sessionToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}
```

### Layout Dashboard

Dans `app/dashboard/layout.tsx`, ajoutez la vérification côté serveur :

```typescript
import { auth } from "@/lib/auth/config"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  // ... reste du layout avec session.user disponible
}
```

## 👤 Étape 4 : Utiliser la session

### Côté serveur (Server Components)

```typescript
import { auth } from "@/lib/auth/config"
import { headers } from "next/headers"

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <div>
      <h1>Bienvenue {session?.user.name}</h1>
      <p>Email: {session?.user.email}</p>
    </div>
  )
}
```

### Côté client (Client Components)

```typescript
"use client"

import { useSession } from "@/lib/auth/client"

export default function ProfileComponent() {
  const { data: session, isLoading } = useSession()

  if (isLoading) return <div>Chargement...</div>

  return (
    <div>
      <h2>{session?.user.name}</h2>
      <p>{session?.user.email}</p>
    </div>
  )
}
```

## 🚪 Étape 5 : Déconnexion

Dans le layout ou un composant de navigation :

```typescript
"use client"

import { signOut } from "@/lib/auth/client"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <button onClick={handleLogout}>
      Déconnexion
    </button>
  )
}
```

## 🎨 Étape 6 : GitHub OAuth (optionnel)

Si vous avez activé GitHub OAuth :

### 1. Créer une OAuth App GitHub

1. Allez sur https://github.com/settings/developers
2. Cliquez sur "New OAuth App"
3. Remplissez :
   - **Application name**: Votre app
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copiez le Client ID et générez un Client Secret

### 2. Ajouter dans .env

```bash
GITHUB_CLIENT_ID=votre_client_id
GITHUB_CLIENT_SECRET=votre_client_secret
```

### 3. Activer dans lib/auth/config.ts

```typescript
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
})
```

### 4. Ajouter le bouton dans vos pages auth

Le composant `GitHubButton` a déjà été généré si vous avez sélectionné GitHub OAuth.

Importez-le dans `app/login/page.tsx` et `app/register/page.tsx` :

```typescript
import { GitHubButton } from "@/components/auth/github-button"

// Dans le JSX, après le formulaire :
<div className="relative">
  <div className="absolute inset-0 flex items-center">
    <span className="w-full border-t" />
  </div>
  <div className="relative flex justify-center text-xs uppercase">
    <span className="bg-background px-2 text-muted-foreground">
      Ou continuer avec
    </span>
  </div>
</div>

<GitHubButton />
```

## ✉️ Étape 7 : Emails (optionnel)

Si vous voulez envoyer des emails de bienvenue, vérification, etc. :

```typescript
// app/api/email/welcome/route.ts
import { sendWelcomeEmail } from "@/lib/email/templates"

export async function POST(req: Request) {
  const { email, name } = await req.json()

  try {
    await sendWelcomeEmail(
      email,
      name,
      process.env.APP_NAME || "Mon App"
    )

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: "Failed to send email" }, { status: 500 })
  }
}
```

Appelez cette route après l'inscription réussie.

## 🧪 Tester

1. Démarrer le serveur : `npm run dev`
2. Aller sur http://localhost:3000/register
3. Créer un compte
4. Vérifier la redirection vers `/dashboard`
5. Tester la déconnexion
6. Tester la connexion

## 🐛 Dépannage

### Erreur "Prisma Client not found"
```bash
npm run db:generate
```

### Erreur "Session not found"
Vérifiez que :
- La base de données est démarrée
- Le schéma Prisma est synchronisé
- `BETTER_AUTH_SECRET` est défini dans `.env`

### Redirection infinie
Vérifiez le middleware et les conditions de protection

## 📚 Ressources

- [Better Auth Documentation](https://betterauth.dev/)
- [Better Auth avec Prisma](https://betterauth.dev/docs/adapters/prisma)
- [Better Auth OAuth](https://betterauth.dev/docs/authentication/oauth)

---

Votre authentification est maintenant prête ! 🎉
