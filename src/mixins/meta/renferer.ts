export default {
  beforeCreate() {
    console.log('beforeMount')
    document.getElementById('head-meta-referer')?.setAttribute('content', 'never')
  },

  beforeDestroy() {
    console.log('distroy')
    document.getElementById('head-meta-referer')?.setAttribute('content', 'always')
  }
}
