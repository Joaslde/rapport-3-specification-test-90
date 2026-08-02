# Le Test des 90 Jours

Instrument de diagnostic de la dépendance au dirigeant.
Produit d'acquisition n°1 du cabinet.

> **Combien de temps votre entreprise fonctionnerait-elle sans vous ?**

18 questions, ~7 minutes. Produit un score (l'**Indice 90**), une traduction en jours
d'autonomie, et un rapport PDF de 8 pages envoyé par email.

---

## Documentation

Avant toute intervention sur le code, lire dans cet ordre :

| Fichier | Contenu |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Règles de travail permanentes |
| [docs/projet.md](docs/projet.md) | Le projet en détail |
| [docs/todo.md](docs/todo.md) | **Où en est le projet** — chronogramme |
| [docs/lessons.md](docs/lessons.md) | Bugs rencontrés et règles à appliquer |
| [docs/design-pattern.md](docs/design-pattern.md) | Charte graphique |
| [docs/securite.md](docs/securite.md) | Règles de sécurité |

Spécification d'origine : [rapport-3-specification-test-90-jours.md](rapport-3-specification-test-90-jours.md)

---

## Stack

| Couche | Technologie |
|---|---|
| Front | Vue 3.5 (Composition API) + Vite 8 |
| Routing | Vue Router 5 — mode history |
| État | Pinia 4 |
| CSS | Tailwind 4 |
| Backend | Supabase (PostgreSQL + Edge Functions) |
| Email | Resend |
| Tests | Vitest 4 |

---

## Démarrage

```sh
npm install
cp .env.example .env      # puis renseigner les valeurs
npm run dev
```

## Commandes

```sh
npm run dev         # serveur de développement
npm run build       # build de production
npm run preview     # prévisualiser le build
npm run test:unit   # tests unitaires
npm run lint        # oxlint + eslint
npm run format      # prettier
```

---

## Contraintes non négociables

- **Poids de page < 400 Ko** — 80 % des accès viennent d'un mobile en 3G
- **Aucune URL en `.html`** — un seul mot-clé collé
- **Scoring côté serveur uniquement** — le barème ne doit jamais atteindre le navigateur
- **Aucune gamification** — pas d'emoji, pas de couleur criarde, pas de compteur animé
- **Aucun benchmark inventé** — sous 200 répondants, aucune comparaison affichée
- **Le protocole de sécurité prime sur tout affichage commercial**
