// @ts-nocheck — exécuté par Deno sur Supabase.
/*
  EDGE FUNCTION — génération du rapport PDF de 8 pages

  Reçoit un token de rapport, relit le résultat déjà calculé, assemble les
  8 pages et renvoie le PDF.

  Le contenu rédactionnel et le barème ne quittent jamais ce périmètre
  (règles S1 et S10 de docs/securite.md).
*/

import { createClient } from 'jsr:@supabase/supabase-js@2'
import { assemblerRapport } from './rapport.js'
import { genererPDF } from './pdf-rapport.js'

const ENTETES_CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function erreur(message: string, statut: number) {
  return new Response(JSON.stringify({ erreur: message }), {
    status: statut,
    headers: { ...ENTETES_CORS, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: ENTETES_CORS })
  if (req.method !== 'POST') return erreur('Méthode non autorisée', 405)

  try {
    const { token } = await req.json()
    if (typeof token !== 'string' || token.length < 32) {
      return erreur('Token invalide', 400)
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: res, error } = await admin
      .from('resultats')
      .select('*, sessions(prenom, entreprise, email, chiffre_affaires, effectif, evenement_recent)')
      .eq('token_rapport', token)
      .gt('token_expire_le', new Date().toISOString())
      .maybeSingle()

    if (error || !res) return erreur('Rapport introuvable', 404)

    const { data: barometre } = await admin
      .from('barometre_config')
      .select('nb_repondants, indice_median')
      .eq('id', 1)
      .single()

    /*
      Le résultat stocké est reconstitué au format attendu par l'assembleur.
      On ne recalcule PAS : le score fait foi tel qu'il a été établi, et le
      protocole de sécurité est immuable en base (trigger).
    */
    const resultat = {
      indice90: res.indice90,
      jours: res.jours,
      axes: { A1: res.score_a1, A2: res.score_a2, A3: res.score_a3 },
      sousDimensions: res.sous_dimensions,
      forces: res.forces,
      fragilites: res.fragilites,
      pointCritique: res.point_critique,
      niveau: { id: res.niveau_id },
      archetype: { id: res.archetype_id, provisoire: res.archetype_provisoire },
      incoherences: res.incoherences ?? [],
      protocoleSecurite: res.protocole_securite,
      blocsScenario: res.blocs_scenario ?? [],
    }

    const s = res.sessions
    const rapport = assemblerRapport({
      resultat,
      identite: { prenom: s.prenom, entreprise: s.entreprise, email: s.email },
      profil: {
        chiffre_affaires: s.chiffre_affaires,
        effectif: s.effectif,
        evenement_recent: s.evenement_recent,
      },
      barometre,
    })

    const pdf = await genererPDF(rapport)

    return new Response(pdf, {
      headers: {
        ...ENTETES_CORS,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${rapport.meta.nomFichier}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch {
    // Aucun détail renvoyé : pas de fuite d'information (securite.md §5).
    return erreur('Erreur de génération', 500)
  }
})
