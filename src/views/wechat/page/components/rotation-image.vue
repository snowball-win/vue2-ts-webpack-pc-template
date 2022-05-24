// 页面配置-轮播图
<template>
  <Content>
    <ContentItem :title="'基本信息'" :style="{marginBottom: '5px', overflow: 'visible'}">
      <el-form
        ref="pageForm"
        :model="pageForm"
        :rules="pageRules"
        label-width="200px"
        label-position="right"
        :style="{marginLeft: 0}"
      >
        <el-form-item
          prop="rotationCount"
          label="轮播数量"
        >
          <el-input
            v-model="pageForm.rotationCount"
            placeholder="请输入不超过20个汉字"
            clearable
            type="text"
          />
          <span>张</span>
        </el-form-item>
        <el-form-item
          prop="rotationInterval"
          label="轮播间隔"
        >
          <el-input
            v-model="pageForm.rotationInterval"
            placeholder="请输入不超过20个汉字"
            clearable
            type="text"
          />
          <span>秒</span>
        </el-form-item>
        <el-form-item
          prop="rotationDirection"
          label="轮播方向"
        >
          <el-select
            v-model="pageForm.rotationDirection"
            placeholder="请选择"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in exitOption1"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="rotationLoop"
          label="是否循环"
        >
          <el-select
            v-model="pageForm.rotationLoop"
            placeholder="请选择"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in exitOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ContentItem>
    <ContentItem :title="''">
      <el-tabs type="border-card" @tab-click="tabChanged">
        <el-tab-pane :label="'图' + (index + 1)" v-for="(item, index) in contentList" :key="index">
          <AddImage
            :ref="'addImageRef'"
            :pageComponentId="item.pageComponentId"
            :sortIndex="index"
            :contentIdIndex="item.contentId"
          ></AddImage>
        </el-tab-pane>
      </el-tabs>
    </ContentItem>
  </Content>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from 'vue-property-decorator'
import Content from '@/components/Content/index.vue'
import ContentItem from '@/components/ContentItem/index.vue'
import AddImage from './rotation-image-add-image.vue'
import {
  gzhCustomPagePageComponentContent
} from '@/api/wechat'
import { AnyARecord } from 'dns'
@Component({
  name: 'wechat-config-create-components',
  components: {
    ContentItem,
    Content,
    AddImage
  }
})
export default class extends Vue {
  @Prop({ default: () => null }) private curComponentItemData!: object
  mounted() {
    console.log('123456')
  }

  @Watch('curComponentItemData')
  private onCurComponentItemDataChange(item: any) {
    console.log('113', item)
  }

  private pageComponentId:any = '' // 页面组件id
  private setComponentData(item: any) {
    console.log('118', item)
    this.pageForm.rotationDirection = item.rotationDirection
    this.pageForm.rotationCount = item.rotationCount
    this.pageForm.rotationLoop = item.rotationLoop
    this.pageForm.rotationInterval = item.rotationInterval
    this.pageComponentId = item.pageComponentId
    this.getPageComponentContent()
  }

  private pageForm:any = {
    rotationDirection: '', // 轮播方向
    rotationCount: '', // 轮播数量
    rotationLoop: '', // 是否循环
    rotationInterval: '', // 轮播间隔
    gzhId: this.$route.query && this.$route.query.gzhId,
    componentPropertiesList: []
  };

  private pageRules = {
    pageName: [
      {
        message: '请输入公众号名称',
        trigger: 'blur',
        required: true
      }
    ],
    showAbstract: [
      {
        message: '请选择',
        trigger: 'blur',
        required: true
      }
    ],
    showSourceName: [
      {
        message: '请选择',
        trigger: 'blur',
        required: true
      }
    ],
    showSubmitTime: [
      {
        message: '请选择',
        trigger: 'blur',
        required: true
      }
    ],
    fixedCount: [
      {
        message: '请选择',
        trigger: 'blur',
        required: true
      }
    ],
    showFixedCount: [
      {
        message: '请选择',
        trigger: 'blur',
        required: true
      }
    ],
    hasCategory: [
      {
        message: '请选择',
        trigger: 'blur',
        required: true
      }
    ],
    rotationCount: [
      {
        message: '请选择',
        trigger: 'blur',
        required: true
      }
    ],
    rotationInterval: [
      {
        message: '请选择',
        trigger: 'blur',
        required: true
      }
    ],
    rotationDirection: [
      {
        message: '请选择',
        trigger: 'blur',
        required: true
      }
    ],
    rotationLoop: [
      {
        message: '请选择',
        trigger: 'blur',
        required: true
      }
    ],
    componentStatus: [
      {
        message: '请选择',
        trigger: 'blur',
        required: true
      }
    ]
  };

  private exitOption = [
    {
      label: '是',
      value: '1'
    },
    {
      label: '否',
      value: '0'
    }
  ]

  private exitOption1 = [
    {
      label: '从左往右',
      value: 'left-right'
    },
    {
      label: '从右往左',
      value: 'right-left'
    }
  ]

  // 返回
  private goBack() {
    this.$router.go(-1)
  }

  // 返回
  private onStart(): void {
    console.log('onStart')
  }

  // 返回
  private onEnd() {
    console.log('onEnd')
  }

  // 轮播内容list
  private contentList:any = [{ contentId: '' }]
  // 获取 component 下 content
  private async getPageComponentContent() {
    const params = {
      page: 1,
      size: 9999,
      pageComponentId: this.pageComponentId
    }
    await gzhCustomPagePageComponentContent(params)
      .then((res) => {
        if (res.code === '0') {
          const list = res.payload.componentContent.list
          this.contentList = list
          const count = this.pageForm.rotationCount - this.contentList.length
          for (let i = 0; i < count; i++) {
            this.contentList.push({
              pageComponentId: this.pageComponentId,
              contentId: ''
            })
          }
        }
      })
  }

  private tabChanged(data: any) {
    console.log('291', data.index)
    console.log('292', this.contentList)
    console.log('293', this.$refs.addImageRef)
    const index = data.index
    this.$refs.addImageRef && (this.$refs.addImageRef as any)[index].getRotationContent({
      contentId: this.contentList[index].contentId
    })
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
<style lang="scss">
.el-form-item__content{
  display: flex;
}
</style>
