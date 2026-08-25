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

  /*
    Formulaires du site vitrine (cabinetlequart.com), ajoutés le 25 août 2026.
    Chargés à la demande, quand on ouvre l'onglet correspondant : le back-office
    s'ouvre toujours sur les résultats du Test, inutile d'aller chercher le reste
    tant que personne ne le regarde.
  */
  const inscritsVigie = ref([])
  const messages = ref([])
  const messagesNonLus = ref(0)

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

  async function chargerVigie() {
    chargement.value = true
    try {
      const data = await appeler('vigie')
      inscritsVigie.value = data.inscrits
    } catch {
      erreur.value = 'Impossible de charger la liste d’attente.'
    } finally {
      chargement.value = false
    }
  }

  async function chargerMessages() {
    chargement.value = true
    try {
      const data = await appeler('contacts')
      messages.value = data.messages
      messagesNonLus.value = data.nonLus
    } catch {
      erreur.value = 'Impossible de charger les messages.'
    } finally {
      chargement.value = false
    }
  }

  /*
    Marque un message comme lu. L'affichage est mis à jour immédiatement, sans
    attendre le serveur : l'opération ne peut pas échouer de façon significative
    et un décompte qui met une seconde à bouger donne l'impression d'un bug.
  */
  async function marquerLu(id) {
    const message = messages.value.find((m) => m.id === id)
    if (!message || message.lu) return
    message.lu = true
    messagesNonLus.value = Math.max(0, messagesNonLus.value - 1)
    try {
      await appeler('contact-lu', { id })
    } catch {
      // Sans conséquence : le message reste visible, il sera remarqué au prochain
      // chargement s'il n'a pas été enregistré.
    }
  }

  function deconnecter() {
    motDePasse.value = ''
    authentifie.value = false
    resultats.value = []
    inscritsVigie.value = []
    messages.value = []
    messagesNonLus.value = 0
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
    inscritsVigie,
    messages,
    messagesNonLus,
    chargement,
    erreur,
    connecter,
    rafraichir,
    chargerDetail,
    chargerVigie,
    chargerMessages,
    marquerLu,
    deconnecter,
    tenterReprise,
  }
})
