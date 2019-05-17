const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const prodConfig = {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  optimization: { // 生产环境下已默认，不需要配置
    usedExports: true // tree shaking, 引入导出模块后按需打包，全局引入（挂在 window 下的全局js）需要在package.json 中设置sideEffects参数
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader', // 挂载 css 到 html 文件， 或者dom元素上
          {
            loader: 'css-loader', // 识别处理 css 内容
            options: {
              importLoaders: 2, // 如果遇见了css文件跳过前面2个loader的处理
              modules: true // 开启css模块化
            }
          },
          'sass-loader', // 解析 sass 文件内容为 css 内容
          'postcss-loader' // 类似loader插槽，在里面可以配置关于 css 解析的plugin， 另外有自己的配置文件postcss.config.js， autoprefixer将处理css中兼容问题，如自动加css浏览器厂商前缀--webskit--
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 替换style-loader
          {
            loader: 'css-loader', // 识别处理 css 内容
            options: {
              importLoaders: 2, // 如果遇见了css文件跳过前面2个loader的处理
              modules: true // 开启css模块化
            }
          },
          'postcss-loader' // 类似loader插槽，在里面可以配置关于 css 解析的plugin， 另外有自己的配置文件postcss.config.js， autoprefixer将处理css中兼容问题，如自动加css浏览器厂商前缀--webskit--
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({}) // css代码分割后进行压缩
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ // css代码分割
      filename: '[name].css',
      chunkFilename: '[id].css',
    })
  ]
}
// webpack-merge 顾名思义，这个包是用来合并webpack配置的
module.exports = merge(baseConfig, prodConfig)
