<template>
  <div class="upload-container">
    <el-button
      :style="{background: color, borderColor: color}"
      icon="el-icon-upload"
      size="mini"
      type="primary"
      @click=" dialogVisible=true"
    >
      上传
    </el-button>
    <el-dialog
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
    >
      <el-upload
        :multiple="true"
        :file-list="defaultFileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        action="https://httpbin.org/post"
        :http-request="toRequest"
        list-type="picture-card"
      >
        <el-button
          size="small"
          type="primary"
        >
          Click upload
        </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">
        Cancel
      </el-button>
      <el-button
        type="primary"
        @click="handleSubmit"
      >
        Confirm
      </el-button>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ElUploadInternalRawFile } from 'element-ui/types/upload'
import { UserModule } from '@/store/modules/user'
// import { fileManagerUploadImageGetUrl } from '@/api/wechat'

export interface IUploadObject {
  hasSuccess: boolean
  uid: number
  url: string
  width: number
  height: number
}

@Component({
  name: 'EditorImageUpload'
})
export default class extends Vue {
  @Prop({ required: true }) private color!: string
  @Prop({ default: {} }) private pramas!: Object
  @Prop({ default: 'file' }) private fileProp!: string
  @Prop({ required: true }) private request!: Function

  private dialogVisible = false
  private listObj: { [key: string]: IUploadObject } = {}
  private defaultFileList: IUploadObject[] = []

  private checkAllSuccess() {
    return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
  }

  private handleSubmit() {
    const arr = Object.keys(this.listObj).map(v => this.listObj[v])
    if (!this.checkAllSuccess()) {
      this.$message('Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!')
      return
    }
    this.$emit('success-callback', arr)
    this.listObj = {}
    this.defaultFileList = []
    this.dialogVisible = false
  }

  // // http-request使用时这个事件不触发
  // private handleSuccess(response: any, file: ElUploadInternalRawFile) {
  //   debugger
  //   const uid = file.uid
  //   const objKeyArr = Object.keys(this.listObj)
  //   for (let i = 0, len = objKeyArr.length; i < len; i++) {
  //     if (this.listObj[objKeyArr[i]].uid === uid) {
  //       this.listObj[objKeyArr[i]].url = response.files.file
  //       this.listObj[objKeyArr[i]].hasSuccess = true
  //       return
  //     }
  //   }
  // }

  private onHandleSuccess(url: string, file: ElUploadInternalRawFile) {
    const uid = file.uid
    const objKeyArr = Object.keys(this.listObj)
    for (let i = 0, len = objKeyArr.length; i < len; i++) {
      if (this.listObj[objKeyArr[i]].uid === uid) {
        this.listObj[objKeyArr[i]].url = url
        this.listObj[objKeyArr[i]].hasSuccess = true
        return
      }
    }
  }

  private defaultPramas = {
    authorization: UserModule.token
  }

  // 上传到微信服务图片
  private async toRequest(dataA: any) {
    // // 发起请求
    // console.log('weixin,image', dataA)
    // const fd = new FormData()
    // fd.append('imageFile', dataA.file)
    // fd.append('gzhId', UserModule.gzhId)
    const data = {
      ...this.defaultPramas,
      ...this.pramas,
      [this.fileProp]: dataA.file
    }
    await this.request(this.getFormData(data)).then((res: any) => {
      if (res.code === '0') {
        this.onHandleSuccess(res.payload, dataA.file)
      } else {
        return Promise.reject(res)
      }
    }).catch(() => {
      this.handleRemove(dataA.file)
    })
  }

  // 获取formData
  private getFormData(data: any) {
    const fd = new FormData()
    Object.keys(data).forEach(key => {
      fd.append(key, data[key])
    })
    return fd
  }

  private handleRemove(file: ElUploadInternalRawFile) {
    // console.log(this.defaultFileList)
    const uid = file.uid
    const objKeyArr = Object.keys(this.listObj)
    for (let i = 0, len = objKeyArr.length; i < len; i++) {
      if (this.listObj[objKeyArr[i]].uid === uid) {
        delete this.listObj[objKeyArr[i]]
        this.defaultFileList.splice(this.defaultFileList.findIndex((file:IUploadObject) => file.uid === uid), 1)
        return
      }
    }
  }

  private beforeUpload(file: ElUploadInternalRawFile) {
    const fileName = file.uid
    const img = new Image()
    img.src = window.URL.createObjectURL(file)
    img.onload = () => {
      this.listObj[fileName] = {
        hasSuccess: false,
        uid: file.uid,
        url: '',
        width: img.width,
        height: img.height
      }
      this.defaultFileList.push(this.listObj[fileName])
    }
  }
}
</script>

<style lang="scss">
.editor-slide-upload {
  .el-upload--picture-card {
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
}
</style>
