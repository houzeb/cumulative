/*
 * @Author: za-zhouchiye
 * @Date: 2018-07-04 12:01:11
 * @Description: ''
 * @Last Modified by: za-zhouchiye
 * @Last Modified time: 2018-12-14 14:50:30
 * @ToDo: ''
 */
var T = require('../utils.js');
var config = require('../../env-config');
var axios = require('axios');
var Cookies = require('universal-cookie');
var toLogin = function(ctx) {
    var url = T.getLoginUrl(ctx);
    if (RegExp('api').test(ctx.originalUrl)) {
        ctx.response.body = {
            success: true,
            code: '101'
        };
    } else {
        ctx.redirect(url);
    }
};
module.exports = async function(ctx, next) {
    var ticket = T.urlQuery('ticket', ctx.url);
    var res = {};
    var data = {};
    // 页面url访问时，以url中参数ticket为优先判断，如果有值，存入session并拿到最新的用户信息存入session
    if (ticket) {
        res = await axios.post(`${config.protocol + config.api.sso}/validate4cors.json`, {
            service: 'productCenter',
            ticket: ticket
        });
        if (!res.data.success) {
            toLogin(ctx);
            return;
        }
        data = JSON.parse(T.decrypt(res.data.value));
        if (data.userId) {
            ctx.session.islogin = true;
            ctx.session.ticket = ticket;
            ctx.session.userInfo = data;
        } else {
            ctx.session.islogin = false;
            ctx.session.ticket = undefined;
        }
    }

    // 如果是webpack开发环境的监听，放过
    if (ctx.url.indexOf('webpack') > -1 || ctx.url.indexOf('.') > -1) return next();

    // 退出登录
    if (ctx.url === '/logout') {
        var log = await axios({
            method: 'POST',
            url: `${config.protocol + config.api.sso}/logout.json`,
            headers: { 'xticket': ctx.session.ticket || '' }
        });
        if (log.data.success) {
            ctx.session.islogin = false;
            ctx.session.ticket = undefined;
            ctx.session.userInfo = undefined;
            toLogin(ctx);
            return;
        }
    }

    // 如果url参数没有ticket并且已登录，就判断islogin这个标识符
    if (ctx.session.islogin) {
        await next();
    } else {
        var cookies = new Cookies(ctx.request.header.cookie);
        ticket = T.urlQuery('ticket', ctx.url);
        if (!ticket) ticket = ctx.session.ticket ? ctx.session.ticket : cookies.get('ticket');
        if (!ticket) {
            toLogin(ctx);
            return;
        }
        res = await axios.post(`${config.protocol + config.api.sso}/validate4cors.json`, {
            service: 'productCenter',
            ticket: ticket
        });
        if (!res.data.success) {
            toLogin(ctx);
            return;
        }
        data = JSON.parse(T.decrypt(res.data.value));
        if (data.userId) {
            ctx.session.islogin = true;
            ctx.session.ticket = ticket;
            ctx.session.userInfo = data;
            await next();
        } else {
            ctx.session.islogin = false;
            ctx.session.ticket = undefined;
        }
    }
};
