import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

const CLE_SESSION = 'test90.admin.motdepasse'

/*
  État du back-office. Le mot de passe est vérifié à chaque appel par
  l'Edge Function `admin-resultats` — jamais côté client (docs/securite.md).
  Il est gardé en mémoire de session (sessionStorage, pas localStorage) pour
  éviter de le redemander à chaque navigation, mais il disparaît à la
  fermeture de l'onglet.
*/
export const useAdmin = defineStore('admin', () => {
  const motDePasse = ref(sessionStorage.getItem(CLE_SESSION) ?? '')
  const authentifie = ref(false)
  const resultats = ref([])
  const chargement = ref(false)
  const erreur = ref('')

  async function appeler(action, params = {}) {
    const { data, error } = await supabase.functions.invoke('admin-resultats', {
      body: { mot_de_passe: motDePasse.value, action, ...params },
    })
    if (error) throw error
    if (data?.erreur) throw new Error(data.erreur)
    return data
  }

  async function connecter(saisie) {
    erreur.value = ''
    chargement.value = true
    motDePasse.value = saisie
    try {
      const data = await appeler('liste')
      resultats.value = data.resultats
      authentifie.value = true
      sessionStorage.setItem(CLE_SESSION, saisie)
    } catch (e) {
      authentifie.value = false
      erreur.value = e.message === 'Mot de passe incorrect' ? 'Mot de passe incorrect.' : 'Connexion impossible.'
    } finally {
      chargement.value = false
    }
  }

  async function rafraichir() {
    chargement.value = true
    try {
      const data = await appeler('liste')
      resultats.value = data.resultats
    } catch {
      erreur.value = 'Impossible de rafraîchir la liste.'
    } finally {
      chargement.value = false
    }
  }

  async function chargerDetail(id) {
    const data = await appeler('detail', { id })
    return data.resultat
  }

  function deconnecter() {
    motDePasse.value = ''
    authentifie.value = false
    resultats.value = []
    sessionStorage.removeItem(CLE_SESSION)
  }

  // Reprise automatique si un mot de passe est déjà en session.
  async function tenterReprise() {
    if (!motDePasse.value) return
    await connecter(motDePasse.value)
  }

  return {
    motDePasse,
    authentifie,
    resultats,
    chargement,
    erreur,
    connecter,
    rafraichir,
    chargerDetail,
    deconnecter,
    tenterReprise,
  }
})
