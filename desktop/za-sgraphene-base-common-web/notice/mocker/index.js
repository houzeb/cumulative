const mockData = require('./mockData.json');
const proxy = {
    'GET /api/oms/getSysHost': {
        "success": true,
        "value": {
            "port": 8080,
            "protocol": "http://",
            "domain": "za-tech.net",
            "api": {
                "i18n": "yfyb-sompo-sompo-za-graphene-i18n.test.za-tech.net",
            },
        }
    },
    'GET /api/i18n/i18n/resource/download.json': {
        success: true,
        value: {
        }
    },
    'POST /api/i18n/i18n/resource/download.json': {
        success: true,
        value: {
        }
    },
    'GET /getUserInfo': { "loginName": "marvin", "userId": 291002, "userRealName": "marvin" },
    'POST /api/permission/user/queryUserPriviledges': (req, res) => {
        return res.json({
            "value": [
                {
                    "resourceName": "客户问询管理",
                    "resourceCode": "SYSTEM_CUSTOMER_ENQUIRY_MANAGE"
                }
            ],
            "reality": true,
            "additionalInfo": {},
            "success": true,
            "getMsgByCode": false
        });
    },
    // Product Name 下拉框获取接口
    'POST /api/xxx/getProductName': (req, res) => {
        return res.json({
            success: true,
            value: mockData.getProductName
        });
    },
    // Claim Registered by 下拉框
    'POST /api/permission/getClaimRegisteredBy': (req, res) => {
        return res.json({
            success: true,
            value: mockData.getClaimRegisteredBy
        });
    },
    // 理赔任务池接口
    'POST /api/claim/weather/queryClaimApplicationDesk': (req, res) => {
        const body = req.body;
        let data = mockData.getClaim.filter(x => {
            let keys = Object.keys(body.condition);
            if (keys.length) {
                if (keys.some(key => body.condition[key] != x[key])) {
                    return false;
                }
            }
            return true;
        });
        return res.json({
            success: true,
            value: {
                "start": body.start,
                "limit": body.limit,
                "total": data.length,
                "results": data.slice(body.start, body.start + body.limit)
            }
        });
    },
    // Withdraw按钮接口
    'POST /api/claim/common/revocationApplication': (req, res) => {
        return res.json({
            success: true
        });
    },
    'POST /api/mdm/data/list/resData': (req, res) => {
        const body = req.body;
        const enumList = [
            {
                "categoryCode": "common.TransTypeEnum",
                "categoryName": "枚举",
                "itemCode": "1",
                "itemName": "クーリングオフ",
                "itemExtend1": "FREELOOKSURRENDER"
            },
            {
                "categoryCode": "common.TransTypeEnum",
                "categoryName": "枚举",
                "itemCode": "10",
                "itemName": "予約取消",
                "itemExtend1": "BREAK_OFF"
            }, {
                "categoryCode": "common.policyStatus",
                "categoryName": "枚举",
                "itemCode": "1",
                "itemName": "Effective",
            }, {
                "categoryCode": "common.policyStatus",
                "categoryName": "枚举",
                "itemCode": "2",
                "itemName": "terminated",
            }, {
                "categoryCode": "common.pax",
                "categoryName": "枚举",
                "itemCode": "1",
                "itemName": "Adult",
            }, {
                "categoryCode": "common.pax",
                "categoryName": "枚举",
                "itemCode": "2",
                "itemName": "Child",
            }, {
                "categoryCode": "common.pax",
                "categoryName": "枚举",
                "itemCode": "3",
                "itemName": "Senior",
            }, {
                "categoryCode": "common.claimDescsion",
                "categoryName": "枚举",
                "itemCode": "1",
                "itemName": "pass",
            }, {
                "categoryCode": "common.claimDescsion",
                "categoryName": "枚举",
                "itemCode": "2",
                "itemName": "notPass",
            }
        ];
        return res.json({
            success: true,
            value: enumList.filter(x => x.categoryCode == body.categoryCode)
        });
    },
    'POST /api/policy/getPolicyRegistrationPage': (req, res) => {
        const body = req.body;
        let data = mockData.getPolicyRegistrationPage.filter(x => {
            let keys = Object.keys(body.condition);
            if (keys.length) {
                if (keys.some(key => body.condition[key] != x[key])) {
                    return false;
                }
            }
            return true;
        });
        return res.json({
            success: true,
            value: {
                "start": body.start,
                "limit": body.limit,
                "total": data.length,
                "results": data.slice(body.start, body.start + body.limit)
            }
        });
    },
    'POST /api/claim/registerClaim': (req, res) => {
        res.json({
            success: true
        });
    },
    'POST /api/claim/weather/adjustmentDetail': (req, res) => {
        return res.json({
            success: true,
            value: {

            }
        });
    },
    'POST /api/common/getWeather': (req, res) => {
        return res.json({
            success: true,
            value: mockData.getWeather
        });
    },
    'POST /api/common/getTicketType': (req, res) => {
        return res.json({
            success: true,
            value: mockData.getTicketType
        });
    },
    'POST /api/common/extraServiceItem': (req, res) => {
        return res.json({
            success: true,
            value: mockData.extraServiceItem
        });
    },
    'POST /api/claim/save': (req, res) => {
        return res.json({
            success: true
        });
    },
    'POST /api/claim/submit': (req, res) => {
        return res.json({
            success: true
        });
    }
}

module.exports = proxy;