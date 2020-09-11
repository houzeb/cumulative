const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const MiniCssExtractCSS = new MiniCssExtractPlugin({
    filename: 'static/main.[hash:8].css'
});

module.exports = {
    'mode': 'production',
    'devtool': 'false',
    'entry': {
        // 'vendors': ['react', 'react-router-dom', 'moment', 'axios', 'redux', 'react-redux', 'antd', 'lodash', 'react-dom', 'redux-logger', 'redux-promise'],
        'main': [
            path.resolve(__dirname, '../client/main.js'),
        ]
    },
    'output': {
        'filename': 'static/[name].bundle.[chunkHash:8].js',
        'publicPath': '/',
        'path': path.resolve(__dirname, '../build'),
        'chunkFilename': 'static/[name].[chunkHash:8].js',
    },
    'module': {
        'rules': [
            {
                'test': /\.(js|jsx)$/, // babel 转换为兼容性的 js
                'exclude': /node_modules/,
                'loader': 'babel-loader',
                'query': {
                    'presets': ['react', 'latest', 'stage-0'],
                    'plugins': ['transform-remove-console']
                },
                'include': path.resolve(__dirname, '../client')
            },
            {
                'test': /\.css$/,
                'loader': [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
            },
            {
                'test': /\.less$/,
                'loader': [MiniCssExtractPlugin.loader, 'css-loader', {
                    'loader': 'less-loader',
                    'options': {
                        'javascriptEnabled': true
                    }
                }, 'postcss-loader']
            },
            {
                'test': /\.(png|jpg|gif)$/,
                'use': [
                    {
                        'loader': 'url-loader?limit=8192&name=static/[name].[hash:8].[ext]'
                    }
                ]
            },
            {
                'test': /\.(svg|woff|ttf|eot)$/,
                'use': [
                    {
                        'loader': 'file-loader?name=static/[name].[hash:8].[ext]'
                    }
                ]
            }
        ]
    },
    'optimization': {
        'minimizer': [
            new UglifyJSPlugin({
                sourceMap: true,
                uglifyOptions: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true
                    }
                }
            })
        ],
        //   runtimeChunk: false,
        'splitChunks': {
            // 'chunks': 'all', // 必须三选一： "initial" | "all"(推荐) | "async" (默认就是async)
            // 'minSize': 30000, // 最小尺寸，30000
            // 'minChunks': 1, // 最小 chunk ，默认1
            // 'maxAsyncRequests': 5, // 最大异步请求数， 默认5
            // 'maxInitialRequests': 3, // 最大初始化请求书，默认3
            // 'automaticNameDelimiter': '~', // 打包分隔符
            // 'name': true, // 打包后的名称，此选项可接收 function
            'cacheGroups': {
                'commons': {
                    'name': 'commons',
                    'chunks': 'all',
                    'minChunks': 2,
                    'priority': 10
                }
            }
        }
    },
    'plugins': [
        new webpack.BannerPlugin('版权所有，翻版必究'),
        new webpack.optimize.ModuleConcatenationPlugin(),
        // new BundleAnalyzerPlugin(), // 打包分析
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.LoaderOptionsPlugin({
            'minimize': true,
            'debug': false
        }),
        MiniCssExtractCSS,
        new HtmlWebpackPlugin({
            'hash': false,
            'title': 'Graphene',
            'publicPath': '/',
            'filename': 'index.html',
            'template': path.resolve(__dirname, '../views/index.ejs'),
            'inject': 'body'
        }),
        new webpack.ProvidePlugin({
            '_': 'lodash'
        }),

        // 提取公共组件到dll
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('../build/bundle-manifest.json')
        }),
    ],
    'resolve': {
        'extensions': [
            '.js',
            '.jsx',
            '.png',
            '.gif',
            '.jpg',
            '.scss',
            '.css'
        ],
        'alias': {
            '@client': path.resolve(__dirname, '../client'),
            '@server': path.resolve(__dirname, '../server')
        }
    }
};
