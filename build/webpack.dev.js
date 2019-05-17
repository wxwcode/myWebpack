const merge = require('webpack-merge')
const webpack = require('webpack')
const baseConfig = require('./webpack.base')

const devConfig = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  // webpackServer 开发环境服务配置
  devServer: {
    contentBase: './dist', // 根目录路径
    port: 3000,
    open: true, // 启动服务自动打开浏览器
    hot: true, // 模块热替换开启， 需要配合 HotModuleReplacementPlugin 使用，仅仅刷新替换的模块，而不刷新页面
    hotOnly: true // 当更新失败时也不会刷新页面
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
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: true
            }
          },
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // 模块热更新
  ],
  optimization: { // 生产环境下已默认，不需要配置
    usedExports: true // tree shaking, 引入导出模块后按需打包，全局引入（挂在 window 下的全局js）需要在package.json 中设置sideEffects参数
  }
}
module.exports = merge(baseConfig, devConfig)
