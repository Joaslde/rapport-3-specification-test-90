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

/*
  ── Onglets (25 août 2026) ──
  Le back-office couvre désormais trois sources : les tests passés, la liste
  d'attente VIGIE et les messages de contact. Ces deux dernières viennent du site
  vitrine (cabinetlequart.com) et écrivent dans le même projet Supabase.

  Chaque onglet charge ses données à sa première ouverture seulement.
*/
const onglet = ref('tests')
const dejaCharges = ref({ vigie: false, messages: false })

async function ouvrirOnglet(nom) {
  onglet.value = nom
  if (nom === 'vigie' && !dejaCharges.value.vigie) {
    await admin.chargerVigie()
    dejaCharges.value.vigie = true
  }
  if (nom === 'messages' && !dejaCharges.value.messages) {
    await admin.chargerMessages()
    dejaCharges.value.messages = true
  }
}

/*
  ── Messagerie ──
  Un message ouvert s'affiche dans un panneau défilant : les messages peuvent être
  longs, et les tronquer dans une ligne de tableau obligerait à les copier ailleurs
  pour les lire.
*/
const messageOuvert = ref(null)

function ouvrirMessage(message) {
  messageOuvert.value = message
  if (!message.lu) admin.marquerLu(message.id)
}

function fermerMessage() {
  messageOuvert.value = null
}

/** Première lettre du prénom et du nom, pour la pastille de chaque ligne. */
function initiales(message) {
  const p = (message.prenom || '').trim()[0] ?? ''
  const n = (message.nom || '').trim()[0] ?? ''
  return (p + n).toUpperCase() || '—'
}

/** Aperçu d'une ligne : le message sur une seule ligne, coupé s'il est long. */
function apercu(texte) {
  const plat = String(texte ?? '').replace(/\s+/g, ' ').trim()
  return plat.length > 110 ? plat.slice(0, 110) + '…' : plat
}

