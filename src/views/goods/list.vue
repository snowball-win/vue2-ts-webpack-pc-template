// 商品管理list-分为机构端与运营端
<template>
  <div class="goods-list-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" ref="filterForm">
        <el-form-item prop="skuName" class="filter-item">
          <el-input
            v-model="listQuery.skuName"
            :placeholder="'请输入商品名称'"
            style="width: 160px; margin-right: 10px"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item prop="firstLevelCateId" class="filter-item">
          <el-select
            v-model="listQuery.firstLevelCateId"
            :placeholder="'请选择一级分类'"
            style="width: 160px; margin-right: 10px"
            @change="getClassify(listQuery.firstLevelCateId, 1)"
          >
            <el-option
              v-for="item in optionsCompanyType1"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          prop="secondLevelCateId"
          v-if="listQuery.firstLevelCateId !== ''"
          class="filter-item"
        >
          <el-select
            v-model="listQuery.secondLevelCateId"
            :placeholder="'请选择二级分类'"
            style="width: 160px; margin-right: 10px"
            @change="getClassify(listQuery.secondLevelCateId, 2)"
          >
            <el-option
              v-for="item in optionsCompanyType2"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          prop="threeLevelCateId"
          class="filter-item"
          v-if="
            listQuery.firstLevelCateId !== '' &&
            listQuery.secondLevelCateId !== ''
          "
        >
          <el-select
            v-model="listQuery.threeLevelCateId"
            :placeholder="'请选择三级分类'"
            style="width: 160px; margin-right: 10px"
            @change="getClassify(listQuery.threeLevelCateId, 3)"
          >
            <el-option
              v-for="item in optionsCompanyType3"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="filter-item"
          prop="fourLevelCateId"
          v-if="
            listQuery.firstLevelCateId !== '' &&
            listQuery.secondLevelCateId !== '' &&
            listQuery.threeLevelCateId !== ''
          "
        >
          <el-select
            v-model="listQuery.fourLevelCateId"
            :placeholder="'请选择四级分类'"
            style="width: 160px; margin-right: 10px"
          >
            <el-option
              v-for="item in optionsCompanyType4"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="showTerminals" class="filter-item">
          <el-select
            v-model="listQuery.showTerminals"
            multiple
            :placeholder="'请选择销售终端'"
            style="width: 160px; margin-right: 10px"
          >
            <el-option
              v-for="item in terminalsOptions"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
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
          @click="onResetForm('filterForm')"
        >
          重置
        </el-button>
      </el-form>
    </div>
    <!-- button -->
    <div class="operate-button">
      <div>
        <el-button
          type="primary"
          size="mini"
          @click="getListByAuditStatus('', '')"
          >全部商品</el-button
        >
        <el-button
          type="primary"
          size="mini"
          @click="getListByAuditStatus('upperStatus', 1)"
          >已上架</el-button
        >
        <el-button
          type="primary"
          size="mini"
          @click="getListByAuditStatus('upperStatus', 0)"
          >未上架</el-button
        >
        <el-button
          type="primary"
          size="mini"
          @click="getListByAuditStatus('approveStatus', 1)"
          >审核中</el-button
        >
        <el-button
          type="primary"
          size="mini"
          @click="getListByAuditStatus('approveStatus', 3)"
          >未通过</el-button
        >
      </div>
      <div>
        <router-link :to="'/goods/edit/'" class="link-type">
          <el-button v-if="adminFlag==='1'" type="primary" style="margin-right: 10px" size="mini"
            >新建</el-button
          >
        </router-link>
        <el-button type="primary" size="mini">导出</el-button>
        <el-button type="primary" size="mini">自定义列表</el-button>
        <el-button type="primary" size="mini">去购物车</el-button>
      </div>
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
        <!-- <el-table-column
          width="180"
          align="center"
          label="ID"
        >
          <template slot-scope="{row}">
            <span>{{ row.skuId }}</span>
          </template>
        </el-table-column> -->

        <el-table-column width="120px" align="center" label="商品编号">
          <template slot-scope="{row}">
            <span>{{ row.skuNo }}</span>
          </template>
        </el-table-column>

        <el-table-column width="180px" align="center" label="商品名称">
          <template slot-scope="{row}">
            <span>{{ row.skuName }}</span>
          </template>
        </el-table-column>

        <el-table-column
          class-name="status-col"
          width="110px"
          label="商品图片"
          align="center"
        >
          <template slot-scope="{row}">
            <el-button type="text" @click="preViewImg(row)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column
          class-name="status-col"
          label="商品视频"
          width="110"
          align="center"
        >
          <template slot-scope="{row}">
            <el-button type="text" @click="preViewVideo(row)">查看</el-button>
          </template>
        </el-table-column>

        <!-- <el-table-column
          min-width="300px"
          label="商品规格"
          align="center"
        >
          <template slot-scope="{row}">
            <router-link
              :to="'/example/edit/'+row.id"
              class="link-type"
            >
              <span>{{ row.title }}</span>
            </router-link>
          </template>
        </el-table-column> -->

        <!-- <el-table-column
          min-width="300px"
          label="销售单价"
          align="center"
        >
          <template slot-scope="{row}">
            <router-link
              :to="'/example/edit/'+row.id"
              class="link-type"
            >
              <span>{{ row.title }}</span>
            </router-link>
          </template>
        </el-table-column> -->

        <!-- <el-table-column
          min-width="300px"
          label="优惠策略"
          align="center"
        >
          <template slot-scope="{row}">
            <router-link
              :to="'/example/edit/'+row.id"
              class="link-type"
            >
              <span>{{ row.title }}</span>
            </router-link>
          </template>
        </el-table-column> -->

        <el-table-column min-width="120px" label="上架数量" align="center">
          <template slot-scope="{row}">
            <span>{{ row.upperCount }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="120px" label="排序" align="center">
          <template slot-scope="{row}">
            <span>{{ row.sort }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="120px" label="商品货号" align="center">
          <template slot-scope="{row}">
            <span>{{ row.goodsNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="300px" label="销售终端" align="center">
          <template slot-scope="{row}">
            <span>{{ row.shelvesTerminal }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="120px" label="上架状态" align="center">
          <template slot-scope="{row}">
            <span>{{ upperStatusMap[row.upperStatus] }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="120px" label="审核状态" align="center">
          <template slot-scope="{row}">
            <span>{{ approveStatusMap[row.approveStatus] }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="250" fixed="right">
          <template slot-scope="{row}">
            <el-button
              type="primary"
              size="small"
              style="margin-right: 10px"
              @click="onGoodsOperate(row, 'single')"
            >
              <span v-if="row.upperStatus === 0">上架</span>
              <span v-else-if="row.upperStatus === 1">下架</span>
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="onDeleteGoods(row, 'single')"
            >
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

    <!-- 查看图片 -->
    <el-dialog :visible.sync="dialogPreViewVisible" width="80%">
      <el-carousel height="360px" v-if="dialogPreViewType==='img'">
        <el-carousel-item v-for="(item, index) in preViewImgArr" :key="index">
          <div style="textAlign:center;height:100%;">
            <img style="height:100%;" class="img" :src="item.imageUrl" alt="图片" />
          </div>
        </el-carousel-item>
      </el-carousel>
      <el-carousel height="360px" v-if="dialogPreViewType==='video'">
        <el-carousel-item v-for="(item, index) in preViewVideoArr" :key="index">
          <div style="textAlign:center;height:100%;">
            <video style="height:100%;" class="img" :src="item" controls="controls"></video>
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  goodsManagerListYy,
  showTerminal,
  deleteGoods,
  goodsOperate,
  getGoodsCategory
} from '@/api/goods'
import { IArticleData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { getAdminFlag } from '@/utils/cookies'

@Component({
  name: 'ArticleList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  created() {
    this.getList() // list
    this.getTerminals() // 获取销售终端
    this.getClassify('', 0)
  }

  private adminFlag = getAdminFlag(); // 管理员可新建
  private total = 0;
  private list: IArticleData[] = [];
  private multipleSelection = [];
  private listLoading = true;
  private dialogPreViewVisible = false;
  private dialogPreViewType = 'img';
  private listQuery: any = {
    page: 1,
    size: 20,
    firstLevelCateId: '',
    secondLevelCateId: '',
    threeLevelCateId: '',
    fourLevelCateId: '',
    approveStatus: '', // 审核状态
    shelvesTerminal: '', // 销售终端
    upperStatus: '', // 上架状态
    skuName: '', // 商品名称
    showTerminals: [] // 销售终端
  };

  private approveStatusMap = {
    1: '待审核',
    2: '审核通过',
    3: '审核失败'
  };

  private upperStatusMap = {
    0: '下架',
    1: '上架'
  };

  private optionsCompanyType1 = [];
  private optionsCompanyType2 = [];
  private optionsCompanyType3 = [];
  private optionsCompanyType4 = [];

  private supperStatusOptions = [
    {
      key: 0,
      label: '下架'
    },
    {
      key: 1,
      label: '上架'
    }
  ];

  // 分类筛选
  private async getClassify(categoryId: any, index: any) {
    console.log('485', categoryId, index)
    // 当不按照顺序点击时，重新计算list与path
    const params = {
      categoryId: categoryId
    }
    await getGoodsCategory(params).then((res: any) => {
      if (res.code === '0') {
        const data = res.payload
        if (data.length > 0) {
          // 添加到list
          let dataCalc = []
          dataCalc = data.map((item: any) => {
            return {
              key: item.categoryId,
              label: item.categoryName
            }
          })
          if (index === 0) {
            // 一级分类
            this.optionsCompanyType1 = []
            this.optionsCompanyType2 = []
            this.optionsCompanyType3 = []
            this.optionsCompanyType4 = []
            this.listQuery.firstLevelCateId = ''
            this.listQuery.secondLevelCateId = ''
            this.listQuery.threeLevelCateId = ''
            this.listQuery.fourLevelCateId = ''
            this.optionsCompanyType1 = dataCalc
          } else if (index === 1) {
            // 二级分类
            this.optionsCompanyType2 = []
            this.optionsCompanyType3 = []
            this.optionsCompanyType4 = []
            this.listQuery.secondLevelCateId = ''
            this.listQuery.threeLevelCateId = ''
            this.listQuery.fourLevelCateId = ''
            this.optionsCompanyType2 = dataCalc
          } else if (index === 2) {
            // 三级分类
            this.optionsCompanyType3 = []
            this.optionsCompanyType4 = []
            this.listQuery.threeLevelCateId = ''
            this.listQuery.fourLevelCateId = ''
            this.optionsCompanyType3 = dataCalc
          } else if (index === 3) {
            // 四级分类
            this.optionsCompanyType4 = []
            this.listQuery.fourLevelCateId = ''
            this.optionsCompanyType4 = dataCalc
          }
          console.log('505data1', this.optionsCompanyType1)
          console.log('505data2', this.optionsCompanyType2)
          console.log('505data3', this.optionsCompanyType3)
          console.log('505data4', this.optionsCompanyType4)
        }
      }
    })
  }

  private dateChangeHandle(value: any) {
    console.log('82value', value)
  }

  private async getListByAuditStatus(type: any, value: any) {
    this.listQuery.page = 1
    if (type === 'upperStatus') {
      this.listQuery.approveStatus = ''
      this.listQuery.upperStatus = value
    } else if (type === 'approveStatus') {
      this.listQuery.upperStatus = ''
      this.listQuery.approveStatus = value
    } else {
      this.listQuery.upperStatus = ''
      this.listQuery.approveStatus = ''
    }
    this.getList()
  }

  private getList() {
    this.listLoading = true
    console.log('532', this.listQuery.upperStatus)
    goodsManagerListYy(this.listQuery)
      .then((res) => {
        this.list = res.payload.list
        this.total = res.payload.totalCount
      })
      .finally(() => {
        this.listLoading = false
      })
  }

  // 终端展示枚举
  private terminalsOptions = [];
  private async getTerminals() {
    const params = {}
    await showTerminal(params).then((res: any) => {
      if (res.code === '0') {
        const data = res.payload
        this.terminalsOptions = data.map((item: any) => {
          return {
            value: item.terminalCode,
            label: item.terminalName
          }
        })
      }
    })
  }

  // 删除商品-single单个-multiple多个
  onDeleteGoods(data: any, type: string) {
    this.$confirm('确定删除选中的商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const params: any = {
          skuIdList: []
        }
        if (type === 'single') {
          params.skuIdList.push(data.skuId)
        }
        deleteGoods(params).then((res: any) => {
          if (res.code === '0') {
            this.$message.success('删除成功')
            this.getList()
          }
        })
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
  }

  // 商品上架、下架
  onGoodsOperate(data: any, type: string) {
    let status = ''
    let operateType = 0
    if (data.upperStatus === 1) {
      status = '下架'
      operateType = 2
    } else {
      status = '上架'
      operateType = 1
    }
    this.$confirm(`确定${status}选中的商品吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const params: any = {
          skuIdList: [],
          operateType: operateType
        }
        if (type === 'single') {
          params.skuIdList.push(data.skuId)
        }
        goodsOperate(params).then((res: any) => {
          if (res.code === '0') {
            this.getList()
            this.$message.success('操作成功')
          }
        })
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
  }

  // 查看图片
  private preViewImgArr = [{ imageUrl: '' }];
  private preViewImg(value: any) {
    console.log('468', value)
    this.preViewImgArr = value.goodsImages
    this.dialogPreViewVisible = true
    this.dialogPreViewType = 'img'
  }

  // 查看视频
  private preViewVideoArr = [];
  private preViewVideo(value: any) {
    // console.log(value)
    this.preViewVideoArr = value.goodsVideos || []
    this.dialogPreViewVisible = true
    this.dialogPreViewType = 'video'
  }

  private handleSelectionChange(value: any) {
    console.log(value)
    this.multipleSelection = value
  }

  private async handleFilter() {
    this.listQuery.page = 1
    this.getList()
  }

  private async onResetForm(formName: string) {
    const refs: any = this.$refs[formName]
    refs.resetFields()
    this.listQuery.page = 1
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.goods-list-container {
  padding: 10px;
  .operate-button {
    margin-bottom: 10px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
  }

  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
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
  .preViewContent {
    .img {
      display: block;
      width: 100%;
    }
  }
  .swiper-container {
    width: 100%;
    height: 300px;
  }
  .swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #ccc;
    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
}
</style>
