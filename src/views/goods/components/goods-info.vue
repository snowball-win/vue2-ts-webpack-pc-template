// 商品信息
<template>
  <div class="goods-info-container">
    <div class="goods-info-content">
      <el-form
        ref="goodsInfoForm"
        :model="goodsInfoForm"
        :rules="userRules"
        label-position="right"
      >
        <div class="splitLine"></div>
        <div class="title">基础信息</div>
        <el-form-item prop="goodsCategory" label="商品分类" label-width="300px">
          <span v-for="(item, index) in classifyPath" :key="index">
            {{ item.categoryName }}
          </span>
        </el-form-item>
        <el-form-item prop="goodsName" label="商品名称" label-width="300px">
          <el-input
            v-model="goodsInfoForm.goodsName"
            placeholder="商品名称"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="auxiliaryTitle" label="副标题" label-width="300px">
          <el-input
            v-model="goodsInfoForm.auxiliaryTitle"
            placeholder="副标题"
            type="text"
          />
        </el-form-item>
        <el-form-item
          prop="goodsAttribute"
          label="商品属性分类"
          label-width="300px"
        >
          <!-- <el-input
            v-model="goodsInfoForm.goodsAttribute"
            placeholder="商品属性分类"
            type="text"
          /> -->
          <el-select
            v-model="goodsInfoForm.goodsAttribute"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in goodsAttributeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="goodsIntroduce"
          label="商品介绍"
          label-width="300px"
        >
          <el-input
            v-model="goodsInfoForm.goodsIntroduce"
            placeholder="商品介绍"
            type="text"
          />
        </el-form-item>
        <div class="splitLine"></div>
        <div class="title">上架信息</div>
        <el-form-item prop="showTerminals" label="上架终端" label-width="300px">
          <el-select
            v-model="goodsInfoForm.showTerminals"
            multiple
            placeholder="请选择"
            @blur.native.capture="e => searchKeyBlur(e, 'goodsInfoForm','showTerminals')"
          >
            <el-option
              v-for="item in terminalsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="sort" label="货架排序" label-width="300px">
          <el-input
            v-model="goodsInfoForm.sort"
            placeholder="货架排序"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="goodsNumber" label="商品货号" label-width="300px">
          <el-input
            v-model="goodsInfoForm.goodsNumber"
            placeholder="商品货号"
            type="text"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="splitLine"></div>
    <div class="goods-info-operate">
      <div class="content">
        <el-button type="" @click="goodsInfoTabsChange(0)"
          >web端详情</el-button
        >
        <!-- <el-button type="text">移动端详情</el-button> -->
        <el-button type="" @click="goodsInfoTabsChange(1)"
          >商品图片</el-button
        >
        <el-button type="" @click="goodsInfoTabsChange(2)"
          >商品视频</el-button
        >
      </div>
    </div>
    <!-- web端详情 -->
    <div class="goods-info-editor" v-show="tabIndex === 0">
      <div class="content">
        <div class="goods-info-fileIntroduce">
          <span class="title">上传电子说明</span>
          <el-upload
            class="upload-demo"
            action="string"
            :before-upload="beforeUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :limit="1000"
            :on-exceed="handleExceed"
            :http-request="toRequest"
            :file-list="goodsInfoForm.fileIntroduce"
          >
            <el-button size="small" type="primary">浏览</el-button>
            <!-- <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div> -->
          </el-upload>
        </div>
        <!-- 详细说明 -->
        <tinymce
          v-if="tinymceActive"
          ref="editor"
          v-model="goodsInfoForm.detailDescription"
          :height="400"
          :request="request"
        />
      </div>
    </div>
    <!-- 商品图片 -->
    <div class="goods-info-uploadImg" v-show="tabIndex === 1">
      <div class="content">
        <span class="title">上传商品图片</span>
        <el-upload
          class="upload-demo"
          action="string"
          :before-upload="beforeUpload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :limit="1000"
          :on-exceed="handleExceed"
          :http-request="toRequest"
          :file-list="goodsInfoForm.fileIntroduce"
          list-type="picture"
        >
          <el-button size="small" type="primary">浏览</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
        </el-upload>
      </div>
      <!-- <div class="goodsImages_container">
          <ul class="goodsImages_wrapper">
            <li class="goodsImages_list" v-for="(item, index) in goodsInfoForm.goodsImages" :key="index">
              <img class="goodsImages_list_img" :src="item.imageUrl" alt="商品图片">
            </li>
          </ul>
      </div> -->
    </div>
    <!-- 商品视频 -->
    <div class="goods-info-uploadVideo" v-show="tabIndex === 2">
      <div class="content">
        <span class="title">上传商品视频</span>
        <el-upload
          class="upload-demo"
          action="string"
          :before-upload="beforeUpload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :limit="1000"
          :on-exceed="handleExceed"
          :http-request="toRequest"
          :file-list="goodsInfoForm.fileIntroduce"
        >
          <el-button size="small" type="primary">浏览</el-button>
          <div slot="tip" class="el-upload__tip">只能上传mp4/avi文件</div>
        </el-upload>
      </div>
      <div class="goodsVideo_container">
          <ul class="goodsVideo_wrapper">
            <li class="goodsVideo_list" v-for="(item, index) in goodsInfoForm.goodsVideos" :key="index">
              <img class="goodsVideo_list_img" src="../../../assets/images/goods/videoplayer.jpg" alt="商品视频">
            </li>
          </ul>
      </div>
    </div>
    <div class="splitLine splitLineMenuContent"></div>
    <div class="submit">
      <el-button type="primary" @click="lastStep(1)">上一步</el-button>
      <el-button type="primary" @click="submitHandle"
        >下一步，填写商品属性</el-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { isValidUsername } from '@/utils/validate'
