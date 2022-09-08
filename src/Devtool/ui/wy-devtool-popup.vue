<template>
  <div :class="['wy-devtool-popup', { show: value }]">
    <div class="wy-devtool-popup__mask" @click="handleClose"></div>
    <div :class="['wy-devtool-popup__container', position]" :style="{ height: height }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '80%'
    },
    position: {
      type: String,
      default: 'bottom'
    }
  },
  watch: {
    value (val) {
      this.$emit('change', val)
    }
  },
  methods: {
    handleClose () {
      this.$emit('input', false)
    }
  }
}
</script>

<style>
.wy-devtool-popup__mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  opacity: 0;
  transform: translateY(100%);
  transition: opacity 0.3s;
}
.wy-devtool-popup__container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99999;
  max-width: 100%;
  max-height: 100%;
  box-sizing: border-box;
  background: #fff;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}
.wy-devtool-popup__container.bottom {
  top: auto;
}

.wy-devtool-popup.show .wy-devtool-popup__mask {
  transform: translateY(0);
  opacity: 1;
}
.wy-devtool-popup.show .wy-devtool-popup__container {
  transform: translateY(0);
}
</style>
