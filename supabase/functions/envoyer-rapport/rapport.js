// ⚠️ FICHIER GÉNÉRÉ — ne pas modifier ici.
// Source : supabase/functions/_shared/rapport.js
// Régénérer avec : npm run sync:fonctions
/*
  ASSEMBLAGE DU RAPPORT DE 8 PAGES
  Source : rapport-3-specification-test-90-jours.md §12

  Prend le résultat brut du moteur de scoring et produit la structure complète
  du rapport, prête à être rendue en PDF ou en HTML.

  Règle de proportion NON NÉGOCIABLE (spec §12.2) :
    sept pages d'analyse, une demi-page de proposition commerciale.
*/

import { NIVEAUX_TEXTES, ARCHETYPES_TEXTES } from './contenu-verdicts.js'
import { DIMENSIONS_TEXTES } from './contenu-dimensions.js'
import { assemblerScenario } from './contenu-scenario.js'
import {
  SUITE_TITRE,
  SUITE_INTRODUCTION,
  ACTIONS_PAR_ARCHETYPE,
  ENCADRE_SECURITE,
  BLOC_INCOHERENCE,
  SIGNATURE,
  routerCommercial,
} from './contenu-suite.js'

const AXES_LIBELLES = {
  A1: { titre: "L'entreprise sans vous", sousTitre: 'dépendance opérationnelle', poids: '40 %' },
  A2: { titre: 'Ceux qui vous entourent', sousTitre: "solidité de l'entourage", poids: '35 %' },
  A3: { titre: 'Vous', sousTitre: 'état du dirigeant', poids: '25 %' },
}

/**
 * Comportement du benchmark selon la phase (spec §17.1).
 * RÈGLE ABSOLUE : ne jamais inventer de benchmark. Sous 200 répondants,
 * le rapport ne présente AUCUNE comparaison.
 */
export function formulerBenchmark(barometre) {
  const n = barometre?.nb_repondants ?? 0
  if (n < 200) return null
  if (n < 800) {
    return `Sur les ${n} premiers dirigeants évalués, l'Indice 90 médian s'établit à ${barometre.indice_median}.`
  }
  return `Sur ${n} dirigeants évalués, l'Indice 90 médian s'établit à ${barometre.indice_median}.`
}

/** Nom de fichier du rapport : Indice90_[Nom]_[Date].pdf (spec §12). */
export function nomFichierRapport(prenom, date = new Date()) {
  const nom = String(prenom ?? 'rapport')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 30)
  const j = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `Indice90_${nom || 'rapport'}_${j}-${m}-${date.getFullYear()}.pdf`
}

/**
 * Assemble les 8 pages.
 * @param {object} resultat  sortie de calculerResultat()
 * @param {object} identite  { prenom, entreprise, email }
 * @param {object} profil    réponses de la Partie 2 (peut être vide)
 * @param {object} barometre { nb_repondants, indice_median }
 */
