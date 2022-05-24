// 页面配置-轮播图
<template>
  <Content>
    <ContentItem :title="''" :style="{marginBottom: '5px'}">
      <el-form
        ref="pageForm"
        :model="pageForm"
        :rules="pageRules"
        label-width="200px"
        label-position="right"
        :style="{marginLeft: 0}"
      >
        <el-form-item class="upload-el-image-wrap" label="上传图片" label-width="120px" prop="pictureUrl">
          <el-image ref="img" v-if="pageForm.pictureUrl" class="upload-el-image" :preview-src-list="[pageForm.pictureUrl]" :src="pageForm.pictureUrl" fit="contain" />
          <el-upload
            ref="upload"
            class="upload-ready display-none"
            :style="{display: 'inline-block'}"
            action="string"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-exceed="handleExceed"
            :http-request="toRequest"
          >
            <el-button v-if="pageForm.pictureUrl" size="small" type="primary">重新上传</el-button>
            <el-button v-else size="small" type="primary">上传</el-button>
          </el-upload>
          <div v-if="pageForm.pictureUrl" class="deleteImgFile" @click="deleteImgFile">x</div>
        </el-form-item>
        <el-form-item
          prop="jumpDetail"
          label="是否进入详情"
          label-width="120px"
        >
          <el-select
            v-model="pageForm.jumpDetail"
            placeholder="请选择"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in jumpDetailOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" label-width="120px" prop="contentTitle">
          <el-input v-model="pageForm.contentTitle" maxlength="100" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item class="submitContent submitContent__tinymce" prop="contentText" label="详情正文" label-width="120px">
          <tinymce
            ref="editor"
            v-model="pageForm.contentText"
            :height="400"
            :pramas="pramas"
            :request="request"
            :file-prop="'imageFile'"
          />
        </el-form-item>
        <el-form-item
          prop="validStatus"
          label="是否有效"
          label-width="120px"
        >
          <el-select
            v-model="pageForm.validStatus"
            placeholder="请选择"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in isEffectiveOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ContentItem>
    <ContentItem :title="''" :style="{marginBottom: '5px'}">
      <div style="text-align: center;">
        <el-button type="primary" size="mini" @click="submitRotationContent">提交</el-button>
      </div>
    </ContentItem>
  </Content>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import Content from '@/components/Content/index.vue'
import ContentItem from '@/components/ContentItem/index.vue'
import Tinymce from '@/components/Tinymce/index.vue'
import { UserModule } from '@/store/modules/user'
import { fileUpload } from '@/api/goods'
import { Form as ElForm } from 'element-ui'
import {
  fileManagerUploadImageGetUrl,
  gzhPictureRotationContentCreateContent,
  gzhPictureRotationContentContentDetail,
  gzhPictureRotationContentEditContent
} from '@/api/wechat'

@Component({
  name: 'wechat-config-create-components',
  components: {
    ContentItem,
    Content,
    Tinymce
  }
})
export default class extends Vue {
  @Prop({ default: () => null }) private pageComponentId!: any
  @Prop({ default: '' }) private sortIndex!: any
  @Prop({ default: '' }) private contentIdIndex!: any

  @Watch('pageComponentId')
  private onPageComponentIdChange(pageComponentId: any): void {
    console.log('123', pageComponentId)
    this.pageForm.pageComponentId = pageComponentId
  }

  @Watch('contentIdIndex')
  private onContentIdIndexChange(contentIdIndex: any): void {
    this.pageForm.contentId = contentIdIndex
    if (contentIdIndex) {
      this.getRotationContent('')
    }
  }

  mounted() {
    console.log('125sort', this.sortIndex)
    console.log('137contentIdIndex', this.contentIdIndex)
    console.log('138pageComponentId', this.pageComponentId)
    this.pageForm.pageComponentId = this.pageComponentId
    this.pageForm.sort = this.sortIndex + 1
  }

  private pageForm:any = {
    contentId: '', // 内容id
    validStatus: '', // 是否有效
    jumpDetail: '', // 是否进入详情
    contentTitle: '', // 内容标题
    pictureUrl: '', // 图片url地址
    contentText: '', // 内容正文
    pageComponentId: '', // 页面组件id
    sort: '' // 排序
  };

