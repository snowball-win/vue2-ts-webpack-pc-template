// 菜单配置-新建菜单
<template>
  <div class="add-menu-wrap">
    <div class="content">
      <el-form
        ref="createMenuForm"
        :model="createMenuForm"
        :rules="userRules"
        label-position="right"
      >
        <div class="title">一级菜单</div>
        <el-form-item v-if="menuType === '2'" label="一级菜单" label-width="300px" prop="firstMenuId">
          <el-select
            v-model="createMenuForm.firstMenuId"
            placeholder="请选择协议类型"
            filterable
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in firstMemuListOptions"
              :key="index"
              :label="item.menuName"
              :value="item.menuId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" label-width="300px" prop="menuName">
          <el-input v-model="createMenuForm.menuName"></el-input>
        </el-form-item>
        <el-form-item label="菜单内容" label-width="300px" prop="contentType">
          <el-select
            v-model="createMenuForm.contentType"
            placeholder="请选择菜单内容"
            filterable
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in contentTypeOptions"
              :key="index"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容形式" label-width="300px" prop="messageType">
          <el-select
            v-model="createMenuForm.messageType"
            placeholder="请选择内容形式"
            filterable
            clearable
            style="width: 100%"
            :disabled="createMenuForm.contentType!=='1'"
          >
            <el-option
              v-for="(item, index) in messageTypeOptions"
              :key="index"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div v-if="createMenuForm.contentType === '1'">
          <div class="splitLine splitLineMenuContent"></div>
          <div class="title">菜单内容</div>
          <el-form-item v-if="createMenuForm.messageType === '1'" label="资讯标题" label-width="300px" prop="msgTitle">
            <el-input v-model="createMenuForm.msgTitle" type="textarea" maxlength="60" placeholder="请输入不超过60个汉字"></el-input>
          </el-form-item>
          <el-form-item v-if="createMenuForm.messageType === '1'" label="资讯摘要" label-width="300px" prop="msgAbstract">
            <el-input v-model="createMenuForm.msgAbstract" type="textarea" maxlength="60" placeholder="请输入不超过60个汉字"></el-input>
          </el-form-item>
          <el-form-item v-if="createMenuForm.messageType === '1'" label="是否原创" label-width="300px" prop="originalFlag">
            <el-select
              v-model="createMenuForm.originalFlag"
              placeholder="请选择协议类型"
              filterable
              clearable
              style="width: 100%"
              :filter-method="getProtocolManagerTypeList"
            >
              <el-option
                v-for="(item, index) in originalFlagOptions"
                :key="index"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="封面图是否显示在正文" label-width="300px" prop="showCoverPicInContent">
            <el-select
              v-model="createMenuForm.showCoverPicInContent"
              placeholder="请选择"
              filterable
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in originalFlagOptions"
                :key="index"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="createMenuForm.messageType === '1'" label="原创作者" label-width="300px" prop="msgAuthor">
            <el-input v-model="createMenuForm.msgAuthor" placeholder="请输入不超过150个汉字"></el-input>
          </el-form-item>
          <el-form-item v-if="createMenuForm.messageType === '1'" label="原文链接" label-width="300px" prop="contentSourceUrl">
            <el-input v-model="createMenuForm.contentSourceUrl" placeholder="请输入不超过150个汉字"></el-input>
          </el-form-item>
          <el-form-item class="upload-el-image-wrap" v-if="createMenuForm.messageType === '1' || createMenuForm.messageType === '3'" label="封面图片/图片" label-width="300px" prop="imageFile">
            <!-- <el-input v-model="createMenuForm.imageFile" placeholder="请上传图片"></el-input> -->
            <!-- <div>{{imgFileSrc}}</div> -->
            <el-image v-if="imgFileSrc" ref="img" class="upload-el-image" :preview-src-list="[imgFileSrc]" :src="imgFileSrc" fit="contain" />
            <el-upload
              class="upload-ready display-none"
              :style="{display: 'inline-block'}"
              action="#"
              :auto-upload="false"
              :file-list="[]"
              :on-change="onFileChange"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :on-exceed="handleExceed"
            >
              <el-button v-if="imgFileSrc" size="small" type="primary">重新上传</el-button>
              <el-button v-else size="small" type="primary">上传</el-button>
            </el-upload>
            <div v-if="imgFileSrc" class="deleteImgFile" @click="deleteImgFile">x</div>
            <!-- <el-button v-if="imgFileSrc" size="small" type="primary" class="preview" @click="onPreview">预览</el-button> -->
          </el-form-item>
          <el-form-item v-if="createMenuForm.messageType === '2'" class="submitContent" prop="submitContent" label="资讯正文" label-width="300px">
            <el-input v-model="createMenuForm.submitContent" type="textarea" maxlength="300" placeholder="请输入不超过300个汉字"></el-input>
          </el-form-item>
          <el-form-item v-if="createMenuForm.messageType === '1'" class="submitContent submitContent__tinymce" prop="submitContent" label="资讯正文" label-width="300px">
            <tinymce
              ref="editor"
              v-model="createMenuForm.submitContent"
              :height="400"
              :pramas="pramas"
              :request="request"
              :file-prop="'imageFile'"
            />
          </el-form-item>
        </div>
        <!-- 跳转页面 -->
        <div v-if="createMenuForm.contentType === '2'">
          <div>
            订阅者点击该子菜单会跳到以下链接
          </div>
          <!-- <el-form-item label="跳转功能页面" label-width="300px" prop="submitContent">
            <el-input v-model="createMenuForm.submitContent" placeholder="请输入页面地址"></el-input>
          </el-form-item> -->
          <el-form-item label="功能页面地址" label-width="300px" prop="protocolTypeCode">
            <el-input v-model="createMenuForm.submitContent" placeholder="功能页面地址"></el-input>
          </el-form-item>
        </div>
        <!-- 跳转小程序 -->
        <div v-if="createMenuForm.contentType === '3'">
          <div>
            订阅者点击该子菜单会跳到以下小程序
          </div>
          <el-form-item label="小程序ID" label-width="300px" prop="submitConent">
            <el-input v-model="createMenuForm.submitConent" placeholder="功能页面地址"></el-input>
          </el-form-item>
          <el-form-item label="跳转连接" label-width="300px" prop="pagePath">
            <el-input v-model="createMenuForm.pagePath" placeholder="小程序页面路径"></el-input>
          </el-form-item>
          <el-form-item label="备用页面" label-width="300px" prop="spareUrl">
            <el-input v-model="createMenuForm.spareUrl" placeholder="功能页面地址"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div class="splitLine splitLineMenuContent"></div>
      <div class="submit">
        <el-button type="primary" @click="goBack">返回</el-button>
        <el-button type="primary" v-if="editType === 'add'" @click="submitHandle">提交</el-button>
        <el-button type="primary" v-else @click="submitEditHandle">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { isValidVoid } from '@/utils/validate'
