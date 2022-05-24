<template>
  <div :class="className" :style="{flex: flex ? '1' : ''}">
    <div class="content-item-title" v-if="title || $slots.title">
      <slot name="title">
        <div class="content-title--content">
          <span>{{title}}</span>
        </div>
      </slot>
    </div>
    <slot/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ContentItem'
})
export default class extends Vue {
  @Prop({ default: 'content-item' }) private className!: string
  @Prop({ default: '' }) private title!: string
  @Prop({ default: false }) private flex!: boolean
}
</script>

<style lang="scss" scoped>
.content-item {
  width: 100%;
  padding: 10px;
  background: #fff;
  overflow: auto;
  .content-title--content {
    margin: -10px auto 5px -10px;
    height: 40px;
    position: relative;
    background: white;
    padding-left: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
    font-size: 13px;
    color: $blue;
    &:before{
      position: absolute;
      content: '';
      left: -0;
      top: -0;
      height: 100%;
      width: 3px;
      background: $blue;
    }
  }
}
</style>
