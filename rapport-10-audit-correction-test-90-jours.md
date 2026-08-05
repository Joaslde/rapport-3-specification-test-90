# LE TEST DES 90 JOURS

## Note d'audit et de correction — vérification intégrale du moteur de calcul

**Date :** 3 août 2026 **Objet :** Réponse aux anomalies remontées par le développeur, audit complet du moteur, corrections opposables **Statut :** Cette note corrige et complète les sections 9, 10 et 14 de la spécification. Elle prévaut sur ces sections.

---

## SOMMAIRE

1. Verdict et synthèse des anomalies  
2. **Anomalie zéro : le développeur travaille sur une version périmée**  
3. Vérification de la formule actuelle — les trois erreurs confirmées  
4. La cause racine, et la règle qui l'élimine  
5. La formule corrigée  
6. Les règles d'arrondi — quatre défauts non détectés  
7. Les archétypes croisés — deux combinaisons manquantes  
8. Le protocole de sécurité — une faille de détection  
9. Autres défauts relevés  
10. La table de référence  
11. Implémentation de référence  
12. Réponses aux questions du développeur  
13. Protocole de recette

---

## 1\. VERDICT ET SYNTHÈSE DES ANOMALIES

**Le développeur a raison sur les trois erreurs de calcul et sur les deux archétypes manquants. Ses cinq constats sont exacts, sans exception.** Il a par ailleurs eu le réflexe correct : recalculer plutôt que recopier, et signaler plutôt que corriger en silence.

L'audit complet que j'ai conduit fait apparaître **onze défauts**, dont cinq qu'il n'avait pas relevés et dont trois auraient produit des résultats faux en production.

| \# | Défaut | Gravité | Détecté par |
| :---- | :---- | :---- | :---- |
| **0** | **Version périmée de la spécification en cours d'implémentation** | **Critique** | Audit |
| 1 | Indice 30 : table indique 12, la formule donne 13 | Mineure | Développeur |
| 2 | Indice 90 : table indique 217, la formule donne 218 | Mineure | Développeur |
| 3 | Indice 100 : table indique 365, la formule donne 351 | **Majeure** | Développeur |
| 4 | La clause « plafonné à 365 » n'est jamais atteinte — code mort | Moyenne | Audit |
| 5 | Règle d'arrondi non spécifiée (commercial ou pair le plus proche) | **Majeure** | Audit |
| 6 | Ordre arrondi / classement non spécifié → **un score de 25,6 ne tombe dans aucun niveau** | **Critique** | Audit |
| 7 | Deux combinaisons d'archétypes sur huit non couvertes | **Majeure** | Développeur |
| 8 | Le rattachement provisoire choisi produirait un diagnostic faux | **Majeure** | Audit |
| 9 | Seuil « faible/fort » : le cas Axe \= 50,0 exactement n'est pas tranché | Moyenne | Audit |
| 10 | Protocole de détresse : conjonction trop stricte, détection quasi nulle | **Critique** | Audit |
| 11 | Division par zéro possible dans le Regard Croisé | Moyenne | Audit |

**Aucune de ces corrections ne remet en cause la conception de l'instrument.** Les trois axes, les dix-huit questions, les coefficients, les pondérations et les cinq niveaux sont exacts — je les ai tous revérifiés en section 9.3. Ce sont les règles d'exécution qui étaient incomplètes.

---

## 2\. ANOMALIE ZÉRO — LE DÉVELOPPEUR TRAVAILLE SUR UNE VERSION PÉRIMÉE

**C'est le point le plus important de cette note, et il est plus grave que les erreurs de calcul.**

Le fichier transmis au développeur est daté du **30 juillet 2026**. Il s'agit de la première spécification. Elle a été **remplacée le 2 août** par la spécification finale, qui intègre les sept arbitrages validés.

### 2.1 Ce que le développeur ignore et n'a donc pas construit

