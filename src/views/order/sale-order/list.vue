// 订单管理进货订单
<template>
  <div class="order-sale-order">
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
        clearable
        :placeholder="'请选择订单类型'"
      >
        <el-option
          v-for="item in optionsOrderType"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.orderStatus"
        style="width: 220px;margin-right:10px;"
        class="filter-item"
        clearable
        :placeholder="'请选择订单状态'"
      >
        <el-option
          v-for="item in optionsOrderStatus"
          :key="item.key"
          :label="item.label"
          :value="item.key"
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
          v-for="item in optionsPaymentStatus"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-date-picker
        v-model="listQuery.date"
        clearable
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
    <div :style="{padding: '10px', background: 'white', flex: '1', width: '100%'}">
          <!-- table -->
        <el-table
          ref="multipleTable"
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          :style="{width: '100%', flex: 1, height: '100%'}"
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
            label="销售订单编号"
          >
            <template slot-scope="{row}">
              <span>{{ row.saleOrderCode }}</span>
            </template>
          </el-table-column>

          <el-table-column
            width="180px"
            align="center"
            label="进货订单编号"
          >
            <template slot-scope="{row}">
              <span>{{ row.purchaseOrderCode }}</span>
            </template>
          </el-table-column>

          <el-table-column
            width="180px"
            align="center"
            label="订单金额"
          >
            <template slot-scope="{row}">
              <span>{{ row.saleOrderAmount }}</span>
            </template>
          </el-table-column>

          <el-table-column
            width="105px"
            label="订单类型"
          >
            <template slot-scope="{row}">
              <span>{{ optionsOrderTypeData[row.orderType] }}</span>
            </template>
          </el-table-column>

          <el-table-column
            class-name="status-col"
            label="订单状态"
            width="110"
          >
            <template slot-scope="{row}">
              <span>{{ row.orderStatusName }}</span>
            </template>
          </el-table-column>

          <el-table-column
            min-width="300px"
            label="支付状态"
          >
            <template slot-scope="{row}">
              <span>{{ optionsPaymentStatusData[row.orderPayStatus] }}</span>
            </template>
          </el-table-column>

          <el-table-column
            min-width="300px"
            label="提交人姓名"
          >
            <template slot-scope="{row}">
              <span>{{ row.submitUserName }}</span>
            </template>
          </el-table-column>

          <el-table-column
            min-width="300px"
            label="提交时间"
          >
            <template slot-scope="{row}">
              <span>{{ row.orderSubmitDate }}</span>
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
              <template v-for="(item, index) in row.operateButtonList">
                <el-button
                    :key="index"
                    :type="item.enable ? 'primary' : 'info'"
                    size="mini"
                    :disabled="!item.enable"
                    style="margin-right:10px; min-width: 80px;"
                    @click="btnClick(item.buttonOperate, row)"
                  >
                    {{item.buttonName}}
                  </el-button>
                <!-- <router-link :to="`/order/sale-order/detail/${row.soOrderId}`" v-if="item.buttonOperate === 1">
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-edit"
                    style="margin-right:10px;"
                  >
                    详情
                  </el-button>
                </router-link>
                <template v-if="item.buttonOperate === 2">
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-edit"
                    style="margin-right:10px;"
                  >
                    确认
                  </el-button>
                </template>
                <template v-if="item.buttonOperate === 4">
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-edit"
                  >
                    发货
                  </el-button>
                </template>
                <template v-if="item.buttonOperate === 3">
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-edit"
                  >
                    拒绝
                  </el-button>
                </template>
                <template v-if="item.buttonOperate === 5">
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-edit"
                  >
                    买家拒收
                  </el-button> -->
                <!-- </template> -->
              </template>
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
import { saleOrderOrderList, saleOrderOrderStatus, saleOrderOrderOperate } from '@/api/order'
import { saleOrderData, downdropListData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { parseTime } from '@/utils'
import { Form as ElForm } from 'element-ui'

@Component({
  name: 'ArticleList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private total = 0
  private list: saleOrderData[] = []
  private multipleSelection = []
  private listLoading = true
  private listQuery = {
    submitStartDate: '',
    submitEndDate: '',
    date: '',
    page: 1,
    size: 20
  }

  // 订单类型（1-普通订单；2-后付订单；3-积分订单；4-其他订单
  private optionsOrderType = [
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

  // 订单类型（1-普通订单；2-后付订单；3-积分订单；4-其他订单
  private optionsOrderTypeData = {
    1: '普通订单',
    2: '后付订单',
    3: '积分订单',
    4: '其他订单'
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

  // 支付状态（101-待支付；102-支付中；103-已支付；104-支付失败）
  private optionsPaymentStatus = [
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

  // 支付状态（101-待支付；102-支付中；103-已支付；104-支付失败）
  private optionsPaymentStatusData = {
    101: '待支付',
    102: '支付中',
    103: '已支付',
    104: '支付失败'
  }

  // 订单操作模块
  private visibleShow = false

  private operateType = ''

  private title = ''

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
            await saleOrderOrderOperate(requestData)
            this.visibleShow = false
            this.getList()
          }
        })
    } else {
      await saleOrderOrderOperate(this.operateForm)
      this.visibleShow = false
      this.getList()
    }
  }

  created() {
    this.getList()
    this.getoptionsOrderStatus()
  }

  private async getList() {
    this.listLoading = true
    const { payload } = await saleOrderOrderList(this.getListQueryData(this.listQuery)).finally(() => {
      this.listLoading = false
    })
    const { list, totalCount } = payload
    list.forEach((item:any) => {
      item.selectable = true
    })
    this.list = list
    this.total = totalCount
  }

  private getListQueryData(data:any) {
    let { date = [], ...requestData } = data
    date = date || []
    const [submitStartDate = '', submitEndDate = ''] = date
    return { ...requestData, submitStartDate: parseTime(submitStartDate, '{y}-{m}-{d}'), submitEndDate: parseTime(submitEndDate, '{y}-{m}-{d}') }
  }

  private selectableCb(row:any) {
    return row.selectable
  }

  private async getoptionsOrderStatus() {
    const { payload } = await saleOrderOrderStatus({})
    this.optionsOrderStatus = payload.map((i:any) => {
      const item = i
      return {
        key: item.statusCode,
        label: item.statusName
      }
    })
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
.order-sale-order{
  padding: 10px;
  // display: flex;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .filter-container {
    padding: 10px;
    background: #fff;
    width: 100%;
    margin-bottom: 10px ;
  }
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
}

</style>
