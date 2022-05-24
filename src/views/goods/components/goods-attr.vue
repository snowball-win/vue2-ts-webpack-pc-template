// 商品属性
<template>
  <div class="goodsAttrComponent">
    <div class="splitLine"></div>
    <div class="title">商品规格</div>
    <div class="attrContent">
      <div
        class="attrContent_list"
        v-for="(item, index) in goodsAttrCategoryValues"
        :key="index"
      >
        <span class="attrContent_list_label">{{ item.attrName }}</span>
        <!-- <span v-for="(item2,index2) in item.attrValues" :key="index2">{{item2}}</span> -->
        <el-checkbox-group v-model="item.attrValuesSeclted" @change="handleCheckedAttrChange(item, index)">
          <el-checkbox
            :label="item2"
            v-for="(item2, index2) in item.attrValues"
            :key="index2"
          ></el-checkbox>
        </el-checkbox-group>
        <el-button
          @click="addGoodsAttrCategoryValues(item, index)"
          >增加</el-button
        >
      </div>
    </div>
    <div class="splitLine"></div>
    <div class="goodsInfoTableWrap">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="tableArrList"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="序号"  align="center" type="index" width="100">
        </el-table-column>
        <!-- 表头信息 -->
        <el-table-column
          width="80"
          align="center"
          :label="item.attrName"
          v-for="(item, index) in goodsAttrCategoryValues"
          :key="index"
        >
          <template slot-scope="{row}">
            <span>{{ row[item.attrCode] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="销售价格"  align="center" width="100">
          <template slot-scope="{row}">
            <el-input v-model="row.salePrice"/>
          </template>
        </el-table-column>
        <el-table-column label="上架数量"  align="center" width="100">
          <template slot-scope="{row}">
            <el-input v-model="row.shelvesCount"/>
          </template>
        </el-table-column>
        <el-table-column label="预警库存"  align="center" width="100">
          <template slot-scope="{row}">
            <el-input v-model="row.warningStock"/>
          </template>
        </el-table-column>
        <el-table-column label="优惠比例"  align="center" width="100">
          <template slot-scope="{row}">
            <el-input v-model="row.discountRatio"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="splitLine"></div>
    <div class="submit">
      <el-button type="primary" @click="lastStep(2)"
        >上一步</el-button
      >
      <el-button type="primary" @click="submitHandle"
        >下一步，填写商品标签</el-button
      >
    </div>
    <!-- 添加属性 -->
    <el-dialog
      title="添加商品规格"
      :visible.sync="goodsAttrVisible"
      width="400px"
      :before-close="handleClose"
    >
      <el-form
        :inline="true"
        :model="addGoodsAttrForm"
        class="demo-form-inline"
      >
        <el-form-item label="规格">
          <el-input
            v-model="addGoodsAttrForm.attr"
            placeholder="请添加属性"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onAddGoodsAttrSubmit"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Form as ElForm, Row } from 'element-ui'
import { getGoodsAttrCategoryValues } from '@/api/goods'
import { cloneDeep } from 'lodash'

@Component({
  name: 'goodsAttrComponent',
  components: {}
})
export default class extends Vue {
  @Prop({ default: '' }) private goodsInfoFormAttrId!: string;
  private listLoading = false;
  listAttrArr: Array<any> = [];
  private listAttr = this.listAttrArr;
  private addGoodsAttrForm = {
    attr: ''
  };

  mounted() {
    console.log('141', this.goodsInfoFormAttrId)
  }

  private userForm = {
    name: 'admin',
    phone: '',
    fullContent: ''
  };

  @Watch('goodsInfoFormAttrId', { immediate: true })
  private ongoodsInfoFormAttrIdChange(value: any) {
    console.log('152goodsInfoFormAttrId', this.goodsInfoFormAttrId)
    this.getAttrCategory(this.goodsInfoFormAttrId)
  }

  private goodsAttrVisible = false; // 添加商品属性弹窗
  private goodsAttrCategoryValues: any = [
    { attrValuesSeclted: [''], attrValues: [''], attrCode: '' }
  ]; // 选中的商品规格

  private goodsAttrCategoryValuesCloneDeep: any = [] // clone数据，防止后边被修改
  // 商品属性分类值集
  private async getAttrCategory(goodsInfoFormAttrId: any) {
    const params = {
      attrCateId: goodsInfoFormAttrId
    }
    // 表头列
    await getGoodsAttrCategoryValues(params).then((res: any) => {
      if (res.code === '0') {
        const data = res.payload
        data.map((item: any) => {
          item[item.attrCode] = ''
          item.attrValuesSeclted = []
          return item
        })
        this.goodsAttrCategoryValues = data
      }
    })
  }

  // 如果某一行没有选中的属性，那么这一行不作为价格的一个属性展示在价格表格里边
  private goodsAttrCategoryValuesCalc() {
    // 这里需要clonedeep goodsAttrCategoryValues否则计算价格的同时会影响到规则的数据
    this.goodsAttrCategoryValuesCloneDeep.forEach((item:any, index:number) => {
      console.log(item)
      console.log(index)
      if (item.attrValuesSeclted.length === 0) {
        this.goodsAttrCategoryValuesCloneDeep.splice(index, 1)
      }
    })
  }

  // 属性change
  private handleCheckedAttrChange() {
    // 重装数据,这里的数据需要clonedeep
    // this.goodsAttrCategoryValuesCalc()
    // 重装数据
    this.onAddGoodsAttrSubmitCalcData()
  }

  // 添加属性
  private curAttr = { index: 0 };
  private addGoodsAttrCategoryValues(item: any, index: any) {
    item.index = index
    this.curAttr = item
    this.goodsAttrVisible = true
  }

  // 添加规则
  private selectedAttrLineCount = 0
  private onAddGoodsAttrSubmit() {
    this.listAttr = []
    const index = this.curAttr.index
    this.goodsAttrCategoryValues[index].attrValues.push(
      // 添加到值集
      this.addGoodsAttrForm.attr
    )
    this.goodsAttrCategoryValues[index].attrValuesSeclted.push(
      // 添加到选中的值集
      this.addGoodsAttrForm.attr
    )
    // 重装数据
    this.onAddGoodsAttrSubmitCalcData()
    // 弹窗小时
    this.goodsAttrVisible = false
    this.addGoodsAttrForm.attr = ''
  }

  // 添加属性时，重装数据
  private onAddGoodsAttrSubmitCalcData() {
    // selectedAttrLineCount初始化
    this.selectedAttrLineCount = 0
    this.goodsAttrCategoryValuesCloneDeep = cloneDeep(this.goodsAttrCategoryValues)
    this.goodsAttrCategoryValuesCalc()
    // -------s---------
    // 理想行数据
    // rowData = {
    // "specs": [
    // {
    // "specsCode": "",//编码
    // "specsName": "",//名称
    // "specsValue": ""//值集
    // }
    // ],
    // "salePrice": 0,
    // "shelvesCount": 0,
    // "warningStock": 0,
    // "discountRatio": 0
    // }
    // 思路：相邻两行遍历,最后即使全部
    // this.listAttr 表格数据
    console.log('227', this.goodsAttrCategoryValuesCloneDeep)
    this.goodsAttrCategoryValuesCloneDeep.forEach((item: any) => {
      console.log('229', item)
      console.log('230', item.attrValuesSeclted.length)
      item.attrValuesSecltedObj = []
      if (item.attrValuesSeclted.length > 0) {
        this.selectedAttrLineCount += 1
        console.log('235', this.selectedAttrLineCount)
      }
      item.attrValuesSeclted.forEach((item2: any) => {
        console.log('203', item)
        console.log('204', item2)
        // 组装数据
        const obj = {
          specs: {
            specsCode: item.attrCode,
            specsName: item.attrName,
            specsValue: item2
          },
          specsCode: item.attrCode,
          specsName: item.attrName,
          specsValue: item2,
          salePrice: 0,
          shelvesCount: 0,
          warningStock: 0,
          discountRatio: 0
        }
        item.attrValuesSecltedObj.push(obj)
      })
    })
    console.log('219', this.goodsAttrCategoryValuesCloneDeep)
    // 如果只有一行数据就不必使用两行数据的方法s
    // 有几行选中的
    let flagIndex = 0
    this.goodsAttrCategoryValuesCloneDeep.forEach((item:any) => {
      if (item.attrValuesSeclted.length > 0) {
        flagIndex += 1
      }
    })
    console.log('369flagIndex', flagIndex)
    console.log('369clonedeep', this.goodsAttrCategoryValuesCloneDeep)
    // 两两遍历法，适用于两行及超过两行的数据，只有一行就太简单不需要了
    const line1Data = this.goodsAttrCategoryValuesCloneDeep[0].attrValuesSecltedObj
    let line2Data = []
    // 兼容一开始什么数据也没有的情况
    if (flagIndex > 1) {
      line2Data = this.goodsAttrCategoryValuesCloneDeep[1].attrValuesSecltedObj
    }
    console.log('260line1Data', line1Data)
    console.log('261line2Data', line2Data)
    // 如果只有一行
    if (flagIndex === 1) {
      this.tableArrList = []
      line1Data.forEach((item2:any) => {
        const obj:any = {
          salePrice: 0,
          shelvesCount: 0,
          warningStock: 0,
          discountRatio: 0,
          specs: []
        }
        obj[item2.specsCode] = item2.specsValue
        obj.specs.push(item2.specs)
        this.tableArrList.push(obj)
        console.log('267this.tableArrList', this.tableArrList)
      })
    } else {
      // 多行选中的
      this.calcGoodsPriceTableData(line1Data, line2Data)
    }
    // -------e-------
  }

  // 计算价格
  private tableArrList:any = [];
  private calcIndex = 1;
  private calcGoodsPriceTableDataArr: any = [];
  private calcGoodsPriceTableData(lineData1: any, lineData2: any) {
    console.log('297this.tableArrList', this.tableArrList)
    console.log('298this.calcIndex', this.calcIndex)
    // this.tableArrList第一次循环，回归初始
    if (this.calcIndex === 1) {
      console.log('301')
      this.tableArrList = []
    }
    this.calcGoodsPriceTableDataArr = []
    this.calcIndex += 1
    lineData1.forEach((item: any) => {
      lineData2.forEach((item2: any) => {
        console.log('308-12', item, item2)
        let arr:any = []
        // 处理数据结构
        // item = [item]
        if (this.calcIndex > 2) {
          arr = item.concat(item2)
          console.log('314arr', arr)
        } else {
          arr.push(item)
          arr.push(item2)
        }
        console.log('319arr', arr)
        this.calcGoodsPriceTableDataArr.push(arr)
      })
    })
    // length需要结合选中行的数据的行数
    // this.goodsAttrCategoryValues.length
    console.log('325calcIndex', this.calcIndex)
    console.log('326selectedAttrLineCount', this.selectedAttrLineCount)
    if (this.calcIndex < this.selectedAttrLineCount) {
      // 递归进行下一次循环
      console.log('329this.goodsAttrCategoryValuesCloneDeep', this.goodsAttrCategoryValuesCloneDeep)
      this.calcGoodsPriceTableData(
        this.calcGoodsPriceTableDataArr,
        this.goodsAttrCategoryValuesCloneDeep[this.calcIndex].attrValuesSecltedObj
      )
    } else {
      // calcIndex、selectedAttrLineCount回归初始
      this.calcIndex = 1
      this.selectedAttrLineCount = 0
      // 规格组装后--再次组装table需要的数据
      console.log('333calcGoodsPriceTableDataArr', this.calcGoodsPriceTableDataArr)
      this.calcGoodsPriceTableDataArr.forEach((item:any) => {
        console.log('325', item)
        const obj:any = {
          salePrice: 0,
          shelvesCount: 0,
          warningStock: 0,
          discountRatio: 0,
          specs: []
        }
        item.forEach((item2:any) => {
          obj[item2.specsCode] = item2.specsValue
          obj.specs.push(item2.specs)
        })
        this.tableArrList.push(obj)
      })
      console.log('352this.tableArrList', this.tableArrList)
    }
    // 第一步首先要过滤数据，去掉一行规格中没有选中的行
    // 这里循环了n次，每次都是最后一次结果，是for循环的问题
    // 这里得到了规格需要的数据，还需要每一种规格对应的name，及其他数据，还需要继续组装
    // 每次添加后要清空，保证不出问题
    // TypeError: item.concat is not a function
    // 如果修改价格里边的数据后，再次修改规格，若要保持原来的数据，就要在修改规格前保存一份数据，修改后把原来旧的数据对应的字段再次赋值
  }

  private handleClose() {
    this.goodsAttrVisible = false
  }

  // 上一步
  private lastStep(active:number) {
    this.$emit('lastStep', active)
  }

  // 提交
  private submitHandle() {
    // 属性、价格
    const obj = {
      attr: this.goodsAttrCategoryValues,
      price: this.tableArrList
    }
    console.log('383', this.tableArrList.length)
    console.log('384', this.tableArrList)
    if (this.tableArrList.length === 0) {
      this.$notify.warning('请完善信息')
      return false
    }
    this.$emit('goodsAttrFormData', obj)
  }
}
</script>

<style lang="scss" scoped>
.goodsAttrComponent {
  // width: 80%;
  // margin: 0 auto;
  padding: 30px 0 0 0;
  .attrContent {
    margin-bottom: 30px;
    .attrContent_list {
      display: flex;
      padding: 15px 0;
      .attrContent_list_label {
        padding: 0 15px;
        line-height: 32px;
      }
    }
  }
  .el-checkbox{
    margin-right: 20px;
    line-height: 32px;
  }
  .splitLine{
    border-top: 4px solid #f2f2f2;
    margin: 0 -10px 10px -10px;
  }
  .goodsInfoTableWrap{
    padding: 10px;
  }
  .title{
    border-left: 4px solid #157fdf;
    line-height: 40px;
    font-size: 16px;
    text-indent: 10px;
    margin: -10px 0 0 0px;
    color: #1890ff;
  }
  .submit {
    display: flex;
    justify-content: center;
    padding-bottom: 10px;
  }
}
</style>
