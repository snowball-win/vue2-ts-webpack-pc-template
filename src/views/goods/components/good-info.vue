<template>
  <div class="goods-info">
    <el-tabs type="border-card">
  <el-tab-pane label="商品介绍">
    <div ref="detail">{{data.goodsDetails}}</div>
  </el-tab-pane>
  <el-tab-pane label="规格属性">
    <div v-if="data.attributeList && data.attributeList.length > 0">
      <div class="c-table" v-for="(item, index) in data.attributeList" :key="index">
        <div :style="{width: '100px', textAlign: 'left'}">{{item.attrName}}:</div>
        <div v-if="item.attrValues && item.attrValues.length > 0">
          {{item.attrValues.join('、')}}
        </div>
      </div>
    </div>
  </el-tab-pane>
  <el-tab-pane label="产品说明">
    <div class="c-wrap" v-if="data.productInfo">
      <div class="c-detail" :style="{width: '100%', margin: 'auto'}">
        <div class="c-label">订单产品标准号：</div>
        <div class="c-value">{{data.productInfo.standardNumber}}</div>
      </div>
      <div class="c-detail" :style="{width: '100%', margin: 'auto'}">
        <div class="c-label">生产许可证号：</div>
        <div class="c-value">{{data.productInfo.licenseNumber}}</div>
      </div>
      <div class="c-detail" :style="{width: '100%', margin: 'auto'}">
        <div class="c-label">发证日期：</div>
        <div class="c-value">{{data.productInfo.dateOfIssue}}</div>
      </div>
      <div class="c-detail" :style="{width: '100%', margin: 'auto'}">
        <div class="c-label">证书有效期：</div>
        <div class="c-value">{{data.productInfo.certificateValidity}}</div>
      </div>
      <div class="c-detail" :style="{width: '100%', margin: 'auto'}">
        <div class="c-label">发证机构：</div>
        <div class="c-value">{{data.productInfo.issuingAuthority}}</div>
      </div>
      <div class="c-detail" :style="{width: '100%', margin: 'auto'}">
        <div class="c-label">产品产地：</div>
        <div class="c-value">{{data.productInfo.placeOfOrigin}}</div>
      </div>
      <div class="c-detail" :style="{width: '100%', margin: 'auto'}">
        <div class="c-label">生产企业：</div>
        <div class="c-value">{{data.productInfo.manufacturerName}}</div>
      </div>
      <div class="c-detail" :style="{width: '100%', margin: 'auto'}">
        <div class="c-label">生产企业地址：</div>
        <div class="c-value">{{data.productInfo.manufacturerAddr}}</div>
      </div>
    </div>
  </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'goodInfo',
  components: {}
})
export default class extends Vue {
  @Prop({ default: () => null }) private data!: any
  // private created() {
  //   console.log(this.data)
  // }

  private mounted() {
    // let rule = /(?<=<body>\n)(.*?)(?=<\n\/body>)/g
    const rule = /<body>\n(.*?)\n<\/body>/g
    // this.$refs.detail.innerHTML = rule.exec(this.data.goodsDetails)[0]
    const str = this.data.goodsDetails.match(rule)[0].replace(/(<body>)|(<\/body>)/g, '');
    // console.log(str)
    (this.$refs.detail as any).innerHTML = str
  }
}
</script>

<style lang="scss" scoped>
.goods-info {
  padding: 10px;
  background: #fff;
  line-height: 22px;
  .c-table {
    display: flex;
    flex-direction: row;
    align-items: center;
    & div {
      border: solid 1px #ccc;
    }
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
    width: 200px;
    text-align: right;
  }
}
</style>