| Élément de la version finale | Statut dans la version du 30 juillet | Conséquence |
| :---- | :---- | :---- |
| **Le module Regard Croisé** — 18 questions miroir, invitations, Indice d'Écart, rapport comparatif de 6 pages | **Totalement absent** | **Une partie entière du produit n'existe pas dans ce qui est développé** |
| Porte email **bloquante** après Q18 | La version du 30 juillet affiche le score puis demande le profil | Parcours différent, tunnel différent |
| Séparation en trois écrans : porte / score / profil | Absente | Taux de conversion différents |
| Champ **résultat net** dans le bloc de profil | Absent | Le critère d'éligibilité principal n'est pas collecté |
| Tranches de CA et d'effectif révisées (180 M / 6 personnes) | Anciennes tranches (300 M / 10\) | Le routage commercial est faux |
| Pixel de retargeting déclenché à Q10 | Absent | Perte de récupération des abandons |
| Règle des deux répondants minimum | Sans objet | — |

Le fait que le développeur n'ait pas mentionné une seule fois le Regard Croisé dans son rapport confirme le diagnostic : il ne sait pas que ce module existe.

### 2.2 Action immédiate

1. **Transmettre au développeur la spécification finale du 2 août**, en indiquant clairement qu'elle remplace celle du 30 juillet.  
2. **Transmettre la présente note**, qui prévaut sur les sections 9, 10 et 14 de l'une comme de l'autre.  
3. **Faire un point de cadrage** pour évaluer ce qui est réutilisable et ce qui doit être repris. Le moteur de scoring, les 18 questions et la génération de PDF sont réutilisables ; le tunnel et la base de données doivent évoluer.

### 2.3 La règle de gouvernance à instaurer aujourd'hui

**Un seul document fait foi, il porte un numéro de version, et aucun prestataire ne travaille sur un fichier reçu par un autre canal.**

Chaque document remis à un prestataire porte désormais en première page : `Version X.Y — date — remplace la version Z`. C'est une règle de projet, pas une formalité : le coût de ce seul écart se compte déjà en semaines.

---

## 3\. VÉRIFICATION DE LA FORMULE ACTUELLE — LES TROIS ERREURS CONFIRMÉES

Formule inscrite en section 9.1 : `JOURS = arrondi( 3 × e^(INDICE90 / 21) )`, plafonné à 365\.

**Recalcul intégral, arrondi commercial (0,5 vers le haut) :**

| Indice | Valeur exacte | Arrondi correct | Table du document | Écart |
| ----: | ----: | ----: | ----: | ----: |
| 10 | 4,829789 | 5 | 5 | — |
| 20 | 7,775620 | 8 | 8 | — |
| **30** | **12,518202** | **13** | **12** | **\+1** |
| 40 | 20,153424 | 20 | 20 | — |
| 50 | 32,445594 | 32 | 32 | — |
| 60 | 52,235124 | 52 | 52 | — |
| 70 | 84,094875 | 84 | 84 | — |
| 80 | 135,386831 | 135 | 135 | — |
| **90** | **217,963273** | **218** | **217** | **\+1** |
| **100** | **350,905533** | **351** | **365** | **−14** |

**Les trois anomalies signalées sont confirmées, aux valeurs près.** Le développeur a raison de dire que 12 et 217 relèvent du plancher plutôt que de l'arrondi, et que 365 relève d'un chiffre écrit à la main.

### 3.1 Le défaut n°4, que le développeur pressentait

Il a écrit : *« Peut-être qu'on voulait forcer à avoir les 365 jours. »* C'est exactement cela — et c'est justement le problème.

Le maximum atteignable par la formule est de **350,91 jours**. La clause « plafonné à 365 » **n'est donc jamais activée**. C'est du code mort dans une spécification, ce qui est un défaut en soi : un développeur qui l'implémente écrit une branche qui ne s'exécutera jamais, et un relecteur qui la lit en déduit à tort que 365 est atteignable.

---

## 4\. LA CAUSE RACINE, ET LA RÈGLE QUI L'ÉLIMINE

