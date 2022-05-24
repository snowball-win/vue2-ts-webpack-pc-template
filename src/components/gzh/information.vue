<!-- 资讯组件 -->
<template>
  <div class="gzh-information">
    <el-tabs
      v-model="activeKey"
      v-if="data.componentProperties.hasCategory === '1' && data.pageComponentContentBody.categoryList && data.pageComponentContentBody.categoryList.length > 0"
      @tab-click="tabChange"
    >
      <el-tab-pane v-for="(item, index) in data.pageComponentContentBody.categoryList" :key="index" :label="item.categoryName" :name="String(item.categoryId)">
        <div>
          <div v-for="(item, index) in list" :key="index">
            <div class="title">{{item.contentTitle}}</div>
            <div class="contentInfo">
              <span>{{item.contentSource}}</span>
              <span>{{item.originalAuthor}}</span>
            </div>
            <div class="contentAbstract">{{item.contentAbstract}}</div>
            <div class="thumbImageUrlList">
              <el-image class="image" :src="item.thumbImageUrlList[0]"></el-image>
            </div>
            <div class="contentText">
              <p v-html="item.contentText"></p>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { gzhGraphicInfoContentContentList } from '@/api/wechat'

@Component({
  name: 'information'
})
export default class extends Vue {
  @Prop({ required: true }) private data!: {componentProperties: any, pageComponentContentBody: any}

  private list = []

  private activeKey: null | string = null

  private pageId = this.$route.params.id

  private totalCount = 0

  private totalPages = 0

  private async tabChange() {
    const { pageComponentId } = this.data.componentProperties
    const res = await gzhGraphicInfoContentContentList({ pageId: this.pageId, pageComponentId, categoryId: Number(this.activeKey) })
    if (res.code === '0') {
      this.list = res.payload.list || []
      this.totalCount = res.payload.totalCount
      this.totalPages = res.payload.totalPages
    }
  }
}
</script>

<style lang="scss" scoped>
.gzh-information{
  .title{
    margin-bottom: 10px;
  }
  .contentInfo{
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin: 0 auto;
    margin-bottom: 10px;
  }
  .contentAbstract{
    width: 90%;
    margin: 0 auto;
    margin-bottom: 10px;
    text-align: left;
  }
  .thumbImageUrlList{
    margin-bottom: 10px;
    .image{
      width: 90%;
    }
  }
  .contentText{
    width: 90%;
    margin: 0 auto;
    margin-bottom: 10px;
  }
}
</style>
