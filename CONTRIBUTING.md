# Guide de contribution

Merci de votre intérêt pour contribuer à `create-saas-sbk` ! 🎉

## Structure du projet

```
saas-sbk/
├── bin/                        # Point d'entrée CLI
├── src/
│   ├── core/                   # Logique centrale
│   │   ├── questions.js        # Questions interactives
│   │   ├── validation.js       # Validations
│   │   ├── config-builder.js   # Construction config
│   │   └── summary.js          # Récapitulatif
│   ├── generators/             # Générateurs de fichiers
│   │   ├── env-generator.js
│   │   ├── docker-generator.js
│   │   ├── claude-generator.js
│   │   ├── package-generator.js
│   │   └── nextjs-generator.js
│   ├── installers/             # Installers
│   │   ├── dependencies.js
│   │   ├── skills.js
│   │   └── claude-init.js
│   ├── utils/                  # Utilitaires
│   │   ├── logger.js
│   │   ├── spinner.js
│   │   ├── command-runner.js
│   │   └── file-utils.js
│   ├── templates/              # Templates Next.js
│   │   ├── nextjs-base/
│   │   └── variants/
│   └── index.js                # Orchestrateur
├── package.json
└── README.md
```

## Développement local

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
git clone <repo-url>
cd saas-sbk
npm install
```

### Tester le CLI
```bash
npm run dev
```

### Structure des commits
Nous utilisons les conventions Conventional Commits :

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage
- `refactor:` Refactoring
- `test:` Tests
- `chore:` Tâches de maintenance

Exemples :
```
feat: ajout support PostgreSQL distant
fix: validation email incorrecte
docs: mise à jour README avec exemples
```

## Types de contributions

### 1. Ajouter un nouveau template

Pour ajouter un template Next.js :

1. Créer le fichier dans `src/templates/nextjs-base/` ou `src/templates/variants/`
2. Utiliser les variables `{{VAR_NAME}}` pour le templating
3. Mettre à jour `nextjs-generator.js` si nécessaire
4. Tester la génération

### 2. Ajouter une nouvelle question

Pour ajouter une question de configuration :

1. Ajouter la question dans `src/core/questions.js`
2. Ajouter la validation dans `src/core/validation.js`
3. Mettre à jour `buildConfig()` dans `config-builder.js`
4. Mettre à jour les générateurs concernés
5. Mettre à jour le récapitulatif dans `summary.js`

### 3. Ajouter un nouveau provider

Pour ajouter un provider (email, storage, IA) :

1. Ajouter l'option dans `questions.js`
2. Ajouter les dépendances dans `package-generator.js`
3. Ajouter les variables d'environnement dans `env-generator.js`
4. Créer les templates nécessaires
5. Documenter dans `.claude/README.md`

### 4. Améliorer la sécurité

Les contributions de sécurité sont hautement prioritaires :

1. Auditer les validations
2. Vérifier les sanitizations
3. Tester les injections
4. Documenter les risques

### 5. Améliorer l'UX

Pour améliorer l'expérience utilisateur :

1. Messages plus clairs
2. Meilleurs spinners/progressions
3. Gestion d'erreurs plus explicite
4. Aide contextuelle

## Règles de code

### Sécurité (CRITIQUE)
- ✅ TOUJOURS valider les entrées utilisateur
- ✅ TOUJOURS utiliser des regex strictes
- ✅ TOUJOURS sanitizer avant écriture
- ❌ JAMAIS d'eval ou d'exécution de code non sécurisé
- ❌ JAMAIS de concaténation shell dangereuse
- ✅ TOUJOURS utiliser spawn/execSync avec tableaux

### Style de code
- Utiliser ESM (import/export)
- Préférer async/await à Promise
- Documenter les fonctions complexes
- Nommer les variables de manière descriptive
- Garder les fonctions courtes et focalisées

### Messages utilisateur
- Utiliser `logger` pour tous les messages
- Colorer avec chalk de manière cohérente
- Être concis et clair
- Fournir des actions concrètes en cas d'erreur

## Tests

### Tester manuellement
```bash
# Dans un dossier temporaire
cd /tmp
node /path/to/saas-sbk/bin/create-saas-sbk.js

