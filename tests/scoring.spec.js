/*
  TESTS DU MOTEUR DE SCORING
  Vérifient le moteur contre les valeurs publiées dans la spécification.
  Toute divergence ici signifie que l'instrument est faux.
*/

import { describe, it, expect } from 'vitest'
import {
  indexVersPoints,
  calculerAxesBruts,
  calculerJours,
  scorerSousDimensions,
  identifierForces,
  identifierFragilites,
  identifierPointCritique,
  determinerNiveau,
  determinerArchetype,
  detecterIncoherences,
  genererBlocsScenario,
  calculerResultat,
} from '../supabase/functions/_shared/scoring.js'

/** Construit un jeu de 18 réponses, toutes à la même valeur. */
const toutes = (v) => Array(18).fill(v)

/** Construit un jeu de réponses à partir d'un objet { Q1: 3, Q7: 0, ... }, défaut 2. */
function reponses(overrides = {}, defaut = 2) {
  const ids = Array.from({ length: 18 }, (_, i) => `Q${i + 1}`)
  return ids.map((id) => overrides[id] ?? defaut)
}

describe('Validation des entrées', () => {
  it('rejette un tableau qui ne fait pas 18 entrées', () => {
    expect(() => indexVersPoints([0, 1, 2])).toThrow('exactement 18')
  })

  it('rejette un index hors de la plage 0-4', () => {
    expect(() => indexVersPoints(toutes(5))).toThrow('invalide')
    expect(() => indexVersPoints(toutes(-1))).toThrow('invalide')
  })

  it('rejette une valeur non entière', () => {
    const r = toutes(2)
    r[0] = 2.5
    expect(() => indexVersPoints(r)).toThrow('invalide')
  })
})

describe('Maxima des axes (spec §8.1)', () => {
  it('atteint 36 / 32 / 24 quand toutes les réponses sont au maximum', () => {
    const bruts = calculerAxesBruts(indexVersPoints(toutes(4)))
    expect(bruts.A1).toBe(36)
    expect(bruts.A2).toBe(32)
    expect(bruts.A3).toBe(24)
  })

  it('donne 0 partout quand toutes les réponses sont au minimum', () => {
    const bruts = calculerAxesBruts(indexVersPoints(toutes(0)))
    expect(bruts).toEqual({ A1: 0, A2: 0, A3: 0 })
  })

  it('applique bien le coefficient ×2 de Q7', () => {
    // Q7 seule à 4, tout le reste à 0 → 2 × 4 = 8
    const bruts = calculerAxesBruts(indexVersPoints(reponses({ Q7: 4 }, 0)))
    expect(bruts.A1).toBe(8)
  })

  it('applique bien le coefficient ×1,5 de Q1', () => {
    const bruts = calculerAxesBruts(indexVersPoints(reponses({ Q1: 4 }, 0)))
    expect(bruts.A1).toBe(6)
  })
})

describe('Bornes de l’Indice 90', () => {
  it('vaut 0 quand tout est au minimum', () => {
    expect(calculerResultat(toutes(0)).indice90).toBe(0)
  })

  it('vaut 100 quand tout est au maximum', () => {
    expect(calculerResultat(toutes(4)).indice90).toBe(100)
  })

  it('vaut 50 quand tout est au milieu', () => {
    expect(calculerResultat(toutes(2)).indice90).toBe(50)
  })
})

