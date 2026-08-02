# TODO — LE TEST DES 90 JOURS

> **Chronogramme du projet.** Miroir de l'état réel.
> Mis à jour à **chaque** tâche effectuée. Une tâche n'est `[x]` qu'avec **preuve** que ça fonctionne.

**Légende :** `[ ]` à faire · `[~]` en cours (tâche courante) · `[x]` terminé et vérifié · `[!]` bloqué

---

## 📍 OÙ ON EN EST

| | |
|---|---|
| **Phase courante** | Phase 0 — Fondations ✅ **TERMINÉE** |
| **Tâche courante** | *(aucune — en attente de reprise)* |
| **Prochaine tâche** | 1.1 — Rédiger la charte dans `docs/design-pattern.md` *(fait)* → 2.1 Saisir les 18 questions |
| **Dernière mise à jour** | 2 août 2026 |
| **Prochain jalon** | Les 18 questions saisies et vérifiées mot à mot contre la spec |

---

## PHASE 0 — FONDATIONS

- [x] 0.1 Créer `CLAUDE.md` — règles de travail permanentes
- [x] 0.2 Lire et analyser la spécification complète (960 lignes)
- [x] 0.3 Créer `docs/projet.md` — projet exhaustif
- [x] 0.4 Créer `docs/todo.md` — ce fichier
- [x] 0.5 Créer `docs/lessons.md`, `docs/design-pattern.md`, `docs/securite.md`
- [x] 0.6 Scaffolding Vue 3 + Vite — Vue 3.5, Vite 8.2, Vue Router 5, Pinia 4, Vitest 4
- [x] 0.7 Installer et configurer TailwindCSS — v4.3 via `@tailwindcss/vite`, tokens dans `main.css`
- [x] 0.8 Configurer Vue Router en **mode history** — 4 routes : `/`, `/quiz`, `/resultat`, `/rapport`
- [x] 0.9 Configurer Pinia — installé et enregistré dans `main.js`
- [x] 0.10 Créer `.gitignore` — ⚠️ le fichier généré n'ignorait pas les `.env` → corrigé (voir `lessons.md` L1)
- [x] 0.11 Créer `.env.example` — front / serveur séparés, avertissement sur le préfixe `VITE_`
- [x] 0.12 Structure de dossiers `src/` — views, components/base, components/quiz, stores, data, lib, composables, assets
- [x] 0.13 Vérifier : `npm run dev` → **preuve : HTTP 200 sur localhost:5173, titre « Le Test des 90 Jours »**
- [x] 0.14 Vérifier : `npm run build` → **preuve : build en 293 ms, 37,6 Ko gzippés au total**
- [x] 0.15 Vérifier : `npm run lint` → **preuve : oxlint + eslint passent, zéro erreur**
- [x] 0.16 Vérifier : `npm audit` → **preuve : 0 vulnérabilité sur 378 paquets**
- [x] 0.17 Vérifier : le `.env` n'est pas versionnable → **preuve : `git ls-files` ne le contient pas ; seul `.env.example` est suivi**

### Preuves de la Phase 0

| Contrôle | Résultat |
|---|---|
| `npm run dev` | HTTP 200, titre correct |
| `npm run build` | 293 ms — vendor 84,95 Ko / 4 chunks de route ~0,35 Ko |
| **Poids total gzippé** | **37,6 Ko** — cible < 400 Ko ✅ |
| `npm run lint` | 0 erreur |
| `npm audit` | 0 vulnérabilité (378 paquets) |
| `.env` versionné ? | Non ✅ |

---

## PHASE 1 — DESIGN SYSTEM

- [x] 1.1 Rédiger `docs/design-pattern.md` — palette Encre/Laiton + 3 gris, échelle typo, composants, interdits
- [x] 1.2 Sélectionner les polices — **Lora** (serif, titres) + **Inter** (sans-serif, corps) — *proposition à valider*
- [x] 1.3 Configurer les tokens — dans `src/assets/main.css` (Tailwind 4 : `@theme`, plus de `tailwind.config.js`)
- [ ] 1.3b Charger réellement les fichiers de police en woff2, sous-ensemble latin (budget < 80 Ko)
- [ ] 1.4 Composant `BaseButton` — zones de tap larges (mobile)
- [ ] 1.5 Composant `BaseInput` + validation visuelle
- [ ] 1.6 Composant `BaseSelect` (pays, secteur…)
- [ ] 1.7 Composant `RadioCard` — une option de réponse
- [ ] 1.8 Composant `ProgressBar` — discret, en bas, fin, **sans pourcentage criard**
- [ ] 1.9 Composant `LayoutQuestion` — une question par écran
- [ ] 1.10 Vérifier le rendu mobile (320px → 1440px) → **preuve requise (captures)**
- [ ] 1.11 Contrôle : aucun emoji, aucune couleur criarde, aucune gamification

