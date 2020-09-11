var express = require('express');
var router = express.Router();
var T = require("./utils.js");
var config = require("../config");

var P = {
    logoutRequest: function (req, res) {
        T.ajax({
            url: "/logout.json",
            method: "post",
            headers: {
                "xticket": req.session.ticket || "",
                "X-Requested-With": "XMLHttpRequest"
            },
            host: config.ssoHost,
            json: true,
            success: function (result) {
                result = T.tryEval(result) || {};

                console.log("logout", result)

                var data = result.value;
                if (result.success) {
                    req.session.userInfo = null;
                    req.session.ticket = null;

                    var loginUrl = T.getLoginUrl(req, true);
                    res.json({ success: true, value: loginUrl });
                } else {
                    res.json({ success: false, errorMsg: "退出超时，请稍候" });
                }
            }
        }, res)
    },
    requestUserInfo: function (req, res) {
        var userInfo = req.session.userInfo || {};
        res.json({ success: true, value: userInfo });
        return;
    },

    // 获取oms配置，取domain解决跨域问题
    getSysHost: function (req, res) {
        T.ajax({
            url: "/getSysHost",
            method: "get",
            host: config.omsHost,
            success: function (result) {
                res.json(JSON.parse(result));
            }
        }, res)
    }
}


router.all("*", function (req, res, next) {
    var method = req.params[0];
    var reqData = req.body || {};
    var url = req.originalUrl.replace(/^\/ajax/i, "");

    const ajaxParam = {
        url: url,
        method: "post",
        data: reqData,
        json: true,
        headers: {
            "xticket": req.session.ticket || "",
            "X-Requested-With": "XMLHttpRequest",
            "lang":req.cookies["lang"]
            //"lang":"zh-CN"
        },
        success: function (result) {
            res.send(result);
        }
    }

    const formulaUrl = ['/functionTable/list', '/rateTable/list', '/formula/list', '/formula/createFormula', '/formula/query', '/formula/updateFormula', '/rateTableType/create','/rateTableType/query', '/rateTableType/delete', '/rateTableType/allRateType', '/rateTable/create', '/rateTable/query','/rateTable/delete']

    if (formulaUrl.indexOf(url) >= 0) {
        ajaxParam.host = config.formulaHost
    }

    if (url === '/user/getUser') {
        ajaxParam.host = config.getUserHost;
        console.log('xlj~~~~~~~~~~', ajaxParam.host);
    }

    if (url === '/component/emum/list') {
        ajaxParam.host = config.priviledgesHost;
        console.log('wl~~~~~~~~~~', ajaxParam.host);
    }
    if (url === '/component/query/enum') {
        ajaxParam.host = config.priviledgesHost;
        console.log('wl~~~~~~~~~~', ajaxParam.host);
    }
    // const contentTypeUrl = ['/rateTable/create']
    // if (contentTypeUrl.indexOf(url) >= 0) {
    //     ajaxParam.contentType = 'multipart/form-data'
    // }

    //数据模拟
    if (process.env.DEPLOY_ENV === 'dev' && reqData.mock === true) {
        var mock = require("./mock");
        mock(ajaxParam);
        return;
    }

    if (url.indexOf("/getUserInfo") > -1) {
        P.requestUserInfo(req, res);
        return;
    }

    if (url.indexOf("/logoutRequest") > -1) {
        P.logoutRequest(req, res);
        return;
    }

    if (url.indexOf("/getSysHost") > -1) {
        P.getSysHost(req, res);
        return;
    }

    if (ajaxParam.data.mock !== undefined) {
        delete ajaxParam.data.mock;
    }

    T.ajax(ajaxParam, res);
});


module.exports = router;
