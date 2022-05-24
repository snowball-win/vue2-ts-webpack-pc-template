<!-- 轮播组件 -->
<template>
  <div class="gzh-preview">
    <div class="gzh-preview-item" v-for="(item, index) in data" :key="index">
      <template>
        <div v-if="item.componentProperties && item.componentProperties.componentStatus === 1" class="gzh-preview-item-wrap">
          <Information v-if="item.componentProperties.componentTypeCode === 'GRAPHIC_INFORMATION'" :data="item" />
          <Rotation v-if="item.componentProperties.componentTypeCode === 'PICTURE_ROTATION'" :data="item" />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Information from './information.vue'
import Rotation from './rotations.vue'

@Component({
  name: 'Gzh',
  components: { Information, Rotation }
})
export default class extends Vue {
  @Prop({ required: true }) private data!: {componentProperties: any, pageComponentContentBody: any}[]
}
</script>

<style lang="scss" scoped>
</style>
