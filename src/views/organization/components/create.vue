// 新建管理机构
<template>
  <div class="create-components">
    <div class="content">
      <el-form
        ref="createCompanyForm"
        :model="createCompanyForm"
        :rules="userRules"
        label-position="right"
      >
        <div class="title">基础信息</div>
        <!-- 针对没有营业执照的个体，务必选择虚拟机构 -->
        <el-form-item prop="orgType" label="机构类型" label-width="300px">
          <el-select
            v-model="createCompanyForm.orgType"
            placeholder="请选择"
            clearable
            style="width: 100%"
            :disabled="pageTypeDetail"
          >
            <el-option
              v-for="item in orgTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="unifiedSocialCreditCode"
          label="社会信用统一代码"
          label-width="300px"
        >
          <el-input
            v-model="createCompanyForm.unifiedSocialCreditCode"
            placeholder="请输入社会信用统一代码"
            clearable
            :disabled="pageTypeDetail"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="companyName" label="企业名称" label-width="300px">
          <el-input
            v-model="createCompanyForm.companyName"
            placeholder="请输入企业名称"
            clearable
            type="text"
            :disabled="pageTypeDetail"
          />
        </el-form-item>
        <el-form-item prop="companyType" label="企业类型" label-width="300px">
          <el-select
            v-model="createCompanyForm.companyType"
            placeholder="请选择"
            clearable
            style="width: 100%"
            :disabled="pageTypeDetail"
          >
            <el-option
              v-for="item in companyTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="area" label="所属区域" label-width="300px">
          <el-cascader
            v-model="createCompanyForm.area"
            :options="areaOptions"
            :props="defaultAreaProps"
            @change="handleAreaChange"
            clearable
            style="width: 100%"
            :disabled="pageTypeDetail"
          />
        </el-form-item>
        <el-form-item
          prop="registrationDate"
          label="成立日期"
          label-width="300px"
        >
          <el-date-picker
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            clearable
            v-model="createCompanyForm.registrationDate"
            style="width: 100%"
            :disabled="pageTypeDetail"
          />
        </el-form-item>
        <el-form-item
          prop="registrationAuthority"
          label="登记机关"
          label-width="300px"
        >
          <el-input
            v-model="createCompanyForm.registrationAuthority"
            placeholder="请选择登记机关"
            clearable
            type="text"
            :disabled="pageTypeDetail"
          />
        </el-form-item>
        <el-form-item prop="legalPerson" label="法定代表人" label-width="300px">
          <el-input
            v-model="createCompanyForm.legalPerson"
            placeholder="请输入法定代表人"
            type="text"
            clearable
            :disabled="pageTypeDetail"
          />
        </el-form-item>
        <el-form-item prop="companyStatus" label="是否有效" label-width="300px">
          <el-select
            v-model="createCompanyForm.companyStatus"
            placeholder="请选择"
            :disabled="pageTypeDetail"
            style="width: 100%"
          >
            <el-option
              v-for="item in avalidFlagOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属行业" label-width="300px">
          <!-- @change="$forceUpdate()"回显数据后，再次编辑需要强制刷新 -->
          <el-select
            v-model="createCompanyForm.industry"
            placeholder="请选择"
            filterable
            clearable
            style="width: 100%"
            :disabled="pageTypeDetail"
            @change="$forceUpdate()"
          >
            <el-option
              v-for="(item, index) in industryOptions"
              :key="index"
              :label="item.categoryName"
              :value="item.categoryCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经营范围" label-width="300px">
          <el-input
            style="width:500px;"
            v-model="createCompanyForm.businessRange"
            placeholder="请输入经营范围"
            type="textarea"
            clearable
            rows="10"
            :disabled="pageTypeDetail"
          />
        </el-form-item>
        <div class="title" v-if="!pageTypeDetailEdit">管理员信息</div>
        <el-form-item
          v-if="!pageTypeDetailEdit"
          prop="realName"
          label="企业管理员姓名"
          label-width="300px"
        >
          <el-input
            v-model="createCompanyForm.realName"
            placeholder="请输入企业管理员姓名"
            clearable
            type="text"
          />
        </el-form-item>
        <el-form-item v-if="!pageTypeDetailEdit" prop="phoneNo" label="手机号码" label-width="300px">
          <el-input
            v-model="createCompanyForm.phoneNo"
            placeholder="请输入手机号码"
            clearable
            type="text"
          />
        </el-form-item>
        <el-form-item
          v-if="!pageTypeDetailEdit"
          prop="defaultPwd"
          label="设定初始密码"
          label-width="300px"
        >
          <el-input
            v-model="createCompanyForm.defaultPwd"
            placeholder="请输入6-20位登录密码"
            type="text"
            clearable
            disabled
          />
        </el-form-item>
        <!-- <el-form-item
          v-if="!pageTypeDetailEdit"
          prop="defaultPwdRepeat"
          label="重复初始密码"
          label-width="300px"
        >
          <el-input
            v-model="createCompanyForm.defaultPwdRepeat"
            placeholder="请再次输入登录密码"
            type="text"
          />
        </el-form-item> -->
      </el-form>
      <div class="splitLine"></div>
      <div class="submit">
        <el-button type="primary" @click="goBack">返回</el-button>
        <el-button type="primary" v-if="!pageTypeDetailEdit" @click="submitHandle">保存</el-button>
        <el-button type="primary" v-if="pageTypeEdit" @click="submitEditHandle">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { isValidPhone, isValidVoid } from '@/utils/validate'
import { createCompany, getArea, companyDetail, getIndustryCategory, editCompany } from '@/api/organization'
import md5 from 'js-md5'
import { cloneDeep } from 'lodash'
@Component({
  name: 'create-components'
})
export default class extends Vue {
  created() {
    this.getAreaList()
    this.getIndustryCategory()
    if (this.pageTypeDetailEdit) {
      this.getCompanyDetail()
    }
  }

