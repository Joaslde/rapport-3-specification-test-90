// ⚠️ FICHIER GÉNÉRÉ — ne pas modifier ici.
// Source : supabase/functions/_shared/bareme.js
// Régénérer avec : npm run sync:fonctions
/*
  LE BARÈME — FICHIER SERVEUR EXCLUSIVEMENT
  Source : rapport-3-specification-test-90-jours.md §6 et §8

  ⚠️⚠️  NE JAMAIS IMPORTER CE FICHIER DEPUIS src/  ⚠️⚠️
  Règles S1 et S10 de docs/securite.md.

  Si ce fichier atteint le bundle navigateur :
    - le barème complet devient lisible,
    - le score devient manipulable,
    - les données du futur Baromètre sont invalidées.

  Il vit sous supabase/functions/ précisément pour que Vite ne le voie jamais.

  ── Note de conception ──
  Dans les 18 questions, les options sont ordonnées du plus faible (index 0) au plus fort
  (index 4), et les points suivent exactement cet ordre : points = index.
  On conserve néanmoins la table explicite ci-dessous plutôt qu'une formule, pour deux raisons :
    1. elle documente le barème et le rend vérifiable ligne à ligne contre la spécification ;
    2. si une question future rompt cette régularité (barème non monotone), la structure
       n'a pas à changer.
*/

/** Coefficient de chaque question (spec §8.1). */
export const COEFFICIENTS = {
  Q1: 1.5,
  Q2: 1,
  Q3: 1.5,
  Q4: 1,
  Q5: 1,
  Q6: 1,
  Q7: 2, // question la plus lourde — cœur du test
  Q8: 2,
  Q9: 1.5,
  Q10: 1,
  Q11: 1,
  Q12: 1.5,
  Q13: 1,
  Q14: 1,
  Q15: 1.5,
  Q16: 1,
  Q17: 1.5,
  Q18: 1,
}

/** Points attribués par index d'option, pour chaque question. */
export const POINTS = {
  Q1: [0, 1, 2, 3, 4],
  Q2: [0, 1, 2, 3, 4],
  Q3: [0, 1, 2, 3, 4],
  Q4: [0, 1, 2, 3, 4],
  Q5: [0, 1, 2, 3, 4],
  Q6: [0, 1, 2, 3, 4],
  Q7: [0, 1, 2, 3, 4],
  Q8: [0, 1, 2, 3, 4],
  Q9: [0, 1, 2, 3, 4],
  Q10: [0, 1, 2, 3, 4],
  Q11: [0, 1, 2, 3, 4],
  Q12: [0, 1, 2, 3, 4],
  Q13: [0, 1, 2, 3, 4],
  Q14: [0, 1, 2, 3, 4],
  Q15: [0, 1, 2, 3, 4],
  Q16: [0, 1, 2, 3, 4],
  Q17: [0, 1, 2, 3, 4],
  Q18: [0, 1, 2, 3, 4],
}

/** Rattachement question → axe. */
export const AXE_DE_QUESTION = {
  Q1: 'A1',
  Q2: 'A1',
  Q3: 'A1',
  Q4: 'A1',
  Q5: 'A1',
  Q6: 'A1',
  Q7: 'A1',
  Q8: 'A2',
  Q9: 'A2',
  Q10: 'A2',
  Q11: 'A2',
  Q12: 'A2',
  Q13: 'A2',
  Q14: 'A3',
  Q15: 'A3',
  Q16: 'A3',
  Q17: 'A3',
  Q18: 'A3',
}

/** Rattachement question → sous-dimension (spec §5). */
export const SOUS_DIMENSION_DE_QUESTION = {
  Q1: '1.5',
  Q2: '1.4',
  Q3: '1.2',
  Q4: '1.3',
  Q5: '1.1',
  Q6: '1.2',
  Q7: '1.5',
  Q8: '2.1',
  Q9: '2.3',
  Q10: '2.2',
  Q11: '2.2',
  Q12: '2.4',
  Q13: '2.5',
  Q14: '3.1',
  Q15: '3.3',
  Q16: '3.5',
  Q17: '3.2',
  Q18: '3.4',
}

/** Poids et maximum brut de chaque axe (spec §5 et §8.1). */
export const AXES_CONFIG = {
  A1: { poids: 0.4, maxBrut: 36 },
  A2: { poids: 0.35, maxBrut: 32 },
  A3: { poids: 0.25, maxBrut: 24 },
}

