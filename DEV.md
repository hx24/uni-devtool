# 开发文档

## 创建软链
- 在当前loader项目 
```
npm link
```

在任意uni项目中
```
npm link uni-devtool
```

## 配置vue.config.js
按照README中的配置方式在uni项目中配置loader，额外需要注意的是，软链会造成一些路径解析问题，**需要配置[symlinks](https://webpack.js.org/configuration/resolve/#resolvesymlinks)**  

vue.config.js
```javascript
chainWebpack: (config) => {
  config.resolve.symlinks(false) // 解决软链问题
  // 以下为常规配置
  config.module
    .rule('mp-devtool') // 链式操作用来分组的名字
    .test(/\.(vue)|(js)$/)
    .pre()
    .exclude.add(/node_modules/)
    .end()
    .use('@weiyi/mp-devtool-loader')
    .loader('@weiyi/mp-devtool-loader')
    .options({
      devtool: true // 控制devtool只在非线上环境的注入，根据项目实际情况配置
    })
},
```
## 调试uni-devtool组件
若只开发调试devtool组件，直接启动调试即可

## debug loader

### 在uni项目中配置 vscode debug

![vscode](https://qnm.hunliji.com/Fq9h9DtqNqPRw0PoXAPaZUvf_PVT?imageView2/1/w/200)

```javascript
{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch via NPM",
      "runtimeExecutable": "npm",
      "runtimeArgs": [
        "run-script",
        "debug" // 对应package中scripts命令
      ],
      "port": 9229,
      "skipFiles": [
        "<node_internals>/**"
      ]
    }

  ]
}
```

在 package.json 的 scripts 添加命令

```json
"scripts": {
  "debug": "node --inspect=9229 ./node_modules/@vue/cli-service/bin/vue-cli-service serve",
  "serve": "vue-cli-service serve",
  "build": "vue-cli-service build",
  "lint": "vue-cli-service lint"
},
```

按f5即可启动调试。

