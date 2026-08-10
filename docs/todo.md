# TODO — LE TEST DES 90 JOURS

> **Chronogramme du projet.** Miroir de l'état réel.
> Mis à jour à **chaque** tâche effectuée. Une tâche n'est `[x]` qu'avec **preuve** que ça fonctionne.

**Légende :** `[ ]` à faire · `[~]` en cours (tâche courante) · `[x]` terminé et vérifié · `[!]` bloqué

---

## 📍 OÙ ON EN EST

| | |
|---|---|
| **Phases terminées** | Phase 0 ✅ · 2 ✅ · 3 ✅ · 4 ✅ · 5 ✅ · 6 ✅ · 7 ✅ · 8 ✅ · 9bis ✅ · 9ter ✅ |
| **Tâche courante** | *(aucune — en attente de reprise)* |
| **Prochaine tâche** | Recette manuelle par l'utilisateur → voir **§ PARCOURS DE TEST** en bas |
| **Dernière mise à jour** | 6 août 2026 |
| **⚙️ Moteur de calcul** | ✅ **Corrigé selon la note d'audit du 3 août 2026** — 11 défauts traités, 101 valeurs de référence testées (voir § AUDIT ci-dessous) |
| **✍️ Signature du rapport** | ✅ **B1 définitivement clos** — Charbel ZOHOUN, Directeur, Cabinet Le Quart. Précision du manager le 6 août : « signer » = désigner et authentifier la personne, pas une image manuscrite. Filigrane « document provisoire » retiré. |
| **Prochain jalon** | Déploiement Vercel (Phase 10) |
| **Chaîne complète** | ✅ **Fonctionne de bout en bout** : parcours → score → PDF → email |
| **Supabase** | ✅ Projet `TEST DES 90 JOURS` — 4 tables, RLS testée, Edge Function déployée |
| **Parcours** | ✅ Jouable de bout en bout : accueil → capture → 18 écrans → profil → score |
| **Back-office** | ✅ `/admin` — récapitulatif de tous les tests + détail par profil, protégé par mot de passe |
| **🔴 RGPD** | **NON FAIT — bloquant.** Aucune case de consentement, aucune politique de confidentialité. Détail en Phase 9 (§9.8-9.9). |

---

## 📞 RETOUR ORAL DU MANAGER — 6 août 2026

Après relecture des PDF d'exemple envoyés. Validation générale : *« la présentation est
simple, comme je souhaite, c'est clair, c'est bien. »*

- [x] **R.1** Signature réelle intégrée — Charbel ZOHOUN, Directeur, Cabinet Le Quart
      → *Preuve : `SIGNATURE` dans `contenu-suite.js`, 222 tests toujours au vert, 8 PDF
      d'exemple régénérés avec la vraie signature.*
- [x] **R.2** Nom de l'entreprise du répondant — confirmé déjà présent en page 1 du PDF
      depuis le début du projet, aucune action nécessaire.
- [x] **R.3** Signature graphique — **abandonnée, sans objet.** Précision du manager :
      « signer » signifiait désigner et authentifier la personne responsable, pas apposer une
      image manuscrite ou numérique — ce rapport n'est pas un contrat. Filigrane
      « document provisoire » retiré du PDF (couverture et page 8).
      → *Preuve : `SIGNATURE.provisoire = false`, test PDF vérifie l'absence du mot
      « provisoire » et la présence de « Charbel ZOHOUN », 222 tests au vert.*
- [!] **R.4** Logo du cabinet — **bloqué**, pas encore prêt côté cabinet. Emplacements
      proposés (en-tête + couverture PDF) dans `docs/a-remonter-au-manager.md`, section
      B1ter. Intégration rapide dès réception.
- [!] **R.5** Lien de prise de rendez-vous en page 8 — **bloqué**, en attente de l'URL de
      réservation. Emplacement technique déjà identifié (`rendreSuite()` dans
      `pdf-rapport.js`). Intégration rapide dès réception.
- [ ] **R.6** Site internet du cabinet — le manager y travaille le week-end du 8-9 août,
      transmettra le plan pour retour avant développement.

---

## 🔧 AUDIT DU CABINET — CORRECTIONS DU MOTEUR (5 août 2026)

> Source : `rapport-10-audit-correction-test-90-jours.md` (note du 3 août 2026) +
> `fixture-indice90.xlsx` (101 valeurs de référence).
> **Cette note prévaut sur les sections 9, 10 et 14 de la spécification.**

Le cabinet a confirmé mes 5 constats et en a trouvé 6 autres, dont 3 auraient produit des
résultats faux en production.

- [x] **A.1** Formule recalibrée `3 × (365/3)^(I/100)` — remplace `3 × e^(I/21)`
      → *Preuve : les 101 valeurs du fixture reproduites exactement, 0 écart.*
- [x] **A.2** Arrondi commercial `floor(x+0,5)` sur l'Indice, les axes et les jours
      → *Preuve : test `arrondiCommercial(0.5) === 1`, `(2.5) === 3`.*
- [x] **A.3** Indice arrondi **avant** niveau/jours/archétype (défaut critique n°6)
      → *Preuve : `calculerJours()` lève une erreur sur un décimal ; les 101 Indices tombent chacun dans un niveau.*
- [x] **A.4** Clause « plafonné à 365 » supprimée — code mort, jamais atteignable
      → *Preuve : Indice 0 → 3 jours, Indice 100 → 365 jours exactement.*
- [x] **A.5** Seuil axe : FORT si score arrondi ≥ 50 (le cas 50,0 était non tranché)
      → *Preuve : test du cas « 12 points bruts sur 24 = 50,0 exactement ».*
- [x] **A.6** Archétypes 7 et 8 implémentés — plus aucun rattachement par défaut
      → *Preuve : les 8 combinaisons produisent 8 numéros distincts, `provisoire` absent partout.*
- [x] **A.7** Protocole de détresse : décompte de signaux (≥3 ET Q15≤1)
      → *Preuve : taux de déclenchement mesuré 0,32 % → 14,08 % sur les 625 combinaisons.*
- [x] **A.8** Textes définitifs des archétypes 7 et 8 + 3 actions chacun (page 8)
      → *Preuve : `ACTIONS_PAR_ARCHETYPE` compte 8 entrées de 3 actions.*
- [x] **A.9** Mention « Indice 90 ≠ 90 jours, seuil franchi à l'Indice 71 » (audit §5.4)
      → *Preuve : présente sur l'écran de résultat et en page 3 du PDF.*
- [x] **A.10** Jeu de référence versionné en `tests/fixtures/fixture-indice90.csv`
      → *Preuve : chargé et testé automatiquement — contrôle n°1 du protocole de recette.*
- [x] **A.11** 8 exemplaires de PDF régénérés (un par archétype réel)
      → *Preuve : `exemplaires-pdf/01-…` à `08-…`, aucun suffixe « provisoire ».*

**Résultat : 222 tests passent** (122 avant l'audit — les 101 valeurs de référence sont
désormais verrouillées).

### Reste en attente d'information du cabinet

- [!] **A.12** Tranches CA/effectif révisées (180 M / 6 au lieu de 300 M / 10)
      → *Bloqué : les tranches du formulaire n'ont pas de borne à 180 M ni à 6 personnes.
      Nécessite la spécification finale du 2 août, que nous n'avons pas reçue.*
- [ ] **A.13** Module **Regard Croisé** — 18 questions miroir, invitations, Indice d'Écart,
      rapport comparatif de 6 pages. Le manager le veut **séparé** du parcours principal,
      comme second point de contact commercial. Fonctionnalité entière, à cadrer.
