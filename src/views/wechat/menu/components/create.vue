// 新建管理机构
<template>
  <div class="create-components">
    <div class="content">
      <el-form
        ref="gzhForm"
        :model="gzhForm"
        :rules="userRules"
        label-position="right"
      >
        <div>基础信息</div>
        <el-form-item
          prop="gzhName"
          label="公众号名称"
          label-width="150px"
        >
          <el-input
            v-model="gzhForm.gzhName"
            placeholder="确保与微信认证时录入一致"
            clearable
            type="text"
          />
        </el-form-item>
        <el-form-item prop="appId" label="AppID" label-width="150px">
          <el-input
            v-model="gzhForm.appId"
            placeholder="请输入微信认证后获得的开发者ID"
            clearable
            type="text"
          />
        </el-form-item>
        <el-form-item prop="token" label="令牌（Token）" label-width="150px">
          <el-input
            v-model="gzhForm.token"
            placeholder="请输入微信认证后获得的开发者ID"
            clearable
            type="text"
          />
        </el-form-item>
        <el-form-item prop="appSecret" label="消息加减密钥" label-width="150px">
          <el-input
            v-model="gzhForm.appSecret"
            placeholder="请输入微信认证后获得的开发者ID"
            clearable
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="auditBeginDate"
          label="年审开始日期"
          label-width="150px"
        >
          <el-date-picker
            type="date"
            placeholder="请选择开始日期"
            value-format="yyyy-MM-dd"
            clearable
            v-model="gzhForm.auditBeginDate"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          prop="auditEndDate"
          label="年审结束日期"
          label-width="150px"
        >
          <el-date-picker
            type="date"
            placeholder="请选择结束日期"
            value-format="yyyy-MM-dd"
            clearable
            v-model="gzhForm.auditEndDate"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="所属主体" label-width="150px" prop="companyId">
          <el-select
            v-model="gzhForm.companyId"
            placeholder="请输入微信认证后获得的开发者ID"
            filterable
            clearable
            style="width: 100%"
            :filter-method="getOrganizationList"
          >
            <el-option
              v-for="(item, index) in companyList"
              :key="index"
              :label="item.companyName"
              :value="item.companyId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="realName" label="联系人姓名" label-width="150px">
          <el-input
            v-model="gzhForm.realName"
            placeholder="有效管理员"
            clearable
            type="text"
          />
        </el-form-item>
        <el-form-item prop="phoneNumber" label="联系人电话" label-width="150px">
          <el-input
            v-model="gzhForm.phoneNumber"
            placeholder="11位手机号码"
            clearable
            type="text"
          />
        </el-form-item>
      </el-form>
      <div class="submit">
        <el-button type="primary" @click="goBack">返回</el-button>
        <el-button type="primary" v-if="handleType === 'add'" @click="submitHandle">提交</el-button>
        <el-button type="primary" v-else @click="submitEditHandle">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { isValidPhone, isValidVoid } from '@/utils/validate'
import { gzhMainManagerSave, gzhMenuManagerEdit, gzhMainManagerDetail } from '@/api/wechat'
import { companyManagerGetCompanyList } from '@/api/organization'
import md5 from 'js-md5'
import { cloneDeep } from 'lodash'
@Component({
  name: 'create-components'
})
export default class extends Vue {
  created() {
    this.getGzhDetail()
    this.getOrganizationList()
  }

  private handleType = this.$route.params.id ? 'edit' : 'add'

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
    gzhName: [
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
    if (!this.$route.params.id) {
      console.log('add')
      return
    }
    const params = { gzhId: this.$route.params.id }
    gzhMainManagerDetail(params).then((res) => {
      this.gzhForm = res.payload
      if (res.payload.industryCode) {
        this.gzhForm.industry = res.payload.industryCode
      }
      this.gzhForm.area = [res.payload.provinceId, res.payload.cityId]
    })
  }

  private companyList = []
  // 获取详情
  private getOrganizationList(companyName = '') {
    companyManagerGetCompanyList({ companyName }).then((res) => {
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
          await gzhMainManagerSave(this.gzhForm).then((res) => {
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
          await gzhMenuManagerEdit(this.gzhForm).then((res) => {
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
.create-components {
  padding: 10px;
  height: 100%;
  overflow: auto;
  .content {
    background: #fff;
    width: 100%;
    margin: 0 auto;
    padding: 10px;
    min-height: 100%;
    overflow: auto;
  }
  .el-form{
    width: 500px;
  }
  .el-form-item{
    margin-bottom: 20px;
  }
  .submit {
    width: 500px;
    display: flex;
    justify-content: center;
  }
}
</style>
