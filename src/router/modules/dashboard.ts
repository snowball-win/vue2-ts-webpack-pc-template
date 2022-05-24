// 用户管理
import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const dashboardRouter: RouteConfig = {
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  meta: {
    // title: 'route.dashboard',
    icon: 'dashboard',
    limit: 2,
    affix: true
  },
  children: [
    {
      path: '/dashboard',
      component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
      name: 'Dashboard',
      meta: {
        title: 'route.dashboard',
        icon: 'dashboard',
        activeMenu: '/dashboard',
        affix: true
      }
    }
  ]
}

export default dashboardRouter
