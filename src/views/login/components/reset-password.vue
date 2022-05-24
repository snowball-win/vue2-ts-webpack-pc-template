<template>
  <div class="reset-pwd">
    <el-dialog
      title="重置密码"
      :visible.sync="dialogVisible"
      width="550px"
      center
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form
        label-width="120px"
        :model="resetForm"
        :rules="resetRules"
        border
        ref="resetForm"
      >
        <!-- autocomplete="new-password"有效防止浏览器自动填充 -->
        <el-form-item label="验证码" prop="verifyCode" v-if="loginType !== 'phone'" style="margin-bottom:20px;">
          <el-row style="width:100%;">
            <el-col :span="12">
              <el-input autocomplete="new-password" v-model="resetForm.verifyCode"></el-input>
            </el-col>
            <el-col :span="12">
              <el-button class="phoneCodeBtn" type="text" @click="getCodeHandle"
                >获取验证码 <span v-if="captchaCountdown<60">{{ captchaCountdown + 's'}} </span></el-button
              >
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="输入新密码" prop="confirmPwdCur" style="margin-bottom:20px;">
          <el-input autocomplete="new-password" v-model="resetForm.confirmPwdCur" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPwdRepeat" style="margin-bottom:20px;">
          <el-input autocomplete="new-password" v-model="resetForm.confirmPwdRepeat" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div class="reset-pwd_submit">
        <el-button @click="handleClose">取消</el-button>
        <el-button @click="onSubmit" type="primary">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
// import openWindow from '@/utils/openWindow'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { sendSmsCode, firstResetPwd } from '@/api/users'
import { UserModule } from '@/store/modules/user'
import { Dictionary } from 'vue-router/types/router'
import { isValidVoid } from '@/utils/validate'
import { Form as ElForm } from 'element-ui'
import md5 from 'js-md5'

@Component({
  name: 'firstLoginResetPWD'
})
export default class extends Vue {
   @Prop({ default: 'phone' }) private loginType!: string
  private resetForm = {
    userId: '',
    verifyCode: '',
    confirmPwd: '',
    confirmPwdCur: '',
    confirmPwdRepeat: ''
  };

  private validateVerifyCode = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    console.log('145value', value)
    if (!isValidVoid(value)) {
      console.log('147')
      callback(new Error('请输入验证码'))
    } else {
      console.log('150')
      callback()
    }
  };

  private validateConfirmPwd = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    console.log('145value', value)
    if (!isValidVoid(value)) {
      console.log('147')
      callback(new Error('请输入密码'))
    } else {
      console.log('150')
      callback()
    }
  };

  private validateConfirmPwdRepeat = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      callback(new Error('请输入密码'))
    } else if (value !== this.resetForm.confirmPwdCur) {
      callback(new Error('请输入正确的密码'))
    } else {
      callback()
    }
  };

  private resetRules = {
    verifyCode: [{ required: true, validator: this.validateVerifyCode, trigger: 'blur' }],
    confirmPwdCur: [{ required: true, validator: this.validateConfirmPwd, trigger: 'blur' }],
    confirmPwdRepeat: [
      { required: true, validator: this.validateConfirmPwdRepeat, trigger: 'blur' }
    ]
  };

  private redirect?: string;
  private otherQuery: Dictionary<string> = {};
  private dialogVisible = false;
  // 打开弹窗
  public showDialog() {
    this.dialogVisible = true
    this.getCodeHandle()
  }

  private handleClose() {
    const refs: any = this.$refs.resetForm
    refs.resetFields()
    this.dialogVisible = false
  }

  // 获取验证码&倒计时
  private captchaCountdown = 60;
  private async getCodeHandle() {
    if (this.captchaCountdown < 60) {
      this.$notify.warning('正在获取验证码，请稍后再试')
      return false
    }
    if (this.loginType === 'phone') {
      return
    }
    const params = {
      phoneNo: UserModule.phoneNo,
      operateType: 2
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

  // 用户首次登录时强制重置密码
  private async onSubmit() {
    (this.$refs.resetForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.resetForm.confirmPwd = this.resetForm.confirmPwdCur
        this.resetForm.confirmPwd = md5(this.resetForm.confirmPwd)
        this.resetForm.userId = UserModule.userId
        const params = { userId: this.resetForm.userId, verifyCode: this.resetForm.verifyCode, confirmPwd: this.resetForm.confirmPwd }
        await firstResetPwd(params)
          .then((res) => {
            if (res.code === '0') {
              this.$store.commit('Login', res)
              // 如果是多家机构，那么先选择机构
              if (res.payload.selectFlag === 1) {
                this.$emit('showSelectCompany')
              } else {
                this.$router
                  .push({
                    path: this.redirect || '/',
                    query: this.otherQuery
                  })
                  .catch((err) => {
                    console.warn(err)
                  })
              }
            }
          })
          .finally(() => {
            // this.$router
            //   .push({
            //     path: this.redirect || '/',
            //     query: this.otherQuery
            //   })
            //   .catch((err) => {
            //     console.warn(err)
            //   })
          })
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.reset-pwd {
  .phoneCodeBtn{
    margin-left: 20px;
  }
  .reset-pwd_submit {
    text-align: center;
  }
}
</style>
