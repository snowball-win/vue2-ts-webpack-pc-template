<!-- 轮播组件 -->
<template>
  <div class="gzh-rotation">
    <el-carousel
      height="100px"
      indicator-position="outside"
      :direction="derectionData[componentProperties.rotationDirection] || 'horizontal'"
      :autoplay="true">
      <el-carousel-item v-for="(item, index) in rotationList" :key="index">
        <el-image :style="{height: '100%'}" :src="item.pictureUrl"></el-image>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'Rotations'
})
export default class extends Vue {
  @Prop({ required: true }) private data!: {componentProperties: any, pageComponentContentBody: any}

  private rotationList = []
  private derectionData = { 'left-right': 'horizontal', 'up-down': 'vertical' }
  private componentProperties = {}

  created() {
    this.rotationList = this.data.pageComponentContentBody.componentContentList || []
    this.componentProperties = this.data.componentProperties
  }
}
</script>

<style lang="scss" scoped>
</style>
