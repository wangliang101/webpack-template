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

## 4、Webpack optimize 有配置过吗？可以简单说说吗？

## 5、Webpack 层面如何性能优化？

## 6、Webpack 和 Rollup 有什么相同点与不同点？

## 7、Webpack 打包流程是怎样的？

## 8、Webpack 热更新（HMR）是如何实现？

## 9、Webpack 打包中 Babel 插件是如何工作的？
