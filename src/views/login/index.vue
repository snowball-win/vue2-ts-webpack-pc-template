<template>
  <div class="login-container">
    <!-- <video
      poster="../../assets/images/login/video-cover.jpeg"
      loop
      autoplay
      muted
    >
      <source src="../../assets/images/login/night.mp4" />
    </video> -->
    <img class="loginbg" src="../../assets/images/login/loginbg.png" alt="login">
    <div class="login-form-wrap">
      <img class="loginFormBg1" src="../../assets/images/login/loginFormBg1.png" alt="login">
      <img class="loginFormBg2" src="../../assets/images/login/loginFormBg2.png" alt="login">
      <div class="login-form-content">
        <div class="title-container">
          <h3 class="title">
            <span
              @click="loginTypeHandle('phone')"
              :class="{titleActive: loginType === 'phone'}"
              >快捷登录</span
            >
            <span
              @click="loginTypeHandle('user')"
              :class="{titleActive: loginType === 'user'}"
              >账号登录</span
            >
          </h3>
        </div>
        <!-- 快捷登录 -->
        <el-form
          v-show="loginType === 'phone'"
          ref="loginPhoneForm"
          :model="loginPhoneForm"
          :rules="loginRules"
          class="login-form"
          label-position="left"
        >
          <el-form-item prop="phoneNumber">
            <span class="svg-container">
              <svg-icon name="user" />
            </span>
            <el-input
              ref="phoneNumber"
              v-model="loginPhoneForm.phoneNumber"
              placeholder="手机号码"
              name="phoneNumber"
              maxlength="11"
              tabindex="3"
            />
          </el-form-item>

          <el-form-item
            prop="phoneCode"
            class="phoneCode"
            v-if="loginType === 'phone'"
          >
            <span class="svg-container">
              <svg-icon name="password" />
            </span>
            <el-input
              ref="phoneCode"
              v-model="loginPhoneForm.phoneCode"
              placeholder="验证码"
              name="phoneCode"
              type="text"
              tabindex="4"
            />
            <el-button :disabled="captchaCountdown<60" class="phoneCodeBtn" @click="getCodeHandle"
              >获取验证码 <span v-if="captchaCountdown<60">{{ captchaCountdown + 's'}} </span></el-button
            >
          </el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            style="width: 100%;"
            size="medium"
            @click.native.prevent="handleLoginByPhone"
          >
            登录
          </el-button>
          <div style="position: relative"></div>
        </el-form>
        <!-- 账密登录 -->
        <el-form
          v-show="loginType === 'user'"
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          label-position="left"
        >
          <el-form-item prop="username" v-show="loginType === 'user'">
            <span class="svg-container">
              <svg-icon name="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              :placeholder="$t('login.username')"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="new-password"
            />
          </el-form-item>
          <el-tooltip
            v-show="loginType === 'user'"
            v-model="capsTooltip"
            content="Caps lock is On"
            placement="right"
            manual
          >
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon name="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                :placeholder="$t('login.password')"
                name="password"
                autocomplete="new-password"
                tabindex="2"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLoginByUser"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon
                  :name="passwordType === 'password' ? 'eye-off' : 'eye-on'"
                />
              </span>
            </el-form-item>
          </el-tooltip>
          <el-button
            :loading="loading"
            type="primary"
            style="width: 100%;"
            size="medium"
            @click.native.prevent="handleLoginByUser"
          >
            登录
          </el-button>
          <div style="position: relative"></div>
        </el-form>
      </div>
    </div>
    <!-- <resetPassword ref="resetPwd" @showSelectCompany="showSelectCompany" :login-type="loginType"></resetPassword> -->
    <select-company ref="selectCompany"></select-company>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'
