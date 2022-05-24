// 商品管理-上架-商品分类
<template>
  <div class="goods-classify-container">
    <!-- 最近使用的商品分类 -->
    <div class="splitLine"></div>
    <div class="lately-on-sale">
      <div>
        <span>最近使用的商品分类:</span>
        <span v-for="(item, index) in lastGoodsCategory" :key="index">
          {{item.categoryName}}
        </span>
        <el-button v-if="lastGoodsCategory.length>0">默认使用</el-button>
      </div>
    </div>
    <!-- 获取多级分类 -->
    <div class="goodsClassify">
      <ul
        class="goodsClassify_list"
        v-for="(item, index) in classifyList"
        :key="index"
      >
        <li class="goodsClassify_list_title">
          <b>选择{{ index + 1}}级分类</b>
        </li>
        <li
          class="goodsClassify_list_item"
          :style="activeStyle(index, item2)"
          v-for="(item2, index2) in classifyList[index]"
          :key="index2"
          @click="getClassify(item2,index)"
        >
          {{ item2.categoryName }}
          <span class="goodsClassify_list_item_arrow"> > </span>
        </li>
      </ul>
    </div>
    <div class="splitLine"></div>
    <div class="submit">
      <el-button type="primary" @click="submitHandle"
        >下一步，填写商品信息</el-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getGoodsCategory, getLastGoodsCategory } from '@/api/goods'

@Component({
  name: 'goods-classify-container',
  components: {}
})
export default class extends Vue {
  created() {
    this.getClassify('', 0)
    this.getLastGoodsCategory()
  }

  private classifyForm = {
    classify: ''
  };

  classifyListArr: Array<any> = [];
  private classifyList = this.classifyListArr;
  classifyPathArr: Array<any> = [];
  private classifyPath = this.classifyPathArr;

  private async getClassify(item: any = {}, index:any) {
    console.log('67', item, index)
    if (this.classifyList.length > 5) {
      return false
    }
    // 当不按照顺序点击时，重新计算list与path
    this.classifyPath.splice(index, 3)
    this.classifyList.splice(index + 1, 3)
    const params = {
      categoryId: item.categoryId
    }
    await getGoodsCategory(params).then((res: any) => {
      if (res.code === '0') {
        console.log('77', item)
        const data = res.payload
        if (item.categoryId) {
          this.$nextTick(() => {
            // 添加到path
            this.classifyPath.push(item)
          })
          console.log('84', this.classifyPath)
        }
        if (data.length > 0) {
          // 添加到list
          console.log('87this.classifyList', this.classifyList)
          this.classifyList.push(data)
        }
      }
    })
  }

  private lastGoodsCategory:any = []
  private async getLastGoodsCategory() {
    await getLastGoodsCategory({})
      .then((res) => {
        if (res.code === '0') {
          const data = res.payload
          if (data.length === 0) {
            return false
          }
          this.lastGoodsCategory = data
          // 顺序执行
          let captchaCountdown:any = 0
          const timer = setInterval(() => {
            captchaCountdown += 1
            this.getClassify(data[captchaCountdown - 1], captchaCountdown - 1)
            if (captchaCountdown === data.length - 1) {
              clearInterval(timer)
            }
          }, 200)
          // 最后执行，选中最后一个
          setTimeout(() => {
            console.log('118')
            this.getClassify(data[data.length - 1], data.length - 1)
          }, 1000)
        }
      })
  }

  // 样式
  private activeStyle(index:any, item2:any) {
    // console.log('111', index, item2, this.classifyPath)
    if (this.classifyPath[index]) {
      // console.log('112', this.classifyPath[index].categoryId)
      // console.log('113', item2.categoryId)
    }
    if ((this.classifyPath[index] ? this.classifyPath[index].categoryId : '00000') === item2.categoryId) {
      console.log('129')
      return {
        color: '#4d84ff',
        'font-weight': 'bold'
      }
    }
  }

  private async onSubmit() {
    console.log('search')
  }

  // 下一步
  private submitHandle() {
    if (this.classifyPath.length === 0) {
      this.$notify.warning('请选择商品分类')
      return false
    }
    this.$emit('getClassifyPathData', this.classifyPath)
    console.log('submit', this.classifyPath)
  }
}
</script>

<style lang="scss" scoped>
.goods-classify-container {
  .lately-on-sale {
    text-indent: 35px;
    padding: 10px 0;
  }
  .goodsClassify {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    .goodsClassify_list {
      border: 1px solid #666;
      border-radius: 10px;
      padding: 20px 30px;
      margin: 0 20px;
      .goodsClassify_list_title {
        list-style: none;
        padding: 0 0 20px 0;
      }
      .goodsClassify_list_item {
        cursor: pointer;
        padding: 10px 0;
        position: relative;
        .goodsClassify_list_item_classifyActive {
          color: #4d84ff;
          font-weight: bold;
        }
        .goodsClassify_list_item_arrow {
          position: absolute;
          top: 12px;
          right: -15px;
        }
      }
    }
  }
  .splitLine{
    border-top: 4px solid #f2f2f2;
    margin: 20px -10px 10px -10px;
  }
  .submit {
    display: flex;
    justify-content: center;
    padding-bottom: 10px;
  }
}
</style>
