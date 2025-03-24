import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    redirect: '/poster-creator'
  },
  {
    path: '/poster-creator',
    name: 'posterCreator',
    component: () => import('../components/poster/PosterCreator.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 