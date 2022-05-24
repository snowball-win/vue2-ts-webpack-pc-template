<template>
  <div class="goods-specs">
    <div class="top">
      <div :style="{display: 'inline-block'}">价格：</div>
      <div :style="{display: 'inline-block', color: 'red'}"><span>￥</span>{{data.salePrice}}</div>
      <div v-if="data.attributeList && data.attributeList.length > 0">
        <div class="c-flex" v-for="(item, index) in data.attributeList" :key="index" >
          <div :style="{width: '80px', textAlign: 'left'}">{{item.attrName}}:</div>
          <el-checkbox-group v-if="item.attrValues && item.attrValues.length > 0" v-model="specsList[index].value" @change="onChange($event, specsList[index])" :max="1">
            <el-checkbox :style="{width: '100px'}" v-for="attr in item.attrValues" :label="attr" :key="attr">{{attr}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div>
        数量：
        <el-input-number v-model="curGoodsNum" :min="1" :max="9999" size="mini" label="数量" :style="{marginRight: '10px'}"></el-input-number>
        <el-button size="mini" @click="onAddCart" type="primary" :disabled="disabled">加入购物车</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'goodSpecs',
  components: {}
})
export default class extends Vue {
  @Prop({ default: () => null }) private data!: any
  private specsList:any = []
  private cityOptions = ['上海', '北京', '广州', '深圳']
  private created() {
    this.setSpecsList()
  }

  private setSpecsList() {
    if (this.data.attributeList && this.data.attributeList.length > 0) {
      this.data.attributeList.forEach((item: any, index:number) => {
        this.$set(this.specsList, index, { specsCode: item.attrCode, specsName: item.attrName, specsValue: this.getSpecsValue(item.attrCode), value: [this.getSpecsValue(item.attrCode)] })
      })
    }
  }

  private getSpecsValue(data:any) {
    const specsData = this.data.goodsSpecs.find((item:any) => item.specsCode === data)
    // console.log(specsData)
    return specsData && specsData.specsValue
  }

  private onChange(value:any[], data:any) {
    data.specsValue = value[0] || ''
    this.disabled = this.specsList.some((item:any) => !item.specsValue)
    if (this.specsList.some((item:any) => !item.specsValue)) {
      return
    }
    const specData = {
      skuId: this.data.skuId,
      goodSpecs: this.specsList
    }
    this.$emit('change', specData)
  }

  private curGoodsNum:any = 1 // 当前商品信息
  private disabled = false // 当前商品信息

  private onAddCart() {
    const params = {
      skuId: this.data.skuId,
      goodSpecs: this.specsList,
      buyCount: this.curGoodsNum
    }
    this.$emit('add-cart', params)
  }
}
</script>

<style lang="scss" scoped>
.goods-specs {
  height: 100%;
  padding: 10px;
  background: #fff;
  line-height: 22px;
  .c-flex {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>