  private pageTypeDetailEdit = this.$route.query.type === 'detail' || this.$route.query.type === 'edit'
  private pageTypeDetail = this.$route.query.type === 'detail'
  private pageTypeEdit = this.$route.query.type === 'edit'

  private defaultAreaProps = {
    label: 'areaName',
    value: 'areaId',
    children: 'child',
    checkStrictly: true // 选择任意一级选项
  };

  private avalidFlagOptions = [
    {
      value: 1,
      label: '是'
    },
    {
      value: 0,
      label: '否'
    }
  ]

  private areaOptions = [
    {
      areaId: 'province',
      areaName: '省',
      child: [
        {
          areaId: 'city',
          areaName: '市'
        }
      ]
    }
  ];

  private handleAreaChange(value: any) {
    console.log(value)
  }

  private companyTypeOptions = [
    {
      value: 101,
      label: '非公司企业法人'
    },
    {
      value: 102,
      label: '有限责任公司'
    },
    {
      value: 103,
      label: '股份有限责任公司'
    },
    {
      value: 104,
      label: '（私营）独资企业'
    },
    {
      value: 105,
      label: '（私营）合伙企业'
    },
    {
      value: 106,
      label: '个体工商户'
    },
    {
      value: 107,
      label: '虚拟企业'
    }
  ];

  private orgTypeOptions = [
    {
      value: 1,
      label: '实体机构'
    },
    {
      value: 0,
      label: '虚拟机构'
    }
  ];

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

  private validateArea = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (value.length === 0) {
      callback(new Error('请选择所属区域'))
    } else {
      callback()
    }
  };

  private validateRegistrationDate = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!value) {
      callback(new Error('请输入成立日期'))
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
      this.createCompanyForm.defaultPwd = value.slice(5, 12)
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
    } else if (value !== this.createCompanyForm.defaultPwd) {
      callback(new Error('请输入正确的密码'))
    } else {
      callback()
    }
  };

  private createCompanyForm:any = {
    entityFlag: '',
    parentCompanyId: this.$route.query.companyId,
    unifiedSocialCreditCode: '', // 统一社会信用代码
    companyName: '', // 企业名称
    companyType: '', // 企业类型
    area: [], // 区域
    provinceId: '', // 省id
    cityId: '', // 城市id
    registrationDate: '', // 成立日期
    registrationAuthority: '', // 登记机关
    legalPerson: '', // 法定代表人
    industry: '', // 所属行业
    businessRange: '', // 经营范围
    realName: '', // 企业管理员姓名
    phoneNo: '', // 手机号码
    defaultPwd: '', // 初始密码
    defaultPwdRepeat: '', // 重复初始密码
    companyStatus: 1 // 有效
  };

  private userRules = {
    unifiedSocialCreditCode: [
      {
        validator: this.validateUnifiedSocialCreditCode,
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
    area: [
      {
        type: 'array',
        validator: this.validateArea,
        trigger: ['blur', 'change'],
        required: true
      }
    ],
    registrationDate: [
      {
        validator: this.validateRegistrationDate,
        trigger: 'blur',
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
        validator: this.validateRealName,
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

  // 获取区域
  private async getAreaList() {
    const { payload } = await getArea({}).finally()
    this.areaOptions = payload
  }

  private industryOptions:any = []
  // 获取行业字典
  private getIndustryCategory() {
    getIndustryCategory({ categoryName: '' })
      .then((res) => {
        this.industryOptions = res.payload
      })
  }

  // 获取详情
  private getCompanyDetail() {
    const params = { companyId: this.$route.query.companyId }
    companyDetail(params).then((res) => {
      this.createCompanyForm = res.payload
      if (res.payload.industryCode) {
        this.createCompanyForm.industry = res.payload.industryCode
      }
      this.createCompanyForm.area = [res.payload.provinceId, res.payload.cityId]
    })
  }

  // 返回
  private goBack() {
    this.$router.go(-1)
  }

  // 提交
  private async submitHandle() {
    (this.$refs.createCompanyForm as ElForm).validate(
      async(valid: boolean) => {
        if (valid) {
          this.createCompanyForm.provinceId = this.createCompanyForm.area[0]
          this.createCompanyForm.cityId = this.createCompanyForm.area[1]
          const defaultPwd = cloneDeep(this.createCompanyForm.defaultPwd)
          const params = cloneDeep(this.createCompanyForm)
          params.defaultPwd = md5(defaultPwd)
          await createCompany(params).then((res) => {
            if (res.code === '0') {
              this.$message.success('操作成功')
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
  private async submitEditHandle() {
    (this.$refs.createCompanyForm as ElForm).validate(
      async(valid: boolean) => {
        if (valid) {
          this.createCompanyForm.provinceId = this.createCompanyForm.area[0]
          this.createCompanyForm.cityId = this.createCompanyForm.area[1]
          this.createCompanyForm.companyId = this.$route.query.companyId
          const params = this.createCompanyForm
          await editCompany(params).then((res) => {
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
    .title{
      border-left: 4px solid #157fdf;
      line-height: 40px;
      font-size: 16px;
      text-indent: 10px;
      margin: -10px 0 0 -10px;
      color: #1890ff;
    }
  }
  // .el-form{
  //   width: 650px;
  // }
  .el-form-item{
    margin-bottom: 20px;
  }
  .splitLine{
    border-top: 4px solid #f2f2f2;
    margin: 0 -10px 10px -10px;
  }
  .submit {
    // width: 650px;
    display: flex;
    justify-content: center;
  }
}
</style>
<style lang="scss">
.create-components{
  .el-form-item__content{
    width: 350px;
  }
}
</style>
