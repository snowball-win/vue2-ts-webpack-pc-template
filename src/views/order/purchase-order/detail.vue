// 新建订单
<template>
  <div class="app-container order-detail">
    <el-container>
      <el-main>
        <el-row :gutter="10">
          <el-col :span="5" >
            <div :style="{background: 'white', padding: '10px', height: '200px'}">
              <div class="c-detail" :style="{width: '250px', margin: 'auto'}">
                <div class="c-label">订单编号：</div>
                <div class="c-value">{{detailData.purchaseOrderCode}}</div>
              </div>
              <div class="c-big-blue" :style="{marginTop: '40px'}">
                <div>{{detailData.orderStatusName}}</div>
              </div>
            </div>
          </el-col>
          <el-col :span="19">
            <div class="c-flex-center" :style="{height: '200px'}">
              <el-steps :style="{width: '100%'}" :active="tranceList.findIndex(item => item.selected)" align-center>
                <el-step
                  v-for="(item, index) in tranceList"
                  :key="index"
                  :title="item.traceName"
                  :description="item.date"
                >
                  <template slot="icon">
                    <span class="round-span" :class="{'step-active': item.selected}">
                      {{index + 1}}
                    </span>
                    <span class="title">{{item.statusName}}</span>
                  </template>
                </el-step>
              </el-steps>
              <div class="c-bottom-left" v-if="detailData.remark" :style="{paddingLeft: '10px'}">
                <el-icon name="warning" :style="{color: '#ffba00'}"></el-icon>
                {{detailData.remark}}
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-container>
      <el-main>
        <el-row :gutter="10">
          <el-col :span="8">
            <div>
              <div class="title c-title">收件人信息</div>
              <div class="c-flex-center">
                <div class="c-detail">
                  <div class="c-label">收件人：</div>
                  <div class="c-value">{{detailData.linkMan}}</div>
                </div>
                <div class="c-detail">
                  <div class="c-label">地址：</div>
                  <div class="c-value">{{detailData.addressDetail}}</div>
                </div>
                <div class="c-detail">
                  <div class="c-label">电话：</div>
                  <div class="c-value">{{detailData.mobile}}</div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="8" >
            <div class="title  c-title">支付信息</div>
            <div class="c-flex-center" :style="{justifyContent: 'start'}">
              <div class="c-detail">
                <div class="c-label">付款方式：</div>
                <div class="c-value">{{payTypeData[detailData.payType]}}</div>
              </div>
              <div class="c-detail">
                <div class="c-label">付款时间：</div>
                <div class="c-value">{{detailData.payDate}}</div>
              </div>
            </div>
          </el-col>
          <el-col :span="8" >
            <div class="title c-title">发货信息</div>
            <div class="c-flex-center"  :style="{justifyContent: 'start'}">
              <div class="c-detail">
                <!-- <div class="c-label">发货编号：</div>
                <div class="c-value">{{detailData.saleOrderCode}}</div>
                <div class="c-label">发货方式：</div>
                <div class="c-value">{{detailData.deliverType}}</div> -->
                <div class="c-label">发货人：</div>
                <div class="c-value">{{detailData.deliverUserName}}</div>
              </div>
              <div class="c-detail">
                <div class="c-label">发货时间：</div>
                <div class="c-value">{{detailData.deliverDate}}</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-container>
      <!-- table -->
      <el-table
        ref="multipleTable"
        :data="goodsList"
        border
        fit
        highlight-current-row
        :style="{width: '100%', padding: '10px'}"
      >
        <!-- <el-table-column
          type="selection"
          align="center"
        /> -->
        <el-table-column
          min-width="80"
          align="center"
          label="产品图片"
        >
          <template slot-scope="{row}">
            <el-image
              style="width: 80px; height: 50px"
              :src="row.skuImage"
              fit="contain"
              :preview-src-list="[row.skuImage]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          min-width="80"
          align="center"
          label="商品名称"
        >
          <template slot-scope="{row}">
            <span>{{ row.skuName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="80"
          align="center"
          label="单价"
        >
          <template slot-scope="{row}">
            <span>{{ row.unitPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="80"
          align="center"
          label="数量"
        >
          <template slot-scope="{row}">
            <span>{{ row.skuCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="80"
          align="center"
          label="小计"
        >
          <template slot-scope="{row}">
            <span>{{ row.totalAmount }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-container>
     <el-container>
      <el-main>
        <div class="c-detail">
          <div class="c-label">订单金额：</div>
          <div class="c-value red">￥{{detailData.orderAmount}}</div>
        </div>
        <!-- <div class="c-detail">
          <div class="c-label">运费：</div>
          <div class="c-value">{{detailData.orderAmount}}</div>
        </div>
        <div class="c-detail">
          <div class="c-label">实付款：</div>
          <div class="c-value">{{detailData.orderAmount}}</div>
        </div> -->
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import createComponents from './components/create.vue'
import { purchaseOrderOrderDetail } from '@/api/order'

@Component({
  name: 'userlist',
  components: {
    createComponents
  }
})
export default class extends Vue {
  private params = this.$route.params
  private goodsList = []
  private tranceList = []
  private detailData = {}

  created() {
    this.getPurchaseOrderOrderDetail()
  }

  // 支付方式（1-货到付款；2-在线支付；3-押金支付）
  private payTypeData = {
    1: '货到付款',
    2: '在线支付',
    3: '押金支付'
  }

  private async getPurchaseOrderOrderDetail() {
    const { id: purchaseOrderId } = this.params
    const { payload, code } = await purchaseOrderOrderDetail({ purchaseOrderId })
    if (code === '0') {
      const { companyGoodsList: goodsList, orderTraceList: tranceList, ...detailData } = payload
      let remarkData:any = {}
      if (tranceList && tranceList.length > 0) {
        remarkData = tranceList.filter((item:any) => item.selected)[0] || {}
      }
      detailData.remark = remarkData.statusName === '已拒绝'
        ? `商家拒绝接单，拒绝原因：${remarkData.remark}`
        : remarkData.statusName === '拒绝收货'
          ? `买家拒绝收货，拒绝原因：${remarkData.remark}`
          : remarkData.statusName === '已取消'
            ? `买家取消订单，取消原因：${remarkData.remark}`
            : ''
      this.detailData = detailData
      this.goodsList = goodsList
      this.tranceList = tranceList.map((item:any) => {
        return { ...item, date: item.operateDate && item.operateDate.slice(0, 16) }
      })
    }
  }
}
</script>

<style lang="scss">
.order-detail {
  .el-step__icon.is-text {
    border: none;
  }
}
</style>
<style lang="scss" scoped>
.app-container {
  padding: 10px;
}
.order-detail {
  background: #eee;
  font-size: 14px;
  .el-container {
    margin-bottom: 10px;
    background: #fff;
  }
  .el-col {
    background: #eee;
  }
  .c-flex-center {
    display: flex;
    min-height: 120px;
    background: #fff;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    position: relative;
  }
  .el-main {
    background: #fff;
    padding: 0;
    overflow: hidden;
  }
  .round-span {
    display: inline-block;
    min-width: 20px;
    text-align: center;
    line-height: 18px;
    background: white;
    height: 20px;
    border-radius: 50%;
    border: 2px solid;
    border-color: inherit
  }
  .c-detail {
    padding: 5px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
  }
  .c-label {
    color: #666;
    width: 90px;
    text-align: right;
  }
  .title {
    height: 40px;
    line-height: 40px;
    color: #333;
    background: white;
    font-size: 14px;
  }
  .c-big-blue {
    width: 100%;
    color: rgb(24, 144, 255);
    font-size: 30px;
    text-align: center;
    line-height: 50px;
    font-weight: bold;
  }
  .step-active {
    background: $blue;
    color: white;
    border-color: $blue;
  }
  .c-bottom-left {
    position: absolute;
    left: 0;
    bottom: 10px;
  }
}
</style>
