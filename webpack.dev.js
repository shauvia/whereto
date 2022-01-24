const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/client/c_index.js',
  output: {
    clean: true, // Clean the output directory before emit.
  },
  module:{
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
      {
        test: /\.scss$/,
        use: [ 'style-loader', 'css-loader', 'sass-loader' ]
      },
    ]
  },
  plugins:[
    new HtmlWebPackPlugin({
      template: "./src/client/views/index.html",
      filename:"index.html",
    })
  ]
};
