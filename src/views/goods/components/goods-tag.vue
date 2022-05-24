// 商品标签
<template>
  <div class="goodsTagContainer">
    <div class="splitLine"></div>
    <div class="content">
      <el-form
        ref="goodsTagForm"
        :model="goodsTagForm"
        :rules="tagRules"
        label-position="right"
      >
        <el-form-item prop="spuId" label="关联产品" label-width="300px">
          <el-select
            v-model="goodsTagForm.spuId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="getProduct"
            @change="changeSpuId"
            style="width:100%;"
          >
            <el-option
              v-for="item in goodsTagOptions"
              :key="item.spuId"
              :label="item.spuName"
              :value="item.spuId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="spuNo"
          label="产品标准号"
          label-width="300px"
        >
          <el-input
            v-model="goodsTagForm.spuNo"
            placeholder="产品标准号"
            disabled
            type="text"
          />
        </el-form-item>
        <el-form-item prop="licenseNumber" label="生产许可证" label-width="300px">
          <el-input
            v-model="goodsTagForm.licenseNumber"
            placeholder="生产许可证"
            disabled
            type="text"
          />
        </el-form-item>
        <el-form-item label="发证日期" label-width="300px">
          <el-input
            v-model="goodsTagForm.dateOfIssue"
            placeholder="发证日期"
            disabled
            type="text"
          />
        </el-form-item>
        <el-form-item label="证书有效期" label-width="300px">
          <el-date-picker
            v-model="goodsTagForm.certificateValidity"
            type="datetime"
            disabled
            placeholder="选择日期时间"
            style="width:100%;"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发证机构" label-width="300px">
          <el-input
            v-model="goodsTagForm.issuingAuthority"
            placeholder="发证机构"
            disabled
            type="text"
          />
        </el-form-item>
        <el-form-item label="产品名称" label-width="300px">
          <el-input
            v-model="goodsTagForm.spuName"
            placeholder="产品名称"
            disabled
            type="text"
          />
        </el-form-item>
        <el-form-item label="产品产地" label-width="300px">
          <el-input
            v-model="goodsTagForm.placeOfOrigin"
            placeholder="产品产地"
            disabled
            type="text"
          />
        </el-form-item>
        <el-form-item label="生产企业" label-width="300px">
          <el-input
            v-model="goodsTagForm.manufacturer"
            placeholder="生产企业"
            disabled
            type="text"
          />
        </el-form-item>
        <el-form-item label="生产企业地址" label-width="300px">
          <el-input
            v-model="goodsTagForm.manufacturerAddr"
            placeholder="生产企业地址"
            disabled
            type="text"
          />
        </el-form-item>
        <el-form-item label="联系电话" label-width="300px">
          <el-input
            v-model="goodsTagForm.contactNumber"
            placeholder="联系电话"
            disabled
            type="text"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="splitLine"></div>
    <div class="submit">
      <el-button type="primary" @click="lastStep(3)"
        >上一步</el-button
      >
      <el-button type="primary" @click="submitHandle">完成，提交商品</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
// import { isValidUsername, isValidPhone } from '@/utils/validate'
import Tinymce from '@/components/Tinymce/index.vue'
import { showTerminal, getProduct } from '@/api/goods'
import UploadImage from '@/components/UploadImage/index.vue'

@Component({
  name: 'goodsTagContainer',
  components: {
    Tinymce,
    UploadImage
  }
})
export default class extends Vue {
  @Prop({ default: () => [] }) private classifyPath!: any[];

  created() {
    this.getTerminals()
  }

  mounted() {
    this.getProduct('')
  }

  private goodsTagForm:any = {
    goodsCategory: '', // 商品分类
    licenseNumber: '', // 生产许可证号
    spuNo: '', // 产品编码
    spuId: '', // 关联产品id
    dateOfIssue: '', // 发证日期
    certificateValidity: '', // 证书有效期
    issuingAuthority: '', // 发证机构
    spuName: '', // 产品名称
    placeOfOrigin: '', // 产品产地
    manufacturer: '', // 产品企业
    manufacturerAddr: '', // 产品企业地址
    contactNumber: '' // 联系电话
  };

  private validateSpuId = (rule: any, value: string, callback: Function) => {
    if (value.length === 0) {
      callback(new Error('请选择关联产品'))
    } else {
      callback()
    }
  };

  private tagRules = {
    spuId: [
      {
        validator: this.validateSpuId,
        trigger: 'change',
        required: true
      }
    ]
  };

  private fileList = []; // 电子说明

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

  private goodsTagOptions = [];
  // 获取产品主数据
  private async getProduct(kewvords: any) {
    const params = {
      page: 1,
      size: 20,
      kewvords: kewvords
    }
    await getProduct(params).then((res: any) => {
      if (res.code === '0') {
        const data = res.payload
        this.goodsTagOptions = data.list
      }
    })
  }

  private changeSpuId(id:any) {
    const data = this.goodsTagOptions.filter((item:any) => {
      return id === item.spuId
    })
    this.goodsTagForm = data[0]
    this.$emit('goodsTagFormSpuId', this.goodsTagForm.spuId)
  }

  private tinymceActive = true;

  // 上一步
  private lastStep(active:number) {
    this.$emit('lastStep', active)
  }

  // 提交
  private submitHandle() {
    (this.$refs.goodsTagForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.$emit('onSubmitGoodsInfo')
      } else {
        return false
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.goodsTagContainer {
  .splitLine{
    border-top: 4px solid #f2f2f2;
    margin: 10px -10px 10px -10px;
  }
  .content {
    // width: 500px;
    margin: 0 auto;
    padding: 50px 0 0 0;
  }
  .submit {
    display: flex;
    justify-content: center;
    padding-bottom: 10px;
  }
}
</style>
<style lang="scss">
.goodsTagContainer{
  .el-input__inner{
    width: 290px;
  }
}
</style>
