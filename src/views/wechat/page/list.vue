// 订单管理进货订单
<template>
  <Content>
    <ContentItem :style="{marginBottom: '10px', paddingBottom: '0'}">
      <div>
        <el-input
          v-model="listQuery.gzhName"
          :placeholder="'公众号名称'"
          style="width: 220px;margin-right:10px; margin-bottom:10px;"
          class="filter-item"
          clearable
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.pageName"
          :placeholder="'请输入页面名称'"
          style="width: 220px;margin-right:10px; margin-bottom:10px;"
          class="filter-item"
          clearable
          @keyup.enter.native="handleFilter"
        />
        <el-select
          v-model="listQuery.pageStatus"
          style="width: 220px;margin-right:10px; margin-bottom:10px;"
          class="filter-item"
          clearable
          :placeholder="'请选择有效状态'"
        >
          <el-option
            v-for="item in gzhStatusOption"
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
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-edit"
          @click="handleCreate"
        >
          重置
        </el-button>
      </div>

    </ContentItem>
    <ContentItem :flex="true">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        :style="{height: '100%'}"
      >
        <el-table-column
          type="selection"
          align="center"
        />

        <el-table-column
          width="180px"
          align="center"
          show-overflow-tooltip
          label="公众号名称"
        >
          <template slot-scope="{row}">
            <span>{{ row.gzhName }}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="200px"
          align="center"
          show-overflow-tooltip
          label="所属主体"
        >
          <template slot-scope="{row}">
            <span>{{ row.companyName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="150px"
          align="center"
          show-overflow-tooltip
          label="联系人姓名"
        >
          <template slot-scope="{row}">
            <span>{{ row.contactName }}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="center"
          label="页面名称"
        >
          <template slot-scope="{row}">
            <span>{{ row.pageName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="300px"
          show-overflow-tooltip
          align="center"
          label="页面地址"
        >
          <template slot-scope="{row}">
            <span>{{ row.pageUrl }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="105px"
          align="center"
          label="是否有效"
        >
          <template slot-scope="{row}">
            <span>{{ gzhStatusData[row.pageStatus] }}</span>
          </template>
        </el-table-column>
        <!-- 1-详情；2-确认；3-拒绝；4-发货；5-买家拒收 -->
        <el-table-column
          align="center"
          label="操作"
          width="100"
          fixed="right"
        >
          <template slot-scope="{row}">
            <router-link :to="`/wechat/page/detail/${row.pageId}`">
              <el-button
                :type="'primary'"
                size="mini"
                style="margin-right:10px; min-width: 80px;"
              >
                编辑
              </el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </ContentItem>
    <ContentItem>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
        @pagination="getList"
      />
    </ContentItem>
  </Content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { gzhCustomPagePageList } from '@/api/wechat'
import { saleOrderData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import Content from '@/components/Content/index.vue'
import ContentItem from '@/components/ContentItem/index.vue'

@Component({
  name: 'ArticleList',
  components: {
    Pagination,
    ContentItem,
    Content
  }
})
export default class extends Vue {
  private total = 0
  private list: saleOrderData[] = []
  private multipleSelection = []
  private listLoading = true
  private listQuery = {
    pageStatus: '',
    pageName: '',
    gzhName: '',
    page: 1,
    size: 20
  }

  // 订单类型（1-普通订单；2-后付订单；3-积分订单；4-其他订单
  private gzhStatusOption = [
    {
      key: null,
      label: '全部'
    },
    {
      key: 0,
      label: '无效'
    },
    {
      key: 1,
      label: '有效'
    }
  ]

  // 订单类型（1-普通订单；2-后付订单；3-积分订单；4-其他订单
  private gzhStatusData = {
    0: '无效',
    1: '有效'
  }

  created() {
    this.getList()
  }

  private async getList() {
    this.listLoading = true
    const { payload } = await gzhCustomPagePageList(this.listQuery).finally(() => {
      this.listLoading = false
    })
    const { list, totalCount } = payload
    list.forEach((item:any) => {
      item.selectable = true
    })
    this.list = list
    this.total = totalCount
  }

  private async handleFilter() {
    console.log('查询')
    this.getList()
  }

  private async handleCreate() {
    console.log('重置')
    this.listQuery = {
      pageStatus: '',
      pageName: '',
      gzhName: '',
      page: 1,
      size: 20
    }
    this.getList()
  }
}
</script>

<style lang="scss" scoped>

</style>
