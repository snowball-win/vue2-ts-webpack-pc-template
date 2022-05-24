// 商品管理list-分为机构端与运营端
<template>
  <div class="goods-list-container">
    <!-- 搜索 -->
    <div class="filter-container">
    <!-- <div :style="{background: '#fff', padding: '10px', marginBottom: '10px'}">  -->
      <el-form :inline="true" :model="listQuery" ref="filterForm">
        <el-form-item prop="skuName">
          <el-input
            v-model="listQuery.skuName"
            :placeholder="'请输入商品名称'"
            style="width: 160px;margin-right:10px;"
            class="filter-item"
            clearable
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item prop="firstLevelCateId">
          <el-select
            clearable
            v-model="listQuery.firstLevelCateId"
            :placeholder="'请选择一级分类'"
            style="width: 160px;margin-right:10px;"
            class="filter-item"
            @change="(val) => getGoodsCategoryData(val, 1)"
          >
            <el-option
              v-for="item in optionsCompanyType[0]"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="secondLevelCateId">
          <el-select
            v-model="listQuery.secondLevelCateId"
            :placeholder="'请选择二级分类'"
            clearable
            style="width: 160px;margin-right:10px;"
            class="filter-item"
            @change="(val) => getGoodsCategoryData(val, 2)"
          >
            <el-option
              v-for="item in optionsCompanyType[1]"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="threeLevelCateId">
          <el-select
            v-model="listQuery.threeLevelCateId"
            :placeholder="'请选择三级分类'"
            clearable
            style="width: 160px;margin-right:10px;"
            class="filter-item"
            @change="(val) => getGoodsCategoryData(val, 3)"
          >
            <el-option
              v-for="item in optionsCompanyType[2]"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="fourLevelCateId">
          <el-select
            v-model="listQuery.fourLevelCateId"
            :placeholder="'请选择四级分类'"
            clearable
            style="width: 160px;margin-right:10px;"
            class="filter-item"
            @change="(val) => getGoodsCategoryData(val, 4)"
          >
            <el-option
              v-for="item in optionsCompanyType[3]"
              :key="item.key"
              :label="item.label"
              :value="item.key"
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
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-edit"
          @click="onResetForm('filterForm')"
        >
          重置
        </el-button>
      </el-form>
    </div>
    <div class="goodsListWrap">
      <ul class="goodsListItemWrap">
        <li class="goodsListItem" v-for="(item, index) in list" :key="index">
          <div class="goodsMainImg" @click="goGoodsDetailPath(item)">
            <el-image class="img" :fit="'contain'" :src="item.mainImageUrl" alt="图片"/>
          </div>
          <div class="skuInfo">{{item.skuName}}</div>
          <div class="addCart">
            <el-button type="primary" size="mini" @click="showAddCart(item)">加入购物车</el-button>
          </div>
        </li>
      </ul>
      <div class="page-pagingation">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.size"
          @pagination="getGoodsList"
        />
        <router-link
          :to="'/order/purchase-order/cart/'"
        >
          <el-button type="primary">去购物车</el-button>
        </router-link>
      </div>
    </div>
    <!-- 选择sku -->
    <el-dialog
      :visible.sync="dialogChangeSkuVisible"
      title="选择商品规格"
      width="30%"
    >
      <div class="skuWrap">
        <el-radio-group size="mini" v-model="radio" class="skuWrapItem" v-for="(item, index) in curGoods.goodSpecsList" :key="index">
          <el-radio-button :label="index">
            <span v-for="(item2, index2) in item" :key="index2" @click.stop="getSkuPrick(item)">
              <span> {{item2.specsName}} </span>
              <span> {{item2.specsValue}} </span>
            </span>
          </el-radio-button>
        </el-radio-group>
        <div class="skuPriceNum">
          <div>
            价格：{{curGoods.curSalePrice}}
          </div>
          <!-- <div>
            数量：
            <el-input-number v-model="curGoodsNum" :min="1" :max="9999" size="mini" label="数量"></el-input-number>
          </div> -->
        </div>
        <div class="skuPriceNum">
          <!-- <div>
            价格：{{curGoods.curSalePrice}}
          </div> -->
          <div>
            数量：
            <el-input-number v-model="curGoodsNum" :min="1" :max="9999" size="mini" label="数量"></el-input-number>
          </div>
        </div>
        <div class="operate">
          <el-button size="mini" @click="cancel">取消</el-button>
          <el-button size="mini" @click="onAddCart" type="primary" :disabled="!curGoods.curSalePrice">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { goodsManagerListJg, getGoodsCategory } from '@/api/goods'
