import { STORE_STORAGE_KEY } from './constant'

export default class Store {
  constructor () {
    this.instances = [] // 组件实例列表
    this.data = uni.getStorageSync(STORE_STORAGE_KEY) || {} // 所有需同步数据
  }

  /**
   * 注册(缓存)组件实例
   * @param {Object} instance Vue组件实例
   */
  register (instance) {
    this.instances.push(instance)
  }

  /**
   * 销毁缓存的组件实例
   * @param {Object} instance 待销毁组件实例
   */
  unregister (instance) {
    const index = this.instances.findIndex(item => item === instance)
    index > -1 && this.instances.splice(index, 1)
  }

  get (key) {
    return this.data[key]
  }

  /**
   * 设置值
   * @param {String} key
   * @param {any} value
   * @param {Object} instance 可选，传入当前实例避免重复设置当前实例值（watch可能造成错误）
   */
  set (key, value, instance) {
    this.data[key] = value
    this.instances.forEach(ins => {
      if (ins !== instance && ins[key] !== value) {
        ins[key] = value
      }
    })
    uni.setStorageSync(STORE_STORAGE_KEY, this.data)
  }
}
