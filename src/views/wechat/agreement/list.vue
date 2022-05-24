// 订单管理进货订单
<template>
  <Content>
    <div slot="header">
      <router-link
        :to="`/wechat/configure/agreement/create?id=${gzhId}`"
        class="link-type"
      >
        <el-button type="primary" style="margin-right:10px;">新建</el-button>
      </router-link>
      <!-- <el-button type="primary">导出</el-button>
      <el-button type="primary">自定义列表</el-button> -->
      <!-- <el-button type="primary">去购物车</el-button> -->
    </div>
    <ContentItem :flex="true">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        :style="{width: '100%', height: '100%'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          align="center"
          :selectable="selectableCb"
        />

        <el-table-column
          width="180px"
          align="center"
          show-overflow-tooltip
          label="协议类型"
        >
          <template slot-scope="{row}">
            <span>{{ row.protocolTypeName }}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="center"
          show-overflow-tooltip
          label="协议内容"
        >
          <template slot-scope="{row}">
            <el-button
              :type="'text'"
              size="mini"
              @click="look(row)"
              style="margin-right:10px; min-width: 80px;"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="center"
          show-overflow-tooltip
          label="应用平台"
        >
          <template slot-scope="{row}">
            <span>{{ row.releaseTerminal }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="center"
          show-overflow-tooltip
          label="是否有效"
        >
          <template slot-scope="{row}">
            <span>{{ ['否', '是'][row.protocolStatus] || '' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="center"
          show-overflow-tooltip
          label="提交人"
        >
          <template slot-scope="{row}">
            <span>{{ row.submitName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          min-width="200"
          show-overflow-tooltip
          label="最后更新时间"
        >
          <template slot-scope="{row}">
            <span>{{ row.lastUpdateTime }}</span>
          </template>
        </el-table-column>
        <!-- 1-详情；2-确认；3-拒绝；4-发货；5-买家拒收 -->
        <el-table-column
          align="center"
          label="操作"
          width="350"
          fixed="right"
        >
          <template slot-scope="{row}">
            <router-link :to="`/wechat/configure/agreement/detail/${row.protocolId}`">
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
              @click="openGzhProtocolManagerDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </ContentItem>
    <ContentItem>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
        @pagination="getList"
      />
    </ContentItem>
    <div slot="footer">
      <el-button type="primary" @click="goBack">返回</el-button>
    </div>
    <el-dialog
      :visible.sync="visibleShow"
      width="50%"
    >
      <div slot="title">
        {{title}}
      </div>
      <div :style="{height: '600px'}">
        <iframe width="100%" height="100%" ref="iframe" frameborder="0"></iframe>
      </div>
    </el-dialog>
  </Content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { gzhProtocolManagerList, gzhProtocolManagerDelete, gzhProtocolManagerDetail } from '@/api/wechat'
import { saleOrderData, downdropListData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import Content from '@/components/Content/index.vue'
import ContentItem from '@/components/ContentItem/index.vue'

@Component({
  name: 'ArticleList',
  components: {
    Pagination,
    ContentItem,
    Content
  }
})
export default class extends Vue {
  private total = 0
  private gzhId = this.$route.params.id
  private list: saleOrderData[] = []
  private multipleSelection = []
  private listLoading = true
  private listQuery = {
    gzhStatus: '',
    companyName: '',
    gzhName: '',
    page: 1,
    size: 20
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

  // 返回
  private goBack() {
    this.$router.go(-1)
  }

  // 1-详情；2-取消；3-确认收货；4-拒绝收货
  private clickCbData: any = {
    1: this.goOrderOrderOperateRead
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

  private goOrderOrderOperateRead(data:any) {
    this.$router.push(`/order/sale-order/detail/${data.soOrderId}`)
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

  private async openGzhProtocolManagerDelete(data: {[props: string]: string}) {
    this.$confirm('你确定要将协议删除吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }).then(() => {
      return gzhProtocolManagerDelete({ protocolId: data.protocolId })
    }).then(() => {
      this.getList()
    })
  }

  created() {
    this.getList()
    this.getoptionsOrderStatus()
  }

  private async getList(gzhId = this.$route.params.id) {
    this.listLoading = true
    const { payload } = await gzhProtocolManagerList({ gzhId }).finally(() => {
      this.listLoading = false
    })
    const { list, totalCount } = payload
    list.forEach((item:any) => {
      item.selectable = true
    })
    this.list = list
    this.total = totalCount
  }

  private protocolContent = ''
  private title = ''
  private visibleShow = false
  private async look(data: any) {
    const params = { protocolId: data.protocolId }
    gzhProtocolManagerDetail(params).then((res) => {
      const protocolContent = res.payload.protocolContent
      this.protocolContent = protocolContent
      this.title = data.protocolTypeName
      this.visibleShow = true
      this.$nextTick(() => {
        (this.$refs.iframe as any).contentWindow.document.write(this.protocolContent);
        (this.$refs.iframe as any).contentWindow.document.close()
      })
    })
  }

  private selectableCb(row:any) {
    return row.selectable
  }

  private async getoptionsOrderStatus() {
    // const { payload } = await saleOrderOrderStatus({})
    // this.optionsOrderStatus = payload.map((i:any) => {
    //   const item = i
    //   return {
    //     key: item.statusCode,
    //     label: item.statusName
    //   }
    // })
  }

  private handleSelectionChange(value: any) {
    console.log(value)
    this.multipleSelection = value
  }

  private async handleFilter() {
    console.log('查询')
    this.getList()
  }

  private async handleCreate() {
    console.log('重置')
    this.listQuery = {
      gzhStatus: '',
      companyName: '',
      gzhName: '',
      page: 1,
      size: 20
    }
    this.getList()
  }
}
</script>

<style lang="scss" scoped>

</style>
