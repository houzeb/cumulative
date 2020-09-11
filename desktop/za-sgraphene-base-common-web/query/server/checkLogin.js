var T = require("./utils.js");
var config = require("../config");
module.exports = function (req, res, next) {
    //测试数据   加了登录限制后把测试数据删掉就行了。
    // req.session.userInfo = {
    //     loginName:"test",
    //     userId:"2",
    //     userRealName:"傅慧云"
    // }
    // console.log('req.......',req);
    if (req.session.userInfo) { //已登录
        next();
        return;
    } else {
        console.log('req~~~~~~~~~~~~', req.query)
        if (req.query.ticket) {  //TGT-22-KVZshns06dDQGfzg11VswvyXdjw4RHYgphy
            req.session.ticket = req.query.ticket;
        }
        var ticket = req.session.ticket;
        if (!ticket) {
            toLogin(req, res);
            return;
        }

        var requestJson = {};

        requestJson = {
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
                result = T.tryEval(result);
                var data = result.value;
                if (data && result.success) {
                    data = T.tryEval(T.decrypt(data));
                    req.session.userInfo = data;
                    next();   
                }
                else {
                    toLogin(req, res);
                }
            }
        }

        T.ajax(requestJson)
    }
}

function toLogin(req, res) {
    var url = T.getLoginUrl(req);
    console.log("未登录", url);
    res.redirect(url);
}