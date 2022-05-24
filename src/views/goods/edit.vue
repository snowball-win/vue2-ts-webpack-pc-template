// 商品上架
<template>
  <div class="put-goods-on-sale">
    <div class="step">
      <el-steps :active="goodsStatusIndex" align-center>
        <el-step title="选择商品分类" description=""></el-step>
        <el-step title="填写商品信息" description=""></el-step>
        <el-step title="填写商品属性" description=""></el-step>
        <el-step title="填写商品标签" description=""></el-step>
      </el-steps>
    </div>
    <classify-components
      v-show="goodsStatusIndex === 1"
      @getClassifyPathData="getClassifyPathData"
    />
    <goods-info-components
      v-show="goodsStatusIndex === 2"
      @lastStep="lastStep"
      @goodsInfoFormData="goodsInfoFormData"
      :classifyPath="classifyPath"
    />
    <goods-attr-components
      v-show="goodsStatusIndex === 3"
      :goodsInfoFormAttrId="goodsInfoFormAttrId"
      @lastStep="lastStep"
      @goodsAttrFormData="goodsAttrFormData"
    />
    <goods-tag-components
      v-show="goodsStatusIndex === 4"
      @lastStep="lastStep"
      @goodsTagFormSpuId="goodsTagFormSpuId"
      @onSubmitGoodsInfo="onSubmitGoodsInfo"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import goodsInfoComponents from './components/goods-info.vue'
import classifyComponents from './components/goods-classify.vue'
import goodsAttrComponents from './components/goods-attr.vue'
import goodsTagComponents from './components/goods-tag.vue'
import { createGoods } from '@/api/goods'

@Component({
  name: 'userlist',
  components: {
    classifyComponents,
    goodsInfoComponents,
    goodsAttrComponents,
    goodsTagComponents
  }
})
export default class extends Vue {
  private goodsStatusIndex = 1;
  private listQuery = {
    page: 1,
    limit: 20
  };

  // 分类路径
  private classifyPath = [];

  private getClassifyPathData(data: any) {
    console.log('29classifyPath', data)
    this.classifyPath = data
    this.goodsStatusIndex = 2
  }

  // 上一步
  private lastStep(active:number) {
    this.goodsStatusIndex = active
  }

  // 商品信息
  private goodsInfoForm = {};
  private goodsInfoFormAttrId = '3';
  private goodsInfoFormData(data: any) {
    console.log('35data', data)
    this.goodsInfoForm = data
    this.goodsStatusIndex = 3
    this.goodsInfoFormAttrId = data.goodsAttribute
  }

  // 商品属性
  attributesDataArr:any = []
  priceDataArr:any = []
  private attributesData = this.attributesDataArr
  private priceData = this.priceDataArr
  private goodsAttrFormData(obj:any) {
    // 属性
    const attr = obj.attr
    console.log('76attr', attr)
    attr.forEach((item:any) => {
      const obj = {
        attrId: item.attrId,
        attrCode: item.attrCode,
        attrValues: item.attrValuesSeclted
      }
      this.attributesData.push(obj)
    })
    // 价格
    this.priceData = obj.price.map((item:any) => {
      return {
        discountRatio: item.discountRatio,
        salePrice: item.salePrice,
        shelvesCount: item.shelvesCount,
        warningStock: item.warningStock,
        specs: item.specs
      }
    })
    this.goodsStatusIndex = 4
  }

  // 商品标签
  private spuId = '';
  private goodsTagFormSpuId(spuId: string) {
    console.log('spuId', spuId)
    this.spuId = spuId
  }

  // 提交商品上架
  private async onSubmitGoodsInfo() {
    //  this.spuId
    // this.goodsInfoForm
    // this.classifyPath
    //
    const goodsCategory:any = {}
    this.classifyPath.forEach((item:any, index:number) => {
      if (index === 0) {
        goodsCategory.firstLevelCateId = item.categoryId
      } else if (index === 1) {
        goodsCategory.secondLevelCateId = item.categoryId
      } else if (index === 2) {
        goodsCategory.threeLevelCateId = item.categoryId
      } else if (index === 3) {
        goodsCategory.fourLevelCateId = item.categoryId
      }
    })
    const form:any = {
      goodsCategory: goodsCategory, // 分类
      goodsInfo: this.goodsInfoForm, // 商品信息
      goodsAttribute: {
        attributes: this.attributesData, // 属性
        goodsPrices: this.priceData// 价格
      },
      goodsLabel: { // 标签
        spuId: this.spuId
      }
    }
    // createGoods
    await createGoods(form).then((res:any) => {
      console.log('108', res)
      if (res.code === '0') {
        this.$notify.success('提交成功')
        this.$router.go(-1)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.put-goods-on-sale {
  margin: 10px;
  background: #fff;
  .step {
    padding: 50px 0 0 0;
  }
}
</style>
<style lang="scss">
.put-goods-on-sale {
  .el-form-item{
    margin-bottom: 20px!important;
  }
}
</style>
