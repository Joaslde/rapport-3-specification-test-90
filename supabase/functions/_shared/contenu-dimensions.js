/*
  LES 15 SOUS-DIMENSIONS — textes du rapport, pages 3, 4, 5 et 6
  Source : rapport-3-specification-test-90-jours.md §5 et §12.1

  Pour chaque sous-dimension, trois traitements :

    lecture    → page 3, trois lignes de lecture par axe
    force      → page 4 : ce que cela a permis de construire
                 + LE RISQUE QUE CETTE FORCE CRÉE
                 (« Toute force portée à l'excès devient une dépendance —
                    le dire élève immédiatement le niveau de l'analyse. »)
    fragilite  → page 5 : description factuelle
                 + conséquence prévisible à 12-24 mois
                 + un premier levier concret
    critique   → page 6 : pourquoi celle-là et pas une autre

  RÈGLES : aucun reproche, aucun adjectif dramatique, aucune moralisation.
  ⚠️ CONTENU À FAIRE VALIDER PAR LE MANAGER (todo.md 6.12).
*/

export const DIMENSIONS_TEXTES = {
  // =====================================================================
  // AXE 1 — L'ENTREPRISE SANS VOUS
  // =====================================================================

  '1.1': {
    libelle: 'Concentration décisionnelle',
    lecture: 'Le volume de décisions qui remontent jusqu’à vous alors qu’un autre pourrait les prendre.',
    force: {
      acquis:
        'Les décisions ne remontent pas toutes jusqu’à vous. Vos équipes tranchent à leur niveau, ' +
        'ce qui accélère le fonctionnement quotidien et libère votre attention pour ce qui compte.',
      risque:
        'Une délégation décisionnelle qui fonctionne bien finit par vous éloigner du terrain. ' +
        'Vous découvrez les problèmes plus tard, quand ils ont déjà pris de l’ampleur. La contrepartie ' +
        'd’une bonne délégation est un dispositif d’information qui ne dépend pas des remontées ' +
        'spontanées.',
    },
    fragilite: {
      description:
        'Un volume important de décisions vous revient chaque semaine alors que d’autres personnes ' +
        'auraient l’information et la légitimité pour les prendre.',
      consequence:
        'ce flux ne diminue pas de lui-même : il croît avec l’activité. Vos ' +
        'collaborateurs prennent l’habitude de ne pas décider, ce qui rend chaque délégation ' +
        'ultérieure plus difficile. Le temps que vous consacrez à l’arbitrage courant est celui ' +
        'qui manque à la construction de l’organisation.',
      levier:
        'Pendant une semaine, notez chaque décision qui vous remonte et la personne qui aurait pu ' +
        'la prendre. Le classement obtenu désigne de lui-même les deux ou trois délégations à ' +
        'formaliser en premier.',
    },
    critique:
      'La concentration décisionnelle est le point critique parce qu’elle conditionne tout le reste. ' +
      'Tant que les décisions passent par vous, aucune procédure ne s’applique vraiment et aucun ' +
      'second ne peut s’exercer. C’est la contrainte qui bloque les autres.',
  },

  '1.2': {
    libelle: 'Concentration relationnelle',
    lecture: 'La part des relations extérieures — clients, banque, administration — qui vous appartient en propre.',
    force: {
      acquis:
        'Vos relations extérieures ne reposent pas toutes sur votre seule personne. Clients, ' +
        'partenaires et interlocuteurs institutionnels ont des points de contact identifiés dans ' +
        'l’entreprise, ce qui rend l’activité lisible de l’extérieur.',
      risque:
        'Des relations bien réparties peuvent masquer une perte de proximité. Les signaux faibles ' +
        'd’un client mécontent ou d’une administration qui durcit sa position ne remontent plus ' +
        'directement jusqu’à vous. Ce qui protège de la dépendance éloigne aussi de l’information.',
    },
    fragilite: {
      description:
        'Une part déterminante de vos relations extérieures repose sur vous seul. Ni l’historique, ' +
        'ni les contacts, ni la confiance construite ne sont partagés.',
      consequence:
        'c’est la dépendance la plus difficile à transmettre, parce qu’elle est ' +
        'relationnelle et non procédurale. Elle ne se documente pas. En cas d’absence, un client ' +
        'important qui ne vous joint pas ne se plaint pas : il cherche une alternative.',
      levier:
        'Choisissez une seule relation — un client, la banque ou l’administration — et faites ' +
        'accompagner votre interlocuteur par un collaborateur sur les trois prochains échanges. ' +
        'Sans transfert annoncé : une simple présence répétée suffit à installer un second visage.',
    },
    critique:
      'La concentration relationnelle est le point critique parce qu’elle ne se transmet par aucun ' +
      'document. Vous pouvez écrire toutes vos procédures : la confiance qu’un client ou un banquier ' +
      'place en vous ne s’écrit pas. C’est le point de dépendance le plus invisible et le plus long ' +
      'à traiter.',
  },

  '1.3': {
    libelle: 'Codification et procédures',
    lecture: 'Ce sur quoi votre organisation s’appuierait pour former un remplaçant demain matin.',
    force: {
      acquis:
        'Votre activité est documentée. Un remplacement à un poste clé ne repose pas sur la seule ' +
        'mémoire des personnes en place, ce qui réduit le coût de chaque départ et raccourcit ' +
        'chaque intégration.',
      risque:
        'Une organisation très codifiée peut se rigidifier. Les procédures écrites remplacent ' +
        'progressivement le jugement, et les situations non prévues se traitent mal. Le risque ' +
        'n’est pas la dépendance, il est l’application sans discernement.',
    },
    fragilite: {
      description:
        'Le fonctionnement de votre entreprise repose principalement sur la mémoire des personnes ' +
        'en place. Peu de choses sont écrites, ou ce qui l’est n’a jamais servi lors d’un ' +
        'remplacement réel.',
      consequence:
        'chaque départ emporte une part du savoir-faire. Les remplacements prennent ' +
        'des mois au lieu de semaines, et les erreurs déjà commises se répètent parce que personne ' +
        'ne se souvient de leur correction.',
      levier:
        'Ne rédigez pas un manuel. Demandez au titulaire du poste le plus critique d’écrire, en ' +
        'une page, ce qu’il ferait faire à son remplaçant pendant sa première semaine. Une page ' +
        'existante vaut mieux qu’un manuel projeté.',
    },
    critique:
      'La codification est le point critique parce qu’elle est la condition de tout transfert. ' +
      'Un second de commandement compétent sans procédures reconstruit l’organisation à sa manière ; ' +
      'avec des procédures, il prend le relais. C’est la fragilité la plus rapide à réduire.',
  },

  '1.4': {
    libelle: 'Trésorerie et pouvoir de signature',
    lecture: 'Le nombre de personnes qui peuvent engager une dépense significative sans votre accord.',
    force: {
      acquis:
        'Le pouvoir d’engagement est partagé dans un cadre défini. L’entreprise peut payer, ' +
        'commander et honorer ses engagements sans votre présence, ce qui protège la relation ' +
        'fournisseur et la continuité de l’exploitation.',
      risque:
        'Une délégation financière large exige un contrôle qui suit. Sans revue régulière des ' +
        'engagements pris, la souplesse gagnée se paie en dérive progressive des dépenses — ' +
        'rarement par malveillance, presque toujours par absence de repère commun.',
    },
    fragilite: {
      description:
        'Aucune personne, ou une seule sous votre supervision, ne peut engager une dépense ' +
        'significative sans votre accord préalable.',
      consequence:
        'c’est la dépendance qui produit ses effets le plus vite en cas d’absence. ' +
        'Les règlements fournisseurs s’arrêtent en quelques jours. Un fournisseur qui relance sans ' +
        'réponse passe l’entreprise en paiement comptant, et le besoin de trésorerie augmente ' +
        'brutalement sans que la cause en soit identifiée.',
      levier:
        'Ouvrez un pouvoir de signature à une personne, sur un montant plafonné et pour une ' +
        'catégorie de dépenses précise. Un plafond bas et un périmètre étroit valent mieux qu’une ' +
        'délégation générale reportée indéfiniment.',
    },
    critique:
      'Le pouvoir de signature est le point critique parce que c’est la dépendance dont les effets ' +
      'apparaissent en premier. Toutes les autres fragilités mettent des semaines à se manifester. ' +
      'Celle-ci se manifeste en quelques jours, et elle touche directement la trésorerie.',
  },

  '1.5': {
    libelle: 'Résistance à la rupture',
    lecture: 'Le temps réel pendant lequel votre entreprise a déjà fonctionné, ou pourrait fonctionner, sans vous.',
    force: {
      acquis:
        'Votre entreprise a déjà fonctionné sans vous, ou pourrait le faire sur une durée ' +
        'significative. Ce n’est pas une hypothèse : c’est un fait vérifiable, et c’est ce qui ' +
        'distingue une organisation d’une activité personnelle.',
      risque:
        'Une bonne résistance à la rupture peut retarder la question de la suite. Une entreprise ' +
        'qui tient trois mois sans son dirigeant n’est pas nécessairement une entreprise ' +
        'transmissible : la continuité de l’exploitation et la transmission de la direction sont ' +
        'deux problèmes distincts.',
    },
    fragilite: {
      description:
        'Votre entreprise n’a jamais fonctionné sans vous sur une durée significative, et une ' +
        'absence prolongée serait perçue rapidement par vos interlocuteurs extérieurs.',
      consequence:
        'cette fragilité ne se manifeste pas tant que rien n’arrive — et c’est ce ' +
        'qui la rend particulière. Elle ne produit aucun signal d’alerte progressif. Elle produit ' +
        'un effet unique, au moment où un événement vous immobilise.',
      levier:
        'Programmez une absence de cinq jours ouvrés, sans appel ni message, dans les trois mois. ' +
        'Annoncez-la. Ce qui se passera pendant ces cinq jours vous apprendra plus que n’importe ' +
        'quel audit.',
    },
    critique:
      'La résistance à la rupture est le point critique parce que c’est exactement ce que ce test ' +
      'mesure. Toutes les autres sous-dimensions décrivent des causes ; celle-ci décrit le résultat. ' +
      'C’est aussi la seule qui se vérifie par l’expérience plutôt que par l’analyse.',
  },

  // =====================================================================
  // AXE 2 — CEUX QUI VOUS ENTOURENT
  // =====================================================================

  '2.1': {
    libelle: "Existence d'un second",
    lecture: 'La présence, ou l’absence, d’une personne capable de diriger à votre place.',
    force: {
      acquis:
        'Une personne pourrait diriger à votre place sur une durée longue. C’est l’élément le plus ' +
        'déterminant de la continuité, et celui qui manque le plus souvent dans les entreprises ' +
        'de votre catégorie.',
      risque:
        'Un second solide crée sa propre dépendance. Si cette personne part, votre organisation ' +
        'se retrouve dans la situation qu’elle avait résolue — en pire, parce que l’habitude de ' +
        's’appuyer sur elle est prise. Un second ne dispense pas d’un troisième.',
    },
    fragilite: {
      description:
        'Personne, aujourd’hui, ne pourrait diriger à votre place sur une durée longue, et la ' +
        'personne qui le pourrait un jour n’est pas identifiée.',
      consequence:
        'c’est l’absence qui pèse le plus lourd dans votre score. Sans second, ' +
        'aucune délégation ne devient structurelle : chaque absence est une suspension, et les ' +
        'conflits d’autorité qui apparaissent en votre absence n’ont personne pour les arbitrer.',
      levier:
        'Identifiez la personne — même imparfaite, même incomplète. Puis confiez-lui un périmètre ' +
        'entier, avec le droit de se tromper. On ne forme pas un second en le préparant : on le ' +
        'forme en le laissant exercer.',
    },
    critique:
      'L’existence d’un second est le point critique parce que c’est la sous-dimension la plus ' +
      'lourdement pondérée de cet axe, et parce qu’elle conditionne tout le reste de votre ' +
      'entourage. Sans destinataire, une délégation reste une intention.',
  },

  '2.2': {
    libelle: "Qualité de l'équipe de direction",
    lecture: 'La stabilité de vos cadres et la manière dont vous les recrutez.',
    force: {
      acquis:
        'Votre équipe d’encadrement est stable et vos recrutements aux postes de responsabilité ' +
        'suivent un processus. Vous ne reconstruisez pas votre organisation à chaque départ, ' +
        'ce qui vous fait gagner un temps considérable.',
      risque:
        'Une équipe stable depuis longtemps se renouvelle peu. Les habitudes de travail se ' +
        'sédimentent, et la contradiction devient plus rare — non par crainte, mais par ' +
        'accoutumance. La stabilité protège de la rupture et expose à l’immobilité.',
    },
    fragilite: {
      description:
        'Votre encadrement a connu des départs, et vos recrutements aux postes de responsabilité ' +
        'reposent principalement sur la relation plutôt que sur un processus défini.',
      consequence:
        'chaque départ coûte davantage que le précédent, parce que le savoir-faire ' +
        'part avec la personne. Un recrutement fondé sur la relation produit une loyauté réelle ' +
        'mais une compétence incertaine, difficile à corriger ensuite sans conflit personnel.',
      levier:
        'Pour le prochain recrutement à responsabilité, écrivez la fiche de poste et les trois ' +
        'critères d’évaluation avant de recevoir le premier candidat. L’ordre des opérations ' +
        'change le résultat.',
    },
    critique:
      'La qualité de l’équipe de direction est le point critique parce qu’elle détermine ce que ' +
      'vous pouvez déléguer. On ne confie pas un périmètre à quelqu’un dont on n’est pas certain, ' +
      'et cette incertitude vous ramène mécaniquement au centre de l’organisation.',
  },

  '2.3': {
    libelle: 'Contre-pouvoir et accès à la vérité',
    lecture: 'La fréquence à laquelle quelqu’un, dans votre entreprise, vous dit que vous avez tort.',
    force: {
      acquis:
        'Vos collaborateurs vous contredisent, et cela vous fait parfois changer d’avis. C’est ' +
        'l’un des révélateurs les plus fiables d’une organisation saine : l’information remonte ' +
        'sans être filtrée par ce que vous souhaitez entendre.',
      risque:
        'Une contradiction devenue rituelle perd sa fonction. Si la contestation est attendue, ' +
        'elle devient un exercice de forme, et les désaccords réels se logent ailleurs — dans ' +
        'ce qui ne se dit pas en réunion.',
    },
    fragilite: {
      description:
        'Vous ne vous souvenez pas de la dernière fois qu’un collaborateur vous a dit clairement ' +
        'que vous aviez tort, ou cela remonte à longtemps.',
      consequence:
        'un dirigeant que personne ne contredit prend seul, et sans filet, ' +
        'l’intégralité de ses mauvaises décisions. Le coût n’est pas immédiat : il apparaît sur ' +
        'la décision structurante — un investissement, un recrutement, une diversification — que ' +
        'personne n’a discutée avant qu’elle soit prise.',
      levier:
        'Sur la prochaine décision importante, demandez explicitement à deux personnes de ' +
        'construire l’argumentaire contraire. Le mandat doit être donné : sans mandat, la ' +
        'contradiction ne vient pas.',
    },
    critique:
      'Le contre-pouvoir est le point critique parce qu’il conditionne la qualité de toutes vos ' +
      'décisions futures, y compris celles qui traiteront les autres fragilités. Une organisation ' +
      'sans contradiction corrige lentement ses erreurs, et les corrige toujours après coup.',
  },

  '2.4': {
    libelle: 'Frontière famille / entreprise',
    lecture: 'La séparation entre la trésorerie de l’entreprise et les besoins du cercle familial.',
    force: {
      acquis:
        'La frontière entre le patrimoine de l’entreprise et les besoins familiaux est établie et ' +
        'respectée. Sur cette zone, c’est un marqueur de maturité rare : il rend l’entreprise ' +
        'lisible pour un banquier, un investisseur ou un repreneur.',
      risque:
        'Une frontière nette peut créer une tension sociale que vous absorbez seul. Les ' +
        'sollicitations ne disparaissent pas parce qu’une règle existe : elles se reportent sur ' +
        'vous personnellement. La règle protège l’entreprise ; elle ne protège pas le dirigeant.',
    },
    fragilite: {
      description:
        'La trésorerie de l’entreprise a couvert des besoins personnels ou familiaux non budgétés, ' +
        'et aucune règle écrite n’encadre ces mouvements.',
      consequence:
        'ce mécanisme restreint la capacité de réinvestissement de la marge et rend ' +
        'les comptes difficiles à présenter à un tiers. En cas d’absence, la trésorerie est ' +
        'sollicitée sans le filtre que vous exerciez — car c’est vous, et vous seul, qui arbitriez ' +
        'ces demandes.',
      levier:
        'Fixez votre rémunération et une règle de distribution, écrites, même modestes. Une règle ' +
        'existante permet de dire non sans que le refus soit personnel — et c’est précisément ce ' +
        'qui rend le refus tenable.',
    },
    critique:
      'La frontière famille / entreprise est le point critique parce qu’elle conditionne à la fois ' +
      'la capacité de financement et la transmissibilité. C’est aussi la seule fragilité que ' +
      'personne, dans votre entourage, ne vous signalera — chacun ayant une raison de ne pas ' +
      'l’aborder.',
  },

  '2.5': {
    libelle: 'Conseil et appui externes',
    lecture: 'L’existence, hors de votre entreprise, d’un interlocuteur à qui parler sans conséquence.',
    force: {
      acquis:
        'Vous disposez, en dehors de votre entreprise, d’un interlocuteur avec qui examiner une ' +
        'difficulté sans que cela ait de conséquence. C’est ce qui permet de tester une décision ' +
        'avant de l’annoncer.',
      risque:
        'Un conseil extérieur régulier peut se substituer à la contradiction interne. Si vos ' +
        'arbitrages se construisent au-dehors, vos équipes reçoivent des décisions déjà formées ' +
        'et perdent l’habitude d’en discuter.',
    },
    fragilite: {
      description:
        'En dehors de votre entreprise, vous n’avez personne — ou seulement votre entourage ' +
        'familial — à qui parler d’une difficulté grave sans que cela ait de conséquence.',
      consequence:
        'cette solitude ne produit pas d’effet visible sur l’exploitation. Elle ' +
        'produit un effet sur vous : les décisions difficiles se reportent, les difficultés ' +
        's’accumulent avant d’être formulées, et l’épuisement s’installe sans point de comparaison ' +
        'qui permettrait de le nommer.',
      levier:
        'Identifiez un pair dirigeant — pas un ami, pas un salarié, pas un membre de votre ' +
        'famille — et fixez un rendez-vous trimestriel. La régularité compte davantage que la ' +
        'durée de chaque échange.',
    },
    critique:
      'Le conseil externe est le point critique parce que c’est la sous-dimension qui conditionne ' +
      'votre capacité à traiter les autres. Les décisions que ce rapport appelle sont difficiles, ' +
      'et elles se prennent mal seul.',
  },

  // =====================================================================
  // AXE 3 — VOUS
  // =====================================================================

  '3.1': {
    libelle: 'Charge et récupération',
    lecture: 'Le nombre de journées complètes passées sans travailler ni penser au travail.',
    force: {
      acquis:
        'Vous prenez des journées complètes de récupération. Ce n’est pas un confort : c’est ce ' +
        'qui préserve votre capacité de jugement sur la durée, et cela vous distingue de la ' +
        'majorité des dirigeants de votre catégorie.',
      risque:
        'Une bonne récupération personnelle peut masquer une fragilité structurelle. Votre ' +
        'résistance vous permet d’absorber une charge que l’organisation devrait porter, et ' +
        'retarde d’autant le moment où le problème devient visible.',
    },
    fragilite: {
      description:
        'Vous n’avez pris aucune journée complète, ou très peu, sans travailler ni penser au ' +
        'travail au cours des douze derniers mois.',
      consequence:
        'l’absence de récupération dégrade la qualité des décisions avant de dégrader ' +
        'la santé. Les arbitrages se font plus vite, moins bien documentés, avec moins de recul. ' +
        'La dégradation est progressive et rarement perçue par la personne concernée.',
      levier:
        'Bloquez deux journées consécutives dans les six semaines, sans téléphone. Deux jours ' +
        'réellement pris valent mieux que trois semaines planifiées et annulées.',
    },
    critique:
      'La charge et la récupération sont le point critique parce que toutes les autres décisions ' +
      'en dépendent. Structurer une organisation demande du recul, et le recul demande du temps ' +
      'hors de l’exploitation. Sans cela, l’urgence continuera de primer sur l’important.',
  },

  '3.2': {
    libelle: 'Solitude décisionnelle',
    lecture: 'La manière dont vos décisions majeures sont discutées avant d’être prises.',
    force: {
      acquis:
        'Vos décisions majeures sont discutées avant d’être prises, avec des personnes qui ' +
        'contestent réellement votre raisonnement. C’est ce qui réduit la probabilité d’erreur ' +
        'sur les décisions structurantes.',
      risque:
        'Un processus de contradiction bien installé peut ralentir. Certaines décisions demandent ' +
        'de la vitesse, et l’habitude de la discussion préalable peut transformer un arbitrage ' +
        'simple en délibération.',
    },
    fragilite: {
      description:
        'Vos dernières décisions majeures ont été prises seul, ou discutées seulement après coup.',
      consequence:
        'la solitude décisionnelle ne se paie pas sur les décisions courantes — elle ' +
        'se paie sur une décision structurante. Un investissement mal calibré, une diversification ' +
        'engagée sans contradiction, un endettement mal évalué : ces erreurs sont rarement ' +
        'rattrapables et presque toujours évitables.',
      levier:
        'Sur votre prochaine décision importante, imposez-vous un délai de quarante-huit heures et ' +
        'une conversation avec une personne qui n’a rien à gagner à votre accord.',
    },
    critique:
      'La solitude décisionnelle est le point critique parce que c’est la fragilité qui amplifie ' +
      'toutes les autres. Une erreur structurelle prise seule et sans contradiction coûte plus cher ' +
      'que l’ensemble des dépendances opérationnelles réunies.',
  },

  '3.3': {
    libelle: 'Signaux physiques',
    lecture: 'Les manifestations physiques constatées au cours des six derniers mois.',
    force: {
      acquis:
        'Vous ne constatez pas ou peu de signaux physiques de surcharge. Sommeil, énergie et ' +
        'capacité à décrocher sont préservés — ce qui n’est le cas que d’une minorité de dirigeants.',
      risque:
        'L’absence de signaux physiques peut retarder la prise de conscience d’une charge réelle. ' +
        'Le corps n’est pas un indicateur avancé : il alerte tard, et souvent tout à la fois.',
    },
    fragilite: {
      description:
        'Vous avez constaté plusieurs manifestations physiques au cours des six derniers mois : ' +
        'sommeil dégradé, fatigue persistante malgré le repos, irritabilité inhabituelle, ' +
        'difficulté à décrocher.',
      consequence:
        'ces signaux ne se résorbent pas spontanément si leur cause demeure. ' +
        'Cinquante-quatre pour cent des dirigeants déclarent avoir traversé un épuisement au cours ' +
        'des douze derniers mois. Ce n’est pas une exception, et cela ne dit rien de votre ' +
        'résistance.',
      levier:
        'Ces signaux relèvent d’un avis médical, pas d’une réorganisation. En parler à un ' +
        'professionnel de santé est la seule action utile à ce stade — les leviers d’organisation ' +
        'viendront ensuite.',
    },
    critique:
      'Les signaux physiques sont le point critique parce qu’ils conditionnent votre capacité à ' +
      'mettre en œuvre tout le reste. Aucune des actions de ce rapport n’est réalisable dans un ' +
      'état d’épuisement durable.',
  },

  '3.4': {
    libelle: 'Clarté de trajectoire',
    lecture: 'L’échéance et la forme sous lesquelles vous quitterez la direction opérationnelle.',
    force: {
      acquis:
        'Vous avez un horizon et une forme pour votre sortie de la direction opérationnelle. ' +
        'Cette clarté oriente vos décisions présentes — on ne structure pas de la même manière ' +
        'une entreprise que l’on transmettra et une entreprise que l’on gardera.',
      risque:
        'Une trajectoire écrite et datée peut devenir contraignante si elle ne se révise pas. ' +
        'Les conditions de marché, la maturité de votre successeur et vos propres priorités ' +
        'évoluent ; un plan non révisé se transforme en engagement subi.',
    },
    fragilite: {
      description:
        'Vous n’avez pas réfléchi à l’échéance ni à la forme de votre sortie de la direction ' +
        'opérationnelle, ou vous y pensez sans horizon précis.',
      consequence:
        'l’absence de trajectoire n’a pas d’effet visible sur l’exploitation. Son ' +
        'effet est ailleurs : elle rend impossible toute préparation. Une transmission se prépare ' +
        'sur plusieurs années. Ceux qui n’ont pas commencé subissent le calendrier d’un événement ' +
        'plutôt que de choisir le leur.',
      levier:
        'Écrivez une seule phrase : à quelle échéance, et sous quelle forme. Vous la corrigerez. ' +
        'Ce qui compte est qu’elle existe et qu’une autre personne la connaisse.',
    },
    critique:
      'La clarté de trajectoire est le point critique parce que l’absence de planification ' +
      'successorale est l’une des deux faiblesses chroniques identifiées dans les entreprises ' +
      'familiales de la zone. C’est aussi la seule fragilité dont le traitement ne coûte rien ' +
      'd’autre que la décision d’y penser.',
  },

  '3.5': {
    libelle: "Identité et rapport à l'entreprise",
    lecture: 'Votre réaction à l’idée de vendre l’entreprise à un bon prix.',
    force: {
      acquis:
        'Vous envisagez la cession de votre entreprise avec sérénité ou avec un projet en tête. ' +
        'Votre identité ne se confond pas avec votre fonction, ce qui vous rend libre de vos ' +
        'décisions stratégiques.',
      risque:
        'Une distance nette vis-à-vis de l’entreprise peut se lire comme un désengagement par ' +
        'ceux qui vous entourent. La sérénité du dirigeant est un signal que l’équipe interprète, ' +
        'parfois autrement que vous ne l’entendez.',
    },
    fragilite: {
      description:
        'L’idée de vendre votre entreprise, même à un bon prix, provoque un vide ou un ' +
        'soulagement immédiat. Ces deux réactions sont opposées, et l’une comme l’autre méritent ' +
        'attention.',
      consequence:
        'cette confusion entre identité et fonction produit un effet précis : elle ' +
        'rend les décisions de structuration difficiles à prendre. Déléguer, transmettre, ' +
        'organiser sa propre sortie — chacune de ces actions réduit la place qui vous définit. ' +
        'La difficulté n’est pas technique.',
      levier:
        'Écrivez trois activités qui vous occuperaient si vous ne dirigiez plus. Si la page reste ' +
        'blanche, c’est en soi l’information la plus utile de ce rapport.',
    },
    critique:
      'Le rapport à l’entreprise est le point critique parce qu’il conditionne votre capacité à ' +
      'appliquer les autres leviers. Les obstacles à la délégation sont rarement techniques. ' +
      'La question n’est plus « comment déléguer » mais « qui suis-je quand je ne dirige plus ».',
  },
}

/** Libellé d'une sous-dimension. */
export function libelleDimension(id) {
  return DIMENSIONS_TEXTES[id]?.libelle ?? id
}
