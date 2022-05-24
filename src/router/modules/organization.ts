// 机构管理organization
import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const userRouter: RouteConfig = {
  path: '/organization',
  component: Layout,
  redirect: '/organization/list',
  name: 'organizationManager',
  meta: {
    title: 'route.organizationManager',
    icon: 'user'
  },
  children: [
    {
      path: '/organization/list',
      component: () => import(/* webpackChunkName: "organizationlist" */ '@/views/organization/list.vue'),
      name: 'organizationlist',
      meta: {
        title: '机构查询',
        noCache: true,
        activeMenu: '/organization',
        breadcrumb: false,
        roles: ['admin']
      }
    },
    {
      path: '/organization/create',
      component: () => import(/* webpackChunkName: "organization-create" */ '@/views/organization/edit.vue'),
      name: 'organizationCreate',
      meta: {
        title: 'route.organizationCreate',
        noCache: true,
        activeMenu: '/organization',
        hidden: true
      }
    },
    {
      path: '/organization/edit',
      component: () => import(/* webpackChunkName: "organization-create" */ '@/views/organization/edit.vue'),
      name: 'organizationEdit',
      meta: {
        title: 'route.organizationEdit',
        noCache: true,
        activeMenu: '/organization',
        hidden: true
      }
    },
    {
      path: '/organization/staff',
      component: () => import(/* webpackChunkName: "organization-staff" */ '@/views/organization/staff/list.vue'),
      name: 'organizationStaff',
      meta: {
        title: 'route.organizationStaff',
        noCache: true,
        activeMenu: '/organization',
        hidden: true
      }
    },
    {
      path: '/organization/staff/create',
      component: () => import(/* webpackChunkName: "organization-staff-create" */ '@/views/organization/staff/create.vue'),
      name: 'organizationStaffCreate',
      meta: {
        title: 'route.organizationStaffCreate',
        activeMenu: '/organization',
        noCache: true,
        hidden: true
      }
    },
    {
      path: '/organization/staff/list',
      component: () => import(/* webpackChunkName: "organization-staff-list" */ '@/views/organization/staff/list.vue'),
      name: 'organizationStaffList',
      meta: {
        title: 'route.organizationStaffList',
        activeMenu: '/organization',
        noCache: true,
        hidden: true
      }
    },
    {
      path: '/organization/staff/edit',
      component: () => import(/* webpackChunkName: "organization-staff-create" */ '@/views/organization/staff/edit.vue'),
      name: 'organizationStaffEdit',
      meta: {
        title: 'route.organizationStaffEdit',
        activeMenu: '/organization',
        noCache: true,
        hidden: true
      }
    }
  ]
}

export default userRouter
