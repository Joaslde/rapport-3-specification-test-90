/*
  PAGE 8 — LA SUITE LOGIQUE, PROTOCOLE DE SÉCURITÉ ET ROUTAGE COMMERCIAL
  Source : rapport-3-specification-test-90-jours.md §12.2, §14.2, §15.1

  RÈGLE DE PROPORTION — NON NÉGOCIABLE (spec §12.2) :
    « Sept pages d'analyse, une demi-page de proposition commerciale. »

    Les trois actions doivent être RÉELLEMENT UTILES ET APPLICABLES SANS LE CABINET.
    « C'est contre-intuitif commercialement et c'est exactement ce qui crée la
      confiance sur ce marché. »

  ⚠️ CONTENU À FAIRE VALIDER PAR LE MANAGER (todo.md 6.12).
*/

export const SUITE_TITRE = 'La suite logique'

export const SUITE_INTRODUCTION =
  'Trois actions à mener dans les trente prochains jours. Elles ne demandent aucun ' +
  'accompagnement, aucun budget et aucune réorganisation. Elles sont classées par ordre ' +
  'de mise en œuvre.'

/**
 * Les trois actions, déclinées par archétype (spec §12.1, page 8).
 * Chacune part de la configuration réelle du répondant, pas d'un modèle générique.
 */
