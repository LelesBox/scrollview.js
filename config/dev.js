var path = require('path')
var colors = require('colors/safe')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')

module.exports = {
  entry: {
    index: ['./src/index.js']
  },
  output: {
        // 将构建打包输出的app.js放到build目录下
    path: path.resolve(__dirname, '../dist'),
        // webpack构建输出的临时文件存放到内存中，而且是以publicPath作为相对路径。
        // publicPath并不会影响输出目录
        // 此外，如果指定路径下已经存在了相同文件，webpack会优先使用内存的临时文件
    publicPath: '/static/',
        // 可以对构建输出的app.js进行二次定制化命名，比如加时间戳等
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.html$/,
        loader: 'html',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    function () {
      this.plugin('watch-run', function (watching, callback) {
        console.log(colors.yellow('Begin compile at ' + new Date()))
        callback()
      })
    },
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      filename: 'index.html',
      template: 'src/index.html'
    }),
    new HtmlWebpackHarddiskPlugin({
      outputPath: path.resolve(__dirname, '../')
    })
  ],
  devtool: 'source-map'
}
