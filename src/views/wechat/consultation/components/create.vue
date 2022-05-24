// 新建管理机构
<template>
  <div class="wechat-config-create-components">
    <div class="wechat-config-title">
      <span>基础信息</span>
    </div>
    <div class="content">
      <el-form
        class="wechat-config-form"
        ref="gzhForm"
        :model="gzhForm"
        :rules="userRules"
        label-width="200px"
        label-position="right"
      >
        <el-form-item
          prop="gzhId"
          label="公众号名称"
        >
          <el-select
            v-model="gzhForm.gzhId"
            placeholder="请选择"
            filterable
            clearable
            :disabled="!!$route.params.id"
            style="width: 100%"
            :filter-method="getGzhMainManagerList"
            @change="onChangeGzh"
          >
            <el-option
              v-for="(item, index) in gzhList"
              :key="index"
              :label="item.gzhName"
              :value="item.gzhId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="newsTitle" label="资讯标题">
          <el-input
            v-model="gzhForm.newsTitle"
            placeholder="请输入不超过150个汉字"
            clearable
            maxlength="150"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="newsAbstract" label="资讯摘要">
          <el-input
            v-model="gzhForm.newsAbstract"
            placeholder="请输入不超过150个汉字"
            clearable
            maxlength="150"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="originalFlag" label="是否原创">
          <el-select
            v-model="gzhForm.originalFlag"
            placeholder="请选择"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in originalFlagOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="newsAuthor" label="原创作者">
          <el-input
            v-model="gzhForm.newsAuthor"
            placeholder="请输入微信认证后获得的开发者ID"
            clearable
            type="text"
          />
        </el-form-item>
        <el-form-item prop="contentSourceUrl" label="原文链接">
          <el-input
            v-model="gzhForm.contentSourceUrl"
            placeholder="http://"
            clearable
            type="text"
          />
        </el-form-item>
        <el-form-item label="封面图是否显示在正文" prop="showCoverPicInContent">
          <el-select
            v-model="gzhForm.showCoverPicInContent"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option
              v-for="(item, index) in originalFlagOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="coverImageFile" label="封面图片">
          <div v-if="gzhForm.coverImageMediaUrl" class="upload-warp">
            <el-image ref="img" class="upload-el-image" :preview-src-list="[gzhForm.coverImageMediaUrl]" :src="gzhForm.coverImageMediaUrl" fit="contain" />
            <div class="upload-ready__wrap" :style="{display: 'flex'}">
              <el-upload
                class="upload-ready display-none"
                :style="{display: 'inline-block'}"
                :accept="'.jpg'"
                action="#"
                :auto-upload="false"
                :file-list="[]"
                :show-file-list="false"
                :on-change="onFileChange"
                :on-preview="handlePreview"
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
            <div class="el-upload__tip">请上传1张大小不超过5M的png、jpg文件。</div>
          </div>
          <el-upload
            v-else
            class="upload-demo"
            action="#"
            :accept="'.jpg'"
            :auto-upload="false"
            :file-list="[]"
            :show-file-list="false"
            :on-change="onFileChange"
            :on-preview="handlePreview"
            multiple
            :on-exceed="handleExceed"
          >
            <el-button size="small" type="primary">{{gzhForm.coverImageMediaUrl && gzhForm.coverImageFile ? '重新上传' : '浏览'}}</el-button>
            <div slot="tip" class="el-upload__tip">请上传1张大小不超过5M的png、jpg文件。</div>
          </el-upload>
        </el-form-item>
        <el-form-item prop="newsContent" label="资讯正文" :style="{width: '1050px'}">
          <!-- 协议内容 -->
          <tinymce
            ref="editor"
            v-model="gzhForm.newsContent"
            :height="400"
            :pramas="pramas"
            :request="request"
            :file-prop="'imageFile'"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="submit">
      <el-button type="primary" @click="goBack">返回</el-button>
      <el-button type="primary" v-if="handleType === 'add'" @click="submitHandle">提交</el-button>
      <el-button type="primary" v-else @click="submitEditHandle">提交</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { isValidPhone, isValidVoid } from '@/utils/validate'
