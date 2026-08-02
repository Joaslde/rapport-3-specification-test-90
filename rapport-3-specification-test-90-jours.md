# LE TEST DES 90 JOURS

## Spécification complète — instrument de diagnostic, scoring, interprétation et rapport

**Date :** 30 juillet 2026 **Objet :** Conception détaillée de l'outil d'acquisition et de qualification n°1 du cabinet **Statut :** Document de spécification — exploitable directement par un développeur, un designer et un rédacteur

## SOMMAIRE

1. Note préalable sur le nom  
2. Fondements documentaires : les difficultés réelles de la cible  
3. Positionnement de l'instrument et références  
4. Typologie des questions — la méthode de conception  
5. Architecture : 3 axes, 15 sous-dimensions  
6. Les 18 questions, réponses et pondérations  
7. Le questionnaire de profil et la capture  
8. Le moteur de scoring  
9. La conversion score → jours d'autonomie  
10. Les cinq niveaux et les six archétypes croisés  
11. Détection d'incohérences  
12. Le rapport de 8 pages  
13. Le scénario de rupture personnalisé  
14. Le protocole de sécurité  
15. Routage commercial  
16. Expérience utilisateur et design  
17. Benchmark et exploitation des données  
18. Indicateurs de performance de l'outil  
19. Ce que je dois savoir de vous

---

## 1\. NOTE PRÉALABLE SUR LE NOM

**Problème identifié :** l'appellation « IA-90 » retenue au rapport n°2 est inutilisable en français. « IA » signifie intelligence artificielle pour l'intégralité de la cible — et le cabinet commercialise par ailleurs un assistant IA. La collision est frontale et créerait une confusion permanente.

**Recommandation :**

| Élément | Nom retenu |
| :---- | :---- |
| L'outil, en public | **Le Test des 90 Jours** |
| La métrique produite | **l'Indice 90** |
| Le résultat exprimé | **« Votre entreprise tient 14 jours sans vous. »** |
| L'étude annuelle | **Baromètre de l'Indice 90 des dirigeants d'Afrique francophone** |

Le chiffre 90 fait tout le travail : il est mémorisable, il pose une question implicite, et il ancre l'échelle. Le nom se transmet oralement sans explication — condition indispensable dans un marché où la prescription et le bouche-à-oreille comptent davantage que le référencement.

---

## 2\. FONDEMENTS DOCUMENTAIRES : LES DIFFICULTÉS RÉELLES DE LA CIBLE

Un questionnaire n'a de profondeur que s'il interroge des problèmes documentés, pas des problèmes supposés. Voici les sources qui ont déterminé le contenu de chaque question.

### 2.1 Le fait le plus important du dossier

> **Selon les travaux universitaires sur les entreprises familiales africaines, la pérennité de ces entreprises n'excède souvent pas huit ans, et pour celles qui se distinguent, elle est réduite à l'espérance de vie du fondateur.**

Ce constat, formulé notamment sur les PME et PMI familiales africaines et congolaises, est la **justification intellectuelle complète du cabinet et du test**. Il transforme la question « votre entreprise dépend-elle de vous ? » d'une préoccupation de management en une question de survie documentée.

C'est le chiffre qui doit apparaître en ouverture du test et en ouverture du rapport.

### 2.2 Les causes de défaillance documentées

Une étude de l'Agence Française de Développement (2019) sur les mécanismes de défaut des TPE/PME en Afrique subsaharienne établit que les PME sont vulnérables en premier lieu :

- aux **retards de paiement des clients, l'État inclus**  
- au **manque de structuration**  
- au **manque de compétences managériales**, qui conduit à de mauvais choix managériaux (diversification excessive) ou financiers (endettement trop élevé, coût de la dette excessif)  
- aux défaillances d'infrastructures et aux crises politiques

D'autres analyses du secteur ajoutent : mauvaise gestion de la clientèle et du personnel, faible productivité, conflits interpersonnels, **absence ou insuffisance de contrôle interne régulier**, et incapacité des créateurs à mettre en place une organisation définie par manque d'expérience managériale.

→ **Ces éléments fondent les questions Q2, Q4, Q5, Q6, Q10, Q11.**

### 2.3 La gouvernance et la succession

Les analyses des entreprises familiales africaines convergent sur deux faiblesses chroniques : **une gouvernance mal structurée et l'absence de planification de la succession**. Elles relèvent également la **porosité des frontières entre la famille et l'entreprise**, la difficulté à dissocier le cercle familial du cercle entreprise, et le manque de compétences en gestion. Le cas Fotso au Cameroun est l'illustration publique la plus documentée d'une transmission mal préparée dans un groupe pourtant considérable.

Les travaux sur les échecs de succession identifient trois causes récurrentes : **plans de succession flous, successeurs incompétents ou inexpérimentés, rivalités familiales**.

→ **Fondent Q8, Q11, Q18.**

### 2.4 La frontière famille / entreprise — spécificité de zone

C'est la dimension que ne couvre aucun outil de diagnostic conçu en Europe ou aux États-Unis, et c'est celle qui rendra le test crédible auprès de la cible.

La littérature établit que **la solidarité familiale est considérée comme l'un des principaux obstacles à la croissance des entreprises africaines** : il est difficile pour le parent qui a réussi de se soustraire à ses obligations sociales, particulièrement si une partie du capital de départ a été prêtée par la famille élargie. Certains entrepreneurs vont jusqu'à s'installer loin de leur famille pour échapper aux sollicitations permanentes.

Les recherches sur les entreprises guinéennes décrivent une situation où **le chiffre d'affaires journalier est quasi systématiquement mobilisé au jour le jour pour couvrir les besoins quotidiens de la famille**. Les travaux sur le Niger notent l'ambivalence : la famille est à la fois pourvoyeuse de main-d'œuvre, de financement peu coûteux et de confiance, **et une entrave, l'obligation morale d'assister la famille élargie restreignant la capacité de réinvestissement de la marge**.

Un article récent sur le patrimoine familial africain formule le bon test : **les rôles de membre de la famille, d'actionnaire et de dirigeant sont-ils séparés ?**

→ **Fonde Q12, la question la plus délicate et la plus prédictive du questionnaire.**

### 2.5 L'état du dirigeant

- **72 %** des fondateurs déclarent un impact de leur activité sur leur santé mentale (Startup Snapshot, 2025\)  
- Solitude auto-évaluée à **7,6/10**  
- **54 %** ont vécu un burnout sur les 12 derniers mois (Sifted, 2025\)  
- Les entrepreneurs sont **50 % plus susceptibles** de déclarer un trouble de santé mentale que la population générale, mais **seuls 23 %** cherchent un soutien professionnel (recherche UCSF)  
- **64 %** déclarent passer moins de temps avec leurs proches qu'auparavant

→ **Fondent Q13, Q14, Q15, Q16, Q17.**

### 2.6 Le financement et la trésorerie

L'accès au financement est identifié comme le principal frein à la croissance des PME africaines. L'autofinancement et les tontines restent des sources majeures — mécanismes peu fiables, peu prévisibles et limités dans leur rôle de répartition du risque.

→ **Fonde Q2 et Q12.**

---

## 3\. POSITIONNEMENT DE L'INSTRUMENT ET RÉFÉRENCES

### 3.1 La référence internationale à connaître et à dépasser

Le **Value Builder Score** de John Warrillow est l'instrument de référence mondial sur ce sujet. Il évalue une entreprise sur huit leviers de valeur, dont le huitième — **« Hub & Spoke »** — mesure exactement la question du Test des 90 Jours : *comment l'entreprise fonctionnerait-elle si le dirigeant était brutalement empêché de travailler pendant trois mois ?*

Données publiques associées : le score est étalonné sur **plus de 80 000 entreprises** ; les entreprises dépassant 80 reçoivent des offres de rachat supérieures de **71 %** à la moyenne, et celles au-dessus de 90 reçoivent des offres **7,1 fois supérieures**.