describe('Conversion score → jours (spec §9.1)', () => {
  /*
    ⚠️ La formule de la spec §9.1 et la table de la spec §9.2 divergent sur 3 valeurs :
         I=30  → formule 12,518 → 13   (table : 12 — troncature au lieu d'arrondi)
         I=90  → formule 217,963 → 218 (table : 217 — idem)
         I=100 → formule 350,906 → 351 (table : 365 — la table force l'année pleine)

    Arbitrage utilisateur : LA FORMULE FAIT AUTORITÉ. La table §9.2 devient indicative.
    Point signalé au manager. Voir docs/lessons.md.
  */
  const table = [
    [10, 5],
    [20, 8],
    [30, 13],
    [40, 20],
    [50, 32],
    [60, 52],
    [70, 84],
    [80, 135],
    [90, 218],
    [100, 351],
  ]

  it.each(table)('un Indice de %i donne %i jours', (indice, joursAttendus) => {
    expect(calculerJours(indice)).toBe(joursAttendus)
  })

  it('reste à 1 jour près de la table publiée sur la plage réellement observée', () => {
    // La distribution attendue des répondants se situe entre 25 et 55 (spec §9.3).
    const publiees = { 30: 12, 40: 20, 50: 32 }
    for (const [indice, jours] of Object.entries(publiees)) {
      expect(Math.abs(calculerJours(Number(indice)) - jours)).toBeLessThanOrEqual(1)
    }
  })

  it('plafonne à 365 jours', () => {
    expect(calculerJours(120)).toBe(365)
  })

  it('est strictement croissante', () => {
    for (let i = 1; i <= 100; i++) {
      expect(calculerJours(i)).toBeGreaterThanOrEqual(calculerJours(i - 1))
    }
  })
})

describe('Les cinq niveaux (spec §10.1)', () => {
  it.each([
    [0, 'defaillance_unique'],
    [25, 'defaillance_unique'],
    [26, 'centre_nevralgique'],
    [45, 'centre_nevralgique'],
    [46, 'transition_inachevee'],
    [62, 'transition_inachevee'],
    [63, 'structure_emergente'],
    [80, 'structure_emergente'],
    [81, 'entreprise_transferable'],
    [100, 'entreprise_transferable'],
  ])('un Indice de %i donne le niveau %s', (indice, attendu) => {
    expect(determinerNiveau(indice).id).toBe(attendu)
  })
})

describe('Les six archétypes (spec §10.2)', () => {
  it('identifie la convergence — les trois axes faibles', () => {
    const a = determinerArchetype({ A1: 20, A2: 20, A3: 20 })
    expect(a.numero).toBe(1)
    expect(a.id).toBe('convergence')
  })

  it('identifie le pilote solide — A3 seul fort', () => {
    expect(determinerArchetype({ A1: 20, A2: 20, A3: 80 }).numero).toBe(2)
  })

  it("identifie l'équipe sans place — A2 seul fort", () => {
    expect(determinerArchetype({ A1: 20, A2: 80, A3: 20 }).numero).toBe(3)
  })

  it('identifie les processus qui tiennent — A1 seul fort', () => {
    expect(determinerArchetype({ A1: 80, A2: 20, A3: 20 }).numero).toBe(4)
  })

  it("identifie l'entreprise prête — A1 et A2 forts, A3 faible", () => {
    expect(determinerArchetype({ A1: 80, A2: 80, A3: 20 }).numero).toBe(5)
  })

  it("identifie l'actif transférable — les trois axes forts", () => {
    expect(determinerArchetype({ A1: 80, A2: 80, A3: 80 }).numero).toBe(6)
  })

  it('applique le seuil de 50 comme borne inférieure du fort', () => {
    // 50 est fort, 49 est faible.
    expect(determinerArchetype({ A1: 50, A2: 50, A3: 50 }).numero).toBe(6)
    expect(determinerArchetype({ A1: 49, A2: 49, A3: 49 }).numero).toBe(1)
  })

  it('marque comme provisoires les deux combinaisons absentes de la spec', () => {
    expect(determinerArchetype({ A1: 20, A2: 80, A3: 80 }).provisoire).toBe(true)
    expect(determinerArchetype({ A1: 80, A2: 20, A3: 80 }).provisoire).toBe(true)
  })

  it('ne marque pas provisoires les six archétypes documentés', () => {
    expect(determinerArchetype({ A1: 20, A2: 20, A3: 20 }).provisoire).toBeUndefined()
    expect(determinerArchetype({ A1: 80, A2: 80, A3: 80 }).provisoire).toBeUndefined()
  })
})