---

## PHASE 2 — DONNÉES DU QUESTIONNAIRE

- [ ] 2.1 Créer `src/data/questions.js` — les 18 questions, **libellés exacts de la spec §6**
- [ ] 2.2 Y intégrer pour chaque question : id, axe, sous-dimension, type (A–F), coefficient, 5 réponses × points
- [ ] 2.3 Créer `src/data/axes.js` — 3 axes, poids, 15 sous-dimensions
- [ ] 2.4 Créer `src/data/transitions.js` — les 3 écrans de transition (textes exacts)
- [ ] 2.5 Créer `src/data/profil.js` — champs Partie 1 et Partie 2, options
- [ ] 2.6 Créer `src/data/pays.js` — liste des pays + devise associée (FCFA / MAD / €)
- [ ] 2.7 Créer `src/data/secteurs.js`
- [ ] 2.8 **Contrôle qualité** : relire les 18 questions mot à mot contre la spec → **preuve requise**
- [ ] 2.9 Vérifier les maxima : Axe1 = 36, Axe2 = 32, Axe3 = 24 → **test automatisé**

---

## PHASE 3 — PARCOURS UTILISATEUR (front)

- [ ] 3.1 Route `/` — écran d'accueil (texte exact spec §16.2, mention des 8 ans)
- [ ] 3.2 Écran d'accueil : annonce explicite « pas de retour arrière »
- [ ] 3.3 Route `/quiz` — conteneur du parcours
- [ ] 3.4 Étape capture Partie 1 (obligatoire) : prénom, email pro, entreprise, pays
- [ ] 3.5 Validation email — format + rejet des domaines jetables
- [ ] 3.6 Écran de transition Section 1
- [ ] 3.7 Boucle des questions Q1 → Q7
- [ ] 3.8 Écran de transition Section 2
- [ ] 3.9 Boucle des questions Q8 → Q13
- [ ] 3.10 Écran de transition Section 3
- [ ] 3.11 Boucle des questions Q14 → Q18
- [ ] 3.12 Blocage du retour arrière (navigation + bouton navigateur)
- [ ] 3.13 Étape profil Partie 2 (facultatif) — 6 champs, possibilité de passer
- [ ] 3.14 Store Pinia — état du parcours, réponses, progression
- [ ] 3.15 Persistance locale (localStorage) pour reprise après coupure réseau
- [ ] 3.16 Localisation dynamique du montant Q2 selon le pays (3,3 M FCFA / MAD / 5 000 €)
- [ ] 3.17 Route `/resultat` — affichage du score
- [ ] 3.18 Tracking d'abandon par question (§18 des indicateurs)
- [ ] 3.19 Test du parcours complet de bout en bout → **preuve requise**

---

## PHASE 4 — MOTEUR DE SCORING

> ⚠️ Implémenté **côté serveur** (Edge Function). Une version JS partagée peut servir aux tests.

- [ ] 4.1 Fonction `calculerAxesBruts(reponses)` — les 3 formules pondérées
- [ ] 4.2 Fonction `normaliserAxes()` — A1, A2, A3 sur 100
- [ ] 4.3 Fonction `calculerIndice90()` — 0,40·A1 + 0,35·A2 + 0,25·A3, arrondi
- [ ] 4.4 Fonction `calculerJours()` — `arrondi(3 × e^(I/21))`, plafond 365
- [ ] 4.5 Fonction `scorerSousDimensions()` — les 15, normalisées sur 100
- [ ] 4.6 Fonction `identifierForces()` — top 3
- [ ] 4.7 Fonction `identifierFragilites()` — bottom 3
- [ ] 4.8 Fonction `identifierPointCritique()` — la plus faible, départage par coefficient
- [ ] 4.9 Fonction `determinerNiveau()` — les 5 paliers
- [ ] 4.10 Fonction `determinerArchetype()` — les 6 combinaisons, seuil 50
- [ ] 4.11 **Traiter les 2 combinaisons non couvertes** (faible/fort/fort et fort/faible/fort)
- [ ] 4.12 Fonction `detecterIncoherences()` — les 5 contrôles
- [ ] 4.13 Fonction `verifierProtocoleSecurite()` — `Q15=0 ET Q14=0 ET Q16≤1 ET Q13=0`
- [ ] 4.14 Fonction `routerCommercial()` — la matrice §15.1
- [ ] 4.15 Cas particulier : deux axes à égalité au seuil de 50
- [ ] 4.16 Cas particulier : A1 > 80 mais Q7 = 0
- [ ] 4.17 **Tests unitaires** — vérifier la table §9.2 (score 10 → 5 j, 50 → 32 j, 100 → 365 j…)
- [ ] 4.18 **Tests unitaires** — les 6 archétypes, chacun avec un jeu de réponses
- [ ] 4.19 **Tests unitaires** — les 5 incohérences
- [ ] 4.20 **Tests unitaires** — protocole de sécurité (déclenché / non déclenché)
- [ ] 4.21 Test des bornes : tout à 0 → Indice 0 ; tout à 4 → Indice 100 → **preuve requise**

