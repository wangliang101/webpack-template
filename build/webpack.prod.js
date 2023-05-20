const path = require('path');
// Provides a similar API to glob, however instead of a single pattern, you may also use arrays of patterns.
const globAll = require('glob-all');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// 5.0.0修改后应该这么应用
// const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = merge(baseConfig, {
  // 生产模式。自动包含UglifyJsPlugin、optimize.ModuleConcatenationPlugin、NoEmitOnErrorsPlugin插件,默认开启tree-shaking
  // ModuleConcatenationPlugin： 可以提升(hoist)或者预编译所有模块到一个闭包中，提升你的代码在浏览器中的执行速度
  // NoEmitOnErrorsPlugin： 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误
  mode: 'production',
  optimization: {
    minimizer: [
      // 此插件会导致webpack内置的terser-webpack-plugin(默认支持多进程)插件压缩js文件失效
      new CssMinimizerPlugin(),
      new TerserPlugin({
        // 压缩js
        parallel: true, // 开启多线程压缩
        terserOptions: {
          compress: {
            pure_funcs: ['console.log'] // 删除console.log
          }
        }
      })
    ],
    splitChunks: {
      cacheGroups: {
        // 提取node_modules代码
        vendors: {
          test: /node_modules/, // 只匹配node_modules里面的模块
          name: 'vendors', // 提取文件命名为vendors,js后缀和chunkhash会自动加
          minChunks: 1, // 只要使用一次就提取出来
          chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
          minSize: 0, // 提取代码体积大于0就提取出来
          priority: 1 // 提取优先级为1
        },
        // 提取页面公共代码
        commons: {
          name: 'commons', // 提取文件命名为commons
          minChunks: 2, // 只要使用两次就提取出来
          chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
          minSize: 0 // 提取代码体积大于0就提取出来
        }
      }
    }
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, '../public'),
          to: path.join(__dirname, '../dist'),
          filter: source => {
            console.log('source', source);
            return !source.includes('index.html');
          }
        }
      ]
    }),
    // 抽离css插件, 需要和webpack.base.js中MiniCssExtractPlugin.loader配合
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css' // 抽离css的输出目录和名称
    }),
    // 清理无用css,不过这个组件也有些沙雕，只要文件内包含和样式文件内相同的classname即不会去删除
    new PurgeCSSPlugin({
      // 检测src下所有tsx文件和public下index.html中使用的类名和id和标签名称
      // 只打包这些文件中用到的样式
      paths: globAll.sync([
        `${path.join(__dirname, '../src')}/**/*.tsx`,
        `${path.join(__dirname, '../public')}/index.html`
      ]),
      safelist: {
        standard: [/^ant-/] // 过滤以ant-开头的类名，哪怕没用到也不删除
      }
    }),
    new CompressionPlugin({
      test: /.(js|css)$/, // 只生成css,js压缩文件
      filename: '[path][base].gz', // 文件命名
      algorithm: 'gzip', // 压缩格式,默认是gzip
      threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
      minRatio: 0.8 // 压缩率,默认值是 0.8
    })
  ]
});
