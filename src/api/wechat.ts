import service, { post } from '@/utils/request'
const ZSCApiV1 = '/zkrx-supply-chain/api/v1'
// 获取公众号主体信息列表
export const gzhMainManagerList = post(`${ZSCApiV1}/gzhMainManager/list`)
// 公众号详情
export const gzhMainManagerDetail = post(`${ZSCApiV1}/gzhMainManager/detail`)
// 公众号详情
export const gzhMainManagerSave = post(`${ZSCApiV1}/gzhMainManager/save`)
// 编辑公众号信息
export const gzhMainManagerEdit = post(`${ZSCApiV1}/gzhMainManager/edit`)
// 公众号操作
export const gzhMainManagerOperate = post(`${ZSCApiV1}/gzhMainManager/operate`)
// 删除协议
export const gzhProtocolManagerDelete = post(`${ZSCApiV1}/gzhProtocolManager/delete`)
// 协议详情
export const gzhProtocolManagerDetail = post(`${ZSCApiV1}/gzhProtocolManager/detail`)
// 编辑协议信息
export const gzhProtocolManagerEdit = post(`${ZSCApiV1}/gzhProtocolManager/edit`)
// 编辑协议信息
export const gzhProtocolManagerSave = post(`${ZSCApiV1}/gzhProtocolManager/save`)
// 获取协议信息列表
export const gzhProtocolManagerList = post(`${ZSCApiV1}/gzhProtocolManager/list`)
// 获取协议类型
export const gzhProtocolManagerTypeList = post(`${ZSCApiV1}/gzhProtocolManager/typeList`)
// 获取公众号消息模板
export const gzhMsgTemplateManagerGetTemplate = post(`${ZSCApiV1}/gzhMsgTemplateManager/getTemplate`)
// 新增公众号信息
export const gzhMsgTemplateManagerSaveOrUpdate = post(`${ZSCApiV1}/gzhMsgTemplateManager/saveOrUpdate`)
// 获取公众号自动回复配置
export const gzhAutoReplyManagerGetAutoReplyConfig = post(`${ZSCApiV1}/gzhAutoReplyManager/getAutoReplyConfig`)
// 设置公众号自动回复配置
// export const gzhAutoReplyManagerSetAutoReplyConfig = post(`${ZSCApiV1}/gzhAutoReplyManager/setAutoReplyConfig`)
// 设置公众号自动回复配置
export const gzhAutoReplyManagerSetAutoReplyConfig = (data:unknown) => {
  return service({
    url: `${ZSCApiV1}/gzhAutoReplyManager/setAutoReplyConfig`,
    method: 'post',
    headers: {
      'Content-Type': '"multipart/form-data"'
    },
    data
  })
}
// 创建微信公众号自定义菜单
// export const gzhMenuManagerCreate = post(`${ZSCApiV1}/gzhMenuManager/create`)
export const gzhMenuManagerCreate = (data:unknown) => {
  return service({
    url: `${ZSCApiV1}/gzhMenuManager/create`,
    method: 'post',
    headers: {
      'Content-Type': '"multipart/form-data"'
    },
    data
  })
}
// 删除微信公众号自定义菜单
export const gzhMenuManagerDelete = post(`${ZSCApiV1}/gzhMenuManager/delete`)
// 获取公众号自定义菜单详情信息
export const gzhMenuManagerDetail = post(`${ZSCApiV1}/gzhMenuManager/detail`)
// 编辑微信公众号自定义菜单
// export const gzhMenuManagerEdit = post(`${ZSCApiV1}/gzhMenuManager/edit`)
export const gzhMenuManagerEdit = (data:unknown) => {
  return service({
    url: `${ZSCApiV1}/gzhMenuManager/edit`,
    method: 'post',
    headers: {
      'Content-Type': '"multipart/form-data"'
    },
    data
  })
}
// 获取微信公众号自定义菜单树
export const gzhMenuManagerGetMenuTree = post(`${ZSCApiV1}/gzhMenuManager/getMenuTree`)
// 获取公众号自定义菜单信息列表
export const gzhMenuManagerList = post(`${ZSCApiV1}/gzhMenuManager/list`)
// 发布自定义菜单信息
export const gzhMenuManagerRelease = post(`${ZSCApiV1}/gzhMenuManager/release`)
// 公众号上传图文消息内的图片获取URL
export const gzhMenuManagerUploadImageGetUrl = post(`${ZSCApiV1}/gzhMenuManager/uploadImageGetUrl`)
// 获取公众号新闻资讯列表
export const gzhNewsInfoManagerList = post(`${ZSCApiV1}/gzhNewsInfoManager/list`)
// 发布新闻资讯
export const gzhNewsInfoManagerRelease = post(`${ZSCApiV1}/gzhNewsInfoManager/release`)
// 编辑新闻资讯
export const gzhNewsInfoManagerEdit = post(`${ZSCApiV1}/gzhNewsInfoManager/edit`)
// 获取新闻资讯详情
export const gzhNewsInfoManagerDetail = post(`${ZSCApiV1}/gzhNewsInfoManager/detail`)
// 删除新闻资讯
export const gzhNewsInfoManagerDelete = post(`${ZSCApiV1}/gzhNewsInfoManager/delete`)
// 新建新闻资讯
// export const gzhNewsInfoManagerCreate = post(`${ZSCApiV1}/gzhNewsInfoManager/create`)

