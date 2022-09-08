<template>
  <web-view :src="url" />
</template>

<script>
export default {
  data() {
    return {
      url: ''
    }
  },
  mounted() {
    this.getUrl()
  },
  methods: {
    getUrl() {
      /* eslint-disable-next-line */
      const routes = getCurrentPages()
      const page = routes?.[routes.length - 1] || {}
      const url = decodeURIComponent(page.options.url)
      this.url = url
    }
  }
}
</script>