/** Les cinq niveaux de lecture du score global (spec §10.1). */
export const NIVEAUX = [
  { min: 0, max: 25, id: 'defaillance_unique', nom: 'Point de défaillance unique' },
  { min: 26, max: 45, id: 'centre_nevralgique', nom: 'Centre névralgique' },
  { min: 46, max: 62, id: 'transition_inachevee', nom: 'Transition inachevée' },
  { min: 63, max: 80, id: 'structure_emergente', nom: 'Structure émergente' },
  { min: 81, max: 100, id: 'entreprise_transferable', nom: 'Entreprise transférable' },
]

/** Seuil de qualification d'un axe : faible en dessous, fort au-dessus (spec §10.2). */
export const SEUIL_AXE = 50

/** Les cinq contrôles d'incohérence (spec §11.1). */
export const CONTROLES_INCOHERENCE = [
  {
    id: 1,
    nom: 'Absence vs perception',
    test: (r) => r.Q1 >= 3 && r.Q7 <= 1,
    message:
      'Vous déclarez vous être absenté plus de 11 jours, mais estimez qu’un client remarquerait ' +
      "votre absence en moins d'une semaine. Cela signifie souvent que vous n'avez jamais " +
      'réellement décroché pendant cette absence.',
  },
  {
    id: 2,
    nom: 'Second de commandement vs vécu',
    test: (r) => r.Q8 === 4 && r.Q1 <= 1,
    message:
      'Vous indiquez qu’une personne a déjà dirigé à votre place, mais que vous ne vous êtes ' +
      "jamais absenté plus de cinq jours. L'expérience de remplacement a probablement été " +
      'partielle ou supervisée.',
  },
  {
    id: 3,
    nom: 'Délégation théorique vs réelle',
    test: (r) => r.Q3 >= 3 && r.Q5 <= 1,
    message:
      'Vos relations clients semblent déléguées, mais plus de dix décisions par semaine vous ' +
      'remontent encore. La délégation est commerciale, pas décisionnelle.',
  },
  {
    id: 4,
    nom: 'Procédures vs dépendance institutionnelle',
    test: (r) => r.Q4 >= 3 && r.Q6 === 0,
    message:
      "Vos procédures internes sont documentées, mais l'ensemble de vos relations bancaires et " +
      "administratives repose sur vous seul. C'est la dépendance la plus difficile à transmettre, " +
      'parce qu’elle est relationnelle et non procédurale.',
  },
  {
    id: 5,
    nom: 'Contradiction sur le contrôle',
    test: (r) => r.Q9 === 0 && r.Q17 >= 3,
    message:
      'Vous déclarez faire contester vos décisions avant de les prendre, mais ne pas vous ' +
      'souvenir de la dernière fois qu’un collaborateur vous a dit que vous aviez tort. ' +
      "La contradiction vient probablement de l'extérieur de l'entreprise, pas de l'intérieur.",
  },
]

/**
 * Condition de déclenchement du protocole de sécurité (spec §14.1).
 * Quatre ou cinq signaux physiques, aucun jour de repos sur un an,
 * une réaction de vide ou de fuite à l'idée de vendre, et personne à qui parler.
 *
 * ⚠️ Cette condition ne doit JAMAIS être devinable depuis le front (docs/securite.md §9).
 */
export function protocoleSecuriteActif(r) {
  return r.Q15 === 0 && r.Q14 === 0 && r.Q16 <= 1 && r.Q13 === 0
}

/** Matrice de génération du scénario de rupture (spec §13.2). */
export const BLOCS_SCENARIO = [
  { id: 'decisions', test: (r) => r.Q5 <= 1, ordre: 1, jours: 'Jours 1 à 5' },
  { id: 'paiements', test: (r) => r.Q2 === 0, ordre: 2, jours: 'Jours 3 à 10' },
  { id: 'administratif', test: (r) => r.Q6 === 0, ordre: 3, jours: 'Jours 10 à 25' },
  { id: 'client_appelle', test: (r) => r.Q3 <= 1, ordre: 4, jours: 'Jours 12 à 20' },
  { id: 'conflit_autorite', test: (r) => r.Q8 <= 1, ordre: 5, jours: 'Jours 20 à 40' },
  { id: 'savoir_manquant', test: (r) => r.Q4 <= 1, ordre: 6, jours: 'Jours 25 à 45' },
  { id: 'tresorerie', test: (r) => r.Q12 <= 1, ordre: 7, jours: 'Jours 30 à 60' },
  { id: 'cadre_part', test: (r) => r.Q10 <= 1, ordre: 8, jours: 'Jours 45 à 70' },
  { id: 'client_part', test: (r) => r.Q3 <= 1 && r.Q8 <= 1, ordre: 9, jours: 'Jours 60 à 90' },
]
