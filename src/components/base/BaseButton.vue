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
  <!--
    Rayon 0 : code du document imprimé plutôt que du bouton d'application.
    Interlettrage léger + graisse medium : lisibilité et tenue à l'écran.
    `active:` donne un retour de pression sans déplacer la mise en page
    (règle `press-feedback` du skill, sans layout shift).
  -->
  <button
    :type="type"
    :disabled="desactive"
    class="min-h-[54px] w-full rounded-none px-6 text-[15px] font-medium tracking-[0.02em] transition-colors duration-150 disabled:cursor-not-allowed"
    :class="
      variante === 'principal'
        ? 'bg-encre text-papier hover:bg-encre/88 active:bg-encre/95 disabled:bg-trait disabled:text-gristexte'
        : 'border border-trait bg-transparent text-gristexte hover:border-encre/40 hover:text-encre active:bg-encre/[0.03]'
    "
  >
    <slot />
  </button>
</template>
