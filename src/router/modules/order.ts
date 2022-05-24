// 订单管理order
import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const userRouter: RouteConfig[] = [
  {
    path: '/order/purchase-order',
    component: Layout,
    redirect: '/order/purchase-order/list',
    name: 'orderManager',
    meta: {
      title: 'route.orderManager',
      icon: 'user'
    },
    children: [
      {
        path: '/order/purchase-order/list',
        component: () => import(/* webpackChunkName: "orderlist" */ '@/views/order/purchase-order/list.vue'),
        name: 'purchaseOrderlist',
        meta: {
          title: 'route.purchaseOrderList',
          activeMenu: '/order/purchase-order',
          noCache: true,
          breadcrumb: false,
          roles: ['admin']
        }
      },
      {
        path: '/order/purchase-order/create',
        component: () => import(/* webpackChunkName: "organization-create" */ '@/views/order/purchase-order/create.vue'),
        name: 'orderCreate',
        meta: {
          title: 'route.orderCreate',
          noCache: true,
          activeMenu: '/order/purchase-order',
          hidden: true
        }
      },
      {
        path: '/order/purchase-order/detail/:id',
        component: () => import(/* webpackChunkName: "order/purchase-order-detail" */ '@/views/order/purchase-order/detail.vue'),
        name: 'orderDetail',
        meta: {
          title: 'route.orderDetail',
          noCache: true,
          activeMenu: '/order/purchase-order',
          hidden: true
        }
      },
      {
        path: '/order/purchase-order/cart',
        component: () => import(/* webpackChunkName: "organization-create" */ '@/views/order/purchase-order/cart.vue'),
        name: 'orderCart',
        meta: {
          title: 'route.orderCart',
          noCache: true,
          activeMenu: '/order/purchase-order',
          hidden: true
        }
      },
      {
        path: '/order/purchase-order/confirm-order',
        component: () => import(/* webpackChunkName: "organization-create" */ '@/views/order/purchase-order/confirm-order.vue'),
        name: 'confirm-order',
        meta: {
          title: 'route.confirm-order',
          noCache: true,
          activeMenu: '/order/purchase-order',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/order/sale-order',
    component: Layout,
    redirect: '/order/sale-order/list',
    name: 'orderManager',
    meta: {
      title: 'route.orderManager',
      icon: 'user'
    },
    children: [
      {
        path: '/order/sale-order/list',
        component: () => import(/* webpackChunkName: "orderlist" */ '@/views/order/sale-order/list.vue'),
        name: 'saleOrderList',
        meta: {
          title: 'route.saleOrderList',
          breadcrumb: false,
          noCache: true,
          activeMenu: '/order/sale-order',
          roles: ['admin']
        }
      },
      {
        path: '/order/sale-order/detail/:id',
        component: () => import(/* webpackChunkName: "orderlist" */ '@/views/order/sale-order/detail.vue'),
        name: 'orderDetail',
        meta: {
          title: 'route.orderDetail',
          noCache: true,
          activeMenu: '/order/sale-order',
          hidden: true
        }
      }
    ]
  }
]

export default userRouter
