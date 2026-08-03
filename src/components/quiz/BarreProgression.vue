<script setup>
/*
  Barre de progression. docs/design-pattern.md §6.2
  Spec §16.1 : « Position en bas, fine, sans pourcentage criard. »
  2px, remplissage Encre (pas laiton — la progression n'est pas un accent).
  AUCUN chiffre : l'information « Question 7 / 18 » est portée par le sur-titre.
*/
defineProps({
  valeur: { type: Number, required: true }, // 0 à 1
})
</script>

<template>
  <div class="fixed inset-x-0 bottom-0 h-[2px] bg-trait" role="presentation">
    <div
      class="h-full bg-encre transition-[width] duration-300 ease-out"
      :style="{ width: `${Math.round(valeur * 100)}%` }"
    />
  </div>
</template>