import { Form as ElForm, Input } from 'element-ui'
import { isValidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect/index.vue'
import SocialSign from './components/SocialSignin.vue'
// import resetPassword from './components/reset-password.vue'
import selectCompany from './components/select-company.vue'
import {
  sendSmsCode,
  login,
  loginByCode
} from '@/api/users'
import md5 from 'js-md5'
import { cloneDeep } from 'lodash'

@Component({
  name: 'Login',
  components: {
    LangSelect,
    SocialSign,
    // resetPassword,
    selectCompany
  }
})
export default class extends Vue {
  private validateUsername = (rule: any, value: string, callback: Function) => {
    console.log('145value', value)
    if (!isValidUsername(value)) {
      console.log('147')
      callback(new Error('请输入用户名'))
    } else {
      console.log('150')
      callback()
    }
  };

  private validatePassword = (rule: any, value: string, callback: Function) => {
    if (value.length < 6) {
      callback(new Error('请输入密码'))
    } else {
      callback()
    }
  };

  private validatePhoneNumber = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    console.log('value.length:', value.length)
    if (value.length !== 11) {
      callback(new Error('请输入手机号码'))
    } else {
      callback()
    }
  };

  private loginType = 'phone';

  private loginForm = {
    username: '', // superAdmin
    password: '', // 662604
    phoneNumber: '',
    phoneCode: '',
    loginType: 'phone'
  };

  private loginPhoneForm = {
    phoneNumber: '',
    phoneCode: '',
    loginType: 'phone'
  };

  private loginRules = {
    username: [{ validator: this.validateUsername, trigger: 'blur' }],
    password: [{ validator: this.validatePassword, trigger: 'blur' }],
    phoneNumber: [{ validator: this.validatePhoneNumber, trigger: 'blur' }]
  };

  private passwordType = 'password';
  private loading = false;
  private showDialog = false;
  private capsTooltip = false;
  private redirect?: string;
  private otherQuery: Dictionary<string> = {};

  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    const query = route.query as Dictionary<string>
    if (query) {
      this.redirect = query.redirect
      this.otherQuery = this.getOtherQuery(query)
    }
  }

  mounted() {
    if (this.loginForm.username === '') {
      (this.$refs.username as Input).focus()
    } else if (this.loginForm.password === '') {
      (this.$refs.password as Input).focus()
    } else if (this.loginForm.phoneNumber === '') {
      (this.$refs.phoneNumber as Input).focus()
    }
  }

  // 登录类型
  private loginTypeHandle(type = 'phone') {
    this.loginType = type
    this.loginForm.loginType = type
  }

  private checkCapslock() {
    // const { key } = e
    // this.capsTooltip =
    //   key !== null && key.length === 1 && key >= 'A' && key <= 'Z'
  }

  private showPwd() {
    if (this.passwordType === 'password') {
      this.passwordType = ''
    } else {
      this.passwordType = 'password'
    }
    this.$nextTick(() => {
      (this.$refs.password as Input).focus()
    })
  }

  private captchaCountdown = 60;
  private async getCodeHandle() {
    if (this.captchaCountdown < 60) {
      this.$notify.warning('正在获取验证码，请稍后再试')
      return false
    }
    if (!this.loginPhoneForm.phoneNumber) {
      this.$notify.warning('请输入手机号')
      return false
    }
    const params = {
      phoneNo: this.loginPhoneForm.phoneNumber,
      operateType: 1
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

  private showSelectCompany() {
    (this.$refs.selectCompany as any).showDialog()
  }

  private handleLoginByUser() {
    (this.$refs.loginForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.loading = true
        const loginForm = cloneDeep(this.loginForm)
        loginForm.password = md5(loginForm.password)
        // const data: any = {}
        const params = {
          loginName: loginForm.username,
          loginPwd: loginForm.password
        }
        await login(params)
          .then((res) => {
            if (res.code === '0') {
              if (res.payload.firstLogin === 1) {
                this.$store.commit('Login', res)
                this.$router.push({
                  path: '/resetpwd',
                  query: {
                    loginType: this.loginType
                  }
                })
                return
              }
              if (res.payload.selectFlag === 1) {
                this.$store.commit('Login', res);
                (this.$refs.selectCompany as any).showDialog()
                return
              }
              this.$store.commit('Login', res)
              this.$router
                .push({
                  path: this.redirect || '/',
                  query: this.otherQuery
                })
                .catch((err) => {
                  console.warn(err)
                })
            }
          })
          .catch()
          .finally(() => {
            this.loading = false
          })
      } else {
        return false
      }
    })
  }

  private handleLoginByPhone() {
    (this.$refs.loginPhoneForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.loading = true
        const loginPhoneForm = cloneDeep(this.loginPhoneForm)
        const params = {
          phoneNo: loginPhoneForm.phoneNumber,
          verifyCode: loginPhoneForm.phoneCode
        }
        await loginByCode(params)
          .then((res) => {
            if (res.code === '0') {
              if (res.payload.firstLogin === 1) {
                this.$store.commit('Login', res)
                console.log('301')
                this.$router.push({
                  path: '/resetpwd',
                  query: {
                    loginType: this.loginType
                  }
                })
                return
              }
              if (res.payload.selectFlag === 1) {
                this.$store.commit('Login', res);
                (this.$refs.selectCompany as any).showDialog()
                return
              }
              this.$store.commit('Login', res)
              console.log('382')
              this.$router
                .push({
                  path: this.redirect || '/',
                  query: this.otherQuery
                })
                .catch((err) => {
                  console.warn(err)
                })
            }
          })
          .catch()
          .finally(() => {
            this.loading = false
          })
      } else {
        return false
      }
    })
  }

  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    }, {} as Dictionary<string>)
  }
}
</script>

