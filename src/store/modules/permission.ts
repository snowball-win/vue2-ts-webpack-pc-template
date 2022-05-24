import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { RouteConfig } from 'vue-router'
import { asyncRoutes, constantRoutes } from '@/router'
import store from '@/store'

const hasPermission = (roles: string[], route: RouteConfig) => {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

export const filterAsyncRoutes = (routes: RouteConfig[], roles: string[]) => {
  const res: RouteConfig[] = []
  routes.forEach(route => {
    const r = { ...route }
    if (hasPermission(roles, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, roles)
      }
      res.push(r)
    }
  })
  return res
}
// 获取所有末级菜单
export const getMenuList = (menuList: RouteConfig[]) => {
  const res: RouteConfig[] = []
  menuList.forEach(item => {
    let { children, ...rest } = item
    children = children || []
    if (children.length === 0 || (item.meta && item.meta.type === 'menu')) {
      res.push(rest)
    } else {
      res.push(...getMenuList(children as RouteConfig[]))
    }
  })
  return res
}
// 扁平化所有获取所有菜单
export const getFlatMenuList = (menuList: RouteConfig[]) => {
  const res: RouteConfig[] = []
  menuList.forEach(item => {
    res.push(item)
    if (item.children && item.children.length > 0) {
      res.push(...getFlatMenuList(item.children))
    }
  })
  return res
}

/**
 * 目录和路由分离方案
 * 菜单分为菜单目录（dir）和末级菜单（menu）
 * 前端本地预设所有路由，根据后端返回菜单信息过滤需要的路由动态加入router
 */
export const filterAsyncRoutesByMenuList = (routes: RouteConfig[], menuList: RouteConfig[], always = false) => {
  const res: RouteConfig[] = []
  const menuPathList = getMenuList(menuList).map(m => m.path)
  routes.forEach(route => {
    const r = { ...route }
    const redirect = r.redirect || null
    if (menuPathList.includes(r.path) || r.meta.always || menuPathList.includes(redirect as string)) {
      const menuPathData = getMenuList(menuList).find(m => m.path === r.path) as RouteConfig
      if (menuPathData) {
        Object.assign(r.meta, menuPathData.meta)
      }
      /**
       * 处理子路由meta数据
       */
      routesForEach(r.children as RouteConfig[], (route) => {
        const menuPathData = getMenuList(menuList).find(m => m.path === route.path) as RouteConfig
        const parentPathData = getMenuList(menuList).find(m => m.path === r.path) as RouteConfig
        if (menuPathData) {
          Object.assign(route.meta, menuPathData.meta)
        }
        if (parentPathData && route.path === r.redirect) {
          Object.assign(route.meta, parentPathData.meta)
        }
      })
      res.push(r)
    } else if (r.children) {
      r.children = filterAsyncRoutesByMenuList(r.children, menuList)
    }
  })
  return res
}

/**
 * 遍历树形路由
 */
export const routesForEach = (routes: RouteConfig[], fn: (route: RouteConfig) => void) => {
  routes.forEach(route => {
    if (route.children && route.children.length > 0) {
      routesForEach(route.children, fn)
    } else {
      fn(route as RouteConfig)
    }
  })
}

/**
 * 以菜单为基础添加路由
 */
export const filterAsyncRoutesCopyMenuList = (routes: RouteConfig[], menuList: RouteConfig[]) => {
  // console.log(getMenuList(menuList))
  const menuPathList = getMenuList(menuList).map(m => m.path)
  routes.forEach(route => {
    const r = { ...route }
    const redirect = r.redirect
    if (menuPathList.includes(r.path) || r.meta.always || menuPathList.includes(redirect as string)) {
      const menuPathData = getMenuList(menuList).find(m => m.path === r.path || m.path === r.redirect) as RouteConfig
      menuPathData.children = r.children
    } else if (r.children) {
      filterAsyncRoutesCopyMenuList(r.children, menuList)
    }
  })
  return menuList
}

export interface IPermissionState {
  routes: RouteConfig[]
  dynamicRoutes: RouteConfig[]
}

@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionState {
  public routes: RouteConfig[] = []
  public dynamicRoutes: RouteConfig[] = []

  @Mutation
  private SET_ROUTES(routes: RouteConfig[]) {
    this.routes = constantRoutes.concat(routes)
    this.dynamicRoutes = routes
  }

  @Action
  public GenerateRoutes(roles: string[]) {
    let accessedRoutes
    if (roles.includes('admin')) {
      accessedRoutes = asyncRoutes
    } else {
      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    }
    this.SET_ROUTES(accessedRoutes)
  }

  @Action
  public GenerateRoutesByMenuList(menuList: RouteConfig[]) {
    const accessedRoutes = filterAsyncRoutesByMenuList(asyncRoutes, menuList)
    this.SET_ROUTES(accessedRoutes)
  }

  @Action
  public GenerateRoutesCopyMenuList(menuList: RouteConfig[]) {
    const accessedRoutes = filterAsyncRoutesCopyMenuList(asyncRoutes, menuList)
    this.SET_ROUTES(accessedRoutes)
  }
}

export const PermissionModule = getModule(Permission)
