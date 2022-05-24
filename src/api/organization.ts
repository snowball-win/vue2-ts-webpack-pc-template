import request from '@/utils/request'
// 新建机构
export const createCompany = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/companyManager/createCompany',
    method: 'post',
    data
  })
// 获取用户关联的机构列表
export const getUserRelationCompany = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/companyManager/getUserRelationCompany',
    method: 'post',
    data
  })
// 获取用户关联的机构列表
export const getChildCompany = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/companyManager/getChildCompany',
    method: 'post',
    data
  })
// 获取机构树
export const getCompanyTree = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/companyManager/getCompanyTree',
    method: 'post',
    data
  })
// 获取区域字典数据
export const getArea = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/companyManager/getArea',
    method: 'post',
    data
  })
// 新增机构下的员工信息
export const createUser = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/userManager/createUser',
    method: 'post',
    data
  })
// 获取机构详情信息
export const companyDetail = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/companyManager/companyDetail',
    method: 'post',
    data
  })
// 获取所属行业
export const getIndustryCategory = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/companyManager/getIndustryCategory',
    method: 'post',
    data
  })
// 删除机构
export const delCompany = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/companyManager/delCompany',
    method: 'post',
    data
  })
// 设置机构状态有效或无效
export const companyOperate = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/companyManager/companyOperate',
    method: 'post',
    data
  })
// 机构编辑
export const editCompany = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/companyManager/editCompany',
    method: 'post',
    data
  })
// 机构编辑
export const companyManagerGetCompanyList = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/companyManager/getCompanyList',
    method: 'post',
    data
  })