<style lang="scss">
.login-container {
  .login-form-wrap{
    float: right;
    margin: 100px 200px 0 0;
    position: relative;
    width: 550px;
    height: 564px;
    .loginFormBg1{
      position: absolute;
      display: inline-block;
      width: 505px;
      height: 531px;
      top: 16.5px;
      left: 22.5px;
      z-index: -1;
    }
    .loginFormBg2{
      position: absolute;
      display: inline-block;
      width: 554px;
      height: 457px;
      top: 53.5px;
      left: 0;
      z-index: -2;
    }
    .login-form-content{
      width: 430px;
      height: 564px;
      background: #fff;
      border-radius: 10px;
      margin-left: 60px;
    }
  }
  .login-form {
    @supports (-webkit-mask: none) and (not (cater-color: #666)) {
      .login-container .el-input {
        input {
          color: #666;
        }
        input::first-line {
          color: #666;
        }
      }
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 100%;

      input {
        height: 47px;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: #666;
        caret-color: #666;
        -webkit-appearance: none;
        text-indent: 30px;
        ::-webkit-input-placeholder{
          text-indent: 30px;
        }
        &:-webkit-autofill {
          input:-internal-autofill-previewed,
          input:-internal-autofill-selected {
            // -webkit-text-fill-color: transparent !important;
            transition: background-color 5000s ease-in-out 0s !important;
          }
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 5px;
      color: #666;
      margin-bottom: 30px;
      .el-form-item__content{
        position: relative;
        .svg-container{
          position: absolute;
          z-index: 2;
        }
      }
    }
  }
  .el-form-item--small .el-form-item__error{
    text-indent: 45px;
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;

  .loginbg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -3;
  }

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
    .phoneCode {
      position: relative;
      .phoneCodeBtn {
        position: absolute;
        top: 7px;
        right: 6px;
      }
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #333;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    padding: 50px 0 85px 0;

    .title {
      font-size: 26px;
      color: #333;
      text-align: center;
      font-weight: bold;
      display: flex;
      justify-content: space-evenly;
      cursor: pointer;
    }

    .titleActive {
      color: #4f7edc;
    }
  }

  .login-form{
    padding: 0 20px;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: #333;
    cursor: pointer;
    user-select: none;
  }
}
</style>
