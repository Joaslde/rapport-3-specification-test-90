import { createClient } from '@supabase/supabase-js'

/*
  Client Supabase — navigateur.

  Cette clé est publique par conception : toute la protection repose sur les
  politiques RLS et les privilèges de colonne, pas sur le secret de la clé.
  Vérifié par test de pénétration : anon ne peut lire ni email, ni réponses,
  ni résultats, et ne peut rien supprimer. Voir docs/securite.md §4.
*/

const url = import.meta.env.VITE_SUPABASE_URL
const cle = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !cle) {
  throw new Error(
    'Configuration Supabase manquante. Copier .env.example en .env et renseigner les valeurs.',
  )
}

export const supabase = createClient(url, cle, {
  auth: {
    // Le test est anonyme : aucune session utilisateur à conserver.
    persistSession: false,
    autoRefreshToken: false,
  },
})
