const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    main: './src/main.js'
    // sub: './src/main.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/, // 除此路径下的文件外
        /**  思考：什么是babel， 它的作用是什么？
         *  一个js库，作用将js转换成一个虚拟的抽象语法树（AST）存放在内存中，然后通过@babel/xxx下的核心库做各种逆向解析，从而转换成需要的语法
         * 参考资料： 抽象语法树（ AST） https: //segmentfault.com/a/1190000016231512
         */
        loader: "babel-loader", // 通过 babel-loader 构建js文件和 webpack 连通
        // babel 的 options 配置非常复杂，参考 babel 官网， 可以将 options 配置单独配置一个文件（默认文件名 .babelrc, 内容类似json对象）
        options: {
          /**
           * js兼容处理方案1
           * 缺陷： @babel/polyfill 全局注入污染全局环境变量
           * 使用场景： 适合项目开发（推荐）， 不适用写类库（想一下，别人项目引入里你的类库会污染里别人的项目吧）
           *
          // 通过 @babel/preset-env 将ES6翻译为ES5，但是ES5缺失的兼容代码需要通过 @babel/polyfill 转换，如： Array.map
          presets: [['@babel/preset-env', {
            useBuiltIns: 'usage', // 对 @babel/polyfill 里的兼容代码按需引入打包
            targets: { // 满足下面条件的浏览器将不会使用 @babel/polyfill做兼容代码转换
              edge: "17",
              firefox: "60",
              chrome: "67", // chrome浏览器67版本以上
              safari: "11.1",
            }
          }]]
          */
          /**
           * js兼容处理方案2
           * 好处： 不污染全局环境变量
           * 使用场景： 适用写类库
           * 参照： babel官网文档 transform-runtime
           */
          'plugins': [
            ['@babel/plugin-transform-runtime', { // 创建沙盒环境防止污染全局（创建局部变量，闭包函数）
              // corejs 是一个给低版本的浏览器提供接口的库，如 Promise, map, set 等,
              // 局部引入一般设置成number：2，此时还需要安装库 @babel/runtime-corejs2 来重写需要可填充API的辅助对象core-js
              'corejs': 2,
              // 内联Babel helpers（ classCallCheck， extends， 等）被模块化
              'helpers': true,
              // regenerator生成器模块化
              'regenerator': true,
              'useESModules': false
            }]
          ]
        }
      },
      {
        test: /\.(jpg|png|gif|pdf)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outpath: 'images/',
            limit: 10240
          }
        }
      },
      {
        test: /\.(eot|ttf|svg)$/,
        use: {
          loader: 'file-loader'
        }
      },
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
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html' // 以index.html 为模板插入到打包文件中
    }),
    new CleanWebpackPlugin() // 清除 output 文件
  ]
}
