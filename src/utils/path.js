const path = require("path")

/**
 * @param {string} target 待校验路径
 * @param {RegExp | RegExp[]} rules 待校验规则, 支持正则或正则数组
 * @returns
 */
function pathRulesTest(target, rules) {
  const { regRules, pagesJsonPath } = rules

  const regPass = testRegRules(target, regRules)
  if (regPass) return true

  const pagePaths = formatPageJson(pagesJsonPath) || []
  if (pagePaths.find((pagePath) => target.includes(pagePath))) return true

  return false
}

function testRegRules(target, rules) {
  // TODO 支持 /pages/**/*.vue格式的字符串
  if (rules instanceof RegExp) {
    return rules.test(target)
  }

  if (Array.isArray(rules)) {
    return !!rules.find((rule) => testRegRules(targe, { rules: rule }))
  }
}

const formatPageJson = (function () {
  let allPagePaths = []
  /**
   *
   * @param {string} pagesJsonPath uni-app的page.json文件绝对路径
   * @returns string[]
   */
  return function formatPageJson(pagesJsonPath) {
    if (allPagePaths && allPagePaths.length) return allPagePaths
    if (!pagesJsonPath) return allPagePaths
    try {
      const pageJson = require(pagesJsonPath)
      const { pages, subpackages } = pageJson || {}
      pages.map((page) => allPagePaths.push(replacePathSep(page.path)))

      if (subpackages && subpackages.length) {
        subpackages.forEach((subPackage) => {
          const { root, pages: subPages } = subPackage
          ;(subPages || []).forEach((subPage) =>
            allPagePaths.push(replacePathSep(root + "/" + subPage.path))
          )
        })
      }
    } catch (error) {
      console.error("wy-mp-devtool: 解析page.json错误", error)
    }

    return allPagePaths
  }
})()

function replacePathSep(_path) {
  return (_path || "").replace(/\//g, path.sep) + ".vue"
}

module.exports = {
  pathRulesTest,
}