  private pageRules = {
    pictureUrl: [
      {
        message: '请上传图片',
        trigger: ['blur', 'change'],
        required: true
      }
    ],
    jumpDetail: [
      {
        message: '请选择',
        trigger: ['blur', 'change'],
        required: true
      }
    ],
    contentTitle: [
      {
        message: '请输入标题',
        trigger: 'blur',
        required: true
      }
    ]
  };

  private jumpDetailOption = [
    {
      label: '是',
      value: '1'
    },
    {
      label: '否',
      value: '0'
    }
  ]

  private isEffectiveOption = [
    {
      label: '是',
      value: '1'
    },
    {
      label: '否',
      value: '0'
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

  private pramas: { gzhId?: unknown} = { gzhId: this.$route.query.gzhId }

  // 菜单内容
  private originalFlagOptions = [
    {
      name: '是',
      value: 1
    },
    {
      name: '否',
      value: 0
    }
  ]

  private request = fileManagerUploadImageGetUrl

  private deleteImgFile() {
    if (this.pageForm.pictureUrl === '') {
      return
    }
    this.pageForm.pictureUrl = ''
    this.$message.success('删除成功')
  }

  private beforeRemove(file: any) {
    return this.$confirm(`确定移除 ${file.name}？`)
  }

  private handleRemove() {
    this.pageForm.pictureUrl = ''
  }

  private handleExceed(file:any) {
    console.log('448', file)
    this.$message.warning('')
  }

  private handlePreview(file: any) {
    console.log(file)
  }

  private onPreview() {
    (this.$refs.img as unknown as { showViewer: boolean }).showViewer = true
  }

  // 发起请求
  private async toRequest(dataA: any) {
    const fd = new FormData()
    fd.append('file', dataA.file)
    fd.append('authorization', UserModule.Authorization)
    await fileUpload(fd).then((res: any) => {
      if (res.code === '0') {
        const data = res.payload
        console.log('304', data)
        this.pageForm.pictureUrl = data
        // this.$refs.upload.clearFiles()
      }
    })
  }

  // 获取图片轮播内容详情
  private async getRotationContent(cParams:any) {
    let params = {}
    if (cParams) {
      params = cParams
      this.pageForm.contentId = cParams.contentId
    } else {
      params = { contentId: this.pageForm.contentId }
    }
    await gzhPictureRotationContentContentDetail(params)
      .then((res) => {
        if (res.code === '0') {
          this.pageForm.contentTitle = res.payload.contentTitle
          this.pageForm.contentText = res.payload.contentText
          this.pageForm.pictureUrl = res.payload.pictureUrl
        }
      })
  }

  // 提交图片轮播内容
  private async submitRotationContent() {
    (this.$refs.pageForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        if (this.pageForm.contentId) {
          await gzhPictureRotationContentEditContent(this.pageForm)
            .then((res) => {
              if (res.code === '0') {
                this.$message.success('操作成功')
              }
            })
        } else {
          await gzhPictureRotationContentCreateContent(this.pageForm)
            .then((res) => {
              if (res.code === '0') {
                this.$message.success('操作成功')
              }
            })
        }
      }
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
  .upload-el-image-wrap{
    .el-form-item__content{
      display: flex;
      position: relative;
      .upload-el-image{
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        width: 140px;
        height: auto;
        margin-right: 10px;
        display: block;
      }
      .preview{
        margin-left: 10px;
        height: fit-content;
      }
      .deleteImgFile{
        cursor: pointer;
        border: 1px solid #DCDFE6;
        width: 15px;
        height: 15px;
        line-height: 12px;
        font-size: 14px;
        text-indent: 3px;
        color: #DCDFE6;
        position: absolute;
        top: 5px;
        left: 120px;
      }
      .deleteImgFile:hover {
        color: #999;
        border: 1px solid #999;
      }
    }
  }
}
</style>
<style lang="scss">
.el-form-item__content{
  display: flex;
  .el-upload-list{
    display: none;
  }
}
</style>
