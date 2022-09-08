/**
 * 拖拽元素
 * :style="{'transform':`translate(${drag.x}px, ${drag.y}px)`}"
    @touchstart="e => drag.start(e)"
    @touchmove.stop.prevent="e => drag.move(e)"
    @touchend="e => drag.end(e)"
 */

const STORAGE_POSITION_KEY = 'wy_mp_devtool_icon_position'

const iDrags = [] // 缓存ElDrag实例, 在一个实例更新位置后，通知其他实例更新

export class ElDrag {
  constructor (menuRef) {
    iDrags.push(this)

    // this.menuRef = menuRef 会报错
    Object.defineProperty(this, 'menuRef', {
      value: menuRef,
      writable: false
    })

    this.getBasicInfo()

    // const { x, y } = uni.getStorageSync(STORAGE_POSITION_KEY) || {}
    // // 偏移距离
    // this.x = x || 0
    // this.y = y || 0
    this.x = 0
    this.y = 0

    // 当前坐标
    this.curPoint = {
      x: 0,
      y: 0
    }
    // 拖动原点(相对位置，相对自身)
    this.startPoint = {}

    // console.log('this.sideDistance', this.sideDistance)
  }

  async getBasicInfo () {
    await Promise.all([
      this.getRefInfo().then(data => {
        const { width, height, left, top } = data
        this.width = width
        this.height = height
        this.left = left
        this.top = top
      }),
      this.getSystemInfo().then(info => {
        this.windowWidth = info.windowWidth
        this.windowHeight = info.windowHeight
      })
    ])
    this.sideDistance = await this.getSideDistance()
  }

  async start (ev) {
    // 记录一开始手指按下的坐标
    const touch = ev.changedTouches[0]
    this.startPoint.x = touch.pageX
    this.startPoint.y = touch.pageY

    this.curPoint.x = this.x
    this.curPoint.y = this.y
  }

  async move (ev) {
    /**
     * 防止页面高度很大，出现滚动条，不能移动-默认拖动滚动条事件
     * https://uniapp.dcloud.io/vue-basics?id=%e4%ba%8b%e4%bb%b6%e4%bf%ae%e9%a5%b0%e7%ac%a6
     * 使用修饰符处理（出现滚动条，用下面方方式依然可滚动）
     */
    // ev.preventDefault()
    // ev.stopPropagation()

    const touch = ev.changedTouches[0]
    const diffPoint = {} // 存放差值
    diffPoint.x = touch.pageX - this.startPoint.x
    diffPoint.y = touch.pageY - this.startPoint.y
    // 移动的距离 = 差值 + 当前坐标点
    const x = diffPoint.x + this.curPoint.x
    const y = diffPoint.y + this.curPoint.y

    const { left, right, top, bottom } = this.sideDistance
    if (x >= left && x <= right) {
      this.x = x
    }
    if (y >= top && y <= bottom) {
      this.y = y
    }
  }

  end (ev) {
    this.moveToSide()
  }

  /**
   * 获取当前拖拽元素的信息
   * @returns {Promise<Object>}
   */
  getRefInfo () {
    return new Promise(resolve => {
      this.menuRef
        .boundingClientRect(data => {
          resolve(data)
        })
        .exec()
    })
  }

  getSystemInfo () {
    return new Promise(resolve => {
      uni.getSystemInfo({
        success: info => {
          resolve(info)
        }
      })
    })
  }

  /**
   * 移动到边界
   */
  async moveToSide () {
    const { x, y } = await this.getSidePosition()

    this.x = x
    this.y = y
    uni.setStorageSync(STORAGE_POSITION_KEY, { x, y })

    iDrags.forEach(iDrag => {
      if (iDrag !== this) {
        iDrag.x = x
        iDrag.y = y
      }
    })
  }

  /**
   * 获取移动到边界时的坐标
   */
  async getSidePosition () {
    const refInfo = await this.getRefInfo()
    const { width, height, left, top } = refInfo
    const { windowWidth, windowHeight } = this

    let x = this.x
    let y = this.y

    if (left + width / 2 < windowWidth / 2) {
      // 移动到左边界
      x = this.sideDistance.left
    } else {
      // 移动到右边界
      x = this.sideDistance.right
    }

    if (top < 0) {
      // 移动到上边界
      y = this.sideDistance.top
    } else if (top + height > windowHeight) {
      // 移动到下边界
      y = this.sideDistance.bottom
    }

    return { x, y }
  }

  async getSideDistance () {
    const sideSpace = 5 // 边距

    const refInfo = await this.getRefInfo()
    const { width, height, left, top } = refInfo
    const { windowWidth, windowHeight } = this

    const position = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }

    position.left = -left + sideSpace
    position.right = windowWidth - left - width - sideSpace
    position.top = -top + sideSpace
    position.bottom = windowHeight - top - height - sideSpace
    return position
  }

  /**
   * 移除缓存的实例，防止内存泄漏
   */
  destroy () {
    const i = iDrags.indexOf(this)
    iDrags.splice(i, 1)
  }
}
