# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Vue d'ensemble du projet

**saas-sbk** est un installateur CLI npm qui génère des projets SaaS Next.js 15+ complets et clés en main. Le CLI pose des questions interactives pour configurer automatiquement l'authentification, la base de données, les paiements, l'IA, les emails, le stockage médias, et l'internationalisation.

### Commande d'installation finale visée
```bash
npm create saas-sbk@latest
```

## Architecture technique

### Stack du CLI
- **Node.js** avec modules ESM
- **inquirer** ou **enquirer** pour les prompts interactifs
- **chalk** pour la coloration des messages
- **ora** pour les spinners de progression
- **listr2** (optionnel) pour les barres de progression avancées

### Stack du projet généré
- **Next.js 15+** (App Router)
- **Better Auth** pour l'authentification (email/password, OAuth GitHub, MagicLink)
- **Prisma** + **PostgreSQL** (Docker ou distant)
- **Stripe** pour les paiements (mode test)
- **Resend** ou SMTP personnalisé pour les emails
- **AWS S3** ou **MinIO** (Docker) pour le stockage médias
- **Shadcn UI** + **Tailwind CSS** pour l'interface
- Internationalisation multilingue
- Intégration IA (Claude/Gemini/ChatGPT selon choix)

## Structure du projet généré

```
saas-sbk-project/
├── app/
│   ├── page.tsx                    # Landing page publique
│   ├── pricing/page.tsx            # Page pricing
│   ├── about/page.tsx              # Page à propos
│   ├── login/page.tsx              # Login
│   ├── register/page.tsx           # Inscription
│   └── dashboard/                  # Zone protégée (auth requise)
│       ├── layout.tsx              # Layout vérifiant session
│       ├── page.tsx                # Dashboard home
│       ├── settings/page.tsx       # Paramètres utilisateur
│       ├── account/page.tsx        # Gestion compte
│       └── billing/page.tsx        # Facturation Stripe
├── .claude/
│   ├── README.md                   # Description stack pour Claude Code
│   ├── agents/                     # Agents spécialisés (dev, perf, sécurité, SEO)
│   └── skills/                     # Skills installés
├── docker-compose.yml              # Postgres + MinIO si configuré
├── .env                            # Variables d'environnement générées
├── package.json
└── README.md
```

## Flux de travail du CLI

1. **Questions interactives** : thème, base de données, auth, stockage médias, email, paiements, i18n, IA, Claude Code
2. **Validation stricte** de toutes les entrées utilisateur (regex, longueur, format)
3. **Génération dynamique** des fichiers `.env`, `docker-compose.yml`, `.claude/README.md`
4. **Copie des templates** Next.js (pages publiques + dashboard protégé)
5. **Installation automatique des skills** Claude Code adaptés à la stack choisie
6. **Lancement de `/init`** sur le projet si Claude Code CLI est installé
7. **Message final** invitant à lancer `npm run dev` et à utiliser `/generate-features` (v2 future)

## Principes de sécurité CRITIQUES

- **TOUJOURS** valider les entrées utilisateur avec regex strictes
- **JAMAIS** d'`eval` ni de concaténation de commandes shell non sécurisées
- Utiliser `execSync` ou `spawn` avec tableaux d'arguments (pas de strings)
- Échapper et nettoyer les chaînes avant écriture dans `.env`, YAML
- Masquer les mots de passe dans le terminal (`type: 'password'`)
- Gestion robuste des erreurs avec messages clairs

### Exemple de validation sécurisée
```js
{
  type: 'input',
  name: 'projectName',
  message: 'Nom du projet',
  validate: input => {
    if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
      return 'Le nom du projet ne doit contenir que des lettres, chiffres, tirets ou underscores.';
    }
    return true;
  }
}
```

## Modules npm essentiels

- `inquirer` ou `enquirer` - Prompts interactifs
- `chalk` - Couleurs dans la console
- `ora` - Spinners de progression
- `child_process` (execSync/spawn) - Lancer des commandes shell
- `fs` - Écrire des fichiers système
- `path` - Manipuler les chemins de fichiers

## Commandes importantes (projet généré)

- `npm run dev` - Démarrer le serveur de développement
- `db:start` - Démarrer PostgreSQL via Docker
- `claude:init` - Initialiser Claude Code sur le projet
- `claude:generate-features` - (v2 future) Génération IA de fonctionnalités

## Génération de fichiers dynamiques

### Exemple `.env`
```js
const envContent = `
POSTGRES_USER=${answers.dbUser}
POSTGRES_PASSWORD=${answers.dbPassword}
THEME=${answers.theme}
STRIPE_SECRET_KEY=${answers.stripeKey}
RESEND_API_KEY=${answers.resendKey}
`;
fs.writeFileSync(path.join(projectPath, '.env'), envContent);
```

### Exemple `docker-compose.yml`
```js
function generateDockerCompose(user, password) {
  return `
version: '3.8'

services:
  postgres:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: ${user}
      POSTGRES_PASSWORD: ${password}
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  pgdata:
`;
}
```

### Exemple `.claude/README.md`
Ce fichier doit décrire la stack complète, les choix de configuration, et les commandes disponibles pour que Claude Code soit immédiatement opérationnel sur le projet généré.

## Installation automatique des skills

```js
const skills = ['nextjs', 'better-auth', 'prisma', 'stripe', 'resend'];
skills.forEach(skill => {
  execSync(`npx skills add ${skill}`, { stdio: 'inherit' });
});
```

Adapter cette liste en fonction des choix utilisateur lors de la configuration.

## UX et messages

- Utiliser **chalk** pour colorer les messages (succès en vert, erreurs en rouge, info en bleu)
- Utiliser **ora** pour afficher des spinners pendant les opérations longues
- Afficher un récapitulatif final clair avant génération, permettre modification
- Messages motivants et pédagogiques tout au long du CLI
- Message final clair invitant à lancer le projet et mentionner `/generate-features` pour v2

## Roadmap

### Phase 1 (actuelle) - CLI d'installation
- CLI interactif complet
- Génération projet Next.js clé en main fonctionnel dès le démarrage
- Installation automatique des skills
- Lancement automatique de `/init` sur le projet

### Phase 2 (future) - Génération IA avancée
- Commande `/generate-features` dans Claude Code
- Agents spécialisés (dev, sécurité, SEO, perf) implémentant en parallèle
- Suivi et itérations automatiques

## Ressources

- [Next.js App Router](https://nextjs.org/docs/app/building-your-application/routing)
- [Better Auth](https://betterauth.dev/)
- [Prisma](https://www.prisma.io/docs/)
- [Stripe API](https://stripe.com/docs/api)
- [Resend](https://resend.com/docs)
- [Skills.sh](https://skills.sh)
- [Claude Code docs](https://claude.ai/docs/cli)
- [Docker Compose](https://docs.docker.com/compose/)
