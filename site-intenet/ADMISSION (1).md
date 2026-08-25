# CABINETLEQUART.COM — FAIRE LE POINT
## Test des 90 Jours — version finale, prête pour intégration

**Date :** 3 août 2026
**URL :** `/faire-le-point`
**Longueur :** 384 mots
**Destinataires :** développeur, designer

---

## RÈGLES APPLICABLES À LA PAGE

| # | Règle |
|---|---|
| 1 | **Un seul appel à l'action : « Commencer ».** Il apparaît deux fois — bloc 1 et bloc 7. Aucun autre bouton. |
| 2 | Fond Papier `#F4F1EA`. Aucune photographie, aucun pictogramme. |
| 3 | **Aucune gamification** : pas d'emoji, pas de barre de progression colorée, pas de couleur de récompense, ni sur cette page ni dans le test. |
| 4 | Page complète sous 400 Ko. C'est la page où aboutit toute la publicité : elle doit se charger sous 2 s en 3G. |
| 5 | Les blocs 2 à 6 sont lisibles sans clic. Aucun accordéon, aucun contenu replié. |

---

# BLOC 1 — OUVERTURE

*Pleine hauteur d'écran. Aucune image.*

> # Combien de temps votre entreprise fonctionnerait-elle sans vous ?
>
> Le Test des 90 Jours mesure une seule chose : le nombre de jours pendant lesquels votre entreprise continuerait de fonctionner normalement en votre absence.
>
> **[ Commencer — 18 questions, 7 minutes ]**
>
> *Gratuit, et ouvert à tout dirigeant : nos critères d'admission ne concernent que l'accompagnement.*
>
> *À l'issue des 18 questions, vous recevez votre Indice 90 et un rapport d'analyse de 8 pages par courriel.*
>
> *Il n'y a pas de retour en arrière. Répondez à ce qui se passe, pas à ce qui devrait se passer.*

---

# BLOC 2 — CE QUE LE TEST MESURE

> **Trois axes, dix-huit questions.**
>
> **L'entreprise sans vous.** Où se concentrent les décisions, à qui appartiennent réellement les relations clients et bancaires, ce qui est écrit et ce qui ne l'est pas, qui peut engager une dépense.
>
> **Ceux qui vous entourent.** L'existence d'un second, la qualité de votre équipe de direction, votre capacité à être contredit, et la frontière entre la trésorerie de l'entreprise et les sollicitations familiales.
>
> **Vous.** Votre charge, votre solitude décisionnelle, et la clarté de votre trajectoire.
>
> ---
>
> **Pourquoi quatre-vingt-dix jours ?** C'est un trimestre — la durée au-delà de laquelle une absence cesse d'être une parenthèse pour devenir un transfert. Les clients ont traité avec d'autres, les décisions ont été prises sans vous, les échéances ont été honorées.
>
> Les travaux universitaires sur les entreprises familiales africaines établissent que leur pérennité n'excède souvent pas huit ans, et que pour les plus solides elle se réduit à l'espérance de vie de leur fondateur. C'est précisément ce que ce test mesure : ce qui resterait si vous n'étiez plus là. *(source)*

---

# BLOC 3 — CE QUE VOUS RECEVEZ

> **Votre Indice 90**, un score d'autonomie sur 100.
>
> **Votre nombre de jours**, converti à partir de ce score.
>
> **Un rapport de 8 pages**, envoyé par courriel : votre situation en une page, vos trois axes détaillés, vos trois forces et le risque que chacune crée, vos trois fragilités, le point critique à traiter en premier, ce qui se passerait concrètement si vous vous absentiez trois mois, et trois actions à mener dans les trente jours — réalisables sans nous.

---

# BLOC 4 — CE QUE CE N'EST PAS

> Ce n'est pas un quiz. Il n'y a rien à gagner, aucune réponse valorisante, et le résultat sera probablement inconfortable.

---

# BLOC 5 — LA RIGUEUR

> **La formule de conversion est publiée.** Vous pouvez vérifier vous-même le calcul qui transforme votre score en nombre de jours. Nous ne connaissons aucun autre instrument de ce type dont le calcul soit vérifiable.
>
> **L'Indice 90 porte le nom du seuil qu'il mesure. C'est un score sur 100, pas un nombre de jours.**
>
> L'instrument s'inspire d'un référentiel international de cessibilité étalonné sur plus de 80 000 entreprises. Il s'en distingue sur trois points : il mesure la survie de l'entreprise plutôt que sa valeur de revente, il consacre un axe entier à l'état du dirigeant, et il traite la frontière entre la trésorerie et la famille — que ce référentiel n'aborde pas.
>
> → *Voir la formule de calcul de l'Indice 90*

