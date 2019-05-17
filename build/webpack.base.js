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
    chunkFilename: '[name].chunk.js', // chunk 打包出的js文件名字规则
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
            }],
            /** 支持import语法引入模块，同时可以使用magic comments(魔法注释), 配合code splitting设置
             * webpackChunkName： 代码分割名字
             * webpackPrefetch: < Boolen > 开启模块js的预加载（当网络空闲时）推荐
             * webpackPreload: < Boolen > 开启模块js的预加载（ 与主页面js一块加载）
             *
             * 优化要点： 通过 code splitting 策略让页面的js代码使用覆盖率最高（操作：command + sift + p -> show coverage），然后预加载其他js模块
             */
            "@babel/plugin-syntax-dynamic-import" //
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
  optimization: {
    splitChunks: { // code splitting 代码分割
      chunks: 'all', // all：所有的都进行代码分割；async： 异步引入的模块进行代码分割； initial： 对同步引入代码做分割，同步一定会走cacheGroups配置
      minSize: 30000, // 引入的模块小于30000字节(30kb)，不会进行代码分割
      minChunks: 1, // 引入里 1 次才进行分割
      maxAsyncRequests: 5, // 同时加载分割代码的个数 （比如浏览器最多同时加载5个js文件）， 超出5的不进行代码分割
      maxInitialRequests: 3, // 单页面入口（首页）加载 3 个js文件， 超过3个不进行代码分割
      automaticNameDelimiter: '~', // 分割后生成js文件名： 分组、文件名、hash等之间的连接符（vendors～main~e122dsa1.js）
      name: true, // 分组设置的filename是否生效
      cacheGroups: { // 代码分割缓存组
        vendors: { // vendors分组
          test: /[\\/]node_modules[\\/]/, // 此分组匹配的路径
          priority: -10, // 权限值：符合test后比较 priority， 越大权限越高
          filename: 'vendors.js' // 分割打包的js文件名字（默认是入口文件名称）
        },
        default: {
          // minChunks: 2,
          priority: -20,
          reuseExistingChunk: true, // 如果引入的模块已经在其他的地方被打包过， 那么就不再打包，直接会引用已被打包的代码
          filename: 'common.js'
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html' // 以index.html 为模板插入到打包文件中
    }),
    new CleanWebpackPlugin() // 清除 output 文件
  ]
}
