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

    <main class="mx-auto max-w-[640px] px-6 pt-10 pb-4 sm:pt-14">
      <!-- Sur-titre + filet : codes du document imprimé, pas de la page web. -->
      <div class="flex items-center gap-4">
        <span class="text-[11px] font-medium tracking-[0.18em] text-laiton uppercase">
          Instrument de diagnostic
        </span>
        <span class="h-px flex-1 bg-trait" aria-hidden="true"></span>
      </div>

      <h1
        class="mt-6 font-titre text-[38px] leading-[1.06] font-semibold tracking-[-0.03em] sm:text-[54px]"
      >
        Le Test<br />des 90 Jours
      </h1>

      <!--
        Le constat fondateur (spec §2.1). Traité comme un exergue de rapport :
        filet laiton, texte en serif, source attribuée juste en dessous.
      -->
      <blockquote class="mt-8 border-l-2 border-laiton pl-7">
        <p class="font-titre text-[19px] leading-[1.55] font-medium sm:text-[21px]">
          Les travaux universitaires sur les entreprises africaines établissent un constat sévère :
          leur durée de vie n'excède souvent pas huit ans, et pour les plus solides, elle est
          réduite à l'espérance de vie de leur fondateur.
        </p>
      </blockquote>

      <p class="mt-8 text-[17px] leading-[1.65]">
        Ce test mesure une seule chose :
        <span class="font-medium">combien de temps votre entreprise fonctionnerait sans vous.</span>
      </p>

      <!--
        CTA principal, au-dessus de la ligne de flottaison : le geste doit être
        possible dès la première vue, sans défilement. Le bouton du bas est
        conservé — c'est le même geste, proposé une seconde fois à qui a lu
        les règles jusqu'au bout.
      -->
      <div class="mt-8">
        <BaseButton @click="commencer">Commencer le test</BaseButton>
        <p class="mt-4 text-center text-[13px] text-gristexte">
          Sept minutes. Aucune inscription.
        </p>
      </div>

      <!-- Repères chiffrés, en chiffres tabulaires pour un alignement net. -->
      <dl class="chiffres mt-10 grid grid-cols-3 border-y border-encre/15">
        <div class="border-r border-trait py-6 pr-4">
          <dt class="font-titre text-[30px] leading-none font-semibold">18</dt>
          <dd class="mt-2.5 text-[12px] tracking-[0.04em] text-gristexte">questions</dd>
        </div>
        <div class="border-r border-trait py-6 pr-4 pl-5">
          <dt class="font-titre text-[30px] leading-none font-semibold">7</dt>
          <dd class="mt-2.5 text-[12px] tracking-[0.04em] text-gristexte">minutes</dd>
        </div>
        <div class="py-6 pl-5">
          <dt class="font-titre text-[30px] leading-none font-semibold">8</dt>
          <dd class="mt-2.5 text-[12px] tracking-[0.04em] text-gristexte">pages de rapport</dd>
        </div>
      </dl>

      <p class="mt-10 text-base leading-[1.65]">
        Aucune réponse n'est bonne ou mauvaise. Répondez à ce qui se passe réellement, pas à ce qui
        devrait se passer.
      </p>

      <!--
        Les règles du parcours (spec §16.1). Liste numérotée plutôt que puces :
        code du document formel, et le numéro en laiton sert d'unique accent.
      -->
      <div class="mt-10 border-t border-trait pt-8">
        <p class="text-[11px] font-medium tracking-[0.18em] text-gristexte uppercase">
          Avant de commencer
        </p>
        <ol class="chiffres mt-6 space-y-5">
          <li class="flex gap-5">
            <span class="font-titre text-[15px] leading-[1.5] text-laiton tabular-nums">01</span>
            <span class="text-[15px] leading-[1.6]">Une question par écran.</span>
          </li>
          <li class="flex gap-5">
            <span class="font-titre text-[15px] leading-[1.5] text-laiton tabular-nums">02</span>
            <span class="text-[15px] leading-[1.6]">
              Vous ne pourrez pas revenir en arrière : cela protège la spontanéité de vos réponses.
            </span>
          </li>
          <li class="flex gap-5">
            <span class="font-titre text-[15px] leading-[1.5] text-laiton tabular-nums">03</span>
            <span class="text-[15px] leading-[1.6]">
              À l'issue des 18 questions, vous recevrez votre Indice 90 et un rapport de 8 pages
              par email.
            </span>
          </li>
        </ol>
      </div>

      <!-- Reprise du même geste en fin de lecture, pour qui a lu les règles. -->
      <div class="mt-12">
        <BaseButton @click="commencer">Commencer le test</BaseButton>
      </div>
    </main>

    <PiedPage />
  </div>
</template>