export function assemblerRapport({ resultat, identite, profil, barometre }) {
  const r = resultat
  const protocole = r.protocoleSecurite

  const dim = (d) => ({
    id: d.id,
    score: Math.round(d.score),
    libelle: DIMENSIONS_TEXTES[d.id]?.libelle ?? d.id,
  })

  // ---- Page 1 — Couverture -------------------------------------------
  // « Indice 90 en très grand. Nombre de jours en dessous. Une seule phrase.
  //   Rien d'autre. Aucune image décorative. »
  const page1 = {
    numero: 1,
    type: 'couverture',
    prenom: identite.prenom,
    entreprise: identite.entreprise,
    date: new Date().toISOString(),
    indice90: r.indice90,
    jours: r.jours,
    phrase: `Votre entreprise fonctionne environ ${r.jours} ${r.jours > 1 ? 'jours' : 'jour'} sans vous.`,
  }

  // ---- Page 2 — Le verdict -------------------------------------------
  // Le niveau, l'archétype, 150 mots SANS CONSEIL NI VENTE.
  const niveau = NIVEAUX_TEXTES[r.niveau.id]
  const archetype = ARCHETYPES_TEXTES[r.archetype.id]

  const page2 = {
    numero: 2,
    type: 'verdict',
    // L'encadré de sécurité passe AVANT tout le reste (spec §14.2).
    encadreSecurite: protocole ? ENCADRE_SECURITE : null,
    niveau: { nom: niveau.nom, formulation: niveau.formulation },
    archetype: {
      nom: archetype.nom,
      diagnostic: archetype.diagnostic,
      provisoire: Boolean(r.archetype.provisoire),
    },
    verdict: archetype.verdict,
    // Le bloc d'incohérence : « le plus fort effet de crédibilité du rapport ».
    incoherences: r.incoherences.length
      ? {
          titre: BLOC_INCOHERENCE.titre,
          introduction: BLOC_INCOHERENCE.introduction,
          messages: r.incoherences.map((i) => i.message),
          cloture: BLOC_INCOHERENCE.cloture,
        }
      : null,
  }

  // ---- Page 3 — Les trois axes ---------------------------------------
  // Trois jauges + un radar. Rien de plus (spec §16.3).
  const page3 = {
    numero: 3,
    type: 'axes',
    axes: ['A1', 'A2', 'A3'].map((id) => ({
      id,
      ...AXES_LIBELLES[id],
      score: r.axes[id],
      qualification: r.axes[id] >= 50 ? 'fort' : 'faible',
      lectures: Object.entries(DIMENSIONS_TEXTES)
        .filter(([sd]) => sd.startsWith(id === 'A1' ? '1.' : id === 'A2' ? '2.' : '3.'))
        .map(([sd, d]) => ({ id: sd, libelle: d.libelle, lecture: d.lecture })),
    })),
    benchmark: formulerBenchmark(barometre),
  }

  // ---- Page 4 — Vos trois forces -------------------------------------
  // Pour chacune : ce que cela a permis + LE RISQUE QUE CETTE FORCE CRÉE.
  //
  // Honnêteté du rapport : sur un profil globalement faible, les trois
  // sous-dimensions les mieux notées ne sont pas des forces au sens absolu.
  // Les présenter comme telles décrédibiliserait l'analyse. On qualifie donc
  // la page selon le niveau réel, et le texte « acquis » n'est affiché que
  // lorsqu'il est mérité (seuil de qualification de la spec §10.2 : 50).
  const forcesReelles = r.forces.filter((f) => f.score >= 50)
  const toutesFaibles = forcesReelles.length === 0

  const page4 = {
    numero: 4,
    type: 'forces',
    titre: toutesFaibles ? 'Vos points les moins fragiles' : 'Vos trois forces',
    introduction: toutesFaibles
      ? 'Aucune de vos sous-dimensions n’atteint aujourd’hui le seuil de solidité. Voici les ' +
        'trois moins fragiles : ce sont elles qui offrent les appuis les plus immédiats.'
      : 'Toute force portée à l’excès devient une dépendance. Pour chacune, ce qu’elle vous a ' +
        'permis de construire — et le risque qu’elle crée.',
    elements: r.forces.map((f) => {
      const d = DIMENSIONS_TEXTES[f.id]
      const etablie = f.score >= 50
      return {
        ...dim(f),
        etablie,
        acquis: etablie ? d.force.acquis : null,
        // Sur une dimension non établie, annoncer le risque d'excès n'aurait
        // aucun sens : on renvoie au levier, qui est l'information utile.
        risque: etablie ? d.force.risque : null,
        levier: etablie ? null : d.fragilite.levier,
      }
    }),
  }

  // ---- Page 5 — Vos trois fragilités ----------------------------------
  const page5 = {
    numero: 5,
    type: 'fragilites',
    titre: 'Vos trois fragilités',
    elements: r.fragilites.map((f) => {
      const d = DIMENSIONS_TEXTES[f.id]
      return {
        ...dim(f),
        description: d.fragilite.description,
        consequence: d.fragilite.consequence,
        levier: d.fragilite.levier,
      }
    }),
  }

  // ---- Page 6 — Le point critique -------------------------------------
  // Une seule page, une seule fragilité, avec le pourquoi.
  const pc = DIMENSIONS_TEXTES[r.pointCritique.id]
  const page6 = {
    numero: 6,
    type: 'point_critique',
    titre: 'Le point critique',
    ...dim(r.pointCritique),
    pourquoi: pc.critique,
    description: pc.fragilite.description,
    levier: pc.fragilite.levier,
  }

  /*
    ---- Page 7 — Le scénario de rupture ----------------------------------
    Deux cas d'omission, pour deux raisons différentes :

    1. Protocole de sécurité actif (spec §14.2) : le contenu n'est pas
       approprié pour une personne en épuisement. Non pas masqué —
       non généré, pour qu'aucun texte ne soit récupérable.

    2. Aucun bloc déclenché : sur un profil solide, aucune des neuf
       conditions de la matrice §13.2 n'est remplie. Il n'y a rien à
       raconter, et une page « rien ne se passerait » affaiblirait
       l'instrument. On l'omet plutôt que de la remplir artificiellement.
  */
  const scenario = protocole ? null : assemblerScenario(r.blocsScenario)
  const page7 = scenario ? { numero: 7, type: 'scenario', ...scenario } : null

  // ---- Page 8 — La suite logique --------------------------------------
  // Trois actions gratuites, puis l'orientation EN BAS DE PAGE seulement.
  const orientation = routerCommercial({
    indice90: r.indice90,
    protocoleSecurite: protocole,
    profil,
  })

  const page8 = {
    numero: 8,
    type: 'suite',
    titre: SUITE_TITRE,
    introduction: SUITE_INTRODUCTION,
    actions: ACTIONS_PAR_ARCHETYPE[r.archetype.id] ?? ACTIONS_PAR_ARCHETYPE.convergence,
    // Aucune sollicitation si le protocole est actif.
    orientation: orientation.texte ? { texte: orientation.texte } : null,
    signature: SIGNATURE,
  }

  // Renumérotation : si la page 7 est omise, la suite ne doit pas sauter un numéro.
  const pages = [page1, page2, page3, page4, page5, page6, page7, page8]
    .filter(Boolean)
    .map((p, i) => ({ ...p, numero: i + 1 }))

  return {
    meta: {
      nomFichier: nomFichierRapport(identite.prenom),
      protocoleSecurite: protocole,
      scenarioOmis: !scenario,
      archetypeProvisoire: Boolean(r.archetype.provisoire),
      orientationId: orientation.id,
      prioriteCommerciale: orientation.priorite,
      nbPages: pages.length,
    },
    pages,
  }
}
