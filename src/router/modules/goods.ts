// 商品管理goods
import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const userRouter: RouteConfig = {
  path: '/goods',
  component: Layout,
  redirect: '/goods/list',
  name: 'goodsManager',
  meta: {
    title: 'route.goodsManager',
    icon: 'user'
  },
  children: [
    {
      path: '/goods/list',
      component: () => import(/* webpackChunkName: "goodslist" */ '@/views/goods/list.vue'),
      name: 'goodslist',
      meta: {
        title: 'route.goodsList',
        noCache: true,
        activeMenu: '/goods',
        breadcrumb: false,
        roles: ['admin']
      }
    },
    {
      path: '/goods/edit',
      component: () => import(/* webpackChunkName: "goods-create" */ '@/views/goods/edit.vue'),
      name: 'goodsEdit',
      meta: {
        title: 'route.goodsEdit',
        noCache: true,
        activeMenu: '/goods',
        hidden: true
      }
    },
    {
      path: '/goods/detail/:id',
      component: () => import(/* webpackChunkName: "goods-detail" */ '@/views/goods/detail.vue'),
      name: 'goodsDetail',
      meta: {
        title: 'route.goodsDetail',
        noCache: true,
        activeMenu: '/goods',
        always: true,
        hidden: true
      }
    }
  ]
}

export default userRouter
