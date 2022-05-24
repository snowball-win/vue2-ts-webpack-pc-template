<template>
  <div class="menu-config-container">
    <div class="content">
      <first-level-menu @clickTreeNode="clickTreeNode"/>
      <second-level-menu ref="secondLevelMenu"/>
    </div>
    <div class="footer">
      <el-button type="primary" @click="goBack">返回</el-button>
      <el-button type="primary" @click="submitToWechat">发布到微信</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import firstLevelMenu from './components/first-level-menu.vue'
import secondLevelMenu from './components/second-level-menu.vue'

@Component({
  name: 'createCompany',
  components: {
    firstLevelMenu,
    secondLevelMenu
  }
})
export default class extends Vue {
  private clickTreeNode(node:unknown) {
    if (node) {
      (this.$refs.secondLevelMenu as any).curTreeNode(node)
    }
  }

  private submitToWechat(node:unknown) {
    if (node) {
      (this.$refs.secondLevelMenu as any).submitToWechat()
    }
  }

  private goBack(node:unknown) {
    if (node) {
      (this.$refs.secondLevelMenu as any).goBack()
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-config-container{
  padding: 10px;
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  .content {
    // background: #fff;
    width: 100%;
    margin: 0 auto;
    height: 500px;
    // padding: 10px;
    overflow: auto;
    display: flex;
    flex: 1;
  }
  .footer {
    padding: 10px;
    margin-top: 5px;
    background: #fff;
    text-align: center;
  }
}
</style>