---

## PHASE 5 — SUPABASE

- [ ] 5.1 Connexion MCP au compte Supabase (token à fournir par l'utilisateur)
- [ ] 5.2 Créer le projet Supabase
- [ ] 5.3 Table `reponses` — id, session_id, réponses (jsonb), horodatage
- [ ] 5.4 Table `contacts` — prénom, email, entreprise, pays, profil (jsonb)
- [ ] 5.5 Table `resultats` — indice90, A1, A2, A3, jours, niveau, archétype, incohérences, protocole
- [ ] 5.6 Table `evenements` — tracking d'abandon par question
- [ ] 5.7 Politiques RLS — **aucune lecture publique**, insertion contrôlée
- [ ] 5.8 Index sur email, session_id, date
- [ ] 5.9 Client Supabase côté front (`src/lib/supabase.js`)
- [ ] 5.10 Sauvegarde progressive des réponses (reprise de session)
- [ ] 5.11 Vérifier RLS : tentative de lecture non autorisée → doit échouer → **preuve requise**

---

## PHASE 6 — CONTENU RÉDACTIONNEL

> Rédigé par Claude, dans des fichiers séparés et éditables. **À faire valider par le manager.**

- [ ] 6.1 Les 5 descriptions de niveau (déjà dans la spec — à intégrer)
- [ ] 6.2 Les 6 verdicts d'archétype — **150 mots chacun, sans conseil ni vente**
- [ ] 6.3 Les 15 sous-dimensions × 3 lignes de lecture (page 3)
- [ ] 6.4 Les 15 sous-dimensions en version « force » : ce que ça a permis + **le risque que cette force crée**
- [ ] 6.5 Les 15 sous-dimensions en version « fragilité » : description, conséquence 12–24 mois, premier levier
- [ ] 6.6 Les 15 textes de « point critique » — pourquoi celle-là et pas une autre
- [ ] 6.7 Les 9 blocs du scénario de rupture (matrice §13.2)
- [ ] 6.8 Les 3 actions gratuites de la page 8, déclinées par archétype
- [ ] 6.9 L'encadré du protocole de sécurité (texte exact dans la spec §14.2)
- [ ] 6.10 Les 5 messages d'incohérence (textes exacts dans la spec §11.1)
- [ ] 6.11 **Relecture** : aucun adjectif dramatique, aucune faillite, aucun reproche, aucune moralisation
- [ ] 6.12 Soumettre au manager pour validation → **bloquant avant mise en ligne**

---

## PHASE 7 — RAPPORT PDF

- [ ] 7.1 Choisir la librairie PDF compatible Deno / Edge Function
- [ ] 7.2 Gabarit A4, charte graphique appliquée
- [ ] 7.3 Page 1 — couverture (Indice en très grand, jours, une phrase, rien d'autre)
- [ ] 7.4 Page 2 — verdict (niveau + archétype + 150 mots) **+ encadré sécurité si actif**
- [ ] 7.5 Page 3 — 3 jauges linéaires + radar à 3 branches
- [ ] 7.6 Page 3 — comportement benchmark par phase (§17 — **aucune comparaison sous 200 répondants**)
- [ ] 7.7 Page 4 — les trois forces
- [ ] 7.8 Page 5 — les trois fragilités
- [ ] 7.9 Page 6 — le point critique
- [ ] 7.10 Page 7 — scénario de rupture généré **+ suppression si protocole actif**
- [ ] 7.11 Page 8 — 3 actions + orientation commerciale en bas de page
- [ ] 7.12 Nommage `Indice90_[Nom]_[Date].pdf`
- [ ] 7.13 Signature par un nom et une fonction réels (à obtenir du manager)
- [ ] 7.14 Version web consultable du rapport (route dédiée, accès par token)
- [ ] 7.15 Vérifier la règle de proportion : 7 pages d'analyse / 0,5 page de vente
- [ ] 7.16 Générer 6 PDF de test (un par archétype) + 1 avec protocole actif → **preuve requise**

---

## PHASE 8 — EMAIL

- [ ] 8.1 Créer le compte Resend, obtenir la clé API
- [ ] 8.2 Vérifier le domaine (DNS : SPF, DKIM, DMARC) — **dépend de l'achat du nom de domaine**
- [ ] 8.3 Edge Function `envoyer-rapport`
- [ ] 8.4 Gabarit email d'envoi du rapport — sobre, **aucune vente** (règle J0)
- [ ] 8.5 Pièce jointe PDF
- [ ] 8.6 Gestion des erreurs + file de réessai
- [ ] 8.7 Cas protocole de sécurité : **un seul email de suivi non commercial**, pas de séquence
- [ ] 8.8 Vérifier le délai < 60 secondes → **preuve requise**
- [ ] 8.9 Test de délivrabilité (Gmail, Outlook, Yahoo) — vérifier l'absence de spam

---

## PHASE 9 — SÉCURITÉ & CONFORMITÉ

- [ ] 9.1 Rédiger `docs/securite.md`
- [ ] 9.2 Validation et assainissement de toutes les entrées (front + serveur)
- [ ] 9.3 Rate limiting sur les Edge Functions
- [ ] 9.4 Anti-bot sur la soumission (honeypot ou équivalent léger)
- [ ] 9.5 Vérifier qu'aucune clé secrète n'est exposée côté client
- [ ] 9.6 Vérifier que le barème n'est **pas** lisible dans le bundle JS
- [ ] 9.7 En-têtes de sécurité (CSP, HSTS, X-Frame-Options)
- [ ] 9.8 Mentions RGPD / consentement — données de santé mentale = **catégorie sensible**
- [ ] 9.9 Politique de confidentialité (texte à valider)
- [ ] 9.10 Chiffrement au repos des réponses de l'Axe 3
- [ ] 9.11 Audit : tentative de manipulation du score → doit échouer → **preuve requise**

---

## PHASE 10 — PERFORMANCE & DÉPLOIEMENT

- [ ] 10.1 Mesurer le poids de la page — **cible < 400 Ko**
- [ ] 10.2 Optimiser les polices (sous-ensemble de caractères, woff2)
- [ ] 10.3 Découpage du bundle (code splitting) par route
- [ ] 10.4 Test Lighthouse mobile — **cible : chargement < 2 s en 3G**
- [ ] 10.5 Configurer les redirections SPA (URLs propres, pas de `.html`)
- [ ] 10.6 Variables d'environnement en production
- [ ] 10.7 Déploiement de préproduction
- [ ] 10.8 Recette complète sur préproduction → **preuve requise**
- [ ] 10.9 Achat et branchement du nom de domaine *(décision manager)*
- [ ] 10.10 Mise en production — **sur autorisation explicite uniquement**

---

## ❓ QUESTIONS OUVERTES — À REMONTER AU MANAGER

Ces points ne bloquent pas le démarrage (valeurs par défaut codées de manière configurable),
mais doivent être tranchés **avant la mise en ligne**.

| # | Question | Défaut appliqué | Bloquant pour |
|---|---|---|---|
| 1 | 18 questions ou version courte à 12 ? | 18 | Phase 2 si changement |
| 2 | Validation des noms « Test des 90 Jours » / « Indice 90 » ? | Validés | Phase 7 |
| 3 | Q12 (trésorerie familiale) : conserver / adoucir / réserver au payant ? | Conservée | Phase 2 |
| 4 | Exclusion compensations et addictions confirmée ? | Exclues | — |
| 5 | Version croisée avec le bras droit : v1 ou v2 ? | v2 | Périmètre |
| 6 | Seuil d'éligibilité : 300 M FCFA + 10 collaborateurs, ou abaissé ? | Maintenu, paramétrable | Phase 4 |
| 7 | Nom et fonction pour la signature du rapport ? | — | **Phase 7 — bloquant** |
| 8 | Nom de domaine choisi et acheté ? | — | **Phase 8 — bloquant** |
| 9 | Archétypes : que faire des 2 combinaisons non nommées ? | À définir | Phase 4 |
| 10 | Liste exacte des pays et des secteurs ? | Liste par défaut | Phase 2 |

---

## 📋 JOURNAL DES ÉVOLUTIONS

| Date | Évolution |
|---|---|
| 2 août 2026 | Création de `CLAUDE.md`, `docs/projet.md`, `docs/todo.md`. Spécification lue intégralement (960 lignes). Arbitrages capture (WhatsApp) et contenu rédactionnel validés. |
| 2 août 2026 | Création de `docs/lessons.md`, `docs/design-pattern.md`, `docs/securite.md`. |
| 2 août 2026 | **Phase 0 terminée.** Environnement installé et vérifié : Vue 3.5 + Vite 8.2 + Router 5 (history) + Pinia 4 + Vitest 4 + Tailwind 4.3 + Supabase JS. Build à 37,6 Ko gzippés. 0 vulnérabilité. |
| 2 août 2026 | 3 leçons consignées : `.gitignore` sans protection des `.env` (L1), `manualChunks` incompatible Rolldown (L2), test de sécurité mal écrit (L3). |