Il faut nommer l'origine du défaut sans détour : **la table de la section 9.2 a été construite par estimation, et non calculée.** Les valeurs plausibles sont passées, les trois valeurs fausses aussi.

C'est exactement le type d'erreur que le Test des 90 Jours est censé faire remarquer aux dirigeants : un chiffre qui n'a jamais été vérifié parce qu'il paraissait raisonnable.

**Règle applicable à tous les documents du cabinet à compter de ce jour :**

> **Aucune table numérique n'est écrite à la main dans une spécification. Toute table est générée par le calcul, accompagnée du code qui l'a produite, et livrée sous forme de jeu de référence exécutable.**

C'est ce que fait la présente note : le fichier `fixture-indice90.csv` joint contient les 101 valeurs, générées et vérifiées par le calcul, et sert de test automatisé.

---

## 5\. LA FORMULE CORRIGÉE

### 5.1 Deux options

**Option A — correction minimale.** Conserver `3 × e^(I/21)`, corriger la table à 13 / 218 / 351, supprimer la clause de plafond devenue inutile. *Avantage : rien à recoder. Inconvénient : le score maximal donne 351 jours, un nombre qui ne veut rien dire.*

**Option B — recalibrage des bornes.** Ancrer exactement les deux extrémités : Indice 0 → 3 jours, Indice 100 → 365 jours.

### 5.2 Recommandation : Option B

**Formule retenue :**

JOURS \= arrondi\_commercial( 3 × (365/3)^(INDICE90 / 100\) )

Forme équivalente pour l'implémentation :

k \= ln(365/3) / 100 \= 0,0480128506

JOURS \= arrondi\_commercial( 3 × e^(k × INDICE90) )

**Aucun plafond n'est nécessaire** : la formule ne peut mathématiquement pas dépasser 365, qui est atteint exactement à l'Indice 100\.

### 5.3 Pourquoi ce recalibrage, et pourquoi il ne coûte rien

**Il ne change presque rien là où se trouvent les répondants.** La distribution attendue se situe entre 25 et 55 d'Indice. Sur cet intervalle, l'écart entre l'ancienne et la nouvelle formule est de zéro ou un jour :

| Indice | Ancienne | Nouvelle | Écart |
| ----: | ----: | ----: | ----: |
| 25 | 10 | 10 | 0 |
| 32 | 14 | 14 | 0 |
| 35 | 16 | 16 | 0 |
| 42 | 22 | 23 | \+1 |
| 45 | 26 | 26 | 0 |
| 55 | 41 | 42 | \+1 |

**Et il corrige exactement là où c'est visible.** À l'Indice 100, l'écart est de 14 jours, et 365 est le seul nombre qui permette d'écrire la phrase que vous voulez pouvoir écrire : *« Votre entreprise fonctionne une année entière sans vous. »* « 351 jours » n'est pas une phrase.

Le recalibrage se réduit, dans le code, à changer une constante.

### 5.4 Le point qu'il faut traiter avant la mise en ligne

Le seuil de transférabilité est de **90 jours**. Avec la formule corrigée, ces 90 jours sont atteints à un **Indice de 70,84**, soit un Indice 71 — et non un Indice 90\.

**Un prospect attentif le remarquera.** Il faut donc le dire avant lui, en une ligne, dans le rapport comme sur l'écran de score :

> *« L'Indice 90 porte le nom du seuil qu'il mesure : les 90 jours — un trimestre, soit un quart d'année. Un Indice de 90 sur 100 ne signifie pas 90 jours : il signifie que votre entreprise dépasse très largement ce seuil. Le seuil des 90 jours est franchi à partir d'un Indice de 71\. »*

La mention du quart d'année n'est pas décorative : **90 jours est exactement un quart d'année**, ce qui relie le seuil au nom du cabinet. C'est une cohérence à exploiter, pas une coïncidence à taire.

---

## 6\. LES RÈGLES D'ARRONDI — QUATRE DÉFAUTS NON DÉTECTÉS

La spécification dit « arrondi » sans préciser lequel, ni à quel moment. Cela produit quatre ambiguïtés, dont une critique.