import Tinymce from '@/components/Tinymce/index.vue'
import { fileManagerUploadImageGetUrl, gzhNewsInfoManagerCreate, gzhNewsInfoManagerEdit, gzhNewsInfoManagerDetail, gzhMainManagerList } from '@/api/wechat'

@Component({
  name: 'wechat-config-create-components',
  components: { Tinymce }
})
export default class extends Vue {
  created() {
    this.getGzhDetail()
    this.getGzhMainManagerList()
  }

  private handleType = this.$route.params.id ? 'edit' : 'add'
  private originalFlagOption = [
    {
      label: '是',
      value: 1
    },
    {
      label: '否',
      value: 0
    }
  ]

  private validateUnifiedSocialCreditCode = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      callback(new Error('请输入统一社会信用代码'))
    } else {
      callback()
    }
  };

  private validateCompanyName = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      callback(new Error('请输入企业名称'))
    } else {
      callback()
    }
  };

  private validateCompanyType = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    console.log('325', value)
    if (!isValidVoid(value)) {
      callback(new Error('请输入企业类型'))
    } else {
      callback()
    }
  };

  private validateRegistrationAuthority = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      callback(new Error('请输入登记机关'))
    } else {
      callback()
    }
  };

  private validateLegalPerson = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      callback(new Error('请输入法定代表人'))
    } else {
      callback()
    }
  };

  private validatePhoneNo = (rule: any, value: string, callback: Function) => {
    if (!isValidPhone(value)) {
      callback(new Error('请输入手机号码'))
    } else {
      this.gzhForm.defaultPwd = value.slice(5, 12)
      callback()
    }
  };

  private validateDefaultPwd = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      callback(new Error('请输入密码'))
    } else {
      callback()
    }
  };

  private validateDefaultPwdRepeat = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      callback(new Error('请输入密码'))
    } else if (value !== this.gzhForm.defaultPwd) {
      callback(new Error('请输入正确的密码'))
    } else {
      callback()
    }
  };

  private gzhForm:any = {
    gzhId: '',
    contentSourceUrl: '',
    newsContent: '',
    newsTitle: '',
    originalFlag: 0,
    sort: 1,
    newsAbstract: '',
    newsAuthor: '',
    coverImageFile: '',
    coverImageMediaUrl: '',
    showCoverPicInContent: '' // 封面图片是否显示在正文中
  };

  private userRules = {
    unifiedSocialCreditCode: [
      {
        validator: this.validateUnifiedSocialCreditCode,
        trigger: 'blur',
        required: true
      }
    ],
    gzhId: [
      {
        message: '请输入AppId',
        trigger: 'blur',
        required: true
      }
    ],
    appId: [
      {
        message: '请输入AppId',
        trigger: 'blur',
        required: true
      }
    ],
    newsAbstract: [
      {
        message: '请输入AppId',
        trigger: 'blur',
        required: true
      }
    ],
    newsTitle: [
      {
        message: '请输入公众号名称',
        trigger: 'blur',
        required: true
      }
    ],
    gzhName: [
      {
        message: '请输入公众号名称',
        trigger: 'change',
        required: true
      }
    ],
    originalFlag: [
      {
        message: '请输入公众号名称',
        trigger: 'blur',
        required: true
      }
    ],
    token: [
      {
        message: '请输入令牌（Token）',
        trigger: 'blur',
        required: true
      }
    ],
    coverImageFile: [
      {
        validator: this.validateCoverImageFile,
        trigger: 'change',
        required: true
      }
    ],
    companyType: [
      {
        validator: this.validateCompanyType,
        trigger: ['blur', 'change'],
        required: true
      }
    ],
    registrationAuthority: [
      {
        validator: this.validateRegistrationAuthority,
        trigger: 'blur',
        required: true
      }
    ],
    legalPerson: [
      {
        validator: this.validateLegalPerson,
        trigger: 'blur',
        required: true
      }
    ],
    realName: [
      {
        message: '请输入联系人姓名',
        trigger: 'blur',
        required: true
      }
    ],
    phoneNo: [
      {
        validator: this.validatePhoneNo,
        trigger: 'blur',
        required: true
      }
    ],
    auditBeginDate: [
      {
        message: '请选择年审开始日期',
        trigger: 'blur',
        required: true
      }
    ],
    showCoverPicInContent: [
      {
        message: '请选择封面图是否显示在正文',
        trigger: 'change',
        required: true
      }
    ],
    newsContent: [
      {
        message: '请输入资讯正文',
        trigger: 'blur',
        required: true
      }
    ],
    phoneNumber: [
      {
        message: '请选择联系人电话',
        trigger: 'blur',
        required: true
      }
    ],
    defaultPwd: [
      {
        validator: this.validateDefaultPwd,
        trigger: 'blur',
        required: true
      }
    ],
    defaultPwdRepeat: [
      {
        validator: this.validateDefaultPwdRepeat,
        trigger: 'blur',
        required: true
      }
    ]
  };

  private validateCoverImageFile(rule: any, value: string, callback: Function) {
    if (!value && !this.gzhForm.coverImageMediaUrl) {
      callback(new Error('请选择封面图片'))
    } else {
      callback()
    }
  }

  // 获取详情
  private getGzhDetail() {
    if (!this.$route.params.id) {
      // console.log('add')
      return
    }
    const params = { newsId: this.$route.params.id }
    gzhNewsInfoManagerDetail(params).then((res) => {
      res.payload.showCoverPicInContent = Number(res.payload.showCoverInContent) // 封面图是否显示在正文中
      this.gzhForm = res.payload
      this.onChangeGzh(this.gzhForm.gzhId)
    })
  }

  private gzhList = []
  // 获取详情
  private getGzhMainManagerList(gzhName = '') {
    gzhMainManagerList({ gzhName }).then((res) => {
      this.gzhList = (res.payload && res.payload.list) || []
    })
  }

  // 返回
  private goBack() {
    this.$router.go(-1)
  }

  private onClose() {
    this.gzhForm.coverImageMediaUrl = ''
    this.gzhForm.coverImageFile = ''
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
    this.gzhForm.coverImageFile = file.raw
    this.gzhForm.coverImageMediaUrl = URL.createObjectURL(file.raw as Blob)
  }

  private handlePreview(file: any) {
    console.log(file)
  }

  private onPreview() {
    (this.$refs.img as unknown as { showViewer: boolean }).showViewer = true
  }

  // 提交
  private async submitHandle() {
    (this.$refs.gzhForm as ElForm).validate(
      async(valid: boolean) => {
        if (valid) {
          const body = new FormData()
          Object.keys(this.gzhForm).forEach(key => {
            body.append(key, this.gzhForm[key])
          })
          await gzhNewsInfoManagerCreate(body).then((res) => {
            if (res.code === '0') {
              this.$message.success('操作成功')
              this.$router.go(-1)
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          return false
        }
      }
    )
  }

  private pramas: { gzhId?: unknown} = { gzhId: '' }
  private request = fileManagerUploadImageGetUrl
  // 提交
  private async onChangeGzh(val:unknown) {
    // console.log(val)
    this.pramas.gzhId = val
  }

  // 编辑
  private async submitEditHandle() {
    (this.$refs.gzhForm as ElForm).validate(
      async(valid: boolean) => {
        if (valid) {
          const body = new FormData()
          Object.keys(this.gzhForm).forEach(key => {
            body.append(key, this.gzhForm[key])
          })
          await gzhNewsInfoManagerEdit(body).then((res) => {
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
}
</script>

<style lang="scss" scoped>
.wechat-config-create-components {
  padding: 10px;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  .content {
    background: #fff;
    flex:1;
    width: 100%;
    margin: 0 auto;
    padding: 10px;
  }
  .el-form{
    width: auto;
    margin: 0 100px;
  }
  .el-form-item {
    width: 500px;
    margin-bottom: 20px;
  }
  .submit {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .wechat-config-title {
    min-height: 40px;
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
      left: 0;
      top: 0;
      height: 100%;
      width: 3px;
      background: $blue;
    }
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
  .submit {
    margin-top: 5px;
    background: #ffffff;
    padding: 10px
  }
}
</style>
