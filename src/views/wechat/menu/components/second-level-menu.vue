// 菜单配置-二级菜单
<template>
  <div class="second-level-menu-content">
    <ContentItem :title="'二级菜单'">
      <!-- menuType=2 二级菜单 -->
      <router-link
        :to="`/wechat/configure/add-menu?gzhId=${gzhId}&menuType=2&edit=add`"
        class="link-type"
      >
        <el-button type="primary" size="mini" :style="{'margin': '5px 0 10px 0'}">新建</el-button>
      </router-link>
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        :style="{width: '100%'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="index"
          align="center"
          :selectable="selectableCb"
        />

        <el-table-column
          width="180px"
          align="center"
          show-overflow-tooltip
          label="菜单类型"
        >
          <template slot-scope="{row}">
            <span>{{ row.menuTypeName }}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="center"
          show-overflow-tooltip
          label="菜单名称"
        >
          <template slot-scope="{row}">
            <span>{{row.menuName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="center"
          show-overflow-tooltip
          label="菜单内容"
        >
          <template slot-scope="{row}">
            <span>{{ row.contentTypeName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="center"
          show-overflow-tooltip
          label="内容配置"
        >
          <template slot-scope="{row}">
            <span>{{ row.menuContent }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="350"
          fixed="right"
        >
          <template slot-scope="{row}">
            <router-link :to="`/wechat/configure/add-menu?gzhId=${gzhId}&menuType=${row.menuType}&menuId=${row.menuId}`">
              <el-button
                :type="'primary'"
                size="mini"
                style="margin-right:10px; min-width: 80px;"
              >
                编辑
              </el-button>
            </router-link>
            <el-button
              :type="'primary'"
              size="mini"
              style="margin-right:10px; min-width: 80px;"
              @click="menuDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </ContentItem>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { gzhMenuManagerDelete, gzhMenuManagerList, gzhMenuManagerRelease } from '@/api/wechat'
import { saleOrderData, downdropListData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import ContentItem from '@/components/ContentItem/index.vue'

@Component({
  name: 'second-level-menu-content',
  components: {
    Pagination,
    ContentItem
  }
})
export default class extends Vue {
  created() {
    this.getList()
  }

  private gzhId = this.$route.params.id
  private list: saleOrderData[] = []
  private multipleSelection = []
  private listLoading = false
  private listQuery = {
    gzhStatus: '',
    companyName: '',
    gzhName: ''
  }

  // 订单类型（1-普通订单；2-后付订单；3-积分订单；4-其他订单
  private gzhStatusOption = [
    {
      key: null,
      label: '全部'
    },
    {
      key: 0,
      label: '无效'
    },
    {
      key: 1,
      label: '有效'
    }
  ]

  // 订单类型（1-普通订单；2-后付订单；3-积分订单；4-其他订单
  private gzhStatusData = {
    0: '无效',
    1: '有效'
  }

  // 接口获取
  private optionsOrderStatus:downdropListData[] = [
    {
      key: 1,
      label: '普通订单'
    },
    {
      key: 2,
      label: '后付订单'
    },
    {
      key: 3,
      label: '积分订单'
    },
    {
      key: 4,
      label: '其他订单'
    }
  ]

  private currentSize = 0

  // 1-详情；2-取消；3-确认收货；4-拒绝收货
  private clickCbData: any = {
    1: this.goOrderOrderOperateRead,
    2: this.goOrderOrderOperateConfirm,
    3: this.goOrderOrderOperateReject,
    4: this.goOrderOrderOperateDeliver,
    5: this.goOrderOrderOperateBuyerReject
  }

  // 1-详情；2-取消；3-确认收货；4-拒绝收货
  private operateReasonTypeOptions: any = {
    ORDER_RECEIPT: [
      {
        key: '没有货了',
        label: '没有货了'
      },
      {
        key: '停止接单了',
        label: '停止接单了'
      },
      {
        key: '无法配送',
        label: '无法配送'
      },
      {
        key: '其他',
        label: '其他'
      }
    ],
    CONFIRM_RECEIPT: [
      {
        key: '不想要了',
        label: '不想要了'
      },
      {
        key: '与订单不符',
        label: '与订单不符'
      },
      {
        key: '物品有损伤',
        label: '物品有损伤'
      },
      {
        key: '质量问题',
        label: '质量问题'
      },
      {
        key: '其他',
        label: '其他'
      }
    ]
  }

  private operateType = ''
  // 1-详情；2-取消；3-确认收货；4-拒绝收货
  private operateForm: any = {
    poOrderId: '',
    soOrderId: '',
    operateType: null, // （2-确认；3-拒绝；4-发货；5-买家拒收
    operateReason: '',
    operateReasonType: ''
  }

  // 1-详情；2-取消；3-确认收货；4-拒绝收货
  private operateReasonTypeLabel = ''

  // 1-详情；2-取消；3-确认收货；4-拒绝收货
  private operateRules = {
    operateReasonType: [
      {
        message: '请输入活动名称',
        trigger: ['change', 'blur'],
        required: true
      }
    ]
  }

  private goOrderOrderOperateDeliver() {
    this.$confirm('您确定该订单没有问题，并确认发货？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.goOrderOrderOperate(false)
    }).catch()
  }

  private goOrderOrderOperateBuyerReject() {
    this.visibleShow = true
    this.title = '拒绝收货'
    this.operateReasonTypeLabel = '拒绝原因:'
    this.operateType = 'CONFIRM_RECEIPT'
  }

  private goOrderOrderOperateRead(data:any) {
    this.$router.push(`/order/sale-order/detail/${data.soOrderId}`)
  }

  private title = ''
  private visibleShow = false
  private goOrderOrderOperateReject() {
    this.visibleShow = true
    this.title = '拒绝响应订单'
    this.operateReasonTypeLabel = '拒绝原因:'
    this.operateType = 'ORDER_RECEIPT'
  }

  private goOrderOrderOperateConfirm() {
    this.$confirm('您确定该订单没有问题，并及时发货？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }).then(() => {
      this.goOrderOrderOperate(false)
    }).catch()
  }

  private goOrderOrderOperate(types:any) {
    console.log('306', types)
  }

  private btnClick(num: number, data: any) {
    Object.assign(this.operateForm, {
      poOrderId: data.poOrderId,
      soOrderId: data.soOrderId,
      operateType: num,
      operateReason: '',
      operateReasonType: ''
    })
    this.operateForm.operateType = num
    Object.keys(this.clickCbData).forEach(key => {
      if (key === num.toString()) {
        this.clickCbData[key](data)
      }
    })
  }

  private async menuDelete(data: {[props: string]: string}) {
    this.$confirm('你确定删除该菜单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }).then(() => {
      return gzhMenuManagerDelete({ menuId: data.menuId })
    }).then(() => {
      this.getList()
    })
  }

  private async getList(gzhId = this.$route.params.id) {
    this.listLoading = true
    console.log('335')
    const params = {
      gzhId: gzhId,
      menuId: this.menuId
    }
    await gzhMenuManagerList(params).then((res) => {
      this.listLoading = false
      this.list = res.payload
    }).finally(() => {
      this.listLoading = false
    })
  }

  private menuId = ''
  private curTreeNode(curNode:any) {
    console.log('354curNode', curNode)
    this.menuId = curNode.menuId
    this.getList()
  }

  private selectableCb(row:any) {
    return row.selectable
  }

  private handleSelectionChange(value: any) {
    console.log(value)
    this.multipleSelection = value
  }

  private goBack() {
    this.$router.go(-1)
  }

  private async submitToWechat() {
    const params = {
      gzhId: this.gzhId
    }
    await gzhMenuManagerRelease(params).then(() => {
      this.$message.success('发布成功')
      this.getList()
    })
  }

  private async handleFilter() {
    this.getList()
  }

  private async handleCreate() {
    this.listQuery = {
      gzhStatus: '',
      companyName: '',
      gzhName: ''
    }
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.second-level-menu-content {
  height: auto;
  overflow: auto;
  flex: 1;
  background: #fff;
  .title {
    font-size: 13px;
  }
  .el-form{
    width: 500px;
  }
  .el-form-item{
    margin-bottom: 20px;
  }
  .submit {
    width: 500px;
    display: flex;
    justify-content: center;
  }
  .operate-footer-menu{
    display: flex;
    justify-content: center;
  }
}
</style>
