const path = require('path');
const webpack = require('webpack');
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
    clean: true, // 相当于webpack4中 clean-webpack-plugin,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/, // 匹配ts/tsx文件
        use: 'babel-loader',
      },
      {
        test: /.(css|less)$/,
        // style-loader: 把解析后的css代码从js中抽离,放到头部的style标签中(在运行时做的)
        // css-loader: 解析css文件代码
        // less-loader要求安装less
        // postcss-loader: 兼容一些低版本浏览器,需要给css3加前缀
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
      },
      {
        test: /.(png|jpg|jpeg|gif|svg)$/, // 匹配图片，使用内置asset-module模块进行处理
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb将会视为 inline 模块类型，否则会被视为 resource 模块类型。
          },
        },
        generator: {
          filename: 'static/images/[name][ext]', // 文件输出路径和命名
        },
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb将会视为 inline 模块类型，否则会被视为 resource 模块类型。
          },
        },
        generator: {
          filename: 'static/fonts/[name][ext]', // 文件输出路径和命名
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb将会视为 inline 模块类型，否则会被视为 resource 模块类型。
          },
        },
        generator: {
          filename: 'static/media/[name][ext]', // 文件输出路径和命名
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
    new webpack.DefinePlugin({
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV),
    }),
  ],
};
