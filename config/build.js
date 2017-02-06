var path = require('path')
// var webpack = require('webpack')
module.exports = {
  entry: './scrollview/index.js',
  output: {
    filename: 'scrollview.js',
    library: 'scrollview',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  devtool: 'source-map'
}
