var path = require('path');
/**
 * 项目的公共配置
 */
module.exports = {
    publicPath: '/',    // 服务器部署路径
    staticPath: path.resolve(__dirname,'..',  'public'),    // 导出地址
    outputPath:path.resolve(__dirname, 'dist'),//最终打包后发到线上的代码的地址
    rootPath: __dirname, // 项目根目录
    srcPath: path.resolve(__dirname, '..', 'src'),
    libPath: path.resolve(__dirname, '..', 'node_modules')
};