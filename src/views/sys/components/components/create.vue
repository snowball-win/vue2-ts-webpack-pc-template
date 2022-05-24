// 新建管理机构
<template>
  <Content>
    <ContentItem :title="'基本信息'" :flex="true">
      <el-form
        ref="componentsForm"
        :model="componentsForm"
        label-width="200px"
        label-position="right"
      >
        <el-form-item
          v-for="(item, index) in activeColumns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
        >
          <el-input
            v-model="componentsForm[item.prop]"
            :readonly="item.readonly"
            :type="item.type || 'text'"
          />
        </el-form-item>
      </el-form>
    </ContentItem>
    <div slot="footer">
      <el-button type="primary" @click="goBack">返回</el-button>
      <!-- <el-button type="primary" v-if="handleType === 'add'" @click="submitHandle">提交</el-button>
      <el-button type="primary" v-else @click="submitEditHandle">提交</el-button> -->
    </div>
  </Content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { gzhComponentBaseDetail } from '@/api/wechat'
import Content from '@/components/Content/index.vue'
import ContentItem from '@/components/ContentItem/index.vue'
@Component({
  name: 'wechat-config-create-components',
  components: {
    ContentItem,
    Content
  }
})
export default class extends Vue {
  created() {
    this.getComponentsDetail()
  }

  private columns = [
    {
      label: '组件名称',
      readonly: true,
      prop: 'componentName'
    },
    {
      label: '组件类型',
      readonly: true,
      prop: 'componentTypeName'
    },
    {
      label: '轮播数量',
      readonly: true,
      prop: 'rotationCount'
    },
    {
      label: '轮播间隔',
      readonly: true,
      prop: 'rotationInterval'
    },
    {
      label: '轮播方向',
      readonly: true,
      prop: 'rotationDirection'
    },
    {
      label: '是否循环',
      readonly: true,
      prop: 'rotationLoop'
    },
    {
      label: '是否显示概述',
      readonly: true,
      prop: 'showAbstract'
    },
    {
      label: '是否显示来源名称',
      readonly: true,
      prop: 'showSourceName'
    },
    {
      label: '是否显示提交时间',
      readonly: true,
      prop: 'showSubmitTime'
    },
    {
      label: '是否固定数量',
      readonly: true,
      prop: 'fixedCount'
    },
    {
      label: '固定显示数量',
      readonly: true,
      prop: 'showFixedCount'
    },
    {
      label: '是否有分类',
      readonly: true,
      prop: 'hasCategory'
    },
    {
      label: '说明',
      readonly: true,
      prop: 'componentDesc',
      type: 'textarea'
    },
    {
      label: '是否有效',
      readonly: true,
      prop: 'componentStatus'
    }
  ]

  private componentsForm = {}

  private activeColumns: Array<{}> = []

  /**
   * 获取详情
   * 过滤出后端返回的字段
   */
  private async getComponentsDetail() {
    if (!this.$route.params.id) {
      console.log('add')
      return
    }
    const params = { componentTypeCode: this.$route.params.id }
    const res = await gzhComponentBaseDetail(params)
    this.componentsForm = { ...res.payload, ...res.payload.componentProperties, componentStatus: '是、否' }
    const formItems = Object.keys(this.componentsForm).map(key => {
      return key
    })
    this.activeColumns = this.columns.filter(item => formItems.includes(item.prop))
  }

  // 返回
  private goBack() {
    this.$router.go(-1)
  }
}
</script>

<style lang="scss" scoped>
.content-item {
  .el-form{
    width: auto;
    margin: 0 100px;
  }
  .el-form-item{
    width: 500px;
    margin-bottom: 20px;
  }
}
</style>
