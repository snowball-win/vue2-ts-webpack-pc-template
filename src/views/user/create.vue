// 新建管理机构
<template>
  <div class="create-components">
    <div class="content">
      <el-form
        ref="userForm"
        :model="userForm"
        :rules="userRules"
        label-position="right"
        label-width="180px"
      >
        <div class="title">基础信息</div>
        <el-form-item prop="realName" label="姓名" label-width="300px">
          <el-input
            v-model="userForm.realName"
            placeholder="请输入姓名"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="phoneNo" label="手机号码" label-width="300px">
          <el-input
            v-model="userForm.phoneNo"
            placeholder="请输入手机号码"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="identityNo" label="身份证号" label-width="300px">
          <el-input
            v-model="userForm.identityNo"
            placeholder="请输入身份证号"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="adminFlag" label="是否为当前机构管理员" label-width="300px">
          <el-select
            v-model="userForm.adminFlag"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in adminFlagOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="validFlag" label="是否有效" label-width="300px">
          <el-select
            v-model="userForm.validFlag"
            placeholder="请选择"
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
        <el-form-item label="数据范围" label-width="300px">
          <el-cascader
            v-model="userForm.dataPermissionScopeCur"
            :options="dataPermissionScopeOptions"
            :props="dataPermissionScopeProps"
            :show-all-levels="false"
            style="width: 100%"
            clearable>
          </el-cascader>
        </el-form-item>
        <!-- <el-form-item label="所属部门">
          <el-input
            v-model="userForm.department"
            placeholder="所属部门"
            type="text"
          />
        </el-form-item> -->
        <!-- <el-form-item label="职务">
          <el-input
            v-model="userForm.jobTitle"
            placeholder="职务"
            type="text"
          />
        </el-form-item> -->
        <el-form-item label="出生日期" label-width="300px">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            v-model="userForm.birthday"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="性别" style="display:block;" label-width="300px">
          <el-radio-group v-model="userForm.gender">
            <el-radio-button label="1">男</el-radio-button>
            <el-radio-button label="0">女</el-radio-button>
            <el-radio-button label="2">保密</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户名" label-width="300px">
          <el-input
            v-model="userForm.loginName"
            placeholder="请输入企业管理员姓名"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="loginPwdCur" label="初始密码" label-width="300px">
          <el-input
            v-model="userForm.loginPwdCur"
            placeholder="初始密码"
            type="text"
            disabled
          />
        </el-form-item>
      </el-form>
      <div class="splitLine"></div>
      <div class="submit">
        <el-button type="primary" @click="onGoBack">返回</el-button>
        <el-button type="primary" @click="submitHandle">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { isValidUsername, isValidPhone, isValidVoid } from '@/utils/validate'
import { createUser, getCompanyTree } from '@/api/organization'
import md5 from 'js-md5'
import { cloneDeep } from 'lodash'

@Component({
  name: 'user-manager-create-user'
})
export default class extends Vue {
  created() {
    this.getCompanyTree()
  }

  private validateName = (rule: any, value: string, callback: Function) => {
    if (!isValidUsername(value)) {
      callback(new Error('请输入姓名'))
    } else {
      callback()
    }
  };

  private validatePhone = (rule: any, value: string, callback: Function) => {
    if (!isValidPhone(value)) {
      callback(new Error('请输入手机号'))
    } else {
      this.userForm.loginPwdCur = value.slice(5, 12)
      callback()
    }
  };

  private validateIdentityNo = (rule: any, value: string, callback: Function) => {
    console.log('162', value.length, value.length !== 18)
    if (!value.trim()) {
      callback(new Error('请输入身份证号码'))
    } else if (value.length !== 18) {
      callback(new Error('请输入正确身份证号码'))
    } else {
      this.userForm.loginPwdCur = value.slice(5, 12)
      callback()
    }
  };