- [ ] **A.14** Journalisation des accès au back-office + cloisonnement des profils marqués
      « vigilance » (audit §12 — données personnelles sensibles).

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
- [x] 1.3b **Charger réellement les polices** — ⚠️ Lora et Inter étaient déclarées dans les tokens mais **jamais chargées** : le site tombait sur Georgia / system-ui. C'était la première cause du rendu « générique ». Corrigé via Google Fonts + `preconnect` + `display=swap`, graisses limitées (Lora 500/600, Inter 400/500). CSP `vercel.json` mise à jour en conséquence.

### ✨ PASSE PREMIUM — 4 août 2026

**Demande utilisateur :** *« quelque chose de premium […] sans porter atteinte à la charte graphique »*.
Direction retenue après consultation du skill `ui-ux-pro-max` (styles « Editorial Grid / Magazine »
et « Minimalist Monochrome ») : **la typographie porte le premium, pas la couleur**.

**Charte strictement préservée** — aucune couleur ajoutée, toujours Encre + Laiton + 3 gris,
aucun dégradé, aucune ombre décorative, aucune animation (spec §16.3, exigence manager).

- [x] P.1 Polices réellement chargées (voir 1.3b) — l'écart le plus visible
- [x] P.2 `font-feature-settings` : ligatures et crénage activés (`kern`, `liga`, `calt`)
- [x] P.3 **Chiffres tabulaires** (`tabular-nums`) sur l'Indice, les jours et les colonnes du back-office — les chiffres restent alignés et l'Indice ne « saute » plus visuellement de 9 à 10 (règle `number-tabular` du skill)
- [x] P.4 `text-wrap: balance` sur les titres, `pretty` sur les paragraphes — plus de mot orphelin en fin de titre
- [x] P.5 Accueil : titre sur deux lignes en 54px, sur-titre laiton + filet horizontal, exergue en serif, liste numérotée `01/02/03` au lieu de puces
- [x] P.6 Résultat : Indice en 136px avec interlettrage resserré (-0.045em), filet laiton élargi
- [x] P.7 En-tête : **monogramme « 90 » cerclé** en laiton — point d'ancrage identitaire sans logo ni image (spec §16.3 interdit les photos)
- [x] P.8 Rayons ramenés à 0 (boutons et cartes) — code du document imprimé, pas de l'application grand public
- [x] P.9 Sélection d'une réponse : filet interne laiton (`inset shadow`) au lieu de `border-2` — **supprime le décalage d'1px** qui faisait bouger la carte à la sélection
- [x] P.10 Retour de pression `active:` sur les boutons, sans déplacement de mise en page

**Preuves :** build OK · lint 0 erreur · **122 tests au vert** · CSS 10,2 Ko gzippé ·
polices vérifiées présentes dans le HTML et le CSS compilés.

### 🎨 REPRISE VISUELLE — demandée par l'utilisateur (3 août 2026)

**Retour utilisateur sur la première version :** *« on est sur quelque chose de blanc et de vide »*.
Constat partagé. **Arbitrage retenu : enrichir sans trahir la charte.**

Ce qui est **délibéré et conservé** (spec §16.3) :
- Deux couleurs + trois gris. **Aucun rouge alarmiste, aucun vert rassurant.**
- Raison : si un score de 18/100 s'affiche en rouge, la couleur porte le jugement à la place
  du texte, et le diagnostic devient un verdict.
- Aucune gamification, aucun emoji.

