# DESIGN PATTERN — LE TEST DES 90 JOURS

> Charte graphique et système de design.
> Contraintes issues de la spécification §16.3. **Version de travail — à affiner avec le manager.**

---

## 1. LE BRIEF EN UNE PHRASE

> Un grand cabinet de conseil (Deloitte, PwC) qui pose une question grave à un dirigeant.

Ce que cela implique concrètement :

| ✅ Oui | ❌ Non |
|---|---|
| Sobriété, retenue, blanc | Dégradés, ombres portées, glassmorphism |
| Autorité par la typographie | Autorité par la couleur |
| Espace vide généreux | Densité, remplissage |
| Une seule chose par écran | Listes, colonnes multiples |
| Silence visuel | Emoji, illustrations, icônes décoratives |

**Le test de validation :** si l'écran ressemble à un quiz Buzzfeed ou à une app de productivité,
c'est raté. S'il ressemble à la première page d'un rapport d'audit, c'est réussi.

---

## 2. CONTRAINTES IMPOSÉES PAR LA SPÉCIFICATION

Ces contraintes ne sont pas négociables — elles viennent du document source §16.3.

| Élément | Contrainte |
|---|---|
| Palette | **Deux couleurs maximum + trois gris.** Aucun rouge alarmiste, aucun vert rassurant. |
| Typographie | **Une serif pour les titres** (autorité), **une sans-serif pour le corps** (lisibilité mobile). |
| Graphiques du rapport | **Trois jauges linéaires + un radar à trois branches. Rien de plus.** |
| Photographie | **Aucune photo d'illustration générique.** Si visuel : uniquement l'équipe réelle, nommée. |
| Signature du rapport | Un nom et une fonction réels. **Jamais « L'équipe ».** |
| Gamification | **Aucune.** Pas d'emoji, pas de confettis, pas de barre colorée qui se remplit. |
| Poids | **< 400 Ko** par page. Chargement < 2 s en 3G. |
| Mobile | **Mobile d'abord** — > 80 % des accès. Zones de tap larges. |

### Pourquoi « aucun rouge alarmiste, aucun vert rassurant »

C'est la contrainte la plus importante et la plus contre-intuitive. Un score bas ne doit **pas**
s'afficher en rouge. La couleur porterait le jugement à la place du texte, et transformerait un
diagnostic en verdict. **La gravité doit venir du contenu, jamais de la couleur.**

Conséquence directe : **les jauges du rapport sont monochromes.** Un score de 18/100 et un score
de 84/100 utilisent exactement la même couleur. Seule la longueur du remplissage diffère.

---

## 3. PALETTE

### 3.1 Les deux couleurs

| Rôle | Nom | Hex | Usage |
|---|---|---|---|
| **Primaire** | Encre | `#1B2A3A` | Titres, texte fort, remplissage des jauges, fonds sombres |
| **Accent** | Laiton | `#9A7B4F` | Un seul usage par écran : l'élément actif, le trait de soulignement, l'Indice 90 |

**Règle d'usage de l'accent :** le laiton est rare. Un seul élément accentué par écran.
S'il y en a deux, c'est qu'il y en a un de trop.

### 3.2 Les trois gris

| Nom | Hex | Usage |
|---|---|---|
| Papier | `#FAF9F7` | Fond de page — blanc cassé chaud, pas de blanc pur (fatigue en lecture mobile) |
| Trait | `#DDD9D3` | Bordures, séparateurs, jauge vide |
| Gris texte | `#6B7280` | Texte secondaire, mentions, légendes |

### 3.3 Palette complète

```
Encre        #1B2A3A   ████████
Laiton       #9A7B4F   ████████
Papier       #FAF9F7   ████████
Trait        #DDD9D3   ████████
Gris texte   #6B7280   ████████
```

**C'est tout.** Aucune autre couleur n'est autorisée dans l'interface ni dans le rapport.

### 3.4 Cas particulier — l'encadré du protocole de sécurité

Le seul bloc qui se distingue visuellement. Il ne doit **pas** alarmer : ni rouge, ni icône
d'avertissement. Traitement retenu : **fond papier légèrement assombri + filet laiton à gauche**.
Il attire l'œil sans dramatiser.

---

## 4. TYPOGRAPHIE

### 4.1 Les deux familles

| Rôle | Police | Fallback | Justification |
|---|---|---|---|
| **Titres** | **Lora** (serif) | Georgia, serif | Serif de lecture, autorité sans raideur, excellente en écran. Variable font disponible. |
| **Corps** | **Inter** (sans-serif) | system-ui, sans-serif | Conçue pour l'écran, hauteur d'x élevée, très lisible en petit sur mobile. |

**Contrainte de poids :** chargement en woff2, **sous-ensemble latin uniquement**, poids limités
aux graisses réellement utilisées. Budget typographie : **< 80 Ko au total**.

Graisses chargées :
- Lora : 500 (medium), 600 (semibold) → 2 fichiers
- Inter : 400 (regular), 500 (medium) → 2 fichiers

