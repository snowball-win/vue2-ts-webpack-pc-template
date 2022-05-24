// 新建管理机构
<template>
  <Content class="wechat-msg-template-create">
    <ContentItem :title="'基础信息'">
      <el-form
        ref="gzhForm"
        class="app-form"
        :model="gzhForm"
        label-width="200"
        label-position="right"
      >
        <el-form-item
          v-for="(item, index) in gzhTemplateList"
          :key="index"
          :prop="String(item.templateTypeCode)"
          :label="item.templateTypeName"
          :style="{width: '100%'}"
        >
          <el-input
            v-model="gzhForm[item.templateTypeCode]"
            placeholder="确保与微信认证时录入一致"
            :style="{width: '300px' ,'margin-right': '5px'}"
            clearable
            type="text"
          />
          <span class="tip-red">请先在微信公众后台配置消息模板</span>
        </el-form-item>
      </el-form>
    </ContentItem>
    <div slot="footer">
      <el-button type="primary" @click="goBack">返回</el-button>
      <el-button type="primary" @click="submitEditHandle">提交</el-button>
    </div>
  </Content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { gzhMsgTemplateManagerSaveOrUpdate, gzhMsgTemplateManagerGetTemplate } from '@/api/wechat'
import Content from '@/components/Content/index.vue'
import ContentItem from '@/components/ContentItem/index.vue'
@Component({
  name: 'create-components',
  components: {
    ContentItem,
    Content
  }
})
export default class extends Vue {
  created() {
    this.getGzhDetail()
  }

  private handleType = this.$route.params.id ? 'edit' : 'add'
  private gzhForm: {[props: string]: string} = {}
  private gzhTemplateList = []

  // 获取详情
  private getGzhDetail() {
    if (!this.$route.params.id) {
      console.log('add')
      return
    }
    const params = { gzhId: this.$route.params.id }
    gzhMsgTemplateManagerGetTemplate(params).then((res) => {
      this.gzhTemplateList = res.payload
      this.gzhTemplateList.forEach((item: {[props: string]: string}) => {
        this.$set(this.gzhForm, item.templateTypeCode, item.wxTemplateId)
      })
    })
  }

  // 返回
  private goBack() {
    this.$router.go(-1)
  }

  // 编辑
  private async submitEditHandle() {
    (this.$refs.gzhForm as ElForm).validate(
      async(valid: boolean) => {
        if (valid) {
          await gzhMsgTemplateManagerSaveOrUpdate(this.getGzhTemplateList()).then((res) => {
            if (res.code === '0') {
              this.$message.success('编辑成功')
              this.$router.go(-1)
            }
          })
        } else {
          return false
        }
      }
    )
  }

  // 编辑
  private getGzhTemplateList() {
    const gzhId = this.$route.params.id
    Object.entries(this.gzhForm).forEach(([key, value]) => {
      this.gzhTemplateList.forEach((item:{[a: string]: string}) => {
        if (String(item.templateTypeCode) === key) {
          item.wxTemplateId = value
        }
      })
    })
    return {
      gzhId,
      gzhMesTemplateList: this.gzhTemplateList
    }
  }
}
</script>

<style lang="scss" scoped>
.wechat-msg-template-create {
  .tip-red {
    color: red;
  }
}
</style>
