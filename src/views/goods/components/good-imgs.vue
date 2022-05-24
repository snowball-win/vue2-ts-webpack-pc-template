<template>
  <div class="goods-imgs">
    <el-image
      style="width: 100%; height: 100%"
      :src="data.goodsImages[0]"
      fit="contain"
      :preview-src-list="data.goodsImages"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'goodImgs',
  components: {}
})
export default class extends Vue {
  @Prop({ default: () => null, required: true }) private data!: object

  created() {
    console.log(this)
  }

  mounted() {
    console.log(this)
  }
}
</script>

<style lang="scss" scoped>
.goods-imgs {
  height: 100%;
  padding: 10px;
  background: #fff;
}
</style>
