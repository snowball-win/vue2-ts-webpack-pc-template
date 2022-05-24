import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { logout, userManagerGetMenu } from '@/api/users'
import menus from './menus'

import {
  getToken,
  getCompanyId,
  getAuthorization,
  setFirstLogin,
  setPhoneNo,
  setAdminFlag,
  getAdminFlag,
  getPhoneNo,
  setToken,
  setAuthorization,
  setRealName,
  getRealName,
  getUserId,
  setUserId,
  getCompanyList,
  setCompanyList,
  getCompanyInfo,
  setCompanyInfo,
  setCompanyId,
  removeToken
} from '@/utils/cookies'
import router, { resetRouter } from '@/router'
import { PermissionModule, getMenuList, getFlatMenuList } from './permission'
import { TagsViewModule } from './tags-view'
import store from '@/store'
import { RouteConfig } from 'vue-router'

export interface IUserState {
  token: string
  name: string
  avatar: string
  introduction: string
  roles: string[]
  email: string
  menuList: RouteConfig[]
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public companyId = getCompanyId() || ''
  public Authorization = getAuthorization() || ''
  public realName = getRealName() || ''
  public name = ''
  public avatar = ''
  public introduction = ''
  public roles: string[] = []
  public email = ''
  public firstLogin = '' // 是否首次登录
  public phoneNo = getPhoneNo() || '' // 手机号
  public adminFlag:any = getAdminFlag() || '' // 是否管理员
  public userId = getUserId() || '' // 用户id
  public companyList = getCompanyList() || {} // 登录人机构列表
  public companyInfo = getCompanyInfo() || {} // 登录人机构信息
  public selectCompanyList:any = [] // 多机构
  public menuList:RouteConfig[] = [] // 多机构
  public matchedList:RouteConfig[] = [] // 多机构
  public gzhId = '' // 多机构

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_GZH_ID(gzhId: string) {
    this.gzhId = gzhId
  }

  @Mutation
  private SET_COMPANYID(companyId: string) {
    this.companyId = companyId
  }

  @Mutation
  private SET_AUTHORIZATION(Authorization: string) {
    console.log('46Authorization')
    this.Authorization = Authorization
  }

  @Mutation
  private SET_FIRSTLOGIN(firstLogin: string) {
    this.firstLogin = firstLogin
  }

  @Mutation
  private SET_SELECTCOMPANYLIST(selectCompanyList: string) {
    this.selectCompanyList = selectCompanyList
  }

  @Mutation
  private SET_PHONENO(phoneNo: string) {
    this.phoneNo = phoneNo
  }

