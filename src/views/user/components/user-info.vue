<template>
  <div class="userInfo">
    <div class="content">
      <el-form
        ref="userForm"
        :model="userForm"
        :rules="userRules"
        label-position="right"
      >
        <el-form-item prop="name" label="姓名" label-width="120px">
          <el-input
            v-model="userForm.name"
            placeholder="请输入姓名"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="phone" label="手机号" label-width="120px">
          <el-input
            v-model="userForm.phone"
            placeholder="请输入手机号"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="phone" label="验证码" label-width="120px">
          <el-input
            v-model="userForm.phone"
            placeholder="请输入验证码"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="phone" label="是否为管理员" label-width="120px">
          <el-input
            v-model="userForm.phone"
            placeholder="请选择"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="phone" label="是否有效" label-width="120px">
          <el-input
            v-model="userForm.phone"
            placeholder="请选择"
            type="text"
          />
        </el-form-item>
        <el-form-item label="所属部门" label-width="120px">
          <el-input
            v-model="userForm.phone"
            placeholder="请选择"
            type="text"
          />
        </el-form-item>
        <el-form-item label="职务" label-width="120px">
          <el-input
            v-model="userForm.phone"
            placeholder="请选择"
            type="text"
          />
        </el-form-item>
        <el-form-item label="出生日期" label-width="120px">
          <el-input
            v-model="userForm.phone"
            placeholder="请选择"
            type="text"
          />
        </el-form-item>
        <el-form-item label="性别" label-width="120px">
          <el-input
            v-model="userForm.phone"
            placeholder="请选择"
            type="text"
          />
        </el-form-item>
      </el-form>
      <div class="submit">
        <el-button type="primary" @click="submitHandle">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { isValidUsername, isValidPhone } from '@/utils/validate'
import { companyUsers } from '@/api/users'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'userInfo'
})

export default class extends Vue {
  mounted() {
    console.log('94', UserModule.companyId)
  }

  private validateName = (rule: any, value: string, callback: Function) => {
    if (!isValidUsername(value)) {
      callback(new Error('请输入用户名'))
    } else {
      callback()
    }
  }

  private validatePhone = (rule: any, value: string, callback: Function) => {
    if (!isValidPhone(value)) {
      callback(new Error('请输入手机号'))
    } else {
      callback()
    }
  }

  private userForm = {
    name: 'admin',
    phone: ''
  }

  private userRules = {
    name: [
      {
        validator: this.validateName,
        trigger: 'blur',
        required: true
      }
    ],
    phone: [
      {
        validator: this.validatePhone,
        trigger: 'blur',
        required: true
      }
    ]
  }

  private submitHandle() {
    (this.$refs.userForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        console.log('58success')
        const params = {
          companyId: UserModule.companyId
        }
        const { data } = await companyUsers(params).finally()
      } else {
        return false
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.userInfo{
  .content{
    width: 500px;
    margin: 0 auto;
  }
  .el-form-item{
    margin-bottom: 20px;
  }
  .submit{
    button{
      margin: 0 auto;
      display: block;
    }
  }
}
</style>
