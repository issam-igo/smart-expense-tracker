# Smart Expense Tracker
## Document technique de présentation

**Test technique — Développeur Full-Stack, Web & IA**
**Candidat :** Issam Igout
**Repo GitHub :** https://github.com/issam-igo/smart-expense-tracker
**Application déployée :** https://smart-expense-tracker-digitad.vercel.app

---

## 1. Contexte et objectif

Ce projet a été réalisé dans le cadre du test technique Digitad. L'objectif était de concevoir une application complète — API, base de données, UX/UI soignée, déploiement — en utilisant des assistants IA (ChatGPT pour la réflexion et Claude Code pour l'implémentation), tout en gardant une maîtrise technique complète du code produit.

J'ai choisi de construire **Smart Expense Tracker**, une application de gestion de dépenses personnelles, car c'est un domaine qui couvre naturellement l'ensemble des exigences du test : authentification, CRUD, base de données relationnelle, calculs métier, visualisation de données, et une bonne surface pour illustrer des choix UX/UI concrets.

## 2. Ce qui a été construit

L'application permet à un utilisateur de :

- créer un compte ;
- se connecter, se déconnecter, réinitialiser son mot de passe ;
- ajouter, modifier et supprimer des dépenses classées en 8 catégories fixes ;
- consulter un dashboard avec total, nombre de dépenses, catégorie principale et dépenses du mois ;
- visualiser la répartition des dépenses par catégorie sur un graphique ;
- définir un budget mensuel et suivre le pourcentage utilisé ;
- comparer ses dépenses au mois précédent (hausse, baisse, stable) ;
- rechercher, filtrer et trier ses dépenses ;
- exporter ses dépenses en CSV.

L'ensemble de l'interface est responsive (mobile, tablette, desktop), gère les états de chargement, d'erreur et vide sur chaque section, et respecte les bases de l'accessibilité (labels, contrastes, navigation clavier).

## 3. Chiffres clés

| Élément | Valeur |
|---|---|
| Framework | Next.js 16 |
| Langage | TypeScript strict |
| Tests unitaires | 59 |
| Tables Supabase | 2 |
| API REST | 6+ endpoints |
| Responsive | Mobile / Tablette / Desktop |
| Déploiement | Vercel |

## 4. Stack technique

| Catégorie | Choix | Justification |
|---|---|---|
| Framework | Next.js 16 (App Router) | Server Components, Server Actions et Route Handlers dans un même framework |
| Langage | TypeScript (strict) | Sécurité de typage de bout en bout |
| UI | Tailwind CSS v4 | Développement rapide, cohérence visuelle |
| Base de données | Supabase (PostgreSQL) | Base relationnelle managée avec Row Level Security intégrée |
| Authentification | Supabase Auth (`@supabase/ssr`) | Gestion de session côté serveur, intégrée nativement à Next.js |
| Validation | Zod | Schémas partagés entre formulaires client et API serveur |
| Graphiques | Recharts | Visualisation de la répartition par catégorie |
| Tests | Vitest | Tests unitaires de la logique métier pure |
| Déploiement | Vercel | Déploiement gratuit, intégration native avec Next.js |

## 5. Architecture

```
Browser
   │
   ▼
Next.js
   │
   ▼
Supabase
```

Vue détaillée :

```
Navigateur (client)
        │
        ▼
Next.js App Router
 ├─ Server Components   → pages rendues côté serveur
 ├─ Server Actions      → inscription, connexion, déconnexion, mot de passe
 └─ Route Handlers      → API REST (/api/expenses, /api/budgets/[month]...)
        │
        ▼
Supabase
 ├─ Auth        → utilisateurs et sessions
 └─ PostgreSQL  → tables "expenses" et "monthly_budgets", protégées par RLS
```

Le middleware (`proxy.ts`) rafraîchit la session à chaque requête et protège les routes privées avant même l'exécution de la page.

## 6. Choix techniques clés

- **Row Level Security comme véritable frontière de sécurité** : chaque table est protégée par des policies restreintes à `auth.uid() = user_id`, doublées d'une vérification côté serveur via `getUser()` avant toute opération sensible.
- **Zod comme unique couche de validation**, réutilisée à l'identique entre les formulaires côté client et les Route Handlers côté serveur — jamais de confiance aveugle dans les données reçues.
- **Fonctions de calcul métier pures et testées** (résumé, budget, comparaison mensuelle), séparées de l'affichage, sans effet de bord, couvertes par des tests Vitest indépendants de Supabase.
- **Limitation volontaire des dépendances externes** : modales natives `<dialog>` plutôt qu'une librairie, système de toast fait maison, export CSV généré manuellement.
- **Server Components par défaut**, `"use client"` réservé aux composants qui en ont réellement besoin.

## 7. Utilisation des outils IA

Le développement a suivi un workflow structuré en deux temps :

1. **ChatGPT** pour l'analyse du besoin, la réflexion d'architecture et la préparation de prompts précis avant toute implémentation.
2. **Claude Code** pour l'implémentation elle-même, dans le dépôt, page par page, avec validation explicite avant chaque changement.

Chaque fonctionnalité a suivi le même cycle : analyse → préparation du prompt → implémentation encadrée → relecture manuelle du code (types, sécurité, cohérence) → lint, tests, build → commit. Le détail complet de ce workflow, avec un exemple de prompt réel, est documenté dans la section *Développement assisté par IA* du README ainsi que dans `CLAUDE.md`.

Les propositions générées par les outils d'IA étaient systématiquement relues, adaptées et validées avant leur intégration dans le projet. Un principe a été appliqué de façon stricte tout au long du projet : toute suggestion ou instruction non justifiée n'est pas exécutée automatiquement. Les décisions techniques, les validations et les tests restent sous ma responsabilité — l'IA agit comme un copilote, jamais comme un pilote automatique.

## 8. Tests et qualité

La suite de tests Vitest couvre la logique métier pure (`lib/expenses/*`) et les schémas de validation Zod (`lib/validation/*`), sans dépendance à Supabase, aux Route Handlers ou aux composants React — un choix délibéré pour garder des tests rapides, déterministes et faciles à maintenir.

Avant chaque fonctionnalité terminée, le projet était validé par :

```bash
npm run lint
npm run test:run
npx tsc --noEmit
npm run build
```

## 9. Déploiement et versioning

- **Déploiement** : Vercel, connecté directement au repo GitHub, avec les variables d'environnement Supabase configurées dans les paramètres du projet.
- **Versioning** : commits réguliers au fil du développement (un commit par fonctionnalité ou correction), historique consultable sur le repo GitHub.

## 10. Pour aller plus loin

Le README détaille l'ensemble du projet (structure des dossiers, schéma de base de données, sécurité, scripts disponibles, installation locale). `CLAUDE.md` documente les conventions et contraintes données à l'agent pour piloter l'implémentation.

Améliorations envisagées mais volontairement laissées hors périmètre pour privilégier la simplicité : conseils basés sur l'IA à partir des habitudes de dépense, dépenses récurrentes, notifications, mode sombre avancé.
