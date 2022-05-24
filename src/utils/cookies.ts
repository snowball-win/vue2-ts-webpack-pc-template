import Cookies from 'js-cookie'

// App
const sidebarStatusKey = 'sidebar_status'
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(sidebarStatusKey, sidebarStatus)

const languageKey = 'language'
export const getLanguage = () => Cookies.get(languageKey)
export const setLanguage = (language: string) => Cookies.set(languageKey, language)

const sizeKey = 'size'
export const getSize = () => Cookies.get(sizeKey)
export const setSize = (size: string) => Cookies.set(sizeKey, size)

// User
const tokenKey = 'vue_typescript_admin_access_token'
export const getToken = () => Cookies.get(tokenKey)
export const getCompanyId = () => Cookies.get('companyId')
const ulist:any = Cookies.get('uniqueIdList') || '[]'
export const getUniqueIdList = () => JSON.parse(ulist)
export const getAuthorization = () => Cookies.get('Authorization')
export const getRealName = () => Cookies.get('realName')
export const getPhoneNo = () => Cookies.get('phoneNo')
export const getAdminFlag = () => Cookies.get('adminFlag')
export const getUserId = () => Cookies.get('companyList')
const clist:any = Cookies.get('companyList') || '{}'
const cInfolist:any = Cookies.get('companyInfo') || '{}'
export const getCompanyList = () => JSON.parse(clist)
export const getMenuList = () => {
  const menuList = Cookies.get('menuList') || '[]'
  return JSON.parse(menuList)
}
export const getCompanyInfo = () => JSON.parse(cInfolist)
export const getFirstLogin = () => Cookies.get('firstLogin')
export const setToken = (token: string) => Cookies.set(tokenKey, token)
export const setAuthorization = (Authorization: string) => Cookies.set('Authorization', Authorization)
export const setRealName = (realName: string) => Cookies.set('realName', realName)
export const setPhoneNo = (phoneNo: string) => Cookies.set('phoneNo', phoneNo)
export const setAdminFlag = (adminFlag: string) => Cookies.set('adminFlag', adminFlag)
export const setFirstLogin = (firstLogin: string) => Cookies.set('firstLogin', firstLogin)
export const setUserId = (userId: string) => Cookies.set('userId', userId)
export const setCompanyList = (companyList: Object) => Cookies.set('companyList', companyList)
export const setMenuList = (menuList: string) => Cookies.set('menuList', menuList)
export const setCompanyInfo = (companyInfo: Object) => Cookies.set('companyInfo', companyInfo)
export const setCompanyId = (companyId: string) => Cookies.set('companyId', companyId)
export const setUniqueIdList = (uniqueIdList: string) => Cookies.set('uniqueIdList', uniqueIdList)
export const removeToken = () => Cookies.remove(tokenKey)