### 6.1 Défaut 5 — Quel arrondi

Selon le langage, `round(0,5)` donne 0 ou 1\. Python et JavaScript ne se comportent pas de la même façon, et deux implémentations conformes à la spécification actuelle peuvent afficher des résultats différents.

> **Règle : arrondi commercial — la demie s'arrondit toujours vers le haut.** `floor(x + 0,5)`. Cette règle s'applique à l'Indice, aux scores d'axe et au nombre de jours.

### 6.2 Défaut 6 — Dans quel ordre — **critique**

Les bornes de niveaux sont 0–25, 26–45, 46–62, 63–80, 81–100. Elles sont contiguës **pour des entiers**.

Or l'Indice est issu d'une moyenne pondérée et vaut, avant arrondi, une valeur décimale. **Un Indice de 25,6 ne tombe dans aucun niveau** : il est supérieur à 25 et inférieur à 26\. Le programme lèverait une exception ou, pire, retomberait sur un niveau par défaut sans que personne ne s'en aperçoive.

> **Règle : l'Indice est arrondi à l'entier immédiatement après son calcul. Toutes les opérations en aval — niveau, archétype, nombre de jours, routage, rapport — utilisent exclusivement cet entier.**

Cette règle a une seconde vertu : le score affiché et le nombre de jours affiché sont nécessairement cohérents entre eux. Un utilisateur qui vérifie le calcul retrouve exactement le résultat.

### 6.3 Défaut 9 — Le seuil faible/fort

La spécification dit : *« un axe est dit faible en dessous de 50, fort au-dessus. »* Le cas d'un axe valant exactement 50 n'est pas tranché.

Ce n'est pas théorique : un Axe 3 à 12 points bruts sur 24 donne exactement 50,0.

> **Règle : un axe est FORT si son score arrondi est supérieur ou égal à 50, FAIBLE en dessous.**

### 6.4 Défaut 11 — Division par zéro dans le Regard Croisé

Les réponses « Je ne sais pas » sont exclues du calcul. Si tous les répondants répondent « Je ne sais pas » à toutes les questions d'un axe, le dénominateur est nul.

> **Règle : un axe du Regard Croisé n'est calculé que si au moins 40 % de ses questions ont reçu une réponse chiffrée, tous répondants confondus. En dessous, l'axe est marqué « non mesurable » et le rapport indique : « Vos répondants n'ont pas su répondre sur cet axe. C'est en soi une information. »**

C'est cohérent avec la section sur le silence différentiel : l'absence de réponse est un résultat, pas une panne.

---

## 7\. LES ARCHÉTYPES CROISÉS — DEUX COMBINAISONS MANQUANTES

### 7.1 Le constat est exact

Trois axes binaires produisent 2³ \= 8 combinaisons. La spécification n'en couvre que six. Les deux manquantes sont :

- **A1 faible · A2 fort · A3 fort**  
- **A1 fort · A2 faible · A3 fort**

### 7.2 Pourquoi le rattachement provisoire ne peut pas être conservé

Le développeur a rattaché `A1– A2+ A3+` à l'archétype 3, « L'équipe existe, la place ne s'est pas libérée ». C'était la bonne décision provisoire — il fallait que le programme tourne — mais elle ne peut pas passer en production.

L'archétype 3 correspond à `A1– A2+ A3–`, et son texte affirme au dirigeant qu'il est lui-même en difficulté. Appliqué à quelqu'un dont l'Axe 3 est fort, **le rapport affirmerait à un dirigeant solide qu'il ne va pas bien.** Sur un document de huit pages censé démontrer la finesse d'analyse du cabinet, c'est une erreur qui se voit immédiatement et qui coûte le prospect.

### 7.3 Les deux archétypes manquants — texte définitif

---

**ARCHÉTYPE 7 — A1 faible · A2 fort · A3 fort**

> ### Les hommes sont là, la machine n'est pas construite

