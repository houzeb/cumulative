import dev from '../../../config/dev.json'
import test from '../../../config/test.json'
import pre from '../../../config/pre.json'
import publicPre from '../../../config/publicPre.json'
const ENV = {
    dev,
    test,
    pre,
    publicPre
}
const HOST = location.host

const env = [
    { host: /\.test\.za-tech\.net$/, env: 'test' },
    { host: /\.pre\.za-tech\.net$/, env: 'pre' },
    { host: /pre\.zhongan\.io$/, env: 'publicPre' }, // 公网访问预发域名
    { host: /\.prd\.za-tech\.net$/, env: 'prd' },
    { host: /\.*|:*/, env: 'dev' }
].find(item => item.host.test(HOST)).env

console.log('env', env)
export default ENV[env].excelHost
