// sys public platform
import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const sysRoutes: RouteConfig[] = [
  {
    path: '/sys/components',
    component: Layout,
    redirect: '/sys/components/list',
    name: 'sysComponents',
    meta: {
      title: 'route.orderManager',
      icon: 'user'
    },
    children: [
      {
        path: '/sys/components/list',
        component: () => import(/* webpackChunkName: "orderlist" */ '@/views/sys/components/list.vue'),
        name: 'sysComponentsList',
        meta: {
          activeMenu: '/sys/components',
          noCache: true,
          breadcrumb: false,
          roles: ['admin']
        }
      },
      {
        path: '/sys/components/create',
        component: () => import(/* webpackChunkName: "organization-create" */ '@/views/sys/components/detail.vue'),
        name: 'sysComponentsCreate',
        meta: {
          title: '新增组件',
          noCache: true,
          activeMenu: '/sys/components',
          hidden: true
        }
      },
      {
        path: '/sys/components/detail/:id',
        component: () => import(/* webpackChunkName: "sys-Components-detail" */ '@/views/sys/components/detail.vue'),
        name: 'sysComponentsDetail',
        meta: {
          title: '组件详情',
          noCache: true,
          activeMenu: '/sys/components',
          hidden: true
        }
      }
    ]
  }
]

export default sysRoutes
