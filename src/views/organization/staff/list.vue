// 机构管理-员工管理
<template>
  <div class="organization-staff">
    <!-- button -->
    <div class="operate-button">
      <router-link :to="'/organization/staff/create/?companyId='+$route.query.companyId" class="link-type">
        <el-button type="primary" v-if="$route.query.adminFlag==='1'" style="margin-right: 10px">新建</el-button>
      </router-link>
      <el-button type="primary">导出</el-button>
      <el-button type="primary">重置密码</el-button>
      <el-button type="primary" @click="setUserOperate">置为无效</el-button>
    </div>
    <!-- 搜索 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.realName"
        :placeholder="'请输入姓名'"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.phoneNo"
        :placeholder="'请输入手机号'"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.accountStatus"
        style="width: 180px; margin-right: 10px"
        class="filter-item"
        :placeholder="'请选择有效状态'"
        @change="handleFilter"
      >
        <el-option
          v-for="item in optionsCompanyType"
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
          width="100px"
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

        <el-table-column width="250px" label="所属机构" prop="companyName" align="center"/>

        <el-table-column min-width="100px" label="是否为管理员" align="center">
          <template slot-scope="{row}">
            <span v-if="row.adminFlag === 1">是</span>
            <span v-else-if="row.adminFlag === 0">否</span>
            <span v-else></span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
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
            <router-link :to="'/organization/staff/edit?type=detail&userId=' + row.userId+'&companyId='+$route.query.companyId">
              <el-button
                type="primary"
                size="small"
                style="margin-right: 10px"
              >
                详情
              </el-button>
            </router-link>
            <router-link :to="'/organization/staff/edit?type=edit&userId=' + row.userId + '&companyId=' + $route.query.companyId">
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
import { companyUsers, delUser, userOperate } from '@/api/users'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'organization-staff',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private total = 0;
  private list = [];
  private multipleSelection = [];
  private listLoading = false;
  private listQuery = {
    page: 1,
    size: 20,
    companyId: this.$route.query.companyId
  };

  private optionsCompanyType = [
    {
      key: 0,
      label: '无效'
    },
    {
      key: 1,
      label: '有效'
    }
  ];

  created() {
    this.getList()
  }

  private async getList() {
    this.listLoading = true
    const { payload } = await companyUsers(this.listQuery)
    this.list = payload.list
    this.total = payload.totalCount
    this.listLoading = false
  }

  // 删除用户
  private deleteUser(row:any) {
    this.$confirm('确定删除选中用户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const params = {
        companyId: row.companyId,
        userIdList: [row.userId]
      }
      delUser(params).then((res) => {
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

  private handleSelectionChange(value: any) {
    console.log('255', value)
    this.multipleSelection = value
  }

  private async handleFilter() {
    this.listQuery.page = 1
    this.getList()
  }

  private async handleCreate() {
    console.log('重置')
  }
}
</script>

<style lang="scss" scoped>
.organization-staff {
  padding: 20px;
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

  .table-container{
    background: #fff;
    padding: 10px;
  }

  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
}
</style>
<style lang="scss">
.organization-staff{
  .el-table{
    min-height: 300px;
  }
}
</style>
