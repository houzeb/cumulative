const ENV = {
    env: 'pre',
    port: 8083,
    protocol: 'http://',
    domain: 'za-tech.net',
    sessionConfig: {
        secret: 'za-core',
        domain: '.za-tech.net'
    },
    api: {
        i18n: 'stech-sgraphene-za-sgraphene-i18n.pre.za-tech.net', // sgraphene
        sso: 'stech-sgraphene-za-sgraphene-foundation.pre.za-tech.net', // sgraphene
        ssoProd: 'stech-sgraphene-za-sgraphene-foundation.pre.za-tech.net', // sgraphene
        oms_web: 'stech-sgraphene-common-web-oms.pre.za-tech.net', // sgraphene
        amethystAdmin: 'yfyb-income-income-zatech-amethyst-admin.pre.za-tech.net',
        foundation: 'stech-sgraphene-za-sgraphene-foundation.pre.za-tech.net', // sgraphene
        integration: 'yfyb-income-income-zatech-integration.pre.za-tech.net',
        permission: 'stech-sgraphene-za-sgraphene-permission.pre.za-tech.net', // sgraphene
        claim: 'yfyb-income-income-zatech-claim.pre.za-tech.net',
        calculator: 'yfyb-income-income-zatech-calculator.pre.za-tech.net',
        market: 'stech-sgraphene-product-web-market.pre.za-tech.net', // sgraphene
        product: 'stech-sgraphene-product-web-product.pre.za-tech.net', // sgraphene
        publicSsoHost: 'sgraphene-foundation-pre.zhongan.io', // sgraphene 公网访问 sgraphene-foundation-pre.zhongan.io
        bcp: 'yfyb-income-income-zatech-bcp.pre.za-tech.net',
        cdc: 'yfyb-income-income-zatech-cdc.pre.za-tech.net',
        customer: 'yfyb-income-income-zatech-customer.pre.za-tech.net',
        notice: 'yfyb-income-income-zatech-notice.pre.za-tech.net',
        policy: 'yfyb-income-income-zatech-policy.pre.za-tech.net',
        policyBatch: 'yfyb-income-income-zatech-policy-batch.pre.za-tech.net',
        posOnline: 'yfyb-income-income-zatech-pos-online.pre.za-tech.net',
        query: 'stech-sgraphene-common-web-query.pre.za-tech.net' // sgraphene
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
