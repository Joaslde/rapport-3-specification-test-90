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
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
