# Guide de Développement

## 🚀 Démarrage Initial

### Première fois

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer PostgreSQL (Docker)
npm run docker:up

# 3. Créer les tables dans la base de données
npm run db:push

# 4. Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🔄 Workflow Quotidien

### Après redémarrage du PC

```bash
# 1. Redémarrer PostgreSQL (données CONSERVÉES ✅)
npm run docker:up

# 2. Lancer le serveur
npm run dev
```

**Pas besoin de refaire `db:push`** car :
- ✅ Les données PostgreSQL sont persistées dans un volume Docker
- ✅ Les tables existent déjà
- ✅ Le schéma n'a pas changé

### Vérifier que Docker fonctionne

```bash
# Voir les conteneurs actifs
docker ps

# Logs PostgreSQL
npm run docker:logs

# Arrêter les conteneurs
npm run docker:down
```

---

## 🗄️ Gestion de la Base de Données

### Commandes Prisma

| Commande | Usage | Quand l'utiliser |
|----------|-------|------------------|
| `npm run db:push` | Synchronise le schéma avec la DB (rapide) | **Développement** : changements du schéma |
| `npm run db:migrate` | Crée une migration versionnée | **Production** : déploiements |
| `npm run db:studio` | Interface graphique Prisma | Voir/éditer les données |
| `npm run db:generate` | Régénère le client Prisma | Après modification du schéma |

### ⚠️ Différence `db:push` vs `db:migrate`

#### `npm run db:push` (Développement)
- ✅ **Rapide** : synchronisation instantanée
- ✅ **Simple** : pas de fichiers de migration
- ⚠️ **Attention** : peut supprimer des données si le schéma change

**Utilisez pour :**
- Prototypage rapide
- Tests locaux
- Développement solo

#### `npm run db:migrate` (Production)
- ✅ **Sûr** : préserve les données
- ✅ **Versionné** : historique des changements
- ✅ **Collaboratif** : migrations partagées avec l'équipe
- ⚠️ **Plus lent** : génère des fichiers

**Utilisez pour :**
- Déploiements production
- Travail en équipe
- Changements critiques

---

## 🐳 Docker : Volumes et Persistance

### Où sont stockées les données ?

```bash
# Lister les volumes Docker
docker volume ls

# Inspecter le volume PostgreSQL
docker volume inspect <project-name>_postgres_data

# Voir l'emplacement des données
# Sur Mac : /var/lib/docker/volumes/<project>_postgres_data/_data
```

### ✅ Les données sont conservées quand vous :
- Redémarrez votre PC
- Faites `docker:down` puis `docker:up`
- Arrêtez/redémarrez les conteneurs

### ❌ Les données sont supprimées si vous :
```bash
# ATTENTION : Supprime TOUTES les données !
docker compose down -v  # Flag -v = supprime les volumes

# Ou manuellement
docker volume rm <project-name>_postgres_data
```

---

## 🔧 Scénarios Courants

### 1. J'ai modifié `schema.prisma`

```bash
# Option A : Développement (rapide)
npm run db:push

# Option B : Production (sûr)
npm run db:migrate
```

### 2. J'ai l'avertissement "will drop table"

Cela arrive quand :
- La table n'existe pas encore (normal la première fois)
- Vous avez changé une colonne de manière incompatible (ex: `String` → `Int`)

**Solutions :**
```bash
# Si c'est OK de perdre les données de test
npm run db:push

# Si vous voulez préserver les données
npm run db:migrate
```

### 3. Je veux repartir de zéro

```bash
# Arrêter et supprimer les volumes
docker compose down -v

# Recréer la DB
npm run docker:up
npm run db:push
```

### 4. PostgreSQL ne démarre pas

```bash
# Voir les logs
npm run docker:logs

# Redémarrer complètement
npm run docker:down
npm run docker:up

# Vérifier que le port 5432 n'est pas déjà utilisé
lsof -i :5432
```

---

## 📊 Prisma Studio (Interface Graphique)

```bash
# Lancer Prisma Studio
npm run db:studio
```

Ouvrez [http://localhost:5555](http://localhost:5555) pour :
- Voir les données en temps réel
- Éditer les enregistrements
- Créer/supprimer des données de test

---

## 🔐 Variables d'Environnement

### `.env`

```env
# Base de données (Docker)
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Auth
AUTH_SECRET="your-secret-key"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Autres services...
```

**Ne JAMAIS committer le fichier `.env` !**

---

## 🧪 Tests

```bash
# Lancer les tests
npm test

# Tests en mode watch
npm run test:watch

# Coverage
npm run test:coverage
```

---

## 🚢 Déploiement

### Avant de déployer

```bash
# 1. Créer une migration de production
npm run db:migrate

# 2. Tester le build
npm run build

# 3. Tester en production locale
npm start
```

### Déployer sur Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Lier une base de données distante
# Mettez à jour DATABASE_URL dans les variables d'environnement Vercel
```

---

## 📚 Ressources

- [Documentation Prisma](https://www.prisma.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://betterauth.dev/)
- [Docker Documentation](https://docs.docker.com/)

---

## ❓ Problèmes Courants

### Erreur: "Can't reach database server"

```bash
# Vérifier que PostgreSQL tourne
docker ps

# Redémarrer si nécessaire
npm run docker:up
```

### Erreur: "Module not found"

```bash
# Régénérer le client Prisma
npm run db:generate

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreur: "Port already in use"

```bash
# Trouver et tuer le processus sur le port 3000
lsof -ti :3000 | xargs kill -9

# Ou changer le port
PORT=3001 npm run dev
```

---

**Bon développement ! 🚀**
