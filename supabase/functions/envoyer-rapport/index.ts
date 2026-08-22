// @ts-nocheck — exécuté par Deno sur Supabase.
/*
  EDGE FUNCTION — envoi du rapport par email

  Spec §12 : « PDF A4 généré automatiquement, envoyé par email dans les
  60 secondes, doublé d'une version web consultable. »

  Spec §15.3, jour J0 : « Rapport PDF. AUCUNE VENTE. »
  L'email d'envoi ne contient donc aucune proposition commerciale.

  Spec §14.2, protocole de sécurité : « Un seul email de suivi non commercial. »
  Le corps du message est adapté, sans mention du score ni du diagnostic.
*/

import { createClient } from 'jsr:@supabase/supabase-js@2'
import { assemblerRapport } from './rapport.js'
import { genererPDF } from './pdf-rapport.js'

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

/** Échappe les valeurs saisies par le répondant avant insertion dans l'HTML. */
function echapper(valeur: unknown) {
  return String(valeur ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/*
  Gabarit de l'email. Sobre, aux couleurs de la charte, sans image ni emoji.
  Contrainte spec §16.3 : deux couleurs, aucun rouge, aucun vert.
*/
function corpsEmail({ prenom, indice90, jours, protocole, lienRapport }) {
  const p = echapper(prenom)

  // Protocole de sécurité : ni score, ni diagnostic, ni proposition.
  const contenu = protocole
    ? `
      <p style="margin:0 0 18px">Bonjour ${p},</p>
      <p style="margin:0 0 18px">
        Votre rapport est joint à ce message.
      </p>
      <p style="margin:0 0 18px">
        Plusieurs de vos réponses indiquent une charge personnelle élevée. Nous vous invitons
        à en parler à un médecin ou à un professionnel de santé. Cette recommandation est
        indépendante du reste du document.
      </p>
      <p style="margin:0 0 18px">
        Nous ne vous solliciterons pas dans les prochaines semaines. Si vous souhaitez échanger,
        vous pouvez répondre à ce message quand vous le voulez.
      </p>`
    : `
      <p style="margin:0 0 18px">Bonjour ${p},</p>
      <p style="margin:0 0 18px">
        Votre rapport complet est joint à ce message.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0">
        <tr>
          <td style="padding:20px 24px;background:#f1efec">
            <div style="font-size:11px;letter-spacing:1.4px;color:#6b7280;text-transform:uppercase">
              Indice 90
            </div>
            <div style="font-family:Georgia,serif;font-size:44px;line-height:1;color:#1b2a3a;margin-top:6px">
              ${indice90}<span style="font-size:17px;color:#6b7280"> / 100</span>
            </div>
            <div style="font-family:Georgia,serif;font-size:17px;color:#1b2a3a;margin-top:14px">
              Votre entreprise fonctionne environ ${jours} ${jours > 1 ? 'jours' : 'jour'} sans vous.
            </div>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 18px">
        Le rapport détaille les trois axes de votre Indice 90, vos points d'appui, vos fragilités,
        et le point qui, traité en premier, débloquerait le plus les autres.
      </p>
      <p style="margin:0 0 18px">
        Les trois actions de la dernière page sont réalisables sans nous, dans les trente jours.
      </p>`

  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f1ea">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f4f1ea">
    <tr><td align="center" style="padding:32px 16px">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px">
        <tr><td style="padding-bottom:14px;border-bottom:1px solid #ddd9d3">
          <span style="font-family:Georgia,serif;font-size:15px;color:#1b2a3a">Le Test des 90 Jours</span>
        </td></tr>
        <tr><td style="height:2px;background:#9a7b4f;line-height:2;font-size:0">&nbsp;</td></tr>
        <tr><td style="padding:28px 0;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#1b2a3a">
          ${contenu}
          ${
            lienRapport
              ? `<p style="margin:26px 0 0">
                   <a href="${lienRapport}" style="color:#1b2a3a">Consulter le rapport en ligne</a>
                 </p>`
              : ''
          }
        </td></tr>
        <tr><td style="padding-top:22px;border-top:1px solid #ddd9d3;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:#6b7280">
          Vos réponses sont confidentielles et ne sont jamais transmises à un tiers.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

/** Version texte, pour les clients qui n'affichent pas l'HTML. */
function texteEmail({ prenom, indice90, jours, protocole }) {
  if (protocole) {
    return [
      `Bonjour ${prenom},`,
      '',
      'Votre rapport est joint à ce message.',
      '',
      'Plusieurs de vos réponses indiquent une charge personnelle élevée. Nous vous invitons',
      'à en parler à un médecin ou à un professionnel de santé.',
      '',
      'Nous ne vous solliciterons pas dans les prochaines semaines.',
      '',
      'Vos réponses sont confidentielles et ne sont jamais transmises à un tiers.',
    ].join('\n')
  }
  return [
    `Bonjour ${prenom},`,
    '',
    'Votre rapport complet est joint à ce message.',
    '',
    `Indice 90 : ${indice90} / 100`,
    `Votre entreprise fonctionne environ ${jours} ${jours > 1 ? 'jours' : 'jour'} sans vous.`,
    '',
    'Les trois actions de la dernière page sont réalisables sans nous, dans les trente jours.',
    '',
    'Vos réponses sont confidentielles et ne sont jamais transmises à un tiers.',
  ].join('\n')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: ENTETES_CORS })
  if (req.method !== 'POST') return reponse({ erreur: 'Méthode non autorisée' }, 405)

  try {
    const { session_id } = await req.json()
    if (typeof session_id !== 'string' || !/^[0-9a-f-]{36}$/i.test(session_id)) {
      return reponse({ erreur: 'Session invalide' }, 400)
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: res, error } = await admin
      .from('resultats')
      .select(
        '*, sessions(prenom, entreprise, email, chiffre_affaires, effectif, evenement_recent)',
      )
      .eq('session_id', session_id)
      .maybeSingle()

    if (error || !res) return reponse({ erreur: 'Résultat introuvable' }, 404)

    const s = res.sessions
    if (!s?.email) return reponse({ erreur: 'Aucune adresse de destination' }, 400)

    // Idempotence : ne jamais envoyer deux fois le même rapport.
    if (res.rapport_envoye_le) {
      return reponse({ envoye: true, deja: true, date: res.rapport_envoye_le })
    }

    const { data: barometre } = await admin
      .from('barometre_config')
      .select('nb_repondants, indice_median')
      .eq('id', 1)
      .single()

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

    // Encodage base64 par tranches : évite le dépassement de pile sur gros PDF.
    let binaire = ''
    const tranche = 8192
    for (let i = 0; i < pdf.length; i += tranche) {
      binaire += String.fromCharCode(...pdf.subarray(i, i + tranche))
    }
    const pdfBase64 = btoa(binaire)

    const base = Deno.env.get('URL_PUBLIQUE') ?? ''
    const donnees = {
      prenom: s.prenom,
      indice90: res.indice90,
      jours: res.jours,
      protocole: res.protocole_securite,
      lienRapport: base ? `${base}/rapport?t=${res.token_rapport}` : null,
    }

    const envoi = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: Deno.env.get('RESEND_FROM_EMAIL') ?? 'delivered@resend.dev',
        to: [s.email],
        subject: res.protocole_securite
          ? 'Votre rapport — Le Test des 90 Jours'
          : `Votre Indice 90 : ${res.indice90}/100`,
        html: corpsEmail(donnees),
        text: texteEmail(donnees),
        attachments: [{ filename: rapport.meta.nomFichier, content: pdfBase64 }],
      }),
    })

    const retour = await envoi.json()

    if (!envoi.ok) {
      // Le détail reste dans les logs serveur : pas de fuite vers le client.
      console.error('Échec Resend', envoi.status, retour?.message)
      return reponse({ erreur: "L'envoi a échoué" }, 502)
    }

    await admin
      .from('resultats')
      .update({ rapport_envoye_le: new Date().toISOString() })
      .eq('session_id', session_id)

    return reponse({ envoye: true, id: retour?.id ?? null })
  } catch (e) {
    console.error('Erreur envoyer-rapport', e)
    return reponse({ erreur: 'Erreur de traitement' }, 500)
  }
})