import Tinymce from '@/components/Tinymce/index.vue'
import { showTerminal, fileUpload, getAttrCategory } from '@/api/goods'
import UploadImage from '@/components/UploadImage/index.vue'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'goods-info-container',
  components: {
    Tinymce,
    UploadImage
  }
})
export default class extends Vue {
  @Prop({ default: () => [] }) private classifyPath!: any[];
  private request = fileUpload

  created() {
    this.getTerminals()
    this.getAttrCategory()
  }

  mounted() {
    console.log('124', this.classifyPath)
  }

  fileIntroduceArr: Array<any> = [];
  fileGoodsImagesArr: Array<any> = [];
  fileGoodsVideosArr: Array<any> = [];
  private goodsInfoForm = {
    goodsCategory: '', // 商品分类
    goodsName: '', // 商品名称
    auxiliaryTitle: '', // 副标题
    goodsAttribute: '', // 商品属性分类
    goodsIntroduce: '', // 商品介绍
    showTerminals: null, // 上架终端
    sort: '', // 货架排序
    goodsNumber: '', // 商品货号
    fileIntroduce: this.fileIntroduceArr, // 电子说明
    detailDescription: '', // 详细说明
    goodsImages: this.fileGoodsImagesArr, // 商品图片
    goodsVideos: this.fileGoodsVideosArr // 商品视频
  };

  private fileList = []; // 电子说明
  private handleRemove(file: any, fileList: any) {
    console.log('258', file, fileList)
    if (this.tabIndex === 0) { // web详情
      // this.goodsInfoForm.goodsVideos.forEach((item, index) => {
      //   console.log('269', item)
      //   if (item.file.uid === file.uid) {
      //     this.goodsInfoForm.goodsVideos.splice(index, 1)
      //   }
      // })
    } else if (this.tabIndex === 1) { // 商品图片
      this.goodsInfoForm.goodsImages.forEach((item, index) => {
        if (item.file.uid === file.uid) {
          this.goodsInfoForm.goodsImages.splice(index, 1)
        }
      })
    } else if (this.tabIndex === 2) { // 商品视频
      this.goodsInfoForm.goodsVideos.forEach((item, index) => {
        console.log('269', item)
        if (item.file.uid === file.uid) {
          this.goodsInfoForm.goodsVideos.splice(index, 1)
        }
      })
      console.log('264', this.goodsInfoForm.goodsVideos)
    }
  }

