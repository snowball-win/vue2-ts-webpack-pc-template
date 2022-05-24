<template>
  <create-components/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import createComponents from './components/create-detail.vue'

@Component({
  name: 'createCompany',
  components: {
    createComponents
  }
})
export default class extends Vue {

}
</script>

<style lang="scss" scoped>
</style>
