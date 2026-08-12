import { createRouter, createWebHistory } from 'vue-router'

/*
  Mode history obligatoire : URLs propres, jamais de .html
  Exigence manager : un seul mot-cle colle, pas de mot compose.
  domaine.com/quiz  et non  domaine.com/quiz.html ni /mon-quiz
*/

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'accueil',
      component: () => import('@/views/AccueilView.vue'),
    },
    {
      // Alias de la route ci-dessus. Ce chemin est celui utilisé par le site vitrine
      // (cabinetlequart.com/faire-le-point/test), via un rewrite Vercel qui délègue
      // vers ce projet — voir vercel.json et docs/vercel-json-notes.md du site vitrine.
      // Sans cette route, le fallback /:pathMatch(.*)* ci-dessous réécrivait l'URL du
      // navigateur en "/" dès l'hydratation, rendant le lien impossible à partager.
      // Ajouté le 12 août 2026, à la demande explicite du responsable du site vitrine.
      path: '/faire-le-point/test',
      name: 'accueil-site-vitrine',
      component: () => import('@/views/AccueilView.vue'),
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: () => import('@/views/QuizView.vue'),
    },
    {
      path: '/resultat',
      name: 'resultat',
      component: () => import('@/views/ResultatView.vue'),
    },
    {
      path: '/rapport',
      name: 'rapport',
      component: () => import('@/views/RapportView.vue'),
    },
    {
      // Back-office interne : liste des tests passés et rapports envoyés.
      // Protégé par mot de passe (Edge Function admin-resultats), pas par
      // Supabase Auth — décision utilisateur du 4 août 2026.
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
