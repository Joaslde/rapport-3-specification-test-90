/*
  TESTS DE GÉNÉRATION PDF

  Vérifient le PDF réellement produit, pas seulement la structure de données.
  Le module PDF importe pdf-lib depuis esm.sh (pour Deno) ; sous Node, on
  réécrit cet import vers le paquet npm local.
*/

import { describe, it, expect, beforeAll } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { calculerResultat } from '../supabase/functions/_shared/scoring.js'
import { assemblerRapport } from '../supabase/functions/_shared/rapport.js'

const RACINE = path.resolve(import.meta.dirname, '..')
const SOURCE = path.join(RACINE, 'supabase/functions/_shared/pdf-rapport.js')

let genererPDF

beforeAll(async () => {
  const tmp = path.join(RACINE, '.pdf-rapport.vitest.mjs')
  const src = fs.readFileSync(SOURCE, 'utf8')
  fs.writeFileSync(tmp, src.replace("from 'https://esm.sh/pdf-lib@1.17.1'", "from 'pdf-lib'"))
  ;({ genererPDF } = await import(pathToFileURL(tmp).href))
  fs.rmSync(tmp, { force: true })
})

const r18 = (o = {}, d = 2) => Array.from({ length: 18 }, (_, i) => o[`Q${i + 1}`] ?? d)

function rapport(rep, profil = {}) {
  return assemblerRapport({
    resultat: calculerResultat(rep),
    identite: { prenom: 'Amadou', entreprise: 'Groupe Diallo SARL', email: 'a@exemple.ci' },
    profil,
    barometre: { nb_repondants: 0 },
  })
}

/**
 * Extrait le texte lisible d'un PDF.
 *
 * Deux pièges, tous deux rencontrés en écrivant ces tests :
 *   1. les flux de contenu sont compressés en Flate — il faut les décompresser ;
 *   2. pdf-lib écrit les chaînes en HEXADÉCIMAL (`<4C45> Tj`), pas en littéral
 *      parenthésé. Un extracteur qui ne cherche que `(...) Tj` ne trouve RIEN,
 *      et tous les tests « le PDF ne contient pas X » passent alors pour la
 *      mauvaise raison. D'où le garde-fou `verifierExtracteur`.
 */
async function texteDuPdf(octets) {
  const { inflateSync } = await import('node:zlib')
  const buf = Buffer.from(octets)
  const latin = buf.toString('latin1')

  let flux = ''
  const re = /stream\r?\n/g
  let m
  while ((m = re.exec(latin)) !== null) {
    const debut = m.index + m[0].length
    const fin = buf.indexOf('endstream', debut, 'latin1')
    if (fin < 0) continue
    try {
      flux += inflateSync(buf.subarray(debut, fin)).toString('latin1')
    } catch {
      flux += buf.subarray(debut, fin).toString('latin1')
    }
  }

  let texte = ''

  // Forme hexadécimale — celle utilisée par pdf-lib.
  for (const hex of flux.matchAll(/<([0-9A-Fa-f\s]+)>\s*Tj/g)) {
    const octetsHex = hex[1].replace(/\s+/g, '')
    let mot = ''
    for (let i = 0; i + 1 < octetsHex.length; i += 2) {
      mot += String.fromCharCode(parseInt(octetsHex.slice(i, i + 2), 16))
    }
    texte += mot
  }

  // Forme littérale, au cas où la librairie changerait d'encodage.
  for (const lit of flux.matchAll(/\(((?:[^()\\]|\\.)*)\)\s*Tj/g)) {
    texte +=
      lit[1]
        .replace(/\\([0-7]{1,3})/g, (_, o) => String.fromCharCode(parseInt(o, 8)))
        .replace(/\\([()\\])/g, '$1') + ' '
  }

  return texte
}

/** Vérifie que l'extracteur fonctionne — sinon les tests négatifs sont vides de sens. */
async function verifierExtracteur(octets) {
  const t = await texteDuPdf(octets)
  if (t.length < 200) throw new Error(`Extraction PDF défaillante : ${t.length} caractères`)
  return t
}

describe('Génération du PDF', () => {
  it('produit un PDF valide', async () => {
    const octets = await genererPDF(rapport(r18()))
    expect(octets.length).toBeGreaterThan(5000)
    expect(Buffer.from(octets.subarray(0, 5)).toString()).toBe('%PDF-')
  })

  it('reste léger — contrainte réseau de la zone', async () => {
    const octets = await genererPDF(rapport(r18({}, 1)))
    // Cible : très en dessous des 400 Ko de la contrainte de page.
    expect(octets.length).toBeLessThan(120_000)
  })

  it('génère 8 pages sur un profil normal', async () => {
    /*
      Entreprise très dépendante (le scénario de rupture se déclenche donc),
      mais dirigeant qui va bien — sinon le protocole de sécurité supprime
      la page 7 et le rapport n'en compte plus que 7 (audit §8.3).
    */
    const r = rapport(r18({ Q1: 1, Q2: 0, Q5: 1, Q13: 3, Q14: 3, Q15: 3, Q16: 3 }, 1))
    expect(r.meta.protocoleSecurite).toBe(false)
    expect(r.pages).toHaveLength(8)
    const octets = await genererPDF(r)
    expect(octets.length).toBeGreaterThan(5000)
  })
})

