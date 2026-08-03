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
    class="flex min-h-[64px] cursor-pointer items-center rounded-[2px] border bg-papier px-5 py-4 transition-colors duration-[120ms] ease-out"
    :class="
      selectionnee
        ? 'border-2 border-laiton'
        : 'border-trait hover:border-encre/30 hover:bg-encre/[0.02]'
    "
  >
    <input
      :id="id"
      :name="nom"
      :value="valeur"
      :checked="selectionnee"
      type="radio"
      class="sr-only"
      @change="$emit('choisir', valeur)"
    />
    <span class="text-base leading-[1.45] text-encre">{{ libelle }}</span>
  </label>
</template>
