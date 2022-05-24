// 购物车
<template>
  <div v-if="companyCartList" class="app-container">
    <div class="c-table-item" v-for="(item, index) in companyCartList" :key="index">
      <div class="companyCartTitle c-title">
        <span>{{item.companyName}}</span>
        <el-button type="primary" @click="toCartPath">添加产品</el-button>
      </div>
      <div :style="{padding: '0 0px 10px 10px'}">
        <el-table
          :ref="`multipleTable${index}`"
          :data="item.cartGoodsInfoList"
          border
          v-loading="loading"
          fit
          row-key="uniqueId"
          highlight-current-row
          style="width: 100%"
          @selection-change="handleSelectionChange($event, index)"
        >
          <el-table-column
            type="selection"
            align="center"
            reserve-selection
          />
          <el-table-column
            width="180px"
            align="center"
            label="商品图片"
          >
            <template slot-scope="{row}">
              <el-image
                style="width: 80px; height: 80px"
                :src="row.skuImage"
                fit="contain"
                alt="商品图片"
                :preview-src-list="[row.skuImage]" />
              <!-- <el-image style="width:30px;height:30px;" :src="row.skuImage" /> -->
            </template>
          </el-table-column>

          <el-table-column
            width="320px"
            align="center"
            label="商品名称"
          >
            <template slot-scope="{row}">
              <span>{{ row.skuName }}</span>
            </template>
          </el-table-column>

          <el-table-column
            width="80px"
            label="单价"
            align="center"
          >
            <template slot-scope="{row}">
              <span>{{ row.unitPrice }}</span>
            </template>
          </el-table-column>

          <el-table-column
            min-width="230px"
            label="数量"
            align="center"
          >
            <template slot-scope="{row}">
              <el-input-number v-model="row.buyCount" @change="updatePurchaseOrderUpdCart($event, row)" :min="1" :max="9999" label="数量"></el-input-number>
            </template>
          </el-table-column>

          <el-table-column
            min-width="80px"
            label="小计"
            align="center"
          >
            <template slot-scope="{row}">
              <span>{{ row.subtotalAmount }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            min-width="300"
            fixed="right"
          >
            <template slot-scope="{row}">
              <el-button
                :key="index"
                :type="'primary'"
                size="small"
                style="margin-right:10px;min-width: 80px;"
                @click="btnClick(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footBox">
      <div>已选 {{buyCountTotal}} 件商品</div>
      <div>总价应付：{{buyPriceTotal}}</div>
      <div>
        <el-button  type="primary" @click="toSettleAccounts">去结算</el-button>
      </div>
    </div>
  </div>
  <div v-else class="none-data_wrap">
    <div class="none-data">
      <img :src="noneCartPng" alt="图片">
      <div class="none-data-content">
        <h3 :style="{lineHeight: '1.5'}">您还没有添加任何商品！</h3>
        <p :style="{fontSize: '14px', color: '#aaa'}">需要添加商品后才能执行相关操作</p>
      </div>
      <el-button class="none-data-content" @click="toCartPath" type="primary">添加产品</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { OrderModule } from '@/store/modules/order'
import { Component, Vue } from 'vue-property-decorator'
import { showCart, purchaseOrderDelCart, purchaseOrderUpdCart } from '@/api/order'
import { IArticleData } from '@/api/types'
// import noCartPng from '@/assets/images/goods/no_cart.png'
const noCartPng = require('@/assets/images/goods/no_cart.png')

@Component({
  name: 'cartGoodsList',
  components: {}
})
export default class extends Vue {
  private list: IArticleData[] = []

  async created() {
    await this.getCartList()
    await this.$nextTick()
    this.toggleRowSelection()
  }

  // 多选
  private buyCountTotal = 0
  private buyPriceTotal = 0
  private multipleSelection:any = []
  private async handleSelectionChange(value: any, index: number) {
    // console.log('120', value, index)
    this.buyCountTotal = 0
    this.buyPriceTotal = 0
    const uniqueIdList:any = []
    this.multipleSelection[index] = value
    this.multipleSelection.forEach((item:any) => {
      item.forEach((item2:any) => {
        this.buyCountTotal += item2.buyCount
        this.buyPriceTotal += item2.buyCount * item2.unitPrice
        uniqueIdList.push(item2.uniqueId)
      })
    })
    await OrderModule.SET_UNIQUEIDLIST(uniqueIdList)
  }

  private companyCartList:any = []
  private loading = false
  // 购物车list
  private async getCartList() {
    this.loading = true
    await showCart({}).then((res) => {
      // console.log('245', res)
      if (res.code === '0') {
        this.companyCartList = res.payload.companyCartList.length > 0 ? res.payload.companyCartList : null
      } else {
        this.companyCartList = null
      }
    })
      .finally(() => { this.loading = false })
      .catch(() => { this.companyCartList = null })
  }

  private async btnClick(data: any) {
    this.$confirm('确定要删除商品吗', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      const { goodsSpecs: goodSpecs, skuId } = data
      await purchaseOrderDelCart({ goodSpecs, skuId }).finally(async() => {
        await this.getCartList()
      })
    }).catch()
  }

  private toCartPath() {
    this.$router.push('/order/purchase-order/create/')
  }

  // 去结算
  private async toSettleAccounts() {
    if (!OrderModule.uniqueIdList || (OrderModule.uniqueIdList && OrderModule.uniqueIdList.length === 0)) {
      this.$alert('请至少选中一件商品！', '', {
        type: 'warning',
        confirmButtonText: '知道了'
      })
    } else {
      this.$router.push({ path: '/order/purchase-order/confirm-order' })
    }
  }

  // 返显示
  private async toggleRowSelection() {
    const uniqueIdList = OrderModule.uniqueIdList || []
    console.log(uniqueIdList)
    const newUniqueIdList: any[] = []
    this.companyCartList.forEach((item:any, index:number) => {
      item.cartGoodsInfoList.forEach((it:any) => {
        if (uniqueIdList && uniqueIdList.includes(it.uniqueId)) {
          newUniqueIdList.push(it.uniqueId);
          (this as any).$refs[`multipleTable${index}`][0].toggleRowSelection(it, true)
        }
      })
    })
    await OrderModule.SET_UNIQUEIDLIST(newUniqueIdList)
  }

  // 更新数量
  private async updatePurchaseOrderUpdCart(e:any, item:any) {
    await purchaseOrderUpdCart({ ...item, goodSpecs: item.goodsSpecs })
    await this.getCartList()
  }

  private noneCartPng = noCartPng
}
</script>

<style lang="scss" scoped>
.app-container{
  padding: 10px;
  .c-table-item {
    background: #fff;
    padding: 0 10px 10px 0px;
    margin-bottom: 10px ;
  }
  .companyCartTitle{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0 10px 10px;
    position: relative;
    color: #1890ff;
    height: 40px;
  }
  .footBox{
    padding: 10px;
    display: flex;
    background: white;
    align-items: center;
    justify-content: space-between;
  }
}
.none-data_wrap {
  padding: 10px;
}
.none-data {
  height: 100%;
  background: white;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  img {
    margin-top: 100px;
  }
  .none-data-content {
    margin-top: 40px;
  }
}

</style>
