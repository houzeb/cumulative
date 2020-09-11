##开发
1、npm install
2、node server.js

### 开发环境打包
npm run build
### 正式环境打包
npm run product
打包完后代码都在public文件夹里面

### env-config
因为配置抽到配置中心，本地启动项目时，在根目录创建一个env-config/index.js

env-config目录已在gitignore添加，不会提交到git仓库

index.js
```
#dev
const ENV = {
    "env": "dev",
    "port": 8081,
    "sessionConfig": {
        "secret": "za-core",
        "domain": ".za-tech.net"
    },
    "mdmBackendHost": "16339-yfyb-income-income-zatech-foundation.test.za-tech.net",
    "i18nHost": "16339-yfyb-income-income-zatech-i18n.test.za-tech.net",
    "ajaxHost": "16339-yfyb-income-income-zatech-permission.test.za-tech.net",
    "ssoHost": "16339-yfyb-income-income-zatech-foundation.test.za-tech.net",
    "ssoHostProd": "16339-yfyb-income-income-zatech-foundation.test.za-tech.net",
    "mdmHost": "16339-yfyb-income-income-zatech-foundation.test.za-tech.net",
};
module.exports = ENV;

#test
const ENV = {
    "env": "test",
    "port": 8081,
    "sessionConfig": {
        "secret": "za-core",
        "domain": ".za-tech.net"
    },
    "mdmBackendHost": "yfyb-income-income-zatech-foundation.test.za-tech.net",
    "i18nHost": "yfyb-income-income-zatech-i18n.test.za-tech.net",
    "ajaxHost": "yfyb-income-income-zatech-permission.test.za-tech.net",
    "ssoHost": "yfyb-income-income-zatech-foundation.test.za-tech.net",
    "ssoHostProd": "yfyb-income-income-zatech-foundation.test.za-tech.net",
    "mdmHost": "yfyb-income-income-zatech-foundation.test.za-tech.net",
};
module.exports = ENV;

```