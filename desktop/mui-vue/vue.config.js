const webpack = require('webpack');
const path = require('path');
module.exports = {
  // 是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', path.resolve(__dirname, './src'))
      .set('mui', path.resolve(__dirname, './src/assets/MUI/js/mui.js'))
  },
  configureWebpack: {
    // 增加一个plugins
    plugins: [
      new webpack.ProvidePlugin({
        mui: "mui",
        "window.mui": "mui"
      })
    ]
  },
}
