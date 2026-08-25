// @ts-nocheck — exécuté par Deno sur Supabase.
/*
  EDGE FUNCTION — back-office : liste des tests passés et rapports envoyés

  Protégée par un mot de passe unique (secret ADMIN_PASSWORD), pas par
  Supabase Auth — décision utilisateur du 4 août 2026 : accès simple pour
  une v1 interne (toi + le manager), pas de gestion de comptes multiples.

  ⚠️ Cette fonction est le SEUL moyen de lire les tables sensibles depuis
  l'extérieur : RLS bloque tout accès direct via la clé publique (Phase 5).
  Le mot de passe est vérifié ici, côté serveur, jamais côté client.

  Deux actions, données dans le corps de la requête :
    { "mot_de_passe": "...", "action": "liste" }                  -> tableau récapitulatif
    { "mot_de_passe": "...", "action": "detail", "id": "..." }     -> un résultat complet
    { "mot_de_passe": "...", "action": "vigie" }                   -> liste d'attente VIGIE
    { "mot_de_passe": "...", "action": "contacts" }                -> messages de contact
    { "mot_de_passe": "...", "action": "contact-lu", "id": "..." } -> marque un message lu
    { "mot_de_passe": "...", "action": "candidatures" }            -> dossiers de candidature
    { "mot_de_passe": "...", "action": "candidature-detail", "id": "..." } -> un dossier complet
    { "mot_de_passe": "...", "action": "candidature-statut", "id": "...", "statut": "retenue" }
*/

import { createClient } from 'jsr:@supabase/supabase-js@2'

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