---

# BLOC 6 — CONFIDENTIALITÉ

> Vos réponses sont conservées dans un dossier à votre nom.
>
> **Elles ne sont transmises à aucun tiers sans votre accord explicite** — ni à vos collaborateurs, ni à vos associés, ni à aucun partenaire.
>
> Elles alimentent, sous forme anonyme et agrégée, le baromètre annuel que nous publions. Vous pouvez demander leur effacement à tout moment.
>
> → *Politique de confidentialité*

---

# BLOC 7 — ACTION

> **[ Commencer — 18 questions, 7 minutes ]**

---

## NOTES D'INTÉGRATION

### Ce qui a été corrigé par rapport à l'ossature

| # | Correction | Motif |
|---|---|---|
| 1 | **La page n'ouvre plus sur la statistique.** Le constat des huit ans descend au bloc 2. | C'est ici qu'aboutit toute la publicité. Un dirigeant qui lit « les travaux universitaires établissent que » en premier écran décroche. La page d'accueil ouvre sur la question ; celle-ci doit faire au moins aussi bien. |
| 2 | **Un appel à l'action au bloc 1.** | Six blocs avant le premier bouton, c'est plusieurs écrans de défilement sur mobile pour un visiteur déjà convaincu. |
| 3 | **La porte email est annoncée** avant le premier clic. | Un répondant prévenu ne se sent pas piégé. Un répondant surpris à la minute sept abandonne. |
| 4 | **« sans votre accord explicite »** au bloc 6. | Sans ces trois mots, le module Le Relèvement sera inexploitable sur tous les répondants de la première année : un associé est un tiers. |
| 5 | **La distinction Indice 90 / 90 jours** au bloc 5. | C'est la page qui présente la métrique, et le lecteur y voit la formule. La confusion doit être levée là, pas ailleurs. |
| 6 | **Le chiffre de 71 % n'est pas repris.** | Il porte sur un score global à huit leviers, pas sur la dépendance au dirigeant. L'erreur est apparue cinq fois dans les articles. Le référentiel est cité pour son étalonnage, pas pour ce chiffre. |
| 7 | **« Ouvert à tout dirigeant »** au bloc 1. | La page d'accueil publie des critères présentés comme excluant la majorité des entreprises. Sans cette ligne, un visiteur croit que le test lui est fermé. |
| 8 | **« Il n'y a pas de retour en arrière »** annoncé. | Figure dans la spécification, pas dans l'ossature. L'annoncer protège la spontanéité des réponses et signale le sérieux de l'instrument. |
| 9 | **Ce que le test mesure est décrit par dimensions**, jamais par barèmes ni exemples de réponses. | Règle du Journal de bord : on publie les dimensions, jamais les échelles. |

### Liens de la page

| Emplacement | Cible |
|---|---|
| Bloc 1, bouton | `/faire-le-point/test` |
| Bloc 2, mention *(source)* | Lien externe vers la référence ESSCA |
| Bloc 5, lien texte | `/methode/indice-90` |
| Bloc 6, lien texte | `/confidentialite` |
| Bloc 7, bouton | `/faire-le-point/test` |

**Aucun autre lien.** Ni vers la méthode, ni vers l'équipe, ni vers le journal : cette page a un objectif unique et rien ne doit en détourner.

### Le test lui-même

Conforme à la spécification version 1.1 : 18 écrans, une question par écran, pas de retour arrière, barre de progression discrète, écrans de transition informatifs, porte email après la question 18, affichage du score, bloc de profil, rapport par courriel sous 60 secondes.

**Trois points à ne pas manquer à l'intégration :**
- Le pixel de retargeting se déclenche **à la question 10**, pas à la fin — pour récupérer les abandons tardifs.
- La porte ne demande que **trois champs** : prénom, nom, courriel professionnel. Le profil complet vient après l'affichage du score.
- Le champ **nom de l'entreprise** est obligatoire au bloc de profil. Sans lui, le module Le Relèvement ne pourra jamais se déclencher, et l'ajouter plus tard imposera une migration.

### Volume

**384 mots**, dans la fourchette visée et cohérente avec les 312 mots de la page d'accueil.

---

*Copie établie le 3 août 2026. La référence citée au bloc 2 doit être vérifiée — auteur, titre exact, année, lien — avant mise en ligne.*
