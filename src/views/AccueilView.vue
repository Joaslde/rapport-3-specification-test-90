<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import EnteteCabinet from '@/components/base/EnteteCabinet.vue'
import PiedPage from '@/components/base/PiedPage.vue'
import { useParcours } from '@/stores/parcours'

/*
  Écran d'accueil. Texte exact de la spec §16.2.
  Le constat des 8 ans doit apparaître en ouverture (spec §2.1 et §4.1).

  Version enrichie : en-tête, filets, encadré de citation, bloc de repères
  chiffrés. Toujours dans la charte — 2 couleurs, aucun rouge, aucun vert,
  aucune gamification (spec §16.3).
*/
const router = useRouter()
const parcours = useParcours()

onMounted(() => {
  parcours.restaurerLocal()
})

async function commencer() {
  await parcours.demarrer()
  await parcours.tracer('vue_accueil')
  router.push('/quiz')
}
</script>

<template>
  <div class="min-h-screen">
    <EnteteCabinet />

    <main class="mx-auto max-w-[640px] px-6 pt-14 pb-4 sm:pt-20">
      <p class="text-[11px] font-medium tracking-[0.14em] text-gristexte uppercase">
        Instrument de diagnostic
      </p>

      <h1
        class="mt-5 font-titre text-[34px] leading-[1.12] font-semibold tracking-[-0.025em] sm:text-[46px]"
      >
        Le Test des 90 Jours
      </h1>

      <!-- Le constat fondateur, mis en exergue par un filet laiton. -->
      <blockquote class="mt-10 border-l-2 border-laiton pl-6">
        <p class="text-[17px] leading-[1.6] text-encre">
          Les travaux universitaires sur les entreprises africaines établissent un constat sévère :
          leur durée de vie n'excède souvent pas huit ans — et pour les plus solides, elle est
          réduite à l'espérance de vie de leur fondateur.
        </p>
      </blockquote>

      <p class="mt-10 text-[17px] leading-[1.65]">
        Ce test mesure une seule chose :
        <span class="font-medium">combien de temps votre entreprise fonctionnerait sans vous.</span>
      </p>

      <!-- Repères chiffrés : donne de la matière sans ajouter de couleur. -->
      <dl class="mt-10 grid grid-cols-3 border-y border-trait">
        <div class="border-r border-trait py-5 pr-4">
          <dt class="font-titre text-[26px] leading-none font-semibold">18</dt>
          <dd class="mt-2 text-[13px] leading-[1.4] text-gristexte">questions</dd>
        </div>
        <div class="border-r border-trait py-5 pr-4 pl-4">
          <dt class="font-titre text-[26px] leading-none font-semibold">7</dt>
          <dd class="mt-2 text-[13px] leading-[1.4] text-gristexte">minutes</dd>
        </div>
        <div class="py-5 pl-4">
          <dt class="font-titre text-[26px] leading-none font-semibold">8</dt>
          <dd class="mt-2 text-[13px] leading-[1.4] text-gristexte">pages de rapport</dd>
        </div>
      </dl>

      <p class="mt-10 text-base leading-[1.65]">
        Aucune réponse n'est bonne ou mauvaise. Répondez à ce qui se passe réellement, pas à ce qui
        devrait se passer.
      </p>

      <!-- Les deux règles du parcours, annoncées en préambule (spec §16.1). -->
      <div class="mt-8 bg-encre/[0.03] px-6 py-5">
        <p class="text-[13px] font-medium tracking-[0.06em] text-gristexte uppercase">
          Avant de commencer
        </p>
        <ul class="mt-4 space-y-3">
          <li class="flex gap-3 text-[15px] leading-[1.55]">
            <span class="text-laiton" aria-hidden="true">—</span>
            <span>Une question par écran.</span>
          </li>
          <li class="flex gap-3 text-[15px] leading-[1.55]">
            <span class="text-laiton" aria-hidden="true">—</span>
            <span>
              Vous ne pourrez pas revenir en arrière : cela protège la spontanéité de vos réponses.
            </span>
          </li>
          <li class="flex gap-3 text-[15px] leading-[1.55]">
            <span class="text-laiton" aria-hidden="true">—</span>
            <span>
              À l'issue des 18 questions, vous recevrez votre Indice 90 et un rapport de 8 pages
              par email.
            </span>
          </li>
        </ul>
      </div>

      <div class="mt-10">
        <BaseButton @click="commencer">Commencer</BaseButton>
      </div>
    </main>

    <PiedPage />
  </div>
</template>
