/*
  Imprime tout le contenu rédactionnel du rapport, en clair, pour relecture
  par le manager sans avoir besoin d'ouvrir le code.

  Usage : npm run lire:contenu > relecture.txt
  Puis ouvrir relecture.txt dans n'importe quel éditeur.
*/
import { NIVEAUX_TEXTES, ARCHETYPES_TEXTES } from '../supabase/functions/_shared/contenu-verdicts.js'
import { DIMENSIONS_TEXTES } from '../supabase/functions/_shared/contenu-dimensions.js'
import {
  SCENARIO_TITRE,
  SCENARIO_INTRODUCTION,
  SCENARIO_BLOCS,
  SCENARIO_CLOTURE,
} from '../supabase/functions/_shared/contenu-scenario.js'
import { ACTIONS_PAR_ARCHETYPE, ENCADRE_SECURITE } from '../supabase/functions/_shared/contenu-suite.js'

const trait = () => console.log('─'.repeat(78))
const titre = (t) => {
  console.log('\n' + '█'.repeat(78))
  console.log('  ' + t.toUpperCase())
  console.log('█'.repeat(78))
}

titre('1. LES CINQ NIVEAUX (repris mot pour mot de la spec §10.1 — non rédigés)')
for (const [id, n] of Object.entries(NIVEAUX_TEXTES)) {
  trait()
  console.log(`${n.nom}  [${id}]`)
  console.log(n.formulation)
}

titre('2. LES SIX VERDICTS D’ARCHÉTYPE — rédigés, à valider')
for (const [id, a] of Object.entries(ARCHETYPES_TEXTES)) {
  trait()
  console.log(`${a.nom}  [${id}]`)
  console.log(`\nPhrase-diagnostic (de la spec §10.2) : ${a.diagnostic}`)
  console.log(`\nVerdict rédigé (page 2 du rapport) :\n${a.verdict}`)
}

titre('3. LES QUINZE SOUS-DIMENSIONS — rédigées, à valider')
for (const [id, d] of Object.entries(DIMENSIONS_TEXTES)) {
  trait()
  console.log(`${id} — ${d.libelle}`)
  console.log(`\nLecture (page 3) : ${d.lecture}`)
  console.log(`\nSi c'est une force (page 4) :`)
  console.log(`  Acquis : ${d.force.acquis}`)
  console.log(`  Risque : ${d.force.risque}`)
  console.log(`\nSi c'est une fragilité (page 5) :`)
  console.log(`  Description : ${d.fragilite.description}`)
  console.log(`  Conséquence à 12-24 mois : ${d.fragilite.consequence}`)
  console.log(`  Premier levier : ${d.fragilite.levier}`)
  console.log(`\nSi c'est le point critique (page 6) : ${d.critique}`)
}

titre('4. LE SCÉNARIO DE RUPTURE — rédigé, à valider')
console.log(`\nTitre : ${SCENARIO_TITRE}`)
console.log(`Introduction : ${SCENARIO_INTRODUCTION}`)
for (const [id, b] of Object.entries(SCENARIO_BLOCS)) {
  trait()
  console.log(`[${id}] ${b.jours}`)
  console.log(b.texte)
}
trait()
console.log(`${SCENARIO_CLOTURE.jours}`)
console.log(SCENARIO_CLOTURE.texte)

titre('5. LES DIX-HUIT ACTIONS DE LA PAGE 8 — rédigées, à valider')
for (const [archetype, actions] of Object.entries(ACTIONS_PAR_ARCHETYPE)) {
  console.log(`\n--- Pour l'archétype : ${archetype} ---`)
  actions.forEach((a, i) => {
    console.log(`\n  ${i + 1}. ${a.titre}`)
    console.log(`     ${a.texte}`)
  })
}

titre('6. ENCADRÉ DU PROTOCOLE DE SÉCURITÉ (repris mot pour mot de la spec §14.2 — non rédigé)')
console.log(`\n${ENCADRE_SECURITE.titre}`)
console.log(ENCADRE_SECURITE.texte)

console.log('\n')