Ce qui est un **vrai manque à corriger** :
- [ ] 1.12 En-tête persistant avec l'identité du cabinet (aujourd'hui : rien du tout)
- [ ] 1.13 Rappel discret du « Test des 90 Jours » sur tous les écrans, pas seulement l'accueil
- [ ] 1.14 Donner de la matière : filets, fonds sourds, cartes mieux dessinées
- [ ] 1.15 Resserrer le rythme vertical du formulaire (l'espacement actuel fait vide, pas aéré)
- [ ] 1.16 Renforcer la hiérarchie typographique (contraste de graisse et de taille)
- [ ] 1.17 Pied de page sobre (confidentialité, cabinet)
- [ ] 1.18 **Préparer 2-3 directions visuelles à comparer côte à côte** avant de trancher
- [ ] 1.19 Vérifier le rendu mobile réel (320px → 1440px)
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

- [x] 2.1 Créer `src/data/questions.js` — les 18 questions, libellés exacts de la spec §6
- [x] 2.2 Métadonnées par question : id, axe, sous-dimension, type (A–F), options — ⚠️ **sans les points ni les coefficients** (règle S10 : ce fichier part au navigateur)
- [x] 2.3 Créer `src/data/axes.js` — 3 axes, poids, 15 sous-dimensions
- [x] 2.4 Les 3 écrans de transition — dans `axes.js`, textes exacts
- [x] 2.5 Créer `supabase/functions/_shared/bareme.js` — **barème serveur** : points, coefficients, niveaux, incohérences, protocole, matrice du scénario
- [ ] 2.6 Créer `src/data/profil.js` — champs Partie 1 et Partie 2, options
- [ ] 2.7 Créer `src/data/pays.js` — liste des pays + devise associée (FCFA / MAD / €)
- [ ] 2.8 Créer `src/data/secteurs.js`
- [ ] 2.9 **Contrôle qualité** : relecture mot à mot des 18 questions contre la spec, par une seconde passe
- [x] 2.10 Vérifier les maxima : Axe1 = 36, Axe2 = 32, Axe3 = 24 → **preuve : test automatisé qui passe**

---

## PHASE 3 — PARCOURS UTILISATEUR (front)

- [x] 3.1 Route `/` — écran d'accueil, texte exact spec §16.2, mention des 8 ans
- [x] 3.2 Écran d'accueil : annonce explicite « pas de retour arrière »
- [x] 3.3 Route `/quiz` — conteneur du parcours, **écran par écran**
- [x] 3.4 Étape capture Partie 1 (obligatoire) : prénom, email pro, entreprise, pays
- [x] 3.5 Validation email — format contrôlé au front **et** par contrainte SQL
- [x] 3.6 Écrans de transition des 3 sections — textes exacts
- [x] 3.7 Boucle des 18 questions, une par écran
- [x] 3.8 Blocage du retour arrière (`history.pushState`)
- [x] 3.9 Étape profil Partie 2 (facultatif) — 6 champs + bouton « Passer cette étape »
- [x] 3.10 Store Pinia `parcours` — état, réponses, progression
- [x] 3.11 Persistance locale (localStorage) + synchronisation Supabase à chaque réponse
- [x] 3.12 Localisation dynamique du montant Q2 selon le pays (FCFA / MAD / €)
- [x] 3.13 Route `/resultat` — affichage sobre, sans compteur animé
- [x] 3.14 Tracking d'abandon par question
- [x] 3.15 Composants : `BaseButton`, `BaseInput`, `OptionReponse`, `BarreProgression`
- [ ] 3.16 Rejet des domaines email jetables *(reporté en Edge Function)*
- [ ] 3.17 Recette manuelle du parcours dans un navigateur réel → **à faire par l'utilisateur**

### Preuves de la Phase 3

| Contrôle | Résultat |
|---|---|
| Routes `/`, `/quiz`, `/resultat` | **HTTP 200**, aucune en `.html` |
| Lint | 0 erreur |
| Build | 10 fichiers, ~103 Ko gzippés (cible < 400 Ko) ✅ |

---

## PHASE 4 — MOTEUR DE SCORING

> ⚠️ Implémenté **côté serveur** (Edge Function). Une version JS partagée peut servir aux tests.

- [x] 4.1 Fonction `calculerAxesBruts()` — les 3 formules pondérées
- [x] 4.2 Fonction `normaliserAxes()` — A1, A2, A3 sur 100
- [x] 4.3 Fonction `calculerIndice90()` — 0,40·A1 + 0,35·A2 + 0,25·A3, arrondi
- [x] 4.4 Fonction `calculerJours()` — `arrondi(3 × e^(I/21))`, plafond 365 — ⚠️ **divergence spec §9.1 vs §9.2 arbitrée : la formule fait autorité** (lessons L4)
- [x] 4.5 Fonction `scorerSousDimensions()` — les 15, normalisées sur 100
- [x] 4.6 Fonction `identifierForces()` — top 3
- [x] 4.7 Fonction `identifierFragilites()` — bottom 3
- [x] 4.8 Fonction `identifierPointCritique()` — la plus faible, départage par coefficient
- [x] 4.9 Fonction `determinerNiveau()` — les 5 paliers
- [x] 4.10 Fonction `determinerArchetype()` — les 6 combinaisons, seuil 50
- [x] 4.11 Les 2 combinaisons non couvertes — rattachées par l'axe déficient et **marquées `provisoire: true`** en attendant l'arbitrage du manager
- [x] 4.12 Fonction `detecterIncoherences()` — les 5 contrôles
- [x] 4.13 Protocole de sécurité — `Q15=0 ET Q14=0 ET Q16≤1 ET Q13=0`, **supprime le scénario de rupture**
- [x] 4.14 Fonction `genererBlocsScenario()` — la matrice §13.2, 9 déclencheurs
- [x] 4.15 Cas particulier : égalité départagée par le coefficient le plus lourd
- [ ] 4.16 Fonction `routerCommercial()` — la matrice §15.1 *(reportée : dépend des critères durs, phase profil)*
- [ ] 4.17 Cas particulier : A1 > 80 mais Q7 = 0 → incohérence supplémentaire
- [x] 4.18 **Tests unitaires** — conversion score → jours, table complète + monotonie
- [x] 4.19 **Tests unitaires** — les 6 archétypes + les 2 provisoires + le seuil de 50
- [x] 4.20 **Tests unitaires** — les 5 incohérences, chacune isolément
- [x] 4.21 **Tests unitaires** — protocole de sécurité, déclenché et non déclenché
- [x] 4.22 **Tests unitaires** — bornes : tout à 0 → Indice 0 ; tout à 4 → Indice 100 ; tout à 2 → 50
- [x] 4.23 **Audit** : le barème ne fuit pas dans le bundle → **preuve : 8 fichiers audités, 8 motifs testés, 0 occurrence**

### Preuves de la Phase 4

| Contrôle | Résultat |
|---|---|
| `npx vitest run` | **69 tests passent, 0 échec** |
| Maxima des axes | 36 / 32 / 24 ✅ |
| Bornes de l'Indice | 0 → 0, 2 → 50, 4 → 100 ✅ |
| Les 6 archétypes | tous identifiés correctement ✅ |
| Les 5 incohérences | toutes détectées isolément ✅ |
| Protocole de sécurité | déclenchement + suppression du scénario ✅ |
| **Barème dans le bundle** | **absent — 0 occurrence sur 8 motifs** ✅ |

---

## PHASE 5 — SUPABASE

- [x] 5.1 Connexion MCP Supabase — échec initial dû à PowerShell qui consomme le `--` (voir journal)
- [x] 5.2 Projet `TEST DES 90 JOURS` (eu-west-2, PostgreSQL 17)
- [x] 5.3 Table `sessions` — identité, profil, réponses, étape, qualité, horodatages
- [x] 5.4 Table `resultats` — scores, niveau, archétype, incohérences, protocole, token
- [x] 5.5 Table `evenements` — tracking anonyme
- [x] 5.6 Table `barometre_config` — phase de benchmark (spec §17)
- [x] 5.7 Politiques RLS + **privilèges colonne par colonne**
- [x] 5.8 Index sur email, session_id, token, date, question
- [x] 5.9 Client Supabase front (`src/lib/supabase.js`)
- [x] 5.10 Sauvegarde progressive + reprise de session
- [x] 5.11 Fonctions : token opaque, protection du protocole, suspension 21 j, compteur baromètre
- [x] 5.12 Edge Function `calculer-resultat` déployée (`verify_jwt: false`, validation du session_id)
- [x] 5.13 Contrôle anti-bot temporel (< 45 s → session marquée `suspecte`, exclue du Baromètre)
- [x] 5.14 **Test de pénétration** → voir preuves ci-dessous
- [ ] 5.15 Rate limiting sur l'Edge Function *(reporté Phase 9)*

### Preuves de la Phase 5 — test de pénétration

**25 tests exécutés contre l'API publique, 0 échec.**

| Catégorie | Résultat |
|---|---|
| Parcours légitime (session, capture, réponses, tracking, profil) | 5/5 ✅ |
| Lecture des colonnes sensibles (email, réponses, prénom, entreprise, pays, rentabilité, événement) | **7/7 refusées** ✅ |
| Lecture des tables fermées (`resultats`, `barometre_config`, `evenements`) | **3/3 refusées** ✅ |
| Forger un résultat / score manipulé | **refusé** ✅ |
| **Supprimer une session** | **refusé (HTTP 401)** — ⚠️ faille corrigée, voir `lessons.md` L6 |
| Supprimer des événements | **refusé** ✅ |
| Contraintes (réponse hors 0-4, email invalide, session fantôme) | **3/3 rejetées** ✅ |
| Faux token de rapport | **retourne vide** ✅ |
| Fonctions internes en RPC (3) | **3/3 inaccessibles** ✅ |

**Vérifications fonctionnelles complémentaires :**

| Contrôle | Résultat |
|---|---|
| Edge Function — profil dépendant | Indice 22 → 9 jours, « Point de défaillance unique » ✅ |
| Edge Function — profil médian | Indice 50 → **32 jours**, conforme à la table §9.2 ✅ |
| Idempotence (double appel) | même résultat, pas de doublon ✅ |
| **Protocole de sécurité déclenché** | `protocole_securite = true` ✅ |
| **Scénario de rupture supprimé** | **0 bloc** (vs 7 sur profil normal) ✅ |
| **Suspension commerciale** | **21 jours** posés automatiquement ✅ |
| Anti-bot | sessions < 45 s marquées `suspecte` et exclues du Baromètre ✅ |
| Phase du Baromètre | reste `amorcage` — aucune comparaison sous 200 répondants ✅ |
| **Barème dans le bundle** | **absent — 10 fichiers, 10 motifs, 0 occurrence** ✅ |

---

## PHASE 6 — CONTENU RÉDACTIONNEL

> Rédigé par Claude, dans des fichiers séparés et éditables. **À faire valider par le manager.**

- [x] 6.1 Les 5 descriptions de niveau — `contenu-verdicts.js`
- [x] 6.2 Les 6 verdicts d'archétype — 150 mots chacun, **sans conseil ni vente** (vérifié par test)
- [x] 6.3 Les 15 sous-dimensions × ligne de lecture (page 3)
- [x] 6.4 Les 15 versions « force » : acquis + **le risque que cette force crée**
- [x] 6.5 Les 15 versions « fragilité » : description, conséquence 12–24 mois, premier levier
- [x] 6.6 Les 15 textes de « point critique » — pourquoi celle-là et pas une autre
- [x] 6.7 Les 9 blocs du scénario de rupture + clôture au jour 90 — `contenu-scenario.js`
- [x] 6.8 Les 3 actions gratuites × 6 archétypes = 18 actions — `contenu-suite.js`
- [x] 6.9 L'encadré du protocole de sécurité — texte exact de la spec §14.2
- [x] 6.10 Les 5 messages d'incohérence + le bloc d'encadrement §11.2
- [x] 6.11 Matrice de routage commercial §15.1 — `routerCommercial()`
- [x] 6.12 Assembleur des 8 pages — `rapport.js`
- [x] 6.13 **Relecture automatisée** : aucun adjectif dramatique, aucune faillite, aucun reproche → **tests**
- [ ] 6.14 Soumettre au manager pour validation → **bloquant avant mise en ligne**

### Preuves de la Phase 6

**106 tests au total (69 scoring + 37 rapport), 0 échec.**

| Règle de la spécification | Vérification automatisée |
|---|---|
| Verdict sans conseil ni vente (§12.1) | aucune occurrence de « cabinet », « offre », « € », « FCFA » ✅ |
| Aucun adjectif dramatique (§13.4) | aucun « catastrophe », « effondrement », « désastre » ✅ |
| Aucune faillite — l'entreprise s'appauvrit (§13.4) | aucun « faillite », « liquidation » ; clôture = « existe toujours » ✅ |
| Aucun reproche (§13.4) | aucun « vous auriez dû » ✅ |
| Actions réalisables sans le cabinet (§12.2) | aucun renvoi commercial dans les 18 actions ✅ |
| Proportion 7 pages / 0,5 page (§12.2) | vente < 5 % du volume total ✅ |
| Protocole : scénario **non généré** (§14.2) | 7 pages au lieu de 8, aucun texte récupérable ✅ |
| Protocole : aucune sollicitation (§14.2) | `orientation = null`, priorité « suspendu » ✅ |
| Protocole : actions gratuites conservées | 3 actions maintenues ✅ |
| Benchmark jamais inventé (§17.1) | `null` sous 200 répondants ✅ |
| Routage : prospect idéal 26-45 + critères + événement (§15.2) | priorité « absolue » ✅ |

**Correction apportée après relecture du rendu :** sur un profil globalement faible, la page 4
s'intitulait « Vos trois forces » pour des scores de 25/100. Présenter cela comme des forces
décrédibiliserait l'analyse. La page devient « Vos points les moins fragiles » sous le seuil de 50,
et propose un levier au lieu d'un risque d'excès.

---

## PHASE 7 — RAPPORT PDF

- [x] 7.1 Librairie PDF : **pdf-lib** — compatible Deno sans dépendance native, contrairement à Puppeteer
- [x] 7.2 Gabarit A4, charte graphique appliquée (`pdf-rapport.js`)
- [x] 7.3 Page 1 — couverture : Indice en 92 pt, jours, une phrase, rien d'autre
- [x] 7.4 Page 2 — verdict + **encadré de sécurité inséré en tête si actif**
- [x] 7.5 Page 3 — 3 jauges linéaires **monochromes** + radar à 3 branches
- [x] 7.6 Page 3 — benchmark par phase : **aucune comparaison sous 200 répondants**
- [x] 7.7 Page 4 — les trois forces (ou « points les moins fragiles » sous le seuil de 50)
- [x] 7.8 Page 5 — les trois fragilités
- [x] 7.9 Page 6 — le point critique
- [x] 7.10 Page 7 — scénario de rupture **+ omission si protocole actif ou si aucun bloc déclenché**
- [x] 7.11 Page 8 — 3 actions, orientation commerciale reléguée en bas de page
- [x] 7.12 Nommage `Indice90_[Nom]_[Date].pdf`
- [x] 7.13 Signature provisoire + filigrane « DOCUMENT PROVISOIRE » sur la couverture
- [x] 7.14 Edge Function `generer-rapport` déployée
- [x] 7.15 Script `npm run sync:fonctions` — `_shared/` reste la source de vérité
- [x] 7.16 **Tests PDF automatisés** (13 tests) — voir preuves
- [x] 7.17 Version web consultable du rapport → voir Phase 9bis
- [ ] 7.18 Remplacer la signature provisoire → **bloquant avant mise en ligne**

### Preuves de la Phase 7

**PDF généré en production, testé de bout en bout.**

| Contrôle | Résultat |
|---|---|
| pdf-lib sous Deno | ✅ vérifié par une sonde déployée puis supprimée |
| Parcours complet → score → PDF | HTTP 200, `application/pdf`, **16,9 Ko** |
| Contenu du PDF de production | nom, entreprise, Indice, jours, niveau, archétype, scénario, actions, signature ✅ |
| Accents lisibles | ✅ |
| Aucun benchmark inventé | ✅ |
| **Protocole : encadré médical** | ✅ présent, avec la mention des 54 % |
| **Protocole : scénario absent** | ✅ aucun texte récupérable dans le fichier |
| **Protocole : aucune sollicitation** | ✅ |
| **Protocole : 3 actions conservées** | ✅ — le protocole supprime la vente, pas l'aide |
| Tests automatisés | **122 passent, 0 échec** |

⚠️ **Un défaut grave a été trouvé pendant cette phase** : les tests « le PDF ne contient pas X »
passaient **sans rien vérifier** (extracteur défaillant renvoyant une chaîne vide).
Corrigé + garde-fou ajouté. Voir `lessons.md` L10 — c'est la leçon la plus importante du projet.

---

## PHASE 8 — EMAIL

- [x] 8.1 Clé API Resend obtenue et stockée dans les **secrets Supabase** (jamais dans le code)
- [ ] 8.2 Vérifier le domaine (DNS : SPF, DKIM, DMARC) — **dépend de l'achat du nom de domaine**
- [x] 8.3 Edge Function `envoyer-rapport` déployée
- [x] 8.4 Gabarit email sobre — **aucune vente** (règle J0 de la spec §15.3)
- [x] 8.5 Pièce jointe PDF (encodage base64 par tranches, évite le dépassement de pile)
- [x] 8.6 Gestion des erreurs + **idempotence** : jamais deux envois pour la même session
- [x] 8.7 Cas protocole de sécurité : email adapté, **sans score ni diagnostic ni sollicitation**
- [x] 8.8 Délai vérifié → **preuve : 7 secondes** (cible < 60 s)
- [x] 8.9 Version texte de l'email (clients sans HTML)
- [x] 8.10 Échappement des valeurs saisies avant insertion dans l'HTML
- [ ] 8.11 Test de délivrabilité réel (Gmail, Outlook) — **à faire après l'achat du domaine**

### Preuves de la Phase 8

| Contrôle | Résultat |
|---|---|
| Envoi réel via Resend | ✅ ID `6d9362e6-414b-4df6-bc46-467618d2d602` |
| **Délai bout en bout** | **7 secondes** (cible spec : < 60 s) ✅ |
| Idempotence | second appel → `{"deja":true}`, aucun doublon ✅ |
| Protocole de sécurité | email envoyé **sans score, sans diagnostic, sans vente** ✅ |
| Session inexistante | `{"erreur":"Résultat introuvable"}` ✅ |
| Session invalide | `{"erreur":"Session invalide"}` ✅ |
| **Clé Resend dans les logs** | **absente** — logs vérifiés, aucune donnée personnelle ✅ |

⚠️ **Expéditeur actuel : `delivered@resend.dev`** — adresse de test Resend, qui ne nécessite
aucun domaine vérifié. À remplacer par une adresse du domaine réel avant la mise en ligne.

---

## PHASE 9bis — VERSION WEB DU RAPPORT

- [x] 9b.1 Route `/rapport` — accès par token opaque en paramètre
- [x] 9b.2 Fonction SQL `rapport_par_token` — ne renvoie **ni email ni réponses brutes**
- [x] 9b.3 Affichage : score, jours, 3 jauges monochromes, encadré de sécurité si actif
- [x] 9b.4 Expiration du token à 90 jours
- [x] 9b.5 **Test de fuite** → preuve : ni email ni réponses brutes dans la réponse ✅
- [x] 9b.6 Token inventé → retourne `[]` ✅

---

## PHASE 9ter — BACK-OFFICE (récapitulatif des résultats)

> Demande utilisateur du 4 août 2026 : une page connectée à la base, listant tous les tests
> passés et rapports envoyés, avec le détail de chaque profil.

- [x] 9c.1 Décision d'accès : **mot de passe unique** (pas Supabase Auth — v1 interne, toi + manager)
- [x] 9c.2 Mot de passe stocké en secret Supabase (`ADMIN_PASSWORD`), jamais dans le code
- [x] 9c.3 Edge Function `admin-resultats` — actions `liste` et `detail`, vérification en temps constant
- [x] 9c.4 Route `/admin` — écran de connexion puis tableau de bord
- [x] 9c.5 Tableau : date, prénom, entreprise, pays, Indice, jours, niveau, statut d'envoi
- [x] 9c.6 Repères chiffrés : total, rapports envoyés, protocoles de sécurité actifs, qualité « ok »
- [x] 9c.7 Filtre par prénom / entreprise / email
- [x] 9c.8 Panneau de détail : les 3 axes, archétype, incohérences, profil complet, lien du rapport web
- [x] 9c.9 Session gardée en `sessionStorage` (pas `localStorage`) — le mot de passe ne survit pas à la fermeture de l'onglet
- [x] 9c.10 Ajout au script `npm run audit:bundle` : le mot de passe ne doit jamais fuiter dans le bundle

### Preuves de la Phase 9ter

| Contrôle | Résultat |
|---|---|
| Mauvais mot de passe | `{"erreur":"Mot de passe incorrect"}`, HTTP 401 ✅ |
| Aucun mot de passe fourni | même refus ✅ |
| Bon mot de passe | liste renvoyée — **2 vrais tests trouvés en base**, dont un du compte du cabinet ✅ |
| Contournement direct de `resultats` via la clé publique | **toujours bloqué par RLS** — le back-office est le seul chemin d'accès ✅ |
| Audit bundle | mot de passe absent du code livré au navigateur ✅ |
| Tests unitaires | 122/122 toujours au vert après l'ajout ✅ |
| Build | route `/admin` isolée dans son propre chunk, 3,6 Ko gzippé — n'alourdit pas le reste du site ✅ |

**🔑 Mot de passe actuel du back-office** (généré, à donner au manager, changeable à tout
moment via `supabase secrets set ADMIN_PASSWORD=...`) : voir message de fin de tâche —
**ne jamais l'écrire dans ce fichier versionné.**

---

## PHASE 9 — SÉCURITÉ & CONFORMITÉ

- [x] 9.1 `docs/securite.md` rédigé (Phase 0)
- [x] 9.2 Validation et assainissement des entrées — contraintes SQL + validation front (Phase 5)
- [ ] 9.3 Rate limiting sur les Edge Functions
- [ ] 9.4 Anti-bot sur la soumission (honeypot) — **partiel** : contrôle temporel < 45 s déjà actif (Phase 5), le honeypot visuel reste à ajouter
- [x] 9.5 Aucune clé secrète exposée côté client → **preuve : `npm run audit:bundle`, 0 fuite**
- [x] 9.6 Le barème n'est pas lisible dans le bundle JS → **preuve : `npm run audit:bundle`**
- [x] 9.7 En-têtes de sécurité (CSP, HSTS, X-Frame-Options) — `vercel.json` prêt, à vérifier après déploiement
- [ ] **9.8 🔴 RGPD / consentement — NON FAIT, BLOQUANT.** Voir détail juste en dessous.
- [ ] **9.9 🔴 Politique de confidentialité — NON FAIT, BLOQUANT.** Texte à rédiger et publier.
- [ ] 9.10 Chiffrement au repos des réponses de l'Axe 3 — Supabase chiffre par défaut ; à confirmer explicitement
- [x] 9.11 Audit manipulation du score → **preuve : test de pénétration Phase 5, 25/25 attaques échouées**

### 🔴 DÉTAIL DU POINT 9.8 — RGPD, le plus gros manque de sécurité restant

**Ce qui existe aujourd'hui :** rien. Le formulaire de capture (Partie 1) collecte prénom,
email et entreprise **sans aucune case de consentement**. Les réponses de l'Axe 3 (Q14 à Q18)
sont des données de santé au sens de l'**article 9 du RGPD** — catégorie particulière qui exige
un consentement **explicite**, pas un consentement présumé par l'usage du site.

**Ce qu'il manque concrètement :**
1. Une **case à cocher, non pré-cochée**, avant le bouton Continuer de la capture Partie 1,
   avec un texte du type : *« J'accepte que mes réponses soient traitées pour établir mon
   diagnostic et recevoir mon rapport. »*
2. Un lien vers la **politique de confidentialité** (point 9.9, à écrire en même temps)
3. Le formulaire ne doit pas pouvoir être validé sans cette case cochée
4. Une adresse email de contact pour les demandes d'accès ou d'effacement (point F6, déjà
   listé dans la section manager plus bas)

**Pourquoi c'est bloquant et pas juste "à faire un jour" :** le produit collecte déjà des
réponses sur la santé mentale du dirigeant (sommeil, épuisement, solitude) sans base légale
explicite. C'est le seul point de non-conformité active du produit à ce stade — tout le reste
(sécurité technique, protocole de sécurité, benchmark) est déjà traité.

**Ce que je propose pour la suite :** je peux écrire la case à cocher et le texte de politique
de confidentialité dès que tu me le demandes — c'est un ajout ciblé, pas une nouvelle phase.
Je ne l'ai pas fait sans demande explicite parce que le texte légal engage le cabinet et
mérite d'être au moins survolé par le manager avant publication.

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

## 🧪 PARCOURS DE TEST COMPLET — À FAIRE PAR L'UTILISATEUR

> Recette manuelle, avec des **valeurs exactes calculées par le vrai moteur** (pas des
> estimations) pour que tu puisses vérifier que les calculs, coefficients et pondérations
> sont corrects — pas seulement que l'écran s'affiche.

### Préparation

```sh
cd c:\projetsholiday\Shemen-Agency\rapport-3-specification-test-90
npm run dev
```

Ouvrir **http://localhost:5173**

⚠️ Utiliser une **vraie adresse email** à la dernière étape pour recevoir le rapport dans ta
boîte, ou `delivered@resend.dev` si tu veux juste vérifier que l'envoi part sans recevoir le mail.

**Comment lire les tableaux de réponses ci-dessous :** chaque question affiche 5 boutons de
réponse, listés de haut en bas dans l'écran. « Bouton n°1 » = le tout premier en haut de la
liste, « Bouton n°5 » = le dernier en bas. C'est toujours cette position qui compte, jamais
le texte (les libellés peuvent différer d'une question à l'autre).

---

### TEST 1 — Le parcours nominal, écran par écran (~8 minutes)

| # | Écran | Action | Ce qu'il faut voir |
|---|---|---|---|
| 1 | Accueil | Ouvrir la page | En-tête « Le Test des 90 Jours », citation des 8 ans en exergue (filet laiton à gauche), bloc **18 / 7 / 8**, encadré « Avant de commencer » sur fond gris clair |
| 2 | Accueil | Cliquer **Commencer** | L'URL devient `/quiz` — **jamais `/quiz.html`** |
| 3 | Capture (partie 1) | Valider sans rien remplir | 4 messages d'erreur sous les champs, **écrits en gris/encre foncé, jamais en rouge** |
| 4 | Capture | Taper `abc` dans Email, valider | Message « Adresse email invalide » |
| 5 | Capture | Remplir : Prénom = `Test`, Email = ta vraie adresse (ou `delivered@resend.dev`), Entreprise = `Cabinet Test`, Pays = **Côte d'Ivoire** → Continuer | Écran de transition « Section 1 sur 3 » |
| 6 | Transition 1 | Lire, cliquer Continuer | Texte : « Sept questions. Elles portent sur des faits... » |
| 7 | Question 1 | Cliquer **bouton n°3** (« 6 à 10 jours ») | Sur-titre « Question 1 sur 18 » à gauche, « L'entreprise sans vous » à droite |
| 8 | Question 2 | Regarder l'énoncé avant de répondre | Le montant affiché doit être **« 3 300 000 FCFA »** (car pays = Côte d'Ivoire) |
| 8 | Question 2 | Cliquer **bouton n°2** | — |
| 9 | Question 3 | Cliquer **bouton n°4** | — |
| 10 | Question 4 | Cliquer **bouton n°1** (« Sur moi. Rien n'est écrit ») | — |
| 11 | Question 5 | Cliquer **bouton n°5** (« Moins de 2 ») | — |
| 12 | Question 6 | Cliquer **bouton n°3** | — |
| 13 | Question 7 | Cliquer **bouton n°2** | Barre de progression en bas doit être à ~39 % du remplissage (7/18), **sans aucun chiffre affiché** |
| — | — | **Appuyer sur le bouton Précédent du navigateur** | ⚠️ **Rien ne doit se passer** — le retour arrière est bloqué |
| 14 | Transition 2 | Continuer | Texte sur l'étude AFD |
| 15 | Question 8 | Cliquer **bouton n°4** | — |
| 16 | Question 9 | Cliquer **bouton n°1** (« Je ne m'en souviens pas ») | — |
| 17 | Question 10 | Cliquer **bouton n°3** | — |
| 18 | Question 11 | Cliquer **bouton n°2** | — |
| 19 | Question 12 | Cliquer **bouton n°5** (« Non. Une politique... ») | — |
| 20 | Question 13 | Cliquer **bouton n°4** | — |
| 21 | Transition 3 | Continuer | Texte « 72 % des fondateurs... » |
| 22 | Question 14 | Cliquer **bouton n°3** | — |
| 23 | Question 15 | Cliquer **bouton n°1** (« Quatre ou cinq ») | — |
| 24 | Question 16 | Cliquer **bouton n°2** | — |
| 25 | Question 17 | Cliquer **bouton n°4** | — |
| 26 | Question 18 | Cliquer **bouton n°3** | Passage automatique à l'écran profil |
| 27 | Profil (partie 2) | Cliquer directement **« Passer cette étape »**, sans rien remplir | Passage à `/resultat` |
| 28 | Résultat | Attendre le calcul | **Voir le tableau de vérification ci-dessous** |
| 29 | Résultat | Attendre ~10 secondes | Le texte passe de « vous est adressée » à « vient de vous être envoyée » |
| 30 | — | Ouvrir ta boîte mail | Email reçu avec le PDF en pièce jointe, en moins d'une minute |

### ✅ Vérification du calcul — ce test précis DOIT produire exactement :

| Résultat attendu | Valeur |
|---|---|
| **Indice 90** | **48 / 100** |
| **Jours affichés** | **« environ 29 jours »** |
| Niveau | Transition inachevée |
| Axe 1 (L'entreprise sans vous) | 46 / 100 |
| Axe 2 (Ceux qui vous entourent) | 56 / 100 |
| Axe 3 (Vous) | 40 / 100 |

Si un seul de ces 5 nombres diffère de ce qui s'affiche chez toi, il y a un problème de
calcul — arrête-toi et signale-le-moi avec une capture d'écran.

<details>
<summary>Comment ce chiffre de 48 est obtenu (détail du calcul, pour comprendre)</summary>

Chaque réponse vaut des points égaux à la position du bouton moins 1 (bouton n°1 → 0 point,
bouton n°5 → 4 points). Chaque question a un coefficient (de ×1 à ×2, Q7 et Q8 étant les plus
lourdes à ×2). Le score brut de chaque axe est la somme de (points × coefficient) de ses
questions, ramenée sur 100 par rapport au maximum possible de l'axe (36 pour l'axe 1, 32 pour
l'axe 2, 24 pour l'axe 3). L'Indice 90 final est 0,40 × Axe1 + 0,35 × Axe2 + 0,25 × Axe3,
arrondi. Les jours sont `3 × e^(Indice/21)`, arrondi.

Avec les réponses du test ci-dessus : Axe1 brut = 16,5/36 = 45,83 → 46. Axe2 brut = 18/32 =
56,25 → 56. Axe3 brut = 9,5/24 = 39,58 → 40. Indice = 0,40×45,83 + 0,35×56,25 + 0,25×39,58 =
47,92 → **48**. Jours = 3×e^(48/21) = 28,9 → **29**.
</details>

---

### TEST 2 — Le PDF reçu (celui du TEST 1)

| # | Vérification | Valeur attendue |
|---|---|---|
| 1 | Nombre de pages | 8, format A4 |
| 2 | Page 1 — Indice affiché | **48** |
| 3 | Page 1 — phrase | « ... environ 29 jours sans vous » |
| 4 | Page 1 | Filigrane diagonal « DOCUMENT PROVISOIRE » (tant que B1 n'est pas réglé, voir plus bas) |
| 5 | Page 2 — niveau | « Transition inachevée » |
| 6 | Page 2 — paragraphe de verdict | **Aucune** mention de prix, d'offre, ou du mot « cabinet » suivi d'une proposition |
| 7 | Page 3 — trois jauges | **Toutes de la même couleur**, quelle que soit leur longueur (jamais de rouge sur la plus courte) |
| 8 | Page 7 — scénario de rupture | Présent, découpé en tranches de jours (« Jours 1 à 5 », etc.) |
| 9 | Page 8 | 3 actions numérotées en haut, puis la proposition commerciale **seulement tout en bas de page** |
| 10 | Nom du fichier téléchargé | `Indice90_Test_[date du jour].pdf` |

### TEST 3 — Le protocole de sécurité ⚠️ (le test le plus important du produit)

Refais tout le parcours du TEST 1, mais avec **ces 18 réponses précises** (position du bouton) :

| Question | Bouton à cliquer | Question | Bouton à cliquer |
|---|---|---|---|
| Q1 | n°2 | Q10 | n°2 |
| Q2 | n°2 | Q11 | n°2 |
| Q3 | n°2 | Q12 | n°2 |
| Q4 | n°2 | Q13 | **n°1** ← déclencheur |
| Q5 | n°2 | Q14 | **n°1** ← déclencheur |
| Q6 | n°2 | Q15 | **n°1** ← déclencheur |
| Q7 | n°2 | Q16 | **n°2** *(2e option, "Un soulagement immédiat" — déclenche aussi)* |
| Q8 | n°2 | Q17 | n°2 |
| Q9 | n°2 | Q18 | n°2 |

*(Q13 = « Personne », Q14 = « Aucune », Q15 = « Quatre ou cinq », Q16 = les 2 premières options
déclenchent toutes les deux — la spec les traite comme également problématiques.)*

**Résultat de calcul attendu sur l'écran `/resultat` :** Indice **20 / 100**, soit **« environ
8 jours »**, Axe 1 = 25, Axe 2 = 22, Axe 3 = 10.

Puis, dans le PDF et l'email reçus :

| # | Vérification | Attendu |
|---|---|---|
| 1 | Nombre de pages du PDF | **7, pas 8** |
| 2 | Page 2, tout en haut | Encadré recommandant de consulter un médecin, mention « 54 % » |
| 3 | Le scénario de rupture (page 7) | **ABSENT** — le PDF passe directement de la page 6 à la page « suite logique » |
| 4 | Proposition commerciale | **AUCUNE**, nulle part dans le document |
| 5 | Les 3 actions gratuites (dernière page) | **PRÉSENTES quand même** — le protocole supprime la vente, pas l'aide |
| 6 | L'email reçu | Ni score, ni diagnostic, ni sollicitation — juste le PDF et un mot d'accompagnement sobre |

### TEST 4 — Mobile (le plus important : 80 % des accès viendront d'un téléphone)

Ouvrir sur un vrai téléphone, ou dans le navigateur : F12 → icône mobile → « iPhone SE » (375 px).

| # | Vérification |
|---|---|
| 1 | Aucun défilement horizontal, sur aucun des écrans du TEST 1 |
| 2 | Chaque bouton de réponse est assez grand pour être touché sans viser précisément |
| 3 | Le texte des questions les plus longues (Q7, Q12) reste lisible sans zoomer |
| 4 | Le chiffre de l'Indice sur `/resultat` n'est pas coupé ou tassé contre le bord |

### TEST 5 — Reprise après coupure réseau

| # | Action | Attendu |
|---|---|---|
| 1 | Démarrer un nouveau parcours, répondre aux 5 premières questions | — |
| 2 | Fermer complètement l'onglet (pas juste naviguer ailleurs) | — |
| 3 | Rouvrir `localhost:5173/quiz` | **Reprise directement à la question 6**, les 5 premières réponses ne sont pas redemandées |

### TEST 6 — La charte graphique, sur chaque écran

- [ ] Aucun emoji nulle part
- [ ] Aucun rouge, vert, orange ou couleur vive — seulement Encre (bleu-noir), Laiton (brun doré), et des gris
- [ ] Aucun dégradé, aucune ombre portée
- [ ] Aucun point d'exclamation
- [ ] Aucun compteur qui s'anime, aucun confetti, aucune félicitation
- [ ] Aucune photo d'illustration générique (banque d'images)
- [ ] Le logo Vue.js et le favicon Vue **ont disparu** (corrigés le 3 août — à confirmer chez toi)

### Ce qu'il faut me signaler après ces 6 tests

1. **Tout écart entre un chiffre attendu ci-dessus et ce que tu vois réellement** — c'est le plus important
2. Tout écran qui semble vide ou mal rythmé
3. Tout texte coupé, illisible ou qui déborde
4. Toute formulation qui sonne faux ou qui semble juger le répondant
5. Le rendu du PDF sur ton téléphone

---

## 📨 À REMONTER AU MANAGER

> **Dossier complet et détaillé : [docs/a-remonter-au-manager.md](a-remonter-au-manager.md).**
> Document autonome, transmissible tel quel — chaque point y cite la phrase exacte de sa
> spécification, explique le raisonnement complet, et indique où retrouver le texte ou le code
> concerné. Ci-dessous : uniquement la synthèse pour le suivi interne.

### 🔴 BLOQUANTS — la mise en ligne est impossible sans ces réponses

| # | Sujet | Ce qu'il faut |
|---|---|---|
| **B1** | Signature du rapport | Un nom et une fonction réels (spec §16.3 interdit « L'équipe ») |
| **B2** | Nom de domaine | Pour l'adresse d'expédition des emails et la mise en ligne |
| **B3** | Validation du contenu rédactionnel | **123 textes** rédigés, relecture détaillée au § 6 du dossier complet — commande `npm run lire:contenu` pour tout relire d'un coup |

### 🟠 DÉCISIONS DE FOND — détaillées dans le dossier complet

| # | Sujet | Résumé |
|---|---|---|
| **O1** | ⚠️ La formule et la table de sa propre spec ne coïncident pas (§9) | 7 valeurs sur 10 coïncident, 2 divergent d'1 jour, 1 diverge de 14 jours (Indice 100 : formule=351, table=365). Détail du calcul complet dans le dossier. Décision appliquée : la formule fait autorité. |
| **O2** | Les archétypes ne couvrent que 6 des 8 combinaisons possibles (§10.2) | 2 combinaisons non nommées, rattachées provisoirement (`provisoire: true`) |
| **O3** | Les 7 questions qu'il a posées lui-même en §19 de sa spec, jamais tranchées | Défauts appliqués, documentés un par un dans le dossier |
| **O4** | Décision de conception prise seul (page 4 : « forces » sur un profil faible) | Corrigé en « points les moins fragiles » sous le seuil de 50 |

### 🟡 CONFIRMATIONS DE FORME

| # | Sujet | Proposition | Statut |
|---|---|---|---|
| F1 | Palette | **Encre** `#1B2A3A` + **Laiton** `#9A7B4F` + 3 gris | À valider |
| F2 | Typographie | **Lora** (serif, titres) + **Inter** (sans-serif, corps) | À valider |
| F3 | Identité visuelle du cabinet | Existe-t-elle ? Logo disponible ? | **Question ouverte** |
| F4 | Photo de l'équipe réelle | Seul visuel autorisé par la spec §16.3 | **Question ouverte** |
| F5 | Liste des pays et secteurs | 29 pays (UEMOA, CEMAC, Maghreb, diaspora), 15 secteurs | À valider |
| F6 | Adresse email de contact | Pour les demandes RGPD (accès, effacement) | **Requise avant mise en ligne** |
| F7 | Politique de confidentialité | Texte à rédiger et publier | **Requise avant mise en ligne** |

---

### 📌 CE QU'IL DOIT SAVOIR SUR LES CHOIX TECHNIQUES

| Sujet | Décision | Justification |
|---|---|---|
| **Scoring côté serveur** | Le barème n'atteint **jamais** le navigateur | Sinon il est lisible dans le code, le score manipulable, et **les données du futur Baromètre invalidées** |
| **Benchmark** | Aucune comparaison affichée **sous 200 répondants** | Sa propre règle absolue (§17.1) : ne jamais inventer de benchmark |
| **Protocole de sécurité** | Infalsifiable — verrouillé en base de données | Une fois écrit, ni le drapeau ni la suspension de 21 jours ne peuvent être modifiés |
| **Anti-bot** | Un test bouclé en moins de 45 s est marqué « suspecte » | Protège la qualité des données du Baromètre |
| **Données de santé** | Les réponses de l'Axe 3 relèvent de l'**article 9 RGPD** | Catégorie particulière : consentement explicite requis, conservation 36 mois |
| **Sécurité vérifiée** | 25 tests de pénétration contre l'API publique | Aucune lecture d'email ni de réponses possible depuis le navigateur |

---

### 🔐 ACTIONS DE SÉCURITÉ POUR L'UTILISATEUR

- [ ] **Révoquer le token Supabase** transmis en clair dans la conversation, en générer un nouveau
- [ ] **Révoquer la clé Resend** transmise en clair, en générer une nouvelle
- [ ] Vérifier que `.env` n'est jamais poussé sur GitHub (déjà protégé, mais à contrôler)

---

## 📋 JOURNAL DES ÉVOLUTIONS

| Date | Évolution |
|---|---|
| 2 août 2026 | Création de `CLAUDE.md`, `docs/projet.md`, `docs/todo.md`. Spécification lue intégralement (960 lignes). Arbitrages capture (WhatsApp) et contenu rédactionnel validés. |
| 2 août 2026 | Création de `docs/lessons.md`, `docs/design-pattern.md`, `docs/securite.md`. |
| 2 août 2026 | **Phase 0 terminée.** Environnement installé et vérifié : Vue 3.5 + Vite 8.2 + Router 5 (history) + Pinia 4 + Vitest 4 + Tailwind 4.3 + Supabase JS. Build à 37,6 Ko gzippés. 0 vulnérabilité. |
| 2 août 2026 | 3 leçons consignées : `.gitignore` sans protection des `.env` (L1), `manualChunks` incompatible Rolldown (L2), test de sécurité mal écrit (L3). |
| 2 août 2026 | **Phase 2 (données) et Phase 4 (moteur) terminées.** 18 questions saisies, barème isolé côté serveur, moteur complet, **69 tests unitaires au vert**. Audit du bundle : le barème ne fuit pas. |
| 2 août 2026 | **Divergence relevée dans la spec** entre la formule §9.1 et la table §9.2 (3 valeurs sur 10). Arbitrage : la formule fait autorité. Leçon L4. |
| 2 août 2026 | **MCP Supabase connecté.** L'échec initial venait de PowerShell qui consomme le `--` avant `claude` ; la commande passe depuis Bash. |
| 2 août 2026 | Décisions : hébergement Vercel, Resend en test avec `delivered@resend.dev`, signature temporaire marquée comme telle. |
| 3 août 2026 | **Phase 5 (Supabase) terminée.** 4 tables, RLS + privilèges colonne, 5 fonctions de sécurité, Edge Function `calculer-resultat` déployée. **Test de pénétration : 25 tests, 0 échec.** |
| 3 août 2026 | **⚠️ Faille détectée et corrigée : `anon` pouvait supprimer des sessions** (privilèges Supabase permissifs par défaut). Leçon L6. |
| 3 août 2026 | **Phase 3 (parcours) terminée.** Accueil, capture P1, 18 questions une par écran, 3 transitions, profil P2, résultat. Blocage du retour arrière, reprise après coupure. |
| 3 août 2026 | 4 leçons consignées : L6 (privilèges Supabase), L7 (RLS et privilèges colonne), L8 (PostgREST `return=representation`), L9 (tests trop rapides pour l'anti-bot). |
| 3 août 2026 | **Reprise visuelle** suite au retour « blanc et vide » : en-tête persistant, pied de page, filets, encadrés sur fond sourd, repères chiffrés, rythme resserré. Charte respectée — toujours 2 couleurs, aucun rouge/vert. |
| 3 août 2026 | **Phase 6 (contenu) terminée.** 6 verdicts d'archétype, 15 sous-dimensions × 4 traitements, 9 blocs de scénario, 18 actions, routage commercial, assembleur 8 pages. **106 tests, 0 échec.** |
| 3 août 2026 | Correction : la page 4 ne présente plus comme « forces » des dimensions sous 50/100 — elle devient « Vos points les moins fragiles ». Question d'honnêteté du rapport. |
| 3 août 2026 | **Phase 7 (PDF) terminée.** Générateur pdf-lib, 8 pages A4, jauges monochromes, radar. Edge Function `generer-rapport` déployée et testée en production. **122 tests, 0 échec.** |
| 3 août 2026 | **⚠️ Défaut grave corrigé : des tests de sécurité passaient sans rien vérifier** (extracteur PDF renvoyant du vide). Garde-fou ajouté. Leçon L10. |
| 3 août 2026 | 4 leçons : L10 (tests négatifs sans instrument vérifié), L11 (noms de constantes devinés), L12 (cas limite = question de conception), L13 (défaut dans l'artefact ou l'instrument ?). |
| 3 août 2026 | **Phase 8 (email) terminée.** Edge Function `envoyer-rapport` déployée, clé Resend en secrets Supabase. **Envoi réel vérifié en 7 secondes**, idempotence, cas protocole de sécurité. |
| 3 août 2026 | **Version web du rapport** (route `/rapport`, token opaque). Test de fuite : ni email ni réponses brutes exposés. |
| 3 août 2026 | Configuration Vercel : URLs propres (pas de `.html`), en-têtes de sécurité (CSP, HSTS, X-Frame-Options). |
| 3 août 2026 | **Chaîne complète fonctionnelle** : accueil → 18 questions → profil → score → PDF 8 pages → email. Sections « parcours de test » et « à remonter au manager » ajoutées à ce fichier. |
| 3 août 2026 | **Corrections signalées par l'utilisateur après déploiement Vercel :** badge Vue DevTools visible en prod (jamais désactivé hors mode dev), favicon resté celui du template Vue. Les deux corrigés. Leçons L14, L15. |
| 3 août 2026 | **Parcours de test entièrement réécrit** avec des valeurs de calcul exactes (Indice, jours, scores d'axe) recalculées par le vrai moteur — pas des estimations — pour permettre une vérification chiffrée, pas seulement visuelle. |
| 3 août 2026 | **Point RGPD (§9.8-9.9) remonté en tête de fichier comme bloquant explicite** : aucune case de consentement, aucune politique de confidentialité publiée à ce jour. C'est le seul manque de conformité actif du produit. |
| 4 août 2026 | **Création de `docs/a-remonter-au-manager.md`** : dossier autonome et détaillé, sur demande explicite de l'utilisateur. Pour chaque point : citation exacte de la spec, raisonnement complet, calcul vérifié à la main pour O1 (formule/table), localisation précise dans le code. Détaille aussi les 123 textes rédigés (6 verdicts + 90 champs de sous-dimension + 9 blocs de scénario + 18 actions), la règle de spec qui justifie chacun, et les 11 tests écrits pour les vérifier automatiquement. |
| 4 août 2026 | Script `npm run lire:contenu` ajouté — imprime les 123 textes en clair pour relecture, sans ouvrir le code. Vérifié : 450 lignes produites. |
| 4 août 2026 | **Phase 9ter (back-office) ajoutée sur demande utilisateur.** Route `/admin` : liste de tous les tests passés et rapports envoyés, avec détail par profil. Édge Function `admin-resultats` protégée par mot de passe unique (décision utilisateur), vérification en temps constant, jamais dans le bundle. **2 vrais tests découverts en base** en testant l'accès. RLS toujours actif : la table reste inaccessible en direct via la clé publique. |
| 4 août 2026 | **Skill `ui-ux-pro-max` installé** (7 skills, 146 fichiers) + Python 3.14.5 vérifié. **21st.dev connecté** en MCP, avec consigne stricte : structure/comportement uniquement, jamais les couleurs ou effets par défaut (style SaaS générique, contraire à la spec §16.3). Higgsfield et Framer Motion écartés par l'utilisateur — pas d'animations demandées par le manager. |
| 4 août 2026 | **Passe accessibilité** issue des checklists du skill : focus clavier rendu visible sur les 90 options de réponse (`has-[:focus-visible]`, le radio étant `sr-only`), `role="alert"` sur les erreurs de formulaire, `inputmode="email"`. `.claude/**` exclu du lint (code tiers). |
| 4 août 2026 | **Passe premium.** Découverte majeure : **Lora et Inter n'étaient jamais chargées** — le site affichait Georgia/system-ui, ce qui expliquait le rendu générique. Corrigé, puis raffinements typographiques (chiffres tabulaires, ligatures, `text-wrap`), monogramme « 90 » en en-tête, rayons à 0, correction du décalage d'1px à la sélection d'une réponse. **Charte inchangée : aucune couleur ajoutée.** |
