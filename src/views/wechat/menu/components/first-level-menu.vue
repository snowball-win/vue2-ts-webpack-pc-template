// 菜单配置-一级菜单
<template>
  <div class="first-level-menu-content">
    <ContentItem :title="'一级菜单'">
      <router-link
        :to="`/wechat/configure/add-menu?gzhId=${gzhId}&menuType=1&edit=add`"
        class="link-type"
      >
        <el-button type="primary" size="mini" :style="{'margin': '5px 0 10px 0'}">新建</el-button>
      </router-link>
      <div class="gzhName"> 公众号: {{gzhName}}</div>
      <div class="content">
        <el-tree
            class="filter-tree"
            :data="dataTree"
            :props="defaultProps"
            default-expand-all
            @node-click="onTreeNodeClick"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
          >
          </el-tree>
      </div>
    </ContentItem>
  </div>
</template>

<script lang="ts">
import { getCompanyId } from '@/utils/cookies'
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { isValidPhone, isValidVoid } from '@/utils/validate'
import { gzhMainManagerSave, gzhMenuManagerEdit, gzhMenuManagerGetMenuTree } from '@/api/wechat'
import { companyManagerGetCompanyList, getChildCompany, getCompanyTree } from '@/api/organization'
import ContentItem from '@/components/ContentItem/index.vue'

@Component({
  name: 'first-level-menu-content',
  components: {
    ContentItem
  }
})
export default class extends Vue {
  created() {
    this.getOrganizationList()
    // this.getCompanyTree() // 获取机构树
    this.getMenuTreeDetail() // 获取菜单树详情
  }

  private gzhId = this.$route.params.id
  private listLoading = true;
  private dataTree = [{}];
  private listQuery:any = {
    page: 1,
    size: 20,
    unifiedSocialCreditCode: '',
    companyName: '',
    parentCompanyId: ''
  };

  private dataTreeRootId = '';
  private dataTreeCurId = '';

  private defaultProps = {
    label: 'menuName',
    value: 'menuId',
    children: 'children'
  };

  private total = 0;
  private list = [];

  private dataTreeCurAdminFlag = ''

  // 获取机构树
  private async getCompanyTree() {
    this.listLoading = true
    this.listQuery.parentCompanyId = getCompanyId() || ''
    const { payload } = await getCompanyTree({}).finally(() => {
      this.listLoading = false
    })
    this.dataTree = payload.companyTreeList
    this.dataTreeRootId = payload.companyTreeList[0].companyId
    this.dataTreeCurId = payload.companyTreeList[0].companyId
    this.getList(payload.companyTreeList[0].companyId)
    this.dataTreeCurAdminFlag = payload.companyTreeList[0].adminFlag
  }

  private curTreeNode = {}
  private gzhName = ''

  // 获取菜单树详情
  private getMenuTreeDetail() {
    if (!this.$route.params.id) {
      console.log('add')
      return
    }
    const params = {
      gzhId: this.$route.params.id,
      menuType: ''
    }
    gzhMenuManagerGetMenuTree(params).then((res) => {
      this.gzhForm = res.payload.menuTreeList
      this.gzhName = res.payload.gzhName
      if (res.payload.menuTreeList) {
        this.dataTree = res.payload.menuTreeList
        this.$emit('clickTreeNode')
        this.curTreeNode = res.payload.menuTreeList[0]
      }
    })
  }

  // 按照机构ID获取下级机构信息
  private async getList(id = this.dataTreeRootId) {
    this.listLoading = true
    this.listQuery.parentCompanyId = id || ''
    const { payload } = await getChildCompany(this.listQuery).finally(() => {
      this.listLoading = false
    })
    this.list = payload.list
    this.total = payload.totalCount
  }