import Tinymce from '@/components/Tinymce/index.vue'
import { fileManagerUploadImageGetUrl, gzhMenuManagerCreate, gzhMenuManagerEdit, gzhProtocolManagerTypeList, gzhMenuManagerGetMenuTree, gzhMenuManagerDetail } from '@/api/wechat'
@Component({
  name: 'add-menu-wrap',
  components: { Tinymce }
})
export default class extends Vue {
  created() {
    this.getMenuDetailByMenuId()
    // this.getProtocolManagerTypeList()
    this.getFirstMenuTreeList() // 一级菜单list
    console.log('160000', this.$route.query.gzhId, this.$route.query.menuType, this.$route.query.edit)
  }

  private menuType = this.$route.query.menuType || '' // 1 一级菜单 2 二级菜单
  private menuId = this.$route.query.menuId || '' // 菜单id
  private editType = this.$route.query.edit || ''
  private protocolId = this.$route.query.gzhId
  private pramas: { gzhId?: unknown} = { gzhId: this.$route.query.gzhId }
  private request = fileManagerUploadImageGetUrl

  private validateMenuName = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      callback(new Error('请输入菜单名称'))
    } else {
      callback()
    }
  };

  private firstMemuListOptions = []
  // 获取菜单树详情
  private getFirstMenuTreeList() {
    if (!this.$route.query.gzhId) {
      return
    }
    const params = {
      gzhId: this.$route.query.gzhId,
      menuType: '1'
    }
    gzhMenuManagerGetMenuTree(params).then((res) => {
      if (res.payload.menuTreeList) {
        this.firstMemuListOptions = res.payload.menuTreeList
      }
    })
  }

  private validateMessageType = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      callback(new Error('请选择内容形式'))
    } else {
      callback()
    }
  };

  private validateFirstMenuId = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      callback(new Error('请选择一级菜单'))
    } else {
      callback()
    }
  };

  private validateContentType = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      callback(new Error('请选择菜单内容'))
    } else {
      callback()
    }
  };

  private validateMsgTitle = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      callback(new Error('请输入资讯标题'))
    } else {
      callback()
    }
  };

  private validateImageFile = (rule: any, value: any, callback: Function) => {
    if (!isValidVoid(value)) {
      callback(new Error('请上传封面图'))
    } else {
      callback()
    }
  };

  private validateSubmitContent = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    value = value.replaceAll('\n', '')
    console.log('255val', value)
    if (value.includes('<body')) {
      const rx = /<body[^>]*>([\s\S]+?)<\/body>/i
      rx.exec(value)
      console.log('258val', rx.exec(value))
      if (rx.exec(value) === null) {
        callback(new Error('请输入资讯正文'))
      } else {
        callback()
      }
    } else {
      if (value === null || value === '') {
        callback(new Error('请输入资讯正文'))
      } else {
        callback()
      }
    }
  };

  private createMenuForm:any = {
    gzhId: this.$route.query.gzhId || '',
    contentType: '1', // 菜单内容
    messageType: '1', // 内容形式
    firstMenuId: '', // 一级菜单
    menuName: '', // 菜单名称
    msgAuthor: '', // 原创作者
    msgTitle: '', // 资讯标题
    msgAbstract: '', // 资讯摘要
    contentSourceUrl: '', // 原文url
    imageFile: null, // 封面图片
    submitContent: '', // 小程序页面路径
    spareUrl: '', // 备用页面
    pagePath: '', // 资讯正文
    originalFlag: '', // 是否原创
    showCoverPicInContent: '', // 封面图片是否显示在正文中
    sort: '1' // 排序
  };

  private userRules = {
    menuName: [
      {
        validator: this.validateMenuName,
        trigger: 'blur',
        required: true
      }
    ],
    messageType: [
      {
        validator: this.validateMessageType,
        trigger: ['blur', 'change'],
        required: true
      }
    ],
    firstMenuId: [
      {
        validator: this.validateFirstMenuId,
        trigger: ['blur', 'change'],
        required: true
      }
    ],
    contentType: [
      {
        validator: this.validateContentType,
        trigger: ['blur', 'change'],
        required: true
      }
    ],
    msgTitle: [
      {
        validator: this.validateMsgTitle,
        trigger: ['blur', 'change'],
        required: true
      }
    ],
    msgAbstract: [
      {
        message: '请输入资讯摘要',
        trigger: ['blur', 'change'],
        required: true
      }
    ],
    imageFile: [
      {
        validator: this.validateImageFile,
        trigger: ['blur', 'change'],
        required: true
      }
    ],
    submitContent: [
      {
        validator: this.validateSubmitContent,
        trigger: 'blur',
        required: true
      }
    ]
  };

  // 获取详情
  private getMenuDetailByMenuId() {
    if (!this.menuId) {
      return
    }
    const params = { menuId: this.menuId }
    gzhMenuManagerDetail(params)
      .then((res) => {
        console.log('388res', res)
        if (res.code === '0') {
          console.log('390', Object.keys(res.payload))
          Object.keys(res.payload).forEach(key => {
            if (res.payload[key] !== null) {
              res.payload[key] = res.payload[key].toString()
            }
          })
          res.payload.firstMenuId = res.payload.parentMenuId // 一级菜单
          res.payload.imageFile = res.payload.coverImageMediaUrl // 封面图
          res.payload.submitContent = res.payload.menuContent // 富文本
          res.payload.originalFlag = Number(res.payload.originalFlag) // 封面图是否显示在正文中
          res.payload.showCoverPicInContent = Number(res.payload.showCoverInContent) // 封面图是否显示在正文中
          this.imgFileSrc = res.payload.coverImageMediaUrl // 封面图
          this.createMenuForm = res.payload
        }
      })
  }

  // 菜单内容
  private originalFlagOptions = [
    {
      name: '是',
      value: 1
    },
    {
      name: '否',
      value: 0
    }
  ]

  // 封面图是否显示在正文中
  private showCoverPicInContentOptions = [
    {
      name: '是',
      value: '1'
    },
    {
      name: '否',
      value: '0'
    }
  ]

  // 菜单内容
  private contentTypeOptions = [
    {
      name: '发送消息',
      value: '1'
    },
    {
      name: '跳转网页',
      value: '2'
    },
    {
      name: '跳转小程序',
      value: '3'
    }
  ]

  // 消息类型
  private messageTypeOptions = [
    {
      name: '图文',
      value: '1'
    },
    {
      name: '文字',
      value: '2'
    },
    {
      name: '图片',
      value: '3'
    }
  ]

  private companyList = []
  // 获取详情
  private getProtocolManagerTypeList(companyName = '') {
    gzhProtocolManagerTypeList({ companyName }).then((res) => {
      this.companyList = res.payload
    })
  }

  // 返回
  private goBack() {
    this.$router.go(-1)
  }

  private imgFileSrc = ''
  private onFileChange(file: any) {
    console.log('450', file.raw)
    this.createMenuForm.imageFile = file.raw
    this.imgFileSrc = URL.createObjectURL(file.raw as Blob)
  }

  private deleteImgFile() {
    if (this.createMenuForm.imageFile === '') {
      return
    }
    this.createMenuForm.imageFile = ''
    this.imgFileSrc = ''
    this.$message.success('删除成功')
  }

  private beforeRemove(file: any) {
    return this.$confirm(`确定移除 ${file.name}？`)
  }

  private handleRemove() {
    this.createMenuForm.imageFile = ''
  }

  private handleExceed(file:any) {
    console.log('448', file)
    this.$message.warning('')
  }

  private handlePreview(file: any) {
    console.log(file)
  }

  private onPreview() {
    (this.$refs.img as unknown as { showViewer: boolean }).showViewer = true
  }

  // 提交-新建菜单
  private async submitHandle() {
    console.log('411', this.createMenuForm)
    const form = new FormData()
    form.append('contentType', this.createMenuForm.contentType as string)
    form.append('firstMenuId', this.createMenuForm.firstMenuId as string)
    form.append('gzhId', this.createMenuForm.gzhId as string)
    form.append('imageFile', this.createMenuForm.imageFile as Blob)
    form.append('menuName', this.createMenuForm.menuName as string)
    form.append('contentSourceUrl', this.createMenuForm.contentSourceUrl as string)
    form.append('msgAuthor', this.createMenuForm.msgAuthor as string)
    form.append('messageType', this.createMenuForm.messageType as string)
    form.append('msgAbstract', this.createMenuForm.msgAbstract as string)
    form.append('msgTitle', this.createMenuForm.msgTitle as string)
    form.append('submitContent', this.createMenuForm.submitContent as string)
    form.append('pagePath', this.createMenuForm.pagePath as string)
    form.append('spareUrl', this.createMenuForm.spareUrl as string)
    form.append('sort', this.createMenuForm.sort as string)
    form.append('originalFlag', this.createMenuForm.originalFlag as string)
    form.append('showCoverPicInContent', this.createMenuForm.showCoverPicInContent as string)
    if (this.menuType === '1') {
      await gzhMenuManagerCreate(form).then((res) => {
        if (res.code === '0') {
          this.$message.success('操作成功')
          this.$router.go(-1)
        } else {
          this.$message.error(res.msg)
        }
      })
    } else {
      (this.$refs.createMenuForm as ElForm).validate(
        async(valid: boolean) => {
          if (valid) {
            await gzhMenuManagerCreate(form).then((res) => {
              if (res.code === '0') {
                this.$message.success('操作成功')
                this.$router.go(-1)
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        }
      )
    }
  }

  // 编辑
  private async submitEditHandle() {
    const form = new FormData()
    Object.keys({ ...this.createMenuForm, menuId: this.menuId }).forEach((key:string) => {
      form.append(key, this.createMenuForm[key])
    })
    console.log(form, 'form')
    if (this.menuType === '1') {
      await gzhMenuManagerEdit(form).then((res) => {
        if (res.code === '0') {
          this.$message.success('编辑成功')
          this.$router.go(-1)
        }
      })
    } else {
      (this.$refs.createMenuForm as ElForm).validate(
        async(valid: boolean) => {
          if (valid) {
            await gzhMenuManagerEdit(form).then((res) => {
              if (res.code === '0') {
                this.$message.success('编辑成功')
                this.$router.go(-1)
              }
            })
          } else {
            return false
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.add-menu-wrap {
  padding: 10px;
  height: 100%;
  overflow: auto;
  .content {
    background: #fff;
    width: 100%;
    margin: 0 auto;
    padding: 10px;
    min-height: 100%;
    overflow: auto;
  }
  // .el-form{
  //   width: 900px;
  // }
  .el-form-item{
    margin-bottom: 20px;
  }
  .submit {
    // width: 800px;
    display: flex;
    justify-content: center;
  }
}
</style>
<style lang="scss">
.add-menu-wrap{
  .el-form-item__content{
    width: 400px;
  }
  .submitContent{
    .el-form-item__content{
      width: 90%;
    }
  }
  .submitContent__tinymce{
    .el-form-item__content{
      width: auto;
    }
  }
  .upload-el-image-wrap{
    .el-form-item__content{
      display: flex;
      position: relative;
      .upload-el-image{
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        width: 220px;
        height: auto;
        margin-right: 10px;
        display: block;
      }
      .preview{
        margin-left: 10px;
        height: fit-content;
      }
      .deleteImgFile{
        cursor: pointer;
        border: 1px solid #DCDFE6;
        width: 15px;
        height: 15px;
        line-height: 12px;
        font-size: 14px;
        text-indent: 3px;
        color: #DCDFE6;
        position: absolute;
        top: 10px;
        left: 194px;
      }
      .deleteImgFile:hover {
        color: #999;
        border: 1px solid #999;
      }
    }
  }
  .splitLine{
    border-top: 4px solid #f2f2f2;
  }
  .splitLineMenuContent{
    margin: 0 -10px 10px -10px;
  }
  .title{
    border-left: 4px solid #157fdf;
    line-height: 40px;
    font-size: 16px;
    text-indent: 10px;
    margin: -10px 0 0 -10px;
    color: #1890ff;
  }
}
</style>
