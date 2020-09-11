const ENV = {
    mode: 'development',
    port: 3002,
    protocol: 'http://',
    dirname: '../views',
    api: {
        i18n: "16449-yfyb-income-zatech-common-i18n.test.za-tech.net",
        sso: "16427-stech-sgraphene-za-sgraphene-foundation.test.za-tech.net", // sgraphene
        ssoProd: "16427-stech-sgraphene-za-sgraphene-foundation.test.za-tech.net", // sgraphene
        foundation: '16427-stech-sgraphene-za-sgraphene-foundation.test.za-tech.net', // sgraphene
        oms_web: "16336-yfyb-income-income-common-oms-web.test.za-tech.net",
        amethystAdmin: '16339-yfyb-income-income-zatech-amethyst-admin.test.za-tech.net',
        integration: '16339-yfyb-income-income-zatech-integration.test.za-tech.net',
        permission: '16339-yfyb-income-income-zatech-permission.test.za-tech.net',
        claim: '16338-yfyb-income-income-zatech-claim.test.za-tech.net',
        calculator: '16337-yfyb-income-income-zatech-calculator.test.za-tech.net',
        market: '16337-yfyb-income-income-zatech-market.test.za-tech.net',
        product: '16337-yfyb-income-income-zatech-product.test.za-tech.net',
        bcp: '16335-yfyb-income-income-zatech-bcp.test.za-tech.net',
        cdc: '16335-yfyb-income-income-zatech-cdc.test.za-tech.net',
        customer: '16335-yfyb-income-income-zatech-customer.test.za-tech.net',
        notice: '16430-stech-sgraphene-za-sgraphene-notice.test.za-tech.net', // sgraphene
        policy: '16335-yfyb-income-income-zatech-policy.test.za-tech.net',
        policyBatch: '16335-yfyb-income-income-zatech-policy-batch.test.za-tech.net',
        posOnline: '16335-yfyb-income-income-zatech-pos-online.test.za-tech.net',
        query: '16335-yfyb-income-income-zatech-query.test.za-tech.net',
    },
    currentUrl: {
        claim: '',
        posOnline: '',
        permission: '',
        notice: '',
        market: '',
        product: '',
        oms: '',
        policy: '',
        amethyst: '',
        query: '',
    },
    'namespace': 'common,product_front,product',
};
module.exports = ENV;