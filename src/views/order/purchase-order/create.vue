// 新建订单
<template>
  <div class="app-container">
    <create-components/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import createComponents from './components/create.vue'

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
