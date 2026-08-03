import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { QUESTIONS, NOMBRE_QUESTIONS } from '@/data/questions'
import { TRANSITIONS } from '@/data/axes'
import { montantQ2 } from '@/data/pays'

const CLE_LOCALE = 'test90.parcours'

/*
  État du parcours. Une question par écran, pas de retour arrière (spec §16.1).
  La progression est sauvegardée localement ET côté Supabase, pour permettre
  la reprise après coupure réseau — contrainte réseau réelle sur la zone.
*/
export const useParcours = defineStore('parcours', () => {
  const sessionId = ref(null)
  const identite = ref({ prenom: '', email: '', entreprise: '', pays: '' })
  const profil = ref({})
  const reponses = ref([])
  const etape = ref('accueil')
  const indexQuestion = ref(0)
  const enCours = ref(false)
  const erreur = ref(null)

  // -------------------------------------------------------------------
  // Dérivés
  // -------------------------------------------------------------------
  const questionCourante = computed(() => QUESTIONS[indexQuestion.value] ?? null)

  /** Énoncé avec le montant localisé selon le pays (spec §6, note Q2). */
  const enonceCourant = computed(() => {
    const q = questionCourante.value
    if (!q) return ''
    return q.montantLocalise
      ? q.enonce.replace('{MONTANT}', montantQ2(identite.value.pays))
      : q.enonce
  })

  /** Transition à afficher avant la question courante, s'il y en a une. */
  const transitionCourante = computed(
    () => TRANSITIONS.find((t) => t.avantQuestion === indexQuestion.value + 1) ?? null,
  )

  const progression = computed(() => indexQuestion.value / NOMBRE_QUESTIONS)
  const questionsRepondues = computed(() => reponses.value.filter((r) => r != null).length)
  const toutesRepondues = computed(() => questionsRepondues.value === NOMBRE_QUESTIONS)

  // -------------------------------------------------------------------
  // Persistance locale — reprise après coupure réseau
  // -------------------------------------------------------------------
  function sauvegarderLocal() {
    try {
      localStorage.setItem(
        CLE_LOCALE,
        JSON.stringify({
          sessionId: sessionId.value,
          identite: identite.value,
          profil: profil.value,
          reponses: reponses.value,
          etape: etape.value,
          indexQuestion: indexQuestion.value,
        }),
      )
    } catch {
      // Mode privé ou quota dépassé : la persistance serveur prend le relais.
    }
  }

  function restaurerLocal() {
    try {
      const brut = localStorage.getItem(CLE_LOCALE)
      if (!brut) return false
      const d = JSON.parse(brut)
      sessionId.value = d.sessionId ?? null
      identite.value = d.identite ?? identite.value
      profil.value = d.profil ?? {}
      reponses.value = d.reponses ?? []
      etape.value = d.etape ?? 'accueil'
      indexQuestion.value = d.indexQuestion ?? 0
      return Boolean(sessionId.value)
    } catch {
      return false
    }
  }

  function effacerLocal() {
    try {
      localStorage.removeItem(CLE_LOCALE)
    } catch {
      // sans conséquence
    }
  }

  // -------------------------------------------------------------------
  // Supabase
  // -------------------------------------------------------------------
  async function demarrer() {
    if (sessionId.value) return sessionId.value

    const { data, error } = await supabase
      .from('sessions')
      .insert({ etape: 'accueil' })
      .select('id')
      .single()

    if (error) throw error

    sessionId.value = data.id
    reponses.value = Array(NOMBRE_QUESTIONS).fill(null)
    sauvegarderLocal()
    return data.id
  }

  /** Écrit une mise à jour partielle de la session. Silencieux en cas d'échec réseau. */
  async function synchroniser(champs) {
    if (!sessionId.value) return
    const { error } = await supabase.from('sessions').update(champs).eq('id', sessionId.value)
    if (error) erreur.value = error.message
  }

  async function tracer(type, question = null) {
    if (!sessionId.value) return
    // Le tracking ne doit jamais interrompre le parcours.
    await supabase
      .from('evenements')
      .insert({ session_id: sessionId.value, type, question })
      .then(null, () => {})
  }

  // -------------------------------------------------------------------
  // Progression du parcours
  // -------------------------------------------------------------------
  async function enregistrerIdentite(valeurs) {
    identite.value = { ...identite.value, ...valeurs }
    etape.value = 'questions'
    sauvegarderLocal()
    await synchroniser({
      ...identite.value,
      etape: 'questions',
      consentement_le: new Date().toISOString(),
    })
    await tracer('debut_test')
  }

  /**
   * Enregistre une réponse et avance. Aucun retour arrière possible :
   * c'est ce qui protège la spontanéité (spec §16.1).
   */
  async function repondre(indexOption) {
    if (!questionCourante.value) return

    reponses.value[indexQuestion.value] = indexOption
    await tracer('reponse', indexQuestion.value + 1)

    indexQuestion.value += 1
    sauvegarderLocal()

    // Synchronisation à chaque réponse : une coupure ne perd rien.
    await synchroniser({ reponses: reponses.value.map((r) => r ?? 0) })

    if (indexQuestion.value >= NOMBRE_QUESTIONS) {
      etape.value = 'profil'
      await synchroniser({ etape: 'profil' })
      await tracer('vue_profil')
    }
  }

  async function enregistrerProfil(valeurs) {
    profil.value = { ...profil.value, ...valeurs }
    sauvegarderLocal()
    await synchroniser({ ...profil.value, etape: 'termine' })
    await tracer('profil_complete')
  }

  async function terminer() {
    etape.value = 'termine'
    sauvegarderLocal()
    await synchroniser({ etape: 'termine', termine_le: new Date().toISOString() })
  }

  function reinitialiser() {
    sessionId.value = null
    identite.value = { prenom: '', email: '', entreprise: '', pays: '' }
    profil.value = {}
    reponses.value = []
    etape.value = 'accueil'
    indexQuestion.value = 0
    erreur.value = null
    effacerLocal()
  }

  return {
    sessionId,
    identite,
    profil,
    reponses,
    etape,
    indexQuestion,
    enCours,
    erreur,

    questionCourante,
    enonceCourant,
    transitionCourante,
    progression,
    questionsRepondues,
    toutesRepondues,

    demarrer,
    restaurerLocal,
    enregistrerIdentite,
    repondre,
    enregistrerProfil,
    terminer,
    tracer,
    reinitialiser,
  }
})
