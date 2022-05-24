// 新建管理机构
<template>
  <div class="create-components">
    <div class="content">
      <el-form
        ref="userForm"
        :model="userForm"
        :rules="userRules"
        label-position="right"
        label-width="300px"
      >
        <div class="title">基础信息</div>
        <el-form-item prop="loginName" label="用户名">
          <el-input
            v-model="userForm.loginName"
            placeholder="请输入登录名"
            type="text"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item prop="realName" label="姓名">
          <el-input
            v-model="userForm.realName"
            placeholder="请输入姓名"
            type="text"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item prop="phoneNo" label="手机号">
          <el-input
            v-model="userForm.phoneNo"
            placeholder="请输入手机号码"
            type="text"
            :disabled="disabled"
            @blur="checkEqualPhone"
          />
        </el-form-item>
        <el-form-item prop="verifyCode" :style="{width: '100%'}" label="验证码" v-if="($route.query.type==='edit') && isEqualPhone">
          <el-input
            v-model="userForm.verifyCode"
            placeholder="验证码"
            type="text"
            :style="{width: '300px', 'margin-right': '5px'}"
            :disabled="disabled"
          />
          <el-button :disabled="captchaCountdown<60" class="phoneCodeBtn"  type="primary" size="mini" @click="getCodeHandle">验证码
            <span v-if="captchaCountdown<60">{{ captchaCountdown + 's'}}</span>
          </el-button>
        </el-form-item>
        <el-form-item prop="identityNo" label="身份证号">
          <el-input
            v-model="userForm.identityNo"
            placeholder="请输入身份证号"
            type="text"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item prop="validFlag" label="是否有效">
          <el-select
            v-model="userForm.validFlag"
            placeholder="请选择"
            style="width: 100%"
            :disabled="disabled"
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
        <el-form-item label="数据范围">
          <el-cascader
            v-model="userForm.dataPermissionScopeCur"
            :options="dataPermissionScopeOptions"
            :props="dataPermissionScopeProps"
            :show-all-levels="false"
            :disabled="disabled"
            style="width: 100%"
            clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            v-model="userForm.birthday"
            style="width: 100%"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="userForm.gender">
            <el-radio-button :disabled="disabled" label="1">男</el-radio-button>
            <el-radio-button :disabled="disabled" label="0">女</el-radio-button>
            <el-radio-button :disabled="disabled" label="2">保密</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="splitLine"></div>
      <div class="submit">
        <el-button type="primary" @click="goBack">返回</el-button>
        <el-button type="primary" @click="submitHandle" v-if="$route.query.type==='edit'">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { isValidUsername, isValidPhone, isValidVoid } from '@/utils/validate'
import { userDetail, sendSmsCode, editUser } from '@/api/users'
import { cloneDeep } from 'lodash'

@Component({
  name: 'create-components'
})
export default class extends Vue {
  created() {
    this.getUserDetail() // 获取用户详情
  }

  private disabled = this.$route.query.type === 'detail'

  private userId = this.$route.query.userId

  private validateName = (rule: any, value: string, callback: Function) => {
    if (!isValidUsername(value)) {
      callback(new Error('请输入姓名'))
    } else {
      callback()
    }
  };

  private isEqualPhone = false
  private checkEqualPhone() {
    if (this.userForm.phoneNoCur !== this.userForm.phoneNo) {
      this.isEqualPhone = true
    }
  }

  private validatePhone = (rule: any, value: string, callback: Function) => {
    if (!isValidPhone(value)) {
      callback(new Error('请输入手机号'))
    } else {
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

  private validateIdentityNo = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      callback(new Error('请输入正确身份证号码'))
    } else {
      callback()
    }
  };

  private userForm:any = {
    userId: this.userId, // 用户id
    realName: '', // 姓名
    identityNo: '', // idcard
    phoneNo: '', // 手机号
    phoneNoCur: '', // 手机号
    verifyCode: '', // 验证码
    adminFlag: '', // 是否为管理员
    validFlag: '', // 是否有效
    dataPermissionScopeCur: [],
    dataPermissionScope: [
      {
        companyId: null,
        adminFlag: 0
      }
    ],
    department: '', // 部门
    jobTitle: '', // 职务
    birthday: '', // 生日
    gender: '', // 性别
    loginName: '' // 登录名
  };

