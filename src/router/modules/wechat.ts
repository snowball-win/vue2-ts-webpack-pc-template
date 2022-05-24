// Wechat public platform
import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const wecharRouter: RouteConfig[] = [
  {
    path: '/wechat/configure',
    component: Layout,
    redirect: '/wechat/configure/list',
    name: 'wechatConfigure',
    meta: {
      title: 'route.orderManager',
      icon: 'user'
    },
    children: [
      {
        path: '/wechat/configure/list',
        component: () => import(/* webpackChunkName: "orderlist" */ '@/views/wechat/configure/list.vue'),
        name: 'wechatConfigureList',
        meta: {
          activeMenu: '/wechat/configure',
          noCache: true,
          breadcrumb: false,
          roles: ['admin']
        }
      },
      {
        path: '/wechat/configure/create',
        component: () => import(/* webpackChunkName: "organization-create" */ '@/views/wechat/configure/detail.vue'),
        name: 'wechatConfigureCreate',
        meta: {
          title: '新增配置',
          noCache: true,
          activeMenu: '/wechat/configure',
          hidden: true
        }
      },
      {
        path: '/wechat/configure/detail/:id',
        component: () => import(/* webpackChunkName: "wechat-configure-detail" */ '@/views/wechat/configure/detail.vue'),
        name: 'wechatConfigureDetail',
        meta: {
          title: '编辑配置',
          noCache: true,
          activeMenu: '/wechat/configure',
          hidden: true
        }
      },
      {
        path: '/wechat/configure/agreement/list/:id',
        component: () => import(/* webpackChunkName: "wechat-agreement-detail" */ '@/views/wechat/agreement/list.vue'),
        name: 'wechatAgreementList',
        meta: {
          title: '协议管理',
          noCache: true,
          activeMenu: '/wechat/configure',
          hidden: true
        }
      },
      {
        path: '/wechat/configure/agreement/create',
        component: () => import(/* webpackChunkName: "wechat-agreement-detail" */ '@/views/wechat/agreement/detail.vue'),
        name: 'wechatAgreementCreate',
        meta: {
          title: '编辑协议',
          noCache: true,
          activeMenu: '/wechat/configure',
          hidden: true
        }
      },
      {
        path: '/wechat/configure/agreement/detail/:id',
        component: () => import(/* webpackChunkName: "wechat-agreement-detail" */ '@/views/wechat/agreement/detail.vue'),
        name: 'wechatAgreementDetail',
        meta: {
          title: '编辑协议',
          noCache: true,
          activeMenu: '/wechat/configure',
          hidden: true
        }
      },
      {
        path: '/wechat/configure/auto-reply/:id',
        component: () => import(/* webpackChunkName: "wechat-agreement-detail" */ '@/views/wechat/auto-reply/index.vue'),
        name: 'wechatAutoReply',
        meta: {
          title: '自动回复',
          noCache: true,
          activeMenu: '/wechat/configure',
          hidden: true
        }
      },
      {
        path: '/wechat/configure/msg-template/:id',
        component: () => import(/* webpackChunkName: "wechat-msg-tamplate-detail" */ '@/views/wechat/msg-template/index.vue'),
        name: 'wechatMsgTamplate',
        meta: {
          title: '消息模板',
          noCache: true,
          activeMenu: '/wechat/configure',
          hidden: true
        }
      },
      {
        path: '/wechat/configure/menu/:id',
        component: () => import(/* webpackChunkName: "wechat-menu-congig" */ '@/views/wechat/menu/index.vue'),
        name: 'wechatMenuConfig',
        meta: {
          title: '菜单配置',
          noCache: true,
          activeMenu: '/wechat/configure',
          hidden: true
        }
      },
      {
        path: '/wechat/configure/add-menu/',
        component: () => import(/* webpackChunkName: "wechat-add-menu-congig" */ '@/views/wechat/menu/add-menu/index.vue'),
        name: 'wechatAddMenuConfig',
        meta: {
          title: '添加菜单',
          noCache: true,
          activeMenu: '/wechat/configure',
          hidden: true
        }
      },
      {
        path: '/wechat/configure/page/list',
        component: () => import(/* webpackChunkName: "wechatConfigurePageList" */ '@/views/wechat/configure/page/list.vue'),
        name: 'wechatConfigurePageList',
        meta: {
          title: '页面配置',
          activeMenu: '/wechat/configure',
          noCache: true,
          breadcrumb: false
        }
      },
      {
        path: '/wechat/configure/page/create',
        component: () => import(/* webpackChunkName: "wechatConfigurePageDetail" */ '@/views/wechat/configure/page/detail.vue'),
        name: 'wechatConfigurePageDetail',
        meta: {
          title: '新增页面',
          activeMenu: '/wechat/configure',
          noCache: true,
          breadcrumb: false
        }
      },
      {
        path: '/wechat/configure/page/detail/:id',
        component: () => import(/* webpackChunkName: "wechatConfigurePageDetail" */ '@/views/wechat/configure/page/detail.vue'),
        name: 'wechatConfigurePageDetail',
        meta: {
          title: '页面编辑',
          activeMenu: '/wechat/configure',
          noCache: true,
          breadcrumb: false
        }
      }
    ]
  },
  {
    path: '/wechat/consultation',
    component: Layout,
    redirect: '/wechat/consultation/list',
    name: 'wechatConsultation',
    meta: {
      title: 'route.orderManager',
      icon: 'user'
    },
    children: [
      {
        path: '/wechat/consultation/list',
        component: () => import(/* webpackChunkName: "orderlist" */ '@/views/wechat/consultation/list.vue'),
        name: 'wechatConsultationList',
        meta: {
          activeMenu: '/wechat/consultation',
          noCache: true,
          breadcrumb: false,
          roles: ['admin']
        }
      },
      {
        path: '/wechat/consultation/create',
        component: () => import(/* webpackChunkName: "organization-create" */ '@/views/wechat/consultation/detail.vue'),
        name: 'wechatConsultationCreate',
        meta: {
          title: '新建资讯',
          noCache: true,
          activeMenu: '/wechat/consultation',
          hidden: true
        }
      },
      {
        path: '/wechat/consultation/detail/:id',
        component: () => import(/* webpackChunkName: "wechat-consultation-detail" */ '@/views/wechat/consultation/detail.vue'),
        name: 'wechatConsultationDetail',
        meta: {
          title: '编辑资讯',
          noCache: true,
          activeMenu: '/wechat/consultation',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/wechat/page',
    component: Layout,
    redirect: '/wechat/page/list',
    name: 'wechatPage',
    meta: {
      title: 'route.orderManager',
      icon: 'user'
    },
    children: [
      {
        path: '/wechat/page/list',
        component: () => import(/* webpackChunkName: "orderlist" */ '@/views/wechat/page/list.vue'),
        name: 'wechatPageList',
        meta: {
          activeMenu: '/wechat/page',
          noCache: true,
          breadcrumb: false
        }
      },
      {
        path: '/wechat/page/create',
        component: () => import(/* webpackChunkName: "wechat-page-create" */ '@/views/wechat/page/detail.vue'),
        name: 'wechatPageCreate',
        meta: {
          title: '新建资讯',
          noCache: true,
          activeMenu: '/wechat/page',
          hidden: true
        }
      },
      {
        path: '/wechat/page/detail/:id',
        component: () => import(/* webpackChunkName: "wechat-page-detail" */ '@/views/wechat/page/detail.vue'),
        name: 'wechatPageDetail',
        meta: {
          title: '编辑资讯',
          noCache: true,
          activeMenu: '/wechat/page',
          hidden: true
        }
      },
      {
        path: '/wechat/page/addImageText/:id',
        component: () => import(/* webpackChunkName: "wechat-page-detail" */ '@/views/wechat/page/image-text-add.vue'),
        name: 'wechatPageDetail',
        meta: {
          title: '新建图文',
          noCache: true,
          activeMenu: '/wechat/page',
          hidden: true
        }
      }
    ]
  }
]

export default wecharRouter
