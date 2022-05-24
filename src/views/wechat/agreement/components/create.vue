// 新建管理机构
<template>
  <Content>
    <ContentItem :title="'基础信息'" :flex="true">
      <el-form
        ref="gzhForm"
        class="app-form"
        :model="gzhForm"
        :rules="userRules"
        label-position="right"
      >
        <el-form-item :disabled="handleType==='edit'" label="协议类型" label-width="150px" prop="protocolTypeCode">
          <el-select
            v-model="gzhForm.protocolTypeCode"
            placeholder="请选择协议类型"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in companyList"
              :key="index"
              :label="item.protocolTypeName"
              :value="item.protocolTypeCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="releaseTerminalList" label="发布平台" label-width="150px">
          <el-checkbox-group v-model="gzhForm.releaseTerminalList">
            <el-checkbox v-for="(item, index) in platFormData" :key="index" :style="{marginRight: '10px'}" :label="item.terminalCode">{{item.terminalName}}</el-checkbox>
            <!-- <el-checkbox :style="{marginRight: '10px'}" :label="1">Web端</el-checkbox>
            <el-checkbox :style="{marginRight: '10px'}" :label="2">公众号</el-checkbox>
            <el-checkbox :style="{marginRight: '10px'}" :label="3">小程序</el-checkbox>
            <el-checkbox :style="{marginRight: '10px'}" :label="4">APP</el-checkbox> -->
          </el-checkbox-group>
        </el-form-item>
        <el-form-item prop="protocolContent" label="协议内容" label-width="150px" :style="{width: '950px'}">
          <!-- 协议内容 -->
          <tinymce
            ref="editor"
            v-model="gzhForm.protocolContent"
            :height="110"
            :pramas="pramas"
            :request="request"
            :file-prop="'imageFile'"
          />
        </el-form-item>
        <el-form-item v-if="handleType==='edit'" prop="protocolStatus" label="是否有效" label-width="150px">
          <!-- 协议内容 -->
          <el-select
            v-model="gzhForm.protocolStatus"
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
    <div slot="footer">
      <el-button type="primary" @click="goBack">返回</el-button>
      <el-button type="primary" v-if="handleType === 'add'" @click="submitHandle">提交</el-button>
      <el-button type="primary" v-else @click="submitEditHandle">提交</el-button>
    </div>
  </Content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { isValidPhone, isValidVoid } from '@/utils/validate'
import Tinymce from '@/components/Tinymce/index.vue'
import { fileManagerUploadImageGetUrl, gzhProtocolManagerSave, gzhProtocolManagerEdit, gzhProtocolManagerDetail, gzhProtocolManagerTypeList } from '@/api/wechat'
import { showTerminal } from '@/api/goods'
import Content from '@/components/Content/index.vue'
import ContentItem from '@/components/ContentItem/index.vue'

@Component({
  name: 'create-components',
  components: {
    Tinymce,
    ContentItem,
    Content
  }

})
export default class extends Vue {
  async created() {
    await this.getShowTerminal()
    await this.getProtocolManagerTypeList()
    this.getGzhDetail()
  }

  private handleType = this.$route.params.id ? 'edit' : 'add'
  private protocolId = this.$route.params.id
  private pramas: { gzhId?: unknown} = { gzhId: this.$route.query.gzhId }
  private request = fileManagerUploadImageGetUrl
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

  private validateRealName = (rule: any, value: string, callback: Function) => {
    if (!isValidVoid(value)) {
      callback(new Error('请输入企业管理员姓名'))
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
    releaseTerminalList: [],
    gzhId: this.$route.query.id || '',
    protocolStatus: null,
    protocolTypeCode: null,
    protocolContent: ''
  };

  private userRules = {
    unifiedSocialCreditCode: [
      {
        validator: this.validateUnifiedSocialCreditCode,
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
    protocolTypeCode: [
      {
        message: '请选择协议类型',
        trigger: 'blur',
        required: true
      }
    ],
    releaseTerminalList: [
      {
        message: '请选择发布平台',
        trigger: 'blur',
        required: true
      }
    ],
    protocolContent: [
      {
        message: '请输入协议内容',
        trigger: 'blur',
        required: true
      }
    ],
    companyName: [
      {
        validator: this.validateCompanyName,
        trigger: 'blur',
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
    auditEndDate: [
      {
        message: '请选择年审结束日期',
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

  // 获取详情
  private getGzhDetail() {
    if (!this.protocolId) {
      console.log('add')
      return
    }
    const params = { protocolId: this.protocolId }
    gzhProtocolManagerDetail(params).then((res) => {
      const gzhForm = res.payload
      gzhForm.releaseTerminalList = [String(gzhForm.releaseTerminal)]
      gzhForm.protocolTypeCode = String(gzhForm.protocolTypeCode)
      this.gzhForm = gzhForm
    })
  }

  private platFormData = []

  // 获取详情
  private getShowTerminal() {
    return showTerminal({}).then(res => {
      this.platFormData = res.payload
    })
  }

  private companyList = []
  // 获取详情
  private getProtocolManagerTypeList(companyName = '') {
    return gzhProtocolManagerTypeList({ companyName }).then((res) => {
      this.companyList = res.payload
    })
  }

  // 返回
  private goBack() {
    this.$router.go(-1)
  }

  // 提交
  private async submitHandle() {
    (this.$refs.gzhForm as ElForm).validate(
      async(valid: boolean) => {
        if (valid) {
          await gzhProtocolManagerSave(this.gzhForm).then((res) => {
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

  // 编辑
  private async submitEditHandle() {
    (this.$refs.gzhForm as ElForm).validate(
      async(valid: boolean) => {
        if (valid) {
          await gzhProtocolManagerEdit(this.gzhForm).then((res) => {
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
</style>