  private dataPermissionScopeProps = {
    multiple: true,
    value: 'companyId',
    label: 'companyName',
    children: 'child',
    checkStrictly: 'true'
  }

  private dataPermissionScopeOptions:any = []

  // 递归去掉空的child--多维数组不能使用push方法
  private recursionTreeDataShowArr:any[] = []
  private recursionTreeData(data:any, index = 0, pid:string) {
    data.forEach((item:any) => {
      if (index === 0) {
        item.pid = item.companyId + '-'
      }
      item.pid = pid + item.companyId + '-'
      this.recursionTreeDataShowArr.push([]) // 解决多为数组不能使用push方法
      if (item.permission === 1) {
        const cpid = item.pid.split('-')
        cpid.pop()
        this.recursionTreeDataShowArr[index].push(cpid)
      }
      if (item.child && item.child.length > 0) {
        this.recursionTreeData(item.child, index += 1, item.pid)
      } else {
        delete item.child
      }
    })
  }

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
    validFlag: [
      {
        validator: this.validateValidFlag,
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
    ]
  };

  private async getUserDetail() {
    const params = { userId: this.userId }
    await userDetail(params)
      .then((res: any) => {
        if (res.code === '0') {
          const data = res.payload
          const dataScope = res.payload.dataPermissionScope
          this.recursionTreeData(dataScope, 0, '')
          this.dataPermissionScopeOptions = dataScope
          this.userForm.realName = data.realName
          this.userForm.phoneNo = data.phoneNo
          this.userForm.identityNo = data.identityNo
          this.userForm.phoneNoCur = data.phoneNo
          this.userForm.gender = data.gender + ''
          this.userForm.validFlag = data.validFlag
          this.userForm.birthday = data.birthday
          this.userForm.loginName = data.loginName
          this.recursionTreeDataShowArrCalc(this.recursionTreeDataShowArr)
          this.userForm.dataPermissionScopeCur = this.recursionTreeDataShowArrCalcArr
        }
      })
  }

  // 去掉空数组-数据成功回显
  private recursionTreeDataShowArrCalcArr:any[] = []
  private recursionTreeDataShowArrCalc(data:any) {
    data.forEach((item:any) => {
      if (item.length > 0) {
        item.forEach((item2:any) => {
          this.recursionTreeDataShowArrCalcArr.push(item2)
        })
      }
    })
  }

  // 获取验证码&倒计时
  private captchaCountdown = 60;
  private async getCodeHandle() {
    if (!this.userForm.phoneNo) {
      this.$notify.warning('请输入手机号')
      return false
    }
    const params = {
      phoneNo: this.userForm.phoneNo,
      operateType: 3
    }
    await sendSmsCode(params)
      .then((res) => {
        if (res.code === '0') {
          const timer = setInterval(() => {
            this.captchaCountdown -= 1
            if (this.captchaCountdown === 1) {
              this.captchaCountdown = 60
              clearInterval(timer)
            }
          }, 1000)
        }
      })
  }

  private goBack() {
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
        const params = cloneDeep(this.userForm)
        params.dataPermissionScope = dataList
        delete params.dataPermissionScopeCur
        await editUser(params)
          .then((res: any) => {
            if (res.code === '0') {
              this.goBack()
              this.$message.success('操作成功')
            }
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
    height: 100%;
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
    width: auto;
    margin-right: 200px;
  }
  .el-form-item{
    width: 600px;
    margin-bottom: 20px;
  }
  .submit {
    // width: 500px;
    display: flex;
    justify-content: center;
  }
  .el-cascader--medium{
    width: 100%;
  }
  .splitLine{
    border-top: 4px solid #f2f2f2;
    margin: 0 -10px 10px -10px;
  }
}
</style>
