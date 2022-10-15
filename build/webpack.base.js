const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 单入口
  entry: path.join(__dirname, '../src/index.tsx'), // 入口文件配置
  // 多入口
  // entry: {
  //   pageOne: './src/pageOne/index.js',
  //   pageTwo: './src/pageTwo/index.js',
  // }
  // 多入口的也是一个出口配置
  output: {
    filename: 'static/js/[name].js', //定义输出文件名字
    path: path.join(__dirname, '../dist'),
    clean: true, //相当于webpack4中 clean-webpack-plugin,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/, // 匹配ts/tsx文件
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              // 从右往左进行处理，所以先处理ts, 再处理jsx
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          },
        },
      },
    ],
  },
  resolve: {
    // 主要是用来解决引入文件不配后缀的情况，从左到右
    extensions: ['.js', '.tsx', '.ts'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../public/index.html'),
      inject: true,
    }),
  ],
};