### 4.2 Échelle typographique

Mobile d'abord. Les valeurs desktop sont entre parenthèses quand elles diffèrent.

| Usage | Police | Taille | Graisse | Interligne | Interlettrage |
|---|---|---|---|---|---|
| Indice 90 (couverture) | Lora | 96px (128px) | 600 | 1 | -0,03em |
| Nombre de jours | Lora | 40px (56px) | 500 | 1,1 | -0,02em |
| Titre de page | Lora | 28px (36px) | 600 | 1,2 | -0,02em |
| Énoncé de question | Lora | 22px (28px) | 500 | 1,35 | -0,01em |
| Sous-titre / transition | Inter | 17px (18px) | 400 | 1,6 | 0 |
| Corps | Inter | 16px | 400 | 1,65 | 0 |
| Option de réponse | Inter | 16px | 400 | 1,45 | 0 |
| Légende / mention | Inter | 13px | 400 | 1,5 | 0,01em |
| Sur-titre (« QUESTION 7 / 18 ») | Inter | 12px | 500 | 1 | 0,12em, majuscules |

### 4.3 Règles de composition

- **Longueur de ligne : 60–70 caractères maximum** en corps de texte. Au-delà, la lecture décroche.
- **Jamais de justification.** Alignement à gauche uniquement — la justification crée des rivières
  sur mobile.
- **Jamais de texte en majuscules** au-delà du sur-titre. Les majuscules ralentissent la lecture.
- **Jamais d'italique pour l'emphase.** Utiliser la graisse ou l'espace.

---

## 5. ESPACEMENT ET GRILLE

### 5.1 Échelle d'espacement

Base 4px. Valeurs autorisées uniquement :

```
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128
```

Une valeur hors de cette échelle est un bug.

### 5.2 Grille

| Contexte | Largeur max | Marge latérale |
|---|---|---|
| Mobile (< 640px) | 100 % | 24px |
| Tablette | 100 % | 48px |
| Desktop | **640px, centré** | auto |

**Le contenu ne dépasse jamais 640px de large**, même sur un écran de 2560px. Le vide latéral
est intentionnel : c'est ce qui fait « document » plutôt que « application ».

### 5.3 Rythme vertical d'un écran de question

```
┌─────────────────────────────┐
│                             │  ← 64px de respiration haute
│  QUESTION 7 / 18            │  ← sur-titre, gris texte
│                             │  ← 24px
│  Vous êtes hospitalisé      │  ← énoncé, Lora 22px
│  demain, sans possibilité   │
│  de communiquer, pour       │
│  90 jours. Au bout de       │
│  combien de temps un        │
│  client ou un fournisseur   │
│  important s'en             │
│  apercevrait-il ?           │
│                             │  ← 48px
│  ┌───────────────────────┐  │
│  │ Moins de 48 heures    │  │  ← option, 64px de haut min
│  └───────────────────────┘  │
│           8px               │
│  ┌───────────────────────┐  │
│  │ Environ une semaine   │  │
│  └───────────────────────┘  │
│           …                 │
│                             │  ← 64px
│  ─────────────────────      │  ← barre de progression, 2px
└─────────────────────────────┘
```

---

## 6. COMPOSANTS

### 6.1 Option de réponse (`RadioCard`)

Le composant le plus utilisé du produit — 90 occurrences au total (18 × 5).

| État | Fond | Bordure | Texte |
|---|---|---|---|
| Repos | Papier | 1px Trait | Encre |
| Survol | Papier assombri 2 % | 1px Encre 30 % | Encre |
| Sélectionné | Papier | **2px Laiton** | Encre |
| Focus clavier | — | Contour 2px Laiton, décalé 2px | — |

**Contraintes :**
- Hauteur minimale **64px** — zone de tap confortable au pouce
- Toute la carte est cliquable, pas seulement le libellé
- Rayon d'angle : **2px** (presque droit — un rayon marqué fait « app grand public »)
- **Aucun rond de radio visible.** La sélection se lit par la bordure. Un input radio natif est
  présent mais masqué visuellement, pour l'accessibilité.
- Transition : `120ms ease-out` sur la bordure uniquement. Rien d'autre ne bouge.

### 6.2 Barre de progression

Spec §16.1 : *« Position en bas, fine, sans pourcentage criard. »*

