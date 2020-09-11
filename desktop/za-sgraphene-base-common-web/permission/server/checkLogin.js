var T = require("./utils.js");
var config = require("../env-config");
module.exports = function (req, res, next) {
    if (req.session.ticket && !req.query.ticket) {
        next();
        return;
    } else {
        var ticket = req.query.ticket;

        if(!ticket && !req.session.ticket && !RegExp('ajax|^\/$').test(req.baseUrl)) {
            toLogin(req, res);
            return;
        }

        T.ajax({
            url: "/validate4cors.json",
            method: "post",
            data: {
                service: 'productCenter',
                ticket: ticket
            },
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },
            host: config.ssoHost,
            json: true,
            success: function (result) {
                // console.log("获取用户信息：",result)
                result = T.tryEval(result);
                var data = result.value;
                if(!result.success) {
                    toLogin(req, res);
                    return;
                }
                if (data && result.success) {
                    data = T.tryEval(T.decrypt(data));
                    console.log("解密后", data)
                    if (data.userId) {
                        req.session.islogin = true;
                        req.session.userInfo = data;
                        req.session.ticket = ticket;
                        next();
                    } else {
                        req.session.islogin = false;
                        req.session.ticket = undefined;
                    }
                } else {
                    toLogin(req, res);
                }
            }
        }, res)
    }
}

function toLogin(req, res) {
    var url = T.getLoginUrl(req);
    if (RegExp('ajax').test(req.baseUrl || req.path)) {
        console.log('超时', req.url);
        res.json({
            success: true,
            code: '101'
        });
    } else {
        console.log("未登录", url);
        res.redirect(302, url);
    }
}