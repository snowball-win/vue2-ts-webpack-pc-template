// 机构管理
<template>
  <div class="organization-list">
    <div class="operate-button">
      <router-link
        :to="'/organization/create/?companyId=' + dataTreeCurId"
        class="link-type"
      >
        <el-button type="primary" style="margin-right: 10px">新建</el-button>
      </router-link>
      <!-- <el-button type="primary" style="margin-right: 10px">导出</el-button> -->
      <el-button type="primary" @click="setCompanyOperate">置为无效</el-button>
    </div>
    <div class="content">
      <div class="content_left">
        <div class="filter-container">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText"/>
        </div>

        <el-tree
          class="filter-tree"
          :data="dataTree"
          :props="defaultProps"
          default-expand-all
          @node-click="onTreeNodeClick"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          ref="tree"
        >
        </el-tree>
      </div>
      <div class="content_right">
        <!-- 搜索 -->
        <div class="filter-container">
          <el-input
            v-model="listQuery.unifiedSocialCreditCode"
            :placeholder="'社会统一信用代码'"
            style="width: 200px; margin-right: 10px"
            class="filter-item"
          />
          <el-input
            v-model="listQuery.companyName"
            :placeholder="'企业名称'"
            style="width: 200px; margin-right: 10px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-select
            v-model="listQuery.companyType"
            style="width: 200px; margin-right: 10px"
            class="filter-item"
            @change="handleFilter"
            :placeholder="'请选择企业类型'"
          >
            <el-option
              v-for="item in optionsCompanyType"
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
            <el-table-column
              type="selection"
              align="center"
            />

            <el-table-column
              width="200px"
              align="center"
              label="社会统一信用代码"
            >
              <template slot-scope="{row}">
                <span>{{ row.unifiedSocialCreditCode }}</span>
              </template>
            </el-table-column>

            <el-table-column width="300px" align="center" label="企业名称">
              <template slot-scope="{row}">
                <span>{{ row.companyName }}</span>
              </template>
            </el-table-column>

            <el-table-column min-width="150px" label="所属区域" prop="areaName" align="center"/>

            <el-table-column
              width="250px"
              label="登记机关"
              prop="registrationAuthority"
              align="center"
            />

            <el-table-column min-width="150px" label="企业管理员" align="center">
              <template slot-scope="{row}">
                <span>{{ row.adminList[0] && row.adminList[0].adminName }}</span>
              </template>
            </el-table-column>

            <el-table-column min-width="150px" label="联系电话" align="center">
              <template slot-scope="{row}">
                <span>{{ row.adminList[0] && row.adminList[0].phoneNo }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="150px" label="是否有效" align="center">
              <template slot-scope="{row}">
                <span v-if="row.companyStatus===0">否</span>
                <span v-if="row.companyStatus===1">是</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="操作"
              width="350"
              fixed="right"
            >
              <template slot-scope="{row}">
                <router-link :to="'/organization/create/?type=detail&companyId='+row.companyId">
                  <el-button
                    type="primary"
                    size="small"
                    style="margin-right: 10px"
                  >
                    详情
                  </el-button>
                </router-link>
                <router-link :to="'/organization/edit/?type=edit&companyId='+row.companyId">
                  <el-button
                    type="primary"
                    size="small"
                    style="margin-right: 10px"
                  >
                    编辑
                  </el-button>
                </router-link>
                <router-link :to="'/organization/staff/list/?companyId='+row.companyId +'&adminFlag=' + dataTreeCurAdminFlag">
                  <el-button
                    type="primary"
                    size="small"
                    style="margin-right: 10px"
                  >
                    员工管理
                  </el-button>
                </router-link>
                <el-button type="primary" size="small" @click="delCompany(row)">
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
          :size.sync="listQuery.size"
          @pagination="getList(curCompanyId)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getCompanyId } from '@/utils/cookies'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getChildCompany, getCompanyTree, delCompany, companyOperate } from '@/api/organization'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'ArticleList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private total = 0;
  private list = [];
  private multipleSelection = [];
  private listLoading = true;
  private listQuery:any = {
    page: 1,
    size: 20,
    unifiedSocialCreditCode: '',
    companyName: '',
    parentCompanyId: ''
  };

  private optionsCompanyType = [
    {
      key: 1,
      label: '全部'
    },
    {
      key: 2,
      label: '个头工商户'
    },
    {
      key: 3,
      label: '有限责任公司（自然人投资或控股）'
    }
  ];

  private filterText = '';

  @Watch('filterText')
  private onFilterTextChanged(val: any) {
    // console.log('255', val)
    // this.$refs.tree.filter(val); /这里按照下面的方式写，否则编译器会有报错
    (this.$refs.tree as Vue & { filter: (val: any) => any }).filter(val)
  }

  private dataTree = [{}];

  private dataTreeRootId = '';
  private dataTreeCurId = '';

  private defaultProps = {
    label: 'companyName',
    value: 'companyId',
    children: 'child'
  };

  created() {
    this.getCompanyTree() // 获取机构树
  }

  // 过滤树节点
  private filterNode(value: any, data: any) {
    if (!value) return true
    return data.companyName.indexOf(value) !== -1
  }

  // 点击树节点
  private curCompanyId = ''
  private dataTreeCurAdminFlag = ''
  private onTreeNodeClick(treeNode: any) {
    console.log('251treeNode', treeNode)
    this.curCompanyId = treeNode.companyId
    this.getList(treeNode.companyId)
    this.dataTreeCurId = treeNode.companyId
    this.dataTreeCurAdminFlag = treeNode.adminFlag
  }

  // 按照机构ID获取下级机构信息
  private async getList(id = this.dataTreeRootId) {
    this.listLoading = true
    this.listQuery.parentCompanyId = id || ''
    const { payload } = await getChildCompany(this.listQuery).finally(() => {
      this.listLoading = false
    })
    this.list = payload.list
    this.total = payload.totalCount
  }

  // 获取机构树
  private async getCompanyTree() {
    this.listLoading = true
    this.listQuery.parentCompanyId = getCompanyId() || ''
    const { payload } = await getCompanyTree({}).finally(() => {
      this.listLoading = false
    })
    this.dataTree = payload.companyTreeList
    this.dataTreeRootId = payload.companyTreeList[0].companyId
    this.dataTreeCurId = payload.companyTreeList[0].companyId
    this.curCompanyId = payload.companyTreeList[0].companyId
    this.getList(payload.companyTreeList[0].companyId)
    this.dataTreeCurAdminFlag = payload.companyTreeList[0].adminFlag
  }

  // 删除机构
  private async delCompany(row:any) {
    this.$confirm('此操作将删除机构, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.listLoading = true
      const params = { companyIdList: [row.companyId] }
      delCompany(params).then(() => {
        this.getCompanyTree()
        this.$message.success('删除成功')
      }).finally(() => {
        this.listLoading = false
      })
    })
  }

  // 置为无效
  private async setCompanyOperate() {
    this.$confirm('此操作将机构设置为无效, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const params:any = {
        operateType: '2', // 1有效2无效
        companyIdList: []
      }
      this.multipleSelection.forEach((item:any) => {
        params.companyIdList.push(item.companyId)
      })
      companyOperate(params).then(() => {
        this.getCompanyTree()
        this.$message.success('设置成功')
      })
    })
  }

  // 表格多选
  private handleSelectionChange(value: any) {
    console.log('310', value)
    this.multipleSelection = value
  }

  private async handleFilter() {
    this.listQuery.page = 1
    this.getCompanyTree()
  }

  private async handleCreate() {
    this.listQuery = {
      page: 1,
      size: 20
    }
    this.getCompanyTree()
  }
}
</script>

<style lang="scss" scoped>
.organization-list {
  padding: 10px;
  .content {
    display: flex;
    .content_left {
      background: #fff;
      width: 300px;
      margin-right: 10px;
    }
    .content_right {
      flex: 1;
      overflow: hidden;
    }
    .filter-container{
      background: #fff;
      padding: 10px 10px 0 10px;
      margin-bottom: 10px;
    }

    .filter-container .filter-item{
      margin-bottom: 10px;
    }
  }

  .operate-button {
    margin-bottom: 10px;
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
<style lang="scss">
.organization-list{
  .el-table{
    font-size: 14px!important;
    min-height: 300px;
  }
}
</style>