/** Comparaison en temps constant — évite qu'un attaquant devine le mot de passe caractère par caractère via le temps de réponse. */
function comparerEnTempsConstant(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: ENTETES_CORS })
  if (req.method !== 'POST') return reponse({ erreur: 'Méthode non autorisée' }, 405)

  try {
    const { mot_de_passe, action, id, statut } = await req.json()

    const attendu = Deno.env.get('ADMIN_PASSWORD')
    if (!attendu || typeof mot_de_passe !== 'string' || !comparerEnTempsConstant(mot_de_passe, attendu)) {
      // Délai artificiel : ralentit une attaque par force brute sur le mot de passe.
      await new Promise((r) => setTimeout(r, 400))
      return reponse({ erreur: 'Mot de passe incorrect' }, 401)
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    if (action === 'liste') {
      const { data, error } = await admin
        .from('resultats')
        .select(
          `id, indice90, jours, niveau_id, archetype_id, protocole_securite,
           rapport_envoye_le, cree_le,
           sessions ( prenom, entreprise, email, pays, qualite )`,
        )
        .order('cree_le', { ascending: false })
        .limit(500)

      if (error) return reponse({ erreur: 'Lecture impossible' }, 500)

      return reponse({
        total: data.length,
        resultats: data.map((r) => ({
          id: r.id,
          prenom: r.sessions?.prenom ?? '',
          entreprise: r.sessions?.entreprise ?? '',
          email: r.sessions?.email ?? '',
          pays: r.sessions?.pays ?? '',
          qualite: r.sessions?.qualite ?? 'inconnue',
          indice90: r.indice90,
          jours: r.jours,
          niveau: r.niveau_id,
          archetype: r.archetype_id,
          protocoleSecurite: r.protocole_securite,
          rapportEnvoye: Boolean(r.rapport_envoye_le),
          dateEnvoi: r.rapport_envoye_le,
          dateCreation: r.cree_le,
        })),
      })
    }

    if (action === 'detail' && typeof id === 'string') {
      const { data, error } = await admin
        .from('resultats')
        .select(
          `*, sessions ( prenom, entreprise, email, pays, chiffre_affaires, effectif,
           anciennete, rentabilite, secteur, evenement_recent, reponses, demarre_le, termine_le )`,
        )
        .eq('id', id)
        .maybeSingle()

      if (error || !data) return reponse({ erreur: 'Résultat introuvable' }, 404)
      return reponse({ resultat: data })
    }

    /*
      ── FORMULAIRES DU SITE VITRINE (ajout du 25 août 2026) ──
      Les tables `vigie_liste_attente` et `contacts` sont alimentées par
      cabinetlequart.com. Comme `resultats`, elles sont inaccessibles à la clé
      publique : cette fonction est le seul chemin de lecture.
    */

    if (action === 'vigie') {
      const { data, error } = await admin
        .from('vigie_liste_attente')
        .select('id, prenom, nom, courriel, cree_le')
        .order('cree_le', { ascending: false })
        .limit(1000)

      if (error) return reponse({ erreur: 'Lecture impossible' }, 500)
      return reponse({ total: data.length, inscrits: data })
    }

    if (action === 'contacts') {
      const { data, error } = await admin
        .from('contacts')
        .select('id, prenom, nom, courriel, categorie, message, lu, cree_le')
        .order('cree_le', { ascending: false })
        .limit(1000)

      if (error) return reponse({ erreur: 'Lecture impossible' }, 500)

      return reponse({
        total: data.length,
        nonLus: data.filter((m) => !m.lu).length,
        messages: data,
      })
    }

    // Marque un message comme lu. Le passage à « lu » est définitif : c'est un
    // repère de traitement, pas un état qu'on fait osciller.
    if (action === 'contact-lu' && typeof id === 'string') {
      const { error } = await admin.from('contacts').update({ lu: true }).eq('id', id)
      if (error) return reponse({ erreur: 'Mise à jour impossible' }, 500)
      return reponse({ ok: true })
    }

    /*
      ── CANDIDATURES À L'ACCOMPAGNEMENT (25 août 2026) ──
      Table la plus sensible du projet : chiffre d'affaires et résultat net
      d'entreprises identifiées. Elle n'est lisible que par ici.

      La liste ne renvoie PAS les données financières ni les réponses ouvertes :
      un tableau récapitulatif n'en a pas besoin, et moins ces valeurs circulent,
      mieux c'est. Elles ne partent qu'au détail, dossier par dossier.
    */

    if (action === 'candidatures') {
      const { data, error } = await admin
        .from('candidatures')
        .select('id, prenom, nom, entreprise, pays, secteur, effectif, statut, cree_le')
        .order('cree_le', { ascending: false })
        .limit(1000)

      if (error) return reponse({ erreur: 'Lecture impossible' }, 500)

      return reponse({
        total: data.length,
        nouvelles: data.filter((c) => c.statut === 'nouvelle').length,
        candidatures: data,
      })
    }

    if (action === 'candidature-detail' && typeof id === 'string') {
      const { data, error } = await admin
        .from('candidatures')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error || !data) return reponse({ erreur: 'Candidature introuvable' }, 404)

      // Ouvrir un dossier « nouvelle » le marque comme lu : le compteur de
      // dossiers en attente reflète ce qui n'a réellement pas été regardé.
      if (data.statut === 'nouvelle') {
        await admin.from('candidatures').update({ statut: 'lue' }).eq('id', id)
        data.statut = 'lue'
      }

      return reponse({ candidature: data })
    }

    // Décision du cabinet sur un dossier. 'nouvelle' est exclu : on ne rend pas
    // un dossier à son état initial une fois qu'il a été lu.
    if (action === 'candidature-statut' && typeof id === 'string') {
      if (!['lue', 'retenue', 'refusee'].includes(statut)) {
        return reponse({ erreur: 'Statut invalide' }, 400)
      }
      const { error } = await admin.from('candidatures').update({ statut }).eq('id', id)
      if (error) return reponse({ erreur: 'Mise à jour impossible' }, 500)
      return reponse({ ok: true, statut })
    }

    return reponse({ erreur: 'Action inconnue' }, 400)
  } catch {
    return reponse({ erreur: 'Erreur de traitement' }, 500)
  }
})