  private handleType = this.$route.params.id ? 'edit' : 'add'

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
      this.gzhForm.defaultPwd = value.slice(5, 12)
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
    } else if (value !== this.gzhForm.defaultPwd) {
      callback(new Error('请输入正确的密码'))
    } else {
      callback()
    }
  };

  private gzhForm:any = {
  };

  private userRules = {
    unifiedSocialCreditCode: [
      {
        validator: this.validateUnifiedSocialCreditCode,
        trigger: 'blur',
        required: true
      }
    ],
    appId: [
      {
        message: '请输入AppId',
        trigger: 'blur',
        required: true
      }
    ],
    gzhName: [
      {
        message: '请输入公众号名称',
        trigger: 'blur',
        required: true
      }
    ],
    token: [
      {
        message: '请输入令牌（Token）',
        trigger: 'blur',
        required: true
      }
    ],
    companyName: [
      {
        validator: this.validateCompanyName,
        trigger: 'blur',
        required: true
      }
    ],
    companyType: [
      {
        validator: this.validateCompanyType,
        trigger: ['blur', 'change'],
        required: true
      }
    ],
    registrationAuthority: [
      {
        validator: this.validateRegistrationAuthority,
        trigger: 'blur',
        required: true
      }
    ],
    legalPerson: [
      {
        validator: this.validateLegalPerson,
        trigger: 'blur',
        required: true
      }
    ],
    realName: [
      {
        message: '请输入联系人姓名',
        trigger: 'blur',
        required: true
      }
    ],
    phoneNo: [
      {
        validator: this.validatePhoneNo,
        trigger: 'blur',
        required: true
      }
    ],
    auditBeginDate: [
      {
        message: '请选择年审开始日期',
        trigger: 'blur',
        required: true
      }
    ],
    auditEndDate: [
      {
        message: '请选择年审结束日期',
        trigger: 'blur',
        required: true
      }
    ],
    phoneNumber: [
      {
        message: '请选择联系人电话',
        trigger: 'blur',
        required: true
      }
    ],
    defaultPwd: [
      {
        validator: this.validateDefaultPwd,
        trigger: 'blur',
        required: true
      }
    ],
    defaultPwdRepeat: [
      {
        validator: this.validateDefaultPwdRepeat,
        trigger: 'blur',
        required: true
      }
    ]
  };

  private companyList = []
  // 获取详情
  private getOrganizationList(companyName = '') {
    companyManagerGetCompanyList({ companyName }).then((res) => {
      this.companyList = res.payload
    })
  }

  // 过滤树节点
  private filterNode(value: any, data: any) {
    if (!value) return true
    return data.companyName.indexOf(value) !== -1
  }

  // 点击树节点
  private onTreeNodeClick(treeNode: any) {
    console.log('365treeNode', treeNode)
    this.$emit('clickTreeNode', treeNode)
    // this.curTreeNode = treeNode
    // this.getList(treeNode.companyId)
    // this.dataTreeCurId = treeNode.companyId
    // this.dataTreeCurAdminFlag = treeNode.adminFlag
  }

  // 返回
  private goBack() {
    this.$router.go(-1)
  }

  // 提交
  private async submitHandle() {
    (this.$refs.gzhForm as ElForm).validate(
      async(valid: boolean) => {
        if (valid) {
          await gzhMainManagerSave(this.gzhForm).then((res) => {
            if (res.code === '0') {
              this.$message.success('操作成功')
              this.$router.go(-1)
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          return false
        }
      }
    )
  }

  // 编辑
  private async submitEditHandle() {
    (this.$refs.gzhForm as ElForm).validate(
      async(valid: boolean) => {
        if (valid) {
          await gzhMenuManagerEdit(this.gzhForm).then((res) => {
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
</script>

<style lang="scss" scoped>
.first-level-menu-content {
  // padding: 10px;
  width: 300px;
  height: auto;
  overflow: auto;
  background: #fff;
  margin-right: 5px;
  .gzhName{
    width: calc(100% + 20px);
    margin-left: -10px;
    padding: 15px 0 15px 5px;
    height: 40px;
    font-size: 13px;
    box-sizing: border-box;
    background: #f2f2f2;
  }
  .el-form{
    width: 500px;
  }
  .el-form-item{
    margin-bottom: 20px;
  }
  .submit {
    width: 500px;
    display: flex;
    justify-content: center;
  }
}
</style>
