<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/lib/supabase'
import EnteteCabinet from '@/components/base/EnteteCabinet.vue'
import PiedPage from '@/components/base/PiedPage.vue'

/*
  Version web consultable du rapport (spec §12 : « doublé d'une version web »).

  L'accès se fait par token opaque de 32 octets, jamais par un identifiant
  devinable (docs/securite.md §4.3). La fonction SQL `rapport_par_token`
  ne renvoie ni l'email ni les réponses brutes.

  Cette page présente l'essentiel ; le PDF reste le document de référence.
*/
const route = useRoute()

const rapport = ref(null)
const chargement = ref(true)
const erreur = ref(null)

const LIBELLES_AXES = {
  score_a1: "L'entreprise sans vous",
  score_a2: 'Ceux qui vous entourent',
  score_a3: 'Vous',
}

onMounted(async () => {
  const token = route.query.t
  if (!token) {
    erreur.value = 'Lien incomplet.'
    chargement.value = false
    return
  }

  try {
    const { data, error } = await supabase.rpc('rapport_par_token', { p_token: token })
    if (error) throw error
    if (!data?.length) {
      erreur.value = 'Ce lien n’est plus valide.'
    } else {
      rapport.value = data[0]
    }
  } catch {
    erreur.value = 'Le rapport n’a pas pu être chargé.'
  } finally {
    chargement.value = false
  }
})

const axes = computed(() =>
  rapport.value
    ? Object.entries(LIBELLES_AXES).map(([cle, titre]) => ({
        titre,
        score: rapport.value[cle],
        fort: rapport.value[cle] >= 50,
      }))
    : [],
)

const dateRapport = computed(() =>
  rapport.value
    ? new Date(rapport.value.cree_le).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '',
)
</script>

<template>
  <div class="min-h-screen">
    <EnteteCabinet compact />

    <main class="mx-auto max-w-[640px] px-6 pt-14 pb-4">
      <p v-if="chargement" class="text-base text-gristexte">Chargement…</p>

      <div v-else-if="erreur">
        <p class="text-base text-encre">{{ erreur }}</p>
        <p class="mt-4 text-[15px] text-gristexte">
          Votre rapport vous a été adressé par email. Le lien de consultation reste valide
          quatre-vingt-dix jours.
        </p>
      </div>

      <article v-else-if="rapport">
        <p class="text-[11px] font-medium tracking-[0.14em] text-gristexte uppercase">
          {{ rapport.prenom }} · {{ rapport.entreprise }}
        </p>
        <p class="mt-1 text-[13px] text-gristexte">{{ dateRapport }}</p>

        <div class="mt-10 flex items-baseline gap-3">
          <span
            class="font-titre text-[80px] leading-none font-semibold tracking-[-0.03em] sm:text-[104px]"
          >
            {{ rapport.indice90 }}
          </span>
          <span class="font-titre text-xl text-gristexte">/ 100</span>
        </div>

        <div class="mt-8 h-px w-16 bg-laiton" />

        <h1 class="mt-8 font-titre text-[26px] leading-[1.2] font-semibold sm:text-[34px]">
          Votre entreprise fonctionne environ {{ rapport.jours }}
          {{ rapport.jours > 1 ? 'jours' : 'jour' }} sans vous.
        </h1>

        <p class="mt-6 text-base leading-[1.65] text-gristexte">
          Le seuil au-delà duquel une entreprise est considérée comme transférable est de
          <span class="text-encre">90 jours</span>.
        </p>

        <!-- Encadré du protocole de sécurité : sobre, jamais alarmiste. -->
        <div v-if="rapport.protocole_securite" class="mt-12 border-l-2 border-laiton bg-encre/[0.03] px-6 py-5">
          <p class="text-[11px] font-medium tracking-[0.14em] text-gristexte uppercase">
            Une remarque préalable
          </p>
          <p class="mt-3 text-[15px] leading-[1.6]">
            Plusieurs de vos réponses indiquent une charge personnelle élevée et durable. Ce n'est
            pas un jugement, et cela n'a rien d'exceptionnel — 54 % des dirigeants déclarent avoir
            traversé un épuisement au cours des douze derniers mois. Nous vous recommandons d'en
            parler à un médecin ou à un professionnel de santé.
          </p>
        </div>

        <!-- Les trois axes. Jauges monochromes : la couleur ne juge jamais. -->
        <section class="mt-14">
          <h2 class="font-titre text-[20px] font-semibold">La lecture par axe</h2>
          <div class="mt-8 space-y-8">
            <div v-for="a in axes" :key="a.titre">
              <div class="flex items-baseline justify-between">
                <span class="font-titre text-[15px]">{{ a.titre }}</span>
                <span class="font-titre text-[17px] font-semibold">{{ a.score }}</span>
              </div>
              <div class="relative mt-3 h-2 bg-trait">
                <div class="h-full bg-encre" :style="{ width: `${a.score}%` }" />
                <!-- Seuil de 50, seule graduation visible -->
                <div class="absolute top-[-3px] left-1/2 h-[14px] w-px bg-gristexte" />
              </div>
            </div>
          </div>
        </section>

        <div class="mt-14 border-t border-trait pt-8">
          <p class="text-[15px] leading-[1.6] text-gristexte">
            L'analyse complète — vos points d'appui, vos fragilités, le point critique et les
            actions à mener — figure dans le rapport de 8 pages qui vous a été adressé par email.
          </p>
        </div>
      </article>
    </main>

    <PiedPage />
  </div>
</template>
