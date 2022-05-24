const data:any = {
  payload: [
    {
      menuId: '1',
      menuName: '系统首页',
      menuUrl: '/dashboard',
      parentId: '0',
      type: 'menu',
      icon: 'dashboard',
      children: [

      ]
    },
    {
      menuId: '2',
      menuName: '用户管理',
      menuUrl: null,
      parentId: '0',
      type: 'dir',
      icon: 'user',
      children: [
        {
          menuId: '6',
          menuName: '用户查询',
          menuUrl: '/user',
          parentId: '2',
          type: 'menu',
          icon: 'user',
          children: [

          ]
        }
      ]
    },
    {
      menuId: '3',
      menuName: '机构管理',
      menuUrl: null,
      parentId: '0',
      type: 'dir',
      icon: 'user',
      children: [
        {
          menuId: '7',
          menuName: '机构查询',
          menuUrl: '/organization',
          parentId: '3',
          type: 'menu',
          icon: 'user',
          children: [

          ]
        }
      ]
    },
    {
      menuId: '4',
      menuName: '商品管理',
      menuUrl: null,
      parentId: '0',
      type: 'dir',
      icon: 'user',
      children: [
        {
          menuId: '8',
          menuName: '上架管理',
          menuUrl: '/goods',
          parentId: '4',
          type: 'menu',
          icon: 'user',
          children: [

          ]
        }
      ]
    },
    {
      menuId: '5',
      menuName: '订单管理',
      menuUrl: null,
      parentId: '0',
      type: 'dir',
      icon: 'user',
      children: [
        {
          menuId: '9',
          menuName: '进货订单',
          menuUrl: '/order/purchase-order',
          parentId: '5',
          type: 'menu',
          icon: 'user',
          children: [

          ]
        },
        {
          menuId: '22',
          menuName: '进货销售',
          menuUrl: '/order/sale-order',
          parentId: '5',
          type: 'menu',
          icon: 'user',
          children: [

          ]
        }
      ]
    },
    {
      menuId: '24',
      menuName: '公众号管理',
      menuUrl: null,
      parentId: '0',
      type: 'dir',
      icon: 'user',
      children: [
        {
          menuId: '25',
          menuName: '配置管理',
          menuUrl: '/wechat/configure',
          parentId: '24',
          type: 'menu',
          icon: 'user',
          children: [

          ]
        },
        {
          menuId: '26',
          menuName: '资讯推送',
          menuUrl: '/wechat/consultation',
          parentId: '24',
          type: 'menu',
          icon: 'user',
          children: [

          ]
        },
        {
          menuId: '27',
          menuName: '页面管理',
          menuUrl: '/wechat/page',
          parentId: '24',
          type: 'menu',
          icon: 'user',
          children: [

          ]
        }
      ]
    },
    {
      menuId: '28',
      menuName: '系统配置',
      menuUrl: null,
      parentId: '0',
      type: 'dir',
      icon: 'user',
      children: [
        {
          menuId: '29',
          menuName: '组件管理',
          menuUrl: '/sys/components',
          parentId: '28',
          type: 'menu',
          icon: 'user',
          children: [

          ]
        }
      ]
    }
  ],
  code: '0',
  msg: '成功'
}
export default data
