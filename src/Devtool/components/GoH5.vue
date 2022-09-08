<template>
  <section class="component-mp-dev-tool-go-h5">
    <div class="scan">
      <img class="icon-scan" src="https://kano.guahao.cn/8Wl614975671" alt="scan" @click="scan" />
      <div class="title">扫描二维码</div>
    </div>
    <div class="line"></div>
    <div class="input-direct">
      <div class="title">输入H5地址打开</div>
      <textarea v-model="url" class="url-input" type="text"/>
      <button class="confirm-url" size="mini" type="primary" @click="handleConfirmUrl">确定</button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'mp-dev-tool-go-h5',
  components: {},
  props: {},
  data () {
    return {
      url: ''
    }
  },
  methods: {
    handleConfirmUrl () {
      if (!this.url) {
        uni.showToast({
          title: '请输入url或扫描二维码',
          duration: 1300,
          icon: 'none'
        })
      } else {
        this.goH5(this.url)
      }
    },
    scan () {
      uni.scanCode({
        success: (result) => {
          const url = result?.result
          if (!url) {
            uni.showToast({
              title: '扫描失败，请重试',
              duration: 1000,
              icon: 'none'
            })
          } else {
            this.goH5(url)
          }
        }
      })
    },
    goH5 (url) {
      // TODO 暴露设置，兼容其他小程序
      uni.showToast({
        title: '正在打开...',
        duration: 1000,
        icon: 'none'
      })
      uni.navigateTo({
        url: `/pages/h5/index?url=${encodeURIComponent(url.trim())}`
      })
    }
  },
  computed: {}
}
</script>

<style scoped>
.component-mp-dev-tool-go-h5 {
  padding: 20px;
}
.url-input {
  height: 70px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  padding: 5px;
  margin-top: 10px;
}

.title {
  font-size: 18px;
  color: #777;
}

.confirm-url {
  margin-top: 10px;
}

.line {
  margin: 20px 0;
  height: 1px;
  border-bottom: 1px solid #eee;
}

.scan {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scan .title {
  margin-top: 10px;
}

.icon-scan {
  width: 64px;
  height: 64px;
}
</style>
