const ENV = {
    default: require('./default.json'),
    dev: require('./dev.json'),
    test: require('./test.json'),
    pre: require('./pre.json'),
    prd: require('./prd.json')
}[process.env.DEPLOY_ENV || 'default'];

module.exports = ENV;
