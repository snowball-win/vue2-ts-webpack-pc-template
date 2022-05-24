import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'
import i18n from '@/lang' // Internationalization
import settings from './settings'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect']

const getPageTitle = (key: string) => {
  const hasKey = i18n.te(`${key}`)
  if (hasKey) {
    const pageName = i18n.t(`${key}`)
    return `${pageName} - ${settings.title}`
  }
  if (key) {
    return `${key}-${settings.title}`
  }
  return `${settings.title}`
}

router.beforeEach(async(to: Route, _: Route, next: any) => {
  // Start progress bar
  NProgress.start()
  // console.log('27', to)
  if (to.path === '/resetpwd') {
    next()
    return
  }
  // Determine whether the user has logged in
  if (UserModule.token) {
    if (to.path === '/login') {
      // If is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // Check whether the user has obtained his permission roles
      if (UserModule.roles.length === 0) {
        try {
          // Note: roles must be a object array! such as: ['admin'] or ['developer', 'editor']
          await UserModule.GetUserInfo()
          // const roles = UserModule.roles
          const menuList = UserModule.menuList
          // Generate accessible routes map based on role
          // 修改为获取
          // PermissionModule.GenerateRoutes(roles)
          PermissionModule.GenerateRoutesByMenuList(menuList)
          // Dynamically add accessible routes
          PermissionModule.dynamicRoutes.forEach(route => {
            router.addRoute(route)
          })
          // 更新菜单层级
          UserModule.matched(to.meta && to.meta.activeMenu)
          // 路由不存在跳转404，由于路由动态生成只需要的，所以无需考虑无权限页面401
          if (to.matched && to.matched.length === 0) {
            next({ path: '/404' })
          }
          // Hack: ensure addRoutes is complete
          // Set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (err:any) {
          // Remove token and redirect to login page
          UserModule.ResetToken()
          Message.error(err || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      } else {
        // 更新菜单层级
        UserModule.matched(to.meta && to.meta.activeMenu)
        if (to.matched && to.matched.length === 0) {
          next({ path: '/404' })
        }
        next()
      }
    }
  } else {
    // Has no token
    if (whiteList.indexOf(to.path) !== -1) {
      // In the free login whitelist, go directly
      next()
    } else {
      // Other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach((to: Route) => {
  // Finish progress bar
  // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
  NProgress.done()

  // set page title
  document.title = getPageTitle(to.meta.title)
})
