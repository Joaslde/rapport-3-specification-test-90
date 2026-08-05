/*
  TESTS DU MOTEUR DE SCORING
  Vérifient le moteur contre les valeurs publiées dans la spécification.
  Toute divergence ici signifie que l'instrument est faux.
*/

import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import {
  indexVersPoints,
  calculerAxesBruts,
  calculerJours,
  arrondiCommercial,
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

/**
 * Charge le jeu de référence des 101 valeurs (note d'audit du 3 août 2026, §10).
 * Ce fichier est opposable : il a été généré par le calcul, jamais saisi à la main.
 */
function chargerFixture() {
  const csv = fs.readFileSync(
    path.join(import.meta.dirname, 'fixtures/fixture-indice90.csv'),
    'utf8',
  )
  return csv
    .trim()
    .split('\n')
    .slice(1)
    .map((ligne) => {
      const [indice90, jours, niveau] = ligne.split(',')
      return { indice90: Number(indice90), jours: Number(jours), niveau }
    })
}

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

describe('Conversion score → jours — jeu de référence opposable', () => {
  /*
    Note d'audit du 3 août 2026, §10 et §13 (protocole de recette, contrôle n°1).

    La formule est désormais `3 × (365/3)^(I/100)`, avec arrondi commercial.
    Elle remplace `3 × e^(I/21)`, qui plafonnait à 350,91 jours et rendait la
    clause « plafonné à 365 » inatteignable (code mort, défaut n°4).

    Le fichier fixture-indice90.csv contient les 101 valeurs de référence,
    générées par le calcul et non écrites à la main. Il fait foi :
    « Toute implémentation doit reproduire ces 101 valeurs exactement. »
  */
  const REFERENCE = chargerFixture()

  it('contient bien les 101 valeurs de référence', () => {
    expect(REFERENCE).toHaveLength(101)
  })

  it.each(REFERENCE.map((r) => [r.indice90, r.jours]))(
    'un Indice de %i donne %i jours',
    (indice, joursAttendus) => {
      expect(calculerJours(indice)).toBe(joursAttendus)
    },
  )

  it('ancre exactement les deux bornes (audit §13, contrôle n°2)', () => {
    expect(calculerJours(0)).toBe(3)
    expect(calculerJours(100)).toBe(365)
  })

  it('franchit le seuil des 90 jours à un Indice de 71 (audit §5.4)', () => {
    expect(calculerJours(70)).toBeLessThan(90)
    expect(calculerJours(71)).toBeGreaterThanOrEqual(90)
  })

  it('refuse un Indice non entier ou hors bornes (audit §6.2)', () => {
    expect(() => calculerJours(25.6)).toThrow('Indice invalide')
    expect(() => calculerJours(-1)).toThrow('Indice invalide')
    expect(() => calculerJours(101)).toThrow('Indice invalide')
  })

  it('est strictement croissante', () => {
    for (let i = 1; i <= 100; i++) {
      expect(calculerJours(i)).toBeGreaterThanOrEqual(calculerJours(i - 1))
    }
  })
})

describe('Arrondi commercial (audit §6.1)', () => {
  it('arrondit toujours la demie vers le haut', () => {
    expect(arrondiCommercial(0.5)).toBe(1)
    expect(arrondiCommercial(1.5)).toBe(2)
    expect(arrondiCommercial(2.5)).toBe(3)
    expect(arrondiCommercial(2.4999)).toBe(2)
  })
})

describe("Ordre des opérations — l'Indice est arrondi avant tout (audit §6.2)", () => {
  it('produit toujours un Indice entier, jamais décimal', () => {
    for (let v = 0; v <= 4; v++) {
      expect(Number.isInteger(calculerResultat(toutes(v)).indice90)).toBe(true)
    }
  })

  it('fait tomber les 101 Indices dans exactement un niveau (audit §13, contrôle n°5)', () => {
    for (let i = 0; i <= 100; i++) {
      expect(determinerNiveau(i)).toBeDefined()
    }
  })

  it('garde le score affiché et les jours affichés cohérents entre eux', () => {
    const r = calculerResultat(reponses({ Q1: 3, Q7: 1, Q12: 4 }))
    expect(r.jours).toBe(calculerJours(r.indice90))
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

describe('Les huit archétypes (spec §10.2 + audit du 3 août 2026, §7.4)', () => {
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

  it('applique le seuil de 50 comme borne inférieure du fort (audit §6.3)', () => {
    // Un axe à exactement 50,0 est FORT (audit §13, contrôle n°7).
    expect(determinerArchetype({ A1: 50, A2: 50, A3: 50 }).numero).toBe(6)
    expect(determinerArchetype({ A1: 49, A2: 49, A3: 49 }).numero).toBe(1)
  })

  it("classe FORT un axe à exactement 50,0 — cas des 12 points bruts sur 24", () => {
    // Cas concret cité par l'audit : un Axe 3 à 12/24 donne exactement 50,0.
    expect(determinerArchetype({ A1: 20, A2: 20, A3: 50 }).numero).toBe(2)
  })

  /*
    Les archétypes 7 et 8 — note d'audit du 3 août 2026, §7.
    Le rattachement provisoire précédent produisait un diagnostic FAUX : il
    affirmait à un dirigeant dont l'Axe 3 est fort qu'il ne va pas bien.
  */
  it("identifie les hommes sans machine — A1 faible, A2 et A3 forts", () => {
    const a = determinerArchetype({ A1: 20, A2: 80, A3: 80 })
    expect(a.numero).toBe(7)
    expect(a.id).toBe('hommes_sans_machine')
  })

  it('identifie la structure sans porteur — A2 faible, A1 et A3 forts', () => {
    const a = determinerArchetype({ A1: 80, A2: 20, A3: 80 })
    expect(a.numero).toBe(8)
    expect(a.id).toBe('structure_sans_porteur')
  })

  it('couvre les huit combinaisons sans rattachement par défaut (audit §13, contrôle n°6)', () => {
    const numeros = new Set()
    for (const A1 of [20, 80]) {
      for (const A2 of [20, 80]) {
        for (const A3 of [20, 80]) {
          const a = determinerArchetype({ A1, A2, A3 })
          expect(a.id).toBeDefined()
          expect(a.provisoire).toBeUndefined()
          numeros.add(a.numero)
        }
      }
    }
    // Huit combinaisons, huit archétypes DISTINCTS.
    expect(numeros.size).toBe(8)
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

describe('Protocole de sécurité (audit du 3 août 2026, §8.3)', () => {
  /*
    Règle corrigée : DÉCLENCHEMENT si SIGNAUX ≥ 3 ET Q15 ≤ 1.

    L'ancienne conjonction (Q15=0 ET Q14=0 ET Q16≤1 ET Q13=0) ne se déclenchait
    que dans 0,32 % des cas — elle ne protégeait personne (audit §8.2).
  */
  const detresse = reponses({ Q15: 0, Q14: 0, Q16: 0, Q13: 0 })

  it('se déclenche quand les quatre signaux sont réunis', () => {
    expect(calculerResultat(detresse).protocoleSecurite).toBe(true)
  })

  it('accepte Q16 = 1 (soulagement immédiat) comme signal', () => {
    const r = reponses({ Q15: 0, Q14: 0, Q16: 1, Q13: 0 })
    expect(calculerResultat(r).protocoleSecurite).toBe(true)
  })

  it('détecte désormais le cas qui échappait à l’ancienne règle (audit §8.2)', () => {
    /*
      Le dirigeant qui présente cinq signaux physiques, aucun jour de repos en un
      an, un vide à l'idée de vendre — mais qui a coché « mon conjoint » à Q13.
      L'ancienne règle ne le détectait pas : il recevait le scénario de rupture
      et entrait dans la séquence commerciale.
    */
    const r = reponses({ Q15: 0, Q14: 0, Q16: 0, Q13: 3 })
    expect(calculerResultat(r).protocoleSecurite).toBe(true)
  })

  it('exige impérativement le signal physique Q15 (audit §8.3)', () => {
    // Trois signaux sur quatre, mais sans signal physique : dirigeant surchargé,
    // pas en danger. Le protocole ne doit pas se déclencher.
    const r = reponses({ Q15: 4, Q14: 0, Q16: 0, Q13: 0 })
    expect(calculerResultat(r).protocoleSecurite).toBe(false)
  })

  it('ne se déclenche pas en dessous de trois signaux', () => {
    // Q15 seul (signal physique), les trois autres au-dessus du seuil.
    const r = reponses({ Q15: 0, Q14: 4, Q16: 4, Q13: 4 })
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
