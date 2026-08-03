// ⚠️ FICHIER GÉNÉRÉ — ne pas modifier ici.
// Source : supabase/functions/_shared/scoring.js
// Régénérer avec : npm run sync:fonctions
/*
  LE MOTEUR DE SCORING — FICHIER SERVEUR EXCLUSIVEMENT
  Source : rapport-3-specification-test-90-jours.md §8, §9, §10, §11, §13, §14

  ⚠️ NE JAMAIS IMPORTER DEPUIS src/ — règle S1 de docs/securite.md.
*/

import {
  COEFFICIENTS,
  POINTS,
  AXE_DE_QUESTION,
  SOUS_DIMENSION_DE_QUESTION,
  AXES_CONFIG,
  NIVEAUX,
  SEUIL_AXE,
  CONTROLES_INCOHERENCE,
  BLOCS_SCENARIO,
  protocoleSecuriteActif,
} from './bareme.js'

const IDS_QUESTIONS = Object.keys(COEFFICIENTS)

/**
 * Convertit le tableau d'index reçu du front en points par question.
 * @param {number[]} indexReponses - 18 entiers, chacun entre 0 et 4
 * @returns {Object} { Q1: points, Q2: points, ... }
 */
export function indexVersPoints(indexReponses) {
  if (!Array.isArray(indexReponses) || indexReponses.length !== 18) {
    throw new Error('Il faut exactement 18 réponses')
  }

  const points = {}
  IDS_QUESTIONS.forEach((id, i) => {
    const index = indexReponses[i]
    if (!Number.isInteger(index) || index < 0 || index > 4) {
      throw new Error(`Réponse invalide pour ${id} : ${index}`)
    }
    points[id] = POINTS[id][index]
  })
  return points
}

/**
 * Points bruts par axe, coefficients appliqués (spec §8.1).
 * @returns {Object} { A1, A2, A3 } — maxima respectifs : 36, 32, 24
 */
export function calculerAxesBruts(points) {
  const bruts = { A1: 0, A2: 0, A3: 0 }
  for (const id of IDS_QUESTIONS) {
    bruts[AXE_DE_QUESTION[id]] += COEFFICIENTS[id] * points[id]
  }
  return bruts
}

/** Scores d'axe normalisés sur 100 (spec §8.1). */
export function normaliserAxes(bruts) {
  return {
    A1: (bruts.A1 / AXES_CONFIG.A1.maxBrut) * 100,
    A2: (bruts.A2 / AXES_CONFIG.A2.maxBrut) * 100,
    A3: (bruts.A3 / AXES_CONFIG.A3.maxBrut) * 100,
  }
}

/** INDICE 90 = 0,40·A1 + 0,35·A2 + 0,25·A3, arrondi à l'entier (spec §8.1). */
export function calculerIndice90(axes) {
  const brut =
    AXES_CONFIG.A1.poids * axes.A1 + AXES_CONFIG.A2.poids * axes.A2 + AXES_CONFIG.A3.poids * axes.A3
  return Math.round(brut)
}

/**
 * JOURS = arrondi(3 × e^(INDICE90 / 21)), plafonné à 365 (spec §9.1).
 * La courbe est exponentielle et non linéaire — voir spec §9.3.
 */
export function calculerJours(indice90) {
  return Math.min(365, Math.round(3 * Math.exp(indice90 / 21)))
}

/**
 * Score de chaque sous-dimension : moyenne des questions qui la composent,
 * normalisée sur 100 (spec §8.2).
 */
export function scorerSousDimensions(points) {
  const groupes = {}
  for (const id of IDS_QUESTIONS) {
    const sd = SOUS_DIMENSION_DE_QUESTION[id]
    ;(groupes[sd] ??= []).push(id)
  }

  const scores = {}
  for (const [sd, ids] of Object.entries(groupes)) {
    const total = ids.reduce((s, id) => s + points[id], 0)
    // Chaque question vaut au maximum 4 points.
    scores[sd] = (total / (ids.length * 4)) * 100
  }
  return scores
}

/**
 * Classe les sous-dimensions. En cas d'égalité, on départage par le coefficient
 * le plus lourd — une fragilité sur une question à ×2 prime (spec §8.2).
 */
function classerSousDimensions(scoresSD) {
  const poidsSD = {}
  for (const id of IDS_QUESTIONS) {
    const sd = SOUS_DIMENSION_DE_QUESTION[id]
    poidsSD[sd] = (poidsSD[sd] ?? 0) + COEFFICIENTS[id]
  }

  return Object.entries(scoresSD)
    .map(([id, score]) => ({ id, score, poids: poidsSD[id] }))
    .sort((a, b) => a.score - b.score || b.poids - a.poids)
}

