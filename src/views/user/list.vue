// 用户管理-用户查询
<template>
  <div class="query-user-container">
    <!-- button -->
    <div class="operate-button">
      <router-link :to="'/user/create/?companyId=' + defaultCompanyId" class="link-type">
        <el-button v-if="adminFlag==='1'" type="primary" style="margin-right: 10px">新建</el-button>
      </router-link>
      <!-- <el-button type="primary">导出</el-button> -->
      <el-button type="primary" @click="setResetPwd">重置密码</el-button>
      <el-button type="primary" @click="setUserOperate">置为无效</el-button>
    </div>
    <!-- 搜索 -->
    <div class="filter-container">
      <el-input
        clearable
        v-model="listQuery.realName"
        :placeholder="'请输入姓名'"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
      />
      <el-input
        clearable
        v-model="listQuery.phoneNo"
        :placeholder="'请输入手机号'"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
      />
      <el-select
        clearable
        v-model="listQuery.accountStatus"
        style="width: 180px; margin-right: 10px"
        class="filter-item"
        :placeholder="'请选择有效状态'"
      >
        <el-option
          v-for="item in optionsAccountStatus"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        重置
      </el-button>
    </div>
    <!-- table -->
    <div class="table-container">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" />

        <el-table-column
          width="150px"
          align="center"
          label="姓名"
          prop="realName"
        />

        <el-table-column
          width="150px"
          align="center"
          label="手机号"
          prop="phoneNo"
        />

        <el-table-column width="80px" label="性别" prop="gender" align="center">
          <template slot-scope="{row}">
            <span v-if="row.gender === 0">女</span>
            <span v-else-if="row.gender === 1">男</span>
            <span v-else>保密</span>
          </template>
        </el-table-column>
        <el-table-column width="120px" label="出生日期" prop="birthday" align="center"/>
        <el-table-column width="180px" label="身份证号" prop="identityNumber" align="center"/>

        <el-table-column
          width="120px"
          align="center"
          label="用户名"
          prop="loginName"
        />

        <el-table-column min-width="100px" label="是否有效" align="center">
          <template slot-scope="{row}">
            <span v-if="row.accountStatus === 1">是</span>
            <span v-else-if="row.accountStatus === 0">否</span>
            <span v-else></span>
          </template>
        </el-table-column>

        <el-table-column
          min-width="200px"
          label="最后登录时间"
          prop="lastLoginTime"
          align="center"
        />
        <el-table-column align="center" label="操作" width="350" fixed="right">
          <template slot-scope="{row}">
            <router-link :to="'/user/user-relation-company?userId='+row.userId">
              <el-button
                type="primary"
                size="small"
                style="margin-right: 10px"
              >
                企业信息
              </el-button>
            </router-link>
            <router-link :to="'/user/edit?type=detail&userId='+row.userId">
              <el-button
                type="primary"
                size="small"
                style="margin-right: 10px"
              >
                详情
              </el-button>
            </router-link>
            <router-link :to="'/user/edit?type=edit&userId='+row.userId">
              <el-button
                type="primary"
                size="small"
                style="margin-right: 10px"
              >
                编辑
              </el-button>
            </router-link>
            <el-button type="primary" size="small" @click="deleteUser(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { platformUsers, delUser, userOperate, resetPwd } from '@/api/users'
import Pagination from '@/components/Pagination/index.vue'
import { UserModule } from '@/store/modules/user'
import { getAdminFlag } from '@/utils/cookies'
@Component({
  name: 'user-staff',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private adminFlag = getAdminFlag(); // 管理员可新建用户
  private total = 0;
  private list = [];
  private multipleSelection = [];
  private listLoading = false;
  private listQuery = {
    page: 1,
    size: 20,
    realName: '',
    phoneNo: '',
    accountStatus: ''
    // companyId: UserModule.companyId
  };

  private defaultCompanyId = UserModule.companyId

  private optionsAccountStatus = [
    {
      key: 0,
      label: '是'
    },
    {
      key: 1,
      label: '否'
    }
  ];

  created() {
    this.getList()
  }

  private async getList() {
    this.listLoading = true
    await platformUsers(this.listQuery)
      .then((res) => {
        this.list = res.payload.list
        this.total = res.payload.totalCount
      })
      .finally(() => {
        this.listLoading = false
      })
  }

  private handleSelectionChange(value: any) {
    console.log(value)
    this.multipleSelection = value
  }

  // 查询
  private async handleFilter() {
    this.listQuery.page = 1
    this.getList()
  }

  // 置为无效
  private setUserOperate() {
    if (this.multipleSelection.length === 0) {
      this.$message.warning('请选择')
      return
    }
    this.$confirm('确定将选中用户置为无效吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const params:any = {
        companyId: this.$route.query.companyId,
        operateType: '2',
        userIdList: []
      }
      this.multipleSelection.forEach((item:any) => {
        params.userIdList.push(item.userId)
      })
      userOperate(params).then((res) => {
        if (res.code === '0') {
          this.$message.success('设置成功')
          this.getList()
        }
      })
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消'
      })
    })
  }

  // 置为无效
  private setResetPwd() {
    if (this.multipleSelection.length === 0) {
      this.$message.warning('请选择')
      return
    }
    this.$confirm('确定将选中用户重置密码吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const params:any = {
        companyId: this.$route.query.companyId,
        operateType: '2',
        userIdList: []
      }
      this.multipleSelection.forEach((item:any) => {
        params.userIdList.push(item.userId)
      })
      resetPwd(params).then((res) => {
        if (res.code === '0') {
          this.$message.success('设置成功')
          this.getList()
        }
      })
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消'
      })
    })
  }

  // 删除
  private async deleteUser(row:any) {
    this.$confirm('确定删除该用户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const params:any = {
        userIdList: [row.userId]
      }
      delUser(params).then((res: any) => {
        if (res.code === '0') {
          this.$message.success('删除成功')
          this.getList()
        }
      })
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
  }

  private async handleCreate() {
    console.log('重置')
    this.listQuery.realName = ''
    this.listQuery.phoneNo = ''
    this.listQuery.accountStatus = ''
  }
}
</script>

<style lang="scss" scoped>
.query-user-container {
  padding: 10px;
  .operate-button {
    margin-bottom: 10px;
  }

  .filter-container{
    background: #fff;
    padding: 10px;
    margin-bottom: 10px;
  }

  .filter-container .filter-item{
    margin-bottom: 0;
  }

  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  .table-container{
    background: #fff;
    padding: 10px;
  }
}
</style>
