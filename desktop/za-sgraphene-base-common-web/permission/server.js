var express = require('express');
var app = express();
var http = require("http");
var config = require("./env-config");
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser())
app.use(session({
  name: 'nodejs_sid_permission',
  secret: config.sessionConfig.secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, //true表示https
    // domain: config.sessionConfig.domain
  }
}));

app.use(function (err, req, res, next) {
  if (!err) return next(); // you also need this line
  console.log("err:" + err);
  res.send("error!!!");
});

app.get('/health', function (req, res) {
  return res.status(200).send('OK');
});

app.use("/", require('./server/checkLogin'));
app.use(/^\/ajax/i, require('./server/ajax'))  //ajax转发

var proxy = require('http-proxy-middleware');
const options = {
  target: 'http://' + config.ajaxHost,
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('xticket', req.query.ticket || req.session.ticket || "");
    proxyReq.setHeader('X-Requested-With', "XMLHttpRequest");
  },
  pathRewrite: { '^/ajax': '' }
}
const apiProxy = proxy(options)
app.use("/ajax/user/changeAvatar", apiProxy)
var guojihuaTranslate = {
  target: 'http://' + config.i18nHost,
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log("proxy----", 'http://' + config.i18nHost + req.path);
    proxyReq.setHeader('Content-Type', "application/json");

  },
  onProxyRes: (proxyRes, req, res) => {

  },
  pathRewrite: { '^/guojihua': '' }
}
var guojihua = proxy(guojihuaTranslate)
app.use(/^\/guojihua/i, guojihua)
// app.use(/^\/sso/i, require('./server/sso'));//客户端重定向到sso

app.use('/', require('connect-history-api-fallback')());

app.use('/', express.static('public'));


app.use("/favicon.ico", function (req, res) {
  res.end();
});

if (!process.env.DEPLOY_ENV) {
  var webpack = require('webpack');
  var webpackConfig = require('./build/webpack.dev.config.js');
  var webpackCompiled = webpack(webpackConfig);
  // 配置运行时打包
  var webpackDevMiddleware = require('webpack-dev-middleware');
  app.use(webpackDevMiddleware(webpackCompiled, {
    publicPath: "/",
    stats: { colors: true },
    lazy: false,
    watchOptions: {
      aggregateTimeout: 300
    },
  }));

  // 配置热更新
  var webpackHotMiddleware = require('webpack-hot-middleware');
  app.use(webpackHotMiddleware(webpackCompiled));
}

http.createServer(app).listen(config.port, function () {
  console.log('Open http://localhost:%s', config.port);
});
