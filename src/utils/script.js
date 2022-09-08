const acorn = require("acorn")
const estraverse = require("estraverse")
const escodegen = require("escodegen")
const { humpToHyphen } = require('./tools')

/**
 * 在代码的最后一个import后插入一段代码
 * @param {String} source 要插入代码的源码
 * @param {String} code 要插入的代码
 * @returns {String} 插入后的新代码
 */
function injectCodeAfterLastImportDeclaration(source, code) {
  const sourceAst = acorn.parse(source, { sourceType: "module", ecmaVersion: 2020 })
  let lastNode = null
  estraverse.traverse(sourceAst, {
    leave: function (node, parent) {
      if (node.type == "ImportDeclaration") {
        lastNode = node
      }
    },
  })
  const lastImportDeclarationIndex = sourceAst.body.indexOf(lastNode) // 最后一个ImportDeclaration的索引
  const codeAst = acorn.parse(code, { sourceType: "module" })

  sourceAst.body.splice(lastImportDeclarationIndex + 1, 0, codeAst)
  const newSource = escodegen
    .generate(sourceAst, {
      indent: "  ",
    })
    .replace(/;/g, "") + '\n' // TODO 换个支持不带分号的生成器
  return newSource
}

/**
 * 
 * @param {string[]} scripts 要在入口注入的js文件路径
 * @param {object[]} components 插入组件配置
 */
function getInjectCode(scripts, components) {
  let scriptCode = ''
  scripts.forEach(scriptPath => {
    scriptCode += `
      import '${scriptPath}'`
  })

  let registerComponentCode = ''
  components.forEach(component => {
    const { name, path } = component
    scriptCode += `
      import ${name} from '${path}'`

    registerComponentCode += `
      Vue.component('${humpToHyphen(name)}', ${name})`
  })


  const code = `
    ${scriptCode}
    ${registerComponentCode}`
  return code
}

/**
 * 拷贝待插入js文件到node_modules下，并在入口中引用
 * @param {string} source 入口文件源码
 * @param {string} resourcePath 当前解析的文件的路径
 * @param {object} config loader配置
 * @param {string} config.injectJsEntry 入口文件路径，默认main.js
 * @param {string[]} scripts 要在入口注入的js文件路径
 * @param {object[]} components 插入组件配置
 * @param {string} components[].name 组件名称
 */
function injectJs(source, resourcePath, config) {
  const { injectJsEntry, scripts, components } = config
  // TODO 优化路径匹配方式
  if (injectJsEntry.toLowerCase() === resourcePath.toLowerCase()) {
    const code = getInjectCode(scripts, components)
    source = injectCodeAfterLastImportDeclaration(source, code)
  }
  return source
}

module.exports = {
  injectJs,
}
