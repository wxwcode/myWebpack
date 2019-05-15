const express = require('express')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpack = require('webpack')
const config = require('./webpack.config')
const compiler = webpack(config)
const app = express()


app.use(webpackDevMiddleware(compiler, {}))
app.listen(3000, () => {
  console.log('server is running in the 3000 prot')
})
