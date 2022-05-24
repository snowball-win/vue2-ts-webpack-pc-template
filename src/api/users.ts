import request from '@/utils/request'

export const getUsers = (params: any) =>
  request({
    url: '/users',
    method: 'get',
    params
  })

export const getUserInfo = (data: any) =>
  request({
    url: '/users/info',
    method: 'post',
    data
  })

// 获取菜单列表
export const userManagerGetMenu = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/userManager/getMenu',
    method: 'post',
    data
  })

export const getAppList = (data: any) =>
  request({
    url: '/m-staff-center/api/v1/login/getCurrentAppList',
    method: 'post',
    data
  })
// 手机登录
export const loginByCode = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/userManager/quickLogin',
    method: 'post',
    data
  })
// 发送短信验证码
export const sendSmsCode = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/smsManager/sendSmsCode',
    method: 'post',
    data
  })
// 发送短信验证码
export const firstResetPwd = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/userManager/firstResetPwd',
    method: 'post',
    data
  })

export const getUserByName = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'get'
  })

export const updateUser = (username: string, data: any) =>
  request({
    url: `/users/${username}`,
    method: 'put',
    data
  })

export const deleteUser = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'delete'
  })
// 账号密码登录
export const login = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/userManager/normalLogin',
    method: 'post',
    data
  })

// 获取用户列表-机构端
export const companyUsers = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/userManager/companyUsers',
    method: 'post',
    data
  })

export const logout = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/userManager/loginOut',
    method: 'post',
    data
  })

export const register = (data: any) =>
  request({
    url: '/users/register',
    method: 'post',
    data
  })
// 获取平台所有注册用户
export const platformUsers = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/userManager/platformUsers',
    method: 'post',
    data
  })
// 获取用户详情
export const userDetail = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/userManager/userDetail',
    method: 'post',
    data
  })
// 编辑用户详情
export const editUser = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/userManager/editUser',
    method: 'post',
    data
  })
// 用户通过所属机构列表中切换机构
export const changeCompany = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/userManager/changeCompany',
    method: 'post',
    data
  })
// 新增机构下的员工信息
export const userManagerCreateUser = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/userManager/createUser',
    method: 'post',
    data
  })
// 根据用户ID获取关联的机构信息
export const getUserRelationCompany = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/companyManager/getUserRelationCompany',
    method: 'post',
    data
  })
// 删除用户
export const delUser = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/userManager/delUser',
    method: 'post',
    data
  })
// 将用户置为无效
export const userOperate = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/userManager/userOperate',
    method: 'post',
    data
  })
// 重置用户登录密码
export const resetPwd = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/userManager/resetPwd',
    method: 'post',
    data
  })
