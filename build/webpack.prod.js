const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(baseConfig, {
  // 生产模式。自动包含UglifyJsPlugin、optimize.ModuleConcatenationPlugin、NoEmitOnErrorsPlugin插件
  // ModuleConcatenationPlugin： 可以提升(hoist)或者预编译所有模块到一个闭包中，提升你的代码在浏览器中的执行速度
  // NoEmitOnErrorsPlugin： 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误
  mode: 'production',
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, '../public'),
          to: path.join(__dirname, '../dist'),
          filter: (source) => {
            console.log('source', source);
            return !source.includes('index.html');
          },
        },
      ],
    }),
  ],
});
