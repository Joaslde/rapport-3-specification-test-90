<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import EnteteCabinet from '@/components/base/EnteteCabinet.vue'
import OptionReponse from '@/components/quiz/OptionReponse.vue'
import BarreProgression from '@/components/quiz/BarreProgression.vue'
import { useParcours } from '@/stores/parcours'
import { NOMBRE_QUESTIONS } from '@/data/questions'
import { PAYS } from '@/data/pays'
import { CHAMPS_PARTIE_2, SECTEURS } from '@/data/profil'

/*
  Le parcours, écran par écran (spec §16.1 — « une question par écran »).

  Séquence :
    capture (Partie 1, obligatoire)
      → transition section 1 → Q1..Q7
      → transition section 2 → Q8..Q13
      → transition section 3 → Q14..Q18
      → profil (Partie 2, facultatif)
      → résultat

  Aucun retour arrière : c'est ce qui protège la spontanéité.
*/
const router = useRouter()
const parcours = useParcours()

// 'capture' | 'transition' | 'question' | 'profil'
const vue = ref('capture')
const transitionVue = ref(null)
const erreurs = ref({})

const form = ref({ prenom: '', email: '', entreprise: '', pays: '' })
const profilForm = ref({})

onMounted(async () => {
  const reprise = parcours.restaurerLocal()
  if (!parcours.sessionId) await parcours.demarrer()

  if (reprise && parcours.etape === 'questions') {
    form.value = { ...parcours.identite }
    ouvrirQuestionOuTransition()
  } else if (reprise && parcours.etape === 'profil') {
    vue.value = 'profil'
  }
})

// -------------------------------------------------------------------
// Partie 1 — capture obligatoire avant Q1
// -------------------------------------------------------------------
function validerCapture() {
  const e = {}
  if (!form.value.prenom.trim()) e.prenom = 'Ce champ est requis'
  if (!form.value.entreprise.trim()) e.entreprise = 'Ce champ est requis'
  if (!form.value.pays) e.pays = 'Sélectionnez votre pays'

  const email = form.value.email.trim()
  if (!email) e.email = 'Ce champ est requis'
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = 'Adresse email invalide'

  erreurs.value = e
  return Object.keys(e).length === 0
}

async function soumettreCapture() {
  if (!validerCapture()) return
  await parcours.enregistrerIdentite({
    prenom: form.value.prenom.trim(),
    email: form.value.email.trim().toLowerCase(),
    entreprise: form.value.entreprise.trim(),
    pays: form.value.pays,
  })
  ouvrirQuestionOuTransition()
}

// -------------------------------------------------------------------
// Questions et transitions
// -------------------------------------------------------------------
function ouvrirQuestionOuTransition() {
  const t = parcours.transitionCourante
  if (t) {
    transitionVue.value = t
    vue.value = 'transition'
  } else {
    vue.value = 'question'
    parcours.tracer('vue_question', parcours.indexQuestion + 1)
  }
}

function poursuivreApresTransition() {
  transitionVue.value = null
  vue.value = 'question'
  parcours.tracer('vue_question', parcours.indexQuestion + 1)
}

const choixEnCours = ref(null)

async function choisir(valeur) {
  choixEnCours.value = valeur
  // Court délai : l'utilisateur voit sa sélection avant que l'écran ne change.
  await new Promise((r) => setTimeout(r, 180))
  await parcours.repondre(valeur)
  choixEnCours.value = null

  if (parcours.indexQuestion >= NOMBRE_QUESTIONS) {
    vue.value = 'profil'
  } else {
    ouvrirQuestionOuTransition()
  }
}

// -------------------------------------------------------------------
// Partie 2 — profil facultatif
// -------------------------------------------------------------------
async function soumettreProfil() {
  await parcours.enregistrerProfil(profilForm.value)
  await parcours.terminer()
  router.push('/resultat')
}

async function passerProfil() {
  await parcours.terminer()
  router.push('/resultat')
}

const numeroAffiche = computed(() => parcours.indexQuestion + 1)

