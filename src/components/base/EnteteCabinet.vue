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
  <header class="border-b border-trait">
    <div
      class="mx-auto flex max-w-[640px] items-baseline justify-between px-6"
      :class="compact ? 'py-4' : 'py-5'"
    >
      <p class="font-titre text-[15px] font-semibold tracking-[-0.01em] text-encre">
        Le Test des 90 Jours
      </p>
      <p class="text-[11px] font-medium tracking-[0.14em] text-gristexte uppercase">
        Diagnostic
      </p>
    </div>
    <!-- Filet d'accent : le seul laiton de l'écran, 1px, discret. -->
    <div class="h-px bg-laiton/40" />
  </header>
</template>