  private beforeUpload(file: any) {
    console.log(file)
  }

  private handlePreview(file: any) {
    console.log(file)
  }

  private handleExceed() {
    this.$message.warning(
      // `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
      //   files.length + fileList.length
      // } 个文件`
      '文件数量超出'
    )
  }

  private beforeRemove(file: any) {
    return this.$confirm(`确定移除 ${file.name}？`)
  }

  private terminalsOptions = [];
  // 终端展示枚举
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

  private goodsAttributeOptions = [];
  // 商品属性分类
  private async getAttrCategory() {
    const params = {
      keywords: ''
    }
    await getAttrCategory(params).then((res: any) => {
      if (res.code === '0') {
        const data = res.payload
        console.log('224data', data)
        this.goodsAttributeOptions = data.map((item: any) => {
          return {
            value: item.attrCateId,
            label: item.attrCateName
          }
        })
      }
    })
  }

  // 上传电子说明
  private async toRequest(dataA: any) {
    // 发起请求
    console.log('331', dataA)
    const fd = new FormData()
    fd.append('file', dataA.file)
    fd.append('authorization', UserModule.Authorization)
    await fileUpload(fd).then((res: any) => {
      if (res.code === '0') {
        const data = res.payload
        console.log('304', data)
        if (this.tabIndex === 0) {
          this.goodsInfoForm.fileIntroduce.push(data)
        } else if (this.tabIndex === 1) {
          const item = {
            imageUrl: data,
            mainFlag: 0,
            file: dataA.file
          }
          this.goodsInfoForm.goodsImages.push(item)
        } else if (this.tabIndex === 2) {
          const item = {
            imageUrl: data,
            file: dataA.file
          }
          this.goodsInfoForm.goodsVideos.push(item)
        }
      }
    })
  }

  // 切换tab
  private tabIndex = 0;
  private goodsInfoTabsChange(index: number) {
    this.tabIndex = index
  }

  private tinymceActive = true;

  deactivated() {
    this.tinymceActive = false
  }

  activated() {
    this.tinymceActive = true
  }

