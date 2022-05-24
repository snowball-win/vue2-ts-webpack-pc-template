import request from '@/utils/request'
// 获取进货订单列表信息
export const orderList = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/purchaseOrder/orderList',
    method: 'post',
    data
  })
// 获取进货订单列表
export const purchaseOrderOrderList = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/purchaseOrder/orderList',
    method: 'post',
    data
  })
// 添加购物车商品
export const purchaseOrderAddCart = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/purchaseOrder/addCart',
    method: 'post',
    data
  })
// 修改购物车商品
export const purchaseOrderUpdCart = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/purchaseOrder/updCart',
    method: 'post',
    data
  })
// 进货订单操作
export const purchaseOrderOrderOperate = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/purchaseOrder/orderOperate',
    method: 'post',
    data
  })
// 获取订单状态列表
export const purchaseOrderOrderStatus = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/purchaseOrder/orderStatus',
    method: 'post',
    data
  })
// 删除购物车商品
export const purchaseOrderDelCart = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/purchaseOrder/delCart',
    method: 'post',
    data
  })
// 获取sku价格
export const getSalePrice = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/purchaseOrder/getSalePrice',
    method: 'post',
    data
  })
// 查看购物车
export const showCart = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/purchaseOrder/showCart',
    method: 'post',
    data
  })
// 机构端点击去结算按钮进入的订单确认页
export const showConfirm = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/purchaseOrder/showConfirm',
    method: 'post',
    data
  })
// 获取收货地址详情
export const addressDetail = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/addressManager/addressDetail',
    method: 'post',
    data
  })
// 获取收货地址详情
export const addressManagerEditAddress = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/addressManager/editAddress',
    method: 'post',
    data
  })
// 获取收货地址详情
export const addressManagerSetDefault = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/addressManager/setDefault',
    method: 'post',
    data
  })
// 获取收货地址详情
export const addressManagerDeleteAddress = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/addressManager/deleteAddress',
    method: 'post',
    data
  })
// 获取收货地址列表
export const addressList = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/addressManager/addressList',
    method: 'post',
    data
  })
// 添加收货地址
export const saveAddress = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/addressManager/saveAddress',
    method: 'post',
    data
  })
// 机构端创建进货订单
export const createOrder = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/purchaseOrder/createOrder',
    method: 'post',
    data
  })
// 获取进货销售订单列表
export const saleOrderOrderList = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/saleOrder/orderList',
    method: 'post',
    data
  })
// 进货销售订单详情
export const purchaseOrderOrderDetail = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/purchaseOrder/orderDetail',
    method: 'post',
    data
  })
// 进货销售订单详情
export const saleOrderOrderDetail = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/saleOrder/orderDetail',
    method: 'post',
    data
  })
// 进货销售订单操作
export const saleOrderOrderOperate = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/saleOrder/orderOperate',
    method: 'post',
    data
  })
// 获取订单状态列表
export const saleOrderOrderStatus = (data: any) =>
  request({
    url: '/zkrx-supply-chain/api/v1/saleOrder/orderStatus',
    method: 'post',
    data
  })
