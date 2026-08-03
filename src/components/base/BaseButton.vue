<script setup>
/*
  Bouton principal. docs/design-pattern.md §6.3
  Hauteur 52px minimum, rayon 2px, aucun point d'exclamation dans les libellés.
*/
defineProps({
  variante: { type: String, default: 'principal' },
  desactive: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
})
</script>

<template>
  <button
    :type="type"
    :disabled="desactive"
    class="min-h-[52px] w-full rounded-[2px] px-6 text-base font-medium transition-colors duration-150"
    :class="
      variante === 'principal'
        ? 'bg-encre text-papier hover:bg-encre/90 disabled:bg-trait disabled:text-gristexte'
        : 'border border-trait bg-transparent text-gristexte hover:border-encre/30 hover:text-encre'
    "
  >
    <slot />
  </button>
</template>
