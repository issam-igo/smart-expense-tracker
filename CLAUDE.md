# Smart Expense Tracker

## Contexte

Développer une application web moderne de gestion de dépenses personnelles.

L'objectif est de produire une application simple, robuste, maintenable, sécurisée et prête à être déployée en production.

La priorité est la qualité du code, la simplicité de l'architecture et une excellente expérience utilisateur.

---

# Stack technique

## Framework

- Next.js (App Router)

## Langage

- TypeScript (Strict Mode)

## UI

- Tailwind CSS

## Base de données

- Supabase PostgreSQL

## Authentification

- Supabase Auth

## Validation

- Zod

## Graphiques

- Recharts

## Icônes

- Lucide React

## Déploiement

- Vercel

---

# Fonctionnalités obligatoires

## Authentification

L'application doit permettre :

- Création de compte
- Connexion
- Déconnexion
- Gestion de session
- Protection des pages privées
- Redirection automatique selon l'état de connexion

Chaque utilisateur doit accéder uniquement à ses propres données.

---

## Gestion des dépenses

L'utilisateur peut :

- Ajouter une dépense
- Modifier une dépense
- Supprimer une dépense
- Consulter la liste de ses dépenses

---

## Catégories

Catégories fixes :

- Food
- Transport
- Housing
- Shopping
- Entertainment
- Health
- Education
- Other

---

## Dashboard

Afficher :

- Total des dépenses
- Nombre de dépenses
- Catégorie principale
- Dépenses du mois

---

## Graphique

Afficher un graphique représentant les dépenses par catégorie.

---

## UX

Toujours prévoir :

- Loading State
- Error State
- Empty State

L'application doit être entièrement responsive.

---

# Fonctionnalités optionnelles

Uniquement si le projet principal est terminé.

- Conseils IA
- Export CSV
- Recherche
- Filtre par catégorie

---

# Hors périmètre

Ne pas implémenter sans validation :

- Notifications
- Dépenses récurrentes
- Paiements
- Upload de fichiers
- Temps réel
- Gestion des rôles
- Administration
- Mode sombre avancé

Toujours privilégier la simplicité.

---

# Modèle de données

## Expense

- id
- userId
- title
- amount
- category
- expenseDate
- description
- createdAt

---

# Sécurité

Toutes les dépenses appartiennent à un utilisateur.

Chaque utilisateur peut uniquement :

- lire ses dépenses
- créer ses dépenses
- modifier ses dépenses
- supprimer ses dépenses

Utiliser Row Level Security de Supabase.

Ne jamais exposer la clé service_role côté client.

Toujours vérifier les permissions avant les opérations sensibles.

---

# Architecture

Respecter une architecture simple.

```
app/
components/
lib/
types/
utils/
```

Créer uniquement les dossiers réellement nécessaires.

Éviter toute abstraction prématurée.

---

# Développement

Toujours privilégier :

- simplicité
- lisibilité
- maintenabilité
- composants réutilisables
- faible couplage

Éviter les optimisations prématurées.

---

# TypeScript

Obligatoire :

- strict mode
- aucun any
- interfaces explicites
- types réutilisables

Toujours préférer un typage fort.

---

# Next.js

Utiliser :

- App Router
- Server Components par défaut

Utiliser "use client" uniquement lorsqu'un composant nécessite :

- useState
- useEffect
- événements utilisateur
- hooks React

---

# Validation

Utiliser Zod pour :

- les formulaires
- les payloads API

Toutes les données utilisateur doivent être validées.

---

# Accessibilité

Respecter systématiquement :

- HTML sémantique
- labels associés aux formulaires
- navigation clavier
- contraste suffisant
- aria-label lorsque nécessaire

---

# Responsive

L'application doit fonctionner sur :

- Mobile
- Tablette
- Desktop

---

# Dépendances

Avant d'installer une bibliothèque :

- vérifier si Next.js fournit déjà une solution
- expliquer pourquoi la dépendance est nécessaire

Éviter les dépendances inutiles.

---

# Git

Ne jamais exécuter automatiquement :

- git commit
- git push
- git merge
- git rebase

Avant chaque commit :

1. Résumer les changements
2. Lister les fichiers modifiés
3. Proposer un message Conventional Commit
4. Attendre la validation

---

# Qualité

Avant de terminer une fonctionnalité :

Exécuter :

- npm run lint

Puis :

- npm run build

Corriger toutes les erreurs avant de continuer.

---

# Méthode de travail

Avant toute modification :

1. Comprendre la demande
2. Proposer un plan d'implémentation
3. Identifier les fichiers concernés
4. Attendre la validation

Après les modifications :

- résumer les changements
- expliquer les choix techniques
- proposer les tests à effectuer

---

# Bonnes pratiques

Toujours :

- utiliser des noms explicites
- supprimer le code mort
- supprimer les imports inutiles
- éviter la duplication
- utiliser des constantes plutôt que des valeurs magiques
- gérer explicitement les erreurs

Ne jamais ajouter une fonctionnalité qui n'a pas été demandée.

---

# Objectif

Le résultat attendu est une application :

- simple
- propre
- cohérente
- facilement maintenable
- sécurisée
- prête à être déployée

En cas de doute entre plusieurs solutions, toujours choisir la plus simple, la plus lisible et la plus facile à maintenir.