/** Les trois sous-dimensions les mieux notées (spec §8.2). */
export function identifierForces(scoresSD) {
  return classerSousDimensions(scoresSD).slice(-3).reverse()
}

/** Les trois sous-dimensions les moins bien notées (spec §8.2). */
export function identifierFragilites(scoresSD) {
  return classerSousDimensions(scoresSD).slice(0, 3)
}

/** La sous-dimension la plus faible, départagée par le coefficient (spec §8.2). */
export function identifierPointCritique(scoresSD) {
  return classerSousDimensions(scoresSD)[0]
}

/** Le niveau, parmi les cinq (spec §10.1). */
export function determinerNiveau(indice90) {
  return NIVEAUX.find((n) => indice90 >= n.min && indice90 <= n.max) ?? NIVEAUX[0]
}

/**
 * L'archétype croisé (spec §10.2).
 *
 * Le document ne nomme que 6 des 8 combinaisons possibles. Les deux manquantes —
 * faible/fort/fort et fort/faible/fort — sont rattachées ici à l'archétype le plus
 * proche par l'axe déficient, en attendant l'arbitrage du manager (todo.md, question 9).
 * Le champ `provisoire` les signale explicitement pour qu'elles ne passent pas inaperçues.
 */
export function determinerArchetype(axes) {
  const f1 = axes.A1 >= SEUIL_AXE
  const f2 = axes.A2 >= SEUIL_AXE
  const f3 = axes.A3 >= SEUIL_AXE
  const cle = `${f1 ? 'F' : 'f'}${f2 ? 'F' : 'f'}${f3 ? 'F' : 'f'}`

  const table = {
    fff: { numero: 1, id: 'convergence', nom: 'La convergence' },
    ffF: { numero: 2, id: 'pilote_solide', nom: 'Le pilote solide, la machine fragile' },
    fFf: {
      numero: 3,
      id: 'equipe_sans_place',
      nom: "L'équipe existe, la place ne s'est pas libérée",
    },
    Fff: { numero: 4, id: 'processus_hommes', nom: "Les processus tiennent, les hommes s'usent" },
    FFf: { numero: 5, id: 'entreprise_prete', nom: "L'entreprise est prête, vous ne l'êtes pas" },
    FFF: { numero: 6, id: 'actif_transferable', nom: "L'actif transférable" },

    // Combinaisons non couvertes par la spécification — rattachement provisoire.
    fFF: {
      numero: 3,
      id: 'equipe_sans_place',
      nom: "L'équipe existe, la place ne s'est pas libérée",
      provisoire: true,
    },
    FfF: {
      numero: 4,
      id: 'processus_hommes',
      nom: "Les processus tiennent, les hommes s'usent",
      provisoire: true,
    },
  }

  return { ...table[cle], combinaison: cle }
}

/** Les cinq contrôles d'incohérence (spec §11.1). */
export function detecterIncoherences(points) {
  return CONTROLES_INCOHERENCE.filter((c) => c.test(points)).map(({ id, nom, message }) => ({
    id,
    nom,
    message,
  }))
}

/**
 * Blocs du scénario de rupture déclenchés par les réponses (spec §13.2),
 * dans l'ordre narratif.
 */
export function genererBlocsScenario(points) {
  return BLOCS_SCENARIO.filter((b) => b.test(points))
    .sort((a, b) => a.ordre - b.ordre)
    .map(({ id, jours, ordre }) => ({ id, jours, ordre }))
}

/**
 * Calcul complet. Point d'entrée unique de l'Edge Function.
 * @param {number[]} indexReponses - 18 index d'options (0 à 4)
 */
export function calculerResultat(indexReponses) {
  const points = indexVersPoints(indexReponses)
  const bruts = calculerAxesBruts(points)
  const axes = normaliserAxes(bruts)
  const indice90 = calculerIndice90(axes)
  const scoresSD = scorerSousDimensions(points)
  const protocole = protocoleSecuriteActif(points)

  return {
    indice90,
    jours: calculerJours(indice90),
    axes: {
      A1: Math.round(axes.A1),
      A2: Math.round(axes.A2),
      A3: Math.round(axes.A3),
    },
    axesBruts: bruts,
    sousDimensions: scoresSD,
    forces: identifierForces(scoresSD),
    fragilites: identifierFragilites(scoresSD),
    pointCritique: identifierPointCritique(scoresSD),
    niveau: determinerNiveau(indice90),
    archetype: determinerArchetype(axes),
    incoherences: detecterIncoherences(points),

    // Protocole de sécurité : le scénario de rupture n'est PAS généré
    // pour une personne en épuisement (spec §14.2).
    protocoleSecurite: protocole,
    blocsScenario: protocole ? [] : genererBlocsScenario(points),
  }
}