**Ce que cela vous apporte :**

1. **Une légitimité immédiate.** Vous ne proposez pas une invention marketing : vous adaptez un standard international reconnu par les acquéreurs et les investisseurs.  
2. **Un argument économique dur.** La dépendance au dirigeant n'est pas un inconfort de management, c'est une décote de valorisation mesurée.  
3. **Une position à occuper.** Le Value Builder System n'existe pas en français africain, ne traite pas la frontière famille/entreprise, et ne travaille jamais sur l'état psychologique du dirigeant.

### 3.2 Ce qui différencie le Test des 90 Jours

|  | Value Builder Score | Test des 90 Jours |
| :---- | :---- | :---- |
| Objet | Valeur de cession de l'entreprise | **Survie de l'entreprise sans son dirigeant** |
| Axes | 8 leviers financiers et commerciaux | **3 axes dont un consacré à l'état du dirigeant** |
| Frontière famille / entreprise | Absente | **Axe explicite** |
| Contexte réglementaire | Anglo-saxon | **OHADA, fiscalité et administration locales** |
| Sortie | Score sur 100 | **Score \+ nombre de jours d'autonomie** |
| Suite | Coaching certifié | **Cellule pluridisciplinaire** |

**La sortie en jours est la véritable innovation.** Un score de 34/100 est abstrait. « Votre entreprise tient 17 jours sans vous » ne l'est pas. C'est ce chiffre qui sera répété, cité, partagé et redouté.

---

## 4\. TYPOLOGIE DES QUESTIONS — LA MÉTHODE DE CONCEPTION

Un questionnaire d'opinion ne produit rien. Il mesure la perception que le dirigeant a de lui-même, laquelle est systématiquement flatteuse. Six types de questions ont été retenus, tous conçus pour contourner ce biais.

| Type | Nom | Principe | Effet recherché |
| :---- | :---- | :---- | :---- |
| **A** | **Fait vérifiable** | Interroge un état de fait objectivement constatable, pas une opinion. *« Combien de personnes peuvent engager un décaissement de 3,3 M FCFA sans votre accord ? »* | Impossible à embellir sans mentir consciemment |
| **B** | **Événement daté** | Demande de retrouver un fait daté précis. *« La plus longue période sans contact avec l'entreprise sur 24 mois ? »* | La mémoire d'un fait résiste à l'auto-flatterie |
| **C** | **Test de rupture** | Projette une situation de discontinuité. *« Vous êtes hospitalisé 90 jours sans communication. »* | Force la simulation mentale — c'est là que naît la prise de conscience |
| **D** | **Comportement observable** | Interroge une fréquence de comportement, pas un ressenti. *« Combien de décisions vous remonte-t-on par semaine ? »* | Mesure la réalité opérationnelle |
| **E** | **Projection tierce** | Fait répondre à la place d'un tiers. *« La dernière fois qu'un collaborateur vous a dit que vous aviez tort ? »* | Réduit le biais de désirabilité sociale de façon documentée |
| **F** | **Coût caché** | Fait calculer une quantité jamais calculée. | Le calcul lui-même produit l'insight, avant même le résultat |

### 4.1 Trois règles de rédaction appliquées à chaque question

1. **Aucun jugement dans l'énoncé.** La question sur la trésorerie familiale ne dit pas « détournez-vous ». Elle demande un fait, avec des options qui vont du non-traçable au formalisé. Une question moralisatrice fait mentir.  
2. **La réponse la plus faible doit rester digne.** Un dirigeant qui coche l'option à 0 point ne doit pas se sentir méprisé, sinon il abandonne. Formulation : *« Personne. Tout passe par moi. »* et non *« Je ne délègue rien. »*  
3. **Chaque question doit apprendre quelque chose, même sans répondre.** La simple lecture de la question Q18 — *« À quelle échéance et sous quelle forme sortirez-vous de la direction opérationnelle ? »* — installe une idée que la plupart des répondants n'ont jamais formulée.

---

## 5\. ARCHITECTURE : 3 AXES, 15 SOUS-DIMENSIONS

