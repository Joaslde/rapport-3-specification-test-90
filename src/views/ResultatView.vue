<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useParcours } from '@/stores/parcours'
import EnteteCabinet from '@/components/base/EnteteCabinet.vue'
import PiedPage from '@/components/base/PiedPage.vue'

/*
  Écran de résultat. Spec §9.4 :
  « L'affichage doit être sobre et sans emphase. Toute dramatisation
    typographique affaiblit l'effet. »

  Rien d'autre sur cet écran : pas de bouton de partage, pas de récapitulatif,
  pas de jauge. Le rapport arrive par email — c'est lui qui porte l'analyse.

  Le score est calculé par l'Edge Function, jamais ici (règle S1).
*/
const router = useRouter()
const parcours = useParcours()

const resultat = ref(null)
const chargement = ref(true)
const erreur = ref(null)
const rapportEnvoye = ref(false)

onMounted(async () => {
  parcours.restaurerLocal()

  if (!parcours.sessionId) {
    router.replace('/')
    return
  }

  try {
    const { data, error } = await supabase.functions.invoke('calculer-resultat', {
      body: { session_id: parcours.sessionId },
    })
    if (error) throw error
    if (data?.erreur) throw new Error(data.erreur)

    resultat.value = data
    await parcours.tracer('vue_resultat')

    /*
      Envoi du rapport par email — spec §12 : « dans les 60 secondes ».
      L'appel n'est pas attendu : le score s'affiche immédiatement, l'envoi
      se poursuit en arrière-plan. Un échec d'envoi ne doit jamais empêcher
      le répondant de voir son résultat.
    */
    supabase.functions
      .invoke('envoyer-rapport', { body: { session_id: parcours.sessionId } })
      .then(({ data: envoi }) => {
        if (envoi?.envoye) rapportEnvoye.value = true
      })
      .catch(() => {
        // L'échec est tracé côté serveur ; le répondant n'a rien à faire.
      })
  } catch {
    erreur.value = "Le calcul n'a pas abouti. Vos réponses sont enregistrées."
  } finally {
    chargement.value = false
  }
})
</script>

<template>
  <div class="min-h-screen">
    <EnteteCabinet compact />

    <main class="mx-auto max-w-[640px] px-6 pt-16 pb-4 sm:pt-24">
      <p v-if="chargement" class="text-base text-gristexte">Calcul en cours…</p>

      <div v-else-if="erreur">
        <p class="text-base text-encre">{{ erreur }}</p>
        <p class="mt-4 text-[15px] text-gristexte">
          Votre rapport vous sera adressé par email dès que possible.
        </p>
      </div>

      <div v-else-if="resultat">
        <!-- Sur-titre + filet : même code que l'accueil, cohérence d'ensemble. -->
        <div class="flex items-center gap-4">
          <span class="text-[11px] font-medium tracking-[0.18em] text-laiton uppercase">
            Indice 90
          </span>
          <span class="h-px flex-1 bg-trait" aria-hidden="true"></span>
        </div>

        <!-- Le chiffre porte tout l'écran. Aucun compteur animé (spec §9.4). -->
        <div class="chiffres mt-8 flex items-baseline gap-4">
          <span
            class="font-titre text-[104px] leading-[0.85] font-semibold tracking-[-0.045em] tabular-nums sm:text-[136px]"
          >
            {{ resultat.indice90 }}
          </span>
          <span class="font-titre text-[22px] text-gristexte">/ 100</span>
        </div>

        <div class="mt-10 h-px w-20 bg-laiton" />

        <h1 class="mt-9 font-titre text-[29px] leading-[1.16] font-semibold sm:text-[38px]">
          Votre entreprise fonctionne environ
          <span class="chiffres tabular-nums">{{ resultat.jours }}</span>
          {{ resultat.jours > 1 ? 'jours' : 'jour' }} sans vous.
        </h1>

        <p class="mt-10 border-t border-trait pt-7 text-base leading-[1.7] text-gristexte">
          Le seuil au-delà duquel une entreprise est considérée comme transférable est de
          <span class="chiffres font-medium text-encre tabular-nums">90 jours</span>.
        </p>

        <!--
          Distinction Indice 90 / 90 jours — note d'audit du 3 août 2026, §5.4.
          « Un prospect attentif le remarquera. Il faut donc le dire avant lui. »
        -->
        <p class="mt-5 text-[15px] leading-[1.65] text-gristexte">
          L'Indice 90 porte le nom du seuil qu'il mesure : les 90 jours — un trimestre, soit un
          quart d'année. Un Indice de 90 sur 100 ne signifie pas 90 jours : il signifie que votre
          entreprise dépasse très largement ce seuil. Le seuil des 90 jours est franchi à partir
          d'un Indice de <span class="chiffres tabular-nums">71</span>.
        </p>

        <div class="mt-12 bg-encre/[0.03] px-6 py-6">
          <p class="text-[11px] font-medium tracking-[0.14em] text-gristexte uppercase">
            Votre rapport
          </p>
          <p class="mt-3 text-[15px] leading-[1.6]">
            Votre analyse complète de 8 pages
            <span class="text-encre">{{ rapportEnvoye ? 'vient de vous être envoyée' : 'vous est adressée' }}</span>
            par email, à l'adresse
            <span class="text-encre">{{ parcours.identite.email }}</span
            >.
          </p>
        </div>
      </div>
    </main>

    <PiedPage />
  </div>
</template>
