// 页面配置-新建-图文信息
<template>
  <Content class="image-text-add-wrap">
    <ContentItem :title="'基本属性'" :style="{marginBottom: '5px'}">
      <el-form
        ref="addImageTextForm"
        :model="addImageTextForm"
        :rules="pageRules"
        label-width="200px"
        label-position="right"
        :style="{marginLeft: 0}"
      >
        <el-form-item
          prop="categoryId"
          label="选择分类"
          label-width="120px"
        >
          <el-select
            v-model="addImageTextForm.categoryId"
            placeholder="请选择"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="(item) in categoryList"
              :key="item.categoryId"
              :label="item.categoryName"
              :value="item.categoryId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图文标题" label-width="120px" prop="contentTitle">
          <el-input v-model="addImageTextForm.contentTitle" maxlength="100" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="图文概述" label-width="120px" prop="contentAbstract">
          <el-input v-model="addImageTextForm.contentAbstract" maxlength="100" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="来源名称" label-width="120px" prop="contentSource">
          <el-input v-model="addImageTextForm.contentSource" maxlength="100" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="是否显示缩略图" label-width="120px" prop="showThumb">
          <el-select
            v-model="addImageTextForm.showThumb"
            placeholder="请选择"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in exitOption3"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <!-- <el-input v-model="addImageTextForm.showThumb" maxlength="100" placeholder="请输入标题"></el-input> -->
        </el-form-item>
        <el-form-item label="缩略图样式" label-width="120px" prop="thumbAlignType">
          <el-select
            v-model="addImageTextForm.thumbAlignType"
            placeholder="请选择"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in exitOption4"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <!-- <el-input v-model="addImageTextForm.thumbAlignType" maxlength="100" placeholder="请输入标题"></el-input> -->
        </el-form-item>
        <el-form-item class="upload-el-image-wrap" label="缩略图" label-width="120px" prop="thumbImageUrlList">
          <el-image ref="img" v-if="imgFileSrc" class="upload-el-image" :preview-src-list="[imgFileSrc]" :src="imgFileSrc" fit="contain" />
          <el-upload
            class="upload-ready display-none"
            :style="{display: 'inline-block'}"
            :file-list="[]"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-exceed="handleExceed"
            :http-request="toRequest"
          >
            <el-button v-if="imgFileSrc" size="small" type="primary">重新上传</el-button>
            <el-button v-else size="small" type="primary">上传</el-button>
          </el-upload>
          <div v-if="imgFileSrc" class="deleteImgFile" @click="deleteImgFile">x</div>
        </el-form-item>
        <el-form-item
          prop="originalFlag"
          label="是否原创"
          label-width="120px"
        >
          <el-select
            v-model="addImageTextForm.originalFlag"
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
        <el-form-item label="原创作者" label-width="120px" prop="originalAuthor">
          <el-input v-model="addImageTextForm.originalAuthor" maxlength="100" placeholder="请输入原创作者"></el-input>
        </el-form-item>
        <el-form-item label="原文链接" label-width="120px" prop="originalLink">
          <el-input v-model="addImageTextForm.originalLink" placeholder="请输入不超过150个汉字"></el-input>
        </el-form-item>
        <el-form-item class="submitContent submitContent__tinymce" prop="contentText" label="正文" label-width="120px">
          <tinymce
            ref="editor"
            v-model="addImageTextForm.contentText"
            :height="400"
            :request="request"
          />
        </el-form-item>
      </el-form>
    </ContentItem>
    <ContentItem :style="{marginBottom: '5px', overflow: 'visible'}">
      <div style="text-align: center;">
        <el-button @click="goBack">返回</el-button>
        <el-button @click="submitImageText">提交</el-button>
      </div>
    </ContentItem>
  </Content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Content from '@/components/Content/index.vue'
