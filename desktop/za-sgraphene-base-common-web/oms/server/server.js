/*
 * @Author: za-zhouchiye
 * @Date: 2018-07-04 12:03:46
 * @Description: ''
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-03-26 11:02:21
 * @ToDo: ''
 */
var Koa = require('koa');
var Router = require('koa-router');
var bodyParser = require('koa-bodyparser');
var serve = require('koa-static');
var views = require('koa-views');
var session = require('koa-session');
var path = require('path');
var webpack = require('webpack');
var compress = require('koa-compress');
require('colors');
var opn = require('opn');
var webpackDevMiddleware = require('koa-webpack-dev-middleware');
var webpackHotMiddleware = require('koa-webpack-hot-middleware');
var historyApiFallback = require('koa2-connect-history-api-fallback');
// var ejs = require('ejs');
// var logger = require('koa-logger');
var config = require('../config');
var conf = require('../env-config');
console.log('config', conf);
var devConfig = require('../webpack/webpack.dev');

// koa路由模块
var api = require('./controller/api');
var login = require('./controller/login');
var download = require('./controller/download');

// 端口设置
var PORT = conf.port || 8080;

var app = new Koa();
var router = new Router();

var options = { threshold: 2048 };
app.use(compress(options));

app.keys = ['some secret hurr'];
app.use(session(app));

app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

// app.use(logger());

// 开发环境启用devserver
if (!process.env.DEPLOY_ENV) {
    // 不同环境选用不同webpack配置
    var compile;
    compile = webpack(devConfig);
    app.use(historyApiFallback());
    app.use(webpackDevMiddleware(compile, {
        'noInfo': true,
        'publicPath': devConfig.output.publicPath,
        'stats': {
            'colors': true
        }
    }));

    app.use(webpackHotMiddleware(compile));
}

// 生产环境设置强缓存,5分钟
let koaStaticServe = process.env.DEPLOY_ENV ? { maxage: 300000 } : {};
app.use(serve(path.join(__dirname, config.dirname), koaStaticServe));
app.use(serve(path.join(__dirname, '../static')));

app.use(views(path.join(__dirname, config.dirname), {
    'extension': 'html'
}));

// response
app.use(async(ctx) => {
    await ctx.render('index');
});

router.get('/health', function(ctx) {
    ctx.status = 200;
});

router.all('/getSysHost', async(ctx) => {
    ctx.response.body = {
        success: true,
        value: conf
    };
});
// 校验登录
router.all(/^\//, login);

// 文件下载
router.all(/^\/download/, download);

// 接口转发
router.all(/^\/api/, api);
router.all(/^\/getUserInfo/, async(ctx) => {
    ctx.response.body = ctx.session.userInfo;
});
router.all(/^\/getTicket/, async(ctx) => {
    ctx.response.body = {
        success: true,
        value: ctx.session.ticket
    };
});
// error
app.on('error', (err, ctx) => {
    if (ctx.request.url !== '/__webpack_hmr' && ctx.request.url.indexOf('hot-update.json') < 0) {
        console.error('错误信息:', err);
        console.error('错误信息请求地址:', ctx.request.url);
        console.log('------------------------------------------');
    }
});

app.listen(PORT, () => {
    console.log(`\n\n------------------------------------------------\n`.rainbow);
    console.log(`正在监听: ${PORT}`.red);
    console.log(`当前环境: ${process.env.DEPLOY_ENV || 'local'}`.red);
    console.log(`\n------------------------------------------------\n\n`.rainbow);
    if (!process.env.DEPLOY_ENV) {
        // opn(`http://localhost:${PORT}`, { app: ['google chrome'] });
    }
});