describe('L’extracteur de texte fonctionne', () => {
  /*
    Sans ce contrôle, tous les tests « le PDF ne contient pas X » passeraient
    même si l'extraction renvoyait une chaîne vide. Leçon L3 / L5.
  */
  it('lit réellement le texte du PDF', async () => {
    const texte = await verifierExtracteur(await genererPDF(rapport(r18())))
    expect(texte).toMatch(/Indice 90|INDICE 90/)
    expect(texte).toMatch(/Amadou/)
  })

  it('décode les caractères accentués échappés en octal', async () => {
    const texte = await verifierExtracteur(await genererPDF(rapport(r18())))
    // « névralgique », « défaillance », « archétype »… doivent ressortir lisibles.
    expect(texte).toMatch(/é/)
  })
})

describe('⚠️ Protocole de sécurité dans le PDF (spec §14.2)', () => {
  const detresse = r18({ Q13: 0, Q14: 0, Q15: 0, Q16: 0 })

  it('produit 7 pages, pas 8', () => {
    expect(rapport(detresse).pages).toHaveLength(7)
  })

  it('n’écrit AUCUN texte du scénario de rupture dans le fichier', async () => {
    const texte = await verifierExtracteur(await genererPDF(rapport(detresse)))
    // Le contenu ne doit pas être seulement masqué : il ne doit pas exister.
    expect(texte).not.toContain('Ce qui se passerait')
    expect(texte).not.toContain('Au jour 90')
    expect(texte).not.toContain('Jours 1')
  })

  it('n’écrit AUCUNE sollicitation commerciale dans le fichier', async () => {
    const texte = await verifierExtracteur(await genererPDF(rapport(detresse, {
      chiffre_affaires: '1_5Mds',
      effectif: '50_plus',
      evenement_recent: 'sante',
    })))
    expect(texte).not.toMatch(/membre du cabinet/i)
    expect(texte).not.toMatch(/quarante-huit heures/i)
  })

  it('inscrit la recommandation médicale', async () => {
    const texte = await verifierExtracteur(await genererPDF(rapport(detresse)))
    expect(texte).toMatch(/professionnel de sant/i)
  })

  it('renumérote les pages sans saut', () => {
    const nums = rapport(detresse).pages.map((p) => p.numero)
    expect(nums).toEqual([1, 2, 3, 4, 5, 6, 7])
  })
})

describe('Omission du scénario sur profil solide', () => {
  it('omet la page plutôt que d’écrire « rien ne se passerait »', () => {
    // Sur un profil au maximum, aucun des 9 déclencheurs n'est rempli.
    const r = rapport(r18({}, 4))
    expect(r.meta.scenarioOmis).toBe(true)
    expect(r.pages.find((p) => p.type === 'scenario')).toBeUndefined()
    expect(r.pages.map((p) => p.numero)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('conserve les 8 pages quand le scénario a de la matière', () => {
    const r = rapport(r18({ Q13: 3, Q14: 3, Q15: 3, Q16: 3 }, 0))
    expect(r.meta.scenarioOmis).toBe(false)
    expect(r.pages).toHaveLength(8)
  })
})

describe('Contenu du PDF', () => {
  it('inscrit le nombre de jours, pas seulement le score', async () => {
    const r = rapport(r18({}, 1))
    const texte = await verifierExtracteur(await genererPDF(r))
    expect(texte).toContain('sans vous')
    expect(texte).toContain(String(r.pages[0].jours))
  })

  it('affiche le nom et la fonction réels du signataire, jamais « provisoire »', async () => {
    // Retour oral du manager du 6 août 2026 : signature = désigner et
    // authentifier la personne, pas une image manuscrite. Point clos.
    const texte = await verifierExtracteur(await genererPDF(rapport(r18())))
    expect(texte).toContain('Charbel ZOHOUN')
    expect(texte).not.toMatch(/provisoire/i)
  })

  it('n’insère aucun benchmark pendant l’amorçage', async () => {
    const texte = await verifierExtracteur(await genererPDF(rapport(r18())))
    expect(texte).not.toMatch(/dirigeants évalués/i)
    expect(texte).not.toMatch(/médian s’établit/i)
  })
})
