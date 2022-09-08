export default {
  created () {
    this.$devToolStore.register(this)
  },
  destroyed () {
    this.$devToolStore.unregister(this)
  }
}
