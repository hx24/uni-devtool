<template>
  <section class="component-mp-devtool-monitor">
    <div class="action">
      <button class="delete" @click="handleDelete">×</button>
      <input v-model="keyword" class="filter-input" type="text" placeholder="过滤" />
      <checkbox-group @change="checkboxChange">
        <label><checkbox value="filterPageMonitor" :checked="filterPageMonitor" class="filter-pv-checkbox" />过滤PV</label>
      </checkbox-group>
    </div>
    <ul scroll-y class="monitor-list">
      <li class="monitor-card" v-for="(monitor, index) in filteredMonitors" :key="monitor.id" @longpress="handleCardLongpress(index)">
        <div class="time">{{ monitor.startTime | time }}</div>
        <template v-if="monitor.isPageMonitor">
          <div class="card-row">
            <div class="label">页面埋点</div>
          </div>
          <div class="card-row">
            <div class="label">页面路径：</div>
            <div class="value">{{ monitor.pageUrl }}</div>
          </div>
        </template>
        <template v-else>
          <div class="card-row">
            <div class="label">事件名：</div>
            <div class="value">{{ monitor.event }}</div>
          </div>
          <div class="card-row">
            <div class="label">clickId：</div>
            <div class="value">{{ monitor.clickId }}</div>
          </div>
        </template>
        <!-- 上报data为String： -->
        <template v-if="isString(monitor.params)">
          <div class="card-row">
            <div class="label">上报data：</div>
            <div class="value">{{ monitor.params }}</div>
          </div>
        </template>
        <!-- 上报data为Object -->
        <template v-else>
          <div class="card-row monitor-params-row">
            <div class="label">私有参数：</div>
            <div class="value" v-for="(key, itemIndex) in Object.keys(monitor.params || {})" :key="itemIndex">
              <span class="param-name">{{ key }}：</span>
              <span class="param-value">{{ monitor.params[key] }}</span>
            </div>
          </div>
        </template>
      </li>
    </ul>
  </section>
</template>

<script>
import { formatMonitor } from './helper'
import { getTime } from '../util/date'

export default {
  name: 'mp-devtool-monitor',
  components: {},
  props: {},
  filters: {
    time (t) {
      if (!t) return ''
      return getTime(t)
    }
  },
  data () {
    return {
      records: this.$recorder.getAll(),
      keyword: '',
      filterPageMonitor: true
    }
  },
  created () {
    this.$recorder.bus.$on('update', (records) => {
      this.records = records
    })
  },
  methods: {
    handleDelete () {
      this.$recorder.clear()
    },
    isString (v) {
      return typeof v === 'string'
    },
    checkboxChange (e) {
      this.filterPageMonitor = !!e.detail.value.length
    },
    handleCardLongpress (monitorIndex) {
      uni.setClipboardData({
        data: JSON.stringify(this.filteredMonitors[monitorIndex])
      })
    }
  },
  computed: {
    monitors () {
      const records = this.records.reduce((res, record) => {
        const monitor = formatMonitor(record)
        monitor && res.push(monitor)
        return res
      }, [])
      return records
    },
    filteredMonitors () {
      const { keyword, filterPageMonitor } = this
      let { monitors } = this
      if (filterPageMonitor) {
        monitors = monitors.filter((item) => !item.isPageMonitor)
      }

      if (!keyword) return monitors

      return (monitors || []).filter((monitor) => JSON.stringify(monitor).includes(keyword))
    }
  }
}
</script>

<style scoped>
.component-mp-devtool-monitor {
  height: 100%;
  color: #232833;
  font-size: 12px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.action {
  display: flex;
  padding: 10px;
  background: #fff;
}

.delete {
  margin-right: 10px;
  padding: 4px 6px;
  margin-left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  color: #888;
}

.filter-input {
  flex: 1;
  height: 25px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
  padding-left: 10px;
}

.filter-pv-checkbox {
  transform: scale(0.7);
}

.monitor-list {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 5px 0 20px;
}

.monitor-card {
  box-shadow: 0 2px 8px 0 rgb(52 56 75 / 20%);
  padding: 12px;
  font-size: 12px;
  box-sizing: border-box;
  border-radius: 6px;
  position: relative;
  margin: 10px;
  margin-top: 0;
  padding-top: 20px;
  word-break: break-all;
}

.time {
  position: absolute;
  top: 5px;
  right: 8px;
}

.card-row {
  margin-bottom: 5px;
  display: flex;
}

.monitor-params-row {
  flex-direction: column;
}
</style>
