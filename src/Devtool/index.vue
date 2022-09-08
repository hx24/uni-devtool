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

    <wy-devtool-popup v-model="showPopup" >
      <div class="wy-mp-devtool__wrapper">
        <div class="menus__container">
          <ul class="menus">
            <li v-for="menu in menus" :key="menu.key" :class="['meun-item', { actived: menu.key === curMenu.key }]" @click="handleMenuClick(menu)">{{ menu.name }}</li>
          </ul>
        </div>
        <div class="main__container">
          <div v-show="curMenu.key === 'Monitor'">
            <monitor ></monitor>
          </div>
          <div v-show="curMenu.key === 'Page'">
            <page-info ></page-info></div>
          <div v-show="curMenu.key === 'Network'">
            <network ></network>
          </div>
          <div v-show="curMenu.key === 'GatewayTag'">
            <gateway-tag ></gateway-tag>
          </div>
          <div v-show="curMenu.key === 'GoH5'">
            <go-h5 ></go-h5>
          </div>
          <!-- <monitor v-show="curMenu.key === 'Monitor'"></monitor> -->
          <!-- <page-info v-show="curMenu.key === 'Page'"></page-info> -->
          <!-- <network v-show="curMenu.key === 'Network'"></network> -->
          <!-- <gateway-tag v-show="curMenu.key === 'GatewayTag'"></gateway-tag> -->
          <!-- <go-h5 v-show="curMenu.key === 'GoH5'"></go-h5> -->
        </div>
      </div>
    </wy-devtool-popup>
  </div>
</template>
<script>
import menus from './menus.js'
import { ElDrag } from './util/index.js'

import WyDevtoolPopup from './ui/wy-devtool-popup.vue'
import Monitor from './components/Monitor.vue'
import PageInfo from './components/PageInfo.vue'
import Network from './components/Network.vue'
import GatewayTag from './components/GatewayTag.vue'
import GoH5 from './components/GoH5.vue'

export default {
  name: 'wy-mp-devtool',
  components: {
    WyDevtoolPopup,
    Monitor,
    PageInfo,
    Network,
    GatewayTag,
    GoH5
  },
  data () {
    return {
      menus: menus,
      showPopup: false,
      curMenu: menus[0] || {},
      drag: {}
    }
  },
  methods: {
    handleMenuClick (menu = {}) {
      this.curMenu = menu
    }
  },
  created () {
    const query = uni.createSelectorQuery().in(this)
    const menuRef = query.select('#menu')
    this.drag = new ElDrag(menuRef)
  },
  destroyed () {
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
.wy-mp-devtool__wrapper {
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