- Hauteur : **2px**
- Fond : Trait · Remplissage : **Encre** (pas laiton — la progression n'est pas un accent)
- Position : bas de l'écran, pleine largeur
- **Aucun chiffre, aucun pourcentage.** L'information « Question 7/18 » est portée par le sur-titre.
- Transition : `300ms ease-out`

### 6.3 Bouton principal

| État | Fond | Texte | Bordure |
|---|---|---|---|
| Repos | Encre | Papier | — |
| Survol | Encre 90 % | Papier | — |
| Désactivé | Trait | Gris texte | — |

- Hauteur : **52px** minimum
- Rayon : 2px
- Inter 16px, graisse 500
- Libellés : **un mot ou deux.** « Commencer », « Continuer », « Voir mon résultat ».
  Jamais « C'est parti ! », jamais de point d'exclamation.

### 6.4 Champ de saisie

- Hauteur : 52px
- Bordure basse uniquement, 1px Trait → **2px Encre** au focus
- Pas de fond, pas de rayon
- Label au-dessus, Inter 13px, gris texte
- Erreur : le message apparaît sous le champ, en Encre (**pas en rouge**), précédé d'un tiret

### 6.5 Jauge linéaire (rapport)

- Hauteur : 8px, rayon 0
- Fond : Trait · Remplissage : **Encre**, monochrome quel que soit le score
- Le score chiffré est à droite, Lora
- Une seule graduation visible : **le seuil de 50** (trait vertical fin)

### 6.6 Radar à trois branches (rapport)

- Trait 1,5px Encre, remplissage Encre à 8 % d'opacité
- Grille : cercles concentriques 1px Trait, à 25 / 50 / 75 / 100
- Trois libellés : « L'entreprise sans vous », « Ceux qui vous entourent », « Vous »
- **Aucune couleur, aucune légende.** Trois branches, c'est lisible sans légende.

---

## 7. MOUVEMENT

**Principe : le mouvement sert la continuité, jamais la décoration.**

| Transition | Durée | Courbe |
|---|---|---|
| Changement de question | 200ms | fondu + translation 8px vers le haut |
| Sélection d'une réponse | 120ms | ease-out, bordure uniquement |
| Barre de progression | 300ms | ease-out |
| Apparition du résultat | 600ms | fondu simple, **sans compteur animé** |

**Interdits :** rebond, élasticité, rotation, mise à l'échelle, compteur qui défile jusqu'au score,
apparition en cascade des éléments.

> Le score s'affiche. Il ne se révèle pas.

**Respect de `prefers-reduced-motion`** : toutes les transitions sont supprimées, les changements
sont instantanés.

---

## 8. L'ÉCRAN DE RÉSULTAT — traitement particulier

C'est le moment le plus important du parcours. La spec §9.4 est explicite :
*« L'affichage doit être sobre et sans emphase. Toute dramatisation typographique affaiblit l'effet. »*

```
┌─────────────────────────────┐
│                             │
│                             │
│  Indice 90                  │  ← Inter 13px, gris texte
│                             │
│  34                         │  ← Lora 96px, Encre
│  ── / 100                   │
│                             │  ← 48px
│  Votre entreprise           │  ← Lora 28px, Encre
│  fonctionne environ         │
│  14 jours sans vous.        │
│                             │  ← 32px
│  Le seuil au-delà duquel    │  ← Inter 16px, gris texte
│  une entreprise est         │
│  considérée comme           │
│  transférable est de        │
│  90 jours.                  │
│                             │
└─────────────────────────────┘
```

Rien d'autre sur cet écran. Pas de bouton de partage, pas de récapitulatif, pas de jauge.
Le rapport arrive par email — c'est lui qui porte l'analyse.

---

## 9. ACCESSIBILITÉ

| Critère | Exigence |
|---|---|
| Contraste texte | ≥ 4,5:1 — Encre sur Papier = 13,8:1 ✅ |
| Contraste gris texte | Gris texte sur Papier = 4,9:1 ✅ |
| Navigation clavier | Parcours complet réalisable au clavier |
| Focus visible | Contour laiton 2px, décalé, jamais supprimé |
| Cible de tap | ≥ 44×44px partout (RadioCard : 64px) |
| Lecteur d'écran | Inputs radio natifs masqués visuellement, `aria-live` sur le changement de question |
| Mouvement réduit | `prefers-reduced-motion` respecté |

---

## 10. CE QUI EST INTERDIT — liste de contrôle

Avant de valider un écran, vérifier qu'aucun de ces éléments n'est présent :

- [ ] Emoji
- [ ] Icône décorative
- [ ] Photo d'illustration générique (banque d'images)
- [ ] Dégradé
- [ ] Ombre portée
- [ ] Rouge, vert, orange, ou toute couleur hors palette
- [ ] Point d'exclamation
- [ ] Compteur animé
- [ ] Confettis, célébration, félicitations
- [ ] Barre de progression colorée ou avec pourcentage
- [ ] Rayon d'angle > 4px
- [ ] Plus d'un élément en laiton sur l'écran
- [ ] Ligne de texte > 70 caractères
- [ ] Texte justifié

---

## 11. À AFFINER AVEC LE MANAGER

| # | Point | État |
|---|---|---|
| 1 | Validation de la palette (Encre / Laiton) | Proposition — à valider |
| 2 | Validation des polices (Lora / Inter) | Proposition — à valider |
| 3 | Existe-t-il une identité visuelle du cabinet à respecter ? | **Question ouverte** |
| 4 | Logo disponible ? | **Question ouverte** |
| 5 | Nom et fonction pour la signature du rapport | **Question ouverte — bloquant Phase 7** |
| 6 | Photo de l'équipe réelle disponible ? *(seul visuel autorisé)* | Question ouverte |
