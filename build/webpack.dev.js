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
  plugins: [
    new webpack.HotModuleReplacementPlugin() // 模块热更新
  ],
  optimization: { // 生产环境下已默认，不需要配置
    usedExports: true // tree shaking, 引入导出模块后按需打包，全局引入（挂在 window 下的全局js）需要在package.json 中设置sideEffects参数
  }
}
module.exports = merge(baseConfig, devConfig)
