<script setup>
/*
  En-tête persistant. Donne une identité à chaque écran — le manque le plus
  visible de la première version : on ne savait pas chez qui on était.

  Reste dans la charte : Encre + laiton, aucune image, aucun emoji.
*/
defineProps({
  compact: { type: Boolean, default: false },
})
</script>

<template>
  <header class="border-b border-encre/12">
    <div
      class="mx-auto flex max-w-[640px] items-center justify-between px-6"
      :class="compact ? 'py-4' : 'py-5'"
    >
      <!--
        Monogramme « 90 » cerclé + nom : donne un point d'ancrage visuel
        à l'identité, sans logo ni image (spec §16.3 : aucune photo).
      -->
      <div class="flex items-center gap-3">
        <span
          class="chiffres flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-laiton font-titre text-[11px] font-semibold text-laiton tabular-nums"
          aria-hidden="true"
        >
          90
        </span>
        <p class="font-titre text-[15px] font-semibold tracking-[-0.01em] text-encre">
          Le Test des 90 Jours
        </p>
      </div>
      <p class="hidden text-[10px] font-medium tracking-[0.2em] text-gristexte uppercase sm:block">
        Diagnostic
      </p>
    </div>
  </header>
</template>