describe('Détection d’incohérences (spec §11.1)', () => {
  it('détecte le contrôle 1 — absence vs perception', () => {
    const inc = detecterIncoherences(indexVersPoints(reponses({ Q1: 3, Q7: 1 })))
    expect(inc.map((i) => i.id)).toContain(1)
  })

  it('détecte le contrôle 2 — second de commandement vs vécu', () => {
    const inc = detecterIncoherences(indexVersPoints(reponses({ Q8: 4, Q1: 1 })))
    expect(inc.map((i) => i.id)).toContain(2)
  })

  it('détecte le contrôle 3 — délégation théorique vs réelle', () => {
    const inc = detecterIncoherences(indexVersPoints(reponses({ Q3: 3, Q5: 1 })))
    expect(inc.map((i) => i.id)).toContain(3)
  })

  it('détecte le contrôle 4 — procédures vs dépendance institutionnelle', () => {
    const inc = detecterIncoherences(indexVersPoints(reponses({ Q4: 3, Q6: 0 })))
    expect(inc.map((i) => i.id)).toContain(4)
  })

  it('détecte le contrôle 5 — contradiction sur le contrôle', () => {
    const inc = detecterIncoherences(indexVersPoints(reponses({ Q9: 0, Q17: 3 })))
    expect(inc.map((i) => i.id)).toContain(5)
  })

  it('ne signale rien sur un profil cohérent', () => {
    expect(detecterIncoherences(indexVersPoints(toutes(2)))).toHaveLength(0)
  })

  it('fournit un message pour chaque incohérence détectée', () => {
    const inc = detecterIncoherences(indexVersPoints(reponses({ Q1: 3, Q7: 1 })))
    expect(inc[0].message.length).toBeGreaterThan(50)
  })
})

describe('Protocole de sécurité (spec §14)', () => {
  // Déclencheur : Q15=0 ET Q14=0 ET Q16<=1 ET Q13=0
  const detresse = reponses({ Q15: 0, Q14: 0, Q16: 0, Q13: 0 })

  it('se déclenche quand les quatre conditions sont réunies', () => {
    expect(calculerResultat(detresse).protocoleSecurite).toBe(true)
  })

  it('accepte Q16 = 1 (soulagement immédiat) comme déclencheur', () => {
    const r = reponses({ Q15: 0, Q14: 0, Q16: 1, Q13: 0 })
    expect(calculerResultat(r).protocoleSecurite).toBe(true)
  })

  it('ne se déclenche pas si une seule condition manque', () => {
    const r = reponses({ Q15: 0, Q14: 0, Q16: 0, Q13: 1 })
    expect(calculerResultat(r).protocoleSecurite).toBe(false)
  })

  it('ne se déclenche pas si Q16 vaut 2 ou plus', () => {
    const r = reponses({ Q15: 0, Q14: 0, Q16: 2, Q13: 0 })
    expect(calculerResultat(r).protocoleSecurite).toBe(false)
  })

  it('SUPPRIME le scénario de rupture quand il est actif', () => {
    // Exigence déontologique : ce contenu est inapproprié pour une personne en épuisement.
    expect(calculerResultat(detresse).blocsScenario).toHaveLength(0)
  })

  it('génère bien le scénario quand il est inactif', () => {
    // Entreprise très dépendante (Q2 et Q5 au minimum), mais dirigeant qui va bien :
    // Q13 à 3 suffit à ne pas déclencher le protocole.
    const r = reponses({ Q5: 0, Q2: 0, Q13: 3, Q14: 3, Q15: 3, Q16: 3 }, 0)
    const res = calculerResultat(r)
    expect(res.protocoleSecurite).toBe(false)
    expect(res.blocsScenario.length).toBeGreaterThan(0)
  })
})

describe('Scénario de rupture (spec §13.2)', () => {
  it('déclenche le bloc des décisions quand Q5 <= 1', () => {
    const blocs = genererBlocsScenario(indexVersPoints(reponses({ Q5: 1 })))
    expect(blocs.map((b) => b.id)).toContain('decisions')
  })

  it('déclenche le bloc des paiements uniquement quand Q2 = 0', () => {
    expect(
      genererBlocsScenario(indexVersPoints(reponses({ Q2: 0 }))).map((b) => b.id),
    ).toContain('paiements')
    expect(
      genererBlocsScenario(indexVersPoints(reponses({ Q2: 1 }))).map((b) => b.id),
    ).not.toContain('paiements')
  })

  it('déclenche le départ du client quand Q3 ET Q8 sont faibles', () => {
    const blocs = genererBlocsScenario(indexVersPoints(reponses({ Q3: 1, Q8: 1 })))
    expect(blocs.map((b) => b.id)).toContain('client_part')
  })

  it('rend les blocs dans l’ordre narratif', () => {
    const blocs = genererBlocsScenario(indexVersPoints(toutes(0)))
    const ordres = blocs.map((b) => b.ordre)
    expect(ordres).toEqual([...ordres].sort((a, b) => a - b))
  })

  it('ne déclenche aucun bloc sur un profil solide', () => {
    expect(genererBlocsScenario(indexVersPoints(toutes(4)))).toHaveLength(0)
  })
})

