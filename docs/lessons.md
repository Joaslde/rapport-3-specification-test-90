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

<!--
Modèle d'entrée :

### [JJ mois AAAA] — Titre court du bug

**Ce qui a mal tourné :**

**Cause racine :**

**Correction appliquée :**

**Règle pour l'éviter :**

-->
