import request from '@/utils/request'
// 商品列表-机构端
export const goodsManagerListJg = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/goodsManager/listJg',
    method: 'post',
    data
  })
// 商品列表-运营端
export const goodsManagerListYy = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/goodsManager/listYy',
    method: 'post',
    data
  })
// 获取商品分类
export const getGoodsCategory = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/goodsManager/getGoodsCategory',
    method: 'post',
    data
  })
// 商品上架、新建商品
export const createGoods = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/goodsManager/createGoods',
    method: 'post',
    data
  })
// 商品上架终端
export const showTerminal = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/goodsManager/showTerminal',
    method: 'post',
    data
  })
// 文件上传
export const fileUpload = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/fileManager/fileUpload',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data
  })
// 商品属性分类
export const getAttrCategory = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/goodsManager/getAttrCategory',
    method: 'post',
    data
  })
// 获取商品属性分类值集信息
export const getGoodsAttrCategoryValues = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/goodsManager/getGoodsAttrCategoryValues',
    method: 'post',
    data
  })
// 获取产品主数据
export const getProduct = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/goodsManager/getProduct',
    method: 'post',
    data
  })
// 商品列表-删除
export const deleteGoods = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/goodsManager/deleteGoods',
    method: 'post',
    data
  })
// 设置商品的上下架状态
export const goodsOperate = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/goodsManager/goodsOperate',
    method: 'post',
    data
  })
// 设置商品的详情
export const goodsManagerDetailJg = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/goodsManager/detailJg',
    method: 'post',
    data
  })
// 获取上次使用的产品分类信息（机构端）
export const getLastGoodsCategory = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/goodsManager/getLastGoodsCategory',
    method: 'post',
    data
  })
