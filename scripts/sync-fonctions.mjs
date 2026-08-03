/*
  Synchronise les modules partagés dans chaque Edge Function.

  Pourquoi : le déploiement Supabase n'embarque que le dossier de la fonction.
  Les fichiers de `_shared/` doivent donc y être copiés avant chaque déploiement.

  ⚠️ `_shared/` est la SOURCE DE VÉRITÉ. Les copies sont générées — ne jamais
  les modifier à la main, elles seront écrasées.

  Usage : npm run sync:fonctions
*/
import fs from 'node:fs'
import path from 'node:path'

const RACINE = path.resolve(import.meta.dirname, '..')
const SHARED = path.join(RACINE, 'supabase/functions/_shared')

/** Modules requis par chaque fonction. */
const FONCTIONS = {
  'calculer-resultat': ['bareme.js', 'scoring.js'],
  'generer-rapport': [
    'bareme.js',
    'scoring.js',
    'contenu-verdicts.js',
    'contenu-dimensions.js',
    'contenu-scenario.js',
    'contenu-suite.js',
    'rapport.js',
    'pdf-rapport.js',
  ],
  'envoyer-rapport': [
    'bareme.js',
    'scoring.js',
    'contenu-verdicts.js',
    'contenu-dimensions.js',
    'contenu-scenario.js',
    'contenu-suite.js',
    'rapport.js',
    'pdf-rapport.js',
  ],
}

const ENTETE =
  '// ⚠️ FICHIER GÉNÉRÉ — ne pas modifier ici.\n' +
  '// Source : supabase/functions/_shared/%s\n' +
  '// Régénérer avec : npm run sync:fonctions\n'

let total = 0
for (const [fonction, modules] of Object.entries(FONCTIONS)) {
  const dest = path.join(RACINE, 'supabase/functions', fonction)
  if (!fs.existsSync(dest)) {
    console.log(`  ignorée (dossier absent) : ${fonction}`)
    continue
  }
  for (const m of modules) {
    const source = fs.readFileSync(path.join(SHARED, m), 'utf8')
    fs.writeFileSync(path.join(dest, m), ENTETE.replace('%s', m) + source)
    total += 1
  }
  console.log(`  ${fonction} : ${modules.length} modules`)
}
console.log(`\n  ${total} fichiers synchronisés depuis _shared/`)
