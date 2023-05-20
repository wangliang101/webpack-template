const path = require('path');
const { merge } = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const baseConfig = require('./webpack.base.js');

// 服务端口号
const devServerPort = 8888;
module.exports = merge(baseConfig, {
  mode: 'development', //开发模式，会省去代码优化步骤，打包速度会比生产环境快
  devtool: 'eval-cheap-module-source-map', // Tradeoff choice for development builds. build:slow, rebuild: fast
  stats: 'errors-only', //只是想要获取某部分 bundle 的信息，
  devServer: {
    port: devServerPort, // 服务端口号
    compress: false, // 开发环境不开启压缩
    client: {
      progress: true
    },
    hot: true,
    historyApiFallback: true, // When using the HTML5 History API, the index.html page will likely have to be served in place of any 404 responses
    static: {
      directory: path.join(__dirname, '../public') //托管静态资源public文件夹
    }
  },
  plugins: [
    new ReactRefreshWebpackPlugin(), // 添加热更新插件
    // 整理terminal输出内容
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`You application is running here http://localhost:${devServerPort}`],
        notes: ['Some additionnal notes to be displayed unpon successful compilation']
      },
      clearConsole: true
    })
  ]
});
