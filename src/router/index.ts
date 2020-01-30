import AppDetail from '@/pages/AppDetail.vue'
import Dashboard from '@/pages/Dashboard.vue'
import NewApp from '@/pages/NewApp.vue'
import Output from '@/pages/Output.vue'
import Settings from '@/pages/Settings.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/dashboard/new-app',
      name: 'new-app',
      component: NewApp,
    },
    {
      path: '/dashboard/apps/:id',
      name: 'app-detail',
      component: AppDetail,
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    {
      path: '/output/:id',
      component: Output,
    },
    {
      path: '*',
      redirect: '/dashboard',
    },
  ],
})

export default router
