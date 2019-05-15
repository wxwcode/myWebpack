const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const prodConfig = {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  optimization: { // 生产环境下已默认，不需要配置
    usedExports: true // tree shaking, 引入导出模块后按需打包，全局引入（挂在 window 下的全局js）需要在package.json 中设置sideEffects参数
  }
}
// webpack-merge 顾名思义，这个包是用来合并webpack配置的
module.exports = merge(baseConfig, prodConfig)
