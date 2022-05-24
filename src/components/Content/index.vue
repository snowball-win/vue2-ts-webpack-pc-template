<template>
  <div :class="className">
    <div class="content-header" v-if="title || $slots.header">
      <slot name="header"/>
    </div>
    <slot />
    <div class="content-footer" v-if="$slots.footer">
      <slot name="footer"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'Content'
})
export default class extends Vue {
  @Prop({ default: 'content-warp' }) private className!: string
  @Prop({ default: 'content-main' }) private classContentName!: string
  @Prop({ default: '' }) private title!: string
  private mounted() {
    console.log(this.$slots.default)
  }
}
</script>

<style lang="scss" scoped>
.content-warp {
  padding: 10px;
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
  .content-footer {
    width: 100%;
    margin-top: 5px;
    padding: 10px;
    background: #fff;
    text-align: center;
  }
  .content-header {
    width: 100%;
    text-align: left;
    margin-bottom: 10px;
  }
}
</style>
