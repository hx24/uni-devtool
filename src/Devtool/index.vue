<template>
  <div class="container">
    <view
      id="menu"
      class="dev-icon"
      ref="myMenu"
      :style="{ transform: `translate(${drag.x || 0}px, ${drag.y || 0}px)` }"
      @touchstart="(e) => drag.start(e)"
      @touchmove.stop.prevent="(e) => drag.move(e)"
      @touchend="(e) => drag.end(e)"
      @click="showPopup = !showPopup"
    >
      W
    </view>

    <devtool-popup v-model="showPopup">
      <div class="uni-devtool__wrapper">
        <div class="menus__container">
          <ul class="menus">
            <li v-for="menu in menus" :key="menu.key" :class="['meun-item', { actived: menu.key === curMenu.key }]" @click="handleMenuClick(menu)">{{ menu.name }}</li>
          </ul>
        </div>
        <div class="main__container">
          <div v-show="curMenu.key === 'Page'">
            <page-info></page-info>
          </div>
          <div v-show="curMenu.key === 'Network'">
            <network></network>
          </div>
          <div v-show="curMenu.key === 'GoH5'">
            <go-h5></go-h5>
          </div>
        </div>
      </div>
    </devtool-popup>
  </div>
</template>
<script>
import menus from './menus.js'
import { ElDrag } from './util/index.js'

import DevtoolPopup from './components/devtool-popup.vue'
import PageInfo from './components/tabs/PageInfo.vue'
import Network from './components/tabs/Network.vue'
import GoH5 from './components/tabs/GoH5.vue'

export default {
  name: 'uni-devtool',
  components: {
    DevtoolPopup,
    PageInfo,
    Network,
    GoH5
  },
  data() {
    return {
      menus: menus,
      showPopup: false,
      curMenu: menus[0] || {},
      drag: {}
    }
  },
  methods: {
    handleMenuClick(menu = {}) {
      this.curMenu = menu
    }
  },
  created() {
    const query = uni.createSelectorQuery().in(this)
    const menuRef = query.select('#menu')
    this.drag = new ElDrag(menuRef)
  },
  destroyed() {
    this.drag.destroy()
  }
}
</script>
<style scoped>
.dev-icon {
  position: fixed;
  bottom: 200px;
  right: 5px;
  z-index: 9999;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
  user-select: none;
}
.uni-devtool__wrapper {
  display: flex;
  flex-direction: column;
  color: #000;
  font-size: 14px;
  height: 100%;
  overflow: hidden;
}

.menus {
  white-space: nowrap;
  overflow-x: scroll;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e4e7ed;
}
.meun-item {
  display: inline-block;
  height: 35px;
  line-height: 35px;
  padding: 0 10px;
  border-right: 1px solid #e4e7ed;
  list-style: none;
  background: #f5f7fa;
}
.meun-item.actived {
  background: #fff;
}
.main__container {
  flex: 1;
  overflow: hidden;
}
</style>
