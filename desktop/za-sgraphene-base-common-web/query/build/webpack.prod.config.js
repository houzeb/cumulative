var path = require('path');
var webpack = require('webpack');
var base = require("./webpack.base.config.js");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var babelPolyfill = require("babel-polyfill");

module.exports = {
  //entry:{
    //dist:base.srcPath + '/index.js',
    //vendor:[base.srcPath + '/lib/T.js']
  //},
   entry: [
    "babel-polyfill",
     base.srcPath + '/index.js'
   ],
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
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
        //use: ['style-loader', 'css-loader']
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader'
        })   
      },
      {
            test: /\.(sass|scss)$/,
            include: [base.srcPath],
            exclude: [base.libPath],
            use: ExtractTextPlugin.extract({
              use: [
                  {
                      loader : 'css-loader?importLoaders=1',
                  },
                  {
                      loader : 'postcss-loader'
                  },
                  {
                      //加载sass-loader同时也得安装node-sass;
                  loader: "sass-loader",
                    //配置参数;
                    options: {
                        //sass的sourceMap
                        sourceMap:false,
                        //输出css的格式两个常用选项:compact({}行), compressed(压缩一行)
                        outputStyle : 'compressed'
                    }
                }
              ]
            })
        },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
    }),
    new HtmlWebpackPlugin({
        hash:true,
        inject: 'body',
        filename:"index.html",
        template: base.srcPath + '/template.html'
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_debugger: true,
          drop_console: true
        },
        sourceMap: false,
        comments: false
        
    }),
    new ExtractTextPlugin({ 
           filename: 'index.css', 
           allChunks: true 
    }),
    new webpack.optimize.CommonsChunkPlugin({
          names: ['vendor', 'manifest']
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin()
  ]
};
