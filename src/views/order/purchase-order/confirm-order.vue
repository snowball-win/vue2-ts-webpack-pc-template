// 购物车
<template>
  <div class="confirm-order-container">
    <div class="c-wrap">
      <el-row>
        <el-col :span="24">
          <div class="c-flex-center">
              <el-steps :style="{width: '100%'}" :active="tranceList.findIndex(item => item.selected)" align-center>
                <el-step
                  v-for="(item, index) in tranceList"
                  :key="index"
                  :title="item.traceName"
                  :description="item.operateDate"
                >
                  <template slot="icon">
                    <span class="round-span" :class="{'step-active': item.selected}">
                      {{index + 1}}
                    </span>
                    <span class="title">{{item.statusName}}</span>
                  </template>
                </el-step>
              </el-steps>

            </div>
        </el-col>
      </el-row>
    </div>
    <div class="c-wrap">
      <el-row>
        <el-col class="c-title-left c-title" :span="12">
          <div>收货人信息</div>
        </el-col>
        <el-col :span="12" class="c-title-right">
          <el-button type="text" @click="showAddAddressDialog">新增收货地址</el-button>
        </el-col>
      </el-row>
      <div v-if="addressList && addressList.length > 0"  class="c-content">
        <div :style="{height: !isShowMoreAddress ? 'auto' : '200px', overflow: isShowMoreAddress ? 'auto': 'hidden'}">
          <div>
            <el-row class="more-address-list">
              <div class="c-item--hover">
                <el-button :style="{minWidth: '80px', height: '30px'}" size="mini" class="item" type="primary">{{curAddressInfo.addrLabel}}</el-button>
                <span class="item">{{curAddressInfo.addressDetail}}</span>
                <span class="item--default" v-if="curAddressInfo.addrDefault === 1">默认地址</span>
              </div>
              <div class="c-title-right c-item--hidden">
                <el-button class="item--hover" size="mini"  type="text" v-if="curAddressInfo.addrDefault === 0" @click="setAddressManagerSetDefault(curAddressInfo)">设为默认地址</el-button>
                <el-button class="item--hover" size="mini"  type="text" @click="getAddressDetail(curAddressInfo)">编辑</el-button>
                <el-button class="item--hover" size="mini"  type="text" @click="delAddressById(curAddressInfo)">删除</el-button>
              </div>
            </el-row>
          </div>
          <div v-if="isShowMoreAddress && addressList.length > 1">
            <el-row class="more-address-list" v-for="(item, index) in addressList.filter(item => item.addressId !== curAddressInfo.addressId)" :key="index">
              <div  class="c-item--hover">
                <el-button :style="{minWidth: '80px',height: '30px'}" size="mini" class="item" @click="onAdressSelect(item)">{{item.addrLabel}}</el-button>
                <span class="item">{{item.addressDetail}}</span>
                <span class="item--default" v-if="item.addrDefault === 1">默认地址</span>
              </div>
              <div class="c-title-right c-item--hidden">
                <el-button class="item--hover" size="mini" type="text" v-if="item.addrDefault === 0" @click="setAddressManagerSetDefault(item)">设为默认地址</el-button>
                <el-button class="item--hover" size="mini" type="text" @click="getAddressDetail(item)">编辑</el-button>
                <el-button class="item--hover" size="mini"  type="text" @click="delAddressById(item)">删除</el-button>
              </div>
            </el-row>
          </div>
        </div>
        <div class="more-address-button">
          <el-button @click="showMoreAddress" type="text" :icon="isShowMoreAddress ? 'el-icon-top' : 'el-icon-bottom'">{{!isShowMoreAddress ? '更多地址' : '收起地址'}}</el-button>
        </div>
      </div>
      <div class="c-no-data">
        暂无收货地址
      </div>
    </div>
    <div class="c-wrap">
      <el-row>
        <el-col class="c-title-left c-title" :span="12">
          <div>支付方式</div>
        </el-col>
      </el-row>
      <div class="c-content">
        <el-button type="primary" size="mini"  @click="setPayMethod(1)">货到付款</el-button>
        <el-button size="mini" @click="setPayMethod(2)">在线支付</el-button>
        <el-button size="mini" @click="setPayMethod(3)">押金支付</el-button>
      </div>
    </div>
    <div class="c-wrap" v-for="(item, index) in companyCartList" :key="index">
      <el-row>
        <el-col class="c-title-left c-title" :span="12">
          <div><span>{{item.companyName}}</span></div>
        </el-col>
        <el-col :span="12" class="c-title-right">
          <el-button type="text" @click="addProduct">返回购物车</el-button>
        </el-col>
      </el-row>
      <el-table
        ref="multipleTable"
        :data="item.cartGoodsInfoList"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          type="index"
          align="center"
        />
        <el-table-column
          min-width="180px"
          align="center"
          label="商品图片"
        >
          <template slot-scope="{row}">
            <el-image
              style="width: 80px; height: 80px"
              :src="row.skuImage"
              fit="contain"
              alt="商品图片"
              :preview-src-list="[row.skuImage]" />
          </template>
        </el-table-column>

        <el-table-column
          min-width="320px"
          align="center"
          label="商品名称"
        >
          <template slot-scope="{row}">
            <span>{{ row.skuName }}</span>
          </template>
        </el-table-column>

        <el-table-column
          min-width="80px"
          label="单价"
          align="center"
        >
          <template slot-scope="{row}">
            <span>{{ row.unitPrice }}</span>
          </template>
        </el-table-column>

        <el-table-column
          min-width="250px"
          label="数量"
          align="center"
        >
          <template slot-scope="{row}">
            <el-input-number v-model="row.buyCount" :min="1" @change="sumAmount($event, row)" :max="9999" label="数量"></el-input-number>
          </template>
        </el-table-column>

        <el-table-column
          min-width="80px"
          label="小计"
          align="center"
        >
          <template slot-scope="{row}">
            <span>{{ row.subtotalAmount }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="c-wrap">
      <el-row>
        <el-col class="c-title-left c-title" :span="12">
          <div class="c-detail"  :style="{padding: 0, margin: 0}">
            <div class="c-label blue" :style="{padding: 0, margin: 0, textAlign: 'left'}">合计应付：</div>
            <div class="c-value red">￥{{amount}}</div>
          </div>
        </el-col>
      </el-row>
      <div class="c-content">
        <div class="c-detail">
          <div class="c-label">收件人：</div>
          <div class="c-value">{{curAddressInfo.linkMan || ''}}{{curAddressInfo.pohne || ''}}</div>
        </div>
        <div class="c-detail">
          <div class="c-label">收件地址：</div>
          <div class="c-value">{{curAddressInfo.addressDetail || ''}}</div>
        </div>
      </div>
    </div>
    <div :style="{textAlign: 'right', background: '#fff', padding: '10px'} ">
      <el-button type="primary" @click="submitOrder">提交订单</el-button>
    </div>
    <!-- 新增收货地址 -->
    <el-dialog
      :title="addAddressForm.addressId ? '编辑收货地址' : '新增收货地址'"
      :visible.sync="addAddressVisible"
      width="700px"
      :before-close="handleClose"
      class="setSaveAddressDialog"
    >
      <el-form
        ref="addAddressForm"
        :model="addAddressForm"
        label-width="120px"
        class="form-container"
        label-position="right"
        :rules="rules"
      >
        <el-form-item label="所在地区:" class="area" prop="areaId">
          <el-cascader
            ref="areaCascader"
            v-model="addAddressForm.areaId"
            :options="areaOptions"
            :props="defaultAreaProps"
            @change="handleAreaChange"
            style="width: 220px;"
          />
        </el-form-item>
        <el-form-item label="收货人:" prop="linkMan">
          <el-input
            v-model="addAddressForm.linkMan"
            style="width: 220px;"
            placeholder="收货人"
          ></el-input>
        </el-form-item>
        <el-form-item label="详细地址:" prop="addressName">
          <el-input
            v-model="addAddressForm.addressName"
            style="width: 220px;"
            placeholder="详细地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码:" prop="mobile">
          <el-input
            :value="'0086'"
            style="width: 60px;"
            placeholder="手机号码"
            disabled
          ></el-input>
          -
          <el-input
            v-model="addAddressForm.mobile"
            style="width: 220px;"
            placeholder="手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="固定电话:">
          <el-input
            :value="'0086'"
            style="width: 60px;"
            placeholder="手机号码"
            disabled
          ></el-input>
          -
          <el-input
            v-model="addAddressForm.telephone"
            style="width: 220px;"
            placeholder="固定电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="地址别名:">
          <el-input
            v-model="addAddressForm.addrLabel"
            style="width: 220px; margin-right:20px;"
            placeholder="地址别名"
          ></el-input>
          <el-button @click="onAddrLabelChange('家里')">家里</el-button>
          <el-button @click="onAddrLabelChange('父母')">父母</el-button>
          <el-button @click="onAddrLabelChange('公司')">公司</el-button>
          <br/>
          <span>建议填写常用名称家里 父母家 公司</span>
        </el-form-item>
      </el-form>
      <div class="setSaveAddressSubmit">
        <el-button @click="handleClose"
          >取消</el-button
        >
        <el-button type="primary" @click="setSaveAddress"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { showConfirm, addressDetail, addressList, saveAddress, addressManagerEditAddress, createOrder, addressManagerSetDefault, addressManagerDeleteAddress } from '@/api/order'
import { IArticleData } from '@/api/types'
import { OrderModule } from '@/store/modules/order'
import { TagsViewModule } from '@/store/modules/tags-view'
import { getArea } from '@/api/organization'
import { Cascader, Form } from 'element-ui'

@Component({
  name: 'confirm-order-List',
  components: {}
})
export default class extends Vue {
  private list: IArticleData[] = []
  private tranceList:any[] = [
    {
      remark: '',
      selected: false,
      statusName: '我的购物车'
    },
    {
      remark: '',
      selected: true,
      statusName: '填写核对订单信息'
    },
    {
      remark: '',
      selected: false,
      statusName: '成功提交订单'
    }
  ]

  created() {
    this.showConfirm()
    this.getAreaList()
    this.getAddressList()
  }

  private companyCartList:any = []
  private amount = 0

  // 确认订单list
  private async sumAmount(e:any, data:any) {
    if (data) {
      data.subtotalAmount = data.unitPrice * data.buyCount
    }
    this.amount = this.companyCartList.reduce((pre:any, next:any) => {
      return pre + next.cartGoodsInfoList.reduce((good1:any, good2:any) => {
        return good1 + good2.subtotalAmount
      }, 0)
    }, 0)
  }

  // 确认订单list
  private async showConfirm() {
    const params = {
      uniqueIdList: OrderModule.uniqueIdList
    }
    await showConfirm(params).then((res) => {
      if (res.code === '0') {
        this.companyCartList = res.payload.companyCartList
        this.sumAmount(null, null)
      }
    })
  }

  // 确认订单list
  private onAdressSelect(data:any) {
    // console.log(data)
    this.curAddressInfo = data
    this.isShowMoreAddress = !this.isShowMoreAddress
  }

  // 设置支付方式
  private setPayMethod(method:number) {
    if (method === 0) {
      this.$message.success('设置成功')
    } else if (method === 1) {
      this.$message.warning('暂不支持该方式')
    } else if (method === 2) {
      this.$message.warning('暂不支持该方式')
    }
  }

  // 地址详情
  private addressDetail = {}
  private async getAddressDetail(item:any) {
    const { addressId } = item
    await addressDetail({ addressId }).then((res) => {
      if (res.code === '0') {
        this.addAddressForm = res.payload
        this.addAddressForm.areaId = [this.addAddressForm.provinceId, this.addAddressForm.cityId, this.addAddressForm.areaId]
        this.addAddressVisible = true
      }
    })
  }

  private async delAddressById(item:any) {
    const { addressId } = item
    const flag = await this.$confirm('确定要删除地址吗', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }).then(() => {
      return Promise.resolve(true)
    }).catch(() => {
      return Promise.resolve(false)
    })
    console.log(flag)
    if (flag) {
      await addressManagerDeleteAddress({ addressId }).then((res) => {
        if (res.code === '0') {
          this.getAddressList()
        }
      })
    }
  }

  // 地址列表
  private addressList:any = []
  private async getAddressList() {
    await addressList({}).then((res) => {
      if (res.code === '0') {
        const data = res.payload
        this.addressList = data
        let flag = 0
        data.forEach((item:any) => {
          if (item.addrDefault === 1) {
            flag = 1
            this.curAddressInfo = item
          }
        })
        if (flag === 0) {
          this.curAddressInfo = data[0] || {}
        }
      }
    })
  }

  // 设置本次使用的地址
  private curAddressInfo = {}
  private setCurAddress(item:object) {
    this.curAddressInfo = item
  }

  // 添加地址
  private defaultAreaProps = {
    label: 'areaName',
    value: 'areaId',
    children: 'child',
    checkStrictly: true // 选择任意一级选项
  };

  private handleAreaChange(value: any) {
    console.log(value)
  }

  private async setAddressManagerSetDefault({ addressId }: any) {
    await addressManagerSetDefault({ addressId }).then((res) => {
      if (res.code === '0') {
        this.getAddressList()
      }
    })
  }

  // 获取区域
  private async getAreaList() {
    const { payload } = await getArea({ level: 3 }).finally()
    this.areaOptions = payload
  }

  // 获取创建订单
  private async submitOrder() {
    console.log(this.addressList)
    if (!this.addressList || this.addressList.length < 1) {
      return this.$notify.warning('请添加收货地址')
    }
    this.$confirm('确定要提交订单吗', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }).then(async() => {
      // console.log('241', this.companyCartList)
      const params = {
        orderGoodsList: [],
        addressId: this.addressList[0].addressId,
        paymentType: 1 // 1 货到付款
      }
      const oglist:any = []
      this.companyCartList.forEach((item:any) => {
        item.cartGoodsInfoList.forEach((item2:any) => {
          oglist.push({
            uniqueId: item2.uniqueId,
            buyCount: item2.buyCount
          })
        })
      })
      console.log('256', oglist)
      params.orderGoodsList = oglist
      await createOrder(params)
        .then((res) => {
          if (res.code === '0') {
            this.$message.success('提交成功')
            TagsViewModule.delView(this.$route)
            this.$router.push('/order/purchase-order/list')
          }
        })
        .finally()
    }).catch()
  }

  private areaOptions = [
    {
      areaId: 'province',
      areaName: '省',
      child: [
        {
          areaId: 'city',
          areaName: '市',
          child: [
            {
              areaId: 'area',
              areaName: '区'
            }
          ]
        }
      ]
    }
  ];

  private addAddressVisible = false
  private addAddressForm:any = {
    addressId: '',
    provinceId: '',
    provinceName: '',
    cityId: '',
    cityName: '',
    areaId: '',
    areaName: '',
    addressName: '',
    linkMan: '',
    mobile: '',
    telephone: '',
    addrDefault: '',
    addrLabel: ''
  }

  private showAddAddressDialog() {
    this.addAddressVisible = true
  }

  private onAddrLabelChange(val:string) {
    this.addAddressForm.addrLabel = val
  }

  private handleClose() {
    this.addAddressVisible = false
  }

  private isShowMoreAddress = false
  private showMoreAddress() {
    this.isShowMoreAddress = !this.isShowMoreAddress
  }

  private rules = {
    areaId: [{ message: '请选择所在地区', trigger: 'change', required: true }],
    linkMan: [{ message: '请输入收货人', trigger: 'blur', required: true }],
    addressName: [{ message: '请输入详细地址', trigger: 'blur', required: true }],
    mobile: [{ message: '请输入手机号码', trigger: 'blur', required: true }]
  }

  private async setSaveAddress() {
    let flag = true;
    (this.$refs.addAddressForm as Form).validate((validate: boolean) => {
      flag = validate
    })
    if (!flag) {
      return
    }
    // 忽略对这行代码的检查-这行代码是没问题的
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Unreachable code error
    const pathNodes = (this.$refs.areaCascader as Cascader).getCheckedNodes()[0].pathLabels
    const params:any = {
      addressId: this.addAddressForm.addressId,
      provinceId: this.addAddressForm.areaId[0],
      provinceName: pathNodes[0],
      cityId: this.addAddressForm.areaId[1],
      cityName: pathNodes[1],
      areaId: this.addAddressForm.areaId[2],
      areaName: pathNodes[2],
      addressName: this.addAddressForm.addressName,
      linkMan: this.addAddressForm.linkMan,
      mobile: this.addAddressForm.mobile,
      telephone: this.addAddressForm.telephone,
      addrDefault: this.addAddressForm.addrDefault,
      addrLabel: this.addAddressForm.addrLabel
    }
    if (this.addAddressForm.addressId) {
      await addressManagerEditAddress(params).then((res) => {
        if (res.code === '0') {
          this.$message.success('操作成功')
          this.addAddressVisible = false
          this.getAddressList()
        }
      })
    } else {
      await saveAddress(params).then((res) => {
        if (res.code === '0') {
          this.$message.success('操作成功')
          this.addAddressVisible = false
          this.getAddressList()
        }
      })
    }
  }

  // 上一页--添加产品
  private addProduct() {
    this.$router.push('/order/purchase-order/cart')
  }
}
</script>

