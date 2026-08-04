<script setup>
/*
  Une option de réponse. docs/design-pattern.md §6.1
  Le composant le plus utilisé du produit — 90 occurrences (18 × 5).

  Contraintes :
    - hauteur minimale 64px (zone de tap au pouce)
    - toute la carte est cliquable
    - AUCUN rond de radio visible : la sélection se lit par la bordure
    - un input radio natif est présent mais masqué, pour l'accessibilité
*/
defineProps({
  id: { type: String, required: true },
  nom: { type: String, required: true },
  libelle: { type: String, required: true },
  valeur: { type: Number, required: true },
  selectionnee: { type: Boolean, default: false },
})

defineEmits(['choisir'])
</script>

<template>
  <label
    :for="id"
    class="has-[:focus-visible]:ring-laiton has-[:focus-visible]:ring-offset-papier group relative flex min-h-[64px] cursor-pointer items-center overflow-hidden rounded-none border bg-papier px-5 py-4 transition-colors duration-[120ms] ease-out has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2"
    :class="
      selectionnee
        ? 'border-laiton bg-laiton/[0.04] shadow-[inset_3px_0_0_0_var(--color-laiton)]'
        : 'border-trait hover:border-encre/35'
    "
  >
    <!--
      Remplissage progressif au survol : couche pleine largeur, révélée depuis
      la gauche via scaleX (transform, pas de largeur — évite tout reflow).
      Désactivé sur l'option déjà sélectionnée : sa lecture reste celle du
      liseré laiton, pas celle du survol.
    -->
    <span
      v-if="!selectionnee"
      class="absolute inset-0 origin-left scale-x-0 bg-encre transition-transform duration-200 ease-out group-hover:scale-x-100"
      aria-hidden="true"
    />
    <input
      :id="id"
      :name="nom"
      :value="valeur"
      :checked="selectionnee"
      type="radio"
      class="sr-only"
      @change="$emit('choisir', valeur)"
    />
    <span
      class="relative text-base leading-[1.45] text-encre transition-colors duration-200 ease-out"
      :class="{ 'group-hover:text-papier': !selectionnee }"
      >{{ libelle }}</span
    >
  </label>
</template>
