# Politique de sécurité

## Versions supportées

| Version | Support sécurité |
|---------|-----------------|
| 0.6.x   | ✅ Supportée    |
| 0.5.x   | ✅ Supportée    |
| < 0.5   | ❌ Non supportée |

## Signaler une vulnérabilité

**Ne pas créer d'issue publique pour signaler une faille de sécurité.**

Si vous découvrez une vulnérabilité dans `create-saas-sbk` (CLI ou templates générés), merci de la signaler de manière responsable :

1. **Ouvrir une issue privée** via [GitHub Security Advisories](https://github.com/WEB-DESIGN-PROD/saas-sbk/security/advisories/new)
2. **Ou contacter directement** [@WEB-DESIGN-PROD](https://github.com/WEB-DESIGN-PROD) sur GitHub

### Informations à inclure

- Description claire de la vulnérabilité
- Étapes pour reproduire le problème
- Impact potentiel (exécution de code, fuite de données, etc.)
- Version de `create-saas-sbk` concernée
- Environnement (OS, Node.js version)

## Ce qui constitue une vulnérabilité

### Dans le CLI (`create-saas-sbk`)

- Injection de commandes shell via les entrées utilisateur
- Écriture de fichiers en dehors du répertoire cible
- Fuite de secrets/credentials dans les logs ou fichiers générés
- Dépendance npm compromise (supply chain)

### Dans les projets générés (templates)

- Failles dans la configuration Better Auth
- Variables d'environnement exposées côté client
- Routes API non protégées par authentification
- Injection SQL via Prisma
- XSS dans les composants React
- CORS mal configuré

## Délai de réponse

| Étape | Délai |
|-------|-------|
| Accusé de réception | 48 heures |
| Évaluation initiale | 5 jours ouvrés |
| Correction et publication | Selon la criticité |

## Divulgation responsable

Nous demandons un délai raisonnable pour corriger la vulnérabilité avant toute divulgation publique. En contrepartie, nous nous engageons à :

- Vous tenir informé de l'avancement
- Mentionner votre contribution dans le CHANGELOG (si vous le souhaitez)
- Ne pas engager de poursuites pour la découverte et le signalement responsable

## Bonnes pratiques pour les projets générés

Les projets générés par `create-saas-sbk` suivent ces principes de sécurité :

- **Variables d'environnement** — Aucun secret dans le code, tout dans `.env` (jamais commité)
- **Validation des entrées** — Toutes les entrées utilisateur validées côté serveur
- **Authentification** — Routes dashboard protégées par middleware Better Auth
- **Prisma** — Requêtes paramétrées, pas de concaténation SQL
- **Headers HTTP** — CSP, HSTS et headers de sécurité configurés par Next.js

## Attribution

Les chercheurs en sécurité ayant signalé des vulnérabilités de manière responsable seront mentionnés ici (avec leur accord).
