// 新建管理机构
<template>
  <Content class="create-components">
    <ContentItem :title="'基础信息'">
      <el-form
        ref="gzhForm"
        :model="gzhForm"
        :rules="userRules"
        label-position="right"
      >
        <el-form-item label="回复类型" label-width="150px" prop="replyType">
          <el-select
            v-model="gzhForm.replyType"
            disabled
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in replyOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="回复形式" label-width="150px" prop="replyForm">
          <el-select
            v-model="gzhForm.replyForm"
            clearable
            style="width: 100%"
            @change="onReplyTypeChange"
          >
            <el-option
              v-for="(item, index) in replyTypeOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="gzhForm.replyForm === 1" prop="replyContent" label="回复内容" label-width="150px">
          <el-input
            v-model="gzhForm.replyContent"
            placeholder="请输入内容不超过600字"
            clearable
            maxlength="100"
            show-word-limit
            rows="6"
            :style="{height: '170px'}"
            type="textarea"
          />
        </el-form-item>
        <el-form-item v-if="gzhForm.replyForm === 2" :prop="fileUrl ? 'file' : ''" label="回复内容" label-width="150px">
          <div v-if="src" class="upload-warp">
            <el-image ref="img" class="upload-el-image" :preview-src-list="[src]" :src="src" fit="contain" />
            <div class="upload-ready__wrap" :style="{display: 'flex'}">
              <el-upload
                class="upload-ready display-none"
                :style="{display: 'inline-block'}"
                action="#"
                :auto-upload="false"
                :file-list="[]"
                :show-file-list="false"
                :on-change="onFileChange"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                multiple
                :on-exceed="handleExceed"
              >
                <el-button size="small" type="primary">重新上传</el-button>
              </el-upload>
              <el-button class="display-none" size="small" type="primary" @click="onPreview">预览</el-button>
            </div>
            <div class="upload-close display-none">
              <el-button size="small" type="text" @click="onClose">X</el-button>
            </div>
            <div class="el-upload__tip">只能上传jpg/png文件</div>
          </div>
          <el-upload
            v-else
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :file-list="[]"
            show-file-list
            :on-change="onFileChange"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :on-exceed="handleExceed"
          >
            <el-button size="small" type="primary">{{src ? '重新上传' : '浏览'}}</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
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
import { gzhAutoReplyManagerSetAutoReplyConfig, gzhAutoReplyManagerGetAutoReplyConfig } from '@/api/wechat'
import Content from '@/components/Content/index.vue'
import ContentItem from '@/components/ContentItem/index.vue'

@Component({
  name: 'create-components',
  components: {
    Content,
    ContentItem
  }
})
export default class extends Vue {
  private src = ''
  created() {
    this.getGzhDetail()
  }

  private handleType = this.$route.params.id ? 'edit' : 'add'

  private gzhForm:{[props: string]: string | File | number | null | Blob} = {
    replyType: 1,
    replyForm: 1,
    gzhId: this.$route.params.id,
    replyContent: '',
    file: null
  };

  private userRules = {
    file: [
      {
        message: '请输入联系人姓名',
        trigger: 'blur',
        required: true
      }
    ],
    replyType: [
      {
        message: '请输入联系人姓名',
        trigger: 'blur',
        required: true
      }
    ],
    replyForm: [
      {
        message: '请输入联系人姓名',
        trigger: 'blur',
        required: true
      }
    ]
  };

  // 获取详情
  private getGzhDetail() {
    if (!this.$route.params.id) {
      console.log('add')
      return
    }
    const params = { gzhId: this.$route.params.id }
    gzhAutoReplyManagerGetAutoReplyConfig(params).then((res) => {
      this.gzhForm = Object.assign({}, this.gzhForm, res.payload || (this.$options as any).data())
      this.fileUrl = this.gzhForm.replyContent as string
      this.src = this.fileUrl
    })
  }

  private replyOption = [
    {
      label: '被关注回复',
      value: 1
    }
  ]

  private replyTypeOption = [
    {
      label: '文字',
      value: 1
    },
    {
      label: '图片',
      value: 2
    }
  ]

  // 返回
  private goBack() {
    this.$router.go(-1)
  }

  private beforeRemove(file: any) {
    return this.$confirm(`确定移除 ${file.name}？`)
  }

  private onClose() {
    this.src = ''
    this.gzhForm.file = ''
  }

  private handleExceed() {
    this.$message.warning(
      // `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
      //   files.length + fileList.length
      // } 个文件`
      '文件数量超出'
    )
  }

  private handleRemove() {
    this.gzhForm.file = ''
  }

  private onFileChange(file: any) {
    this.gzhForm.file = file.raw
    this.src = URL.createObjectURL(file.raw as Blob)
  }

  private handlePreview(file: any) {
    console.log(file)
  }

  private onPreview() {
    (this.$refs.img as unknown as { showViewer: boolean }).showViewer = true
  }

  // 编辑
  private async submitEditHandle() {
    const form = new FormData()
    form.append('file', this.gzhForm.file as Blob)
    form.append('replyType', this.gzhForm.replyType as string)
    form.append('gzhId', this.gzhForm.gzhId as string)
    form.append('replyId', (this.gzhForm.replyId || '') as string)
    form.append('replyForm', this.gzhForm.replyForm as string)
    form.append('replyContent', this.gzhForm.replyContent as string)
    gzhAutoReplyManagerSetAutoReplyConfig(form).then(res => {
      if (res.code === '0') {
        this.$message.success('操作成功')
        this.$router.go(-1)
      } else {
        this.$message.error(res.msg)
      }
    })
  }

  // 编辑
  private fileUrl = ''
  private async onReplyTypeChange(val:unknown) {
    if (val === 1) {
      this.gzhForm.replyContent = ''
    } else {
      this.gzhForm.replyContent = this.fileUrl || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.create-components {
  padding: 10px;
  height: 100%;
  overflow: auto;
  .el-form{
    width: auto;
    margin: 0 100px;
  }
  .el-form-item{
    width: 500px;
    margin-bottom: 20px;
  }
  .upload-warp {
    height: 132px;
  }
  .upload-el-image {
    width: 100%;
    height: calc(100% - 32px);
  }
  .upload-ready__wrap {
    position: absolute;
    top: 0;
    width: 100%;
    height: calc(100% - 32px);
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover{
      background: rgba($color: #000000, $alpha: 0.3);
      border-radius: 5px;
      opacity: 0.7;
    }
    &:hover .display-none{
      display: block !important;
    }
    &:hover + .display-none{
      display: block !important;
    }
  }
  .display-none {
    display: none !important;
  }
  .upload-ready {
    margin-right: 5px;
  }
  .upload-close {
    position: absolute;
    color: red;
    top: 3px;
    right: 5px;
  }
}
</style>
