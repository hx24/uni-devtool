/**
 * 驼峰转连字符 -
 * @param {string}} name
 */
 function humpToHyphen(name) {
  return name.replace(/\B([A-Z])/g, "-$1").toLowerCase()
}

module.exports = {
  humpToHyphen
}