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
        Logo du cabinet Le Quart + nom. Remplace le monogramme « 90 » cerclé
        du 26 août 2026 : le cabinet a fourni son logo officiel entre-temps.
        Agrandi le même jour (32px -> 48px, compact 40px) : le détail du logo
        (compas + inscription circulaire) disparaissait à la petite taille.
      -->
      <div class="flex items-center gap-3">
        <img
          src="/logo-favicon.png"
          alt="Le Quart"
          class="w-10 h-10 shrink-0 rounded-full sm:h-12 sm:w-12"
        />
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
