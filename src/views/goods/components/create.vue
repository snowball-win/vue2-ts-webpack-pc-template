// 新建管理机构
<template>
  <div class="create-components">
    <div class="content">
      <el-form
        ref="userForm"
        :model="userForm"
        :rules="userRules"
        label-position="right"
      >
        <div>基础信息</div>
        <el-form-item prop="name" label="一级分类" label-width="150px">
          <el-input
            v-model="userForm.name"
            placeholder="一级分类"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="phone" label="二级分类" label-width="150px">
          <el-input
            v-model="userForm.phone"
            placeholder="二级分类"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="phone" label="商品名称" label-width="150px">
          <el-input
            v-model="userForm.phone"
            placeholder="商品名称"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="phone" label="辅助标题" label-width="150px">
          <el-input
            v-model="userForm.phone"
            placeholder="辅助标题"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="phone" label="商品品牌" label-width="150px">
          <el-input
            v-model="userForm.phone"
            placeholder="商品品牌"
            type="text"
          />
        </el-form-item>
        <el-form-item label="商品介绍" label-width="150px">
          <el-input
            v-model="userForm.phone"
            placeholder="请选择登记机关"
            type="text"
          />
        </el-form-item>
      </el-form>
    </div>
    <div>
      <div>销售信息（*为必填项）</div>
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          align="center"
        />
        <el-table-column
          width="80"
          align="center"
          label="ID"
        >
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          align="center"
          label="商品规格"
        >
          <template slot-scope="{row}">
            <span>{{ row.timestamp | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="center"
          label="销售单位"
        >
          <template slot-scope="{row}">
            <span>{{ row.timestamp | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="center"
          label="市场指导价"
        >
          <template slot-scope="{row}">
            <span>{{ row.timestamp | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="center"
          label="销售价格"
        >
          <template slot-scope="{row}">
            <span>{{ row.timestamp | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="center"
          label="折扣比例"
        >
          <template slot-scope="{row}">
            <span>{{ row.timestamp | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="center"
          label="销售周期"
        >
          <template slot-scope="{row}">
            <span>{{ row.timestamp | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="center"
          label="销售终端"
        >
          <template slot-scope="{row}">
            <span>{{ row.timestamp | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          align="center"
          label="成本价格"
        >
          <template slot-scope="{row}">
            <span>{{ row.timestamp | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
        align="center"
        label="操作"
        width="250"
        fixed="right"
      >
        <template slot-scope="{row}">
          <router-link :to="'/goods/edit/'+row.id">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
            >
              删除
            </el-button>
          </router-link>
        </template>
      </el-table-column>
      </el-table>
    </div>
    <div class="content">
      <div>库存信息（*为必填项）</div>
      <el-form
        ref="userForm"
        :model="userForm"
        :rules="userRules"
        label-position="right"
      >
        <el-form-item label="商品货号" label-width="150px">
          <el-input
            v-model="userForm.phone"
            placeholder="商品货号"
            type="text"
          />
        </el-form-item>
        <el-form-item label="库存数量" label-width="150px">
          <el-input
            v-model="userForm.phone"
            placeholder="库存数量"
            type="text"
          />
        </el-form-item>
        <el-form-item label="预警量" label-width="150px">
          <el-input
            v-model="userForm.phone"
            placeholder="预警量"
            type="text"
          />
        </el-form-item>
        <el-form-item label="仓库信息" label-width="150px">
          <el-input
            v-model="userForm.phone"
            placeholder="仓库信息"
            type="text"
          />
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-button type="text">web端详情</el-button>
      <el-button type="text">移动端详情</el-button>
      <el-button type="text">商品图片</el-button>
      <el-button type="text">商品视频</el-button>
    </div>
    <div>
      <tinymce
        v-if="tinymceActive"
        ref="editor"
        v-model="userForm.fullContent"
        :height="400"
        :request="request"
      />
    </div>
    <div class="submit">
      <el-button type="primary" @click="submitHandle">返回</el-button>
      <el-button type="primary" @click="submitHandle">保存</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { IArticleData } from '@/api/types'
import { isValidUsername, isValidPhone } from '@/utils/validate'
import { fileUpload } from '@/api/goods'
import Tinymce from '@/components/Tinymce/index.vue'

@Component({
  name: 'create-components',
  components: {
    Tinymce
  }
})

export default class extends Vue {
  private listLoading = false
  private tinymceActive = true
  private request = fileUpload

  private list: IArticleData[] = [
    {
      id: 1,
      status: '1',
      title: 'title',
      abstractContent: 'content',
      fullContent: 'con',
      sourceURL: 'url',
      imageURL: 'img',
      timestamp: '0001',
      platforms: [''],
      disableComment: false,
      importance: 123,
      author: '111',
      reviewer: '222',
      type: '333',
      pageviews: 555
    },
    {
      id: 2,
      status: '1',
      title: 'title',
      abstractContent: 'content',
      fullContent: 'con',
      sourceURL: 'url',
      imageURL: 'img',
      timestamp: '0001',
      platforms: [''],
      disableComment: false,
      importance: 123,
      author: '111',
      reviewer: '222',
      type: '333',
      pageviews: 555
    },
    {
      id: 3,
      status: '1',
      title: 'title',
      abstractContent: 'content',
      fullContent: 'con',
      sourceURL: 'url',
      imageURL: 'img',
      timestamp: '0001',
      platforms: [''],
      disableComment: false,
      importance: 123,
      author: '111',
      reviewer: '222',
      type: '333',
      pageviews: 555
    }
  ]

  deactivated() {
    this.tinymceActive = false
  }

  activated() {
    this.tinymceActive = true
  }

  private validateName = (rule: any, value: string, callback: Function) => {
    if (!isValidUsername(value)) {
      callback(new Error('请输入用户名'))
    } else {
      callback()
    }
  }

  private validatePhone = (rule: any, value: string, callback: Function) => {
    if (!isValidPhone(value)) {
      callback(new Error('请输入手机号'))
    } else {
      callback()
    }
  }

  private userForm = {
    name: 'admin',
    phone: '',
    fullContent: ''
  }

  private userRules = {
    name: [
      {
        validator: this.validateName,
        trigger: 'blur',
        required: true
      }
    ],
    phone: [
      {
        validator: this.validatePhone,
        trigger: 'blur',
        required: true
      }
    ]
  }

  private submitHandle() {
    (this.$refs.userForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        console.log('58success')
      } else {
        return false
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.create-components{
  .content{
    width: 500px;
    margin: 0 auto;
  }
  .submit{
    display: flex;
    justify-content: center;
  }
}
</style>