export const ACTIONS_PAR_ARCHETYPE = {
  convergence: [
    {
      titre: 'Choisir un seul axe',
      texte:
        'Vos trois axes sont fragiles. Traiter les trois de front ne produira rien. Choisissez ' +
        'celui sur lequel vous avez le plus de prise aujourd’hui — le plus souvent, il s’agit de ' +
        'votre propre récupération — et laissez délibérément les deux autres de côté pendant ' +
        'un trimestre.',
    },
    {
      titre: 'Compter, sans rien changer',
      texte:
        'Pendant une semaine, notez chaque décision qui vous remonte et la personne qui aurait pu ' +
        'la prendre. Ne modifiez rien. Le classement obtenu désignera de lui-même la première ' +
        'délégation à formaliser.',
    },
    {
      titre: 'Nommer un interlocuteur extérieur',
      texte:
        'Identifiez un pair dirigeant, hors de votre entreprise et hors de votre famille, et fixez ' +
        'un rendez-vous. Les décisions que ce rapport appelle sont difficiles, et elles se ' +
        'prennent mal seul.',
    },
  ],

  pilote_solide: [
    {
      titre: 'Programmer une absence réelle',
      texte:
        'Votre résistance masque la fragilité de votre organisation. Cinq jours ouvrés sans appel ' +
        'ni message, annoncés à l’avance, vous apprendront en une semaine ce qu’aucune analyse ne ' +
        'peut établir.',
    },
    {
      titre: 'Ouvrir un pouvoir de signature',
      texte:
        'Autorisez une personne à engager une dépense, sur un montant plafonné et pour une ' +
        'catégorie précise. C’est la dépendance dont les effets apparaissent le plus vite en cas ' +
        'd’absence, et la plus simple à réduire.',
    },
    {
      titre: 'Écrire une page, pas un manuel',
      texte:
        'Demandez au titulaire du poste le plus critique d’écrire, en une page, ce qu’il ferait ' +
        'faire à son remplaçant pendant sa première semaine. Une page existante vaut mieux qu’un ' +
        'manuel projeté.',
    },
  ],

  equipe_sans_place: [
    {
      titre: 'Confier un périmètre entier',
      texte:
        'Vos collaborateurs sont capables ; ils manquent d’espace. Confiez à l’un d’eux un ' +
        'périmètre complet — décision comprise — avec le droit de se tromper. Un périmètre partiel ' +
        'sous supervision ne forme personne.',
    },
    {
      titre: 'Cesser d’arbitrer pendant deux semaines',
      texte:
        'Pendant quinze jours, renvoyez chaque décision qui remonte à la personne qui vous la ' +
        'présente, en lui demandant ce qu’elle ferait. Ne tranchez pas. C’est inconfortable et ' +
        'c’est ce qui installe l’autonomie.',
    },
    {
      titre: 'Demander la contradiction explicitement',
      texte:
        'Sur votre prochaine décision importante, chargez deux personnes de construire ' +
        'l’argumentaire contraire. Sans mandat donné, la contradiction ne vient pas.',
    },
  ],

  processus_hommes: [
    {
      titre: 'Rendre de la décision à ceux qui exécutent',
      texte:
        'Votre organisation fonctionne par procédures. Identifiez un domaine où vos responsables ' +
        'appliquent sans arbitrer, et rendez-leur explicitement le droit de décider — y compris ' +
        'de s’écarter de la procédure quand la situation le justifie.',
    },
    {
      titre: 'Parler à votre meilleur élément',
      texte:
        'Ce sont les collaborateurs les plus capables qui partent en premier lorsque leur métier ' +
        'se réduit à l’application d’un cadre. Un échange sur ce qu’il souhaiterait décider ' +
        'lui-même coûte une heure.',
    },
    {
      titre: 'Prendre deux jours',
      texte:
        'Un système bien réglé demande toujours quelqu’un pour le régler, et c’est vous. Deux ' +
        'journées consécutives sans téléphone, dans les six semaines. Deux jours réellement pris ' +
        'valent mieux que trois semaines annulées.',
    },
  ],

  entreprise_prete: [
    {
      titre: 'Écrire une phrase',
      texte:
        'À quelle échéance, et sous quelle forme, quitterez-vous la direction opérationnelle ? ' +
        'Une phrase. Vous la corrigerez. Ce qui compte est qu’elle existe et qu’une autre personne ' +
        'la connaisse.',
    },
    {
      titre: 'Lister trois activités',
      texte:
        'Écrivez trois choses qui vous occuperaient si vous ne dirigiez plus. Si la page reste ' +
        'blanche, c’est en soi l’information la plus utile de ce rapport — et le vrai sujet à ' +
        'traiter.',
    },
    {
      titre: 'Laisser votre second exercer visiblement',
      texte:
        'Votre entreprise peut fonctionner sans vous ; vos équipes ne le savent pas encore. ' +
        'Confiez à votre second une décision structurante, annoncée comme la sienne. La ' +
        'transmission commence par la visibilité.',
    },
  ],

  actif_transferable: [
    {
      titre: 'Faire établir une valorisation',
      texte:
        'Votre entreprise est cessible et finançable. Une valorisation indépendante, même ' +
        'indicative, transforme une intuition en base de décision — et elle se demande mieux ' +
        'avant d’en avoir besoin.',
    },
    {
      titre: 'Formaliser ce qui repose encore sur l’usage',
      texte:
        'À votre niveau de structuration, les dernières dépendances sont rarement opérationnelles. ' +
        'Elles sont juridiques : pacte d’associés, gouvernance, conditions de sortie. C’est ce que ' +
        'regarde un acquéreur en premier.',
    },
    {
      titre: 'Choisir votre horizon plutôt que de le subir',
      texte:
        'Votre enjeu n’est plus la structuration mais le moment. Ces décisions se préparent des ' +
        'années à l’avance, et elles se prennent mieux depuis votre position actuelle que sous la ' +
        'contrainte d’un événement.',
    },
  ],

  /*
    Archétypes 7 et 8 — note d'audit du 3 août 2026, §7.
    Trois actions réellement applicables sans le cabinet (spec §12.2).
  */
  hommes_sans_machine: [
    {
      titre: 'Écrire les trois procédures les plus utilisées',
      texte:
        'Votre équipe est solide mais travaille sans support écrit. Choisissez les trois ' +
        'opérations les plus fréquentes et faites-les documenter par ceux qui les exécutent, ' +
        'pas par vous. Une page chacune suffit.',
    },
    {
      titre: 'Ouvrir un deuxième accès bancaire et administratif',
      texte:
        'C’est la dépendance la plus rapide à lever et la plus coûteuse à ignorer. Ajoutez une ' +
        'signature autorisée et un second interlocuteur déclaré auprès de vos administrations. ' +
        'La démarche prend quelques jours.',
    },
    {
      titre: 'Fixer une échéance pendant que tout va bien',
      texte:
        'Rien ne vous oblige aujourd’hui à traiter cette question — c’est précisément le ' +
        'risque. Posez une date à trois mois pour vérifier ce qui aura été écrit et délégué, ' +
        'et tenez-la comme un rendez-vous client.',
    },
  ],

  structure_sans_porteur: [
    {
      titre: 'Identifier qui pourrait décider à votre place',
      texte:
        'Vos processus tiennent, mais aucun processus n’arbitre une situation inédite. ' +
        'Nommez, même sans l’annoncer, la personne qui trancherait en votre absence. Si aucun ' +
        'nom ne vient, c’est le résultat le plus important de ce test.',
    },
    {
      titre: 'Confier un arbitrage réel, pas une exécution',
      texte:
        'Déléguer une tâche ne forme personne à diriger. Confiez une décision dont l’issue est ' +
        'incertaine, avec le droit de se tromper, et n’intervenez pas. C’est le seul exercice ' +
        'qui construit un second.',
    },
    {
      titre: 'Organiser la contradiction',
      texte:
        'Personne ne vous contredit aujourd’hui. Demandez explicitement à deux collaborateurs ' +
        'de préparer les arguments contre votre prochaine décision structurante. La qualité de ' +
        'l’objection se travaille comme une compétence.',
    },
  ],
}

