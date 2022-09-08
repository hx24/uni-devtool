const fs = require("fs")
const path = require("path")
const statSync = fs.statSync

/**
 * 同步拷贝文件夹
 * @param {string} source
 * @param {string} target
 */
const copyDirSync = function (source, target) {
  try {
    if (fs.existsSync(target)) {
      deleteFolder(target)
    }
    fs.mkdirSync(target)

    if (statSync(source).isFile()) {
      readable = fs.createReadStream(source) //创建读取流
      writable = fs.createWriteStream(path.join(target, "/", path.basename(source))) //创建写入流
      readable.pipe(writable)
      return
    }

    //读取目录
    const paths = fs.readdirSync(source)
    paths.forEach(function (_path) {
      const _src = path.join(source, "/", _path)
      const _dst = path.join(target, "/", _path)
      let readable
      let writable
      const st = statSync(_src)
      if (st.isFile()) {
        readable = fs.createReadStream(_src) //创建读取流
        writable = fs.createWriteStream(_dst) //创建写入流
        readable.pipe(writable)
      } else if (st.isDirectory()) {
        exists(_src, _dst, copyDirSync)
      }
    })
  } catch (error) {
    console.error(error)
  }
}

const exists = function (source, target, callback) {
  //测试某个路径下文件是否存在
  const exists = fs.existsSync(target)
  if (exists) {
    //存在
    callback(source, target)
  } else {
    // 不存在 创建目录
    fs.mkdirSync(target)
    callback(source, target)
  }
}

const copyDirOnceSync = (function () {
  const copiedMap = {}

  /**
   * 复制文件夹一次, 避免多次执行
   * @param {string} source 待复制文件目录
   * @param {string} target 目标目录
   * @returns null
   */
  return function (source, target) {
    const key = source + "," + target
    if (copiedMap[key]) return
    copyDirSync(source, target)
    copiedMap[key] = true
  }
})()

/**
 * 删除文件夹
 * @param {String} path 要删除的文件夹路径
 */
function deleteFolder(folder) {
  if (fs.existsSync(folder)) {
    const files = fs.readdirSync(folder)
    files.forEach(function (file) {
      const curPath = path.join(folder, file)
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteFolder(curPath)
      } else {
        // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(folder)
  }
}

module.exports = {
  copyDirSync,
  copyDirOnceSync,
}
