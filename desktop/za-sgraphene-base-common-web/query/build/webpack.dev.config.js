var path = require('path');
var webpack = require('webpack');
var base = require("./webpack.base.config.js");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var babelPolyfill = require("babel-polyfill");

module.exports = {
  entry: [
    "babel-polyfill",
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    base.srcPath + '/index.js'
  ],
  output: {
    filename: 'dist.js',
    //chunkFilename: 'chunk.[id].[hash:8].js',
    path: base.staticPath,
    publicPath: base.publicPath
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'stage-0', 'react'],
            plugins: [
              ['react-hot-loader/babel'],
              ['import', {"libraryName": "antd", "style": "css"}]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
          test: /\.scss$/,
          include: [base.srcPath],
          exclude: [base.libPath],
          use: ['style-loader', "css-loader", "sass-loader"],
          //use: ExtractTextPlugin.extract({
          //    use: "sass-loader"
          //})
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
    }),
    //new ExtractTextPlugin('index.css'),
    new HtmlWebpackPlugin({
            hash:true,
            inject: 'body',
            filename:"index.html",
            template: base.srcPath + '/template.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
  ]
};
