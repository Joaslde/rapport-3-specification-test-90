<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdmin } from '@/stores/admin'
import EnteteCabinet from '@/components/base/EnteteCabinet.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'

/*
  Back-office — récapitulatif des tests passés et rapports envoyés.
  Protégé par mot de passe unique (décision utilisateur du 4 août 2026).
  Toute la sécurité réelle est côté serveur (Edge Function admin-resultats) :
  cette page ne fait qu'afficher ce que le serveur accepte de renvoyer.
*/
const admin = useAdmin()
const saisie = ref('')
const detailOuvert = ref(null)
const chargementDetail = ref(false)
const filtre = ref('')
const lienCopie = ref(false)

const lienRapport = computed(() => {
  if (!detailOuvert.value?.token_rapport) return ''
  return `${window.location.origin}/rapport?t=${detailOuvert.value.token_rapport}`
})

async function copierLien() {
  await navigator.clipboard.writeText(lienRapport.value)
  lienCopie.value = true
  setTimeout(() => (lienCopie.value = false), 2000)
}

onMounted(() => admin.tenterReprise())

async function soumettre() {
  await admin.connecter(saisie.value)
}

async function ouvrirDetail(id) {
  chargementDetail.value = true
  detailOuvert.value = await admin.chargerDetail(id)
  chargementDetail.value = false
}

function fermerDetail() {
  detailOuvert.value = null
}

const resultatsFiltres = computed(() => {
  const f = filtre.value.trim().toLowerCase()
  if (!f) return admin.resultats
  return admin.resultats.filter(
    (r) =>
      r.prenom.toLowerCase().includes(f) ||
      r.entreprise.toLowerCase().includes(f) ||
      r.email.toLowerCase().includes(f),
  )
})

const stats = computed(() => {
  const rs = admin.resultats
  return {
    total: rs.length,
    envoyes: rs.filter((r) => r.rapportEnvoye).length,
    protocole: rs.filter((r) => r.protocoleSecurite).length,
    ok: rs.filter((r) => r.qualite === 'ok').length,
  }
})

function formaterDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const NIVEAUX_LIBELLES = {
  defaillance_unique: 'Point de défaillance unique',
  centre_nevralgique: 'Centre névralgique',
  transition_inachevee: 'Transition inachevée',
  structure_emergente: 'Structure émergente',
  entreprise_transferable: 'Entreprise transférable',
}
</script>

