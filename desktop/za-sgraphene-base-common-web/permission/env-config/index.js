const ENV = {
  dev: require('./dev'),
  test: require('./test'),
  pre: require('./pre'),
  prd: require('./prd'),
}[process.env.DEPLOY_ENV || 'dev'];

module.exports = ENV;
