<template>
  <section class="component-mp-dev-tool-gateway-tag">
    <div class="title">请输入隔离标识（非中文）：</div>
    <input v-model="gatewayTag" class="tag-input" type="text" @change="handleTagChange" />
  </section>
</template>

<script>
import storeMixin from '../mixins/storeMixin'

export default {
  name: 'mp-dev-tool-gateway-tag',
  mixins: [storeMixin],
  components: {},
  props: {},
  data () {
    return {
      gatewayTag: this.$devToolStore.get('gatewayTag') || ''
    }
  },
  methods: {
    handleTagChange () {
      this.$devToolStore.set('gatewayTag', this.gatewayTag)
      uni.showToast({
        title: '设置成功',
        duration: 1000,
        icon: 'none'
      })
    }
  },
  computed: {}
}
</script>

<style scoped>
.component-mp-dev-tool-gateway-tag {
  padding: 15px;
  word-break: break-all;
  font-size: 12px;
}

.title {
  font-size: 16px;
}

.tag-input {
  margin-top: 10px;
  height: 25px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
  padding-left: 10px;
}
</style>
