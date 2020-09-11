/*
 * @Author: za-zhouchiye
 * @Date: 2018-07-04 12:03:34
 * @Description: ''
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-04-17 19:20:01
 * @ToDo: ''
 */
import config from '../env-config';
import localConfig from '../config';
import crypto from 'crypto';
import url from 'url';

var T = {
    'urlQuery': function (key, url) {
        url = url || location.href;
        var reg = new RegExp('[?&#]' + key + '=([^&#]*)', 'i');
        var match = url.match(reg);
        var result;

        if (match) {
            try {
                result = decodeURIComponent(match[1]) || '';
                return result;
            } catch (e) {
                console.log(e);
            }
        }
        return '';
    },
    removeURLParameter: function (url, parameter) {
        // prefer to use l.search if you have a location/link object
        var urlparts = url.split('?');
        if (urlparts.length >= 2) {
            var prefix = encodeURIComponent(parameter) + '=';
            var pars = urlparts[1].split(/[&;]/g);

            // reverse iteration as may be destructive
            for (var i = pars.length; i-- > 0;) {
                // idiom for string.startsWith
                if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                    pars.splice(i, 1);
                }
            }
            url = urlparts[0] + '?' + pars.join('&');
            return url;
        } else {
            return url;
        }
    },
    // 'getLoginUrl': function(ctx) {
    //     var currentUrl = config.protocol + ctx.request.host;
    //     var path = '';
    //     if (ctx.request.header.referer) path = url.parse(ctx.request.header.referer).path;
    //     ctx.url === '/logout' ? currentUrl += path : currentUrl += ctx.request.path;
    //     currentUrl = this.removeURLParameter(currentUrl, 'ticket');
    //     var loginUrl = config.protocol + config.api.sso + '/login.html?service=productCenter&target=' + encodeURIComponent(currentUrl);
    //     return loginUrl;
    // },
    'getLoginUrl': function (ctx) {
        var currentUrl = config.protocol + (ctx.request.headers['walmart-taget'] || ctx.request.host);
        // if (config.currentUrl[localConfig.name]) {
        //     currentUrl = config.protocol + config.currentUrl[localConfig.name];
        // }
        console.log('currentUrl', currentUrl);
        var path = '';
        if (ctx.request.header.referer) path = url.parse(ctx.request.header.referer).path;
        // ctx.url === '/logout' ? currentUrl += path : currentUrl += ctx.request.path;
        ctx.url === '/logout' || ctx.url === '/userTimeOut' ? currentUrl : currentUrl += ctx.request.path;
        currentUrl = this.removeURLParameter(currentUrl, 'ticket');
        console.log('currentUrl2', currentUrl);

        var reg = /pre\.zhongan\.io/
        var URL = reg.test(currentUrl) ? config.api.publicSsoHost : config.api.ssoProd
        var loginUrl = config.protocol + URL + '/login.html?service=productCenter&target=' + encodeURIComponent(currentUrl);
        return loginUrl;
    },
    'decrypt': function (str) {
        var key = 'dEfAu1tS3cretKeY';
        var iv = '';
        var clearEncoding = 'utf8';
        var cipherEncoding = 'base64';
        var cipherChunks = [];
        var decipher = crypto.createDecipheriv('aes-128-ecb', key, iv);
        decipher.setAutoPadding(true);

        cipherChunks.push(decipher.update(str, cipherEncoding, clearEncoding));
        cipherChunks.push(decipher.final(clearEncoding));

        return cipherChunks.join('');
    }
};

module.exports = T;