| Axe | Poids | Sous-dimensions | Questions |
| :---- | :---- | :---- | :---- |
| **AXE 1 — L'entreprise sans vous** *(dépendance opérationnelle)* | **40 %** | 1.1 Concentration décisionnelle 1.2 Concentration relationnelle 1.3 Codification et procédures 1.4 Trésorerie et pouvoir de signature 1.5 Résistance à la rupture | Q1 à Q7 |
| **AXE 2 — Ceux qui vous entourent** *(solidité de l'entourage)* | **35 %** | 2.1 Existence d'un second 2.2 Qualité de l'équipe de direction 2.3 Contre-pouvoir et accès à la vérité 2.4 Frontière famille / entreprise 2.5 Conseil et appui externes | Q8 à Q13 |
| **AXE 3 — Vous** *(état du dirigeant)* | **25 %** | 3.1 Charge et récupération 3.2 Solitude décisionnelle 3.3 Signaux physiques 3.4 Clarté de trajectoire 3.5 Identité et rapport à l'entreprise | Q14 à Q18 |

**Justification de la pondération :** l'Axe 1 est le plus lourd parce qu'il est le plus directement corrélé à la survie de l'entreprise et le plus objectivement mesurable. L'Axe 3 est le plus léger **en pondération** mais il porte le plus de charge émotionnelle — il sera systématiquement mis en avant dans l'interprétation, car c'est lui qui déclenche la demande d'aide.

---

## 6\. LES 18 QUESTIONS

*Format : une question par écran. Barre de progression. Aucun retour arrière autorisé après validation (protège la spontanéité de la réponse).*

---

### SECTION 1 — L'ENTREPRISE SANS VOUS

*Écran de transition : « Sept questions. Elles portent sur des faits, pas sur des intentions. Répondez à ce qui se passe réellement, pas à ce qui devrait se passer. »*

---

**Q1 — Type B — Sous-dimension 1.5 — Coefficient ×1,5**

> **Sur les 24 derniers mois, quelle est la plus longue période pendant laquelle vous n'avez ni appelé votre entreprise, ni été appelé par elle ?** *Vacances, maladie, déplacement — la raison n'a pas d'importance.*

| Réponse | Points |
| :---- | :---- |
| Jamais plus de 2 jours consécutifs | 0 |
| 3 à 5 jours | 1 |
| 6 à 10 jours | 2 |
| 11 à 20 jours | 3 |
| Plus de 20 jours | 4 |

*Conception : question d'ouverture délibérément factuelle et facile. Elle installe le sujet sans agresser, et elle produit une donnée que le répondant ne peut pas contester ensuite.*

---

**Q2 — Type A — Sous-dimension 1.4 — Coefficient ×1**

> **Hors vous-même, combien de personnes peuvent aujourd'hui engager une dépense équivalente à 3 300 000 FCFA (5 000 €) sans votre accord préalable ?**

| Réponse | Points |
| :---- | :---- |
| Aucune | 0 |
| Une seule, mais je vérifie systématiquement après coup | 1 |
| Une seule, en autonomie réelle | 2 |
| Deux personnes | 3 |
| Trois ou plus, dans un cadre de délégation écrit | 4 |

*Le montant doit être localisé dynamiquement : FCFA (UEMOA/CEMAC), MAD (Maroc), € (diaspora).*

---

**Q3 — Type A — Sous-dimension 1.2 — Coefficient ×1,5**

> **Vos trois plus gros clients. À qui appartient réellement la relation ?**

| Réponse | Points |
| :---- | :---- |
| Aux trois, je suis l'interlocuteur unique. Ils n'accepteraient de traiter qu'avec moi | 0 |
| Deux sur trois passent nécessairement par moi | 1 |
| Un sur trois passe nécessairement par moi | 2 |
| Aucun ne passe systématiquement par moi, mais je reste le recours en cas de problème | 3 |
| Aucun. Mon absence prolongée ne changerait rien à ces relations | 4 |

---

**Q4 — Type A — Sous-dimension 1.3 — Coefficient ×1**

> **Votre responsable d'exploitation doit former son remplaçant demain matin. Sur quoi s'appuie-t-il ?**

| Réponse | Points |
| :---- | :---- |
| Sur moi. Rien n'est écrit | 0 |
| Sur sa mémoire et quelques fichiers dispersés | 1 |
| Sur des procédures écrites pour certains postes seulement | 2 |
| Sur un manuel de procédures à jour couvrant l'essentiel de l'activité | 3 |
| Sur un système documenté qui a déjà servi lors d'un remplacement réel | 4 |

---

**Q5 — Type D / F — Sous-dimension 1.1 — Coefficient ×1**

> **Une semaine ordinaire. Combien de décisions vous remonte-t-on que quelqu'un d'autre aurait pu prendre ?**

| Réponse | Points |
| :---- | :---- |
| Plus de 20 | 0 |
| 10 à 20 | 1 |
| 5 à 10 | 2 |
| 2 à 5 | 3 |
| Moins de 2 | 4 |

*Conception : le simple fait de compter produit l'effet. La plupart des dirigeants n'ont jamais quantifié ce flux et sous-estiment massivement leur réponse.*

---

**Q6 — Type A — Sous-dimension 1.2 — Coefficient ×1**

> **Vos relations avec la banque, l'administration fiscale et les organismes sociaux :**

| Réponse | Points |
| :---- | :---- |
| Tout passe par moi. Personne d'autre n'a les contacts ni l'historique | 0 |
| Je délègue l'exécution, mais je traite personnellement toute difficulté | 1 |
| Une personne gère, j'interviens uniquement en arbitrage | 2 |
| Une personne gère et arbitre, je suis informé | 3 |
| C'est structuré avec un cabinet externe et un référent interne identifié | 4 |

*Conception : sous-dimension propre à la zone. Dans un environnement où les relations personnelles avec l'administration et la banque déterminent souvent la fluidité des opérations, c'est le point de dépendance le plus invisible et le plus dangereux — parce qu'il ne se transmet pas par une procédure écrite.*

---

**Q7 — Type C — Sous-dimension 1.5 — Coefficient ×2**

> **Vous êtes hospitalisé demain, sans possibilité de communiquer, pour 90 jours. Au bout de combien de temps un client ou un fournisseur important s'en apercevrait-il ?**

| Réponse | Points |
| :---- | :---- |
| Moins de 48 heures | 0 |
| Environ une semaine | 1 |
| Deux à trois semaines | 2 |
| Un à deux mois | 3 |
| Probablement jamais | 4 |

*Question la plus lourdement pondérée du questionnaire. C'est le cœur du test.*

---

### SECTION 2 — CEUX QUI VOUS ENTOURENT

*Écran de transition : « Une étude de l'AFD sur les défauts de PME en Afrique subsaharienne identifie le manque de structuration et de compétences managériales parmi les premières causes de défaillance — avant les problèmes de marché. Six questions sur votre entourage. »*

---

**Q8 — Type A — Sous-dimension 2.1 — Coefficient ×2**

> **Aujourd'hui, quelqu'un dans votre entreprise pourrait-il diriger à votre place pendant six mois ?**

| Réponse | Points |
| :---- | :---- |
| Personne, et je ne vois pas qui pourrait le devenir | 0 |
| Personne aujourd'hui, mais j'ai identifié la personne | 1 |
| Quelqu'un le pourrait partiellement, avec un appui extérieur | 2 |
| Oui, une personne le pourrait | 3 |
| Oui, et cette personne l'a déjà fait au moins une fois | 4 |

---

**Q9 — Type E — Sous-dimension 2.3 — Coefficient ×1,5**

> **La dernière fois qu'un de vos collaborateurs vous a dit clairement que vous aviez tort, c'était :**

| Réponse | Points |
| :---- | :---- |
| Je ne m'en souviens pas, ou cela n'arrive pas | 0 |
| Il y a plus d'un an | 1 |
| Il y a plusieurs mois | 2 |
| Ce mois-ci | 3 |
| Cette semaine — et cela m'a fait changer d'avis | 4 |

*Conception : l'un des révélateurs les plus puissants disponibles. Un dirigeant que personne ne contredit prend seul, et sans filet, l'intégralité de ses mauvaises décisions. La réponse « je ne m'en souviens pas » est plus grave que « il y a plus d'un an ».*

---

**Q10 — Type A — Sous-dimension 2.2 — Coefficient ×1**

> **Sur les 24 derniers mois, combien de cadres ou de collaborateurs clés ont quitté l'entreprise ?**

| Réponse | Points |
| :---- | :---- |
| Trois ou plus, et je n'ai pas vraiment compris pourquoi | 0 |
| Trois ou plus, et j'en connais les raisons | 1 |
| Un ou deux, départs subis | 2 |
| Un ou deux, départs anticipés et organisés | 3 |
| Aucun | 4 |

---

**Q11 — Type A — Sous-dimension 2.2 — Coefficient ×1**

> **Vos recrutements à des postes de responsabilité se font principalement :**

| Réponse | Points |
| :---- | :---- |
| Par la famille, les relations personnelles ou la recommandation de proches | 0 |
| Par recommandation professionnelle, sans processus formalisé | 1 |
| Par un processus interne, sans critères écrits | 2 |
| Par un processus structuré, avec fiche de poste et critères d'évaluation | 3 |
| Par un processus structuré, avec période d'essai évaluée et appui externe si nécessaire | 4 |

*Conception : formulation neutre sur un sujet sensible. Les travaux sur les échecs de succession en entreprise familiale africaine identifient les « successeurs incompétents ou inexpérimentés » comme cause récurrente — le recrutement par affinité en est le mécanisme principal.*

---

**Q12 — Type A — Sous-dimension 2.4 — Coefficient ×1,5**

> **Au cours des 12 derniers mois, la trésorerie de l'entreprise a-t-elle couvert des besoins personnels ou familiaux non budgétés ?**

| Réponse | Points |
| :---- | :---- |
| Régulièrement, sans traçabilité comptable | 0 |
| Plusieurs fois, tracées en compte courant d'associé | 1 |
| Une ou deux fois, à titre exceptionnel | 2 |
| Non, mais aucune règle écrite ne l'encadre | 3 |
| Non. Une politique de rémunération et de distribution existe et est respectée | 4 |

*Conception : la question la plus délicate et l'une des plus prédictives sur cette zone. La littérature établit que la solidarité familiale est l'un des principaux obstacles à la croissance des entreprises africaines, l'obligation morale d'assister la famille élargie restreignant la capacité de réinvestissement. La formulation est strictement descriptive et n'induit aucune faute. **Aucune option ne doit être moralisante.***

---

**Q13 — Type A — Sous-dimension 2.5 — Coefficient ×1**

> **En dehors de votre entreprise, à qui pouvez-vous parler d'une difficulté grave sans que cela ait de conséquence ?**

| Réponse | Points |
| :---- | :---- |
| Personne | 0 |
| Mon conjoint ou un membre de ma famille, uniquement | 1 |
| Un ami, qui ne comprend pas mon métier | 2 |
| Un pair dirigeant ou un conseil externe, occasionnellement | 3 |
| Un dispositif régulier — conseil, pairs, mentor — avec un rythme établi | 4 |

---

### SECTION 3 — VOUS

*Écran de transition : « 72 % des fondateurs déclarent un impact de leur activité sur leur santé mentale. 23 % en parlent à un professionnel. Cinq questions. Elles ne sortiront pas d'ici. »*

---

**Q14 — Type B — Sous-dimension 3.1 — Coefficient ×1**

> **Sur les 12 derniers mois, combien de journées complètes avez-vous passées sans travailler ni penser au travail ?**

| Réponse | Points |
| :---- | :---- |
| Aucune | 0 |
| Moins de 5 | 1 |
| 5 à 15 | 2 |
| 15 à 30 | 3 |
| Plus de 30 | 4 |

---

**Q15 — Type D — Sous-dimension 3.3 — Coefficient ×1,5**

> **Au cours des 6 derniers mois, combien des éléments suivants avez-vous constatés chez vous ?** *Sommeil dégradé · irritabilité inhabituelle · fatigue persistante malgré le repos · problème de santé nouveau · difficulté à décrocher même en congé*

| Réponse | Points |
| :---- | :---- |
| Quatre ou cinq | 0 |
| Trois | 1 |
| Deux | 2 |
| Un seul | 3 |
| Aucun | 4 |

---

**Q16 — Type C — Sous-dimension 3.5 — Coefficient ×1**

> **Vous vendez votre entreprise demain, à un bon prix. Quelle est votre première émotion ?**

| Réponse | Points |
| :---- | :---- |
| Un vide. Je ne sais pas qui je serais sans elle | 0 |
| Un soulagement immédiat, presque une fuite | 1 |
| De l'inquiétude sur ce qui viendrait après | 2 |
| De la fierté, avec un projet déjà en tête | 3 |
| De la sérénité. J'ai une trajectoire claire au-delà de cette entreprise | 4 |

*Conception : question à **double extrémité problématique**. « Un vide » et « un soulagement immédiat » sont l'un et l'autre des signaux d'alerte, pour des raisons opposées — l'un signale la fusion identitaire, l'autre l'épuisement. C'est ce type de construction qui distingue un instrument de diagnostic d'un quiz promotionnel, et c'est ce qui permettra à l'analyse finale de dire quelque chose que le répondant n'attendait pas.*

---

**Q17 — Type E — Sous-dimension 3.2 — Coefficient ×1,5**

> **La dernière décision majeure que vous avez prise. Avec qui l'aviez-vous discutée avant de la prendre ?**

| Réponse | Points |
| :---- | :---- |
| Personne | 0 |
| Personne, mais j'en ai parlé après coup | 1 |
| Une personne, qui a surtout écouté | 2 |
| Une ou deux personnes qui ont réellement contesté mon raisonnement | 3 |
| Un processus établi de contradiction avant décision | 4 |

---

**Q18 — Type C — Sous-dimension 3.4 — Coefficient ×1**

> **À quelle échéance, et sous quelle forme, sortirez-vous de la direction opérationnelle de votre entreprise ?**

| Réponse | Points |
| :---- | :---- |
| Je n'y ai jamais réfléchi | 0 |
| J'y pense, sans horizon ni forme précise | 1 |
| J'ai une idée d'horizon, rien n'est écrit | 2 |
| J'ai un horizon et une forme — transmission, cession ou direction déléguée — non formalisés | 3 |
| C'est écrit, daté, et connu d'au moins une autre personne | 4 |

*Conception : question de clôture. Elle laisse le répondant sur la question qui ouvre exactement sur l'offre du cabinet. Les analyses de la gouvernance familiale africaine identifient l'absence de planification de la succession comme l'une des deux faiblesses chroniques du segment.*

---

## 7\. LE QUESTIONNAIRE DE PROFIL ET LA CAPTURE

**Positionnement dans le parcours : après la question 18, avant l'affichage du score.**

C'est le moment de tension maximale : le répondant a investi sept minutes, il vient de se poser des questions inconfortables, et il veut son résultat. Le taux de complétion de ce bloc est de loin le plus élevé à cet endroit précis.

**Écran :** *« Votre Indice 90 est calculé. Pour l'interpréter correctement et le comparer à des dirigeants de votre catégorie, nous avons besoin de cinq informations. »*

| Champ | Options | Usage |
| :---- | :---- | :---- |
| Pays d'exercice | Liste | Localisation, routage événement |
| Chiffre d'affaires annuel | \< 100 M FCFA · 100–300 M · 300 M–1 Md · 1–5 Mds · \> 5 Mds *(équivalents MAD et €)* | **Critère dur d'éligibilité** |
| Effectif | \< 5 · 5–9 · 10–24 · 25–49 · 50+ | **Critère dur** |
| Ancienneté de l'entreprise | \< 3 ans · 3–7 · 8–15 · \> 15 | **Critère dur** |
| Dernier exercice | Bénéficiaire · À l'équilibre · Déficitaire · Je ne sais pas encore | **Critère dur** \+ signal fort si « je ne sais pas » |
| Secteur | Liste | Benchmark sectoriel |
| Événement récent *(facultatif)* | Départ ou trahison d'un associé · Perte d'un client majeur · Problème de santé · Difficulté de trésorerie · Conflit familial lié à l'entreprise · Aucun | **Le champ le plus prédictif de tout le formulaire pour la conversion** |
| Prénom, nom, email, WhatsApp Nom Entreprise | —— | Capture |

**Deux remarques :**

1. **« Je ne sais pas encore » sur la rentabilité est une réponse à conserver.** Un dirigeant qui, en cours d'année, ne sait pas si son exercice précédent est bénéficiaire, est un signal majeur — sur le pilotage comptable, sur le contrôle interne, et sur le rapport à la vérité chiffrée. Ce répondant doit être marqué dans le CRM.  
     
2. **Le champ « événement récent » est le meilleur prédicteur d'achat du formulaire.** Le rapport n°1 l'établissait : ce n'est pas la fragilité qui déclenche l'achat, c'est l'événement daté. Un score de 35 sans événement est un prospect tiède. Un score de 35 avec « départ ou trahison d'un associé » est un prospect prioritaire.

---

## 8\. LE MOTEUR DE SCORING

### 8.1 Formules

**Points bruts par axe :**

Axe1\_brut \= 1,5·Q1 \+ 1·Q2 \+ 1,5·Q3 \+ 1·Q4 \+ 1·Q5 \+ 1·Q6 \+ 2·Q7

            Maximum \= 4 × 9   \= 36 points

Axe2\_brut \= 2·Q8 \+ 1,5·Q9 \+ 1·Q10 \+ 1·Q11 \+ 1,5·Q12 \+ 1·Q13

            Maximum \= 4 × 8   \= 32 points

Axe3\_brut \= 1·Q14 \+ 1,5·Q15 \+ 1·Q16 \+ 1,5·Q17 \+ 1·Q18

            Maximum \= 4 × 6   \= 24 points

**Scores d'axe normalisés sur 100 :**

A1 \= (Axe1\_brut / 36\) × 100

A2 \= (Axe2\_brut / 32\) × 100

A3 \= (Axe3\_brut / 24\) × 100

**Indice 90 :**

INDICE 90 \= (0,40 × A1) \+ (0,35 × A2) \+ (0,25 × A3)

Arrondi à l'entier. Échelle 0 à 100\.

### 8.2 Score par sous-dimension

Chaque sous-dimension est également calculée séparément (moyenne des questions qui la composent, normalisée sur 100). C'est de là que sortent :

- **les trois forces** (les trois sous-dimensions les mieux notées)  
- **les trois fragilités** (les trois moins bien notées)  
- **le point critique** (la sous-dimension la plus faible, départagée par le coefficient si égalité)

---

## 9\. LA CONVERSION SCORE → JOURS D'AUTONOMIE

### 9.1 Formule

JOURS \= arrondi( 3 × e^(INDICE90 / 21\) )

Plafonné à 365\.

### 9.2 Table de correspondance

| Indice 90 | Jours d'autonomie | Lecture |
| :---- | :---- | :---- |
| 10 | **5 jours** | L'entreprise s'arrête avec vous |
| 20 | **8 jours** | Une semaine de marge |
| 30 | **12 jours** | Vos congés sont déjà un risque |
| 40 | **20 jours** | Une hospitalisation courte est absorbable |
| 50 | **32 jours** | Un mois. Pas un trimestre |
| 60 | **52 jours** | La transition est engagée |
| 70 | **84 jours** | Vous approchez du seuil des 90 jours |
| 80 | **135 jours** | L'entreprise vous survit |
| 90 | **217 jours** | L'entreprise est un actif autonome |
| 100 | **365 jours** | Entreprise entièrement transférable |

### 9.3 Pourquoi une courbe exponentielle et non linéaire

Trois raisons, toutes délibérées :

1. **C'est conforme à la réalité.** Passer de « rien ne tient sans moi » à « ça tient deux semaines » est un petit gain réel. Passer de « ça tient deux mois » à « ça tient six mois » est un saut structurel. La progression de l'autonomie n'est pas linéaire.  
2. **Cela produit l'inconfort recherché.** La distribution attendue des répondants se situe entre 25 et 55 d'Indice 90, ce qui donne **10 à 40 jours**. La très grande majorité découvrira un chiffre à deux chiffres bas. C'est exactement l'effet voulu.  
3. **Cela protège la crédibilité.** Un modèle linéaire donnerait 180 jours à un score de 50 — un chiffre que le répondant sait faux, et qui détruirait la confiance dans l'ensemble de l'instrument.

### 9.4 La phrase de résultat

L'affichage doit être sobre et sans emphase. Toute dramatisation typographique affaiblit l'effet.

> **Indice 90 : 34 / 100** **Votre entreprise fonctionne environ 14 jours sans vous.**  
>   
> Le seuil au-delà duquel une entreprise est considérée comme transférable est de 90 jours.

---

## 10\. LES CINQ NIVEAUX ET LES SIX ARCHÉTYPES CROISÉS

### 10.1 Les cinq niveaux (lecture du score global)

| Indice 90 | Niveau | Formulation | Fréquence attendue |
| :---- | :---- | :---- | :---- |
| **0–25** | **Point de défaillance unique** | L'entreprise et vous êtes la même entité. Toute interruption de votre part est une interruption de l'activité. | \~20 % |
| **26–45** | **Centre névralgique** | L'entreprise existe, mais tous les flux — décision, relation, information, argent — passent par un seul point. | \~35 % |
| **46–62** | **Transition inachevée** | Vous avez commencé à construire une organisation. Elle n'est pas encore autonome, et vous n'avez pas encore lâché. | \~25 % |
| **63–80** | **Structure émergente** | L'entreprise fonctionne largement sans vous. Il reste des dépendances identifiables et traitables. | \~15 % |
| **81–100** | **Entreprise transférable** | L'entreprise est un actif qui existe indépendamment de vous. Elle est cessible, finançable et durable. | \~5 % |

### 10.2 Les six archétypes croisés — la vraie intelligence de l'instrument

**Le score global n'est pas l'information la plus utile. L'écart entre les axes l'est.** C'est ce croisement qui produira l'effet « ils ont compris ma situation exacte ».

*Seuil de qualification : un axe est dit faible en dessous de 50, fort au-dessus.*

| \# | Combinaison | Nom | Diagnostic délivré |
| :---- | :---- | :---- | :---- |
| **1** | A1 faible · A2 faible · A3 faible | **La convergence** | Les trois cercles sont fragiles simultanément. Ce n'est pas un problème d'organisation ni de personne : c'est un problème de système. Traiter un seul axe ne produira rien. **C'est la configuration la plus urgente et la plus fréquente chez les dirigeants dont l'entreprise a grandi plus vite que la structure.** |
| **2** | A1 faible · A2 faible · A3 **fort** | **Le pilote solide, la machine fragile** | Vous tenez. C'est précisément ce qui vous met en danger : votre résistance personnelle masque une fragilité structurelle et retarde la décision de la traiter. Le risque n'est pas absent, il est **différé**. Il se matérialisera au premier événement que votre volonté ne pourra pas absorber. |
| **3** | A1 faible · A2 **fort** · A3 faible | **L'équipe existe, la place ne s'est pas libérée** | Vous avez recruté des gens capables et vous ne leur avez pas donné l'espace. Le problème n'est pas votre entourage — il est dans votre incapacité actuelle à lâcher. **C'est le diagnostic le plus difficile à entendre et le plus rapide à corriger.** |
| **4** | A1 **fort** · A2 faible · A3 faible | **Les processus tiennent, les hommes s'usent** | L'organisation fonctionne, mais elle repose sur des procédures et non sur des personnes solides. Vous et votre entourage payez le prix d'un système qui tourne sans que personne n'y soit vraiment à sa place. Fragilité à échéance moyenne : les bons partiront. |
| **5** | A1 **fort** · A2 **fort** · A3 faible | **L'entreprise est prête, vous ne l'êtes pas** | Vous avez construit une entreprise qui peut fonctionner sans vous. Vous n'avez pas construit une vie qui peut fonctionner sans elle. C'est la configuration classique du dirigeant qui reste par identité et non par nécessité. **La question n'est plus « comment déléguer » mais « qui suis-je après ».** |
| **6** | A1 **fort** · A2 **fort** · A3 **fort** | **L'actif transférable** | Votre entreprise est un actif autonome. Votre enjeu n'est plus la structuration mais la valorisation et le choix du moment. |

### 10.3 Cas particuliers à traiter

| Situation | Traitement |
| :---- | :---- |
| Deux axes à égalité au seuil de 50 | Départager par la sous-dimension la plus faible |
| A1 \> 80 mais Q7 \= 0 | Incohérence — déclencher le module de la section 11 |
| A3 très faible avec signaux de détresse | Déclencher le protocole de sécurité (section 14\) **avant** tout affichage commercial |

---

## 11\. DÉTECTION D'INCOHÉRENCES

Un instrument professionnel ne fait pas semblant de ne pas voir les contradictions. Il les nomme — et ce faisant, il démontre sa profondeur.

### 11.1 Les cinq contrôles

| \# | Contrôle | Règle | Message généré |
| :---- | :---- | :---- | :---- |
| 1 | Absence vs perception | Q1 ≥ 3 **et** Q7 ≤ 1 | *« Vous déclarez vous être absenté plus de 11 jours, mais estimez qu'un client remarquerait votre absence en moins d'une semaine. Cela signifie souvent que vous n'avez jamais réellement décroché pendant cette absence. »* |
| 2 | Second de commandement vs vécu | Q8 \= 4 **et** Q1 ≤ 1 | *« Vous indiquez qu'une personne a déjà dirigé à votre place, mais que vous ne vous êtes jamais absenté plus de cinq jours. L'expérience de remplacement a probablement été partielle ou supervisée. »* |
| 3 | Délégation théorique vs réelle | Q3 ≥ 3 **et** Q5 ≤ 1 | *« Vos relations clients semblent déléguées, mais plus de dix décisions par semaine vous remontent encore. La délégation est commerciale, pas décisionnelle. »* |
| 4 | Procédures vs dépendance institutionnelle | Q4 ≥ 3 **et** Q6 \= 0 | *« Vos procédures internes sont documentées, mais l'ensemble de vos relations bancaires et administratives repose sur vous seul. C'est la dépendance la plus difficile à transmettre, parce qu'elle est relationnelle et non procédurale. »* |
| 5 | Contradiction sur le contrôle | Q9 \= 0 **et** Q17 ≥ 3 | *« Vous déclarez faire contester vos décisions avant de les prendre, mais ne pas vous souvenir de la dernière fois qu'un collaborateur vous a dit que vous aviez tort. La contradiction vient probablement de l'extérieur de l'entreprise, pas de l'intérieur. »* |

### 11.2 Formulation du bloc dans le rapport

> **Une observation sur vos réponses**  
>   
> Deux de vos réponses sont difficilement compatibles entre elles. Ce n'est ni une erreur ni un défaut de sincérité : c'est l'un des constats les plus fréquents de ce diagnostic. Il traduit presque toujours un écart entre **l'organisation telle qu'elle est décrite** et **l'organisation telle qu'elle fonctionne au quotidien**.  
>   
> *\[Message généré\]*  
>   
> Cet écart est en lui-même une information. Il indique où regarder en priorité.

**C'est probablement le bloc qui produira le plus fort effet de crédibilité de tout le rapport.** Il démontre qu'un raisonnement a été appliqué, et non un simple calcul de points.

---

## 12\. LE RAPPORT DE 8 PAGES

**Format :** PDF A4 généré automatiquement, envoyé par email dans les 60 secondes, doublé d'une version web consultable. Nom du fichier : `Indice90_[Nom]_[Date].pdf`.

### 12.1 Structure

| Page | Contenu |
| :---- | :---- |
| **1 — Couverture** | Nom du dirigeant, nom de l'entreprise, date. **Indice 90 en très grand. Nombre de jours en dessous.** Une seule phrase. Rien d'autre. Aucune image décorative. |
| **2 — Le verdict** | Le niveau (parmi les cinq), l'archétype croisé (parmi les six), et un paragraphe de 150 mots qui décrit la situation **sans conseil ni vente**. La page qui doit donner le sentiment d'avoir été compris. |
| **3 — Les trois axes** | Trois jauges, chacune avec le score, le positionnement par rapport à la cohorte, et trois lignes de lecture. Un radar de synthèse. |
| **4 — Vos trois forces** | Les trois sous-dimensions les mieux notées, avec pour chacune : ce que cela vous a permis de construire, et **quel risque cette force crée**. *(Toute force portée à l'excès devient une dépendance — le dire élève immédiatement le niveau de l'analyse.)* |
| **5 — Vos trois fragilités** | Les trois sous-dimensions les plus faibles, avec pour chacune : la description factuelle, la conséquence prévisible à 12–24 mois, et un premier levier concret. |
| **6 — Le point critique** | **Une seule page, une seule fragilité.** Celle qui, traitée, débloquerait le plus les autres. Avec l'explication de pourquoi celle-là et pas une autre. |
| **7 — Le scénario de rupture** | Voir section 13\. La page la plus importante du document. |
| **8 — La suite logique** | Trois actions à mener dans les 30 jours, réalisables sans le cabinet. Puis, en bas de page seulement, l'orientation adaptée au profil. |

### 12.2 Règle de proportion

**Sept pages d'analyse, une demi-page de proposition commerciale.** C'est ce rapport qui distingue un cabinet d'un vendeur. Un dirigeant qui reçoit huit pages d'analyse gratuite dont seule la fin propose quelque chose transmettra le document à ses pairs. Un dirigeant qui reçoit une plaquette déguisée le supprimera.

Les trois actions gratuites de la page 8 doivent être **réellement utiles et applicables sans vous**. C'est contre-intuitif commercialement et c'est exactement ce qui crée la confiance sur ce marché.

---

## 13\. LE SCÉNARIO DE RUPTURE PERSONNALISÉ

C'est la page qui sera photographiée et partagée. Elle transforme un score en récit.

### 13.1 Principe

Un texte de 300 à 400 mots, généré à partir des réponses, qui raconte **semaine par semaine** ce qui se passerait dans l'entreprise en cas d'absence brutale de 90 jours. Chaque paragraphe est déclenché par une réponse spécifique.

### 13.2 Matrice de génération

| Déclencheur | Bloc inséré | Timing narratif |
| :---- | :---- | :---- |
| Q5 ≤ 1 | Les décisions en attente s'accumulent | Jours 1–5 |
| Q2 \= 0 | Les paiements fournisseurs se bloquent, faute de signataire | Jours 3–10 |
| Q6 \= 0 | Une échéance administrative ou bancaire n'est pas traitée ; personne ne connaît l'interlocuteur | Jours 10–25 |
| Q3 ≤ 1 | Le premier client important demande à vous parler ; on ne sait pas quoi lui dire | Jours 12–20 |
| Q8 ≤ 1 | Un conflit d'autorité apparaît dans l'équipe ; personne n'a le mandat d'arbitrer | Jours 20–40 |
| Q4 ≤ 1 | Une opération courante ne peut pas être reproduite ; la connaissance manque | Jours 25–45 |
| Q12 ≤ 1 | La trésorerie est sollicitée sans le filtre que vous exerciez | Jours 30–60 |
| Q10 ≤ 1 | Un cadre clé part ; l'incertitude a levé ses dernières hésitations | Jours 45–70 |
| Q3 ≤ 1 **et** Q8 ≤ 1 | Le premier client important part | Jours 60–90 |

### 13.3 Exemple généré (profil Indice 90 \= 31, 13 jours)

> **Ce qui se passerait**  
>   
> **Jours 1 à 5\.** Les premières décisions remontent et restent en attente. Personne ne se déclare bloqué : chacun suppose que quelqu'un d'autre a la réponse. Le travail continue en apparence.  
>   
> **Jours 3 à 12\.** Deux règlements fournisseurs ne partent pas. Aucune signature alternative n'existe. L'un des fournisseurs relance, puis passe l'entreprise en paiement comptant. Le besoin en trésorerie augmente d'un coup, sans que personne n'en identifie la cause immédiate.  
>   
> **Jours 10 à 25\.** Une échéance sociale n'est pas traitée dans les temps. Le dossier était historiquement suivi par vous, avec un interlocuteur que vous étiez seul à connaître. La régularisation prendra six semaines et coûtera des pénalités.  
>   
> **Jours 12 à 20\.** Votre deuxième client par le chiffre d'affaires demande à vous joindre. On lui répond que vous êtes indisponible. Il rappelle deux fois. À la troisième, il contacte un concurrent — non par défiance, mais parce qu'il a un besoin à couvrir.  
>   
> **Jours 20 à 45\.** Un désaccord opérationnel oppose deux responsables. Aucun n'a autorité sur l'autre. Le sujet reste ouvert. Les équipes choisissent leur camp. La productivité baisse sans qu'aucun indicateur ne le montre.  
>   
> **Jours 45 à 90\.** Votre responsable le plus solide reçoit une proposition extérieure. Dans un contexte stable, il l'aurait déclinée. Il l'accepte.  
>   
> **Au jour 90\.** L'entreprise existe toujours. Elle a perdu un client majeur, un cadre clé, une partie de sa trésorerie et sa capacité à décider vite. Aucun de ces événements n'était prévisible isolément. Tous découlent du même point unique.  
>   
> ---

>   
> *Ce scénario est généré à partir de vos réponses. Il ne décrit pas une fatalité. Il décrit la séquence logique de ce que vous avez déclaré.*

### 13.4 Règles de rédaction impératives

- **Aucun adjectif dramatique.** Pas de « catastrophe », « effondrement », « désastre ». La sobriété est ce qui rend le texte crédible et donc effrayant.  
- **Aucune faillite.** L'entreprise ne meurt pas. Elle s'appauvrit. C'est plus réaliste et plus dérangeant.  
- **Aucun reproche.** Jamais « vous auriez dû ». Uniquement « ce qui se passerait ».  
- **Une dernière ligne qui ouvre.** Le texte se termine sur une possibilité, pas sur une condamnation.

---

## 14\. LE PROTOCOLE DE SÉCURITÉ

Un instrument qui interroge la santé mentale et l'identité doit prévoir le cas où il touche une personne réellement en difficulté. C'est une exigence déontologique et une protection de la marque.

### 14.1 Condition de déclenchement

SI  Q15 \= 0  ET  Q14 \= 0  ET  Q16 ≤ 1  ET  Q13 \= 0

ALORS déclencher le protocole

*Traduction : quatre ou cinq signaux physiques, aucun jour de repos sur un an, une réaction de vide ou de fuite à l'idée de vendre, et personne à qui parler.*

### 14.2 Effets

| Élément | Modification |
| :---- | :---- |
| Rapport | Un encadré sobre est inséré en page 2 : *« Plusieurs de vos réponses indiquent une charge personnelle élevée et durable. Ce n'est pas un jugement, et cela n'a rien d'exceptionnel — 54 % des dirigeants déclarent avoir traversé un épuisement au cours des douze derniers mois. Nous vous recommandons d'en parler à un médecin ou à un professionnel de santé. Cette recommandation est indépendante de tout ce qui suit dans ce document. »* |
| Scénario de rupture | **Supprimé.** Ce contenu n'est pas approprié pour une personne en état d'épuisement. |
| Séquence commerciale | **Désactivée pendant 21 jours.** Aucune relance, aucune offre. Un seul email de suivi non commercial. |
| CRM | Marqué « vigilance ». Aucun appel de qualification. |

### 14.3 Pourquoi c'est aussi une bonne décision commerciale

Un dirigeant en épuisement à qui on vend un programme à 13 M FCFA est un risque de contentieux, un risque d'échec de mission et un risque réputationnel. Un dirigeant en épuisement à qui on dit « allez voir un médecin, on reparlera plus tard » revient six mois après — et il en parle autour de lui. **Le refus de vendre est, sur ce marché, le meilleur argument de vente.**

---

## 15\. ROUTAGE COMMERCIAL

### 15.1 La matrice

| Indice 90 | Critères durs remplis | Événement récent déclaré | Orientation | Priorité |
| :---- | :---- | :---- | :---- | :---- |
| 26–45 | Oui | Oui | **Appel sous 48 h → Diagnostic 2 500 €** | **★★★ Absolue** |
| 26–45 | Oui | Non | Diagnostic 2 500 € | ★★ Haute |
| 46–62 | Oui | Oui | Diagnostic 2 500 € | ★★ Haute |
| 46–62 | Oui | Non | Formation 997 € → puis diagnostic | ★ Moyenne |
| 0–25 | Oui | Oui | Appel prudent, diagnostic — vérifier le protocole de sécurité | ★★ Haute, avec précaution |
| 0–25 | Non | — | Abonnement \+ formation. **Pas de sollicitation premium** | Nurturing |
| 26–62 | Non | — | Abonnement \+ formation | Nurturing |
| 63–80 | Oui | — | Formation \+ invitation séminaire | ★ Moyen terme |
| 81–100 | — | — | Invitation séminaire, candidat témoignage ou prescripteur | Relation |
| Tout score | — | Protocole de sécurité actif | Aucune sollicitation 21 jours | Suspendu |

### 15.2 L'observation contre-intuitive

**Le meilleur prospect n'est pas celui qui a le score le plus bas.**

Un dirigeant à 12/100 est souvent en crise et incapable de mobiliser 13 M FCFA. Un dirigeant à 75/100 n'a pas de problème ressenti.

**Le prospect idéal se situe entre 26 et 45, remplit les critères financiers, et a déclaré un événement de rupture dans les 24 derniers mois.** Il a la douleur, la conscience de la douleur, et les moyens. C'est ce segment qui doit absorber la totalité du temps commercial de l'équipe.

Cette règle doit être codée dans le CRM, pas laissée à l'appréciation.

### 15.3 Séquence de relance (profil prioritaire)

| Jour | Action | Contenu |
| :---- | :---- | :---- |
| J0 | Email automatique | Rapport PDF. Aucune vente. |
| J+2 | Email | Le point critique développé, avec un cas anonymisé similaire |
| J+4 | **Appel** | Non commercial : *« Un point de votre rapport mérite une précision. »* |
| J+7 | Email | Invitation à la prochaine journée portes ouvertes |
| J+12 | WhatsApp | Question ouverte sur le point critique |
| J+18 | Email | Proposition de diagnostic, avec ce qu'il contient précisément |
| J+30 | Email | Nouveau contenu, sans offre. Retour en nurturing si pas de réponse |

---

## 16\. EXPÉRIENCE UTILISATEUR ET DESIGN

### 16.1 Principes

| Principe | Application |
| :---- | :---- |
| **Une question par écran** | Aucune liste. Le rythme crée la concentration. |
| **Pas de retour arrière** | Protège la spontanéité et empêche l'optimisation du score. Annoncé en préambule. |
| **Barre de progression discrète** | Position en bas, fine, sans pourcentage criard. |
| **Écrans de transition informatifs** | Chaque transition délivre une donnée sourcée. C'est là que se construit la crédibilité. |
| **Aucune gamification** | Pas d'emoji, pas de confettis, pas de barre qui se remplit en couleur. Le sujet est sérieux ; le traitement doit l'être. |
| **Mobile d'abord** | Plus de 80 % des accès viendront d'un téléphone. Zones de tap larges, chargement sous 2 secondes en 3G. |
| **Poids de page \< 400 Ko** | Contrainte réseau réelle sur la zone. Aucune vidéo, aucune police lourde, images optimisées. |
| **Sauvegarde de progression** | Reprise possible en cas de coupure réseau. |

### 16.2 Écran d'accueil

> **LE TEST DES 90 JOURS**  
>   
> Les travaux universitaires sur les entreprises africaines établissent un constat sévère : leur durée de vie n'excède souvent pas huit ans — et pour les plus solides, elle est réduite à l'espérance de vie de leur fondateur.  
>   
> Ce test mesure une seule chose : **combien de temps votre entreprise fonctionnerait sans vous.**  
>   
> 18 questions. 7 minutes. Aucune réponse n'est bonne ou mauvaise. Répondez à ce qui se passe réellement, pas à ce qui devrait se passer.  
>   
*À l'issue des 18 questions, vous recevrez votre Indice 90 et un rapport de 8 pages par email*  
>   
> **\[ Commencer \]**  
>   
> *Vos réponses sont confidentielles et ne sont jamais transmises à un tiers.*  
>   
>   
> 

### 16.3 Charte visuelle

| Élément | Spécification |
| :---- | :---- |
| Palette | Deux couleurs maximum \+ trois gris. Aucun rouge alarmiste, aucun vert rassurant. La sobriété est le message. |
| Typographie | Une serif pour les titres (autorité), une sans-serif pour le corps (lisibilité mobile). |
| Graphiques du rapport | Trois jauges linéaires \+ un radar à trois branches. Rien de plus. |
| Photographie | Aucune photo d'illustration générique. Si visuel il y a : uniquement l'équipe réelle, nommée. |
| Signature du rapport | Signé par un nom et une fonction réels, pas par « L'équipe ». |

### 16.4 Localisation

| Élément | Traitement |
| :---- | :---- |
| Devise | FCFA (UEMOA/CEMAC) · MAD (Maroc) · € (diaspora) — détection par pays déclaré ou IP |
| Vocabulaire | « compte courant d'associé », « OHADA », « organismes sociaux », « exercice », « bilan » — le lexique juridique et comptable réel de la zone |
| Références | Les statistiques citées doivent être africaines ou francophones. Aucune référence exclusivement américaine. |

---

## 17\. BENCHMARK ET EXPLOITATION DES DONNÉES

### 17.1 Le problème du démarrage

Le rapport promet une comparaison à une cohorte. Cette cohorte n'existe pas au lancement.

**Règle absolue : ne jamais inventer de benchmark.** Un chiffre fabriqué découvert détruit la crédibilité de l'ensemble.

| Phase | Nombre de répondants | Formulation dans le rapport |
| :---- | :---- | :---- |
| Amorçage | 0 – 200 | Aucune comparaison. Le rapport présente le score et les seuils absolus uniquement. |
| Constitution | 200 – 800 | *« Sur les \[N\] premiers dirigeants évalués, l'Indice 90 médian s'établit à \[X\]. »* |
| Référence | \> 800 | Comparaison par pays, par secteur, par taille et par tranche d'âge de l'entreprise |
| Publication | \> 2 000 | **Baromètre annuel de l'Indice 90** |

### 17.2 Le Baromètre annuel — l'actif stratégique

Une fois 2 000 réponses collectées, la publication d'une étude annuelle produit simultanément :

- **Une position d'autorité** qu'aucun concurrent identifié ne possède  
- **Un motif d'introduction** auprès de toutes les organisations patronales de la zone (CGECI, patronats nationaux, CJD)  
- **Une reprise média** par la presse économique régionale, à coût nul  
- **Un contenu SEO et AEO** structurant et non copiable  
- **Un argument de prescription** pour les experts-comptables et les banquiers

**C'est le levier de crédibilité le moins cher et le plus puissant de tout le plan.** L'objectif de collecte de la première année n'est donc pas seulement commercial : il est éditorial.

### 17.3 Cible de collecte

| Période | Tests complétés |
| :---- | :---- |
| Octobre – décembre 2026 | 600 |
| Année 2027 | 4 000 |
| Cumul fin 2027 | **4 600** → publication du premier Baromètre en janvier 2028 |

---

## 18\. INDICATEURS DE PERFORMANCE DE L'OUTIL

| Indicateur | Seuil d'alerte | Cible |
| :---- | :---- | :---- |
| Taux de complétion (démarrage → Q18) | \< 45 % | **\> 60 %** |
| Taux d'abandon par question | \> 8 % sur une question | \< 5 % |
| Taux de renseignement du profil (Q18 → email) | \< 60 % | **\> 75 %** |
| Coût par test complété (média payant) | \> 6 € | **\< 3,50 €** |
| Taux d'ouverture du rapport PDF | \< 50 % | **\> 70 %** |
| Test → abonnement | \< 8 % | **12 %** |
| Test → formation | \< 3 % | **6 %** |
| Test → diagnostic (profils éligibles) | \< 6 % | **12 %** |
| Partage du rapport à un tiers | — | **\> 15 %** |
| Indice 90 médian de la cohorte | — | *À observer — si \> 60, les questions sont trop indulgentes* |

**Sur le dernier point :** si l'Indice 90 médian observé dépasse 60, l'instrument est mal calibré et doit être durci. La distribution attendue place la médiane entre **32 et 42**.

---

## 19\. CE QUE JE DOIS SAVOIR DE VOUS

Sept décisions m'appartiennent mal — elles vous appartiennent. Vos réponses me permettront de finaliser la spécification.

**1\. La longueur.** Le rapport n°2 prévoyait 12 à 15 questions en 4 minutes. J'en propose 18 en 7 minutes, parce que la profondeur demandée n'est pas atteignable en dessous. Le coût est un taux de complétion inférieur de 10 à 15 points. Confirmez-vous les 18 questions, ou préférez-vous une version courte de 12 questions avec une version longue optionnelle après le score ?

**2\. Le nom.** « IA-90 » entre en collision avec l'assistant IA du cabinet. Je propose **« Le Test des 90 Jours »** pour l'outil et **« Indice 90 »** pour la métrique. Validez-vous, ou souhaitez-vous d'autres pistes ?

**3\. Le moment de la capture email.** Je recommande : score affiché immédiatement à l'écran, rapport complet de 8 pages envoyé par email après renseignement du profil. L'alternative — email exigé avant tout affichage — augmente le nombre de contacts mais réduit la complétion et la confiance. Quelle option ?

**4\. La question sur la trésorerie familiale (Q12).** C'est la question la plus prédictive et la plus délicate. Elle touche un sujet culturellement sensible. Je l'ai formulée sans jugement. Souhaitez-vous la conserver telle quelle, l'adoucir, ou la réserver au diagnostic payant ?

**5\. Les compensations et addictions.** Le rapport n°2 identifiait ce déclencheur comme réel mais interdisait son usage publicitaire. Je l'ai **exclu du test** et intégré uniquement sous forme indirecte (Q15, signaux physiques). Confirmez-vous cette exclusion ?

**6\. La version « croisée » avec le bras droit.** Option à fort potentiel : proposer que le numéro deux du dirigeant réponde au même questionnaire, et livrer un rapport comparatif montrant les écarts de perception. L'écart entre ce que le dirigeant croit avoir délégué et ce que son second constate est généralement considérable — et c'est l'argument de vente le plus difficile à réfuter qui existe. Cela demande un développement supplémentaire. Est-ce une priorité de version 1, ou de version 2 ?

**7\. Le seuil d'éligibilité.** Le rapport n°2 fixait 300 M FCFA de chiffre d'affaires et 10 collaborateurs. Sur la base des données de structure du tissu entrepreneurial ivoirien — où 95,2 % des entreprises formelles réalisent moins d'un milliard de FCFA, dont 70 % de très petites entreprises — ce seuil restreint fortement le vivier. Maintenez-vous ces critères, ou souhaitez-vous les abaisser pour la première cohorte, quitte à les relever ensuite ?

---

## SOURCES

**Entreprises familiales et gouvernance en Afrique**

- ESSCA Knowledge — *Quels défis pour les entreprises familiales africaines et RD congolaises ?* (durée de vie ≤ 8 ans ; pérennité réduite à l'espérance de vie du fondateur)  
- ESSCA Knowledge — *L'entreprise familiale africaine et les défis de la succession* (cas Fotso, Cameroun)  
- Financial Afrik — *Le risque silencieux pesant sur les entreprises familiales africaines* (gouvernance mal structurée, absence de planification successorale)  
- Revue africaine de management — causes d'échec des successions : plans flous, successeurs inexpérimentés, rivalités familiales  
- Financial Afrik — *Capital familial : le vrai stress test* (séparation des rôles famille / actionnaire / dirigeant)

**Défaillance des PME africaines**

- AFD / Proparco (2019) — *Quelles sont les causes de défaut des PME en Afrique subsaharienne ?* (retards de paiement, manque de structuration, manque de compétences managériales, diversification excessive, endettement)  
- The Africa Business Index — causes de faillite : mauvaise gestion clientèle et personnel, absence de contrôle interne, incapacité à définir une organisation

**Frontière famille / entreprise**

- Travaux sur la solidarité familiale comme obstacle à la croissance des entreprises africaines  
- Cairn.info — *Survie entrepreneuriale en Afrique : le cas des entreprises guinéennes* (trésorerie mobilisée au jour le jour pour la famille)  
- Cairn.info — *Les entrepreneurs informels en Afrique et les freins à la formalisation : le cas du Niger* (Simen, 2018 — obligation morale d'assistance familiale et capacité de réinvestissement)  
- Persée — Simen S., *L'entreprise familiale au Sénégal : entre solidarité, tensions et recompositions*

**Référentiel international**

- John Warrillow — *Value Builder System*, driver « Hub & Spoke » ; étalonnage sur 80 000+ entreprises ; scores \> 80 → offres \+71 % ; scores \> 90 → offres 7,1×

**Santé du dirigeant**

- Startup Snapshot (2025) — 72 % d'impact sur la santé mentale ; solitude 7,6/10  
- Sifted (2025) — 54 % de burnout sur 12 mois ; 64 % passent moins de temps avec leurs proches  
- UCSF (Freeman) — \+50 % de prévalence de troubles ; 23 % cherchent un soutien professionnel

**Structure du tissu entrepreneurial**

- ANStat / INS Côte d'Ivoire, *Répertoire National des Entreprises 2024* — 95,2 % de PME, dont 70 % de TPE ; 4,8 % de grandes entreprises \> 1 Md FCFA générant plus de 90 % du CA national ; 73,4 % des entreprises formelles à Abidjan

---

*Document de spécification établi le 30 juillet 2026\. Les fréquences de distribution des niveaux (section 10.1) sont des estimations a priori, à recalibrer après les 500 premiers tests complétés.*  
