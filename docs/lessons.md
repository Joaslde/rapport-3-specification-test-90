# LESSONS — Journal des bugs et des leçons apprises

> Rempli **après chaque correction de bug**.
> Relu **à chaque démarrage de session**, avant de toucher au code.
>
> Format : `[date] | ce qui a mal tourné | cause racine | règle pour l'éviter`

---

## RÈGLES ACTIVES

*Règles issues des bugs déjà rencontrés. À appliquer systématiquement.*

*(Aucune pour l'instant — le projet démarre.)*

---

## RÈGLES PRÉVENTIVES — issues de l'analyse de la spécification

Ces règles ne viennent pas de bugs rencontrés mais de pièges identifiés à la lecture du
document de spécification. Elles ont le même statut contraignant.

| # | Règle | Pourquoi |
|---|---|---|
| P1 | **Ne jamais calculer le score côté client.** | Le barème serait lisible dans le bundle JS, le score manipulable, et les données du futur Baromètre invalidées. |
| P2 | **Ne jamais inventer de chiffre de benchmark.** | Règle absolue de la spec §17.1 : un chiffre fabriqué découvert détruit la crédibilité de l'ensemble. Sous 200 répondants → aucune comparaison. |
| P3 | **Ne jamais reformuler une question ou une réponse** sans validation du manager. | Chaque libellé est calibré pour contourner le biais d'auto-flatterie. Une reformulation casse l'instrument. |
| P4 | **Aucun adjectif dramatique dans le scénario de rupture.** Aucune faillite, aucun reproche. | La sobriété est ce qui rend le texte crédible. La dramatisation le décrédibilise. |
| P5 | **Le protocole de sécurité prime sur tout affichage commercial.** | Exigence déontologique. Un dirigeant en épuisement ne reçoit ni scénario de rupture ni sollicitation. |
| P6 | **Aucune URL en `.html`.** | Exigence explicite et répétée du manager. |
| P7 | **Vérifier le poids de page à chaque ajout de dépendance.** Cible < 400 Ko. | Contrainte réseau réelle sur la zone cible. 80 % des accès viennent d'un mobile en 3G. |
| P8 | **Aucune gamification.** Pas d'emoji, pas de confettis, pas de couleur criarde. | Le sujet est la survie de l'entreprise. Le traitement doit être à la hauteur. |
| P9 | **La réponse la plus faible doit rester digne.** | Un dirigeant qui se sent méprisé abandonne le test. |
| P10 | **Les réponses de l'Axe 3 sont des données de santé.** Traitement en catégorie sensible. | Obligation RGPD + promesse faite au répondant : *« Elles ne sortiront pas d'ici. »* |

---

## JOURNAL DES BUGS

### [3 août 2026] — Badge Vue DevTools visible en production sur Vercel

**Ce qui a mal tourné :**
L'utilisateur a signalé, une fois déployé sur Vercel, que le logo/badge flottant de Vue
DevTools restait affiché sur le site en ligne — donnant une impression de site non fini
sur un produit qui se veut « niveau grand cabinet ».

**Cause racine :**
`vite.config.js` activait `vueDevTools()` sans condition : `plugins: [vue(), vueDevTools(), tailwindcss()]`.
Ce plugin injecte son overlay dans le HTML servi, y compris sur un `vite build` de production —
il n'est pas désactivé automatiquement par le mode.

**Correction appliquée :**
`vite.config.js` exporte désormais une fonction `(​{ mode }) => ({...})` et n'active
`vueDevTools()` que si `mode === 'development'`. Effet de bord : `vitest.config.js` important
`vite.config.js` via `mergeConfig` ne supporte pas un export en forme de callback — il faut
résoudre la fonction avant de la fusionner (`viteConfigFn({ mode: 'test', command: 'serve' })`).

**Vérification :** `npm run build` puis `grep -r "vue-devtools" dist/` → absent. `npx vitest run`
→ 122 tests toujours au vert.

**Règle pour l'éviter :**
> **L14 — Tout plugin de développement (devtools, inspecteur, overlay) doit être
> conditionné explicitement au mode, jamais activé par défaut.** Vérifier le HTML généré par
> `npm run build` (pas seulement `npm run dev`) avant tout déploiement.

---

### [3 août 2026] — Favicon resté celui du template Vue

**Ce qui a mal tourné :**
Le favicon affiché en production était toujours le logo Vue.js par défaut du scaffolding
`create-vue` — jamais remplacé, repéré seulement une fois le site déployé sur Vercel.

**Cause racine :**
Oubli pur : `public/favicon.ico` n'a jamais été régénéré depuis la Phase 0. Aucune règle du
projet ne couvrait cet élément, alors que la charte graphique (`docs/design-pattern.md`)
s'applique à toute l'identité visuelle, favicon inclus.

**Correction appliquée :**
Favicon régénéré aux couleurs de la charte (fond Encre, « 90 » en Papier, filet Laiton) —
`.ico` multi-résolution (16/32/48) pour compatibilité large, plus `favicon.svg` en priorité
pour les navigateurs modernes (net à toute taille). Les deux référencés dans `index.html`.

**Règle pour l'éviter :**
> **L15 — Le scaffolding d'un framework laisse des artefacts de marque par défaut
> (favicon, titre, métadonnées) qui doivent être traités comme faisant partie de la charte
> graphique, pas comme des détails techniques.** À vérifier explicitement en fin de Phase 1
> (design system), pas découvert a posteriori en production.

---

### [3 août 2026] — ⚠️ Des tests de sécurité qui passaient sans rien vérifier

**Ce qui a mal tourné :**
Les tests « le PDF ne contient AUCUN texte du scénario de rupture » et « AUCUNE sollicitation
commerciale » passaient au vert. Ils ne vérifiaient rien : mon extracteur de texte renvoyait
une chaîne **vide**. `''.includes('Au jour 90')` est `false` — le test passait quel que soit
le contenu réel du fichier.

**Cause racine :**
pdf-lib écrit les chaînes de texte en **hexadécimal** (`<444F43…> Tj`), pas en littéral
parenthésé (`(texte) Tj`). Mon regex ne cherchait que la forme littérale et ne trouvait
jamais rien.

C'est le pire type de défaut : un test **négatif** qui échoue silencieusement donne une
fausse assurance sur exactement ce qu'il est censé garantir — ici, une exigence déontologique.

**Correction appliquée :**
1. Extraction des deux formes, hexadécimale et littérale.
2. Surtout : un garde-fou `verifierExtracteur()` qui **lève une exception** si l'extraction
   renvoie moins de 200 caractères, plus deux tests positifs sur l'extracteur lui-même.

**Vérification :** le garde-fou a immédiatement fait tomber 8 tests qui étaient faussement
au vert. Après correction de l'extracteur : 122 tests passent.

**Règle pour l'éviter :**
> **L10 — Tout test négatif (« X n'est pas présent ») doit être accompagné d'un test positif
> sur le même instrument de mesure.** Sans preuve que l'outil sait trouver quelque chose,
> son silence ne prouve rien. Pour un test sur un format binaire ou compressé, toujours
> commencer par vérifier que l'extraction produit du contenu.

---

### [3 août 2026] — `StandardFonts.TimesBold` n'existe pas

**Ce qui a mal tourné :**
`embedFont(StandardFonts.TimesBold)` échouait avec `font must be of type string […] but was
actually of type undefined`. Le message pointait vers le type de l'argument, pas vers sa source.

**Cause racine :**
Le nom correct dans pdf-lib est **`TimesRomanBold`**, pas `TimesBold`. `StandardFonts.TimesBold`
vaut `undefined`, transmis tel quel à `embedFont`. J'ai supposé le nom au lieu de le vérifier.

**Correction appliquée :** `TimesRoman`, `TimesRomanBold`, `Helvetica`, `HelveticaBold`,
`HelveticaOblique` — noms vérifiés par énumération de `Object.keys(StandardFonts)`.

**Règle pour l'éviter :**
> **L11 — Ne jamais deviner le nom d'une constante d'API.** Un `undefined` passé à une
> fonction produit un message d'erreur qui décrit le symptôme, jamais la cause.
> Énumérer les clés réelles (`Object.keys`) coûte dix secondes.

---

### [3 août 2026] — Une page 7 vide sur les profils solides

**Ce qui a mal tourné :**
`TypeError: p.paragraphes is not iterable` à la génération du PDF pour un profil bien structuré.

**Cause racine — un défaut de conception, pas seulement un bug :**
Sur un profil solide, aucun des neuf déclencheurs de la matrice §13.2 n'est rempli.
`assemblerScenario()` renvoyait `null`, mais l'assembleur créait quand même la page.
Au-delà du plantage, la vraie question était : que raconte une page « scénario de rupture »
quand il n'y a rien à raconter ? Une page « rien ne se passerait » affaiblirait l'instrument.

**Correction appliquée :**
La page est **omise** quand aucun bloc n'est déclenché, et les pages suivantes sont
**renumérotées** pour qu'aucun numéro ne saute. Un indicateur `meta.scenarioOmis` distingue
ce cas de l'omission pour protocole de sécurité.

**Règle pour l'éviter :**
> **L12 — Un plantage sur un cas limite cache souvent une question de conception non tranchée.**
> Avant de corriger par un `?? []`, se demander ce que le produit doit faire dans ce cas —
> la bonne réponse est parfois « ne rien afficher », pas « afficher vide ».

---

### [3 août 2026] — Rendu PDF en image impossible sous Node

**Ce qui a mal tourné :**
La conversion des PDF en PNG pour vérification visuelle produisait des images **entièrement
blanches**, alors que les PDF contenaient bien du texte (vérifié par extraction).

**Cause racine :**
Incompatibilité entre `pdfjs-dist` et `node-canvas` dans cet environnement : `page.render()`
se termine sans erreur mais n'écrit aucun pixel (0 pixel non blanc sur toute la page).
Le PDF n'était pas en cause.

**Contournement appliqué :**
Vérification de la mise en page par **extraction du texte avec ses coordonnées** :
chaque ligne, sa position `x`/`y`, et détection automatique des débordements hors marges.
Moins visuel, mais plus fiable et automatisable.

**Règle pour l'éviter :**
> **L13 — Quand un outil de vérification échoue, distinguer d'abord si le défaut est dans
> l'artefact ou dans l'instrument.** Ici : deux minutes de diagnostic (le canvas seul
> fonctionne-t-il ? le PDF contient-il du texte ?) ont évité de chercher un bug inexistant
> dans le générateur.

### [3 août 2026] — ⚠️ FAILLE : `anon` pouvait supprimer des sessions

**Ce qui a mal tourné :**
Test de pénétration : `DELETE /rest/v1/sessions?id=eq.<uuid>` avec la clé publique
retournait **HTTP 204**. Un attaquant pouvait effacer les réponses de n'importe quel répondant.

**Cause racine :**
Supabase applique un `GRANT ALL` par défaut aux rôles `anon` et `authenticated` sur les tables
créées dans le schéma `public`. Je pensais qu'« absence de politique RLS DELETE » suffisait à
bloquer — c'est faux : le privilège SQL restait, et la politique `UPDATE` existante rendait la
ligne visible à l'opération.

**Correction appliquée :**
`revoke delete, truncate, references, trigger on ... from anon, authenticated`
sur toutes les tables, plus `revoke all` sur `resultats` et `barometre_config`.

**Vérification :** `DELETE` renvoie désormais **HTTP 401** sur `sessions` et `evenements`.

**Règle pour l'éviter :**
> **L6 — Sur Supabase, RLS ne suffit pas : les privilèges SQL par défaut sont permissifs.**
> Après toute création de table, révoquer explicitement `delete`, `truncate`, `references`,
> `trigger` pour `anon` et `authenticated`, puis accorder au cas par cas — idéalement
> **colonne par colonne**. Et toujours vérifier par une vraie requête HTTP, pas par lecture
> des politiques.

---

### [3 août 2026] — Politique RLS bloquée par un privilège de colonne

**Ce qui a mal tourné :**
L'insertion d'un événement de tracking renvoyait **HTTP 401** alors que la politique
semblait correcte.

**Cause racine :**
La politique vérifiait l'existence de la session par
`exists (select 1 from sessions where id = ...)`. Or `anon` n'a le privilège `SELECT` que sur
la colonne `id` de `sessions` : la sous-requête déclenchait un contrôle de privilège sur la
table entière, refusé.

**Correction appliquée :**
Une fonction `session_active(uuid)` en `SECURITY DEFINER` qui ne renvoie **qu'un booléen**,
sans exposer la moindre colonne. La politique appelle cette fonction.

**Règle pour l'éviter :**
> **L7 — Une politique RLS qui interroge une autre table s'exécute avec les privilèges du
> rôle appelant.** Si ce rôle n'a que des privilèges de colonne, la sous-requête échoue.
> Encapsuler le contrôle dans une fonction `SECURITY DEFINER` qui ne retourne qu'un booléen.

---

### [3 août 2026] — Test PostgREST faussement en échec (`return=representation`)

**Ce qui a mal tourné :**
La création de session échouait avec `permission denied for table sessions`, alors que le
privilège `INSERT` était bien accordé. J'ai d'abord cru à un problème de privilèges.

**Cause racine :**
`Prefer: return=representation` **sans** `?select=id` demande à PostgREST de retourner
*toutes* les colonnes — ce qui exige un `SELECT` sur la table entière, volontairement révoqué.
Le privilège d'insertion n'était pas en cause.

**Correction appliquée :**
Appeler `POST /rest/v1/sessions?select=id` avec `return=representation`. Le client
`supabase-js` fait la même chose via `.insert(...).select('id')`.

**Règle pour l'éviter :**
> **L8 — Avec des privilèges de colonne, toujours restreindre explicitement le `select`
> de retour.** Un `RETURNING *` implicite fait échouer l'écriture pour une raison de lecture —
> et le message d'erreur pointe vers le mauvais problème.

---

### [3 août 2026] — Compteur du Baromètre à zéro : ce n'était pas un bug

**Ce qui a mal tourné (en apparence) :**
Après 2 résultats calculés, `barometre_config.nb_repondants` restait à 0. J'ai suspecté
le trigger.

**Cause racine — comportement correct :**
Le contrôle anti-bot (spec §6.2 de `docs/securite.md`) marque `qualite = 'suspecte'` toute
session bouclée en moins de 45 secondes. Mes tests par `curl` répondaient aux 18 questions en
2 secondes. Le trigger ne compte que les sessions `ok` — il fonctionnait exactement comme prévu.

**Vérification :** en reculant `demarre_le` de 7 minutes, `nb_repondants` passe à 1 et
`indice_median` à 50.

**Règle pour l'éviter :**
> **L9 — Un test automatisé ne reproduit pas le rythme humain.** Avant de conclure à un bug
> sur une métrique, vérifier qu'aucun contrôle anti-abus n'a disqualifié le jeu de données de
> test. Pour tester une règle temporelle, manipuler l'horodatage plutôt que d'attendre.

### [2 août 2026] — ⚠️ La formule et la table de la spécification divergent (§9.1 vs §9.2)

**Ce qui a mal tourné :**
Les tests écrits contre la table publiée en §9.2 échouaient sur 3 valeurs sur 10.

**Cause racine — ce n'est pas un bug du code, c'est une incohérence du document source :**

| Indice 90 | Formule `3·e^(I/21)` | Arrondi | Table §9.2 | Écart |
|---|---|---|---|---|
| 30 | 12,518 | **13** | 12 | troncature au lieu d'arrondi |
| 90 | 217,963 | **218** | 217 | troncature au lieu d'arrondi |
| 100 | 350,906 | **351** | **365** | **+14 — la table force l'année pleine** |

Les cas 30 et 90 s'expliquent par une troncature. Le cas 100 ne s'explique ni par troncature ni
par arrondi : la table cale volontairement la borne haute sur 365 pour la cohérence narrative
(« Entreprise entièrement transférable » = une année complète).

**Arbitrage (utilisateur) :** **la formule fait autorité.** La table §9.2 devient indicative.
Point à signaler au manager.

**Conséquence pratique :** l'écart est de 1 jour sur la plage réellement observée (distribution
attendue entre 25 et 55 d'Indice 90, spec §9.3). Il n'atteint 14 jours qu'à I=100, score
quasi inexistant (~5 % de la cohorte au-dessus de 81).

**Règle pour l'éviter :**
> **L4 — Quand un document de spécification publie à la fois une formule et une table de
> valeurs, vérifier qu'elles coïncident AVANT d'écrire le code.** Ne pas supposer que l'auteur
> a calculé sa propre table. En cas de divergence, ne pas trancher seul : remonter l'écart chiffré.

---

### [2 août 2026] — Audit de sécurité faussement positif (`-Include` sans wildcard)

**Ce qui a mal tourné :**
Mon audit du bundle a annoncé **6 fuites du barème**. Panique injustifiée : il n'y en avait aucune.

**Cause racine :**
`Get-ChildItem "dist" -Recurse -File -Include *.js` ne filtre rien quand le chemin ne contient pas
de wildcard — PowerShell ignore `-Include` dans ce cas et retourne une liste vide.
`Select-String -Quiet` sur une entrée vide retourne `$null`, et mon `if ($hit)` inversait la
lecture du résultat. Chaque motif était donc rapporté comme « fuite ».

**Correction appliquée :**
Filtrage par `Where-Object { $_.Extension -in ".js",".css",".html" }`, et test explicite
`if ($null -ne $r)`. L'audit affiche désormais le nombre de fichiers réellement inspectés —
c'est ce compteur qui aurait révélé le problème immédiatement.

**Vérification :** 8 fichiers audités, 8 motifs testés, 0 occurrence. Le barème ne fuit pas.

**Règle pour l'éviter :**
> **L5 — Un audit de sécurité doit afficher le volume de ce qu'il a réellement inspecté.**
> Un test qui ne dit pas « j'ai examiné N fichiers » peut n'avoir rien examiné du tout.
> Corollaire de L3 : un résultat de sécurité inattendu — dans les deux sens — commence par
> une mise en doute de l'instrument de mesure.

### [2 août 2026] — Le `.gitignore` généré n'ignorait pas les fichiers `.env`

**Ce qui a mal tourné :**
Le `.gitignore` produit par `create-vue` ne contient **aucune règle sur `.env`**. Il couvre
`node_modules`, `dist`, les logs — mais pas les secrets. Sans correction, le premier `git add -A`
après création du `.env` aurait versionné les clés Supabase et Resend.

**Cause racine :**
Supposition implicite qu'un scaffolding moderne protège les secrets par défaut. Ce n'est pas le
cas : `create-vue` ne génère pas de `.env`, donc il ne l'ignore pas. Violation du principe
« ne jamais supposer — vérifier ».

**Correction appliquée :**
Ajout en tête de `.gitignore` d'un bloc secrets : `.env`, `.env.*`, `!.env.example`, `*.key`,
`*.pem`, `secrets.json`, plus les dossiers temporaires Supabase.

**Vérification :**
Création d'un `.env` de test → `git init` → `git add -A` → `git ls-files` ne le contient pas,
`.env.example` oui. Dépôt de test et `.env` supprimés ensuite.

**Règle pour l'éviter :**
> **L1 — Après tout scaffolding, inspecter le `.gitignore` généré et y ajouter les secrets
> AVANT de créer le moindre fichier de configuration.** Ne jamais supposer qu'un outil protège
> les secrets par défaut. Vérifier par un test réel (`git ls-files`), pas par lecture du fichier.

---

### [2 août 2026] — Erreur de build : `manualChunks` en objet sous Vite 8

**Ce qui a mal tourné :**
`npm run build` échouait sur `TypeError: manualChunks is not a function`. J'avais écrit
`manualChunks` sous la forme d'un objet `{ vendor: [...] }` — la syntaxe Rollup classique.

**Cause racine :**
Vite 8 utilise **Rolldown** et non Rollup. Rolldown n'accepte `manualChunks` que sous forme de
fonction. La syntaxe objet, valide pendant des années, ne l'est plus.

**Correction appliquée :**
```js
manualChunks(id) {
  if (id.includes('node_modules')) return 'vendor'
}
```

**Vérification :**
`npm run build` passe. Découpage effectif : vendor 84,95 Ko + 4 chunks de route ~0,35 Ko chacun.
Total gzippé **37,6 Ko**, très en dessous de la contrainte de 400 Ko.

**Règle pour l'éviter :**
> **L2 — Vite 8 = Rolldown, pas Rollup.** Ne pas reprendre une configuration Rollup de mémoire.
> Vérifier la signature attendue dans la documentation de la version installée avant d'écrire
> une option de build.

---

### [2 août 2026] — Test de sécurité mal écrit (faux échec)

**Ce qui a mal tourné :**
Mon test de vérification du `.gitignore` utilisait le motif `^\.env`, qui capture aussi
`.env.example`. Le test a signalé un échec alors que la configuration était correcte.

**Cause racine :**
Motif trop large. `.env.example` **doit** être versionné — le test ne distinguait pas le fichier
à exclure du fichier à inclure.

**Correction appliquée :**
Test réécrit avec une comparaison exacte (`$files -contains ".env"`) plutôt qu'une correspondance
de préfixe.

**Règle pour l'éviter :**
> **L3 — Un test de sécurité qui échoue doit d'abord être suspecté lui-même.** Avant de conclure
> à une faille, vérifier que le test mesure bien ce qu'il prétend mesurer. Pour une vérification
> de présence de fichier, utiliser une égalité exacte, jamais un préfixe.

### [5 août 2026] — Une table de spécification recopiée au lieu d'être recalculée

**Ce qui a mal tourné :**
La table de conversion Indice → jours (spec §9.2) divergeait de la formule §9.1 sur 3 valeurs.
J'avais signalé l'écart et tranché « la formule fait autorité ». L'audit du cabinet a montré que
la conclusion était juste mais **insuffisante** : la formule elle-même était mal calibrée
(plafond de 350,91 jours, donc clause « plafonné à 365 » inatteignable). Sept défauts
supplémentaires que je n'avais pas vus, dont trois auraient produit des résultats faux en
production.

**Cause racine :**
Je me suis arrêté à la contradiction visible (table vs formule) sans vérifier la **cohérence
d'ensemble** : est-ce que la formule atteint bien ses bornes annoncées ? est-ce que l'ordre des
opérations est spécifié ? est-ce que toutes les branches sont couvertes ? La question posée était
« qui a raison » alors qu'elle aurait dû être « le système est-il complet ».

**Correction appliquée :**
Formule recalibrée sur ses deux bornes, arrondi commercial explicite, Indice arrondi avant toute
opération aval, 8 archétypes au lieu de 6, protocole de détresse passé d'une conjonction (0,32 %
de déclenchement) à un décompte de signaux (14 %). Les 101 valeurs de référence sont désormais un
fichier CSV testé automatiquement.

**Règle pour l'éviter :**
> **L16 — Une incohérence trouvée dans une spécification est un symptôme, pas le bug.** Quand deux
> parties d'un document se contredisent, ne pas se contenter d'arbitrer entre les deux : vérifier
> l'ensemble du système autour (bornes atteintes, branches couvertes, ordre des opérations,
> taux de déclenchement réels). Le défaut visible est rarement le seul.

> **L17 — Aucune table numérique n'est recopiée à la main.** Toute table de référence est générée
> par le calcul et livrée comme jeu de test exécutable. Règle imposée par le cabinet le
> 3 août 2026, applicable à tous les documents du projet.

<!--
Modèle d'entrée :

### [JJ mois AAAA] — Titre court du bug

**Ce qui a mal tourné :**

**Cause racine :**

**Correction appliquée :**

**Règle pour l'éviter :**

-->
