// 订单管理进货订单
<template>
  <div class="app-container">
    <!-- button -->
    <div class="operate-button">
      <router-link
        :to="'/order/purchase-order/create/'"
        class="link-type"
      >
        <el-button type="primary" style="margin-right:10px;">新建</el-button>
      </router-link>
      <router-link
        :to="'/order/purchase-order/cart/'"
        class="link-type"
      >
        <el-button type="primary" style="margin-right:10px;">去购物车</el-button>
      </router-link>
      <!-- <el-button type="primary">导出</el-button>
      <el-button type="primary">自定义列表</el-button> -->
      <!-- <el-button type="primary">去购物车</el-button> -->
    </div>
    <div :style="{background: '#fff', padding: '10px', marginBottom: '10px'}">
      <!-- 搜索 -->
      <div class="filter-container">
        <el-input
          v-model="listQuery.orderCode"
          :placeholder="'请输入订单编号'"
          style="width: 220px;margin-right:10px;"
          class="filter-item"
          clearable
          @keyup.enter.native="handleFilter"
        />
        <el-select
          v-model="listQuery.orderType"
          style="width: 220px;margin-right:10px;"
          class="filter-item"
          :placeholder="'请选择订单类型'"
          clearable
        >
          <el-option
            v-for="item in orderTypeOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
        <el-select
          v-model="listQuery.orderStatus"
          style="width: 220px;margin-right:10px;"
          class="filter-item"
          :placeholder="'请选择订单状态'"
          clearable
        >
          <el-option
            v-for="item in saleOrderOrderStatusList"
            :key="item.statusCode"
            :label="item.statusName"
            :value="item.statusCode"
          />
        </el-select>
        <el-select
          v-model="listQuery.paymentStatus"
          style="width: 220px;margin-right:10px;"
          class="filter-item"
          clearable
          :placeholder="'请选择支付状态'"
        >
          <el-option
            v-for="item in paymentStatusOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
        <el-date-picker
          v-model="listQuery.date"
          clearable
          :default-date="[new Date(), new Date()]"
          style="width: 400px;margin-right:10px;"
          type="daterange"
          class="filter-item"
          :default-time="['00:00:00', '23:59:59']"
          :format="'yyyy-MM-dd'"
          start-placeholder="开始时间"
          :default-value="[new Date(), new Date()]"
          end-placeholder="结束时间">
        </el-date-picker>
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
      </div>
    </div>
    <div :style="{background: '#fff', padding: '10px'}">
      <!-- table -->
      <div>
        <el-table
          ref="multipleTable"
          v-loading="listLoading"
          v-for="(data, index) in list"
          :key="index"
          :data="data"
          border
          fit
          :show-header="index === 0"
          highlight-current-row
          :style="{width: '100%','min-width': '1200px', marginTop: data[0] && (data[0].isHeader) ? '10px' : 0, background: '#fff'}"
          :span-method="arraySpanMethod"
          :row-class-name="data[0] && (data[0].isHeader) ? 'header-cell-class' : ''"
          :header-cell-class-name="'header-cell-class'"
        >

          <el-table-column
            min-width="300px"
            align="center"
            label="订单详情"
          >
            <template slot-scope="{row}">
              <div class="c-flex" v-if="row.step === 1">
                <div>{{ row.orderSubmitDate }}</div>
                <div class="c-detail">
                  <div class="c-label">订单号：</div>
                  <div class="c-value">{{row.purchaseMainOrderCode}}</div>
                </div>
                <div class="c-detail">
                  <div class="c-label">订单总金额：</div>
                  <div class="c-value" :style="{color: '#409EFF'}">{{row.orderTotalAmount}}</div>
                </div>
                <div class="c-detail" v-if="row.companyName">
                  {{row.companyName}}
                </div>
                <div v-if="list[index + 1] && list[index + 1][0] && (list[index + 1][0].step === 2)" :style="{flex: 1, textAlign: 'right'}">您订单中的商品在不同库房或属不同商家，故拆分为以下订单分开配送，给您带来的不便敬请谅解。</div>
              </div>
              <div class="c-flex" v-if="row.step === 2">
                <div>{{ row.orderSubmitDate }}</div>
                <div class="c-detail">
                  <div class="c-label">订单号：</div>
                  <div class="c-value">{{row.subOrderCode}}</div>
                </div>
                <div class="c-detail">
                  <div class="c-label">订单总金额：</div>
                  <div class="c-value" :style="{color: '#409EFF'}">{{row.orderAmount}}</div>
                </div>
                <div class="c-detail">
                  {{row.companyName}}
                </div>
                <div :style="{flex: 1, textAlign: 'right'}">{{row.splitOrderDesc}}</div>
              </div>
              <div class="c-flex" v-if="row.step === 3">
                <div class="c-detail">
                  <el-image
                    style="width: 60px; height: 60px"
                    :src="row.skuImage"
                    fit="contain"
                    :preview-src-list="[row.skuImage]">
                  </el-image>
                </div>
                <div class="c-detail">
                  {{row.skuName}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="80px"
            align="center"
            label="数量"
          >
            <template slot-scope="{row}">
              <span>{{ row.skuCount }}</span>
            </template>
          </el-table-column>

          <el-table-column
            width="80px"
            align="center"
            label="订单金额"
          >
            <template slot-scope="{row}">
              <span>{{ row.totalAmount }}</span>
            </template>
          </el-table-column>

          <el-table-column
            width="80px"
            label="订单类型"
            prop="orderType"
          >
            <template slot-scope="{row}">
              <span>{{ getLabelByKey(orderTypeOptions, row.orderType) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            class-name="status-col"
            label="订单状态"
            prop="orderStatusName"
            width="80"
          >
            <template slot-scope="{row}">
              <span>
                {{ row.orderStatusName }}
              </span>
            </template>
          </el-table-column>

          <el-table-column
            min-width="80px"
            label="支付状态"
            prop="orderPayStatus"
          >
            <template slot-scope="{row}">
              <span>{{ getLabelByKey(paymentStatusOptions, row.orderPayStatus) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            width="120px"
            label="提交人姓名"
            prop="submitUserName"
          >
            <template slot-scope="{row}">
              <span>{{ row.submitUserName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="320px"
            prop="handler"
            :fixed="data[0] && data[0].step === 3 ? 'right' : null"
          >
            <template slot-scope="{row}">
              <div v-if="row.step === 3">
                <template v-for="(item, index) in row.operateButtonList">
                  <el-button
                      :key="index"
                      :type="item.enable ? 'primary' : 'info'"
                      size="small"
                      :disabled="!item.enable"
                      style="margin-right:10px;min-width: 80px;"
                      @click="btnClick(item.buttonOperate, row)"
                    >
                      {{item.buttonName}}
                    </el-button>
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
        @pagination="getList"
      />
    </div>
    <el-dialog
      :visible.sync="visibleShow"
      width="50%"
    >
      <div slot="title">
        {{title}}
      </div>
      <div>
        <el-form :model="operateForm" :ref="'operateForm'" :rules="operateRules" :label-width="'90px'">
          <el-form-item :style="{marginBottom: '20px'}" class="filter-item" ref="operateForm" :label="operateReasonTypeLabel" prop="operateReasonType">
            <el-select
              v-model="operateForm.operateReasonType"
              style="width: 220px;margin-right:10px;"
              :placeholder="'请选择原因'"
              clearable
            >
              <el-option
                v-for="item in operateReasonTypeOptions[operateType]"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item  :style="{marginBottom: '20px'}" class="filter-item"  label="详细描述:" prop="operateReason">
            <el-input style="width: 400px;height: 100px; margin-right:10px;" type="textarea" v-model="operateForm.operateReason"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template slot="footer">
        <span class="dialog-footer">
          <el-button @click="visibleShow = false">取 消</el-button>
          <el-button type="primary" @click="goOrderOrderOperate">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import { TagsViewModule } from '@/store/modules/tags-view'
import { purchaseOrderOrderList, purchaseOrderOrderStatus, purchaseOrderOrderOperate } from '@/api/order'
// import { IArticleData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { parseTime } from '@/utils'
import { Form as ElForm } from 'element-ui'

@Component({
  components: {
    Pagination
  }
})
export default class extends Vue {
  private total = 0
  private list: Object[] = [[{}]]
  private multipleSelection = []
  private listLoading = true
  private listQuery = {
    submitStartDate: '',
    submitEndDate: '',
    date: '',
    page: 1,
    size: 20
  }

  private optionsCompanyType = [
    {
      key: 1,
      label: '全部'
    },
    {
      key: 2,
      label: '个头工商户'
    },
    {
      key: 3,
      label: '有限责任公司（自然人投资或控股）'
    }
  ]

  private orderTypeOptions = [
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

  // 支付状态
  private paymentStatusOptions = [
    {
      key: 101,
      label: '待支付'
    },
    {
      key: 102,
      label: '支付中'
    },
    {
      key: 103,
      label: '已支付'
    },
    {
      key: 104,
      label: '支付失败'
    }
  ]

  // 订单操作模块
  private visibleShow = false

  private operateType = ''

  private title = ''

  // 1-详情；2-取消；3-确认收货；4-拒绝收货
  private clickCbData: any = {
    1: this.goOrderOrderOperateRead,
    2: this.goOrderOrderOperateCansel,
    3: this.goOrderOrderOperateConfirm,
    4: this.goOrderOrderOperateReject
  }

  // 1-详情；2-取消；3-确认收货；4-拒绝收货
  private operateReasonTypeOptions: any = {
    CANSEL: [
      {
        key: '不想要了',
        label: '不想要了'
      },
      {
        key: '商品错选/多选',
        label: '商品错选/多选'
      },
      {
        key: '地址写错了',
        label: '地址写错了'
      },
      {
        key: '商品无货',
        label: '商品无货'
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
    operateType: null, // 2-取消；3-确认收货；4-拒绝收货
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

  private goOrderOrderOperateCansel() {
    this.visibleShow = true
    this.title = '取消订单'
    this.operateReasonTypeLabel = '取消原因:'
    this.operateType = 'CANSEL'
  }

  private goOrderOrderOperateRead(data:any) {
    // TagsViewModule.delView(this.$route)
    this.$router.push(`/order/purchase-order/detail/${data.poOrderId}`)
  }

  private goOrderOrderOperateReject() {
    this.visibleShow = true
    this.title = '拒绝收货'
    this.operateReasonTypeLabel = '拒绝原因:'
    this.operateType = 'CONFIRM_RECEIPT'
  }

  private goOrderOrderOperateConfirm() {
    this.$confirm('您确认货已经收到？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }).then(() => {
      this.goOrderOrderOperate(false)
    }).catch()
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

  private async goOrderOrderOperate(isValid = true) {
    if (isValid) {
      (this.$refs.operateForm as ElForm).validate(
        async(valid: boolean) => {
          if (valid) {
            const requestData = {
              ...this.operateForm,
              operateReason: `${this.operateReasonTypeLabel}${this.operateForm.operateReasonType};${this.operateForm.operateReason}`
            }
            await purchaseOrderOrderOperate(requestData)
            this.visibleShow = false
            this.getList()
          }
        })
    } else {
      await purchaseOrderOrderOperate(this.operateForm)
      this.visibleShow = false
      this.getList()
    }
  }

  created() {
    this.getList()
    this.getSaleOrderOrderStatus()
  }

  private async getList() {
    this.listLoading = true
    await purchaseOrderOrderList(this.getListQueryData(this.listQuery)).then((res) => {
      const data = res.payload
      const list: Object[] = [[{ step: 0 }]]
      data.list.forEach((i:any) => {
        // 第1层级
        const step = 1
        const { companyOrderList, ...mainOrder } = i
        const companyData:any = {}
        if (companyOrderList.length > 1) {
          list.push([{ ...mainOrder, step, ...companyData, isHeader: true }])
        }
        if (companyOrderList) {
          // 第2层级
          companyOrderList.forEach((it: any) => {
            const { goodsList, ...companyOrderData } = it
            list.push([{ ...mainOrder, ...companyOrderData, step: step + 1, isHeader: !(companyOrderList.length > 1) }])
            if (goodsList) {
              // 第3层级
              list.push(goodsList.map((good:any, index:number) => {
                return { ...good, ...companyOrderData, step: step + 2, colIndex: index === 0 ? goodsList.length : 0 }
              }))
            }
          })
        }
      })
      this.list = list
      // console.log(this.list)
      this.total = data.totalCount
    }).finally(() => {
      this.listLoading = false
    })
  }

  private getListQueryData(data:any) {
    let { date = [], ...requestData } = data
    date = date || []
    const [submitStartDate = '', submitEndDate = ''] = date
    return { ...requestData, submitStartDate: parseTime(submitStartDate, '{y}-{m}-{d}'), submitEndDate: parseTime(submitEndDate, '{y}-{m}-{d}') }
  }

  private arraySpanMethod({ row, column, columnIndex }:any) {
    if (row.step === 1 && columnIndex === 0) {
      return [1, 8]
    } else if (row.step === 1) {
      return [0, 0]
    }
    if (row.step === 0) {
      return [0, 0]
    }
    if (row.step === 2 && columnIndex === 0) {
      return [1, 8]
    } else if (row.step === 2) {
      return [0, 0]
    }
    if (row.step === 3 && ['handler', 'orderStatusName', 'orderPayStatus', 'submitUserName', 'orderType'].includes(column.property)) {
      return [row.colIndex, 1]
    }
  }

  // 获取订单状态
  private saleOrderOrderStatusList = []
  private async getSaleOrderOrderStatus() {
    this.saleOrderOrderStatusList = []
    await purchaseOrderOrderStatus({}).then((res) => {
      this.saleOrderOrderStatusList = res.payload
    }).finally()
  }

  private async handleFilter() {
    this.listQuery.page = 1
    this.getList()
  }

  private getLabelByKey(list: any[], value:string|number) {
    const data = list.find(({ key }) => key === value)
    if (data) {
      return data.label
    } else {
      return ''
    }
  }

  private async handleCreate() {
    console.log('重置')
    this.listQuery = {
      submitStartDate: '',
      submitEndDate: '',
      date: '',
      page: 1,
      size: 20
    }
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  padding: 10px;
  overflow-x: auto;
  .operate-button{
    margin-bottom: 10px;
  }

  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  .c-flex {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .c-detail {
    padding: 10px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    // margin: 10px 0;
  }
  .c-label {
    color: #666;
    width: 90px;
    text-align: right;
  }
}

</style>
<style lang="scss">
.app-container {
  .header-cell-class {
    background: #f2f2f2;
  }
}
</style>
