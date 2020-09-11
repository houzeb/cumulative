/*
 * @Description:
 * @version: 1.0
 * @Author: 段雄飞
 * @Date: 2019-03-26 11:35:10
 * @LastEditors: 段雄飞
 * @LastEditTime: 2020-04-23 09:47:50
 */
const ENV = {
    env: 'dev',
    port: 8083,
    protocol: 'http://',
    domain: 'za-tech.net',
    sessionConfig: {
        secret: 'za-core',
        domain: '.za-tech.net'
    },
    api: {
        i18n: '16427-stech-sgraphene-za-sgraphene-i18n.test.za-tech.net', // sgraphene
        sso: '16427-stech-sgraphene-za-sgraphene-foundation.test.za-tech.net', // sgraphene
        ssoProd: '16427-stech-sgraphene-za-sgraphene-foundation.test.za-tech.net', // sgraphene
        oms_web: '16628-stech-sgraphene-common-web-oms.test.za-tech.net', // sgraphene
        amethystAdmin: '16339-yfyb-income-income-zatech-amethyst-admin.test.za-tech.net',
        foundation: '16427-stech-sgraphene-za-sgraphene-foundation.test.za-tech.net', // sgraphene
        integration: '16339-yfyb-income-income-zatech-integration.test.za-tech.net',
        permission: '16427-stech-sgraphene-za-sgraphene-permission.test.za-tech.net', // sgraphene
        claim: '16338-yfyb-income-income-zatech-claim.test.za-tech.net',
        calculator: '16337-yfyb-income-income-zatech-calculator.test.za-tech.net',
        market: '16629-stech-sgraphene-product-web-market.test.za-tech.net', // sgraphene
        product: '16629-stech-sgraphene-product-web-product.test.za-tech.net', // sgraphene
        bcp: '16335-yfyb-income-income-zatech-bcp.test.za-tech.net',
        cdc: '16335-yfyb-income-income-zatech-cdc.test.za-tech.net',
        customer: '16335-yfyb-income-income-zatech-customer.test.za-tech.net',
        notice: '16335-yfyb-income-income-zatech-notice.test.za-tech.net',
        policy: '16335-yfyb-income-income-zatech-policy.test.za-tech.net',
        policyBatch: '16335-yfyb-income-income-zatech-policy-batch.test.za-tech.net',
        posOnline: '16335-yfyb-income-income-zatech-pos-online.test.za-tech.net',
        query: '16783-stech-sgraphene-common-web-query.test.za-tech.net' // sgraphene
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
    }
};

module.exports = ENV;
