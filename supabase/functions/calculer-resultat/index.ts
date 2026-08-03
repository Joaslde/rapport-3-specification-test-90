// @ts-nocheck — exécuté par Deno sur Supabase, pas par le typecheck du projet Vue.
/*
  EDGE FUNCTION — calcul de l'Indice 90

  Le front envoie l'identifiant de session. Le serveur relit les réponses,
  applique le barème (qui ne quitte jamais ce périmètre), calcule et persiste.

  Règle S1 de docs/securite.md : le scoring n'est JAMAIS calculé côté client.
*/

import { createClient } from 'jsr:@supabase/supabase-js@2'
// Modules copiés depuis _shared/ par `npm run sync:fonctions` :
// le déploiement Supabase n'embarque que le dossier de la fonction.
import { calculerResultat } from './scoring.js'

const ENTETES_CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function reponse(corps: unknown, statut = 200) {
  return new Response(JSON.stringify(corps), {
    status: statut,
    headers: { ...ENTETES_CORS, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: ENTETES_CORS })
  if (req.method !== 'POST') return reponse({ erreur: 'Méthode non autorisée' }, 405)

  try {
    const { session_id } = await req.json()

    if (typeof session_id !== 'string' || !/^[0-9a-f-]{36}$/i.test(session_id)) {
      return reponse({ erreur: 'Session invalide' }, 400)
    }

    // service_role : contourne RLS. C'est le seul endroit qui lit les réponses.
    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: session, error: err } = await admin
      .from('sessions')
      .select('id, reponses, prenom, entreprise, demarre_le')
      .eq('id', session_id)
      .single()

    if (err || !session) return reponse({ erreur: 'Session introuvable' }, 404)

    const reponses = session.reponses
    if (!Array.isArray(reponses) || reponses.length !== 18) {
      return reponse({ erreur: 'Questionnaire incomplet' }, 400)
    }

    /*
      Contrôle temporel anti-bot (docs/securite.md §6.2) : un humain ne peut pas
      lire 18 énoncés en moins de 45 secondes. On marque sans bloquer — la donnée
      est conservée mais exclue du Baromètre.
    */
    const duree = (Date.now() - new Date(session.demarre_le).getTime()) / 1000
    if (duree < 45) {
      await admin.from('sessions').update({ qualite: 'suspecte' }).eq('id', session_id)
    }

    // Le calcul. Barème et formules restent dans _shared/, jamais exposés.
    const r = calculerResultat(reponses)

    // Idempotence : un rappel ne recrée pas un résultat.
    const { data: existant } = await admin
      .from('resultats')
      .select('token_rapport')
      .eq('session_id', session_id)
      .maybeSingle()

    if (existant) {
      return reponse({
        indice90: r.indice90,
        jours: r.jours,
        axes: r.axes,
        niveau: r.niveau,
        token: existant.token_rapport,
      })
    }

    const { data: cree, error: errIns } = await admin
      .from('resultats')
      .insert({
        session_id,
        indice90: r.indice90,
        jours: r.jours,
        score_a1: r.axes.A1,
        score_a2: r.axes.A2,
        score_a3: r.axes.A3,
        niveau_id: r.niveau.id,
        archetype_id: r.archetype.id,
        archetype_provisoire: Boolean(r.archetype.provisoire),
        sous_dimensions: r.sousDimensions,
        forces: r.forces,
        fragilites: r.fragilites,
        point_critique: r.pointCritique,
        incoherences: r.incoherences,
        blocs_scenario: r.blocsScenario,
        protocole_securite: r.protocoleSecurite,
        // Le token est généré par le trigger côté base, jamais par le client.
        token_rapport: crypto.randomUUID() + crypto.randomUUID(),
      })
      .select('token_rapport')
      .single()

    if (errIns) return reponse({ erreur: 'Enregistrement impossible' }, 500)

    await admin
      .from('sessions')
      .update({ etape: 'termine', termine_le: new Date().toISOString() })
      .eq('id', session_id)

    /*
      Ce que reçoit le navigateur : le score, les jours, le niveau.
      PAS l'archétype détaillé, PAS les incohérences, PAS le scénario —
      ces éléments appartiennent au rapport, pas à l'écran.
    */
    return reponse({
      indice90: r.indice90,
      jours: r.jours,
      axes: r.axes,
      niveau: r.niveau,
      token: cree.token_rapport,
    })
  } catch {
    // Aucun détail d'erreur renvoyé : pas de fuite d'information (securite.md §5).
    return reponse({ erreur: 'Erreur de traitement' }, 500)
  }
})
