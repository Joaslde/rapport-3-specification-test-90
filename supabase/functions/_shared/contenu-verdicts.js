/*
  LES CINQ NIVEAUX ET LES SIX ARCHÉTYPES — textes du rapport, page 2
  Source : rapport-3-specification-test-90-jours.md §10 et §12.1

  RÈGLES DE RÉDACTION (spec §12.1, page 2) :
    - environ 150 mots par verdict
    - décrire la situation, SANS CONSEIL NI VENTE
    - « la page qui doit donner le sentiment d'avoir été compris »
    - aucun reproche, aucun adjectif dramatique
    - la réponse la plus faible reste digne

  ⚠️ CONTENU À FAIRE VALIDER PAR LE MANAGER avant mise en ligne (todo.md 6.12).
*/

/** Les cinq niveaux — formulations reprises telles quelles de la spec §10.1. */
export const NIVEAUX_TEXTES = {
  defaillance_unique: {
    nom: 'Point de défaillance unique',
    formulation:
      "L'entreprise et vous êtes la même entité. Toute interruption de votre part est une " +
      "interruption de l'activité.",
  },
  centre_nevralgique: {
    nom: 'Centre névralgique',
    formulation:
      "L'entreprise existe, mais tous les flux — décision, relation, information, argent — " +
      'passent par un seul point.',
  },
  transition_inachevee: {
    nom: 'Transition inachevée',
    formulation:
      "Vous avez commencé à construire une organisation. Elle n'est pas encore autonome, et " +
      "vous n'avez pas encore lâché.",
  },
  structure_emergente: {
    nom: 'Structure émergente',
    formulation:
      "L'entreprise fonctionne largement sans vous. Il reste des dépendances identifiables " +
      'et traitables.',
  },
  entreprise_transferable: {
    nom: 'Entreprise transférable',
    formulation:
      "L'entreprise est un actif qui existe indépendamment de vous. Elle est cessible, " +
      'finançable et durable.',
  },
}

/**
 * Les six archétypes croisés. Le `diagnostic` est la phrase-clé de la spec §10.2 ;
 * le `verdict` est le paragraphe de 150 mots de la page 2.
 */
