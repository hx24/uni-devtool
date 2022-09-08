const { injectComponents, injectJs, getOptions, addH5Webview } = require("./utils")

module.exports = function (source) {
  // 默认情况下如果待处理文件未发生变化, 会使用缓存的loader处理结果, 调试loader时可禁用缓存
  // this.cacheable(false);

  const options = getOptions(this) // 获取loader配置
  const { resourcePath } = this // 当前处理的文件路径

  // 在入口执行初始化脚本
  source = injectJs(source, resourcePath, options)

  // 在页面中注入组件调用代码
  source = injectComponents(source, resourcePath, options)

  // pages.json添加H5Webview路由，用于跳转到H5页面
  source = addH5Webview(source, resourcePath, options)
 
  return source
}