  private validateGoodsName = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidUsername(value)) {
      callback(new Error('请输入商品名称'))
    } else {
      callback()
    }
  };

  private validateName = (rule: any, value: string, callback: Function) => {
    if (!isValidUsername(value)) {
      callback(new Error('请输入用户名'))
    } else {
      callback()
    }
  };

  private validateAuxiliaryTitle = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidUsername(value)) {
      callback(new Error('请输入副标题'))
    } else {
      callback()
    }
  };

  private validateGoodsAttribute = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidUsername(value)) {
      callback(new Error('请输入商品属性分类'))
    } else {
      callback()
    }
  };

  private validateAgoodsIntroduce = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidUsername(value)) {
      callback(new Error('请输入商品介绍'))
    } else {
      callback()
    }
  };

  private validateShowTerminals = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    console.log('429', value)
    if (value.length === 0) {
      callback(new Error('请选择上架终端'))
    } else {
      callback()
    }
  };

  private searchKeyBlur(e:any, formName:string, type:any) {
    const refs:any = this.$refs[formName]
    refs.validateField(type)
    // 代表触发 formName 表单所对应 type 属性的规则
  }

  private validateSort = (rule: any, value: string, callback: Function) => {
    if (!isValidUsername(value)) {
      callback(new Error('请输入货架排序'))
    } else {
      callback()
    }
  };

  private validateGoodsNumber = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidUsername(value)) {
      callback(new Error('请输入商品货号'))
    } else {
      callback()
    }
  };

  private userRules = {
    goodsName: [
      {
        validator: this.validateGoodsName,
        trigger: 'blur',
        required: true
      }
    ],
    auxiliaryTitle: [
      {
        validator: this.validateAuxiliaryTitle,
        trigger: 'blur',
        required: true
      }
    ],
    goodsAttribute: [
      {
        validator: this.validateGoodsAttribute,
        trigger: 'change',
        required: true
      }
    ],
    goodsIntroduce: [
      {
        validator: this.validateAgoodsIntroduce,
        trigger: 'blur',
        required: true
      }
    ],
    showTerminals: [
      {
        validator: this.validateShowTerminals,
        trigger: ['blur'],
        required: true
      }
    ],
    sort: [
      {
        validator: this.validateSort,
        trigger: 'blur',
        required: true
      }
    ],
    goodsNumber: [
      {
        validator: this.validateGoodsNumber,
        trigger: 'blur',
        required: true
      }
    ]
  };

  private lastStep(active: number) {
    this.$emit('lastStep', active)
  }

  // 提交
  private submitHandle() {
    (this.$refs.goodsInfoForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        // if (this.goodsInfoForm.fileIntroduce.length === 0) {
        //   this.$notify.warning('请上传电子说明')
        //   return false
        // }
        const editorStr: any = this.goodsInfoForm.detailDescription
          .toString()
          .replace(/[\r\n]/g, '')
          .match(/(?<=<body>).*?(?=<\/body>)/)
        if (editorStr[0] === '') {
          this.$notify.warning('请填写详细说明')
          return false
        }
        this.$emit('goodsInfoFormData', this.goodsInfoForm)
      } else {
        return false
      }
    })
  }
}
</script>
// 没有scoped用来覆盖样式，新起一个style
<style lang="scss">
.goods-info-container {
  .el-input__inner {
    width: 350px;
  }
  .el-upload-list{
    display: flex;
  }
  .el-upload-list--picture .el-upload-list__item{
    width: 280px;
    margin-right: 20px;
  }
}
</style>
<style lang="scss" scoped>
.goods-info-container {
  .goods-info-content {
    // width: 500px;
    // margin: 0 auto;
    padding: 50px 0;
    .title{
      border-left: 4px solid #157fdf;
      line-height: 40px;
      font-size: 16px;
      text-indent: 10px;
      color: #1890ff;
      // margin: -10px 0 0 -10px;
    }
  }
  .splitLine{
    border-top: 4px solid #f2f2f2;
  }
  .splitLineMenuContent{
    margin: 10px -10px 10px -10px;
  }
  .goods-info-operate {
    padding-top: 10px;
    display: flex;
    justify-content: center;
    .content {
      width: 80%;
    }
  }
  .goods-info-editor {
    .content {
      width: 80%;
      margin: 0 auto;
    }
    .goods-info-fileIntroduce {
      display: flex;
      align-items: center;
      padding: 20px 0;
      .title {
        display: flex;
        align-content: center;
        margin-right: 20px;
      }
    }
  }
  .goods-info-uploadImg {
    .content {
      width: 80%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      padding: 20px 0;
      .el-upload__tip{
        padding-top: 10px;
      }
      .title {
        padding: 20px 20px 20px 0;
        width: 145px;
      }
      .upload-demo{
        width: 100%;
        .el-upload-list--picture .el-upload-list__item{
          width: 280px;
        }
      }
    }
    .goodsImages_container{
      .goodsImages_wrapper{
        width: 80%;
        margin: 0 auto;
        display: flex;
        .goodsImages_list{
          width: 200px;
          height: 120px;
          overflow: hidden;
          margin-right: 15px;
          .goodsImages_list_img{
            // width: 100%;
            height: 120px;
          }
        }
      }
    }
  }
  .goods-info-uploadVideo {
    padding: 20px 0;
    .content {
      width: 80%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      .el-upload__tip{
        padding-top: 10px;
      }
      .title {
        padding: 20px 20px 20px 0;
        width: 145px;
      }
      .upload-demo{
        width: 100%;
      }
    }
    .goodsVideo_container{
      .goodsVideo_wrapper{
        width: 80%;
        margin: 0 auto;
        display: flex;
        .goodsVideo_list{
          width: 200px;
          height: 120px;
          overflow: hidden;
          margin-right: 15px;
          display: flex;
          border: 1px solid #e2e2e2;
          .goodsVideo_list_img{
            // width: 100%;
            margin: 0 auto;
            height: 120px;
          }
        }
      }
    }
  }
  .submit {
    display: flex;
    justify-content: center;
    padding-bottom: 10px;
  }
}
</style>
