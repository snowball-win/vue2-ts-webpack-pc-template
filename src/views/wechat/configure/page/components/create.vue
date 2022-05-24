// 新建管理机构
<template>
  <Content class="wechat-page-create">
    <div class="create-wrap">
      <ContentItem class="create-left">
        <div class="create-left-top">
          <div class="create-left-top-img" :style="{width: '234px'}">
            <img width="100%" :src="phoneImg" alt="">
            <div class="phone-wrap">
              <div class="phone-name">
                {{pageForm.pageName || '页面名称'}}
              </div>
              <Draggable v-show="!previewShow" v-model="pageForm.componentPropertiesList"  animation="300" @start="onStart" @end="onEnd">
                 <transition-group>
                  <div class="phone-drag-item" v-for="(item, index) in pageForm.componentPropertiesList" :key="index">
                    {{componentTypesObj[item.componentTypeCode]}}
                    <el-tabs v-if="item.componentTypeCode==='GRAPHIC_INFORMATION' && item.hasCategory === '1' && item.contentCategoryList && item.contentCategoryList.length > 0">
                      <el-tab-pane v-for="(item, index) in item.contentCategoryList" :key="index" :label="item.categoryName" :name="item.categoryId">{{item.categoryName}}</el-tab-pane>
                    </el-tabs>
                  </div>
                </transition-group>
              </Draggable>
              <Gzh :data="pageContentList" />
            </div>
          </div>
        </div>
        <div :style="{textAlign: 'center'}">
          <el-button type="primary" @click="phonePreview">{{previewShow ? '退出预览' : '预览'}}</el-button>
          <el-button v-if="!previewShow" type="primary" @click="openAddComponentDialog">添加组件</el-button>
        </div>
      </ContentItem>
      <div class="create-right">
        <ContentItem :title="'基本信息'" :style="{marginBottom: '5px'}">
          <el-form
            ref="pageForm"
            :model="pageForm"
            :rules="pageRules"
            label-width="200px"
            label-position="right"
            :style="{marginLeft: 0}"
          >
            <el-form-item
              prop="pageName"
              label="页面名称"
            >
              <el-input
                v-model="pageForm.pageName"
                placeholder="请输入不超过20个汉字"
                clearable
                type="text"
              />
            </el-form-item>
          </el-form>
        </ContentItem>
        <ContentItem :title="'页面组件'">
          <div v-for="(item, index) in pageForm.componentPropertiesList" :key="item.id">
            <div class="sort-title">
              <span>
                组件{{index + 1}}：{{item.componentTypeName}}
              </span>
              <el-button type="text" @click="deleteComponent(item, `组件${index + 1}`)">
                删除
              </el-button>
            </div>
            <el-form
              v-if="item.componentTypeCode === 'PICTURE_ROTATION'"
              :ref="`component-${index}`"
              :rules="pageRules"
              :model="item"
              label-width="200px"
              label-position="right"
              :style="{marginLeft: 0}"
            >
              <el-form-item
                prop="rotationCount"
                label="轮播数量"
              >
                <el-input
                  v-model="item.rotationCount"
                  clearable
                  type="text"
                />
              </el-form-item>
              <el-form-item prop="rotationInterval" label="轮播间隔">
                <el-input
                  v-model="item.rotationInterval"
                  clearable
                  type="text"
                />
              </el-form-item>
              <el-form-item prop="rotationDirection" label="轮播方向">
                <el-select
                  v-model="item.rotationDirection"
                  placeholder="请选择"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, index) in directionOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="rotationLoop" label="是否循环">
                <el-select
                  v-model="item.rotationLoop"
                  placeholder="请选择"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, index) in exitOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="componentStatus" label="是否有效">
                <!-- 协议内容 -->
                <el-select
                  v-model="item.componentStatus"
                  placeholder="请选择"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, index) in validOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <el-form
              v-if="item.componentTypeCode === 'GRAPHIC_INFORMATION'"
              :ref="`component-${index}`"
              :model="item"
              :rules="pageRules"
              label-width="200px"
              label-position="right"
              :style="{marginLeft: 0}"
            >
              <el-form-item prop="showAbstract" label="是否显示概述">
                <!-- 协议内容 -->
                <el-select
                  v-model="item.showAbstract"
                  placeholder="请选择"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, index) in exitOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="showSourceName" label="是否显示来源名称">
                <!-- 协议内容 -->
                <el-select
                  v-model="item.showSourceName"
                  placeholder="请选择"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, index) in exitOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="showSubmitTime" label="是否显示提交时间">
                <!-- 协议内容 -->
                <el-select
                  v-model="item.showSubmitTime"
                  placeholder="请选择"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, index) in exitOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="fixedCount" label="是否固定数量">
                <!-- 协议内容 -->
                <el-select
                  v-model="item.fixedCount"
                  placeholder="请选择"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, index) in exitOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="showFixedCount" label="固定显示数量">
                <el-input type="text" v-model="item.showFixedCount" />
              </el-form-item>
              <el-form-item prop="hasCategory" label="是否有分类" :style="{width: '800px'}">
                <!-- 协议内容 -->
                <el-select
                  v-model="item.hasCategory"
                  placeholder="请选择"
                  clearable
                  style="width: 300px; display: inline-block;"
                >
                  <el-option
                    v-for="(item, index) in exitOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="item.hasCategory === '1'" prop="contentCategoryList" label="选择分类" :style="{width: '800px'}">
                <!-- 协议内容 -->
                <el-select
                  v-model="item.contentCategoryList"
                  multiple
                  placeholder="请选择"
                  clearable
                  value-key="categoryId"
                  style="width: 300px; display: inline-block;"
                >
                  <el-option
                    v-for="(item, index) in categoryList"
                    :key="index"
                    :label="item.categoryName"
                    :value="item"
                  >
                  </el-option>
                </el-select>
                <el-button type="primary" size="mini" :style="{marginRight: '0', marginLeft: '5px'}" @click="openAddCategoryFormDialog({}, item)">添加分类</el-button>
                <el-button type="primary" size="mini" :style="{marginRight: '0', marginLeft: '5px'}" @click="openCategoryListDialog(item)">查看分类</el-button>
              </el-form-item>
              <el-form-item prop="componentStatus" label="是否有效">
                <!-- 协议内容 -->
                <el-select
                  v-model="item.componentStatus"
                  placeholder="请选择"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, index) in validOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <el-divider></el-divider>
          </div>
        </ContentItem>
      </div>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="goBack">返回</el-button>
      <el-button type="primary" v-if="handleType === 'add'" @click="submitHandle">提交</el-button>
      <el-button type="primary" v-else @click="submitEditHandle">提交</el-button>
    </div>
    <el-dialog
      :visible.sync="addComponentVisible"
      custom-class="wechat-dialog"
      width="480px"
      title="添加组件"
    >
      <el-form ref="addComponentForm" :model="addComponentForm" :rules="componentRules" label-width="100px">
        <el-form-item
          prop="componentTypeData"
          label="组件名称"
        >
          <el-select
            v-model="addComponentForm.componentTypeData"
            placeholder="请选择"
            value-key="componentTypeCode"
            @change="componentChange"
            clearable
          >
            <el-option
              v-for="(item, index) in componentTypesOption"
              :key="index"
              :label="item.componentTypeName"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="componentDesc" label="组件描述">
          <el-input
            v-model="addComponentForm.componentDesc"
            :style="{width: '300px'}"
            placeholder="请输入不超过20个汉字"
            clearable
            readonly
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer class="wechat-dialog-footer" style="text-align: right; margin-top: 10px;">
        <el-button type="default" @click="addComponentVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmComponent">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog
      :visible.sync="addCategoryVisible"
      custom-class="wechat-dialog"
      title="添加分类"
      width="480px"
    >
      <el-form ref="addCategory" :model="addCategoryForm" :rules="addCategoryRules">
        <el-form-item prop="categoryName" label="分类名称:">
          <el-input
            v-model="addCategoryForm.categoryName"
            placeholder="请输入不超过20个汉字"
            :style="{width: '300px'}"
            clearable
            type="text"
          />
        </el-form-item>
      </el-form>
      <template #footer class="wechat-dialog-footer" style="text-align: right; margin-top: 10px;">
        <el-button type="default" @click="addCategoryVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCategory">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog
      :visible.sync="categoryListVisible"
      custom-class="wechat-dialog"
      title="分类列表"
      width="600px"
    >
      <el-table
        ref="categoryTable"
        :data="categoryList"
        :selectable="false"
        border
        fit
        highlight-current-row
      >
        <el-table-column
          type="selection"
          align="center"
          :selectable="(row, index) => false"
        />
        <el-table-column
          type="index"
          label="序号"
          align="center"
        />

        <el-table-column
          align="center"
          show-overflow-tooltip
          label="分类名称"
        >
          <template slot-scope="{row}">
            <span>{{ row.categoryName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="300px"
          align="center"
          show-overflow-tooltip
          label="操作"
        >
          <template slot-scope="{row}">
            <el-button
              :type="'primary'"
              size="mini"
              style="margin-right:10px; min-width: 80px;"
              @click="openAddCategoryFormDialog(row)"
            >
              编辑
            </el-button>
            <el-button
              :type="'primary'"
              size="mini"
              style="margin-right:10px; min-width: 80px;"
              @click="handleDeleteCategory(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="categoryTotal>0"
        :total="categoryTotal"
        :page.sync="categoryQuery.page"
        :limit.sync="categoryQuery.size"
        @pagination="getCategoryList"
      />
    </el-dialog>
  </Content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'
import { Form as ElForm, Table as ElTable } from 'element-ui'
import { isValidPhone, isValidVoid } from '@/utils/validate'
import {
  gzhCustomPageCreate,
  gzhCustomPageEdit,
  gzhCustomPageDetail,
  gzhGraphicInfoContentCategoryCreateCategory,
  gzhComponentBaseComponentList,
  gzhGraphicInfoContentCategoryCategoryList,
  showPageContent,
  gzhGraphicInfoContentCategoryDeleteCategory,
  gzhGraphicInfoContentCategoryEditCategory
} from '@/api/wechat'
// import { companyUsers } from '@/api/users'
import Content from '@/components/Content/index.vue'
import ContentItem from '@/components/ContentItem/index.vue'
import Pagination from '@/components/Pagination/index.vue'
// import phoneImg from '@/assets/images/wechart/phone.png'
import Draggable from 'vuedraggable'
import Gzh from '@/components/gzh/index.vue'
import internal from 'stream'

@Component({
  name: 'wechat-config-create-components',
  components: {
    ContentItem,
    Content,
    Pagination,
    Draggable,
    Gzh
  }
})
export default class extends Vue {
  created() {
    this.getGzhDetail()
    this.getCompomentTypesOption()
    this.pageId && this.getCategoryList()
  }

  private handleType = this.$route.params.id ? 'edit' : 'add'
  private pageId = this.$route.params.id
  private phoneImg = require('@/assets/images/wechart/phone.png')
  private exitOption = [
    {
      label: '是',
      value: '1'
    },
    {
      label: '否',
      value: '0'
    }
  ]

  private validOption = [
    {
      label: '是',
      value: 1
    },
    {
      label: '否',
      value: 0
    }
  ]

  private directionOption = [
    {
      label: '左右轮播',
      value: 'left-right'
    },
    {
      label: '上下轮播',
      value: 'up-down'
    }
  ]

  private validateUnifiedSocialCreditCode = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      callback(new Error('请输入统一社会信用代码'))
    } else {
      callback()
    }
  };

  private validateCompanyName = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      callback(new Error('请输入企业名称'))
    } else {
      callback()
    }
  };

  private validateCompanyType = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    console.log('325', value)
    if (!isValidVoid(value)) {
      callback(new Error('请输入企业类型'))
    } else {
      callback()
    }
  };

  private validateRegistrationAuthority = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      callback(new Error('请输入登记机关'))
    } else {
      callback()
    }
  };

  private validateLegalPerson = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      callback(new Error('请输入法定代表人'))
    } else {
      callback()
    }
  };

  private validateRealName = (rule: any, value: string, callback: Function) => {
    if (!isValidVoid(value)) {
      callback(new Error('请输入企业管理员姓名'))
    } else {
      callback()
    }
  };

  private validatePhoneNo = (rule: any, value: string, callback: Function) => {
    if (!isValidPhone(value)) {
      callback(new Error('请输入手机号码'))
    } else {
      this.pageForm.defaultPwd = value.slice(5, 12)
      callback()
    }
  };

  private validateDefaultPwd = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      callback(new Error('请输入密码'))
    } else {
      callback()
    }
  };

  private validateDefaultPwdRepeat = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (!isValidVoid(value)) {
      callback(new Error('请输入密码'))
    } else if (value !== this.pageForm.defaultPwd) {
      callback(new Error('请输入正确的密码'))
    } else {
      callback()
    }
  };

  private pageForm:any = {
    pageName: '',
    gzhId: this.$route.query && this.$route.query.gzhId,
    componentPropertiesList: []
  };

  private pageRules = {
    pageName: [
      {
        message: '请输入公众号名称',
        trigger: 'blur',
        required: true
      }
    ],
    showAbstract: [
      {
        message: '请选择',
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
    contentCategoryList: [
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

  private componentRules = {
    componentTypeData: [
      {
        message: '请选择组件',
        trigger: 'change',
        required: true
      }
    ]
  };

  private addCategoryRules = {
    categoryName: [
      {
        message: '请输入分类名称',
        trigger: 'blur',
        required: true
      }
    ]
  };

  private componentTypesOption = []
  private componentTypesObj: {[p: string]: string} = {}
  private async getCompomentTypesOption() {
    const res = await gzhComponentBaseComponentList({})
    this.componentTypesOption = res.payload.list
    res.payload.list.forEach((item:any) => {
      this.componentTypesObj[item.componentTypeCode] = item.componentTypeName
    })
  }

  // 获取详情
  private async getGzhDetail() {
    if (!this.pageId) {
      return
    }
    const params = { pageId: this.pageId }
    const res = await gzhCustomPageDetail(params)
    const { componentPropertiesList } = res && res.payload
    if (componentPropertiesList && componentPropertiesList.length > 0) {
      componentPropertiesList.forEach((item:any) => {
        this.key = Math.max(Number(item.pageComponentId), this.key)
        item.id = item.pageComponentId
        if (item.contentCategoryList && item.contentCategoryList.length > 0) {
          item.contentCategoryList.forEach((el:any) => {
            el.categoryId = String(el.categoryId)
          })
        }
      })
    }
    this.pageForm = res.payload
  }

  // 返回
  private goBack() {
    this.$router.go(-1)
  }

  // 返回
  private onStart() {
    console.log('onStart')
  }

  // 返回
  private onEnd() {
    console.log('onEnd')
  }

  private addComponentForm:any = {
    componentTypeData: null,
    componentDesc: ''
  }

  private addComponentVisible = false
  private async openAddComponentDialog() {
    this.addComponentVisible = true
    await this.$nextTick();
    (this.$refs.addComponentForm as ElForm).resetFields()
  }

  private key = 1
  private async componentChange(val:{[p:string]: string}) {
    this.addComponentForm.componentDesc = val.componentDesc
  }

  private previewShow = false
  private pageContentList = []
  private phonePreview() {
    this.previewShow = !this.previewShow
    const pageId = this.pageForm.pageId
    if (this.previewShow && pageId) {
      this.getPhoneContent(pageId)
    }
  }

  private async getPhoneContent(pageId:string) {
    const res = await showPageContent(pageId)
    this.pageContentList = res.payload
  }

  private async confirmComponent() {
    (this.$refs.addComponentForm as ElForm).validate(
      async(valid: boolean) => {
        if (valid) {
          this.pageForm.componentPropertiesList.push(this.getAddComponentData(this.addComponentForm))
          this.addComponentVisible = false
        }
      }
    )
  }

  // 处理新增组件数据
  private getAddComponentData(data:any) {
    this.key += 1
    const { componentTypeData } = data
    const { componentTypeCode, componentProperties } = componentTypeData
    if (componentTypeCode === 'PICTURE_ROTATION') {
      componentTypeData.rotationLoop = this.getValue(componentProperties.rotationLoop)
      componentTypeData.rotationDirection = this.getValue(componentProperties.rotationDirection, ['left-right', 'up-down'])
    }
    if (componentTypeCode === 'GRAPHIC_INFORMATION') {
      componentTypeData.showAbstract = this.getValue(componentProperties.showAbstract)
      componentTypeData.showSourceName = this.getValue(componentProperties.showSourceName)
      componentTypeData.fixedCount = this.getValue(componentProperties.fixedCount)
      componentTypeData.hasCategory = this.getValue(componentProperties.hasCategory)
      componentTypeData.showSubmitTime = this.getValue(componentProperties.showSubmitTime)
      componentTypeData.showFixedCount = Number(componentProperties.showFixedCount) || 1
    }
    return Object.assign({}, componentProperties, componentTypeData, { id: this.key })
  }

  private getValue(value:string|number, list:any = ['0', '1'], defaultValue?:string|undefined) {
    return list.includes(value) ? value : defaultValue || list[0]
  }

  private async submitHandle() {
    const componentsFlag = this.pageForm.componentPropertiesList.map((item:any, index:number) => {
      let flag
      (this.$refs[`component-${index}`] as ElForm[])[0].validate(valid => { flag = valid })
      return flag
    }).every((key:Boolean) => key)
    let valid;
    (this.$refs.pageForm as ElForm).validate((v: boolean) => { valid = v })
    if (valid && componentsFlag) {
      await gzhCustomPageCreate(this.getPageConfirmData(this.pageForm)).then((res) => {
        if (res.code === '0') {
          this.$message.success('操作成功')
          this.$router.go(-1)
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }

  private addCategoryForm:{[p:string]: string} = {}
  private addCategoryVisible = false
  private activeComponent:any = {}
  private async openAddCategoryFormDialog(line:{[p:string]: string}, data?:any) {
    this.addCategoryForm = { ...line }
    if (data) {
      this.activeComponent = data
    }
    this.addCategoryVisible = true
  }

  private async handleDeleteCategory(data:any) {
    if (!this.pageId) {
      this.categoryList.splice(this.categoryList.indexOf(data), 1)
      this.updateAllCategory()
      return
    }
    this.$confirm(`确认删除${data.categoryName}`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }).then(async() => {
      await gzhGraphicInfoContentCategoryDeleteCategory(data)
      await this.getCategoryList()
      this.updateAllCategory()
    })
  }

  private cateGoryId = 1
  private async confirmCategory() {
    (this.$refs.addCategory as ElForm).validate(
      async(valid: boolean) => {
        if (valid) {
          const { pageId } = this
          const { categoryId } = this.addCategoryForm
          const type = (pageId && categoryId)
            ? 'edit'
            : categoryId
              ? 'add-edit'
              : pageId
                ? 'new'
                : 'add'
          let res
          if (type === 'new') {
            res = await gzhGraphicInfoContentCategoryCreateCategory({ ...this.addCategoryForm, pageId })
          }
          if ((type === 'new' && res.code === '0') || type === 'add') {
            if ((type === 'new' && res.code === '0')) {
              this.$message.success('新增成功')
              this.cateGoryId = res && res.payload
            } else {
              this.cateGoryId += 1
            }
            this.activeComponent.contentCategoryList = this.activeComponent.contentCategoryList || []
            this.activeComponent.contentCategoryList.push({ ...this.addCategoryForm, categoryId: String(this.cateGoryId) })
            if (this.pageId) {
              this.getCategoryList()
            } else {
              this.categoryList.push({ ...this.addCategoryForm, categoryId: String(this.cateGoryId) })
            }
          }
          if (type === 'edit') {
            res = await gzhGraphicInfoContentCategoryEditCategory(this.addCategoryForm)
            if (res.code === '0') {
              this.$message.success('保存成功')
              await this.getCategoryList()
              this.updateAllCategory()
            }
          }
          if (type === 'add-edit') {
            const data = this.categoryList.find((item:any) => item.categoryId === categoryId)
            Object.assign(data || {}, this.addCategoryForm)
            this.updateAllCategory()
          }
          this.addCategoryVisible = false;
          (this.$refs.addCategory as ElForm).resetFields()
        }
      }
    )
  }

  private async deleteComponent(data:{[p:string]: string}, str:string) {
    this.$confirm(`确认删除${str}`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }).then(async() => {
      this.pageForm.componentPropertiesList.splice(this.pageForm.componentPropertiesList.indexOf(data), 1)
    })
  }

  private categoryList:any = []
  private categoryListVisible = false
  private categoryTotal = 0
  private categoryQuery = {
    pageId: this.pageId,
    categoryId: '',
    page: 1,
    size: 20
  }

  private currentComponent:any = {}
  private async openCategoryListDialog(data:{[p:string]: string}) {
    this.currentComponent = data
    this.categoryListVisible = true
    if (!this.pageId) {
      return
    }
    await this.getCategoryList()
    const categoryList:any = (this.currentComponent && this.currentComponent.contentCategoryList) || []
    const ids = categoryList.map((item:any) => item.categoryId)
    const selectRows = this.categoryList.filter((item:any) => ids.includes(item.categoryId))
    selectRows.forEach((row:any) => {
      (this.$refs.categoryTable as ElTable).toggleRowSelection(row)
    })
  }

  private async getCategoryList() {
    const { payload } = await gzhGraphicInfoContentCategoryCategoryList(this.categoryQuery)
    const { list, totalCount } = payload
    this.categoryList = list
    this.categoryTotal = totalCount
  }

  private async updateAllCategory() {
    const cateGoryIds = this.categoryList.map((item:any) => item.categoryId)
    this.pageForm.componentPropertiesList.forEach((el:any) => {
      if (el.componentTypeCode === 'GRAPHIC_INFORMATION' && el.contentCategoryList && el.contentCategoryList.length > 0) {
        el.contentCategoryList = el.contentCategoryList.filter((i:{[p:string]: string | number}) => cateGoryIds.includes(String(i.categoryId)))
        el.contentCategoryList.forEach((it:any) => {
          const categoryData = this.categoryList.find((item:any) => item.categoryId === String(it.categoryId)) || {}
          Object.assign(it, categoryData)
        })
      }
    })
  }

  // 提交
  private getPageConfirmData(_val:any) {
    const val = cloneDeep(_val)
    val.componentPropertiesList.forEach((el:any, index:internal) => {
      el.sort = index
    })
    val.componentPropertiesList = val.componentPropertiesList.map((item:any) => {
      const data = { id: item.pageComponentId, ...item }
      // delete data.id
      item.contentCategoryList = item.contentCategoryList || []
      item.contentCategoryList = item.contentCategoryList.map((it:any) => {
        if (this.pageId) {
          return { ...it }
        } else {
          return { categoryName: it.categoryName }
        }
      })
      return data
    })
    return val
  }

  // 编辑
  private async submitEditHandle() {
    const componentsFlag = this.pageForm.componentPropertiesList.map((item:any, index:number) => {
      let flag
      (this.$refs[`component-${index}`] as ElForm[])[0].validate(valid => { flag = valid })
      return flag
    }).every((key:Boolean) => key)
    let valid;
    (this.$refs.pageForm as ElForm).validate((v: boolean) => { valid = v })
    if (valid && componentsFlag) {
      await gzhCustomPageEdit(this.getPageConfirmData(this.pageForm)).then((res) => {
        if (res.code === '0') {
          this.$message.success('编辑成功')
          // this.$router.go(-1)
          this.getGzhDetail()
        }
      })
    }
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
.wechat-page-create {
  .sort-title {
    height: 40px;
    font-size: 13px;
    color: $blue;
    display: flex;
    padding-left: 10px;
    flex-basis: 0;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .create-left {
    min-width: 500px;
    width: 500px;
    margin-right: 5px;
    height: 100%;
  }
  .create-left-top {
    margin: 100px auto 20px auto;
    text-align: center;
    position: relative;
  }
  .create-left-top-img {
    margin: auto;
    position: relative;
  }
  .create-right {
    padding: 0;
    flex: 1;
    height: 100%;
    overflow: auto;
  }
  .create-wrap {
    width: 100%;
    overflow: auto;
    display: flex;
    flex-direction: row;
    padding: 0;
    flex: 1;
  }
  .phone-wrap {
    position: absolute;
    left: 11px;
    right: 11px;
    top: 30px;
    bottom: 30px;
    overflow: auto;
    // border-radius: 5px;
    background: #f2f2f2;
  }
  .phone-drag-item {
    width: 100%;
    min-height: 80px;
    border: 5px solid #ddd;
    border-radius: 5px;
    margin-bottom: 1px;
  }
  .phone-name {
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background: $blue;
    justify-content: center;
    margin-bottom: 1px;
  }
  .phone-preview-item {
    width: 100%;
    overflow: hidden;
  }
}
</style>
