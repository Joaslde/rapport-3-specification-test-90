/*
  TESTS DU RAPPORT DE 8 PAGES
  Vérifient les règles de la spécification qui ne se voient pas à la lecture :
  proportion analyse/vente, protocole de sécurité, benchmark, règles de rédaction.
*/

import { describe, it, expect } from 'vitest'
import { calculerResultat } from '../supabase/functions/_shared/scoring.js'
import { assemblerRapport, formulerBenchmark, nomFichierRapport } from '../supabase/functions/_shared/rapport.js'
import { ARCHETYPES_TEXTES } from '../supabase/functions/_shared/contenu-verdicts.js'
import { DIMENSIONS_TEXTES } from '../supabase/functions/_shared/contenu-dimensions.js'
import { SCENARIO_BLOCS, SCENARIO_CLOTURE } from '../supabase/functions/_shared/contenu-scenario.js'
import { ACTIONS_PAR_ARCHETYPE, routerCommercial } from '../supabase/functions/_shared/contenu-suite.js'

const IDENTITE = { prenom: 'Amadou', entreprise: 'Cabinet Test', email: 'a@exemple.ci' }

function reponses(o = {}, d = 2) {
  return Array.from({ length: 18 }, (_, i) => o[`Q${i + 1}`] ?? d)
}

function rapportPour(rep, profil = {}, barometre = { nb_repondants: 0 }) {
  return assemblerRapport({
    resultat: calculerResultat(rep),
    identite: IDENTITE,
    profil,
    barometre,
  })
}