export const ARCHETYPES_TEXTES = {
  convergence: {
    nom: 'La convergence',
    diagnostic:
      'Les trois cercles sont fragiles simultanément. Ce n’est pas un problème d’organisation ' +
      'ni de personne : c’est un problème de système. Traiter un seul axe ne produira rien.',
    verdict:
      "Vos trois axes sont faibles en même temps. Ce n'est pas trois problèmes distincts, " +
      "c'est un seul, observé sous trois angles.\n\n" +
      "C'est la configuration la plus fréquente chez les dirigeants dont l'entreprise a grandi " +
      'plus vite que sa structure. Le chiffre d’affaires a progressé, les effectifs aussi, et ' +
      "l'organisation est restée celle des débuts — c'est-à-dire vous. Chaque nouveau client, " +
      'chaque nouveau salarié a ajouté une ligne à votre charge sans en retirer aucune.\n\n' +
      "Ce que cela produit est mécanique : vous n'avez pas le temps de construire l'organisation " +
      "qui vous libérerait, parce que vous passez ce temps à compenser son absence. C'est une " +
      'boucle, et elle se referme un peu plus chaque trimestre.\n\n' +
      "Traiter un seul axe ne produira rien de durable. Déléguer sans second de commandement " +
      'reporte la charge. Recruter sans procédures reproduit la dépendance. Se reposer sans ' +
      'avoir transmis ne fait que différer.',
  },

  pilote_solide: {
    nom: 'Le pilote solide, la machine fragile',
    diagnostic:
      "Vous tenez. C'est précisément ce qui vous met en danger : votre résistance personnelle " +
      'masque une fragilité structurelle et retarde la décision de la traiter.',
    verdict:
      "Vous allez bien. Votre entreprise, non — et c'est exactement ce qui rend votre situation " +
      'difficile à voir.\n\n' +
      'Votre axe personnel est solide : vous récupérez, vous avez des interlocuteurs, votre ' +
      "trajectoire est claire. Cette solidité est réelle. Elle est aussi ce qui vous permet " +
      "d'absorber, jour après jour, une fragilité structurelle qui serait insupportable à " +
      'quelqu’un de moins résistant.\n\n' +
      "Le risque n'est pas absent. Il est différé. Votre organisation ne tient pas parce qu'elle " +
      'est solide, elle tient parce que vous compensez — et vous compensez bien. Tant que rien ' +
      'ne vient entamer cette capacité, rien ne se voit.\n\n' +
      "Ce type de configuration se révèle rarement par une dégradation progressive. Elle se " +
      'révèle au premier événement que votre volonté ne peut pas absorber : une maladie, un ' +
      'conflit familial, une opportunité qui demande votre attention ailleurs. Ce jour-là, ' +
      "l'écart entre votre résistance et la solidité réelle de l'entreprise devient visible " +
      'en quelques semaines.',
  },

  equipe_sans_place: {
    nom: "L'équipe existe, la place ne s'est pas libérée",
    diagnostic:
      "Vous avez recruté des gens capables et vous ne leur avez pas donné l'espace. Le problème " +
      "n'est pas votre entourage — il est dans votre incapacité actuelle à lâcher.",
    verdict:
      'Vous êtes entouré de gens capables. Ils ne dirigent pas.\n\n' +
      'Votre axe entourage est solide : il y a un second, une équipe, des gens qui vous ' +
      "contredisent, des appuis à l'extérieur. Vous avez fait le travail de recrutement, et " +
      "il a été bien fait. Mais l'organisation reste construite autour de vous : les décisions " +
      'remontent, les relations passent par vous, les arbitrages vous reviennent.\n\n' +
      "Ce que vos collaborateurs vivent n'est pas un manque de compétence, c'est un manque " +
      "d'espace. On ne devient pas autonome en observant quelqu'un décider à sa place — même " +
      'bien, même vite, même avec raison. La capacité existe ; l’exercice de cette capacité, non.\n\n' +
      "C'est le diagnostic le plus difficile à entendre, parce qu'il ne désigne aucune " +
      "défaillance extérieure. C'est aussi le plus rapide à corriger : la matière humaine est " +
      "déjà là. Ce qui manque n'est ni un recrutement, ni une procédure, ni un outil.",
  },

  processus_hommes: {
    nom: "Les processus tiennent, les hommes s'usent",
    diagnostic:
      "L'organisation fonctionne, mais elle repose sur des procédures et non sur des personnes " +
      'solides. Fragilité à échéance moyenne : les bons partiront.',
    verdict:
      "Votre organisation fonctionne. Ceux qui la font fonctionner s'épuisent.\n\n" +
      'Votre axe opérationnel est solide : les procédures existent, les décisions ne remontent ' +
      "pas toutes, les relations ne dépendent plus entièrement de vous. Cette structure est " +
      'réelle et elle produit ses effets.\n\n' +
      "Mais elle repose sur des processus, pas sur des personnes à leur place. Autour de vous, " +
      "l'équipe applique plus qu'elle ne décide, exécute plus qu'elle n'arbitre. Et vous-même " +
      "portez une charge que l'organisation ne réduit pas, parce qu'un système bien réglé " +
      'demande toujours quelqu’un pour le régler.\n\n' +
      "Cette configuration ne se dégrade pas brutalement. Elle se dégrade par les départs. " +
      'Les collaborateurs les plus capables sont aussi les plus sollicités ailleurs, et ce sont ' +
      "eux qui partent en premier lorsque l'exercice de leur métier se réduit à l'application " +
      "d'un cadre. Chaque départ coûte alors bien plus qu'un recrutement.",
  },

  entreprise_prete: {
    nom: "L'entreprise est prête, vous ne l'êtes pas",
    diagnostic:
      'Vous avez construit une entreprise qui peut fonctionner sans vous. Vous n’avez pas ' +
      "construit une vie qui peut fonctionner sans elle. La question n'est plus « comment " +
      'déléguer » mais « qui suis-je après ».',
    verdict:
      "Votre entreprise peut fonctionner sans vous. Vous, vous ne fonctionnez pas encore sans elle.\n\n" +
      "Le travail de structuration est fait. Les procédures existent, un second peut prendre le " +
      'relais, les relations ne dépendent plus de votre seule présence. Sur le papier, votre ' +
      'entreprise est transférable. Beaucoup de dirigeants passent leur vie sans atteindre ce point.\n\n' +
      "Ce qui reste n'est pas un problème d'organisation. Vos réponses sur votre charge, votre " +
      "récupération et votre rapport à l'entreprise décrivent quelqu'un qui reste par identité " +
      'plus que par nécessité. Vous ne restez pas parce que l’entreprise a besoin de vous — ' +
      'elle en a de moins en moins besoin. Vous restez parce que la question de ce qui vient ' +
      'après n’est pas résolue.\n\n' +
      "C'est une situation plus enviable que la plupart, et plus inconfortable qu'elle n'en a " +
      "l'air. La question n'est plus « comment déléguer ». Elle est « qui suis-je quand je ne " +
      'dirige plus ».',
  },

  actif_transferable: {
    nom: "L'actif transférable",
    diagnostic:
      "Votre entreprise est un actif autonome. Votre enjeu n'est plus la structuration mais " +
      'la valorisation et le choix du moment.',
    verdict:
      'Votre entreprise existe indépendamment de vous.\n\n' +
      'Vos trois axes sont solides. L’organisation fonctionne sans votre présence quotidienne, ' +
      "l'entourage porte des décisions réelles, et votre propre trajectoire est claire. Cette " +
      "configuration concerne environ un dirigeant sur vingt.\n\n" +
      "Ce que cela signifie concrètement : votre entreprise est cessible, finançable et " +
      'transmissible. Elle a une valeur qui ne s’effondre pas avec votre départ — ce qui n’est ' +
      "le cas ni de la majorité des entreprises de votre catégorie, ni de celles qui affichent " +
      'des résultats comparables aux vôtres.\n\n' +
      "Votre enjeu a changé de nature. Il n'est plus de construire l'autonomie, il est de " +
      'décider quoi en faire : valoriser, transmettre, céder, ou continuer en choisissant votre ' +
      "place. Ces décisions se préparent des années à l'avance, et elles se prennent mieux " +
      "depuis la position que vous occupez aujourd'hui que sous la contrainte d'un événement.",
  },
}
