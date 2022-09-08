<template>
  <section class="component-mp-dev-tool-pageinfo">
    <div class="row">
      <div class="row-label">
        <div class="label-text">页面地址：</div>
        <div class="label-button" @click="copy(curUrl)">复制</div>
      </div>
      <div class="row-value">{{ curUrl }}</div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'mp-dev-tool-pageinfo',
  components: {},
  props: {},
  data () {
    return {
      curUrl: ''
    }
  },
  mounted () {
    /* eslint-disable-next-line */
    const routes = getCurrentPages()
    const page = routes?.[routes.length - 1] || {}
    const route = '/' + page.route
    const fullPath = page.$page?.fullPath

    this.curUrl = fullPath || route
  },
  created () {},
  methods: {
    copy (data) {
      uni.setClipboardData({ data })
    }
  },
  computed: {}
}
</script>

<style scoped>
.component-mp-dev-tool-pageinfo {
  padding: 15px;
  word-break: break-all;
  font-size: 12px;
}
.row {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.row-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label-button {
  border-radius: 20px;
  padding: 2px 10px;
  border: 1px solid #999;
  color: #999;
  display: flex;
  justify-content: center;
  align-content: center;
}

.row-value {
  margin-top: 5px;
}
</style>
