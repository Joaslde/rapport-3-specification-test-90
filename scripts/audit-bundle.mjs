/*
  Audit du bundle de production.

  Vérifie qu'aucun secret ni élément serveur n'atteint le navigateur.
  Règles S1, S2 et S10 de docs/securite.md.

  Usage : npm run audit:bundle   (après npm run build)

  ⚠️ L'audit affiche le nombre de fichiers réellement inspectés. Sans ce
  compteur, un audit qui n'examine rien afficherait « tout va bien ».
  Leçon L5.
*/
import fs from 'node:fs'
import path from 'node:path'

const DIST = path.resolve(import.meta.dirname, '../dist')

if (!fs.existsSync(DIST)) {
  console.error('  dist/ absent — lancer `npm run build` d’abord.')
  process.exit(1)
}

/** Parcourt récursivement dist/ et retient les fichiers servis au navigateur. */
function fichiers(dossier) {
  return fs.readdirSync(dossier, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dossier, e.name)
    if (e.isDirectory()) return fichiers(p)
    return ['.js', '.css', '.html'].includes(path.extname(e.name)) ? [p] : []
  })
}

/*
  Motifs recherchés.

  Les identifiants doivent être SPÉCIFIQUES à notre code : chercher « RESEND »
  produit un faux positif sur `resendConfirmation` du client Supabase.
  On cherche donc le préfixe réel d'une clé, pas le nom du service.
*/
const MOTIFS = [
  // Barème et moteur de scoring
  { id: 'COEFFICIENTS', libelle: 'coefficients du barème' },
  { id: 'AXES_CONFIG', libelle: 'configuration des axes' },
  { id: 'protocoleSecuriteActif', libelle: 'condition du protocole de sécurité' },
  { id: 'CONTROLES_INCOHERENCE', libelle: 'règles d’incohérence' },
  { id: 'SEUIL_AXE', libelle: 'seuil de qualification des axes' },
  { id: 'calculerIndice90', libelle: 'formule de l’Indice 90' },

  // Contenu rédactionnel du rapport
  { id: 'ARCHETYPES_TEXTES', libelle: 'verdicts d’archétype' },
  { id: 'DIMENSIONS_TEXTES', libelle: 'textes des sous-dimensions' },
  { id: 'SCENARIO_BLOCS', libelle: 'blocs du scénario de rupture' },
  { id: 'genererPDF', libelle: 'générateur PDF' },

  // Routage commercial
  { id: 'routerCommercial', libelle: 'matrice de routage commercial' },
  { id: 'CRITERES_DURS', libelle: 'critères durs d’éligibilité' },

  // Secrets — préfixes réels, pas les noms de service
  { id: 're_', libelle: 'clé API Resend', prefixe: true },
  { id: 'sbp_', libelle: 'token d’accès Supabase', prefixe: true },
  { id: 'SERVICE_ROLE', libelle: 'clé service_role Supabase' },
  { id: 'ADMIN_PASSWORD', libelle: 'mot de passe du back-office' },
  { id: 'HywfAzEEDaCAJnUCIUb8s3GdvN5O_l4W', libelle: 'valeur en clair du mot de passe admin' },
]

const liste = fichiers(DIST)
const contenus = liste.map((f) => ({ nom: path.basename(f), texte: fs.readFileSync(f, 'utf8') }))

console.log(`\n  Fichiers inspectés : ${liste.length}`)
const poids = liste.reduce((s, f) => s + fs.statSync(f).size, 0)
console.log(`  Poids total : ${(poids / 1024).toFixed(1)} Ko (non compressé)\n`)

if (!liste.length) {
  console.error('  Aucun fichier inspecté — audit invalide.')
  process.exit(1)
}

let fuites = 0
for (const m of MOTIFS) {
  // Un préfixe de clé n'est une fuite que suivi de caractères de clé.
  const motif = m.prefixe ? new RegExp(`${m.id}[A-Za-z0-9_-]{12,}`) : null
  const touches = contenus.filter((c) => (motif ? motif.test(c.texte) : c.texte.includes(m.id)))

  if (touches.length) {
    console.log(`  ✗ FUITE : ${m.libelle} (${m.id}) → ${touches.map((t) => t.nom).join(', ')}`)
    fuites += 1
  } else {
    console.log(`  ✓ ${m.libelle}`)
  }
}

console.log('')
if (fuites) {
  console.error(`  ÉCHEC : ${fuites} élément(s) serveur exposé(s) au navigateur.\n`)
  process.exit(1)
}
console.log('  Aucune fuite. Barème, contenu, générateur et secrets restent côté serveur.\n')
