import AppDetail from '@/pages/AppDetail.vue'
import Dashboard from '@/pages/Dashboard.vue'
import GroupDetail from '@/pages/GroupDetail.vue'
import NewApp from '@/pages/NewApp.vue'
import NewGroup from '@/pages/NewGroup.vue'
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
      path: '/groups/new',
      name: 'new-group',
      component: NewGroup,
    },
    {
      path: '/groups/:id',
      name: 'group-detail',
      component: GroupDetail,
    },
    {
      path: '/apps/new',
      name: 'new-app',
      component: NewApp,
    },
    {
      path: '/apps/:id',
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
