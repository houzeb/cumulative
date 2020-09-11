var config = require("../env-config");
var http = require("http");
var localConfig = require('../config');
var https = require("https");
var crypto = require('crypto');
var moment = require('moment');

var T = {
    ajax: function (options, res) {
        var tempData = options.data;

        if (!options.binary) {
            if (options.json) {
                options.data = JSON.stringify(options.data);
                options.data = options.data;
                options.contentType = options.contentType || "application/json"
            } else {
                options.data = options.data && T.getObjStr(options.data) || null;
                options.contentType = options.contentType || "application/x-www-form-urlencoded"
            }
        }


        /**
            var port = options.port || config.ajaxPort || 80;
            var headers = options.headers || {};
            var host = options.host || config.ajaxHost;
         */
        var headers = options.headers || {};
        var hostAndPort = (options.host || config.ajaxHost).split(':');
        var host = hostAndPort[0];
        var port = hostAndPort[1] || 80;
        headers["Content-Type"] = headers["Content-Type"] || options.contentType;
        headers["Host"] = host;

        if (options.url.indexOf("/productFile/save") > -1) {
            //delete headers["Content-Type"];
        }

        console.log("--------------------------------------------");
        console.log("【Ajax Send Time:】" + moment().format('YYYY-MM-DD HH:mm:ss'))
        console.log("【Ajax Send Method】:" + hostAndPort + options.url)
        console.log("【Ajax Send Params】:" + JSON.stringify(options.data))
        console.log("--------------------------------------------");

        var protocal = options.port == 443 ? https : http;
        var ajaxParam = {
            path: options.url || "",
            method: options.method || "post",
            hostname: host,
            port: port,
            headers: headers
        }

        // console.log(ajaxParam)

        var request = protocal.request(ajaxParam, function (result) {
            try {
                var buffers = [];
                var allLength = 0;
                hasResponse = true;
                result.on("data", function (chunk) {
                    buffers.push(chunk);
                    allLength += chunk.length;
                });
                result.on("end", function () {
                    // console.log("Ajax send OK!" + options.url);

                    var bf;
                    bf = Buffer.concat(buffers, allLength);

                    var data = bf.toString();
                    var json = {};
                    if (data.indexOf("{") === 0 || data.indexOf("[") == 0) {
                        json = T.tryEval(data);
                        var jsonData;
                        if (json && typeof json.Data === "string" && (json.Data.indexOf("{") == 0 || json.Data.indexOf("[") == 0)) {
                            jsonData = T.tryEval(json.Data);
                            json.Data = jsonData || json.Data;
                        }
                    }
                    options.success && options.success(data, json);
                });


                result.on("error", function (err) {
                    console.log("error", err)
                    options.success && options.success(JSON.stringify({ code: -1, msg: err }));
                })
            } catch (e) {
                console.log("catch：ajax请求失败")
                options.success && options.success(JSON.stringify({ code: -1, msg: e }));
            }
        });

        request.on('error', function (err) {
            console.log("error：ajax请求失败", err)
            options.success && options.success(JSON.stringify({ code: -1, msg: err }));
            if (res) {
                res.end('error');
            }
        });

        if (options.data) {
            request.write(options.data || "");
        }
        request.end();

    },
    getObjStr: function (data) {
        if (typeof data === "string") {
            return data;
        }
        var arr = [];
        for (var p in data) {
            if (typeof data[p] == "object") {
                data[p] = JSON.stringify(data[p]);
            }
            arr.push(p + "=" + encodeURIComponent(data[p]));
        }
        return arr.join("&");
    },
    tryEval: function (js) {
        var result = null;
        if (!js) {
            return result;
        }
        if (typeof js !== "string") {
            return js;
        }
        try {
            result = JSON.parse(js)
        } catch (e) {
            console.log("[eval error json解析错误]" + e.message);
        }
        return result;
    },
    getCurrentUrl: function (req) {
        var host = req.hostname;
        host = host + ":" + config.port;
        return req.protocol + "://" + host + req.originalUrl;
    },
    // getLoginUrl:function(req,isIndex){
    //     var host = req.hostname;
    //     console.log('host:' + host);
    //     if(!process.env.DEPLOY_ENV) {
    //         host = req.hostname +":"+config.port;
    //     }
    //     var currentUrl = req.protocol +"://" + host;
    //     if(!isIndex){
    //         currentUrl = currentUrl + req.path;
    //     }
    //     var loginUrl = "http://" + config.ssoHostProd + "/login.html?service=productCenter&target=" + encodeURIComponent(currentUrl);
    //     return loginUrl;
    // },
    getLoginUrl: function (req, isIndex) {
        console.log('<<<<<<<<<<<<<<<req>>>>>>>>>>>>>>>>>>>>>', req.headers)
        var host = req.headers['walmart-taget'] || req.hostname;
        if (!process.env.DEPLOY_ENV) {
            host = req.hostname + ":" + config.port;
        }
        var currentUrl = req.protocol + "://" + host;
        // if (config.currentUrl[localConfig.name]) {
        //     currentUrl = req.protocol + "://" + config.currentUrl[localConfig.name];
        // }
        if (!isIndex) {
            currentUrl = currentUrl + req.path;
        }
        console.log('currentUrl', currentUrl);
        var reg = /pre\.zhongan\.io/
        var URL = reg.test(currentUrl) ? config.publicSsoHost : config.ssoHost
        var loginUrl = "http://" + URL + "/login.html?service=productCenter&target=" + encodeURIComponent(currentUrl);
        return loginUrl;
    },
    encrypt: function (str) {
        str = str + "";
        var key = "dEfAu1tS3cretKeY";
        var iv = "";
        var clearEncoding = 'utf8';
        var cipherEncoding = 'base64';
        var cipherChunks = [];
        var cipher = crypto.createCipheriv('aes-128-ecb', key, iv);
        cipher.setAutoPadding(true);

        cipherChunks.push(cipher.update(str, clearEncoding, cipherEncoding));
        cipherChunks.push(cipher.final(cipherEncoding));

        return cipherChunks.join('');
    },
    decrypt: function (str) {
        var key = "dEfAu1tS3cretKeY";
        var iv = "";
        var clearEncoding = 'utf8';
        var cipherEncoding = 'base64';
        var cipherChunks = [];
        var decipher = crypto.createDecipheriv('aes-128-ecb', key, iv);
        decipher.setAutoPadding(true);

        cipherChunks.push(decipher.update(str, cipherEncoding, clearEncoding));
        cipherChunks.push(decipher.final(clearEncoding));

        return cipherChunks.join('');
    }
}


module.exports = T;