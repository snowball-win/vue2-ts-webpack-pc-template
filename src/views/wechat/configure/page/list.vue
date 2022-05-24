// 订单管理进货订单
<template>
  <Content>
    <div slot="header">
      <router-link
        :to="`/wechat/configure/page/create?gzhId=${$route.query.gzhId}`"
        :query="{gzhId}"
        class="link-type"
      >
        <el-button type="primary" style="margin-right:10px;">新建</el-button>
      </router-link>
    </div>
    <ContentItem :flex="true">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        :style="{height: '100%'}"
      >
        <el-table-column
          type="selection"
          align="center"
        />

        <el-table-column
          width="180px"
          align="center"
          show-overflow-tooltip
          label="公众号名称"
        >
          <template slot-scope="{row}">
            <span>{{ row.gzhName }}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="200px"
          align="center"
          show-overflow-tooltip
          label="所属主体"
        >
          <template slot-scope="{row}">
            <span>{{ row.companyName }}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="center"
          label="页面名称"
        >
          <template slot-scope="{row}">
            <span>{{ row.pageName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="300px"
          show-overflow-tooltip
          align="center"
          label="页面地址"
        >
          <template slot-scope="{row}">
            <span>{{ row.pageUrl }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="105px"
          align="center"
          label="是否有效"
        >
          <template slot-scope="{row}">
            <span>{{ gzhStatusData[row.pageStatus] }}</span>
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
            <template>
              <el-button
                :type="'primary'"
                size="mini"
                @click="openGzhMainManagerOperate(row, row.pageStatus === 1 ? 0 : row.pageStatus === 0 ? 1 : null)"
                style="margin-right:10px; min-width: 80px;"
              >
                {{row.pageStatus === 1 ? '置为无效' : row.pageStatus === 0 ? '置为有效' : ''}}
              </el-button>
            </template>
            <router-link :to="`/wechat/configure/page/detail/${row.pageId}`">
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
              @click="openGzhMainManagerOperate(row, 2)"
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
  </Content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { gzhCustomPagePageList, gzhCustomPageOperate } from '@/api/wechat'
import { saleOrderData, downdropListData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import Content from '@/components/Content/index.vue'
import ContentItem from '@/components/ContentItem/index.vue'
import internal from 'stream'

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
  private list: saleOrderData[] = []
  private multipleSelection = []
  private listLoading = true
  private listQuery = {
    gzhId: this.$route.query && this.$route.query.gzhId,
    page: 1,
    size: 20
  }

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

  private async openGzhMainManagerOperate(data: {[props: string]: string}, pageStatus: internal) {
    const messageData: {[props: string]: string} = {
      0: `你确定要将${data.pageName}置为无效吗？`,
      1: `你确定要将${data.pageName}置为有效吗？`,
      2: `你确定要将${data.pageName}删除吗？`
    }
    this.$confirm(messageData[String(pageStatus)], '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }).then(() => {
      return gzhCustomPageOperate({ pageId: data.pageId, operateType: pageStatus })
    }).then(() => {
      this.getList()
    })
  }

  created() {
    this.getList()
  }

  private gzhId = this.$route.query && this.$route.query.gzhId
  private async getList() {
    this.listLoading = true
    const { payload } = await gzhCustomPagePageList(this.listQuery).finally(() => {
      this.listLoading = false
    })
    const { list, totalCount } = payload
    list.forEach((item:any) => {
      item.selectable = true
    })
    this.list = list
    this.total = totalCount
  }
}
</script>

<style lang="scss" scoped>

</style>
