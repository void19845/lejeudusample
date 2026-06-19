# Le Jeu du Sample

Application web de blind test asynchrone pour le compte Instagram **@lejeudusample**.
Chaque jour : un sample posté en story (10h) → les joueurs devinent titre + artiste de l'original via l'app → validation admin et révélation (20h).

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Supabase** (PostgreSQL + RLS)
- **Vercel** (hébergement)

## Setup

### 1. Variables d'environnement

Copier `.env.local.example` → `.env.local` et remplir :

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSWORD=...
```

Les clés Supabase se trouvent dans **Project Settings → API** de ton projet Supabase.
`ADMIN_PASSWORD` est un mot de passe simple de ton choix pour protéger `/admin`.

### 2. Base de données

Dans le **SQL Editor** de Supabase, exécuter le contenu de `supabase-schema.sql`.
Ça crée les tables `questions`, `submissions`, `config`, la vue `scoreboard_view`, et les policies RLS.

### 3. Installation

```bash
npm install
npm run dev
```

L'app tourne sur `http://localhost:3000`.

### 4. Déploiement Vercel

```bash
vercel
```

Penser à renseigner les 4 variables d'environnement dans les **Project Settings** de Vercel (elles ne sont pas lues depuis `.env.local` en prod).

## Structure du projet

```
app/
  page.tsx                    → page principale joueur (jeu + scoreboard)
  scoreboard/page.tsx         → classement complet
  historique/page.tsx         → épisodes passés
  admin/page.tsx              → interface admin (saisie + validation)
  api/
    submit/                   → soumission d'une réponse joueur
    scoreboard/                → lecture du classement
    historique/                → lecture des épisodes passés
    admin/question/            → CRUD question du jour (protégé)
    admin/validate/            → calcul des scores (protégé)
    admin/scoreboard-period/   → config période du classement (protégé)

components/
  game/                       → composants spécifiques au jeu (Vinyl, Timer, formulaires...)
  ui/                         → composants génériques (BottomNav)

lib/
  scoring.ts                  → normalisation + Levenshtein + calcul des points
  utils.ts                    → pseudo localStorage, dates, timer
  supabase-client.ts          → client Supabase (browser, clé anon)
  supabase-admin.ts           → client Supabase (serveur, service role)

types/index.ts                → types partagés (Question, Submission, ScoreRow)

supabase-schema.sql           → schéma complet à exécuter dans Supabase
```

## Logique de scoring

Voir `lib/scoring.ts`. Résumé :

| Cas | Points |
|---|---|
| Participation (toute soumission) | 0,25 pt |
| Titre seul correct | +1 pt |
| Artiste seul correct | +0,5 pt |
| Titre + Artiste corrects | +1 pt |
| Bonus 1er (titre + artiste corrects, premier à soumettre) | +0,5 pt |

La comparaison ignore casse, accents, espaces et ponctuation, avec une tolérance Levenshtein proportionnelle (~20%, plafonnée à 3 caractères d'écart).

## Points encore ouverts (voir specs)

- Unicité du pseudo (actuellement non bloquée en base)
- Notifications (email/push à la validation)
- Rotation automatique de la période du scoreboard (actuellement géré manuellement via `/api/admin/scoreboard-period`)
