const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  entry: './popup.js',
  output: {
    filename: 'popup.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Shmeordtciaut',
      filename: 'popup.html',
      template: 'popup.html'
    })
  ]
}

