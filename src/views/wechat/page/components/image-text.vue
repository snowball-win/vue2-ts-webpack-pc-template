// 页面配置-图文
<template>
  <Content>
    <ContentItem :title="'基本信息'" :style="{marginBottom: '5px', overflow: 'visible'}">
      <el-form
        ref="pageForm"
        :model="pageForm"
        :rules="pageRules"
        label-width="200px"
        label-position="right"
        :style="{marginLeft: 0}"
      >
        <el-form-item
          prop="showAbstract"
          label="是否显示概述"
        >
          <el-select
            v-model="pageForm.showAbstract"
            placeholder="请选择"
            clearable
            style="width: 100%"
            disabled
          >
            <el-option
              v-for="(item, index) in showAbstractOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="showSourceName"
          label="是否显示来源"
        >
          <el-select
            v-model="pageForm.showSourceName"
            placeholder="请选择"
            clearable
            style="width: 100%"
            disabled
          >
            <el-option
              v-for="(item, index) in showSourceNameOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="showSubmitTime"
          label="是否显示提交时间"
        >
          <el-select
            v-model="pageForm.showSubmitTime"
            placeholder="请选择"
            clearable
            style="width: 100%"
            disabled
          >
            <el-option
              v-for="(item, index) in showSubmitTimeOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="showFixedCount"
          label="是否固定数量"
        >
          <el-select
            v-model="pageForm.showFixedCount"
            placeholder="请选择"
            clearable
            style="width: 100%"
            disabled
          >
            <el-option
              v-for="(item, index) in showFixedCountOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="fixedCount"
          label="固定显示数量"
        >
          <el-input
            v-model="pageForm.fixedCount"
            placeholder="请输入固定显示数量"
            clearable
            type="text"
            disabled
          />
        </el-form-item>
        <el-form-item
          prop="hasCategory"
          label="是否有分类"
        >
          <el-select
            v-model="pageForm.hasCategory"
            placeholder="请选择"
            clearable
            style="width: 100%"
            disabled
          >
            <el-option
              v-for="(item, index) in hasCategoryOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ContentItem>
    <ContentItem :title="'图文信息'">
      <ContentItem :style="{marginBottom: '10px', paddingBottom: '0'}">
        <div>
          <el-input
            v-model="listQuery.contentTitle"
            :placeholder="'请输入标题名称'"
            style="width: 220px;margin-right:10px; margin-bottom:10px;"
            class="filter-item"
            clearable
          />
          <el-select
            v-model="listQuery.categoryId"
            style="width: 220px;margin-right:10px; margin-bottom:10px;"
            class="filter-item"
            clearable
            :placeholder="'请选择分类'"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.categoryId"
              :label="item.categoryName"
              :value="item.categoryId"
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
            @click="handleReset"
          >
            重置
          </el-button>
          <el-button
            v-waves
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            icon="el-icon-edit"
            @click="handleCreate"
          >
            新建
          </el-button>
        </div>
      </ContentItem>
      <ContentItem :flex="true">
        <el-table
          v-loading="listLoading"
          :data="tableList"
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
            label="图文分类"
          >
            <template slot-scope="{row}">
              <span>{{ row.categoryName }}</span>
            </template>
          </el-table-column>

          <el-table-column
            width="200px"
            align="center"
            show-overflow-tooltip
            label="标题"
          >
            <template slot-scope="{row}">
              <span>{{ row.contentTitle }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="150px"
            align="center"
            show-overflow-tooltip
            label="摘要"
          >
            <template slot-scope="{row}">
              <span>{{ row.contentAbstract }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="200px"
            align="center"
            label="提交时间"
          >
            <template slot-scope="{row}">
              <span>{{ row.submitTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="250"
            fixed="right"
          >
            <template slot-scope="{row}">
              <router-link :to="`/wechat/page/addImageText/${row.pageComponentId}?pid=${pageId}&contentId=${row.contentId}&type=edit`">
                <el-button
                  :type="'primary'"
                  size="mini"
                  style="margin-right:10px;"
                >
                  编辑
                </el-button>
              </router-link>
              <el-button
                :type="'primary'"
                size="mini"
                @click="deleteContentItem(row.contentId)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </ContentItem>
    </ContentItem>
  </Content>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import Content from '@/components/Content/index.vue'
import ContentItem from '@/components/ContentItem/index.vue'
import {
  gzhGraphicInfoContentCategoryCategoryList,
  gzhGraphicInfoContentContentList,
  gzhGraphicInfoContentOperateContent
} from '@/api/wechat'
@Component({
  name: 'wechat-config-create-components',
  components: {
    ContentItem,
    Content
  }
})
export default class extends Vue {
  @Prop({ default: () => null }) private curComponentItemData!: object
  created() {
    this.getCategoryList() // 分类list
    this.getTableList() // 图文list
  }

  @Watch('curComponentItemData')
  private onCurComponentItemDataChange(item: any) {
    console.log('290', item)
    this.pageForm.fixedCount = item.fixedCount
    this.pageForm.showFixedCount = item.showFixedCount
    this.pageForm.hasCategory = item.hasCategory
    this.pageForm.showSubmitTime = item.showSubmitTime
    this.pageForm.showSourceName = item.showSourceName
    this.pageForm.showAbstract = item.showAbstract
  }

  private pageComponentId = ''
  private setComponentData(item: any) {
    console.log('302', item)
    this.pageForm.fixedCount = item.fixedCount
    this.pageForm.showFixedCount = item.showFixedCount
    this.pageForm.hasCategory = item.hasCategory
    this.pageForm.showSubmitTime = item.showSubmitTime
    this.pageForm.showSourceName = item.showSourceName
    this.pageForm.showAbstract = item.showAbstract
    this.pageComponentId = item.pageComponentId
  }

  private pageId = this.$route.params.id

  private pageForm:any = {
    showFixedCount: '', // 是否固定数量
    fixedCount: '', // 固定显示的数量
    showSourceName: '', // 是否显示来源
    showAbstract: '', // 是否显示概述
    showSubmitTime: '', // 是否显示提交时间
    hasCategory: '', // 是否有分类
    gzhId: this.$route.query && this.$route.query.gzhId,
    componentPropertiesList: []
  };

  // 查询条件
  private listQuery:any = {
    categoryId: '',
    contentTitle: '',
    page: 1,
    pagesize: 999,
    pageId: this.pageId
  }

  private pageRules = {
    showAbstract: [
      {
        message: '请选择分类',
        trigger: 'blur',
        required: true
      }
    ],
    showSourceName: [
      {
        message: '请选择',
        trigger: 'blur',
        required: true
      }
    ],
    showSubmitTime: [
      {
        message: '请选择',
        trigger: 'blur',
        required: true
      }
    ],
    fixedCount: [
      {
        message: '请选择',
        trigger: 'blur',
        required: true
      }
    ],
    showFixedCount: [
      {
        message: '请选择',
        trigger: 'blur',
        required: true
      }
    ],
    hasCategory: [
      {
        message: '请选择',
        trigger: 'blur',
        required: true
      }
    ],
    rotationCount: [
      {
        message: '请选择',
        trigger: 'blur',
        required: true
      }
    ],
    rotationInterval: [
      {
        message: '请选择',
        trigger: 'blur',
        required: true
      }
    ],
    rotationDirection: [
      {
        message: '请选择',
        trigger: 'blur',
        required: true
      }
    ],
    rotationLoop: [
      {
        message: '请选择',
        trigger: 'blur',
        required: true
      }
    ],
    componentStatus: [
      {
        message: '请选择',
        trigger: 'blur',
        required: true
      }
    ]
  };

  private showAbstractOption = [
    {
      label: '是',
      value: '1'
    },
    {
      label: '否',
      value: '0'
    }
  ]

  private showSourceNameOption = [
    {
      label: '是',
      value: '1'
    },
    {
      label: '否',
      value: '0'
    }
  ]

  private showSubmitTimeOption = [
    {
      label: '是',
      value: '1'
    },
    {
      label: '否',
      value: '0'
    }
  ]

  private showFixedCountOption = [
    {
      label: '是',
      value: '1'
    },
    {
      label: '否',
      value: '0'
    }
  ]

  private hasCategoryOption = [
    {
      label: '是',
      value: '1'
    },
    {
      label: '否',
      value: '0'
    }
  ]

  // 返回
  private goBack() {
    this.$router.go(-1)
  }

  // 返回
  private onStart(): void {
    console.log('onStart')
  }

  // 返回
  private onEnd() {
    console.log('onEnd')
  }

  // handleFilter
  private handleFilter() {
    console.log('389q', this.listQuery)
    this.getTableList()
  }

  private handleReset(): void {
    this.listQuery.categoryId = ''
    this.listQuery.contentTitle = ''
  }

  private handleCreate() {
    this.$router.push({
      path: `/wechat/page/addImageText/${this.pageComponentId}?pid=${this.pageId}&type=create`
    })
  }

  private categoryQuery = {
    pageId: this.pageId,
    categoryId: '',
    page: 1,
    size: 20
  }

  private categoryList = []
  private async getCategoryList() {
    const { payload } = await gzhGraphicInfoContentCategoryCategoryList(this.categoryQuery)
    const { list } = payload
    console.log('391', list)
    this.categoryList = list
  }

  private listLoading = false
  private tableList = []

  private async getTableList() {
    await gzhGraphicInfoContentContentList(this.listQuery)
      .then((res) => {
        if (res.code === '0') {
          this.tableList = res.payload.list
        }
      })
      .finally(() => {
        this.listLoading = false
      })
  }

  // 删除图文item
  private async deleteContentItem(contentId: any) {
    const params = {
      operateType: 2, // 0置为无效，1置为有效，2删除
      contentId // 内容ID
    }
    await gzhGraphicInfoContentOperateContent(params)
      .then((res) => {
        if (res.code === '0') {
          this.getTableList()
          this.$message.success('删除成功')
        }
      })
  }
}
</script>

<style lang="scss" scoped>
.content-item {
  .el-form{
    width: auto;
    margin: 0 100px;
  }
  .el-form-item{
    width: 500px;
    margin-bottom: 20px;
  }
}
</style>
<style lang="scss">
.el-form-item__content{
  display: flex;
}
</style>