# Suivre les questions
# Vérifier que le projet se génère
cd mon-saas
npm run dev
```

### Tests unitaires (à venir)
```bash
npm test
```

## Workflow de contribution

> ⚠️ **La branche `main` est protégée. Tout push direct est interdit. Une Pull Request est obligatoire.**

### Règles de protection de `main`

- **Aucun push direct** sur `main` n'est autorisé pour les contributeurs externes
- **Une PR est requise** et doit être approuvée par [@WEB-DESIGN-PROD](https://github.com/WEB-DESIGN-PROD) (CODEOWNERS) avant tout merge
- **Le CI doit passer** — le workflow `ci.yml` vérifie l'installation des dépendances et le build à chaque PR
- **Assignation automatique** — @WEB-DESIGN-PROD est automatiquement demandé en reviewer sur chaque PR via CODEOWNERS

### Étapes

1. **Fork** le repository (contributeurs externes) ou **créer une branche** (collaborateurs)
2. **Nommer la branche** selon la convention :
   - `feature/nom-de-la-feature`
   - `fix/description-du-bug`
   - `docs/mise-a-jour-docs`
   - `refactor/nom-du-refactor`
3. **Développer** avec des commits atomiques suivant les conventions
4. **Tester** localement (`npm run dev`, génération d'un projet test)
5. **Push** : `git push origin feature/ma-feature`
6. **Ouvrir une Pull Request** vers `main` en utilisant le template fourni
7. **Attendre la review** de @WEB-DESIGN-PROD et que le CI soit vert
8. **Adresser les retours** si des modifications sont demandées

### CI GitHub Actions

À chaque PR vers `main`, le workflow `.github/workflows/ci.yml` s'exécute automatiquement :

- Installation des dépendances (`npm ci`)
- Vérification du build (`npm run build`)

La PR ne peut pas être mergée si le CI échoue.

### Templates disponibles

Pour créer une issue, plusieurs templates sont à disposition :

| Template | Usage |
|---|---|
| `Bug Report` | Bug dans le CLI lui-même |
| `SaaS Bug Report` | Bug dans un projet généré par saas-sbk |
| `Feature Request` | Proposition de nouvelle fonctionnalité |
| `Docker Issue` | Problème lié au Docker Compose généré |
| `Integration Request` | Demande d'intégration d'un nouveau service |
| `Support Request` | Question ou aide à l'utilisation |
| `Security` | Vulnérabilité de sécurité (traitement prioritaire) |

## Checklist PR

Avant de soumettre une PR, vérifier que le template est bien rempli et que :

- [ ] Le code compile sans erreur (`npm run build`)
- [ ] Le CLI a été testé localement
- [ ] Les tests passent (si applicables)
- [ ] La documentation est à jour (CHANGELOG, README si besoin)
- [ ] Les messages de commit suivent les conventions Conventional Commits
- [ ] Le code suit les règles de style
- [ ] Les validations de sécurité sont en place
- [ ] Aucun secret ou credential ajouté dans le code

## Roadmap & Priorités

### Priorité Haute
1. Compléter les templates Next.js (pages, composants)
2. Configuration Better Auth complète
3. Tests end-to-end

### Priorité Moyenne
1. Support de plus de providers (Supabase, Vercel Postgres)
2. Templates de features (blog, e-commerce)
3. Mode wizard avec preview

### Priorité Basse
1. Interface web pour configuration
2. Marketplace de features
3. Mode offline

## Questions ?

- Ouvrir une issue GitHub
- Consulter la documentation dans `/docs`
- Lire `STATUS.md` pour l'état actuel

## Licence

En contribuant, vous acceptez que votre code soit sous licence MIT.

---

Merci de contribuer à `create-saas-sbk` ! 🚀
