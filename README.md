# 小程序调试工具

> 基于uni-app


![图片](https://qnm.hunliji.com/FgbQbE_gbcuK_wps-JfyE5KwMhIB)

<p align=center><img width="300" src="https://qnm.hunliji.com/FpH5sTmeMbSaYxeT-EAQAlGVJlco" alt="功能预览动图"  /></p>

## 支持功能
- network查看
- 扫码打开h5页面
- 查看页面基本信息
- 全局注入自定义组件

## 更新日志

## 使用方式

### 1.安装依赖

```bash
npm i uni-devtool --save-dev
```

### 2.修改vue.config.js
> 注意区分环境，只在非正式环境注入

```javascript
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('uni-devtool') // 链式操作用来分组的名字
      .test(/\.(vue)|(js)|(json)$/)
      .pre()
      .exclude.add(/node_modules/)
      .end()
      .use('uni-devtool')
      .loader('uni-devtool')
      .options({
        devtool: true, // 是否开启调试工具，可根据项目实际情况，控制在不同环境下是否开启
      })
  },
}
```

### 选项

#### components
要在每个页面注入的自定义组件
```javascript
{
  components: [{
      path: 'my-button/components/index.vue', // 组件路径，node_modules里的组件，或相对main.js的相对路径，如./components/my-button/index.vue
      name: 'MyButton' // 组件名，驼峰形式
    }]
}
```

#### devtool
是否注入调试工具，根据各小程序具体情况判断，只在非线上环境注入。


#### pagesJsonPath
pages.json文件的绝对路径，以该文件里的配置判断是否为页面级vue，给其注入组件调用。默认为src/pages.json

#### injectComponentRule
pages.json不满足需求时，可以配置injectComponentRule，接收正则数组。
## 工作原理
在入口(默认为src/main.js)文件中引入要注入的组件并注册为全局组件，并进行一些初始化（重写wx.request等），根据项目pages.json，在编译时对每个**页面文件**中的template中插入组件的调用。

### main.js
```javascript
// 插入
import MyButton from 'my/button/index.vue' // 组件名和路径对应上面配置的name和path，所以是相对main.js的路径
Vue.component('my-button', MyButton)
```

### 页面文件
源文件
```vue
<template>
  <div>
    hello
  </div>
</template>
<script>
 // ...
</script>
```

编译时经loader处理后
```vue
<template>
  <div><wy-mp-devtool></wy-mp-devtool>
    hello
  </div>
</template>
<script>
 // ...
</script>
```


