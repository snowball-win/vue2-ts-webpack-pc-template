<template>
  <div class="select-company-comtainer">
    <el-dialog
      title="选择机构"
      :visible.sync="dialogVisible"
      width="50%"
      center
      :before-close="handleClose"
    >
      <div class="title">
        系统检测到您属于多家机构，为了保证数据安全和用户安全，请选择您当前要登录的机构，谢谢!
      </div>
      <div class="select-content">
        <el-form :model="resetForm" :rules="resetRules" border ref="resetForm">
          <el-form-item label="" prop="companyId">
            <el-select
              v-model="resetForm.companyId"
              style="width: 200px; margin-right: 10px"
              class="filter-item"
              :placeholder="'请选择机构'"
            >
              <el-option
                v-for="item in orderTypeOptions"
                :key="item.companyId"
                :label="item.companyName"
                :value="item.companyId"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="select-company-comtainer_submit">
        <el-button @click="handleClose">取消</el-button>
        <el-button @click="onSubmit" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'
import { Dictionary } from 'vue-router/types/router'
import { isValidVoid } from '@/utils/validate'
import { Form as ElForm } from 'element-ui'
import { changeCompany } from '@/api/users'

@Component({
  name: 'select-company'
})
// UserModule.userId
export default class extends Vue {
  private resetForm = {
    companyId: ''
  };

  private validateConfirmPwd = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      console.log('147')
      callback(new Error('请选择'))
    } else {
      callback()
    }
  };

  private resetRules = {
    companyId: [
      { required: true, validator: this.validateConfirmPwd, trigger: 'blur' }
    ]
  };

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

  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    }, {} as Dictionary<string>)
  }

  private dialogVisible = false;
  public showDialog() {
    this.orderTypeOptions = UserModule.companyList.companyList
    this.dialogVisible = true
  }

  private handleClose() {
    this.dialogVisible = false
  }

  private orderTypeOptions = []

  // 用户首次登录时强制重置密码
  private async onSubmit() {
    (this.$refs.resetForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        const params = { companyId: this.resetForm.companyId }
        await changeCompany(params)
          .then((res) => {
            if (res.code === '0') {
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
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.select-company-comtainer {
  .title{
    text-align: center;
  }
  .select-content{
    padding: 30px 0;
    display: flex;
    justify-content: center;
  }
  .reGetCode {
    cursor: pointer;
  }
  .select-company-comtainer_submit {
    text-align: center;
  }
}
</style>
