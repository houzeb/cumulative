2 搭建vue开发环境

2.1 解析.vue文件
npm i -D vue-loader vue-template-compiler vue-style-loader
npm i -S vue

vue-loader 用于解析.vue文件 vue-template-compiler 用于编译模板

2.2 配置webpack-dev-server 进行热更新
npm i -D webpack-dev-server
配置如下
devServer:{
  port:3000,
  hot:true,
  contentBase:'../dist'
},
plugins:[
  new Webpack.HotModuleReplacementPlugin()
]
