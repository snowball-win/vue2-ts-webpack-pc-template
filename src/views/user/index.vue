<template>
  <div class="uset-management-index">
    <userInfo/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getArticles } from '@/api/articles'
import { getAppList } from '@/api/users'
import userInfo from './components/user-info.vue'

@Component({
  name: 'userManager',
  components: {
    userInfo
  }
})
export default class extends Vue {}
</script>

<style lang="scss" scoped>
.uset-management-index{
  padding: 20px;
}
</style>