<template>
  <div class="min-h-screen">
    <EnteteCabinet compact />

    <main class="mx-auto max-w-5xl px-6 py-12">
      <!-- ============ ÉCRAN DE CONNEXION ============ -->
      <div v-if="!admin.authentifie" class="mx-auto max-w-sm py-16">
        <p class="text-[11px] font-medium tracking-[0.14em] text-gristexte uppercase">
          Back-office
        </p>
        <h1 class="mt-4 font-titre text-[24px] font-semibold">Résultats du test</h1>
        <div class="mt-6 h-px w-12 bg-laiton" />

        <form class="mt-10 space-y-6" @submit.prevent="soumettre">
          <BaseInput
            id="mdp"
            v-model="saisie"
            label="Mot de passe"
            type="password"
            :erreur="admin.erreur"
          />
          <BaseButton type="submit" :desactive="admin.chargement">
            {{ admin.chargement ? 'Connexion…' : 'Entrer' }}
          </BaseButton>
        </form>
      </div>

      <!-- ============ TABLEAU DE BORD ============ -->
      <div v-else>
        <div class="flex items-baseline justify-between">
          <div>
            <p class="text-[11px] font-medium tracking-[0.14em] text-gristexte uppercase">
              Back-office
            </p>
            <h1 class="mt-2 font-titre text-[26px] font-semibold">Résultats du test</h1>
          </div>
          <button class="text-[13px] text-gristexte hover:text-encre" @click="admin.deconnecter">
            Se déconnecter
          </button>
        </div>

        <!-- Repères chiffrés -->
        <div class="mt-8 grid grid-cols-4 border-y border-trait text-center">
          <div class="border-r border-trait py-4">
            <p class="font-titre text-2xl font-semibold">{{ stats.total }}</p>
            <p class="mt-1 text-[11px] text-gristexte uppercase">Tests</p>
          </div>
          <div class="border-r border-trait py-4">
            <p class="font-titre text-2xl font-semibold">{{ stats.envoyes }}</p>
            <p class="mt-1 text-[11px] text-gristexte uppercase">Rapports envoyés</p>
          </div>
          <div class="border-r border-trait py-4">
            <p class="font-titre text-2xl font-semibold">{{ stats.protocole }}</p>
            <p class="mt-1 text-[11px] text-gristexte uppercase">Protocole sécurité</p>
          </div>
          <div class="py-4">
            <p class="font-titre text-2xl font-semibold">{{ stats.ok }}</p>
            <p class="mt-1 text-[11px] text-gristexte uppercase">Qualité "ok"</p>
          </div>
        </div>

        <div class="mt-6 flex items-center gap-4">
          <input
            v-model="filtre"
            type="text"
            placeholder="Filtrer par prénom, entreprise ou email…"
            class="h-11 flex-1 border-0 border-b border-trait bg-transparent text-sm outline-none focus:border-b-2 focus:border-encre"
          />
          <button
            class="text-[13px] text-gristexte hover:text-encre"
            :disabled="admin.chargement"
            @click="admin.rafraichir"
          >
            {{ admin.chargement ? 'Actualisation…' : 'Actualiser' }}
          </button>
        </div>

        <!-- Tableau -->
        <div class="mt-6 overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-trait text-[11px] tracking-[0.06em] text-gristexte uppercase">
                <th class="py-3 pr-4">Date</th>
                <th class="py-3 pr-4">Prénom</th>
                <th class="py-3 pr-4">Entreprise</th>
                <th class="py-3 pr-4">Pays</th>
                <th class="py-3 pr-4 text-right">Indice</th>
                <th class="py-3 pr-4 text-right">Jours</th>
                <th class="py-3 pr-4">Niveau</th>
                <th class="py-3 pr-4">Rapport</th>
                <th class="py-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="r in resultatsFiltres"
                :key="r.id"
                class="border-b border-trait/60 hover:bg-encre/[0.02]"
              >
                <td class="py-3 pr-4 whitespace-nowrap text-gristexte">
                  {{ formaterDate(r.dateCreation) }}
                </td>
                <td class="py-3 pr-4">{{ r.prenom || '—' }}</td>
                <td class="py-3 pr-4">{{ r.entreprise || '—' }}</td>
                <td class="py-3 pr-4">{{ r.pays || '—' }}</td>
                <td class="py-3 pr-4 text-right font-medium">{{ r.indice90 }}</td>
                <td class="py-3 pr-4 text-right">{{ r.jours }}</td>
                <td class="py-3 pr-4 text-gristexte">
                  {{ NIVEAUX_LIBELLES[r.niveau] ?? r.niveau }}
                </td>
                <td class="py-3 pr-4">
                  <span v-if="r.protocoleSecurite" class="text-[12px] text-laiton">
                    Protocole sécurité
                  </span>
                  <span v-else-if="r.rapportEnvoye" class="text-[12px] text-gristexte">
                    Envoyé {{ formaterDate(r.dateEnvoi) }}
                  </span>
                  <span v-else class="text-[12px] text-gristexte">Non envoyé</span>
                </td>
                <td class="py-3 text-right">
                  <button class="text-[13px] text-encre underline" @click="ouvrirDetail(r.id)">
                    Détail
                  </button>
                </td>
              </tr>
              <tr v-if="!resultatsFiltres.length">
                <td colspan="9" class="py-10 text-center text-gristexte">Aucun résultat.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- ============ PANNEAU DE DÉTAIL ============ -->
    <div
      v-if="detailOuvert || chargementDetail"
      class="fixed inset-0 z-10 bg-encre/40"
      @click.self="fermerDetail"
    >
      <div
        class="ml-auto h-full w-full max-w-lg overflow-x-hidden overflow-y-auto bg-papier px-8 py-10 shadow-xl"
      >
        <button class="text-[13px] text-gristexte hover:text-encre" @click="fermerDetail">
          ← Fermer
        </button>

        <p v-if="chargementDetail" class="mt-10 text-gristexte">Chargement…</p>

        <div v-else-if="detailOuvert" class="mt-6">
          <p class="text-[11px] font-medium tracking-[0.14em] text-gristexte uppercase">
            {{ detailOuvert.sessions?.entreprise }}
          </p>
          <h2 class="mt-2 font-titre text-2xl font-semibold">{{ detailOuvert.sessions?.prenom }}</h2>
          <p class="mt-1 text-[13px] text-gristexte">{{ detailOuvert.sessions?.email }}</p>

          <div class="mt-6 h-px w-12 bg-laiton" />

          <div class="mt-6 flex items-baseline gap-3">
            <span class="font-titre text-5xl font-semibold">{{ detailOuvert.indice90 }}</span>
            <span class="text-gristexte">/ 100 · {{ detailOuvert.jours }} jours</span>
          </div>

          <div v-if="detailOuvert.protocole_securite" class="mt-4 bg-encre/[0.04] px-4 py-3 text-[13px] text-encre">
            ⚠ Protocole de sécurité actif sur ce résultat.
          </div>

          <dl class="mt-8 space-y-3 text-sm">
            <div class="flex justify-between gap-4 border-b border-trait pb-2">
              <dt class="shrink-0 text-gristexte">Niveau</dt>
              <dd class="min-w-0 text-right break-words">
                {{ NIVEAUX_LIBELLES[detailOuvert.niveau_id] ?? detailOuvert.niveau_id }}
              </dd>
            </div>
            <div class="flex justify-between gap-4 border-b border-trait pb-2">
              <dt class="shrink-0 text-gristexte">Archétype</dt>
              <dd class="min-w-0 text-right break-words">
                {{ detailOuvert.archetype_id }}
                <span v-if="detailOuvert.archetype_provisoire" class="text-laiton">(provisoire)</span>
              </dd>
            </div>
            <div class="flex justify-between gap-4 border-b border-trait pb-2">
              <dt class="shrink-0 text-gristexte">Axe 1 — Entreprise</dt>
              <dd class="min-w-0 text-right break-words">{{ detailOuvert.score_a1 }} / 100</dd>
            </div>
            <div class="flex justify-between gap-4 border-b border-trait pb-2">
              <dt class="shrink-0 text-gristexte">Axe 2 — Entourage</dt>
              <dd class="min-w-0 text-right break-words">{{ detailOuvert.score_a2 }} / 100</dd>
            </div>
            <div class="flex justify-between gap-4 border-b border-trait pb-2">
              <dt class="shrink-0 text-gristexte">Axe 3 — Vous</dt>
              <dd class="min-w-0 text-right break-words">{{ detailOuvert.score_a3 }} / 100</dd>
            </div>
            <div class="flex justify-between gap-4 border-b border-trait pb-2">
              <dt class="shrink-0 text-gristexte">Pays</dt>
              <dd class="min-w-0 text-right break-words">{{ detailOuvert.sessions?.pays || '—' }}</dd>
            </div>
            <div class="flex justify-between gap-4 border-b border-trait pb-2">
              <dt class="shrink-0 text-gristexte">Chiffre d'affaires</dt>
              <dd class="min-w-0 text-right break-words">
                {{ detailOuvert.sessions?.chiffre_affaires || '—' }}
              </dd>
            </div>
            <div class="flex justify-between gap-4 border-b border-trait pb-2">
              <dt class="shrink-0 text-gristexte">Effectif</dt>
              <dd class="min-w-0 text-right break-words">{{ detailOuvert.sessions?.effectif || '—' }}</dd>
            </div>
            <div class="flex justify-between gap-4 border-b border-trait pb-2">
              <dt class="shrink-0 text-gristexte">Événement récent</dt>
              <dd class="min-w-0 text-right break-words">
                {{ detailOuvert.sessions?.evenement_recent || '—' }}
              </dd>
            </div>
            <div class="flex justify-between gap-4 border-b border-trait pb-2">
              <dt class="shrink-0 text-gristexte">Rapport envoyé</dt>
              <dd class="min-w-0 text-right break-words">
                {{ detailOuvert.rapport_envoye_le ? formaterDate(detailOuvert.rapport_envoye_le) : 'Non' }}
              </dd>
            </div>
            <div class="flex justify-between gap-4 border-b border-trait pb-2">
              <dt class="shrink-0 text-gristexte">Test démarré</dt>
              <dd class="min-w-0 text-right break-words">
                {{ formaterDate(detailOuvert.sessions?.demarre_le) }}
              </dd>
            </div>
          </dl>

          <div v-if="detailOuvert.incoherences?.length" class="mt-8">
            <p class="text-[11px] font-medium tracking-[0.14em] text-gristexte uppercase">
              Incohérences détectées
            </p>
            <p v-for="(inc, i) in detailOuvert.incoherences" :key="i" class="mt-2 text-[13px]">
              {{ inc.nom }}
            </p>
          </div>

          <div class="mt-8 min-w-0">
            <p class="text-[11px] font-medium tracking-[0.14em] text-gristexte uppercase">
              Lien du rapport web
            </p>
            <p class="mt-2 min-w-0 text-[12px] break-all text-gristexte">
              {{ lienRapport }}
            </p>
            <div class="mt-3 flex gap-3">
              <button
                type="button"
                class="flex items-center gap-1.5 border border-trait px-3 py-1.5 text-[12px] text-encre hover:border-encre/40"
                @click="copierLien"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <rect x="9" y="9" width="13" height="13" rx="1" />
                  <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
                </svg>
                {{ lienCopie ? 'Copié' : 'Copier' }}
              </button>
              <a
                :href="lienRapport"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-1.5 border border-trait px-3 py-1.5 text-[12px] text-encre hover:border-encre/40"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <path d="M15 3h6v6" />
                  <path d="M10 14 21 3" />
                </svg>
                Ouvrir
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