// ---------------------------------------------------------------------
// PROTOCOLE DE SÉCURITÉ — encadré inséré en page 2 (spec §14.2)
// Texte EXACT de la spécification. Ne pas reformuler.
// ---------------------------------------------------------------------
export const ENCADRE_SECURITE = {
  titre: 'Une remarque préalable',
  texte:
    'Plusieurs de vos réponses indiquent une charge personnelle élevée et durable. Ce n’est pas ' +
    'un jugement, et cela n’a rien d’exceptionnel — 54 % des dirigeants déclarent avoir traversé ' +
    'un épuisement au cours des douze derniers mois. Nous vous recommandons d’en parler à un ' +
    'médecin ou à un professionnel de santé. Cette recommandation est indépendante de tout ce qui ' +
    'suit dans ce document.',
}

// ---------------------------------------------------------------------
// BLOC D'INCOHÉRENCE — spec §11.2
// « Probablement le bloc qui produira le plus fort effet de crédibilité. »
// ---------------------------------------------------------------------
export const BLOC_INCOHERENCE = {
  titre: 'Une observation sur vos réponses',
  introduction:
    'Deux de vos réponses sont difficilement compatibles entre elles. Ce n’est ni une erreur ni ' +
    'un défaut de sincérité : c’est l’un des constats les plus fréquents de ce diagnostic. Il ' +
    'traduit presque toujours un écart entre l’organisation telle qu’elle est décrite et ' +
    'l’organisation telle qu’elle fonctionne au quotidien.',
  cloture: 'Cet écart est en lui-même une information. Il indique où regarder en priorité.',
}

// ---------------------------------------------------------------------
// ROUTAGE COMMERCIAL — spec §15.1
// Une demi-page maximum, en bas de la page 8.
// ---------------------------------------------------------------------

/** Critères durs d'éligibilité (spec §15.1). Paramétrable — voir todo.md question 6. */
/*
  Critères d'éligibilité au routage commercial.

  ⚠️ EN ATTENTE D'ARBITRAGE — la note d'audit du 3 août 2026 (§2.1) indique que
  les tranches ont été révisées à « 180 M / 6 personnes » dans la spécification
  finale du 2 août, que nous n'avons pas reçue.

  Les tranches actuelles du formulaire (src/data/profil.js) ne comportent pas de
  borne à 180 M ni à 6 personnes : les paliers les plus proches seraient
  `100_300M` et `5_9`, qui retiendraient aussi une entreprise à 100 M / 5
  personnes — ce qui n'est pas ce que demande la note.

  Les valeurs de la spécification du 30 juillet (300 M / 10) sont donc conservées
  telles quelles jusqu'à réception de la spécification finale, qui doit préciser
  les bornes exactes des tranches du formulaire.
*/
export const CRITERES_DURS = {
  chiffre_affaires: ['300M_1Md', '1_5Mds', 'plus_5Mds'],
  effectif: ['10_24', '25_49', '50_plus'],
}

