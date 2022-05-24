// 用户管理
import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const userRouter: RouteConfig = {
  path: '/user',
  component: Layout,
  redirect: '/user/list',
  name: 'userManager',
  meta: {
    title: 'route.userManager',
    icon: 'user'
  },
  children: [
    {
      path: '/user/list',
      component: () => import(/* webpackChunkName: "userlist" */ '@/views/user/list.vue'),
      name: 'userManager',
      meta: {
        title: '用户查询',
        activeMenu: '/user',
        noCache: true,
        breadcrumb: false,
        roles: ['admin']
      }
    },
    {
      path: '/user/create',
      component: () => import(/* webpackChunkName: "userlist" */ '@/views/user/create.vue'),
      name: 'usercreate',
      meta: {
        title: 'route.usercreate',
        noCache: true,
        activeMenu: '/user',
        hidden: true
      }
    },
    {
      path: '/user/edit',
      component: () => import(/* webpackChunkName: "userlist" */ '@/views/user/edit.vue'),
      name: 'useredit',
      meta: {
        title: 'route.useredit',
        noCache: true,
        activeMenu: '/user',
        hidden: true
      }
    },
    {
      path: '/user/user-relation-company',
      component: () => import(/* webpackChunkName: "user-relation-company" */ '@/views/user/user-relation-company.vue'),
      name: 'usercreate',
      meta: {
        title: 'route.userRelationCompany',
        noCache: true,
        activeMenu: '/user',
        hidden: true
      }
    }
  ]
}

export default userRouter
