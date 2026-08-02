# CLAUDE.md — Règles de travail permanentes

Ce fichier définit mon comportement (Claude) sur ce projet, **quelle que soit la session**.
Il est lu en premier, à chaque démarrage.

---

## 1. DÉMARRAGE DE SESSION (obligatoire, dans cet ordre)

À l'ouverture de **toute** nouvelle session, avant de toucher à quoi que ce soit :

1. Lire `docs/projet.md` — comprendre le projet dans sa globalité
2. Lire `docs/todo.md` — savoir **où on en est exactement** (tâche courante, faites, restantes)
3. Lire `docs/lessons.md` — appliquer **toutes** les leçons déjà apprises
4. Lire `docs/design-pattern.md` — charte graphique et design system
5. Lire `docs/securite.md` — règles de sécurité à respecter

Si un de ces fichiers n'existe pas → **le créer avant de commencer**.

Ne jamais commencer à coder avant d'avoir fait cette lecture.

---

## 2. LES FICHIERS DU PROJET

| Fichier | Rôle |
|---|---|
| `CLAUDE.md` | Ce fichier. Comportement permanent de Claude. |
| `docs/projet.md` | Le projet expliqué de manière exhaustive : objectif, périmètre, fonctionnalités, stack, contraintes. |
| `docs/todo.md` | **Le chronogramme du projet.** Miroir de l'état réel. Plan étape par étape, dans le moindre détail. |
| `docs/lessons.md` | Journal des bugs : ce qui s'est mal passé, la cause racine, la règle pour ne plus le refaire. |
| `docs/design-pattern.md` | Charte graphique : couleurs, typographie, formes, espacements, composants, structures. |
| `docs/securite.md` | Règles de sécurité à appliquer strictement pour prévenir attaques et failles. |

---

## 3. `docs/todo.md` — LE FICHIER LE PLUS IMPORTANT

C'est le **chronogramme** du projet. À tout moment, en l'ouvrant, on doit savoir :
- où on en est **actuellement**
- quelle est la **tâche courante**
- quelles tâches sont **déjà terminées**
- ce qu'il **reste** à faire, dans l'ordre

Règles :
- **À chaque tâche effectuée ou évolution du projet, `docs/todo.md` est mis à jour.** Sans exception.
- Le plan est écrit **avant** l'implémentation, dans le moindre détail, étape par étape.
- Le plan évolue : on ajoute, on réorganise, on modifie si la stratégie change.
- Format des états :
  - `[ ]` à faire
  - `[~]` en cours (**tâche courante** — une seule à la fois)
  - `[x]` terminé **et vérifié**
  - `[!]` bloqué / problème (avec la raison)

### Règle de validation stricte
Une tâche n'est marquée `[x]` **que** si j'ai la **preuve** que ça fonctionne :
test lancé, log vérifié, comportement constaté.
**Sans preuve précise, je ne marque jamais terminé.** Je laisse `[~]` et je le dis.

---

## 4. WORKFLOW

### 4.1 Planifier d'abord
- Mode plan pour toute tâche non triviale (3 étapes ou plus).
- Le plan est écrit dans `docs/todo.md` avant d'implémenter.
- Si quelque chose ne va pas : **STOP et re-planifier**. Ne jamais forcer.

### 4.2 Sous-agents
- Utiliser des sous-agents pour garder le contexte principal propre.
- Une tâche par sous-agent.
- Investir plus de compute sur les problèmes difficiles.
- (Stratégie à affiner en cours de projet.)

### 4.3 Boucle d'auto-amélioration
- Je teste **mon propre code** systématiquement, et je corrige les erreurs trouvées avant de rendre.
- Après **toute** correction : mettre à jour `docs/lessons.md`.
- Format d'une leçon : `[date] | ce qui a mal tourné | cause racine | règle pour l'éviter`
- Les leçons sont relues à chaque démarrage de session.

### 4.4 Standard de vérification
- Ne jamais marquer terminé sans preuve que ça fonctionne.
- Lancer les tests, vérifier les logs, comparer le comportement attendu / obtenu.
- Se demander : « **Est-ce qu'un staff engineer validerait ça ?** »
- Rapporter honnêtement : si un test échoue, je le dis avec la sortie. Si une étape est sautée, je le dis.

### 4.5 Exiger l'élégance
- Changement non trivial → existe-t-il une solution plus élégante ?
- Un fix qui semble bricolé est reconstruit proprement.
- Ne pas sur-ingénieriser les choses simples.

### 4.6 Correction de bugs autonome
- Bug signalé → je le corrige directement.
- Aller dans les logs, trouver la **cause racine**, résoudre.
- Pas besoin d'être guidé étape par étape.
- Puis : `docs/lessons.md` mis à jour.

---

## 5. GIT / GITHUB

- **Ne jamais pousser un fichier sur GitHub sans autorisation explicite.**
- Ne jamais commit sans demande explicite.
- Messages de commit : **5 mots maximum**, sauf demande contraire expresse.

---

## 6. PRINCIPES FONDAMENTAUX

- **Simplicité d'abord** — toucher un minimum de code.
- **Pas de paresse** — causes racines uniquement, jamais de fix temporaire.
- **Ne jamais supposer** — vérifier chemins, APIs, variables, versions avant utilisation.
- **Demander une seule fois** — une question en amont si nécessaire, ne jamais interrompre en cours de tâche.
- **Sécurité par défaut** — appliquer `docs/securite.md` à chaque écriture de code.

---

## 7. GESTION DES TÂCHES (cycle)

1. **Planifier** → écrire dans `docs/todo.md`
2. **Vérifier** → confirmer le plan avant d'implémenter
3. **Suivre** → marquer l'avancement au fur et à mesure
4. **Expliquer** → résumé de haut niveau à chaque étape
5. **Apprendre** → `docs/lessons.md` après chaque correction

---

## 8. LANGUE

Toutes les communications et toute la documentation du projet sont en **français**.

---

## 9. APPRENTISSAGES

*(Section remplie par Claude au fil du temps — patterns récurrents, décisions structurantes, pièges propres à ce projet.)*

- *(vide pour l'instant)*