/*
  Date relative, comme dans une messagerie : « 14:32 » aujourd'hui, « hier »,
  puis la date courte. Lire « il y a 3 jours » demande moins d'effort qu'une date
  absolue quand on parcourt une liste.
*/
function dateRelative(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const maintenant = new Date()
  const memeJour = d.toDateString() === maintenant.toDateString()
  if (memeJour) {
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
  const hier = new Date(maintenant)
  hier.setDate(hier.getDate() - 1)
  if (d.toDateString() === hier.toDateString()) return 'Hier'
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

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
            <h1 class="mt-2 font-titre text-[26px] font-semibold">
              {{ onglet === 'tests' ? 'Résultats du test'
                : onglet === 'vigie' ? 'Liste d’attente VIGIE'
                : 'Messages reçus' }}
            </h1>
          </div>
          <button class="text-[13px] text-gristexte hover:text-encre" @click="admin.deconnecter">
            Se déconnecter
          </button>
        </div>

        <!--
          Onglets. Filet Laiton sous l'onglet actif — le même code que les titres
          de section du site, pour que le back-office reste dans la charte.
        -->
        <nav class="mt-8 flex gap-8 border-b border-trait">
          <button
            v-for="t in [
              { id: 'tests', libelle: 'Tests' },
              { id: 'vigie', libelle: 'Liste VIGIE' },
              { id: 'messages', libelle: 'Messages' },
            ]"
            :key="t.id"
            class="relative -mb-px border-b-2 pb-3 text-[13px] tracking-[0.04em] uppercase transition-colors"
            :class="onglet === t.id
              ? 'border-laiton font-medium text-encre'
              : 'border-transparent text-gristexte hover:text-encre'"
            @click="ouvrirOnglet(t.id)"
          >
            {{ t.libelle }}
            <!-- Pastille de messages non lus : un chiffre, pas une couleur d'alerte. -->
            <span
              v-if="t.id === 'messages' && admin.messagesNonLus > 0"
              class="ml-2 inline-block min-w-[18px] rounded-full bg-encre px-1.5 py-0.5 text-[10px] leading-none text-papier"
            >
              {{ admin.messagesNonLus }}
            </span>
          </button>
        </nav>

        <!-- ============ ONGLET : TESTS ============ -->
        <div v-if="onglet === 'tests'">

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
        <!-- ============ FIN ONGLET : TESTS ============ -->

        <!-- ============ ONGLET : LISTE VIGIE ============ -->
        <div v-else-if="onglet === 'vigie'">
          <div class="mt-8 flex items-baseline justify-between border-b border-trait pb-4">
            <p class="text-sm text-gristexte">
              <span class="font-titre text-2xl font-semibold text-encre">
                {{ admin.inscritsVigie.length }}
              </span>
              <span class="ml-2">
                {{ admin.inscritsVigie.length > 1 ? 'personnes inscrites' : 'personne inscrite' }}
              </span>
            </p>
            <button
              class="text-[13px] text-gristexte hover:text-encre"
              :disabled="admin.chargement"
              @click="admin.chargerVigie"
            >
              {{ admin.chargement ? 'Actualisation…' : 'Actualiser' }}
            </button>
          </div>

          <p class="mt-4 text-[13px] leading-relaxed text-gristexte">
            Inscriptions déposées depuis la page VIGIE de cabinetlequart.com. Aucun paiement
            n’est demandé : ces personnes seront prévenues au lancement, prévu au premier
            trimestre 2027.
          </p>

          <div class="mt-6 overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead>
                <tr class="border-b border-trait text-[11px] tracking-[0.06em] text-gristexte uppercase">
                  <th class="py-3 pr-4">Date</th>
                  <th class="py-3 pr-4">Prénom</th>
                  <th class="py-3 pr-4">Nom</th>
                  <th class="py-3">Courriel</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="i in admin.inscritsVigie"
                  :key="i.id"
                  class="border-b border-trait/60 hover:bg-encre/[0.02]"
                >
                  <td class="py-3 pr-4 whitespace-nowrap text-gristexte">
                    {{ formaterDate(i.cree_le) }}
                  </td>
                  <td class="py-3 pr-4">{{ i.prenom }}</td>
                  <td class="py-3 pr-4">{{ i.nom }}</td>
                  <td class="py-3">
                    <a :href="`mailto:${i.courriel}`" class="text-encre underline">{{ i.courriel }}</a>
                  </td>
                </tr>
                <tr v-if="!admin.inscritsVigie.length">
                  <td colspan="4" class="py-10 text-center text-gristexte">
                    Personne ne s’est encore inscrit.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ============ ONGLET : MESSAGES ============ -->
        <!--
          Vue de type messagerie : une bande par message, cliquable, qui ouvre un
          panneau défilant. Demandé explicitement — les messages peuvent être longs
          et ne tiennent pas dans une cellule de tableau.
        -->
        <div v-else>
          <div class="mt-8 flex items-baseline justify-between border-b border-trait pb-4">
            <p class="text-sm text-gristexte">
              <span class="font-titre text-2xl font-semibold text-encre">
                {{ admin.messages.length }}
              </span>
              <span class="ml-2">
                {{ admin.messages.length > 1 ? 'messages' : 'message' }}
              </span>
              <span v-if="admin.messagesNonLus > 0" class="ml-2 text-encre">
                · {{ admin.messagesNonLus }} non {{ admin.messagesNonLus > 1 ? 'lus' : 'lu' }}
              </span>
            </p>
            <button
              class="text-[13px] text-gristexte hover:text-encre"
              :disabled="admin.chargement"
              @click="admin.chargerMessages"
            >
              {{ admin.chargement ? 'Actualisation…' : 'Actualiser' }}
            </button>
          </div>

          <ul class="mt-6">
            <li v-for="m in admin.messages" :key="m.id">
              <button
                class="flex w-full items-start gap-4 border-b border-trait/60 py-4 text-left transition-colors hover:bg-encre/[0.02]"
                @click="ouvrirMessage(m)"
              >
                <!-- Pastille d'initiales : repère visuel, aucune image à charger. -->
                <span
                  class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-medium"
                  :class="m.lu ? 'bg-trait text-gristexte' : 'bg-encre text-papier'"
                >
                  {{ initiales(m) }}
                </span>

                <span class="min-w-0 flex-1">
                  <span class="flex items-baseline justify-between gap-4">
                    <span class="truncate" :class="m.lu ? 'text-encre' : 'font-medium text-encre'">
                      {{ m.prenom }} {{ m.nom }}
                    </span>
                    <span class="shrink-0 text-[12px] whitespace-nowrap text-gristexte">
                      {{ dateRelative(m.cree_le) }}
                    </span>
                  </span>

                  <span class="mt-0.5 block text-[12px] text-gristexte">{{ m.categorie }}</span>

                  <span
                    class="mt-1 block truncate text-[13px]"
                    :class="m.lu ? 'text-gristexte' : 'text-encre'"
                  >
                    {{ apercu(m.message) }}
                  </span>
                </span>

                <!-- Point plein : non lu. Rien : lu. Pas de couleur d'alerte (§19). -->
                <span
                  v-if="!m.lu"
                  class="mt-4 h-2 w-2 shrink-0 rounded-full bg-laiton"
                  aria-label="Non lu"
                />
              </button>
            </li>

            <li v-if="!admin.messages.length" class="py-10 text-center text-gristexte">
              Aucun message reçu.
            </li>
          </ul>
        </div>
      </div>
    </main>

    <!-- ============ PANNEAU DE LECTURE D'UN MESSAGE ============ -->
    <!--
      Même motif que le panneau de détail : voile sombre, panneau à droite,
      fermeture au clic à côté ou sur Échap. Le corps du message défile seul,
      l'en-tête reste visible — un message long ne fait pas perdre l'expéditeur.
    -->
    <div
      v-if="messageOuvert"
      class="fixed inset-0 z-10 bg-encre/40"
      @click.self="fermerMessage"
      @keydown.esc="fermerMessage"
    >
      <div class="ml-auto flex h-full w-full max-w-lg flex-col bg-papier shadow-xl">
        <!-- En-tête fixe -->
        <div class="shrink-0 border-b border-trait px-8 pt-10 pb-6">
          <button class="text-[13px] text-gristexte hover:text-encre" @click="fermerMessage">
            ← Fermer
          </button>

          <div class="mt-6 flex items-start gap-4">
            <span
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-encre text-[15px] font-medium text-papier"
            >
              {{ initiales(messageOuvert) }}
            </span>
            <div class="min-w-0">
              <h2 class="font-titre text-xl font-semibold">
                {{ messageOuvert.prenom }} {{ messageOuvert.nom }}
              </h2>
              <p class="mt-1 text-[13px] break-all text-gristexte">
                <a :href="`mailto:${messageOuvert.courriel}`" class="underline">
                  {{ messageOuvert.courriel }}
                </a>
              </p>
            </div>
          </div>

          <dl class="mt-6 space-y-2 text-[13px]">
            <div class="flex justify-between gap-4">
              <dt class="shrink-0 text-gristexte">Vous êtes</dt>
              <dd class="min-w-0 text-right break-words">{{ messageOuvert.categorie }}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="shrink-0 text-gristexte">Reçu le</dt>
              <dd class="min-w-0 text-right">{{ formaterDate(messageOuvert.cree_le) }}</dd>
            </div>
          </dl>
        </div>

        <!-- Corps du message : la seule zone qui défile -->
        <div class="min-h-0 flex-1 overflow-y-auto px-8 py-6">
          <p class="text-[11px] font-medium tracking-[0.14em] text-gristexte uppercase">
            Message
          </p>
          <!--
            `whitespace-pre-wrap` conserve les retours à la ligne saisis par
            l'expéditeur : un message structuré en paragraphes le reste.
          -->
          <p class="mt-4 text-[15px] leading-[1.7] whitespace-pre-wrap">
            {{ messageOuvert.message }}
          </p>
        </div>

        <!-- Pied fixe : répondre par le client de messagerie du poste -->
        <div class="shrink-0 border-t border-trait px-8 py-5">
          <a
            :href="`mailto:${messageOuvert.courriel}?subject=${encodeURIComponent('Votre message au cabinet Le Quart')}`"
            class="inline-block border border-encre px-5 py-2.5 text-[13px] tracking-[0.04em] text-encre uppercase transition-colors hover:bg-encre hover:text-papier"
          >
            Répondre
          </a>
        </div>
      </div>
    </div>

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