export function critereDurRempli(profil) {
  if (!profil) return false
  return (
    CRITERES_DURS.chiffre_affaires.includes(profil.chiffre_affaires) &&
    CRITERES_DURS.effectif.includes(profil.effectif)
  )
}

export function evenementDeclare(profil) {
  return Boolean(profil?.evenement_recent) && profil.evenement_recent !== 'aucun'
}

export const ORIENTATIONS = {
  appel_48h: {
    id: 'appel_48h',
    priorite: 'absolue',
    texte:
      'Un membre du cabinet vous contactera dans les quarante-huit heures. L’objet de cet ' +
      'échange n’est pas commercial : un point de votre rapport mérite une précision.',
  },
  diagnostic: {
    id: 'diagnostic',
    priorite: 'haute',
    texte:
      'Le diagnostic approfondi prolonge ce rapport par un travail sur pièces et des entretiens ' +
      'avec votre encadrement. Il aboutit à un plan de réduction de dépendance daté.',
  },
  formation: {
    id: 'formation',
    priorite: 'moyenne',
    texte:
      'Le programme de formation traite les leviers de structuration identifiés dans ce rapport, ' +
      'en format collectif.',
  },
  nurturing: {
    id: 'nurturing',
    priorite: 'nurturing',
    texte:
      'Nous publions régulièrement des analyses sur la dépendance au dirigeant dans les ' +
      'entreprises de la zone. Vous les recevrez si vous le souhaitez.',
  },
  seminaire: {
    id: 'seminaire',
    priorite: 'relation',
    texte:
      'Votre configuration est rare. Nous organisons des rencontres entre dirigeants ayant ' +
      'atteint ce niveau de structuration — vous y êtes convié.',
  },
  suspendu: {
    id: 'suspendu',
    priorite: 'suspendu',
    texte: null, // Aucune sollicitation pendant 21 jours (spec §14.2).
  },
}

/**
 * Matrice de routage commercial (spec §15.1).
 *
 * L'observation contre-intuitive : le meilleur prospect n'est PAS celui qui a le
 * score le plus bas. Le prospect idéal se situe entre 26 et 45, remplit les
 * critères financiers, et a déclaré un événement de rupture.
 *
 * ⚠️ Le protocole de sécurité prime sur toute la matrice.
 */
export function routerCommercial({ indice90, protocoleSecurite, profil }) {
  if (protocoleSecurite) return ORIENTATIONS.suspendu

  const durs = critereDurRempli(profil)
  const evenement = evenementDeclare(profil)

  if (indice90 <= 25) {
    if (!durs) return ORIENTATIONS.nurturing
    // Appel prudent : le protocole de sécurité a déjà été vérifié plus haut.
    return evenement ? ORIENTATIONS.diagnostic : ORIENTATIONS.nurturing
  }

  if (indice90 <= 45) {
    if (!durs) return ORIENTATIONS.nurturing
    return evenement ? ORIENTATIONS.appel_48h : ORIENTATIONS.diagnostic
  }

  if (indice90 <= 62) {
    if (!durs) return ORIENTATIONS.nurturing
    return evenement ? ORIENTATIONS.diagnostic : ORIENTATIONS.formation
  }

  if (indice90 <= 80) {
    return durs ? ORIENTATIONS.formation : ORIENTATIONS.nurturing
  }

  return ORIENTATIONS.seminaire
}

// ---------------------------------------------------------------------
// SIGNATURE — temporaire, explicitement marquée comme telle
// La spec §16.3 exige « un nom et une fonction réels, pas L'équipe ».
// À remplacer avant la mise en ligne (todo.md, question 7).
// ---------------------------------------------------------------------
export const SIGNATURE = {
  provisoire: true,
  nom: '[Nom du signataire à définir]',
  fonction: '[Fonction à définir]',
  mention: 'Signature provisoire — à remplacer avant la mise en ligne.',
}