<style lang="scss" scoped>
.confirm-order-container{
  padding: 10px;
  background: #f2f2f2;
  .c-wrap{
    padding: 0 10px 10px 0px;
    background: #fff;
    margin-bottom: 10px;
    .c-item--hover:hover + .c-item--hidden {
      display: block;
      background: #fff3f3;
    }
    .c-item--hover:hover {
      background: #fff3f3;
    }
    .item--hover:hover {
      color: #f30213;
    }
    .item--hover.el-buttom {
      height: 30px;
    }
    .c-item--hidden {
      display: none;
    }
    .c-item--hidden:hover {
      display: block;
    }
    .c-title-left {
      position: relative;
      text-align: left;
      height: 40px;
      line-height: 40px;
      color: #333;
      font-size: 14px;
      color: $blue;
      margin-bottom: 10px;
    }
    .c-title-right {
      text-align: right;
      line-height: 30px;
      height: 30px;
      color: #333;
      font-size: 14px;
      position: absolute;
      right: 0;
      top: 5px;
    }
    .c-content {
      padding-left: 20px;
      font-size: 14px;
    }
    .item{
      margin-right: 20px;
    }
    .more-address-button{
      margin: 0  0 10px 0;
    }
    .more-address-list{
      padding: 5px 0 0 0;
    }
  }
  .confirmOrderTitle{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0 10px 0;
  }
  .c-detail {
    padding: 5px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin: 10px 0;
  }
  .c-label {
    color: #666;
    width: 90px;
    text-align: right;
  }
  .setSaveAddressDialog{
    .setSaveAddressSubmit{
      text-align: center;
      padding: 30px;
    }
    .el-form-item {
      padding: 10px 0;
    }
  }
  .c-flex-center {
    display: flex;
    height: 40px;
    background: #fff;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
  .round-span {
    display: inline-block;
    min-width: 20px;
    text-align: center;
    line-height: 18px;
    background: white;
    height: 20px;
    border-radius: 50%;
    border: 2px solid;
    border-color: inherit
  }
  .step-active {
    background: $blue;
    color: white;
    border-color: $blue;
  }
  .title {
    padding: 10px 5px;
    color: #333;
    background: white;
  }
  .item--default {
    margin: 5px 10px;
    background-color: #999;
    color: #fff;
    display: inline-block;
    padding: 0 3px;
    line-height: 20px;
  }
  .c-no-data {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    padding-left: 20px;
    color: #aaa;
  }
}

</style>
<style lang="scss">
.confirm-order-container {
  .el-step__icon.is-text {
    border: none;
  }
}
</style>
