# Guide de Déploiement

Ce guide vous aide à déployer votre projet SaaS en production.

## 🚀 Options de déploiement

### Option 1 : Vercel (Recommandé)

Vercel est la plateforme optimale pour Next.js.

#### Prérequis
- Compte Vercel (gratuit)
- Base de données PostgreSQL distante (Neon, Supabase, Railway)

#### Étapes

1. **Préparer la base de données**

```bash
# Si vous utilisez Neon.tech (gratuit)
# Créer un compte sur https://neon.tech
# Créer un nouveau projet
# Copier l'URL de connexion

# Mettre à jour .env.production
DATABASE_URL="postgresql://user:pass@host.neon.tech/db?sslmode=require"
```

2. **Push le code sur GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

3. **Déployer sur Vercel**

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Suivre les instructions
# Ajouter les variables d'environnement
```

Ou via l'interface web :
1. Aller sur https://vercel.com
2. Cliquer sur "New Project"
3. Importer votre repository GitHub
4. Ajouter les variables d'environnement
5. Déployer

#### Variables d'environnement Vercel

Ajouter dans les settings Vercel :

```
NODE_ENV=production
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=votre_secret_32_chars
BETTER_AUTH_URL=https://votre-app.vercel.app
NEXT_PUBLIC_APP_URL=https://votre-app.vercel.app

# Si GitHub OAuth
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Si Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Si Resend
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@votredomaine.com

# Si S3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_BUCKET=votre-bucket

# Si IA
ANTHROPIC_API_KEY=...  # ou OPENAI_API_KEY ou GOOGLE_API_KEY
```

4. **Configurer le domaine personnalisé** (optionnel)

Settings → Domains → Add Domain

---

### Option 2 : Railway

Railway offre une excellente expérience avec PostgreSQL inclus.

#### Étapes

1. **Créer un compte sur Railway** : https://railway.app

2. **Créer un nouveau projet**

```bash
# Installer Railway CLI
npm i -g @railway/cli

# Login
railway login

# Lier le projet
railway init

# Déployer
railway up
```

3. **Ajouter PostgreSQL**

Dans le dashboard Railway :
- Cliquer sur "New" → "Database" → "PostgreSQL"
- La variable `DATABASE_URL` est automatiquement ajoutée

4. **Ajouter les autres variables d'environnement**

Dans Variables :
```
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}
# ... autres variables
```

5. **Configurer le build**

Railway détecte automatiquement Next.js.

Settings → Build Command : `npm run build`
Settings → Start Command : `npm start`

---

### Option 3 : Docker + VPS

Pour un contrôle total.

#### Dockerfile

Créer `Dockerfile` à la racine :

```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

#### docker-compose.production.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/db
      BETTER_AUTH_SECRET: your_secret
      BETTER_AUTH_URL: https://votredomaine.com
      # ... autres variables
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: db
    volumes:
      - postgres_data:/var/lib/postgresql/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - app

volumes:
  postgres_data:
```

#### Déploiement

```bash
# Sur votre VPS
docker-compose -f docker-compose.production.yml up -d

# Migrations
docker-compose exec app npx prisma migrate deploy
```

---

## 🔐 Sécurité en production

### 1. Variables d'environnement

❌ **JAMAIS** commiter `.env` dans Git
✅ Utiliser les secrets de la plateforme (Vercel, Railway, etc.)

### 2. HTTPS obligatoire

- Vercel : Automatique ✅
- Railway : Automatique ✅
- VPS : Configurer Let's Encrypt avec Certbot

### 3. Générer des secrets forts

```bash
# Pour BETTER_AUTH_SECRET
openssl rand -base64 32
```

### 4. Configurer CORS

Dans `next.config.js` :

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_APP_URL },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
        ],
      },
    ]
  },
}
```

### 5. Rate limiting

Considérer Upstash Rate Limit ou similaire pour les API routes.

---

## 📊 Monitoring

### Vercel Analytics

Déjà inclus dans Vercel Pro.

### Sentry (Erreurs)

```bash
npm install @sentry/nextjs

# Initialiser
npx @sentry/wizard@latest -i nextjs
```

### Logging

Utiliser un service comme :
- Logtail
- Axiom
- Better Stack

---

## 🗄️ Base de données

### Options recommandées

1. **Neon** (https://neon.tech)
   - Gratuit pour débuter
   - PostgreSQL serverless
   - Branching pour les preview deployments

2. **Supabase** (https://supabase.com)
   - PostgreSQL + Auth + Storage
   - Gratuit pour débuter

3. **Railway** (https://railway.app)
   - Intégration facile
   - $5/mois pour débuter

4. **PlanetScale** (https://planetscale.com)
   - MySQL (nécessite ajustements Prisma)

### Migrations en production

```bash
# Générer une migration
npm run db:migrate

# En production (automatiquement ou via CI/CD)
npx prisma migrate deploy
```

---

## 📦 Stockage de fichiers

### Pour S3 en production

1. Créer un bucket S3
2. Configurer les permissions IAM
3. Activer CORS
4. Ajouter les credentials dans les variables d'environnement

### Pour MinIO en production

Déployer MinIO sur un VPS séparé ou utiliser un service managé.

---

## 💳 Stripe en production

1. **Passer en mode Live**
   - Activer votre compte Stripe
   - Obtenir les clés Live
   - Configurer les webhooks

2. **Webhooks**

URL : `https://votre-domaine.com/api/webhooks/stripe`

Events à écouter :
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

3. **Tester les webhooks**

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## ✉️ Emails en production

### Resend

1. Vérifier votre domaine
2. Configurer SPF, DKIM, DMARC
3. Utiliser la clé API Live

### SMTP personnalisé

Utiliser un service comme :
- SendGrid
- Mailgun
- Amazon SES

---

## 🔄 CI/CD

### GitHub Actions

Créer `.github/workflows/deploy.yml` :

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - run: npm test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📈 Performance

### Next.js optimizations

Déjà configuré :
- Image optimization
- Font optimization
- Static generation où possible

### CDN

Vercel et Railway incluent un CDN global.

---

## 🧪 Testing avant production

```bash
# Build de production local
npm run build
npm start

# Tester
curl http://localhost:3000
```

---

## 📋 Checklist de déploiement

- [ ] Variables d'environnement configurées
- [ ] Base de données distante configurée
- [ ] Migrations appliquées
- [ ] HTTPS activé
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] Webhooks Stripe configurés (si applicable)
- [ ] Domaine email vérifié (si applicable)
- [ ] Monitoring configuré
- [ ] Backups base de données configurés
- [ ] Rate limiting activé
- [ ] Tests en production effectués

---

## 🆘 Aide

En cas de problème :

1. Vérifier les logs de la plateforme
2. Vérifier les variables d'environnement
3. Tester localement avec `NODE_ENV=production`
4. Consulter la documentation de la plateforme

---

Votre application est maintenant prête pour la production ! 🚀
