# 🗺️ Roadmap - create-saas-sbk

## ✅ v0.4.5 - 9 février 2026 (ACTUELLE)

### 🚀 Migration Next.js 16
- ✅ Migration de Next.js 15 vers Next.js 16.1.6
- ✅ Activation de Turbopack pour dev
- ✅ Migration React 19
- ✅ Nouveau template de dashboard moderne
- ✅ Correction de tous les composants (Slot.Root → Slot)
- ✅ Corrections CSS (webkit-scrollbar)

### 🎨 Amélioration UX du CLI
- ✅ Questions interactives v2 avec interface moderne
- ✅ Instructions en français pour chaque question
  - "💡 Flèches ↑↓ = naviguer • Entrée = valider"
  - "💡 Espace = cocher/décocher • a = tout cocher • i = inverser • Entrée = valider"
- ✅ Affichage des choix en temps réel dans le header
- ✅ Animation discrète avant le récapitulatif
- ✅ Logo persistant pendant toute la configuration
- ✅ Curseur caché pendant les animations
- ✅ Récapitulatif renommé : "📋 Récap' de votre SAAS"

### 🗄️ Nouvelles options de base de données
- ✅ PostgreSQL local Docker (existant)
- ✅ PostgreSQL distant (existant)
- ✅ **MongoDB local avec Docker** (nouveau)
- ✅ **MongoDB distant (Atlas, etc.)** (nouveau)
- ✅ **SQLite (fichier local)** (nouveau)
- ✅ **Ignorer pour l'instant** (nouveau)
  - Message d'avertissement clair
  - Confirmation obligatoire
  - Skip automatique de l'authentification
  - Possibilité de revenir en arrière

### ⚙️ Améliorations de configuration
- ✅ Email : option "Ignorer pour le moment" par défaut
- ✅ Langues supplémentaires : "Aucune" par défaut et en premier
- ✅ IA : Choix multiples possibles (plusieurs providers en même temps)
- ✅ IA : "Aucune" par défaut et en premier
- ✅ Base de données : "Ignorer" par défaut
- ✅ Alignement visuel des options sans emoji
- ✅ Emojis 🐳 pour Docker (PostgreSQL et MongoDB)
- ✅ Mot de passe PostgreSQL : valeur par défaut masquée

### 🐛 Corrections de bugs
- ✅ Correction compteur [11/10] → [11/11]
- ✅ Correction affichage "Base de données : Distant" → "Aucune" si ignorée
- ✅ Correction questions qui disparaissent avec les flèches
- ✅ Suppression ligne 82 de nextjs-generator.js (generatePrismaSchema)
- ✅ Gestion correcte du flag `skipAuth`
- ✅ Validation et sanitization des entrées utilisateur

### 📝 Documentation
- ✅ Fichier TODO.md créé avec toutes les tâches futures
- ✅ TODO : Migration vers @clack/prompts
- ✅ TODO : Templates multilingues complets
- ✅ TODO : Template sans système de connexion
- ✅ TODO : Configuration MongoDB et SQLite complète
- ✅ README.md mis à jour (Next.js 16+)

---

## 📋 Phase 1 - CLI Interactif (TERMINÉE ✅)

### ✅ Questions interactives
- ✅ 11 questions guidées avec validation
- ✅ Interface moderne et discrète
- ✅ Instructions en français
- ✅ Boucle de confirmation avec possibilité de recommencer
- ✅ Récapitulatif clair avant génération

### ✅ Génération automatique
- ✅ Structure Next.js 16+ complète
- ✅ Configuration Better Auth
- ✅ Schéma Prisma pré-configuré
- ✅ Docker Compose (PostgreSQL, MongoDB, MinIO)
- ✅ Variables d'environnement (.env)
- ✅ package.json avec toutes les dépendances
- ✅ README.md du projet généré
- ✅ Documentation Claude Code (.claude/)

### ✅ Installation automatique
- ✅ npm install automatique
- ✅ Installation des skills Claude Code adaptés
- ✅ Lancement optionnel de /init

---

## 🎯 Phase 2 - Templates Complets (EN COURS)

### 🏗️ Templates Next.js
- [ ] **Pages publiques complètes**
  - [ ] Landing page avec sections modernes
  - [ ] Page pricing avec plans Stripe
  - [ ] Page about/contact
  - [ ] Page features
  - [ ] Footer complet avec liens

- [ ] **Dashboard complet**
  - [x] Layout avec sidebar moderne
  - [x] Page d'accueil dashboard
  - [ ] Page analytics/stats
  - [ ] Page settings avancée
  - [ ] Page billing Stripe fonctionnelle
  - [ ] Page team/users
  - [ ] Page API keys

- [ ] **Authentification complète**
  - [x] Login avec Better Auth
  - [x] Register
  - [ ] Forgot password
  - [ ] Email verification
  - [ ] Magic Link fonctionnel
  - [ ] OAuth GitHub complet
  - [ ] OAuth Google (à ajouter)

### 🌍 Internationalisation
- [ ] Fichiers de traduction complets (fr, en, es, de)
- [ ] Configuration next-intl fonctionnelle
- [ ] Traduction de toutes les pages
- [ ] Sélecteur de langue dans l'interface

### 🗄️ Gestion des bases de données
- [ ] Templates Prisma pour PostgreSQL (existant)
- [ ] Templates Mongoose pour MongoDB
- [ ] Configuration SQLite complète
- [ ] Template sans base de données (authentification manuelle)

### 🎨 Composants réutilisables
- [ ] Bibliothèque de composants Shadcn UI étendue
- [ ] Composants métier (UserCard, PricingCard, etc.)
- [ ] Hooks personnalisés
- [ ] Utilitaires React

---

## 🚀 Phase 3 - Génération IA (À VENIR)

### 🤖 Commande /generate-features
- [ ] Analyse du projet existant
- [ ] Génération de features par IA
- [ ] Templates de features prêts à l'emploi
  - [ ] Blog avec CMS
  - [ ] E-commerce basique
  - [ ] CRM simple
  - [ ] Système de tickets
  - [ ] Chat en temps réel
  - [ ] Notifications push

### 👥 Agents spécialisés
- [ ] Agent développement
- [ ] Agent sécurité
- [ ] Agent SEO
- [ ] Agent performance
- [ ] Agent tests

---

## 🔮 Phase 4 - Écosystème (FUTUR)

### 🌐 Interface Web
- [ ] Configurateur web pour le CLI
- [ ] Prévisualisation en temps réel
- [ ] Export de configuration

### 🛍️ Marketplace
- [ ] Marketplace de features
- [ ] Templates communautaires
- [ ] Plugins tiers

### 🔌 Intégrations
- [ ] Vercel/Netlify deployment automatique
- [ ] GitHub Actions pré-configurées
- [ ] Monitoring (Sentry, LogRocket)
- [ ] Analytics (Plausible, Fathom)

---

## 📊 Métriques de progression

**Phase 1 :** 100% ✅ (CLI fonctionnel)
**Phase 2 :** 30% 🚧 (Templates de base + dashboard)
**Phase 3 :** 0% 📅 (Planifié)
**Phase 4 :** 0% 💭 (Vision)

---

## 🎯 Priorités immédiates

1. ✅ Migration Next.js 16 - **FAIT**
2. ✅ UX du CLI améliorée - **FAIT**
3. 🚧 Templates sans base de données
4. 🚧 Templates multilingues complets
5. 🚧 Configuration MongoDB/SQLite complète
6. 📅 Migration vers @clack/prompts
7. 📅 Landing page moderne
8. 📅 Dashboard analytics

---

Dernière mise à jour : 9 février 2026