/** Titre de la section en cours — repère de progression sur chaque écran. */
const sectionCourante = computed(() => {
  const n = numeroAffiche.value
  if (n <= 7) return "L'entreprise sans vous"
  if (n <= 13) return 'Ceux qui vous entourent'
  return 'Vous'
})

// Empêche le retour arrière par le bouton du navigateur (spec §16.1).
watch(
  () => vue.value,
  () => {
    if (vue.value === 'question') history.pushState(null, '', location.href)
  },
)
</script>

<template>
  <div class="min-h-screen">
    <EnteteCabinet compact />

    <main class="mx-auto max-w-[640px] px-6 pt-12 pb-24">
    <!-- ============ PARTIE 1 — capture obligatoire ============ -->
    <section v-if="vue === 'capture'">
      <p class="text-[11px] font-medium tracking-[0.14em] text-gristexte uppercase">
        Avant de commencer
      </p>
      <h1 class="mt-4 font-titre text-[24px] leading-[1.3] font-semibold sm:text-[30px]">
        Quatre informations, pour vous adresser votre rapport.
      </h1>
      <div class="mt-6 h-px w-12 bg-laiton" />

      <form class="mt-10 space-y-6" @submit.prevent="soumettreCapture">
        <BaseInput
          id="prenom"
          v-model="form.prenom"
          label="Prénom"
          autocomplete="given-name"
          :maxlength="80"
          :erreur="erreurs.prenom"
        />
        <BaseInput
          id="email"
          v-model="form.email"
          label="Email professionnel"
          type="email"
          inputmode="email"
          autocomplete="email"
          :maxlength="254"
          :erreur="erreurs.email"
        />
        <BaseInput
          id="entreprise"
          v-model="form.entreprise"
          label="Nom de l'entreprise"
          autocomplete="organization"
          :maxlength="120"
          :erreur="erreurs.entreprise"
        />

        <div>
          <label for="pays" class="block text-[13px] tracking-[0.01em] text-gristexte">
            Pays d'exercice
          </label>
          <select
            id="pays"
            v-model="form.pays"
            class="mt-1 h-[52px] w-full border-0 border-b bg-transparent text-base text-encre outline-none"
            :class="erreurs.pays ? 'border-b-2 border-encre' : 'border-trait focus:border-b-2 focus:border-encre'"
          >
            <option value="" disabled>Sélectionnez</option>
            <option v-for="p in PAYS" :key="p.code" :value="p.code">{{ p.nom }}</option>
          </select>
          <p v-if="erreurs.pays" class="mt-2 text-[13px] text-encre">— {{ erreurs.pays }}</p>
        </div>

        <div class="pt-2">
          <BaseButton type="submit">Continuer</BaseButton>
        </div>
      </form>

      <p class="mt-8 border-t border-trait pt-6 text-[13px] leading-[1.5] text-gristexte">
        Vos réponses sont confidentielles et ne sont jamais transmises à un tiers.
      </p>
    </section>

    <!-- ============ ÉCRAN DE TRANSITION ============ -->
    <section v-else-if="vue === 'transition'" class="flex min-h-[62vh] flex-col justify-center">
      <p class="text-[11px] font-medium tracking-[0.14em] text-gristexte uppercase">
        Section {{ transitionVue.section }} sur 3
      </p>
      <h2 class="mt-4 font-titre text-[28px] leading-[1.2] font-semibold sm:text-[36px]">
        {{ transitionVue.titre }}
      </h2>
      <div class="mt-6 h-px w-12 bg-laiton" />

      <!-- Chaque transition délivre une donnée sourcée : c'est là que se
           construit la crédibilité (spec §16.1). -->
      <p class="mt-8 border-l-2 border-trait pl-6 text-[17px] leading-[1.65] text-encre">
        {{ transitionVue.texte }}
      </p>

      <div class="mt-12">
        <BaseButton @click="poursuivreApresTransition">Continuer</BaseButton>
      </div>
    </section>

    <!-- ============ UNE QUESTION PAR ÉCRAN ============ -->
    <section v-else-if="vue === 'question' && parcours.questionCourante">
      <div class="flex items-baseline justify-between border-b border-trait pb-3">
        <p class="text-[11px] font-medium tracking-[0.14em] text-gristexte uppercase">
          Question {{ numeroAffiche }} sur {{ NOMBRE_QUESTIONS }}
        </p>
        <p class="text-[11px] tracking-[0.08em] text-gristexte uppercase">
          {{ sectionCourante }}
        </p>
      </div>

      <h2
        :key="parcours.questionCourante.id"
        class="mt-8 font-titre text-[24px] leading-[1.3] font-medium tracking-[-0.015em] sm:text-[30px]"
        aria-live="polite"
      >
        {{ parcours.enonceCourant }}
      </h2>

      <p
        v-if="parcours.questionCourante.precision"
        class="mt-4 border-l-2 border-trait pl-4 text-[15px] leading-[1.6] text-gristexte"
      >
        {{ parcours.questionCourante.precision }}
      </p>

      <fieldset class="mt-9 space-y-2">
        <legend class="sr-only">{{ parcours.enonceCourant }}</legend>
        <OptionReponse
          v-for="(option, i) in parcours.questionCourante.options"
          :id="`${parcours.questionCourante.id}-${i}`"
          :key="`${parcours.questionCourante.id}-${i}`"
          :nom="parcours.questionCourante.id"
          :libelle="option"
          :valeur="i"
          :selectionnee="choixEnCours === i"
          @choisir="choisir"
        />
      </fieldset>

      <BarreProgression :valeur="parcours.progression" />
    </section>

    <!-- ============ PARTIE 2 — profil facultatif ============ -->
    <section v-else-if="vue === 'profil'">
      <p class="text-[11px] font-medium tracking-[0.14em] text-gristexte uppercase">
        Dernière étape
      </p>
      <h2 class="mt-4 font-titre text-[26px] leading-[1.25] font-semibold sm:text-[32px]">
        Votre Indice 90 est calculé.
      </h2>
      <div class="mt-6 h-px w-12 bg-laiton" />
      <p class="mt-6 text-[17px] leading-[1.65] text-encre">
        Pour l'interpréter correctement et le comparer à des dirigeants de votre catégorie, ces
        informations nous sont utiles. Elles sont facultatives.
      </p>

      <form class="mt-10 space-y-10" @submit.prevent="soumettreProfil">
        <fieldset v-for="champ in CHAMPS_PARTIE_2" :key="champ.id" class="border-t border-trait pt-6">
          <legend class="pr-3 text-[13px] font-medium tracking-[0.01em] text-encre">
            {{ champ.label }}
          </legend>

          <div v-if="champ.type === 'radio'" class="mt-4 space-y-2">
            <OptionReponse
              v-for="(o, i) in champ.options"
              :id="`${champ.id}-${i}`"
              :key="o.valeur"
              :nom="champ.id"
              :libelle="o.libelle"
              :valeur="i"
              :selectionnee="profilForm[champ.id] === o.valeur"
              @choisir="profilForm[champ.id] = o.valeur"
            />
          </div>

          <select
            v-else
            :id="champ.id"
            v-model="profilForm[champ.id]"
            class="mt-2 h-[52px] w-full border-0 border-b border-trait bg-transparent text-base text-encre outline-none focus:border-b-2 focus:border-encre"
          >
            <option value="" disabled selected>Sélectionnez</option>
            <option v-for="s in SECTEURS" :key="s.valeur" :value="s.valeur">{{ s.libelle }}</option>
          </select>
        </fieldset>

        <div class="space-y-3 border-t border-trait pt-8">
          <BaseButton type="submit">Voir mon résultat</BaseButton>
          <BaseButton variante="secondaire" @click="passerProfil">Passer cette étape</BaseButton>
        </div>
      </form>
    </section>
    </main>
  </div>
</template>