describe('Structure du rapport', () => {
  it('produit 8 pages quand le scénario a de la matière', () => {
    // Un profil médian (tout à 2) ne déclenche aucun bloc de scénario :
    // il faut au moins une dépendance réelle pour qu'il y ait un récit.
    const r = rapportPour(reponses({ Q2: 0, Q5: 1, Q3: 1 }))
    expect(r.pages).toHaveLength(8)
    expect(r.pages.map((p) => p.numero)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })

  it('omet la page 7 et renumérote quand aucun bloc n’est déclenché', () => {
    const r = rapportPour(reponses())
    expect(r.meta.scenarioOmis).toBe(true)
    expect(r.pages.map((p) => p.numero)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('nomme le fichier Indice90_[Nom]_[Date].pdf', () => {
    const nom = nomFichierRapport('Amadou', new Date(2026, 7, 3))
    expect(nom).toBe('Indice90_Amadou_03-08-2026.pdf')
  })

  it('assainit le nom de fichier', () => {
    expect(nomFichierRapport('Jean-Éric / O\'Brien')).toMatch(/^Indice90_[A-Za-z0-9]+_/)
  })

  it('affiche le nombre de jours sur la couverture, pas seulement le score', () => {
    const p1 = rapportPour(reponses()).pages[0]
    expect(p1.phrase).toContain(String(p1.jours))
    expect(p1.phrase).toContain('sans vous')
  })
})

describe('Page 2 — le verdict', () => {
  it('contient le niveau et l’archétype', () => {
    const p2 = rapportPour(reponses()).pages[1]
    expect(p2.niveau.nom).toBeTruthy()
    expect(p2.archetype.nom).toBeTruthy()
    expect(p2.verdict.length).toBeGreaterThan(400)
  })

  it('ne contient AUCUNE proposition commerciale (spec §12.1)', () => {
    // « un paragraphe de 150 mots qui décrit la situation sans conseil ni vente »
    for (const a of Object.values(ARCHETYPES_TEXTES)) {
      expect(a.verdict.toLowerCase()).not.toMatch(
        /cabinet|diagnostic à|nous vous propos|contactez|offre|tarif|€|fcfa/,
      )
    }
  })

  it('affiche le bloc d’incohérence quand il y en a une', () => {
    const p2 = rapportPour(reponses({ Q1: 3, Q7: 1 })).pages[1]
    expect(p2.incoherences).not.toBeNull()
    expect(p2.incoherences.messages.length).toBeGreaterThan(0)
    expect(p2.incoherences.cloture).toContain('où regarder en priorité')
  })

  it('omet le bloc d’incohérence sur un profil cohérent', () => {
    expect(rapportPour(reponses()).pages[1].incoherences).toBeNull()
  })
})

describe('Page 4 — les forces créent un risque (spec §12.1)', () => {
  it('associe un risque à chaque force établie', () => {
    const p4 = rapportPour(reponses({}, 4)).pages[3]
    expect(p4.titre).toBe('Vos trois forces')
    expect(p4.elements).toHaveLength(3)
    p4.elements.forEach((e) => {
      expect(e.etablie).toBe(true)
      expect(e.acquis.length).toBeGreaterThan(80)
      expect(e.risque.length).toBeGreaterThan(80)
    })
  })

  it('ne présente PAS comme des forces des dimensions sous le seuil de 50', () => {
    // Honnêteté du rapport : sur un profil faible, annoncer « vos trois forces »
    // pour des scores de 25/100 décrédibiliserait l'ensemble de l'analyse.
    const p4 = rapportPour(reponses({}, 1)).pages[3]
    expect(p4.titre).toBe('Vos points les moins fragiles')
    p4.elements.forEach((e) => {
      expect(e.etablie).toBe(false)
      expect(e.acquis).toBeNull()
      expect(e.risque).toBeNull()
      // À la place : un levier, qui est l'information utile.
      expect(e.levier).toBeTruthy()
    })
  })

  it('définit acquis ET risque pour les 15 sous-dimensions', () => {
    const ids = Object.keys(DIMENSIONS_TEXTES)
    expect(ids).toHaveLength(15)
    ids.forEach((id) => {
      expect(DIMENSIONS_TEXTES[id].force.acquis).toBeTruthy()
      expect(DIMENSIONS_TEXTES[id].force.risque).toBeTruthy()
    })
  })
})

describe('Page 5 — les fragilités', () => {
  it('donne description, conséquence et levier pour chacune', () => {
    const p5 = rapportPour(reponses({}, 0)).pages[4]
    expect(p5.elements).toHaveLength(3)
    p5.elements.forEach((e) => {
      expect(e.description).toBeTruthy()
      expect(e.consequence).toBeTruthy()
      expect(e.levier).toBeTruthy()
    })
  })

  it('ne répète pas l’échéance dans le texte — le gabarit la porte déjà', () => {
    // Le rendu préfixe « À 12-24 mois : ». Le texte ne doit pas la redire.
    const doublons = Object.entries(DIMENSIONS_TEXTES).filter(([, d]) =>
      /^À 12-24 mois/i.test(d.fragilite.consequence),
    )
    expect(doublons.map(([id]) => id)).toEqual([])
  })

  it('rédige une conséquence substantielle pour les 15 sous-dimensions', () => {
    Object.values(DIMENSIONS_TEXTES).forEach((d) => {
      expect(d.fragilite.consequence.length).toBeGreaterThan(120)
    })
  })
})

describe('Page 6 — le point critique', () => {
  it('traite une seule fragilité et explique pourquoi celle-là', () => {
    const p6 = rapportPour(reponses({}, 0)).pages[5]
    expect(p6.id).toBeTruthy()
    expect(p6.pourquoi).toBeTruthy()
    expect(p6.pourquoi.length).toBeGreaterThan(100)
  })

  it('définit un texte « pourquoi » pour les 15 sous-dimensions', () => {
    Object.values(DIMENSIONS_TEXTES).forEach((d) => expect(d.critique).toBeTruthy())
  })
})

describe('Page 7 — le scénario de rupture', () => {
  it('est généré sur un profil dépendant', () => {
    const p7 = rapportPour(reponses({ Q13: 3, Q14: 3, Q15: 3, Q16: 3 }, 0)).pages[6]
    expect(p7.type).toBe('scenario')
    expect(p7.paragraphes.length).toBeGreaterThan(1)
  })

  it('se termine par le jour 90 et une mention qui ouvre', () => {
    const p7 = rapportPour(reponses({ Q13: 3, Q14: 3, Q15: 3, Q16: 3 }, 0)).pages[6]
    const dernier = p7.paragraphes.at(-1)
    expect(dernier.jours).toBe('Au jour 90')
    expect(p7.mention).toContain('ne décrit pas une fatalité')
  })

  it('N’UTILISE AUCUN ADJECTIF DRAMATIQUE (spec §13.4)', () => {
    const interdits = /catastroph|effondr|désastr|ruine|drame|tragé/i
    Object.values(SCENARIO_BLOCS).forEach((b) => expect(b.texte).not.toMatch(interdits))
    expect(SCENARIO_CLOTURE.texte).not.toMatch(interdits)
  })

  it('NE PARLE JAMAIS DE FAILLITE — l’entreprise s’appauvrit (spec §13.4)', () => {
    const interdits = /faillite|liquidation|dépôt de bilan|cessation/i
    Object.values(SCENARIO_BLOCS).forEach((b) => expect(b.texte).not.toMatch(interdits))
    expect(SCENARIO_CLOTURE.texte).not.toMatch(interdits)
    expect(SCENARIO_CLOTURE.texte).toContain('existe toujours')
  })

  it('NE FORMULE AUCUN REPROCHE (spec §13.4)', () => {
    const interdits = /vous auriez dû|vous n'avez pas su|votre erreur|à cause de vous/i
    Object.values(SCENARIO_BLOCS).forEach((b) => expect(b.texte).not.toMatch(interdits))
  })
})

describe('⚠️ Protocole de sécurité (spec §14.2)', () => {
  const detresse = reponses({ Q13: 0, Q14: 0, Q15: 0, Q16: 0 })

  it('insère l’encadré en page 2', () => {
    const p2 = rapportPour(detresse).pages[1]
    expect(p2.encadreSecurite).not.toBeNull()
    expect(p2.encadreSecurite.texte).toContain('professionnel de santé')
    expect(p2.encadreSecurite.texte).toContain('54 %')
  })

  it('SUPPRIME la page 7 — le scénario n’est pas généré du tout', () => {
    const r = rapportPour(detresse)
    expect(r.pages).toHaveLength(7)
    expect(r.pages.find((p) => p.type === 'scenario')).toBeUndefined()
    // Aucun texte de scénario ne doit subsister dans le rapport sérialisé.
    expect(JSON.stringify(r)).not.toContain('Ce qui se passerait')
  })

  it('SUPPRIME toute sollicitation commerciale', () => {
    const p8 = rapportPour(detresse).pages.at(-1)
    expect(p8.orientation).toBeNull()
  })

  it('conserve les trois actions gratuites', () => {
    // Le protocole supprime la vente, pas l'aide.
    expect(rapportPour(detresse).pages.at(-1).actions).toHaveLength(3)
  })
})

describe('Page 8 — règle de proportion (spec §12.2)', () => {
  it('propose trois actions réalisables sans le cabinet', () => {
    Object.values(ACTIONS_PAR_ARCHETYPE).forEach((actions) => {
      expect(actions).toHaveLength(3)
      actions.forEach((a) => {
        expect(a.titre).toBeTruthy()
        expect(a.texte.length).toBeGreaterThan(80)
        // Une action gratuite ne renvoie pas au cabinet.
        expect(a.texte.toLowerCase()).not.toMatch(/notre cabinet|nous vous accompagn|contactez-nous/)
      })
    })
  })

  it('définit des actions pour les six archétypes', () => {
    expect(Object.keys(ACTIONS_PAR_ARCHETYPE)).toHaveLength(6)
  })

  it('garde la vente très minoritaire dans le volume total', () => {
    const r = rapportPour(reponses({}, 1), { chiffre_affaires: '1_5Mds', effectif: '50_plus' })
    const total = JSON.stringify(r.pages).length
    const vente = r.pages.at(-1).orientation?.texte?.length ?? 0
    // Sept pages d'analyse pour une demi-page de vente : largement sous 5 %.
    expect(vente / total).toBeLessThan(0.05)
  })
})

describe('Routage commercial (spec §15.1)', () => {
  const durs = { chiffre_affaires: '1_5Mds', effectif: '50_plus' }

  it('donne la priorité absolue au profil 26-45 avec critères durs et événement', () => {
    const o = routerCommercial({
      indice90: 35,
      protocoleSecurite: false,
      profil: { ...durs, evenement_recent: 'depart_associe' },
    })
    expect(o.id).toBe('appel_48h')
    expect(o.priorite).toBe('absolue')
  })

  it('rétrograde le même score sans événement déclaré', () => {
    const o = routerCommercial({
      indice90: 35,
      protocoleSecurite: false,
      profil: { ...durs, evenement_recent: 'aucun' },
    })
    expect(o.id).toBe('diagnostic')
  })

  it('bascule en nurturing si les critères durs ne sont pas remplis', () => {
    const o = routerCommercial({
      indice90: 35,
      protocoleSecurite: false,
      profil: { chiffre_affaires: 'moins_100M', effectif: 'moins_5' },
    })
    expect(o.id).toBe('nurturing')
  })

  it('oriente les scores élevés vers le séminaire, pas vers la vente', () => {
    expect(routerCommercial({ indice90: 90, protocoleSecurite: false, profil: durs }).id).toBe(
      'seminaire',
    )
  })

  it('SUSPEND TOUT quand le protocole de sécurité est actif', () => {
    const o = routerCommercial({
      indice90: 35,
      protocoleSecurite: true,
      profil: { ...durs, evenement_recent: 'depart_associe' },
    })
    expect(o.id).toBe('suspendu')
    expect(o.texte).toBeNull()
  })
})

describe('Benchmark — ne jamais inventer (spec §17.1)', () => {
  it('n’affiche AUCUNE comparaison sous 200 répondants', () => {
    expect(formulerBenchmark({ nb_repondants: 0 })).toBeNull()
    expect(formulerBenchmark({ nb_repondants: 199, indice_median: 38 })).toBeNull()
  })

  it('affiche la médiane à partir de 200 répondants', () => {
    const t = formulerBenchmark({ nb_repondants: 350, indice_median: 38 })
    expect(t).toContain('350')
    expect(t).toContain('38')
  })

  it('n’insère aucun benchmark en page 3 pendant l’amorçage', () => {
    expect(rapportPour(reponses(), {}, { nb_repondants: 12 }).pages[2].benchmark).toBeNull()
  })
})

describe('Signature (spec §16.3)', () => {
  it('est marquée comme provisoire et jamais « L’équipe »', () => {
    const s = rapportPour(reponses()).pages.at(-1).signature
    expect(s.provisoire).toBe(true)
    expect(s.nom.toLowerCase()).not.toContain('équipe')
  })
})
