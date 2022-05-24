<template>
  <div class="app-container">
    <el-row :gutter="10">
      <div class="c-title blue" :style="{height: '40px', lineHeight: '40px',  marginBottom: '10px'}">商品详情</div>
    </el-row>
    <el-row :gutter="10" :style="{marginBottom: '10px'}">
      <el-col :span="5" :style="{height: '200px'}" >
        <good-imgs v-if="detail" :data="detail" />
      </el-col>
      <el-col :span="19" :style="{height: '200px'}">
        <good-specs v-if="detail" :data="detail" @change="getSkuPrick" @add-cart="onAddCart"/>
      </el-col>
    </el-row>
    <el-row>
       <el-col :span="24">
        <good-info v-if="detail" :data="detail" />
       </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import goodImgs from './components/good-imgs.vue'
import goodInfo from './components/good-info.vue'
import goodSpecs from './components/good-specs.vue'
import { goodsManagerDetailJg } from '@/api/goods'
import { purchaseOrderAddCart, getSalePrice } from '@/api/order'

@Component({
  components: {
    goodImgs,
    goodInfo,
    goodSpecs
  }
})
export default class extends Vue {
  created() {
    this.getDetail()
  }

  private loading = false
  private detail:any = null
  private async getDetail() {
    const { id: skuId } = this.$route.params
    this.loading = true
    const res = await goodsManagerDetailJg({ skuId }).finally(() => {
      this.loading = false
    })
    const { code, payload: detail } = res
    if (code === '0') {
      this.detail = detail
    }
  }

  // 获取sku价格
  private getSkuPrick(data:any) {
    // const params = {
    //   skuId: this.curGoods.skuId,
    //   goodSpecs: item2
    // }
    getSalePrice(data).then((res) => {
      // console.log('251', res)
      if (res.code === '0') {
        this.detail.salePrice = res.payload.salePrice
      }
    }).catch().finally()
  }

  // 加入购物车
  private onAddCart(data:any) {
    // const params = {
    //   skuId: this.curGoods.skuId,
    //   goodSpecs: this.curGoods.curSku,
    //   buyCount: this.curGoodsNum
    // }
    purchaseOrderAddCart(data).then((res) => {
      console.log('284', res)
      if (res.code === '0') {
        this.$message.success('操作成功')
      }
    }).catch()
  }
}
</script>

<style lang="scss" scoped>
div.app-container {
  padding: 10px;
}
</style>
