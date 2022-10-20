# webpack 面试题

## 1、Webpack 配置中用过哪些 Loader ？都有什么作用？

- babel-loader： 是在 Webpack 打包的时候，用 Babel 将 ES6+的代码转换成 ES5 版本的。
- thread-loader：它不处理具体的转换模块到 js 的工作，而是把他后面的 loader 扔进一个工作线程池（worker pool）中并发运行
- postcss-loader: 兼容一些低版本浏览器,需要给 css3 加前缀
- style-loader: 把解析后的 css 代码从 js 中抽离,放到头部的 style 标签中(在运行时做的)
- css-loader: 解析 css 文件代码

## 2、Webpack 配置中用过哪些 Plugin ？都有什么作用？

- html-webpack-plugin： 需要把最终构建好的静态资源（js/css）都引入到一个 html 文件中
- copy-webpack-plugin: 拷贝文件或者文件夹，此项目中主要是拷贝静态文件
- speed-measure-webpack-plugin：分析 webpack 的总打包耗时以及每个 plugin 和 loader 的打包耗时
- mini-css-extract-plugin: 将 css 提取到单独文件中
- css-minimizer-webpack-plugin： 压缩 css,但是会导致 webpack5 自带 js 压缩失效
- terser-webpack-plugin： 对 js 代码进行压缩混淆，去掉多余 debugger
- purgecss-webpack-plugin: css tree shaking
- compression-webpack-plugin: 将前端打包好的资源文件进一步压缩，生成指定的、体积更小的压缩文件

## 3、Loader 和 Plugin 有什么区别？

- loader: 是一个转换器，将 A 文件进行编译成 B 文件，比如：将 A.less 转换为 A.css，单纯的文件转换过程;运行在打包文件之前
- plugin: 是一个扩展器，它丰富了 webpack 本身，针对是 loader 结束后，webpack 打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听 webpack 打包过程中的某些节点，执行广泛的任务

## 4、Webpack optimize 有配置过吗？可以简单说说吗？

optimization 主要用来自定义一些优化打包策略，此项目中主要进行了一下两方面的优化：

- minimizer：压缩 css 和 js
- splitChunks: 将 node_modules 和公共页面内容单独提取 bundle，方便对不经常做修改的内容做缓存优化

## 5、Webpack 层面如何性能优化？

主要通过一下两个方面来进行性能优化

1. 优化构建速度
   - 开启持久化存储
   - 开启多线程 loader
   - 缩小 loader 作用范围
   - 精确使用 loader
   - 缩小模块搜索范围
   - devtool 配置
2. 优化构建结果文件
   - 抽离 css 样式文件
   - 压缩 js/css 文件
   - 第三方包和公共模块进行代码分割
   - 合理配置打包文件 hash
   - tree-shaking 清理未使用的 css/js
   - 资源懒加载/预加载
   - 打包生成 gzip 文件

## 6、Webpack 和 Rollup 有什么相同点与不同点？

1. 相同点
   - rollup 与 webpack 都是基于 JavaScript 依赖系统的一个打包构建工具
   - 都是通过解析 JavaScript 的依赖树将代码输出为指定版本的 JavaScript，供浏览器或者 node 环境执行
2. 不同点
   - rollup 相对 webpack 更轻量，其构建的代码并不会像 webpack 一样被注入大量的 webpack 内部结构，而是尽量的精简保持代码原有的状态
   - rollup 下一代 JavaScript 模块打包工具。开发者可以在你的应用或库中使用 ES2015 模块，然后高效地将它们打包成一个单一文件用于浏览器和 Node.js 使用。 Rollup 最令人激动的地方，就是能让打包文件体积很小
   - webpack 大而全，更适用于大型项目

## 7、Webpack 打包流程是怎样的？

1. 初始化。读取 webpack 的配置参数；

2. 启动 webpack。初始化 compiler 对象，注册所有的插件 plugins，插件开始监听 webpack 构建过程的生命周期事件，不同环节会有相应的处理，然后开始执行编译。

3. 从入口文件（entry）开始解析，并且找到其导入的依赖模块，递归遍历分析，形成依赖关系树；

4. 对不同文件类型的依赖模块文件使用对应的 Loader 进行编译，最终转为 Javascript 文件；

5. 完成编译并输出。得到每个文件结果，包含转换后的模块以及他们之前的依赖关系，根据 entry 以及 output 等配置生成代码块 chunk。

6. 打包完成。根据 output 输出所有的 chunk 到相应的文件目录

## 8、Webpack 热更新（HMR）是如何实现？

HMR 全称 Hot Module Replacement，可以理解为模块热替换，指在应用程序运行过程中，替换、添加、删除模块，而无需重新刷新整个应用

- 通过 webpack-dev-server 创建两个服务器：提供静态资源的服务（express）和 Socket 服务
- express server 负责直接提供静态资源的服务（打包后的资源直接被浏览器请求和解析）
- socket server 是一个 websocket 的长连接，双方可以通信
- 当 socket server 监听到对应的模块发生变化时，会生成两个文件.json（manifest 文件）和.js 文件（update chunk）
- 通过长连接，socket server 可以直接将这两个文件主动发送给客户端（浏览器）
- 浏览器拿到两个新的文件后，通过 HMR runtime 机制，加载这两个文件，并且针对修改的模块进行更新

## 9、Webpack 打包中 Babel 插件是如何工作的？

主要流程如下：

code --Parser--> Ast --Transformer--> New Ast --Generator--> New code

- Parser 解析我们的代码转换为 AST。
- Transformer 利用我们配置好的 plugins/presets 把 Parser 生成的 AST 转变为新的 AST。
- Generator 把转换后的 AST 生成新的代码

## 10、如何开发一个 loader

首先要了解 loader 是将非 javascript 文件转换为 webpack 能处理的有效模块，那么 loader 是一个输入资源转换输出的过程。

- loader.js 需要到导出一个函数，这个函数对加载的资源进行处理
- 函数输入为加载到的资源，输出为加工的资源
- 输入的结果有两种形式：第一就是输出为标准的 JS 代码，让打包结果可以正常执行，第二就是输出的结果交给下一个 loader 继续执行
- 开发好的 loader.js 配置到 webpack.config.js 下面的 module.rules

## 11、如何开发一个打包完成。根据 output 输出所有的 chunk 到相应的文件目录

首先要了解 plugin 是通过 webpack 的钩子机制(hooks)实现的，开发的插件可以通过这些不同的任务节点上挂载不同的任务。

- 创建一个 javascript 命名函数
- 在插件函数的 prototype 上定义一个 apply 方法
- 指定一个绑定到 webpack 自身的事件钩子
- 处理 webpack 内部实例的特点数据
- 功能完成以后调用 webpack 提供的回调

### 参考

- https://vue3js.cn/interview/webpack/HMR.html
- https://juejin.cn/post/6988059325784653838
- https://segmentfault.com/a/1190000013261724
