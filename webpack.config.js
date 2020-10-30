const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')

const TEMPLATE = path.resolve(__dirname, './public/index.html')
const SRC = path.resolve(__dirname, './src')

module.exports = {
  entry: './src/index.tsx',

  mode: 'development',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },

  module: {
    rules: [
      { test: /\.(t|j)sx?$/, include: SRC, use: 'babel-loader', enforce: 'pre' }, 
    ]
  },

  plugins: [
    new HtmlPlugin({
      filename: 'index.html',
      template: TEMPLATE,
      hash: true
    })
  ]
}