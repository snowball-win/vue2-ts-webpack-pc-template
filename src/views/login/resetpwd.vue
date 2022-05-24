<template>
  <Content class="reset-pwd-content-wrap">
    <ContentItem :style="{marginBottom: '5px', overflow: 'visible'}">
      <span>首页 </span>
      <span>> </span>
      <span style="color: #1890ff;">修改密码</span>
    </ContentItem>
    <ContentItem :style="{marginBottom: '5px', height: '100%', overflow: 'visible'}">
      <div class="reset-pwd">
        <div class="reset-pwd-content">
          <!-- <h3 class="title">首次登录重置密码</h3> -->
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
                  <el-button :disabled="captchaCountdown<60" class="phoneCodeBtn" type="text" @click="getCodeHandle"
                    >获取验证码 <span v-if="captchaCountdown<60">{{ captchaCountdown + 's'}} </span></el-button
                  >
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="输入新密码" prop="confirmPwdCur" style="margin-bottom:20px;">
              <el-input autocomplete="new-password" v-model="resetForm.confirmPwdCur" type="password"></el-input>
              <div class="hint">至少6位英文字母、数字的组合，不包含特殊字符。</div>
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmPwdRepeat" style="margin-bottom:20px;">
              <el-input autocomplete="new-password" v-model="resetForm.confirmPwdRepeat" type="password"></el-input>
              <div class="hint">确保两次输入的密码保持一致。</div>
            </el-form-item>
          </el-form>
          <div class="reset-pwd_submit">
            <!-- <el-button @click="handleClose">取消</el-button> -->
            <div @click="onSubmit">提交</div>
          </div>
        </div>
        <select-company ref="selectCompany"></select-company>
      </div>
    </ContentItem>
    <ContentItem :style="{textAlign: 'center' ,overflow: 'visible'}">
      <span>Copyright @ www.rxcsta.com,All Rights Reserved.</span>
    </ContentItem>
  </Content>
</template>

<script lang="ts">
import selectCompany from './components/select-company.vue'
import { Component, Vue } from 'vue-property-decorator'
import { sendSmsCode, firstResetPwd } from '@/api/users'
import { UserModule } from '@/store/modules/user'
import { Dictionary } from 'vue-router/types/router'
import { isValidVoid } from '@/utils/validate'
import { Form as ElForm } from 'element-ui'
import Content from '@/components/Content/index.vue'
import ContentItem from '@/components/ContentItem/index.vue'
import md5 from 'js-md5'

@Component({
  name: 'firstLoginResetPWD',
  components: {
    selectCompany,
    Content,
    ContentItem
  }
})

export default class extends Vue {
  created() {
    this.getCodeHandle()
    console.log('57', UserModule)
  }

  private loginType = this.$route.query.loginType
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

  private handleClose() {
    const refs: any = this.$refs.resetForm
    refs.resetFields()
    this.$router.go(-1)
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
                (this.$refs.selectCompany as any).showDialog()
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
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.reset-pwd {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .reset-pwd-content{
    margin-top: -150px;
    width: 362px;
    .title{
      text-align: center;
      padding: 30px 0;
    }
  }
  .phoneCodeBtn{
    margin-left: 20px;
  }
  .reset-pwd_submit {
    text-align: center;
    div{
      width: 242px;
      height: 32px;
      background: #1890ff;
      margin-left: 120px;
      line-height: 32px;
      color: #fff;
      border-radius: 3px;
      cursor: pointer;
    }
  }
  .el-form-item{
    position: relative;
    .hint{
      position: absolute;
      width: 330px;
      left: 260px;
      top: 0;
    }
  }
}
</style>
<style lang="scss">
.reset-pwd-content-wrap{
  padding: 0!important;
  background: #f2f2f2!important;
}
</style>
