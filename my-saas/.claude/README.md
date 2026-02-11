# my-saas - Stack Technique

## Vue d'ensemble

Ce projet est un SaaS généré avec `create-saas-sbk`. Il utilise une stack moderne et complète pour démarrer rapidement.

## Configuration choisie

### Frontend & Backend
- **Next.js 16+** avec App Router
- **React 19** avec Server Components
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling
- **Shadcn UI** pour les composants

### Authentification
- **Better Auth** comme système d'authentification
- Méthodes activées: email, magiclink
- Magic Link (connexion par email)

### Base de données
- **PostgreSQL** comme base de données principale
- **Prisma** comme ORM
- PostgreSQL local via Docker Compose

### Emails
- **Resend** pour l'envoi d'emails
- API simple et moderne

### Internationalisation
- Langue par défaut: fr
- Langues supportées: fr, en

### Intelligence Artificielle pour utilisateurs finaux
- Providers: Claude (Anthropic)
- Prêt pour intégration de features IA pour vos utilisateurs

## Structure du projet

```
app/
├── page.tsx                    # Landing page publique
├── pricing/page.tsx            # Page tarifs
├── about/page.tsx              # Page à propos
├── login/page.tsx              # Connexion (formulaire complet)
├── register/page.tsx           # Inscription (formulaire complet)
├── api/auth/[...all]/route.ts  # API routes Better Auth
└── dashboard/                  # Zone protégée (auth requise)
    ├── layout.tsx              # Layout avec navigation et auth
    ├── page.tsx                # Dashboard home avec stats
    ├── settings/page.tsx       # Paramètres utilisateur
    ├── account/page.tsx        # Gestion compte et sécurité

components/
├── ui/                         # Composants Shadcn UI
│   ├── button.tsx
│   ├── input.tsx
│   ├── label.tsx
│   └── card.tsx
└── theme-provider.tsx          # Provider de thème

lib/
├── auth/
│   ├── config.ts               # Configuration Better Auth
│   └── client.ts               # Client auth côté navigateur
├── db/
│   └── client.ts               # Client Prisma
└── utils.ts                    # Utilitaires (cn helper)

prisma/
└── schema.prisma               # Schéma de base de données

public/                         # Assets statiques
```

## Commandes disponibles

### Développement
```bash
npm run dev          # Démarrer le serveur de développement
npm run build        # Build de production
npm run start        # Démarrer en production
npm run lint         # Linter le code
```

### Docker
```bash
npm run docker:up    # Démarrer les services Docker
npm run docker:down  # Arrêter les services Docker
npm run docker:logs  # Voir les logs
```

### Base de données
```bash
npm run db:push      # Synchroniser le schéma Prisma
npm run db:migrate   # Créer une migration
npm run db:studio    # Ouvrir Prisma Studio
npm run db:seed      # Seeder la base (si configuré)
```

## Démarrage rapide

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Démarrer les services Docker**
   ```bash
   npm run docker:up
   ```

3. **Configurer la base de données**
   ```bash
   npm run db:push
   ```

4. **Démarrer le serveur**
   ```bash
   npm run dev
   ```

5. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## Claude Code

Claude Code a été initialisé sur ce projet. Vous pouvez utiliser :

- `/generate-features` - Générer des fonctionnalités avec IA
- Agents spécialisés disponibles dans `.claude/agents/`

## Variables d'environnement

Toutes les variables sont configurées dans `.env`. Ne commitez jamais ce fichier !

## Documentation

- [Next.js](https://nextjs.org/docs)
- [Better Auth](https://betterauth.dev/)
- [Prisma](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com/)
- [Resend](https://resend.com/docs)

---

Projet généré avec ❤️ par create-saas-sbk