  private validateAdminFlag = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      callback(new Error('是否为管理员'))
    } else {
      callback()
    }
  };

  private validateValidFlag = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      callback(new Error('是否有效'))
    } else {
      callback()
    }
  };

  private validateLoginPwd = (rule: any, value: string, callback: Function) => {
    if (!isValidVoid(value)) {
      callback(new Error('请输入密码'))
    } else {
      callback()
    }
  };

  private validateLoginPwdRepeat = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      callback(new Error('请输入密码'))
    } else if (value !== this.userForm.loginPwdCur) {
      callback(new Error('请输入正确的密码'))
    } else {
      callback()
    }
  };

  private userForm = {
    companyId: this.$route.query.companyId, // 机构id
    realName: '', // 姓名
    phoneNo: '', // 手机号
    identityNo: '', // 身份证号码
    adminFlag: 0, // 是否为管理员
    validFlag: 1, // 是否有效
    dataPermissionScopeCur: [],
    dataPermissionScope: [
      {
        companyId: null,
        adminFlag: 0
      }
    ],
    // department: '', // 部门
    // jobTitle: '', // 职务
    birthday: '', // 生日
    gender: '', // 性别
    loginName: '', // 登录名
    loginPwdCur: '', // 密码
    loginPwd: '', // 密码
    loginPwdRepeat: '' // 重复密码
  };

  private dataPermissionScopeProps = {
    multiple: true,
    value: 'companyId',
    label: 'companyName',
    children: 'child',
    checkStrictly: 'true'
  }

  private dataPermissionScopeOptions:any = []

  // 获取机构树
  private async getCompanyTree() {
    await getCompanyTree({})
      .then((res) => {
        const data = res.payload.companyTreeList
        this.recursionTreeData(data)
        this.dataPermissionScopeOptions = data
      })
  }

  // 递归去掉空的child
  private recursionTreeData(data:any) {
    data.forEach((item:any) => {
      if (item.child.length > 0) {
        this.recursionTreeData(item.child)
      } else {
        delete item.child
      }
    })
  }

  private adminFlagOptions = [
    {
      value: 1,
      label: '是'
    },
    {
      value: 0,
      label: '否'
    }
  ]

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

  private userRules = {
    realName: [
      {
        validator: this.validateName,
        trigger: 'blur',
        required: true
      }
    ],
    phoneNo: [
      {
        validator: this.validatePhone,
        trigger: 'blur',
        required: true
      }
    ],
    identityNo: [
      {
        validator: this.validateIdentityNo,
        trigger: 'blur',
        required: true
      }
    ],
    adminFlag: [
      {
        validator: this.validateAdminFlag,
        trigger: 'blur',
        required: true
      }
    ],
    validFlag: [
      {
        validator: this.validateValidFlag,
        trigger: 'blur',
        required: true
      }
    ],
    loginPwdCur: [
      {
        validator: this.validateLoginPwd,
        trigger: 'blur',
        required: true
      }
    ],
    loginPwdRepeat: [
      {
        validator: this.validateLoginPwdRepeat,
        trigger: 'blur',
        required: true
      }
    ]
  };

  private onGoBack() {
    this.$router.go(-1)
  }

  private submitHandle() {
    (this.$refs.userForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        let dataList:any = [
          {
            companyId: null,
            adminFlag: 0
          }
        ]
        if (this.userForm.dataPermissionScopeCur && this.userForm.dataPermissionScopeCur.length > 0) {
          dataList = []
          this.userForm.dataPermissionScopeCur.forEach((item:any) => {
            const obj = {
              companyId: item[item.length - 1],
              adminFlag: 0
            }
            dataList.push(obj)
          })
        }
        this.userForm.dataPermissionScope = dataList
        const loginPwd = cloneDeep(this.userForm.loginPwdCur)
        this.userForm.loginPwd = md5(loginPwd)
        await createUser(this.userForm)
          .then((res: any) => {
            if (res.code === '0') {
              this.$message.success('操作成功')
            }
            this.$router.go(-1)
          })
      } else {
        return false
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.create-components {
  padding: 10px;
  height: 100%;
  .content {
    padding: 10px;
    background: #fff;
    width: 100%;
    // height: 100%;
    margin: 0 auto;
    .title{
      border-left: 4px solid #157fdf;
      line-height: 40px;
      font-size: 16px;
      text-indent: 10px;
      margin: -10px 0 0 -10px;
      color: #1890ff;
    }
  }
  .el-form{
    width: 800px;
  }
  .el-form-item{
    margin-bottom: 20px;
  }
  .splitLine{
    border-top: 4px solid #f2f2f2;
    margin: 0 -10px 10px -10px;
  }
  .submit {
    width: 800px;
    display: flex;
    justify-content: center;
  }
  .el-cascader--medium{
    width: 100%;
  }
}
</style>