  @Mutation
  private SET_USERID(userId: string) {
    this.userId = userId
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Mutation
  private SET_EMAIL(email: string) {
    this.email = email
  }

  @Mutation
  private SET_COMPANYLIST(companyList:any) {
    this.companyList = companyList
  }

  @Mutation
  private SET_MENULIST(menuList:RouteConfig[]) {
    this.menuList = menuList
  }

  @Mutation
  private SET_MATCHEDLIST(matchedList:RouteConfig[]) {
    this.matchedList = matchedList
  }

  // 登录
  @Mutation
  public Login(data:any) {
    if (data.payload.firstLogin === 1) {
      this.userId = data.payload.userId
      this.phoneNo = data.payload.phoneNo
      setUserId(data.payload.userId)
      setPhoneNo(data.payload.phoneNo)
      return
    }
    // selectFlag 等于1需要选择机构，没有公司信息
    if (data.payload.selectFlag !== 1) {
      const companyInfo = data.payload.companyInfo
      setCompanyId(data.payload.companyInfo.companyId)
      this.companyId = data.payload.companyInfo.companyId
      setAdminFlag(data.payload.companyInfo.adminFlag)
      this.adminFlag = data.payload.companyInfo.adminFlag
      this.companyInfo = companyInfo
      setCompanyInfo(JSON.stringify(companyInfo))
      // return
    }
    // setCompanyId(data.payload.companyInfo.companyId)
    // this.companyId = data.payload.companyInfo.companyId
    const companyList = { companyList: data.payload.selectCompanyList }
    // const menuList = data.payload
    // function forEachChildren(list: any[]) {
    //   list.forEach(item => {
    //     const { children, path = '', name, redirect, ...rest } = item
    //     item.path = path
    //     item.name = name
    //     item.redirect = redirect
    //     item.meta = { ...rest }
    //     if (children && children.length > 0) {
    //       forEachChildren(item.children)
    //     } else {
    //       item.children = null
    //     }
    //   })
    // }
    // forEachChildren(menuList)
    // const companyInfo = data.payload.companyInfo
    setUserId(data.payload.userId)
    setPhoneNo(data.payload.phoneNo)
    // setAdminFlag(data.payload.companyInfo.adminFlag)
    setFirstLogin(data.payload.firstLogin)
    setToken(data.payload.authorization)
    setAuthorization(data.payload.authorization)
    setRealName(data.payload.realName)
    setCompanyList(JSON.stringify(companyList))
    // setMenuList(JSON.stringify(menuList))
    // setCompanyInfo(JSON.stringify(companyInfo))
    this.userId = data.payload.userId
    this.phoneNo = data.payload.phoneNo
    // this.adminFlag = data.payload.companyInfo.adminFlag
    this.firstLogin = data.payload.firstLogin
    this.selectCompanyList = data.payload.selectCompanyList
    this.companyList = companyList
    // this.companyInfo = companyInfo
    this.token = data.payload.authorization
    this.Authorization = data.payload.authorization
    this.realName = data.payload.realName
  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
    this.SET_MENULIST([])
  }

  @Action
  public setGzhId(value: string) {
    this.SET_GZH_ID(value)
  }

  @Action
  public async GetUserInfo() {
    this.SET_ROLES(['admin'])
    this.SET_NAME('Super Admin')
    this.SET_AVATAR('https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
    this.SET_INTRODUCTION('I am a super administrator')
    this.SET_EMAIL('admin@test.com')
    // const data = await userManagerGetMenu({})
    const data = menus
    // data.payload.forEach((item :any) => {
    //   if (item.menuName === '公众号管理') {
    //     item.children.push({
    //       children: [],
    //       icon: 'user',
    //       menuId: '25',
    //       menuName: '资讯推送',
    //       menuUrl: '/wechat/consultation',
    //       parentId: '24',
    //       type: 'menu'
    //     })
    //   }
    // })
    const menuList = data.payload
    function mapEachChildren(list: any[], idStr:string[] = []): any {
      if (list && list.length > 0) {
        return list.map(item => {
          const { children, menuUrl: path = '', menuName: title, redirect, type, parentId, menuId, ...rest } = item
          let idList = [menuId]
          if (idStr) {
            idList = idStr.concat(menuId)
          }
          const data:RouteConfig = { children: mapEachChildren(children, idList), path, meta: { ...rest, title, type, parentId, menuId, idList } }
          if (type !== 'menu') {
            data.redirect = 'noredirect'
          } else if (redirect) {
            data.redirect = redirect
          }
          return data
        })
      }
      return null
    }
    // mapEachChildren(menuList)
    // console.log(mapEachChildren(menuList))
    this.SET_MENULIST(mapEachChildren(menuList))
  }

  @Action
  public async ChangeRoles(role: string) {
    // Dynamically modify permissions
    const token = role + '-token'
    this.SET_TOKEN(token)
    setToken(token)
    // await this.GetUserInfo()
    resetRouter()
    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(this.roles)
    // Add generated routes
    PermissionModule.dynamicRoutes.forEach(route => {
      router.addRoute(route)
    })
    // Reset visited views and cached views
    TagsViewModule.delAllViews()
  }

  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    await logout({})
    removeToken()
    const keys = document.cookie.match(/[^ =;]+(?==)/g)
    if (keys) {
      for (let i = keys.length; i--;) { document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString() }
    }

    // Reset visited views and cached views
    TagsViewModule.delAllViews()
    this.SET_TOKEN('')
    this.SET_ROLES([])
    this.SET_MENULIST([])
  }

  @Action
  public matched(path: string) {
    const matchedList: RouteConfig[] = []
    const onlyMenuList = getMenuList(this.menuList)
    const flatMenuList = getFlatMenuList(this.menuList)
    const data = onlyMenuList.find(item => item.path === path)
    if (data) {
      const { idList } = data.meta
      if (idList) {
        idList.forEach((id:string) => {
          flatMenuList.forEach(m => {
            const item = { ...m }
            if (id === item.meta.menuId) {
              matchedList.push(item)
            }
          })
        })
      }
    }
    this.SET_MATCHEDLIST(matchedList)
    return matchedList
  }
}

export const UserModule = getModule(User)
// 这里边调用接口，header信息里边可能拿不到token等信息，后续需要验证
