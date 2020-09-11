const path = require('path');
const webpack = require('webpack');
// const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const apiMocker = require('mocker-api');
module.exports = {
    'mode': 'development',
    'devtool': 'cheap-module-eval-source-map',
    'entry': {
        'main': [
            'eventsource-polyfill',
            path.resolve(__dirname, '../client/main.js')
        ],
        'lodash': 'lodash',
    },
    'output': {
        'filename': '[name].bundle.js',
        'publicPath': '/',
        'path': path.resolve(__dirname, '../public/'),
    },
    'module': {
        'rules': [
            {
                'enforce': 'pre',
                'test': /\.(js|jsx)$/,
                'exclude': /node_modules/,
                'loader': 'eslint-loader',
            },
            {
                'test': /\.(js|jsx)$/, // babel 转换为兼容性的 js
                'exclude': /node_modules/,
                'loader': 'babel-loader',
                'query': {
                    'presets': ['react', 'latest', 'stage-0', 'react-hmre']
                },
                'include': path.resolve(__dirname, '../client')
            },
            {
                'test': /\.css$/,
                'loader': ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                'test': /\.less$/,
                'loader': ['style-loader', 'css-loader', {
                    'loader': 'less-loader',
                    'options': {
                        'javascriptEnabled': true
                    }
                }]
            },
            {
                'test': /\.(png|jpg|gif|ico)$/,
                'use': [
                    {
                        'loader': 'url-loader',
                        'options': {
                            'limit': 8192
                        }
                    }
                ]
            },
            {
                'test': /\.(svg|woff|ttf|eot)$/,
                'use': [
                    {
                        'loader': 'file-loader',
                        'options': {}
                    }
                ]
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        contentBase: '../',
        hot: true,
        port: 3002,
        before(app) {
            apiMocker(app, path.resolve('./mocker/index.js'), {
            })
        }
    },
    resolve: {
        'extensions': [
            '.js',
            '.jsx',
            '.png',
            '.gif',
            '.jpg',
            '.ico',
            '.scss',
            '.css'
        ],
        'alias': {
            '@client': path.resolve(__dirname, '../client'),
            '@server': path.resolve(__dirname, '../server')
        }
    },
    'plugins': [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new HtmlWebpackPlugin({
            'hash': true,
            'title': 'Graphene',
            'filename': 'index.html',
            'template': path.resolve(__dirname, '../views/index.ejs'),
            'inject': 'body'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.NamedModulesPlugin()
    ]
};
