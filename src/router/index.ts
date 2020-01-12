import Dashboard from '@/pages/Dashboard.vue'
import NewApp from '@/pages/NewApp.vue'
import Settings from '@/pages/Settings.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/dashboard',
      component: Dashboard,
    },
    {
      path: '/dashboard/new-app',
      component: NewApp,
    },
    {
      path: '/settings',
      component: Settings,
    },
    {
      path: '*',
      redirect: '/dashboard',
    },
  ],
})

export default router
