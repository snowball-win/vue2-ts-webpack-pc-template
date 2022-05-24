// 订单管理进货订单
<template>
  <Content class="wechat-consultation">
    <div slot="header">
      <router-link
        :to="'/wechat/consultation/create'"
        class="link-type"
      >
        <el-button type="primary" style="margin-right:10px;">新建</el-button>
      </router-link>
      <el-button type="primary" @click="onPublish">发布</el-button>
    </div>
    <!-- 搜索 -->
    <ContentItem :style="{marginBottom: '10px', paddingBottom: '0'}">
      <el-input
        v-model="listQuery.gzhName"
        :placeholder="'公众号名称'"
        style="width: 220px;margin-right:10px;margin-bottom: 10px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.releaseBatch"
        :placeholder="'发布批次号'"
        style="width: 220px;margin-right:10px;margin-bottom: 10px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.newsTitle"
        :placeholder="'请输入资讯标题'"
        style="width: 220px;margin-right:10px;margin-bottom: 10px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.releaseStatus"
        style="width: 220px;margin-right:10px;margin-bottom: 10px;"
        class="filter-item"
        clearable
        :placeholder="'请选择有效状态'"
      >
        <el-option
          v-for="item in releaseStatusOption"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        重置
      </el-button>
    </ContentItem>
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
          label="发布批次号"
        >
          <template slot-scope="{row}">
            <span>{{ row.releaseBatch }}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="center"
          label="资讯标题"
        >
          <template slot-scope="{row}">
            <span>{{ row.newsTitle }}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="center"
          label="资讯摘要"
        >
          <template slot-scope="{row}">
            <span>{{ row.newsAbstract }}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="center"
          label="封面图片"
        >
          <template slot-scope="{row}">
            <el-button class="display-none" size="small" type="text" @click="onPreview(row)">预览</el-button>
            <el-image :ref="`img-${row.newsId}`" :style="{display: 'none'}" :preview-src-list="[row.coverImageUrl]" :src="row.coverImageUrl" fit="contain" />
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="center"
          label="发布类型"
        >
          <template slot-scope="{row}">
            <span>{{ releaseModelData[row.releaseModel] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="105px"
          align="center"
          label="发布状态"
        >
          <template slot-scope="{row}">
            <span>{{ releaseStatusData[row.releaseStatus] }}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="center"
          label="推送粉丝数"
        >
          <template slot-scope="{row}">
            <span>{{ row.wxTotalCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="center"
          label="成功接收数"
        >
          <template slot-scope="{row}">
            <span>{{ row.wxSuccCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="center"
          label="失败接收数"
        >
          <template slot-scope="{row}">
            <span>{{ row.wxFailCount }}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="center"
          label="计划发布时间"
        >
          <template slot-scope="{row}">
            <span>{{ row.planReleaseTime }}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="center"
          label="实际发布时间"
        >
          <template slot-scope="{row}">
            <span>{{ row.actualReleaseTime }}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="center"
          label="最后修改人"
        >
          <template slot-scope="{row}">
            <span>{{ row.lastUpdateRealName }}</span>
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
                :disabled="row.releaseStatus === 2"
                @click="openGzhMainManagerOperate(row, row.releaseStatus)"
                style="margin-right:10px;min-width: 80px;"
              >
                {{releaseData[row.releaseStatus]}}
              </el-button>
            </template>
            <router-link :to="`/wechat/consultation/detail/${row.newsId}`">
              <el-button
                :type="'primary'"
                size="mini"
                style="margin-right:10px;min-width: 80px;"
              >
                查看
              </el-button>
            </router-link>
            <el-button
              :type="'primary'"
              size="mini"
              style="margin-right:10px;min-width: 80px;"
              @click="onGzhNewsInfoManagerDelete(row)"
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
    <el-dialog
      :visible.sync="publishVisible"
      custom-class="wechat-dialog"
      title="发布资讯"
    >
      <el-form :model="publistForm" inline>
        <el-form-item prop="originalFlag" label="发布方式:">
          <el-select
            v-model="publistForm.releaseModel"
            placeholder="请选择"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in releaseModelOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="releaseTime"
          label="发布时间:"
        >
          <el-date-picker
            type="date"
            placeholder="请选择开始日期"
            value-format="yyyy-MM-dd"
            clearable
            v-model="publistForm.releaseTime"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        :data="publishList"
        border
        fit
        highlight-current-row
        :style="{width: '100%', height: '100%'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="index"
          label="序号"
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
          width="auto"
          align="center"
          show-overflow-tooltip
          label="资讯标题"
        >
          <template slot-scope="{row}">
            <span>{{ row.newsTitle }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="center"
          show-overflow-tooltip
          label="排序"
        >
          <template slot-scope="{row}">
            <el-select
              v-model="row.releaseNumber"
              placeholder="请选择"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in sortOption"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <template #footer class="wechat-dialog-footer" style="text-align: right; margin-top: 10px;">
        <el-button type="default" @click="publishVisible = false">取消</el-button>
        <el-button type="primary" :loading="publishLoading" @click="submitPublish">确定</el-button>
      </template>
    </el-dialog>
  </Content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { gzhNewsInfoManagerList, gzhNewsInfoManagerRelease, gzhNewsInfoManagerDelete, gzhNewsInfoManagerCancel } from '@/api/wechat'
import { saleOrderData, downdropListData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import Content from '@/components/Content/index.vue'
import ContentItem from '@/components/ContentItem/index.vue'
import { cloneDeep } from 'lodash'

@Component({
  name: 'ArticleList',
  components: {
    Pagination,
    Content,
    ContentItem
  }
})
export default class extends Vue {
  private total = 0
  private list: saleOrderData[] = []
  private multipleSelection = []
  private listLoading = true
  private listQuery = {
    releaseStatus: '',
    companyName: '',
    gzhName: '',
    page: 1,
    size: 20
  }

  // 订单类型（1-普通订单；2-后付订单；3-积分订单；4-其他订单
  private releaseStatusOption = [
    {
      key: null,
      label: '全部'
    },
    {
      key: 0,
      label: '待发布'
    },
    {
      key: 1,
      label: '已计划'
    },
    {
      key: 2,
      label: '已发布'
    }
  ]

  private releaseModelOption = [
    {
      label: '立即发布',
      value: 1
    },
    {
      label: '定时发布',
      value: 2
    }
  ]

  // 资讯类型（1-普通订单；2-后付订单；3-积分订单；4-其他订单
  private releaseStatusData = {
    0: '待发布',
    1: '已计划',
    2: '已发布'
  }

  // 资讯类型（1-普通订单；2-后付订单；3-积分订单；4-其他订单
  private releaseModelData = {
    1: '立即发布',
    2: '定时发布'
  }

  // 资讯类型（1-普通订单；2-后付订单；3-积分订单；4-其他订单
  private publistForm = {
    releaseModel: 1,
    releaseTime: null
  }

  // 资讯类型（1-普通订单；2-后付订单；3-积分订单；4-其他订单
  private sortOption:{[p: string]: string|number}[] = []

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
  private releaseData = {
    0: '发布',
    1: '撤销',
    2: '撤销'
  }

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

  private onPreview(row:any) {
    (this.$refs[`img-${row.newsId}`] as unknown as { showViewer: boolean }).showViewer = true
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

  private async openGzhMainManagerOperate(data: {[props: string]: string}, status: unknown) {
    if (status === 0) {
      this.publishList = cloneDeep([data])
      this.sortOption = this.publishList.slice().map((_item, index) => {
        return {
          label: index + 1,
          value: index + 1
        }
      })
      this.publishVisible = true
    }
    if (status === 2) {
      this.$confirm(`你确定要将${data.newsTitle}撤销吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        return gzhNewsInfoManagerCancel({ gzhId: data.gzhId })
      }).then(() => {
        this.getList()
      })
    }
  }

  private async onGzhNewsInfoManagerDelete(data: {[props: string]: string}) {
    this.$confirm(`你确定要将${data.newsTitle}删除吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }).then(() => {
      return gzhNewsInfoManagerDelete({ newsId: data.newsId })
    }).then(() => {
      this.getList()
    })
  }

  created() {
    this.getList()
  }

  private async getList() {
    this.listLoading = true
    const { payload } = await gzhNewsInfoManagerList(this.listQuery).finally(() => {
      this.listLoading = false
    })
    const { list, totalCount } = payload
    list.forEach((item:any) => {
      item.selectable = true
    })
    this.list = list
    this.total = totalCount
  }

  private selectableCb(row:any) {
    return row.selectable
  }

  private handleSelectionChange(value: any) {
    console.log(value)
    this.multipleSelection = value
  }

  private publishVisible = false
  private publishList: {[p: string]: string}[] = []
  private onPublish() {
    const publishList = cloneDeep(this.multipleSelection || [])
    this.sortOption = publishList.slice().map((_item, index) => {
      return {
        label: index + 1,
        value: index + 1
      }
    })
    const last = publishList.reduce((pre:{[p:string]:string}, next:{[p:string]:string}):{[p:string]:string} => {
      return pre.gzhId === next.gzhId ? pre : next
    }, publishList[0])
    if (publishList.length < 1) {
      this.$message({
        message: '请选择一个资讯',
        type: 'warning'
      })
      return
    }
    if (publishList[0] !== last) {
      this.$message({
        message: '请选择同一个公众号',
        type: 'warning'
      })
      return
    }
    publishList.forEach((item:any, index) => {
      item.releaseNumber = index + 1
    })
    this.publishList = publishList
    this.publishVisible = true
  }

  private publishLoading = false
  private submitPublish() {
    const body = {
      ...this.publishList[0],
      ...this.publistForm,
      releaseNewsList: this.publishList
    }
    this.publishLoading = true
    gzhNewsInfoManagerRelease(body)
      .then(res => {
        if (res.code === '0') {
          this.$message.success('操作成功')
        } else {
          this.$message.error(res.msg)
        }
      })
      .finally(() => {
        this.publishVisible = false
        this.publishLoading = false
      })
  }

  private async handleFilter() {
    console.log('查询')
    this.getList()
  }

  private async handleCreate() {
    console.log('重置')
    this.listQuery = {
      releaseStatus: '',
      companyName: '',
      gzhName: '',
      page: 1,
      size: 20
    }
    this.getList()
  }
}
</script>

<style lang="scss">
.wechat-consultation {
  .wechat-dialog {
    .el-dialog__header{
      border-bottom: 1px solid rgba(235, 235, 235, 1);
    }
    .el-dialog__header, .el-dialog__footer {
      border-top: 1px solid rgba(235, 235, 235, 1);
    }
  }
}
</style>
