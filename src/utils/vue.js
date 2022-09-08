const compiler = require("@vue/compiler-sfc")
const path = require("path")
const { pathRulesTest } = require("./path")

/**
 * 在vue文件的template中第一个非template节点下插入组件的调用
 * @param {string} source vue文件(SFC)源码
 * @param {object[]} components 插入组件配置
 * @param {string} components[].name 组件名称
 */
function inject(source, components) {

  let injectTags = components.reduce((tags, curr) => {
    tags += `<${curr.name}></${curr.name}>` // TODO 换成自闭合标签
    return tags
  }, "")

  const { descriptor } = compiler.parse(source)
  if (descriptor.template) {
    // TODO 暂未考虑没有只有一个自闭和标签的情况
    // 如:  <template><img/></template>
    const matchTags = source.match(/<[^\/>]+>/g)
    const tag =
      matchTags &&
      matchTags.find(
        (item) =>
          !item.includes("<template") &&
          !item.includes("<script") &&
          !item.includes("<style") &&
          !item.includes("<!") // 注释也是标签
      )
    if (tag) {
      source = source.replace(tag, `$&${injectTags}`)
    }
  }
  return source
}

/**
 * 在vue文件的template中第一个非template节点下插入组件的调用
 * @param {string} source vue文件(SFC)源码
 * @param {string} resourcePath 当前解析的文件的路径
 * @param {object} config loader配置
 * @param {string} config.injectComponentRule 需要自动插入组件的vue文件路径正则
 * @param {string} config.pagesJsonPath page.json文件地址
 * @param {string} config.componentName 在template中自动插入的组件名
 */
function injectComponents(source, resourcePath, config) {
  const { components, injectComponentRule, pagesJsonPath } = config

  // 插入组件调用
  const isSFC = path.extname(resourcePath).includes("vue")
  const pathMath = pathRulesTest(resourcePath, { regRules: injectComponentRule, pagesJsonPath })
  if (isSFC && pathMath) {
    source = inject(source, components)
  }
  return source
}

module.exports = {
  injectComponents,
}
