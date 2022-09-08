const path = require('path')

const injectComponentRule = []
const components = [
  { path: 'uni-devtool/src/Devtool/index.vue', name: 'UniDevtool' },
  {
    path: 'uni-devtool/src/Devtool/components/H5Webview.vue', // 为了让H5Webview.vue能够被编译
    name: 'H5Webview',
    inject: false
  },
]
// const h5WebviewPath =
//   'node_modules/uni-devtool/src/Devtool/components/H5Webview'
const h5WebviewPath = 'node-modules/uni-devtool/src/Devtool/components/H5Webview' // uni-app中全局注册的组件被编译后会被放到node-modules目录下
const scripts = ['uni-devtool/src/Devtool/scripts']
const injectJsEntry = path.resolve('./src/main.js')
const pagesJsonPath = path.resolve('./src/pages.json')


const schema = {
  type: 'object',
  properties: {
    components: {
      description:
        '要自动插入的组件路径(可以是npm包或相对main.js的相对路径)、组件名, 如[{ path: "uni-devtool", name: "UniDevtool" }]',
      type: 'array',
    },
    scripts: {
      description:
        '在入口文件中注入的js文件路径列表, 可以是npm包或相对main.js的相对路径, 如：["uni-devtool/init.js"]',
      type: 'array',
    },
    devtool: {
      description: '是否开启devtool',
      type: 'boolean',
    },
    injectComponentRule: {
      anyOf: [
        {
          description: '需要自动插入组件的vue文件路径正则',
          instanceof: 'RegExp',
        },
        {
          description: '需要自动插入组件的vue文件路径正则列表',
          type: 'array',
        },
      ],
    },
    pagesJsonPath: {
      description: 'pages.json路径, 默认为src/pages.json',
      type: 'string',
    },
    injectJsEntry: {
      description: '要注入js的入口文件路径, 绝对路径, 默认为src/main.js',
      type: 'string',
    },
  },
}

const defaultConfig = {
  components,
  scripts,
  // TODO 使用minimatch优化 支持/pages/**/index.vue的格式.并支持数组
  injectComponentRule, // 默认匹配 pages.json中声明的路由
  pagesJsonPath,
  injectJsEntry,
  h5WebviewPath,
}

module.exports = {
  defaultConfig,
  schema,
}
