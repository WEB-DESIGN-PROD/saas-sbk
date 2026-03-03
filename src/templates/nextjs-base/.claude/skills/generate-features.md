# /generate-features

Génère des fonctionnalités complètes et prêtes à l'emploi pour ce projet SaaS.

## Usage

```
/generate-features
```

Lance un workflow guidé pour identifier, planifier et implémenter de nouvelles fonctionnalités.

## Workflow

### 1. Exploration du projet
- Lire `CLAUDE.md` et `.claude/README.md` pour comprendre la configuration
- Analyser la structure existante (pages, API routes, composants, schéma Prisma)
- Identifier les patterns utilisés pour s'y conformer

### 2. Proposition de fonctionnalités
Proposer des fonctionnalités adaptées à la configuration du projet :

**Exemples génériques :**
- Tableau de bord analytics avec graphiques (chart.js / recharts)
- Notifications in-app (toasts + badge)
- Export de données (CSV, PDF)
- Recherche globale full-text
- Onboarding guidé (multi-étapes)
- Profil utilisateur étendu (avatar, bio)

**Si blog activé :**
- Système de commentaires (modéré ou libre)
- Newsletter avec opt-in
- Partage sur réseaux sociaux
- Table des matières auto-générée
- Articles liés / suggestions

**Si stockage activé :**
- Galerie médias avec filtres
- Recadrage d'image côté client
- Compression avant upload

**Si Stripe activé :**
- Page de facturation avec historique
- Changement de plan en self-service
- Portail client Stripe

### 3. Implémentation
Pour chaque fonctionnalité sélectionnée :
1. Mettre à jour `prisma/schema.prisma` si nécessaire
2. Créer/modifier les API routes
3. Créer les composants (Server + Client selon besoin)
4. Créer/modifier les pages
5. Mettre à jour les types TypeScript
6. Vérifier la cohérence avec l'auth et les rôles existants

### 4. Vérification
- Aucun `any` TypeScript non justifié
- Toutes les API routes vérifient la session
- Cohérence avec les patterns du projet
- Pas de dépendances superflues

## Règles importantes

- Respecter les patterns existants avant tout
- Utiliser les composants Shadcn déjà installés
- Utiliser les fonctions DAL (`verifySession`, `verifyAdmin`, etc.)
- Modifier `prisma/schema.prisma` et rappeler de lancer `npm run db:push`
- Ne pas introduire de nouvelles dépendances sans justification