describe('Sous-dimensions, forces et fragilités (spec §8.2)', () => {
  it('calcule les quinze sous-dimensions', () => {
    expect(Object.keys(scorerSousDimensions(indexVersPoints(toutes(2))))).toHaveLength(15)
  })

  it('donne 100 partout quand tout est au maximum', () => {
    const s = scorerSousDimensions(indexVersPoints(toutes(4)))
    Object.values(s).forEach((v) => expect(v).toBe(100))
  })

  it('retourne exactement trois forces et trois fragilités', () => {
    const s = scorerSousDimensions(indexVersPoints(reponses({ Q7: 4, Q1: 4, Q12: 0, Q13: 0 })))
    expect(identifierForces(s)).toHaveLength(3)
    expect(identifierFragilites(s)).toHaveLength(3)
  })

  it('classe les forces par score décroissant', () => {
    const s = scorerSousDimensions(indexVersPoints(reponses({ Q12: 4, Q13: 0 })))
    const f = identifierForces(s)
    expect(f[0].score).toBeGreaterThanOrEqual(f[1].score)
    expect(f[1].score).toBeGreaterThanOrEqual(f[2].score)
  })

  it('désigne comme point critique la sous-dimension la plus faible', () => {
    // 2.5 ne contient que Q13. En la mettant à 0, elle devient la plus faible.
    const s = scorerSousDimensions(indexVersPoints(reponses({ Q13: 0 }, 3)))
    expect(identifierPointCritique(s).id).toBe('2.5')
  })

  it('départage une égalité par le coefficient le plus lourd', () => {
    // 1.5 (Q1 ×1,5 + Q7 ×2 = 3,5) doit primer sur 1.1 (Q5 ×1 = 1) à score égal.
    const s = scorerSousDimensions(indexVersPoints(reponses({ Q1: 0, Q7: 0, Q5: 0 }, 3)))
    expect(identifierPointCritique(s).id).toBe('1.5')
  })
})

describe('Résultat complet', () => {
  it('expose tous les champs attendus', () => {
    const r = calculerResultat(toutes(2))
    expect(r).toHaveProperty('indice90')
    expect(r).toHaveProperty('jours')
    expect(r).toHaveProperty('axes')
    expect(r).toHaveProperty('sousDimensions')
    expect(r).toHaveProperty('forces')
    expect(r).toHaveProperty('fragilites')
    expect(r).toHaveProperty('pointCritique')
    expect(r).toHaveProperty('niveau')
    expect(r).toHaveProperty('archetype')
    expect(r).toHaveProperty('incoherences')
    expect(r).toHaveProperty('protocoleSecurite')
    expect(r).toHaveProperty('blocsScenario')
  })

  it('arrondit les scores d’axe à l’entier', () => {
    const r = calculerResultat(toutes(3))
    Object.values(r.axes).forEach((v) => expect(Number.isInteger(v)).toBe(true))
  })

  it('reste cohérent sur un profil réaliste', () => {
    // Profil de centre névralgique : dépendance forte, entourage moyen, dirigeant fatigué.
    const r = calculerResultat(
      reponses({
        Q1: 1, Q2: 1, Q3: 0, Q4: 1, Q5: 1, Q6: 0, Q7: 1,
        Q8: 1, Q9: 1, Q10: 2, Q11: 1, Q12: 1, Q13: 1,
        Q14: 1, Q15: 1, Q16: 1, Q17: 1, Q18: 0,
      }),
    )
    expect(r.indice90).toBeGreaterThan(0)
    expect(r.indice90).toBeLessThan(40)
    expect(r.jours).toBeGreaterThan(0)
    expect(r.jours).toBeLessThan(30)
  })
})