> Vous allez bien et votre entourage est solide. Ce n'est pas le cas de votre organisation.  
>   
> C'est la configuration la plus favorable parmi celles dont l'axe opérationnel est faible, et de loin. Vous n'avez ni problème de personne, ni problème d'énergie : vous avez un problème de construction. Les procédures ne sont pas écrites, les décisions ne sont pas déléguées formellement, les relations bancaires et administratives reposent encore sur vous. Rien de tout cela n'est difficile à corriger — c'est simplement un travail qui n'a pas encore été fait.  
>   
> **Le risque est précisément là.** Comme tout va bien par ailleurs, rien ne vous oblige à vous en occuper. Vous tenez, votre équipe tient, et la dépendance reste invisible tant qu'aucun événement ne la révèle. Elle se révélera d'un coup, le jour où vous ne serez pas disponible — et ce jour-là, ni votre solidité ni celle de votre équipe ne pourront compenser l'absence de structure.  
>   
> Vous disposez aujourd'hui de tout ce qu'il faut pour traiter cela vite. Cette situation ne durera pas indéfiniment.

---

**ARCHÉTYPE 8 — A1 fort · A2 faible · A3 fort**

> ### La structure tient, personne ne la porte

> Votre organisation fonctionne et vous allez bien. Il n'y a personne autour de vous.  
>   
> Votre entreprise tourne parce que vous l'avez bien construite : les processus existent, les choses se font sans vous. Mais un processus n'arbitre pas, ne décide pas d'une situation inédite, et ne reprend pas la direction. Il n'y a personne pour vous remplacer, personne pour vous contredire, personne à qui transmettre.  
>   
> Tant que rien d'imprévu ne survient, cela ne se voit pas. Le jour où une décision réellement nouvelle se présente — une opportunité, une crise, une rupture — la structure ne saura pas y répondre, et vous serez à nouveau seul.  
>   
> **C'est aussi la configuration qui pèse le plus lourd sur la valeur de votre entreprise.** Un acquéreur n'achète pas seulement une organisation qui tourne : il achète une équipe de direction capable de la conduire après votre départ. Une entreprise sans second se vend mal, quelle que soit la qualité de ses processus.

---

### 7.4 Table de correspondance complète — à implémenter telle quelle

| A1 | A2 | A3 | \# | Archétype |
| :---: | :---: | :---: | :---: | :---- |
| − | − | − | 1 | La convergence |
| − | − | \+ | 2 | Le pilote solide, la machine fragile |
| − | \+ | − | 3 | L'équipe existe, la place ne s'est pas libérée |
| \+ | − | − | 4 | Les processus tiennent, les hommes s'usent |
| \+ | \+ | − | 5 | L'entreprise est prête, vous ne l'êtes pas |
| \+ | \+ | \+ | 6 | L'actif transférable |
| **−** | **\+** | **\+** | **7** | **Les hommes sont là, la machine n'est pas construite** |
| **\+** | **−** | **\+** | **8** | **La structure tient, personne ne la porte** |

**Les huit branches sont désormais couvertes. Aucun rattachement par défaut ne doit subsister dans le code.**

### 7.5 Conséquence sur les PDF

Le développeur a produit six modèles. **Il en faut huit.** Les deux nouveaux se construisent sur le même gabarit, avec le texte ci-dessus en page 2\.

---

## 8\. LE PROTOCOLE DE SÉCURITÉ — UNE FAILLE DE DÉTECTION

**C'est le défaut le plus grave après la question de version, et personne ne l'avait relevé.**

### 8.1 La règle actuelle

SI Q15 \= 0 ET Q14 \= 0 ET Q16 ≤ 1 ET Q13 \= 0

Quatre conditions, toutes à leur valeur la plus extrême, réunies simultanément.

### 8.2 Pourquoi elle ne protège personne

Sous une hypothèse de réponses uniformes, la probabilité de déclenchement est de **0,32 %** — soit environ trois personnes sur mille. La distribution réelle sera plus favorable, mais l'ordre de grandeur reste : **cette règle ne se déclenchera presque jamais.**

