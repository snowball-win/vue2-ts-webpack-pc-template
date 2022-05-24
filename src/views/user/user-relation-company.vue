// 用户管理-根据用户ID获取关联的机构信息
<template>
  <div class="user-relation-company">
    <!-- button -->
    <div class="operate-button">
      <router-link :to="'/user/create/'" class="link-type">
        <el-button type="primary" style="margin-right: 10px">新建</el-button>
      </router-link>
      <!-- <el-button type="primary">导出</el-button> -->
      <el-button type="primary">置为无效</el-button>
    </div>
    <!-- 搜索 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.areaName"
        :placeholder="'请输入姓名'"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.title"
        :placeholder="'请输入手机号'"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.sort"
        style="width: 180px; margin-right: 10px"
        class="filter-item"
        :placeholder="'请选择有效状态'"
        @change="handleFilter"
      >
        <el-option
          v-for="item in avalidFlagOptions"
          :key="item.key"
          :label="item.label"
          :value="item.label"
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
          min-width="180px"
          align="center"
          label="机构名称"
          prop="companyName"
        />

        <el-table-column
          min-width="180px"
          align="center"
          label="统一社会信用代码"
          prop="unifiedSocialCreditCode"
        />

        <el-table-column min-width="105px" label="所属区域" prop="areaName" align="center"/>
        <el-table-column min-width="105px" label="登记机关" prop="registrationAuthority" align="center"/>
        <el-table-column min-width="105px" label="上级机构ID" prop="parentCompanyId" align="center"/>
        <el-table-column min-width="105px" label="上级机构名称" prop="parentCompanyName" align="center"/>

        <el-table-column min-width="100px" label="是否为管理员" align="center">
          <template slot-scope="{row}">
            <span v-if="row.adminFlag === 1">是</span>
            <span v-else-if="row.adminFlag === 0">否</span>
            <span v-else></span>
          </template>
        </el-table-column>

        <el-table-column min-width="100px" label="是否有效" align="center">
          <template slot-scope="{row}">
            <span v-if="row.validFlag === 1">是</span>
            <span v-else-if="row.validFlag === 0">否</span>
            <span v-else></span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="350" fixed="right">
          <template slot-scope="{row}">
            <router-link :to="'/organization/create?type=detail&companyId='+row.companyId">
              <el-button
                type="primary"
                size="small"
                style="margin-right: 10px"
              >
                企业详情
              </el-button>
            </router-link>
            <router-link :to="'/organization/create?type=edit&companyId='+row.companyId">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit"
                style="margin-right: 10px"
              >
                编辑
              </el-button>
            </router-link>
            <router-link :to="'/organization/staff/edit'">
              <el-button type="primary" size="small" icon="el-icon-edit">
                删除
              </el-button>
            </router-link>
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
import { getUserRelationCompany } from '@/api/users'
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
    userId: this.$route.query.userId
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

  created() {
    this.getList()
  }

  private async getList() {
    this.listLoading = true
    const { payload } = await getUserRelationCompany(this.listQuery)
      .finally(() => {
        this.listLoading = false
      })
    this.list = payload.list
    this.total = payload.totalCount
    this.listLoading = false
  }

  private handleSelectionChange(value: any) {
    console.log(value)
    this.multipleSelection = value
  }

  private async handleFilter() {
    console.log('查询')
  }

  private async handleCreate() {
    console.log('重置')
  }
}
</script>

<style lang="scss" scoped>
.user-relation-company {
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
