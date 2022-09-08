const fs = require('fs')

const addH5Webview = function (source, resourcePath, config) {
  const { h5WebviewPath, pagesJsonPath } = config
  if (pagesJsonPath.toLowerCase() === resourcePath.toLowerCase()) {
    const json = JSON.parse(fs.readFileSync(pagesJsonPath, 'utf-8'))
    json.pages.push({
      path: h5WebviewPath,
      style: {
        navigationBarTitleText: '加载中',
      },
    })
    console.log('json', json)
    source = JSON.stringify(json)
  }
  return source
}

module.exports = {
  addH5Webview,
}