import { purchaseOrderOrderList, purchaseOrderAddCart, getSalePrice } from '@/api/order'
import { IArticleData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'ArticleList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private total = 0
  private radio = 0
  private list: IArticleData[] = []
  private multipleSelection = []
  private listLoading = true
  private dialogChangeSkuVisible = false
  private dialogPreViewType = 'img'
  private listQuery = {
    page: 1,
    size: 20,
    firstLevelCateId: '',
    secondLevelCateId: '',
    threeLevelCateId: '',
    fourLevelCateId: '',
    skuName: '' // 商品名称
  }

  private curGoods:any = {} // 当前商品信息
  private curGoodsNum:any = 1 // 当前商品信息

  private approveStatusMap = {
    1: '待审核',
    2: '审核通过',
    3: '审核失败'
  }

  private upperStatusMap = {
    0: '下架',
    1: '上架'
  }

  private supperStatusOptions = [
    {
      key: 0,
      label: '下架'
    },
    {
      key: 1,
      label: '上架'
    }
  ]

  created() {
    this.getGoodsList() // list
    this.getGoodsCategoryData()
  }

  private dateChangeHandle(value: any) {
    console.log('82value', value)
  }

  private async getGoodsList() {
    this.listLoading = true
    // goodsManagerListYy 运营 goodsManagerListJg 机构
    const { payload } = await goodsManagerListJg(this.listQuery).finally(() => {
      this.listLoading = false
    })
    this.list = payload.list
    this.total = payload.totalCount
  }

  private async goGoodsDetailPath({ skuId }: {skuId: string}) {
    this.$router.push(`/goods/detail/${skuId}`)
  }

  // 获取进货订单列表
  private async getPurchaseOrderOrderList() {
    this.listLoading = true
    await purchaseOrderOrderList(this.listQuery).then((res) => {
      console.log('390', res)
    }).catch().finally(() => {
      this.listLoading = false
    })
  }

  private optionsCompanyType:any[] = []

  private async getGoodsCategoryData(id = '', index = 0) {
    const categoryId = id
    await getGoodsCategory({ categoryId }).then((res: any) => {
      if (res.code === '0') {
        const data = res.payload
        for (let i = index + 1; i < 4; i++) {
          this.optionsCompanyType[index] = []
        }
        if (data.length > 0 && index < 4) {
          // 添加到list
          this.optionsCompanyType[index] = data.map((item:any) => {
            const { categoryId: key, categoryName: label } = item
            return { ...item, key, label }
          })
        }
      }
    })
    // this.handleFilter()
  }

  // 获取sku价格
  private getSkuPrick(item2:any) {
    this.curGoods.curSku = item2
    const params = {
      skuId: this.curGoods.skuId,
      goodSpecs: item2
    }
    getSalePrice(params).then((res) => {
      console.log('251', res)
      if (res.code === '0') {
        this.$set(this.curGoods, 'curSalePrice', res.payload.salePrice)
      }
    }).catch().finally()
  }

  // 选择商品规格
  private showAddCart(item:any) {
    // console.log('237', item)
    if (item.goodSpecsList && item.goodSpecsList.length > 0) {
      this.curGoods = item
      this.dialogChangeSkuVisible = true
      this.radio = 0
      this.getSkuPrick(item.goodSpecsList[0])
    }
  }

  // 取消
  cancel() {
    this.dialogChangeSkuVisible = false
  }

  // 加入购物车
  private onAddCart() {
    const params = {
      skuId: this.curGoods.skuId,
      goodSpecs: this.curGoods.curSku,
      buyCount: this.curGoodsNum
    }
    purchaseOrderAddCart(params).then((res) => {
      console.log('284', res)
      if (res.code === '0') {
        this.$message.success('操作成功')
      }
    }).catch().finally(() => {
      this.dialogChangeSkuVisible = false
    })
  }

  private handleSelectionChange(value: any) {
    console.log(value)
    this.multipleSelection = value
  }

  private async handleFilter() {
    this.getGoodsList()
  }

  private async onResetForm(formName:string) {
    const refs:any = this.$refs[formName]
    refs.resetFields()
  }
}
</script>

<style lang="scss" scoped>
.goods-list-container{
  padding: 10px;
  .page-pagingation {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .goodsListWrap{
    background: #fff;
    padding:10px;
    .goodsListItemWrap{
      display: flex;
      flex-flow: wrap;
      justify-content: flex-start;
      .goodsListItem{
        position: relative;
        border: 1px solid #e6e6e6;
        width: 240px;
        height: 340px;
        margin-bottom: 10px;
        margin-right: 10px;
        .goodsMainImg{
          width: 240px;
          height: 240px;
          overflow: hidden;
          padding: 10px;
          .img{
            width: 100%;
            height: 100%;
          }
        }
        .priceInfo{
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
        }
        .skuInfo{
          padding: 0 20px 10px 10px;
          font-size: 14px;
          line-height: 20px;
          color: #333;
        }
        .addCart{
          position: absolute;
          bottom: 0;
          right: 0px;
          text-align: right;
          padding: 10px;
        }
      }
    }
  }

  .skuWrap{
    .skuWrapItem{
      border-radius: 3px;
      padding: 0 10px 10px 0;
      cursor: pointer;
      display: block;
    }
    .skuPriceNum{
      margin: 20px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .operate{
      text-align: right;
    }
  }

  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  .filter-container {
    background: #fff;
    padding: 10px;
    padding-bottom: 0;
    margin-bottom: 10px;
  }
  .preViewContent {
    .img {
      display: block;
      width: 100%;
    }
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 0px;
  }
  .el-form--inline .el-form-item {
    margin-right: 0;
  }
}

</style>
