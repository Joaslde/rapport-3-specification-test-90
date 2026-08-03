/*
  LES 18 QUESTIONS DU TEST DES 90 JOURS
  Source : rapport-3-specification-test-90-jours.md §6
  Libellés EXACTS. Aucune reformulation sans validation du manager (règle P3 de lessons.md).

  ⚠️ SÉCURITÉ — règle S1 / S10 de docs/securite.md
  Ce fichier part dans le bundle navigateur. Il ne contient donc NI les points par réponse,
  NI les coefficients. L'ordre des options porte l'information (index 0 = le plus faible),
  mais le barème réel et les coefficients restent exclusivement côté serveur.

  Le front envoie l'INDEX de l'option choisie (0 à 4). Le serveur applique le barème.
*/

export const QUESTIONS = [
  // ---------------------------------------------------------------
  // SECTION 1 — L'ENTREPRISE SANS VOUS (Q1 à Q7)
  // ---------------------------------------------------------------
  {
    id: 'Q1',
    numero: 1,
    axe: 'A1',
    sousDimension: '1.5',
    type: 'B',
    enonce:
      "Sur les 24 derniers mois, quelle est la plus longue période pendant laquelle vous n'avez " +
      'ni appelé votre entreprise, ni été appelé par elle ?',
    precision: "Vacances, maladie, déplacement — la raison n'a pas d'importance.",
    options: [
      'Jamais plus de 2 jours consécutifs',
      '3 à 5 jours',
      '6 à 10 jours',
      '11 à 20 jours',
      'Plus de 20 jours',
    ],
  },
  {
    id: 'Q2',
    numero: 2,
    axe: 'A1',
    sousDimension: '1.4',
    type: 'A',
    // Le montant est localisé dynamiquement selon le pays (spec §6, note Q2).
    enonce:
      'Hors vous-même, combien de personnes peuvent aujourd’hui engager une dépense équivalente ' +
      'à {MONTANT} sans votre accord préalable ?',
    montantLocalise: true,
    options: [
      'Aucune',
      'Une seule, mais je vérifie systématiquement après coup',
      'Une seule, en autonomie réelle',
      'Deux personnes',
      'Trois ou plus, dans un cadre de délégation écrit',
    ],
  },
  {
    id: 'Q3',
    numero: 3,
    axe: 'A1',
    sousDimension: '1.2',
    type: 'A',
    enonce: 'Vos trois plus gros clients. À qui appartient réellement la relation ?',
    options: [
      "Aux trois, je suis l'interlocuteur unique. Ils n'accepteraient de traiter qu'avec moi",
      'Deux sur trois passent nécessairement par moi',
      'Un sur trois passe nécessairement par moi',
      "Aucun ne passe systématiquement par moi, mais je reste le recours en cas de problème",
      'Aucun. Mon absence prolongée ne changerait rien à ces relations',
    ],
  },
  {
    id: 'Q4',
    numero: 4,
    axe: 'A1',
    sousDimension: '1.3',
    type: 'A',
    enonce:
      "Votre responsable d'exploitation doit former son remplaçant demain matin. " +
      "Sur quoi s'appuie-t-il ?",
    options: [
      "Sur moi. Rien n'est écrit",
      'Sur sa mémoire et quelques fichiers dispersés',
      'Sur des procédures écrites pour certains postes seulement',
      "Sur un manuel de procédures à jour couvrant l'essentiel de l'activité",
      'Sur un système documenté qui a déjà servi lors d’un remplacement réel',
    ],
  },
  {
    id: 'Q5',
    numero: 5,
    axe: 'A1',
    sousDimension: '1.1',
    type: 'D/F',
    enonce:
      "Une semaine ordinaire. Combien de décisions vous remonte-t-on que quelqu'un d'autre " +
      'aurait pu prendre ?',
    options: ['Plus de 20', '10 à 20', '5 à 10', '2 à 5', 'Moins de 2'],
  },
  {
    id: 'Q6',
    numero: 6,
    axe: 'A1',
    sousDimension: '1.2',
    type: 'A',
    enonce:
      "Vos relations avec la banque, l'administration fiscale et les organismes sociaux :",
    options: [
      "Tout passe par moi. Personne d'autre n'a les contacts ni l'historique",
      'Je délègue l’exécution, mais je traite personnellement toute difficulté',
      "Une personne gère, j'interviens uniquement en arbitrage",
      'Une personne gère et arbitre, je suis informé',
      "C'est structuré avec un cabinet externe et un référent interne identifié",
    ],
  },
  {
    id: 'Q7',
    numero: 7,
    axe: 'A1',
    sousDimension: '1.5',
    type: 'C',
    // Question la plus lourdement pondérée du questionnaire. C'est le cœur du test.
    enonce:
      'Vous êtes hospitalisé demain, sans possibilité de communiquer, pour 90 jours. ' +
      "Au bout de combien de temps un client ou un fournisseur important s'en apercevrait-il ?",
    options: [
      'Moins de 48 heures',
      'Environ une semaine',
      'Deux à trois semaines',
      'Un à deux mois',
      'Probablement jamais',
    ],
  },

  // ---------------------------------------------------------------
  // SECTION 2 — CEUX QUI VOUS ENTOURENT (Q8 à Q13)
  // ---------------------------------------------------------------
  {
    id: 'Q8',
    numero: 8,
    axe: 'A2',
    sousDimension: '2.1',
    type: 'A',
    enonce:
      "Aujourd'hui, quelqu'un dans votre entreprise pourrait-il diriger à votre place " +
      'pendant six mois ?',
    options: [
      'Personne, et je ne vois pas qui pourrait le devenir',
      "Personne aujourd'hui, mais j'ai identifié la personne",
      'Quelqu’un le pourrait partiellement, avec un appui extérieur',
      'Oui, une personne le pourrait',
      "Oui, et cette personne l'a déjà fait au moins une fois",
    ],
  },
  {
    id: 'Q9',
    numero: 9,
    axe: 'A2',
    sousDimension: '2.3',
    type: 'E',
    enonce:
      'La dernière fois qu’un de vos collaborateurs vous a dit clairement que vous aviez tort, ' +
      "c'était :",
    options: [
      "Je ne m'en souviens pas, ou cela n'arrive pas",
      "Il y a plus d'un an",
      'Il y a plusieurs mois',
      'Ce mois-ci',
      "Cette semaine — et cela m'a fait changer d'avis",
    ],
  },
  {
    id: 'Q10',
    numero: 10,
    axe: 'A2',
    sousDimension: '2.2',
    type: 'A',
    enonce:
      'Sur les 24 derniers mois, combien de cadres ou de collaborateurs clés ont quitté ' +
      "l'entreprise ?",
    options: [
      "Trois ou plus, et je n'ai pas vraiment compris pourquoi",
      "Trois ou plus, et j'en connais les raisons",
      'Un ou deux, départs subis',
      'Un ou deux, départs anticipés et organisés',
      'Aucun',
    ],
  },
  {
    id: 'Q11',
    numero: 11,
    axe: 'A2',
    sousDimension: '2.2',
    type: 'A',
    enonce: 'Vos recrutements à des postes de responsabilité se font principalement :',
    options: [
      'Par la famille, les relations personnelles ou la recommandation de proches',
      'Par recommandation professionnelle, sans processus formalisé',
      'Par un processus interne, sans critères écrits',
      "Par un processus structuré, avec fiche de poste et critères d'évaluation",
      "Par un processus structuré, avec période d'essai évaluée et appui externe si nécessaire",
    ],
  },
  {
    id: 'Q12',
    numero: 12,
    axe: 'A2',
    sousDimension: '2.4',
    type: 'A',
    /*
      La question la plus délicate et l'une des plus prédictives sur cette zone.
      Formulation strictement descriptive. AUCUNE option ne doit être moralisante (spec §6).
    */
    enonce:
      "Au cours des 12 derniers mois, la trésorerie de l'entreprise a-t-elle couvert des besoins " +
      'personnels ou familiaux non budgétés ?',
    options: [
      'Régulièrement, sans traçabilité comptable',
      "Plusieurs fois, tracées en compte courant d'associé",
      'Une ou deux fois, à titre exceptionnel',
      "Non, mais aucune règle écrite ne l'encadre",
      'Non. Une politique de rémunération et de distribution existe et est respectée',
    ],
  },
  {
    id: 'Q13',
    numero: 13,
    axe: 'A2',
    sousDimension: '2.5',
    type: 'A',
    enonce:
      'En dehors de votre entreprise, à qui pouvez-vous parler d’une difficulté grave sans que ' +
      'cela ait de conséquence ?',
    options: [
      'Personne',
      'Mon conjoint ou un membre de ma famille, uniquement',
      'Un ami, qui ne comprend pas mon métier',
      'Un pair dirigeant ou un conseil externe, occasionnellement',
      'Un dispositif régulier — conseil, pairs, mentor — avec un rythme établi',
    ],
  },

  // ---------------------------------------------------------------
  // SECTION 3 — VOUS (Q14 à Q18)
  // ---------------------------------------------------------------
  {
    id: 'Q14',
    numero: 14,
    axe: 'A3',
    sousDimension: '3.1',
    type: 'B',
    enonce:
      'Sur les 12 derniers mois, combien de journées complètes avez-vous passées sans travailler ' +
      'ni penser au travail ?',
    options: ['Aucune', 'Moins de 5', '5 à 15', '15 à 30', 'Plus de 30'],
  },
  {
    id: 'Q15',
    numero: 15,
    axe: 'A3',
    sousDimension: '3.3',
    type: 'D',
    enonce:
      'Au cours des 6 derniers mois, combien des éléments suivants avez-vous constatés chez vous ?',
    precision:
      'Sommeil dégradé · irritabilité inhabituelle · fatigue persistante malgré le repos · ' +
      'problème de santé nouveau · difficulté à décrocher même en congé',
    options: ['Quatre ou cinq', 'Trois', 'Deux', 'Un seul', 'Aucun'],
  },
  {
    id: 'Q16',
    numero: 16,
    axe: 'A3',
    sousDimension: '3.5',
    type: 'C',
    /*
      Question à double extrémité problématique : « un vide » et « un soulagement immédiat »
      sont l'un et l'autre des signaux d'alerte, pour des raisons opposées (spec §6).
    */
    enonce: 'Vous vendez votre entreprise demain, à un bon prix. Quelle est votre première émotion ?',
    options: [
      'Un vide. Je ne sais pas qui je serais sans elle',
      'Un soulagement immédiat, presque une fuite',
      "De l'inquiétude sur ce qui viendrait après",
      'De la fierté, avec un projet déjà en tête',
      "De la sérénité. J'ai une trajectoire claire au-delà de cette entreprise",
    ],
  },
  {
    id: 'Q17',
    numero: 17,
    axe: 'A3',
    sousDimension: '3.2',
    type: 'E',
    enonce:
      'La dernière décision majeure que vous avez prise. Avec qui l’aviez-vous discutée avant ' +
      'de la prendre ?',
    options: [
      'Personne',
      "Personne, mais j'en ai parlé après coup",
      'Une personne, qui a surtout écouté',
      'Une ou deux personnes qui ont réellement contesté mon raisonnement',
      'Un processus établi de contradiction avant décision',
    ],
  },
  {
    id: 'Q18',
    numero: 18,
    axe: 'A3',
    sousDimension: '3.4',
    type: 'C',
    enonce:
      'À quelle échéance, et sous quelle forme, sortirez-vous de la direction opérationnelle ' +
      'de votre entreprise ?',
    options: [
      "Je n'y ai jamais réfléchi",
      "J'y pense, sans horizon ni forme précise",
      "J'ai une idée d'horizon, rien n'est écrit",
      "J'ai un horizon et une forme — transmission, cession ou direction déléguée — non formalisés",
      "C'est écrit, daté, et connu d'au moins une autre personne",
    ],
  },
]

export const NOMBRE_QUESTIONS = QUESTIONS.length

/** Retourne la transition à afficher avant cette question, si elle existe. */
export function questionParNumero(numero) {
  return QUESTIONS.find((q) => q.numero === numero) ?? null
}
