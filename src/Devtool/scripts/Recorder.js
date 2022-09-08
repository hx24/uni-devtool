import Vue from 'vue'
import { REQUESTS_STORAGE_KEY, RESPONSES_STORAGE_KEY } from './constant'

export default class Recorder {
  constructor () {
    this.checkStorageSize()
    this.bus = new Vue()
  }

  addRecord (options) {
    try {
      const records = this.getAll()
      const record = this.formatRequest(options)
      records.unshift(record)
      // if (records.length > 100) {
      //   records.splice(100) // 最多保留100数据
      // }
      uni.setStorageSync(REQUESTS_STORAGE_KEY, records)
      this.bus.$emit('update', records)
      return record.id
    } catch (error) {
      console.error(error)
    }
  }

  updateRecord (id, options) {
    const now = +new Date()
    try {
      const records = this.getAll()
      const record = records.find(record => record.id === id)
      if (record) {
        Object.assign(record, options, {
          time: now - record.startTime
        })
        uni.setStorageSync(REQUESTS_STORAGE_KEY, records)
        this.bus.$emit('update', records)
      }
    } catch (error) {
      console.error(error)
    }
  }

  getAll () {
    let records = []
    try {
      records = uni.getStorageSync(REQUESTS_STORAGE_KEY) || []
      if (typeof records === 'string') {
        // 兼容遗留问题
        records = JSON.parse(records)
      }
    } catch (error) {
      console.error(error)
    }
    return records
  }

  formatRequest (options) {
    let { url, data, header, method, dataType } = options
    const id = Date.now()
    const reqDataType = typeof data
    if (data && reqDataType !== 'string' && reqDataType !== 'object') {
      data = '非文本或json'
    }

    return {
      url,
      data,
      header,
      method,
      dataType,
      id,
      startTime: +new Date()
    }
  }

  clear () {
    this.bus.$emit('update', [])
    Recorder.clearStatic()
  }

  static clearStatic () {
    uni.removeStorageSync(REQUESTS_STORAGE_KEY)
    uni.removeStorageSync(RESPONSES_STORAGE_KEY)
  }

  checkStorageSize () {
    try {
      const { currentSize, limitSize } = uni.getStorageInfoSync()
      if (currentSize > limitSize * 0.5) {
        const records = this.getAll()
        // 删除一半数据
        const deletedRecords = records.splice(records.length / 2)
        const allResponse = uni.getStorageSync(RESPONSES_STORAGE_KEY) || {}
        deletedRecords.forEach(record => {
          delete allResponse[record.id]
        })
        uni.setStorageSync(REQUESTS_STORAGE_KEY, records)
        uni.setStorageSync(RESPONSES_STORAGE_KEY, allResponse)
        this.bus.$emit('update', records)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  addResponse (id, res) {
    // 对request的成功回调进行切片，记录响应值
    try {
      const allResponse = uni.getStorageSync(RESPONSES_STORAGE_KEY) || {}
      const response = JSON.parse(JSON.stringify(res))
      this.updateRecord(id, {
        status: response.statusCode
      })
      allResponse[id] = response
      uni.setStorageSync(RESPONSES_STORAGE_KEY, allResponse)
      this.checkStorageSize()
    } catch (error) {
      console.error('格式化响应失败', error)
    }
  }

  getResponse (id) {
    try {
      const allResponse = uni.getStorageSync(RESPONSES_STORAGE_KEY) || {}
      return allResponse[id]
    } catch (error) {
      console.error('读取相应失败', error)
      return {}
    }
  }
}
