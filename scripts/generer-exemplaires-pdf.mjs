/*
  Génère un exemplaire de PDF pour chaque archétype (les 6 officiels de la spec
  §10.2, plus les 2 combinaisons provisoires signalées au manager — voir
  docs/a-remonter-au-manager.md, section O2).

  Chaque axe (A1, A2, A3) est forcé à "faible" (toutes les réponses à l'index 0)
  ou "fort" (toutes les réponses à l'index 4) pour obtenir sans ambiguïté la
  combinaison voulue par rapport au seuil de qualification (50).

  Usage : node scripts/generer-exemplaires-pdf.mjs
  Sortie : exemplaires-pdf/<numero>-<id-archetype>[-provisoire].pdf
*/
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { calculerResultat } from '../supabase/functions/_shared/scoring.js'
import { assemblerRapport } from '../supabase/functions/_shared/rapport.js'
import { determinerArchetype } from '../supabase/functions/_shared/scoring.js'

const RACINE = path.resolve(import.meta.dirname, '..')
const SORTIE = path.join(RACINE, 'exemplaires-pdf')

// pdf-rapport.js importe pdf-lib depuis esm.sh (pour Deno) — sous Node, on
// réécrit cet import vers le paquet npm local, comme dans tests/pdf.spec.js.
async function chargerGenererPDF() {
  const source = path.join(RACINE, 'supabase/functions/_shared/pdf-rapport.js')
  const tmp = path.join(RACINE, '.pdf-rapport.script.mjs')
  const src = fs.readFileSync(source, 'utf8')
  fs.writeFileSync(tmp, src.replace("from 'https://esm.sh/pdf-lib@1.17.1'", "from 'pdf-lib'"))
  const { genererPDF } = await import(pathToFileURL(tmp).href)
  fs.rmSync(tmp, { force: true })
  return genererPDF
}

// A1 = Q1..Q7, A2 = Q8..Q13, A3 = Q14..Q18 (supabase/functions/_shared/bareme.js)
const QUESTIONS_PAR_AXE = {
  A1: [1, 2, 3, 4, 5, 6, 7],
  A2: [8, 9, 10, 11, 12, 13],
  A3: [14, 15, 16, 17, 18],
}

/** Fabrique les 18 index de réponse pour une combinaison { A1, A2, A3 } de 'faible' | 'fort'. */
function fabriquerReponses(combinaison) {
  const rep = Array(18).fill(2)
  for (const [axe, numeros] of Object.entries(QUESTIONS_PAR_AXE)) {
    const index = combinaison[axe] === 'fort' ? 4 : 0
    for (const n of numeros) rep[n - 1] = index
  }
  return rep
}

const COMBINAISONS = [
  { A1: 'faible', A2: 'faible', A3: 'faible' },
  { A1: 'faible', A2: 'faible', A3: 'fort' },
  { A1: 'faible', A2: 'fort', A3: 'faible' },
  { A1: 'fort', A2: 'faible', A3: 'faible' },
  { A1: 'fort', A2: 'fort', A3: 'faible' },
  { A1: 'fort', A2: 'fort', A3: 'fort' },
  { A1: 'faible', A2: 'fort', A3: 'fort' }, // provisoire — non couverte par la spec
  { A1: 'fort', A2: 'faible', A3: 'fort' }, // provisoire — non couverte par la spec
]

async function main() {
  const genererPDF = await chargerGenererPDF()
  fs.mkdirSync(SORTIE, { recursive: true })

  console.log(`Génération de ${COMBINAISONS.length} exemplaires dans ${SORTIE}\n`)

  for (const combinaison of COMBINAISONS) {
    const reponses = fabriquerReponses(combinaison)
    const resultat = calculerResultat(reponses)
    const archetype = determinerArchetype(resultat.axes)

    const rapport = assemblerRapport({
      resultat,
      identite: {
        prenom: 'Exemple',
        entreprise: 'Entreprise Exemple SARL',
        email: 'exemple@cabinet-test.local',
      },
      profil: {},
      barometre: { nb_repondants: 0 },
    })

    const pdf = await genererPDF(rapport)

    const suffixe = archetype.provisoire ? '-provisoire' : ''
    const nomFichier = `${String(archetype.numero).padStart(2, '0')}-${archetype.id}${suffixe}.pdf`
    fs.writeFileSync(path.join(SORTIE, nomFichier), pdf)

    console.log(
      `  ${nomFichier}  —  "${archetype.nom}"` +
        (archetype.provisoire ? '  [PROVISOIRE — voir docs/a-remonter-au-manager.md §O2]' : '') +
        `  (Indice90=${resultat.indice90}, A1=${resultat.axes.A1}, A2=${resultat.axes.A2}, A3=${resultat.axes.A3})`,
    )
  }

  console.log(`\nTerminé. ${COMBINAISONS.length} PDF écrits dans exemplaires-pdf/`)
}

main()