import ContentItem from '@/components/ContentItem/index.vue'
import Tinymce from '@/components/Tinymce/index.vue'
import { UserModule } from '@/store/modules/user'
import { fileUpload } from '@/api/goods'
import { Form as ElForm } from 'element-ui'
import {
  fileManagerUploadImageGetUrl,
  gzhGraphicInfoContentCreateContent, // 新建内容
  gzhGraphicInfoContentCategoryCategoryList, // 获取页面分类
  gzhGraphicInfoContentEditContent, // 编辑内容
  gzhGraphicInfoContentContentList // 获取详情
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
  created() {
    this.getCategoryList() // 获取分类
    this.getContentDetail() // 获取content详情
  }

  private addImageTextForm:any = {
    pageComponentId: this.$route.params.id, // 页面组件id
    contentId: this.$route.query.contentId, // 页面图文组件内容id
    categoryId: '', // 选择分类id
    contentTitle: '', // 图文标题
    contentSource: '', // 来源名称
    contentAbstract: '', // 图文摘要/概述
    showThumb: '', // 是否显示缩略图
    thumbAlignType: '', // 缩略图对齐方式
    thumbImageUrlList: [], // 缩略图url list
    originalFlag: '', // 是否原创
    originalAuthor: '', // 原创作者
    originalLink: '', // 原创链接
    contentText: '', // 图文正文
    sort: '' // 排序
  };

  private pageRules = {
    categoryId: [
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
    ],
    contentText: [
      {
        message: '请输入正文',
        trigger: 'blur',
        required: true
      }
    ]
  };

  private exitOption = [
    {
      label: '是',
      value: 1
    },
    {
      label: '否',
      value: 0
    }
  ]

  private exitOption1 = [
    {
      label: '是',
      value: 1
    },
    {
      label: '否',
      value: 0
    }
  ]

  private categoryQuery = {
    pageId: this.$route.query.pid,
    categoryId: '',
    page: 1,
    size: 999
  }

  private categoryList = []
  private async getCategoryList() {
    const { payload } = await gzhGraphicInfoContentCategoryCategoryList(this.categoryQuery)
    const { list } = payload
    console.log('391', list)
    this.categoryList = list
  }

  private exitOption3 = [
    {
      label: '是',
      value: 1
    },
    {
      label: '否',
      value: 0
    }
  ]

  private exitOption4 = [
    {
      label: '居左',
      value: 'left'
    },
    {
      label: '居中',
      value: 'center'
    },
    {
      label: '居右',
      value: 'right'
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

  private imgFileSrc = ''

  private request = fileManagerUploadImageGetUrl

  private onFileChange(file: any) {
    console.log('450', file.raw)
    this.addImageTextForm.thumbImageUrlList = []
    this.addImageTextForm.thumbImageUrlList.push(URL.createObjectURL(file.raw as Blob))
    this.imgFileSrc = URL.createObjectURL(file.raw as Blob)
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
        this.addImageTextForm.thumbImageUrlList.push(data)
        this.imgFileSrc = data
      }
    })
  }

  private deleteImgFile() {
    if (this.addImageTextForm.thumbImageUrlList.lenth === 0) {
      return
    }
    this.addImageTextForm.thumbImageUrlList = []
    this.imgFileSrc = ''
    this.$message.success('删除成功')
  }

  private beforeRemove(file: any) {
    return this.$confirm(`确定移除 ${file.name}？`)
  }

  private handleRemove() {
    this.addImageTextForm.thumbImageUrlList = []
    this.imgFileSrc = ''
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

  // 查询条件
  private listQuery:any = {
    contentId: this.$route.query.contentId || '',
    page: 1,
    pagesize: 999,
    pageId: this.$route.query.pid
  }

  // 获取详情
  private async getContentDetail() {
    if (this.$route.query.type === 'create') {
      return
    }
    await gzhGraphicInfoContentContentList(this.listQuery)
      .then((res) => {
        if (res.code === '0') {
          const data = res.payload.list[0]
          this.addImageTextForm.categoryId = data.categoryId
          this.addImageTextForm.contentTitle = data.contentTitle
          this.addImageTextForm.contentAbstract = data.contentAbstract
          this.addImageTextForm.contentSource = data.contentSource
          this.addImageTextForm.showThumb = data.showThumb
          this.addImageTextForm.thumbAlignType = data.thumbAlignType
          this.addImageTextForm.thumbImageUrlList = data.thumbImageUrlList
          this.imgFileSrc = data.thumbImageUrlList[1]
          this.addImageTextForm.originalFlag = data.originalFlag
          this.addImageTextForm.originalAuthor = data.originalAuthor
          this.addImageTextForm.originalLink = data.originalLink
          this.addImageTextForm.contentText = data.contentText
        }
      })
  }

  // 提交/保存
  private async submitImageText() {
    (this.$refs.addImageTextForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        if (this.$route.query.type === 'edit') {
          this.addImageTextForm.validStatus = '1' // 有效状态 1 有效 0 无效
          await gzhGraphicInfoContentEditContent(this.addImageTextForm)
            .then((res) => {
              if (res.code === '0') {
                this.$router.go(-1)
              }
            })
        }
        await gzhGraphicInfoContentCreateContent(this.addImageTextForm)
          .then((res) => {
            if (res.code === '0') {
              this.$router.go(-1)
            }
          })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.image-text-add-wrap{
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
          width: 220px;
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
          top: 10px;
          left: 194px;
        }
        .deleteImgFile:hover {
          color: #999;
          border: 1px solid #999;
        }
      }
    }
  }
}

</style>
<style lang="scss">
.image-text-add-wrap{
  .el-form-item__content{
    display: flex;
    width: 500px!important;
  }
  .el-upload-list{
    display: none;
  }
}
</style>
