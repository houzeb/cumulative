var express = require('express');
var router = express.Router();
var T = require("./utils.js");
var config = require("../env-config");

var P = {
    logoutRequest: function (req, res) {
        T.ajax({
            url: "/logout.json",
            method: "post",
            headers: {
                "xticket": req.session.ticket || req.session.ticket || "",
                "X-Requested-With": "XMLHttpRequest"
            },
            host: config.ssoHost,
            json: true,
            success: function (result) {
                result = T.tryEval(result) || {};
                var data = result.value;
                if (result.success) {
                    req.session.userInfo = null;
                    req.session.lang = null;
                    req.session.ticket = null;
                    req.session.islogin = false;
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
    console.log(`--------------------------\n${req.session.ticket}\n--------------------------`);
    var method = req.params[0];
    var reqData = req.body || {};
    var url = req.originalUrl.replace(/^\/ajax/i, "");
    const ajaxParam = {
        url: url,
        method: "post",
        data: reqData,
        json: true,
        headers: {
            "xticket": req.query.ticket || req.session.ticket || "",
            "X-Requested-With": "XMLHttpRequest",
            "lang": req.cookies["lang"] || 'zh_CN'
            //"lang":"zh-CN"
        },
        success: function (result) {
            // console.log('--------------------\n', result, '\n------------------------\n')
            res.send(result);
        }
    }

    // const roleUrl = ['/user/queryRoles']
    // if (roleUrl.indexOf(url) >= 0) {
    //     ajaxParam.host = config.roleHost
    // }

    // const testUrl = ['/resource/saveBussDataResource'];
    // if (testUrl.indexOf(url) >= 0) {
    //     ajaxParam.host = config.testHost;
    // }
    const backendUrlSet = new Set([
        '/resource/savePriviledge',
        '/resource/deletePriviledge',
        '/resource/queryPriviledge',
        '/resource/saveResource',
        '/resource/deleteResource',
        '/resource/queryResources',
        '/resource/queryMenuPriviledges',
        '/resource/querySubResources',
        '/resource/queryExtendValuesResources',
        '/resource/saveBussDataResource',
        '/resource/queryBussDataResource',
        '/resource/querySubPriviledge',
        '/user/saveUser',
        '/user/listUser',
        '/user/getUser',
        '/user/changePassword',
        '/user/resetPassword',
        '/user/changeAvatar',
        '/user/saveRole',
        '/user/queryRoles',
    ]);
    if (backendUrlSet.has(url)) {
        url = `/backend${url}`;
        ajaxParam.url = url;
    }
    const mdmBackendSet = new Set([
        // '/org/queryOrganizationTree',
        // '/org/queryDepartments',
        '/bank/listBank',
        '/bank/listBankLocations',
        '/bank/listCorporationBankAccount',
        '/bank/queryBankStandardareas',
        '/bank/saveCorporationBankAccount',
        '/bank/listCashAccount',
        '/bank/saveCashAccount'
    ]);
    if (mdmBackendSet.has(url)) {
        ajaxParam.host = config.mdmBackendHost
    }

    const mdmSet = new Set([
        '/org/queryDepartments',
        '/org/queryOrganizationTree',
        '/component/emum/list'
    ]);
    if (mdmSet.has(url)) {
        ajaxParam.host = config.mdmHost
    }

    //数据模拟
    if (process.env.DEPLOY_ENV !== 'prd' && process.env.DEPLOY_ENV !== 'test' && reqData.mock === true) {
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
