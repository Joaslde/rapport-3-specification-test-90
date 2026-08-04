<script setup>
/*
  Champ de saisie. docs/design-pattern.md §6.4
  Bordure basse uniquement. Message d'erreur en Encre — JAMAIS en rouge.
*/
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  erreur: { type: String, default: '' },
  autocomplete: { type: String, default: 'off' },
  maxlength: { type: Number, default: 200 },
  // 'email' / 'tel' / 'numeric' ... — clavier mobile adapté au contenu attendu.
  inputmode: { type: String, default: undefined },
})

const valeur = defineModel({ type: String, default: '' })
</script>

<template>
  <div>
    <label :for="id" class="block text-[13px] tracking-[0.01em] text-gristexte">
      {{ label }}
    </label>
    <input
      :id="id"
      v-model="valeur"
      :type="type"
      :inputmode="inputmode"
      :autocomplete="autocomplete"
      :maxlength="maxlength"
      :aria-invalid="Boolean(erreur)"
      :aria-describedby="erreur ? `${id}-erreur` : undefined"
      class="mt-1 h-[52px] w-full border-0 border-b bg-transparent text-base text-encre outline-none transition-colors"
      :class="erreur ? 'border-b-2 border-encre' : 'border-trait focus:border-b-2 focus:border-encre'"
    />
    <!-- role=alert : annoncé aux lecteurs d'écran sans attendre un nouveau focus. -->
    <p
      v-if="erreur"
      :id="`${id}-erreur`"
      role="alert"
      class="mt-2 text-[13px] text-encre"
    >
      — {{ erreur }}
    </p>
  </div>
</template>