// 新建新闻资讯
// export const gzhMenuManagerCreate = post(`${ZSCApiV1}/gzhMenuManager/create`)
export const gzhNewsInfoManagerCreate = (data:unknown) => {
  return service({
    url: `${ZSCApiV1}/gzhNewsInfoManager/create`,
    method: 'post',
    headers: {
      'Content-Type': '"multipart/form-data"'
    },
    data
  })
}
// 新建新闻资讯
// export const gzhMenuManagerCreate = post(`${ZSCApiV1}/gzhMenuManager/create`)
export const fileManagerUploadImageGetUrl = (data:unknown) => {
  return service({
    url: `${ZSCApiV1}/fileManager/uploadImageGetUrl`,
    method: 'post',
    headers: {
      'Content-Type': '"multipart/form-data"'
    },
    data
  })
}
// 获取公众号新闻资讯列表
export const gzhNewsInfoManagerCancel = post(`${ZSCApiV1}/gzhNewsInfoManager/cancel`)

// 配置管理列表入口-页面管理-自定义页面列表
export const gzhCustomPagePageList = post(`${ZSCApiV1}/gzhCustomPage/pageList`)
// 配置管理列表入口-页面管理-获取页面内容信息（可适用于页面预览）/gzhCustomPage/showPageContent/{pageId}
export const showPageContent = (pageId:string) => post(`${ZSCApiV1}/gzhCustomPage/showPageContent/${pageId}`)()
// 配置管理列表入口-页面管理-公众号自定义页面操作
export const gzhCustomPageOperate = post(`${ZSCApiV1}/gzhCustomPage/operate`)
// 配置管理列表入口-页面管理-编辑公众号自定义页面
export const gzhCustomPageEdit = post(`${ZSCApiV1}/gzhCustomPage/edit`)
// 配置管理列表入口-页面管理-公众号自定义页面详情
export const gzhCustomPageDetail = post(`${ZSCApiV1}/gzhCustomPage/detail`)
// 配置管理列表入口-页面管理-创建公众号自定义页面
export const gzhCustomPageCreate = post(`${ZSCApiV1}/gzhCustomPage/create`)

// 公众号管理-页面管理-页面图片轮播组件内容详情信息
export const gzhPictureRotationContentContentDetail = post(`${ZSCApiV1}/gzhPictureRotationContent/contentDetail`)
// 公众号管理-页面管理-新增页面图片轮播组件内容信息
export const gzhPictureRotationContentCreateContent = post(`${ZSCApiV1}/gzhPictureRotationContent/createContent`)
// 公众号管理-页面管理-删除页面图片轮播组件内容信息
export const gzhPictureRotationContentDeleteContent = post(`${ZSCApiV1}/gzhPictureRotationContent/deleteContent`)
// 公众号管理-页面管理-编辑页面图片轮播组件内容信息
export const gzhPictureRotationContentEditContent = post(`${ZSCApiV1}/gzhPictureRotationContent/editContent`)
// 公众号管理-页面管理-获取页面图文资讯组件内容列表信息
export const gzhGraphicInfoContentContentList = post(`${ZSCApiV1}/gzhGraphicInfoContent/contentList`)
// 公众号管理-页面管理-新增页面图文资讯组件内容信息
export const gzhGraphicInfoContentCreateContent = post(`${ZSCApiV1}/gzhGraphicInfoContent/createContent`)
// 公众号管理-页面管理-编辑页面图文资讯组件内容信息
export const gzhGraphicInfoContentEditContent = post(`${ZSCApiV1}/gzhGraphicInfoContent/editContent`)
// 公众号管理-页面管理-操作页面图文资讯组件内容信息
export const gzhGraphicInfoContentOperateContent = post(`${ZSCApiV1}/gzhGraphicInfoContent/operateContent`)
// 公众号管理-页面管理-图文资讯组件内容分类信息列表
export const gzhGraphicInfoContentCategoryCategoryList = post(`${ZSCApiV1}/gzhGraphicInfoContentCategory/categoryList`)
// 公众号管理-页面管理-创建图文资讯组件内容分类信息
export const gzhGraphicInfoContentCategoryCreateCategory = post(`${ZSCApiV1}/gzhGraphicInfoContentCategory/createCategory`)
// 公众号管理-页面管理-删除图文资讯组件内容分类信息
export const gzhGraphicInfoContentCategoryDeleteCategory = post(`${ZSCApiV1}/gzhGraphicInfoContentCategory/deleteCategory`)
// 公众号管理-页面管理-编辑图文资讯组件内容分类信息
export const gzhGraphicInfoContentCategoryEditCategory = post(`${ZSCApiV1}/gzhGraphicInfoContentCategory/editCategory`)

// 系统配置-组件管理-公众号页面组件库列表
export const gzhComponentBaseComponentList = post(`${ZSCApiV1}/gzhComponentBase/componentList`)
// 系统配置-组件管理-公众号页面组件库详情
export const gzhComponentBaseDetail = post(`${ZSCApiV1}/gzhComponentBase/detail`)
// 系统配置-组件管理-公众号页面组件库操作
export const gzhComponentBaseOperate = post(`${ZSCApiV1}/gzhComponentBase/operate`)

// 获取页面组件内容详情
export const gzhPageComponentContentContentDetail = post(`${ZSCApiV1}/gzhPageComponentContent/contentDetail`)
// 获取页面内容信息（适用于管理端内容维护）,如contentId
export const gzhCustomPagePageComponentContent = post(`${ZSCApiV1}/gzhCustomPage/pageComponentContent`)
