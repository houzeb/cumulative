
打包命令
"build": "webpack src/main.js"
是webpack自己默认的配置

webpack.config.js 自定义配置
更改打包命令
"build": "webpack --config build/webpack.config.js"

开发中一般会将打包后的文件名称 加入hash值
output: {
  filename: '[name].[hash:8].js',      // 打包后的文件名称
  path: path.resolve(__dirname,'../dist')  // 打包后的目录
}

webpack打包出来的js文件我们需要引入到html中，由于加入hash值，每次手动修改js文件名很麻烦,因此我们一个插件
html-webpack-plugin


每次执行 npm run build 会发现 dist 文件夹里会残留上次打包的文件
使用 clean-webpack-plugin 在打包输出前青空文件夹


1.4 引用css
在入口文件js中引入css文件

同时需要loader来解析css文件
npm i -D style-loader css-loader
如果使用less来构建样式，还需要
npm i -D less less-loader

1.4.1 为css添加浏览器前缀
npm i -D postcss-loader autoprefixer
配置如下
rules:[
    {
        test:/\.less$/,
        use:['style-loader','css-loader','postcss-loader','less-loader'] // 从右向左解析原则
   }
]
// 还需要引入 autoprefixer 使其生效，有两种方式
1，在项目根目录中创建一个postcss.config.js
module.exports = {
    plugins: [require('autoprefixer')]  // 引用该插件即可了
}

2，直接在 webpack.config.js 里配置
rules:[{
    test:/\.less$/,
    use:['style-loader','css-loader',{
        loader:'postcss-loader',
        options:{
            plugins:[require('autoprefixer')]
        }
    },'less-loader'] // 从右向左解析原则
}]

// 这时候我们发现css通过style标签的方式添加到了html文件中，如果样式文件很多，全部添加到html中，难免显得混乱。需把css拆分出来用外链的形式引入css文件

1.4.2 拆分css
npm i -D mini-css-extract-plugin
配置文件如下
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  //...省略其他配置
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
           MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ],
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename: "[name].[hash].css",
        chunkFilename: "[id].css",
    })
  ]
}

1.4.3 拆分多个css
mini-css-extract-plugin会将所有的css样式合并为一个css文件。如果你想拆分为一一对应的多个css文件,我们需要使用到
extract-text-webpack-plugin，而目前mini-css-extract-plugin还不支持此功能。我们需要安装@next版本的
extract-text-webpack-plugin

npm i -D extract-text-webpack-plugin@next
配置文件如下
const path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
let indexLess = new ExtractTextWebpackPlugin('index.less');
let indexCss = new ExtractTextWebpackPlugin('index.css');
module.exports = {
  module:{
    rules:[
      {
        test:/\.css$/,
        use: indexCss.extract({
          use: ['css-loader']
        })
      },
      {
        test:/\.less$/,
        use: indexLess.extract({
          use: ['css-loader','less-loader']
        })
      }
    ]
  },
  plugins:[
    indexLess,
    indexCss
  ]
}

1.5 打包 图片、字体、媒体等文件
npm i -D file-loader url-loader
配置如下
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
}

1.6 用babel 转义js文件
npm i -D babel-loader @babel/preset-env @babel/core

注意 babel-loader与babel-core的版本对应关系
babel-loader 8.x 对应babel-core 7.x
babel-loader 7.x 对应babel-core 6.x
配置如下
rules: [
  {
    test:/\.js$/,
    use:{
      loader:'babel-loader',
      options:{
        presets:['@babel/preset-env']
      }
    },
    exclude:/node_modules/
  },
]

babel-loader只会将 ES6/7/8语法转换为ES5语法，但是对新api并不会转换 例如(promise、Generator、Set、Maps、Proxy等)此时我们需要借助babel-polyfill来帮助我们转换

npm i @babel/polyfill
配置如下
entry: ["@babel/polyfill",path.resolve(__dirname,'../src/index.js')],    // 入口文件
