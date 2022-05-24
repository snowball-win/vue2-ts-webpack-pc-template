<template>
  <div class="app-container">
    <create-components/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getArticles } from '@/api/articles'
import createComponents from './components/edit.vue'

@Component({
  name: 'userlist',
  components: {
    createComponents
  }
})
export default class extends Vue {
  private listQuery = {
    page: 1,
    limit: 20
  }

  private async getList() {
    await getArticles(this.listQuery)
      .then((e:any) => {
        console.log('27', e)
      })
      .catch((e:any) => {
        console.log('30', e)
      })
      .finally((e:void) => {
        console.log('33', e)
      })
  }
}
</script>

<style lang="scss" scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
