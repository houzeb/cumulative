// webpack.config.js

const path = require('path')
const Webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

let indexLess = new ExtractTextWebpackPlugin('index.less')
let indexCss = new ExtractTextWebpackPlugin('index.css')

const vueLoaderPlugin = require('vue-loader/lib/plugin')

// Q: 多入口文件如何开发？
// A: 生成多个html-webpack-plugin 实例来解决这个问题

module.exports = {
  mode: 'development', // 开发模式
  entry: {
    main: ["@babel/polyfill", path.resolve(__dirname, '../src/main.js')], // 入口文件
    header: ["@babel/polyfill", path.resolve(__dirname, '../src/header.js')]
  },
  output: {
    filename: '[name].[hash:8].js', // 打包后的文件名称
    path: path.resolve(__dirname, '../dist') // 打包后的目录
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.runtime.esm.js',
      '@': path.resolve(__dirname, '../src')
    },
    extensions: ['*', '.js', '.json', '.vue']
  },
  devServer: {
    port: 3000,
    hot: true,
    contentBase: '../dist'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.css$/,
        use: indexCss.extract({
          use: ['css-loader'] // 从右向左解析规则
        })
      },
      {
        test: /\.less$/,
        use: indexLess.extract({
          use: ['css-loader', 'less-loader'] // 从右向左解析规则
        })
      },
      {
        test: /\.(jpe?g|png|gif)$/i, //图片文件
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                    name: 'img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new Webpack.HotModuleReplacementPlugin(),
    new vueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      chunks: ['main'] // 与入口文件对应的模块名
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/header.html'),
      filename: 'header.html',
      chunks: ['header'] // 与入口文件对应的模块名
    }),
    // new MiniCssExtractPlugin({
    //   filename: "[name].[hash].css",
    //   chunkFilename: "[id].css"
    // })
    indexLess,
    indexCss
  ]
}