Le cas concret qui échappe à la détection : un dirigeant qui présente cinq signaux physiques, n'a pris aucun jour de repos en un an, ressent un vide à l'idée de vendre — mais qui a coché « mon conjoint » à la question Q13. Il n'est pas détecté. Il reçoit le scénario de rupture et entre dans la séquence commerciale.

**C'est exactement la personne qu'il ne faut pas traiter ainsi.**

### 8.3 La règle corrigée

Remplacer la conjonction par un décompte de signaux.

SIGNAUX \= 0

si Q15 ≤ 1   → SIGNAUX \+ 1      (quatre ou cinq signaux physiques)

si Q14 ≤ 1   → SIGNAUX \+ 1      (moins de cinq jours de repos sur un an)

si Q16 ≤ 1   → SIGNAUX \+ 1      (vide ou fuite à l'idée de vendre)

si Q13 ≤ 1   → SIGNAUX \+ 1      (aucun interlocuteur hors du cercle familial)

DÉCLENCHEMENT si SIGNAUX ≥ 3 ET Q15 ≤ 1

La condition sur Q15 reste obligatoire : les signaux physiques sont le marqueur le plus fiable, et sans eux, trois signaux sur quatre décriraient un dirigeant surchargé mais pas en danger.

**Effet estimé :** le taux de déclenchement passe d'environ 0,3 % à une fourchette de 4 à 8 %, ce qui correspond aux 5 % de niveau N3 anticipés dans la conception de VIGIE, et à l'ordre de grandeur des données publiées sur l'épuisement des dirigeants.

### 8.4 Rappel des effets, inchangés

Encadré sobre en page 2, scénario de rupture supprimé, **Regard Croisé non proposé**, séquence commerciale désactivée 21 jours, marquage « vigilance » au CRM, aucun appel de qualification.

---

## 9\. AUTRES DÉFAUTS ET VÉRIFICATIONS

### 9.1 Les paliers en bas d'échelle — ce n'est pas un défaut

Aux Indices les plus bas, plusieurs valeurs consécutives donnent le même nombre de jours :

| Jours | Indices concernés |
| ----: | :---- |
| 3 | 0 à 3 |
| 4 | 4 à 8 |
| 5 | 9 à 12 |
| 6 | 13 à 16 |

À partir de l'Indice 40, chaque point marque une différence. Sur 101 Indices, on obtient 78 valeurs distinctes.

**C'est le comportement attendu et il est honnête** : en dessous de l'Indice 17, la différence entre deux répondants n'est pas mesurable en jours. Le développeur ne doit pas la corriger. À signaler simplement pour qu'elle ne soit pas prise pour une anomalie lors de la recette.

### 9.2 Ce qui a été vérifié et se révèle exact

| Élément | Contrôle | Résultat |
| :---- | :---- | :---- |
| Axe 1 | Somme des coefficients × 4 | 9 × 4 \= **36** ✓ |
| Axe 2 | Somme des coefficients × 4 | 8 × 4 \= **32** ✓ |
| Axe 3 | Somme des coefficients × 4 | 6 × 4 \= **24** ✓ |
| Pondérations | 0,40 \+ 0,35 \+ 0,25 | **1,00** ✓ |
| Amplitude de l'Indice | Minimum et maximum | **0 à 100** ✓ |
| Bornes de niveaux | Continuité sur les entiers | Aucun trou, aucun chevauchement ✓ |
| Fréquences annoncées | Somme | **100 %** ✓ |
| Règles d'incohérence 1 à 5 | Cohérence logique avec les barèmes | Les cinq sont correctes ✓ |
| Monotonie de la conversion | Croissance sur 0–100 | Strictement croissante ✓ |

**Le cœur de l'instrument est sain.** Les défauts portaient sur l'exécution, pas sur la conception.

---

## 10\. LA TABLE DE RÉFÉRENCE

Le fichier joint `fixture-indice90.csv` contient les **101 valeurs**, de l'Indice 0 à l'Indice 100, générées par le calcul et non écrites à la main. Colonnes : `indice90`, `jours_autonomie`, `niveau`.

**Extrait :**

| Indice | Jours | Niveau |
| ----: | ----: | :---- |
| 0 | 3 | Point de défaillance unique |
| 10 | 5 | Point de défaillance unique |
| 20 | 8 | Point de défaillance unique |
| 25 | 10 | Point de défaillance unique |
| 30 | 13 | Centre névralgique |
| 37 | 18 | Centre névralgique *(médiane attendue)* |
| 40 | 20 | Centre névralgique |
| 45 | 26 | Centre névralgique |
| 50 | 33 | Transition inachevée |
| 60 | 53 | Transition inachevée |
| **71** | **91** | **Structure émergente** *(seuil des 90 jours franchi)* |
| 80 | 140 | Structure émergente |
| 90 | 226 | Entreprise transférable |
| 100 | **365** | Entreprise transférable |

**Ce fichier est le jeu de référence opposable.** Toute implémentation doit reproduire ces 101 valeurs exactement. C'est aussi le test automatisé à exécuter à chaque livraison.

---

## 11\. IMPLÉMENTATION DE RÉFÉRENCE

Pour éliminer toute ambiguïté d'interprétation.

**Python**

import math

K \= math.log(365 / 3\) / 100          \# 0.0480128506

def arrondi\_commercial(x: float) \-\> int:

    return math.floor(x \+ 0.5)

def indice90(a1\_brut, a2\_brut, a3\_brut) \-\> int:

    """a1\_brut/36, a2\_brut/32, a3\_brut/24 \-\> Indice entier 0-100"""

    a1 \= a1\_brut / 36 \* 100

    a2 \= a2\_brut / 32 \* 100

    a3 \= a3\_brut / 24 \* 100

    return arrondi\_commercial(0.40 \* a1 \+ 0.35 \* a2 \+ 0.25 \* a3)

def jours(indice: int) \-\> int:

    """L'indice DOIT etre l'entier deja arrondi."""

    assert isinstance(indice, int) and 0 \<= indice \<= 100

    return arrondi\_commercial(3 \* math.exp(K \* indice))

def niveau(indice: int) \-\> str:

    if indice \<= 25: return "Point de défaillance unique"

    if indice \<= 45: return "Centre névralgique"

    if indice \<= 62: return "Transition inachevée"

    if indice \<= 80: return "Structure émergente"

    return "Entreprise transférable"

def archetype(a1: float, a2: float, a3: float) \-\> int:

    """Scores d'axe normalises. FORT si \>= 50."""

    f \= (a1 \>= 50, a2 \>= 50, a3 \>= 50\)

    return {(False, False, False): 1, (False, False, True): 2,

            (False, True,  False): 3, (True,  False, False): 4,

            (True,  True,  False): 5, (True,  True,  True): 6,

            (False, True,  True):  7, (True,  False, True):  8}\[f\]

**JavaScript**

const K \= Math.log(365 / 3\) / 100;

const arrondiCommercial \= x \=\> Math.floor(x \+ 0.5);

// ATTENTION : Math.round() de JS arrondit \-0.5 vers 0, pas vers le bas.

// Sur ce domaine (valeurs positives) le comportement est identique,

// mais on utilise floor(x \+ 0.5) pour rester strictement conforme.

const jours \= indice \=\> {

  if (\!Number.isInteger(indice) || indice \< 0 || indice \> 100\)

    throw new Error("Indice invalide : entier 0-100 attendu");

  return arrondiCommercial(3 \* Math.exp(K \* indice));

};

---

## 12\. RÉPONSES AUX QUESTIONS DU DÉVELOPPEUR

| Question posée | Réponse |
| :---- | :---- |
| **La table sera-t-elle publique ?** | Non, mais la **formule le sera** : elle figure dans le rapport remis à chaque répondant. Un dirigeant peut donc la vérifier. C'est voulu — c'est ce qui distingue une mesure d'un artifice. Raison de plus pour qu'elle soit exacte. |
| **Faut-il forcer les 365 jours ?** | Non. On recalibre pour que 365 soit atteint mathématiquement. Voir section 5\. |
| **Peut-on garder le rattachement provisoire des deux combinaisons ?** | Non. Voir section 7.2 : il produirait un diagnostic faux. Les huit archétypes sont désormais rédigés. |
| **Combien de modèles de PDF ?** | **Huit**, un par archétype. Les blocs dynamiques restent identiques. |
| **Que met-on en signature du rapport ?** | Un **nom et une fonction réels** — jamais « L'équipe ». En bas de page : `Le Quart · Conseil privé de dirigeants · cabinetlequart.com`. |
| **Peut-on retirer les filigranes ?** | Pas encore. Ils restent jusqu'à validation des huit modèles corrigés. Le principe du filigrane provisoire est une bonne pratique, à conserver pour toutes les livraisons futures. |
| **La page d'administration convient-elle ?** | Le principe oui. Deux exigences à ajouter : **journalisation des accès** (qui a consulté quelles réponses, et quand), et **cloisonnement des conversations marquées en vigilance**, accessibles uniquement au responsable désigné. Ce sont des données personnelles sensibles. |

---

## 13\. PROTOCOLE DE RECETTE

Aucune mise en ligne avant que ces onze contrôles ne soient tous au vert.

| \# | Contrôle | Critère |
| :---- | :---- | :---- |
| 1 | Jeu de référence | Les 101 valeurs de `fixture-indice90.csv` reproduites exactement |
| 2 | Bornes | Indice 0 → 3 jours · Indice 100 → 365 jours |
| 3 | Arrondi | `floor(x + 0,5)` vérifié sur les cas limites (x,5) |
| 4 | Ordre des opérations | L'Indice est arrondi avant tout classement et tout calcul de jours |
| 5 | Niveaux | Les 101 Indices tombent chacun dans exactement un niveau |
| 6 | Archétypes | Les huit combinaisons produisent chacune un archétype distinct — **aucun rattachement par défaut dans le code** |
| 7 | Seuil axe | Un axe à exactement 50,0 est classé FORT |
| 8 | Détresse | La règle corrigée se déclenche sur trois jeux de réponses test |
| 9 | Incohérences | Les cinq règles se déclenchent sur des jeux de réponses construits pour cela |
| 10 | PDF | Huit modèles générés, sans filigrane, signés d'un nom réel |
| 11 | Impression | Un rapport imprimé en noir et blanc sur imprimante de bureau reste lisible |

**Contrôle final, manuel :** trois profils complets renseignés à la main, du premier écran au PDF reçu par courriel, avec vérification que le score affiché, le nombre de jours, le niveau, l'archétype et le contenu du PDF concordent tous.

---

## ANNEXE — RÉCAPITULATIF DES CORRECTIONS À APPORTER À LA SPÉCIFICATION

| Section | Correction |
| :---- | :---- |
| **9.1** | Nouvelle formule `3 × (365/3)^(I/100)`. Suppression de la clause de plafond. |
| **9.2** | Table remplacée par le jeu de référence de 101 valeurs. |
| **9.4** | Ajout de la mention distinguant l'Indice 90 des 90 jours, et du seuil à l'Indice 71\. |
| **8** | Ajout des règles d'arrondi : arrondi commercial, Indice arrondi avant toute opération aval. |
| **10.2** | Ajout des archétypes 7 et 8\. Table de correspondance complète des huit branches. |
| **10.2** | Seuil précisé : FORT si ≥ 50\. |
| **14.1** | Protocole de détresse remplacé par la règle de décompte de signaux. |
| **12** | Huit modèles de rapport au lieu de six. |
| **20.x** | Regard Croisé : règle de couverture minimale de 40 % par axe. |

---

*Note d'audit établie le 3 août 2026\. Toutes les valeurs numériques de ce document ont été générées par le calcul et vérifiées automatiquement ; aucune n'a été écrite à la main. Le jeu de référence joint fait foi.*  
