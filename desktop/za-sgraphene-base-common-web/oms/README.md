### 构建命令
```
# 安装依赖
npm install

# 开发环境启动
npm run start

# 打生产包
npm run build

# 服务器端部署
npm run prd
```

### 项目结构
```
project
│   README.md 说明
│   Dockerfile boom3发布配置
│
└─── client
│   │  main.js 入口文件
│   │
│   └─── action
│       │   action.js redux action 类型、创建函数
│   │
│   └─── asset 资源
│       │   font 字体
│       │   image 图片
│   │   
│   └─── components 组件目录
│       │   App.js 整体布局，redux connect入口，redux props 通过 route render 传入其他组件
│       │   Bundle.js Bundle loader
│       │   mapProps.js redux mapStateToProps、 mapDispatchToProps、 mapPropTypes 统一配置文件
│       │   
│   │
│   └─── lib 工具库
│       │      
│   │
│   └─── reducer 
│       │   reducer.js combineReducers 配置文件
│   │
│   └─── request 
│       │   index.js 所有接口请求 通过axios统一配置在这里，返回数据
│       │            拦截器 未登录时跳转、统一弹出错误消息
│   │
│   └─── router 路由
│       │   
│   │   
│   │
│   └─── style 
│       │   ant.less ant.design 主题色修改
│       │   app.scss 布局样式
│       │   index.scss 引用入口
│       │   reset.scss 重置样式
│       │   var.scss 变量
│       │   
│   
└─── config 项目接口地址，端口号在此修改
│   │   default.json 默认配置
│   │   prd.json 生产配置
│   │   test.json 测试配置
│   │
└─── public 静态资源目录
│   │
└─── server koa服务端
│   │
│   └───controller
│       │   api.js 接口转发
│ 
│   │   base.js 入口
│   │   login.js 登录、退出等
│   │   server.js 服务
│   │   utils.js 工具
│   │
└─── views 首页模板
│   │
│   │
└─── webpack 配置
│   │   webpack.dev.js 开发
│   │   webpack.prd.js 生产
│   │
└─── .babelrc babel配置
│   │
│   │
└─── .eslintrc eslint配置
```

### 接口地址


### env-config
因为配置抽到配置中心，本地启动项目时，在根目录创建一个env-config/index.js

env-config目录已在gitignore添加，不会提交到git仓库

index.js
```
#dev
const ENV = {
    'port': 8080,
    'protocol': 'http://',
    'domain': 'za-tech.net',
    'api': {
        'i18n': '16339-yfyb-income-income-zatech-i18n.test.za-tech.net',
        'perm': '16339-yfyb-income-income-zatech-permission.test.za-tech.net',
        'sso': '16339-yfyb-income-income-zatech-foundation.test.za-tech.net',
        'ssoProd': '16339-yfyb-income-income-zatech-foundation.test.za-tech.net',
        "oms": "16336-yfyb-income-income-common-oms-web.test.za-tech.net",
        "sysEnquiry": "15897-yfyb-sompo-za-graphene-sompo-policy-web-customer-enquiry.test.za-tech.net",
        "sysQuery": "15661-yfyb-sompo-za-graphene-sompo-common-web-query-02.test.za-tech.net",
    }
};

module.exports = ENV;


#test
const ENV = {
    'port': 8080,
    'protocol': 'http://',
    'domain': 'za-tech.net',
    'api': {
        'i18n': 'yfyb-income-income-zatech-i18n.test.za-tech.net',
        'perm': 'yfyb-income-income-zatech-permission.test.za-tech.net',
        'sso': 'yfyb-income-income-zatech-foundation.test.za-tech.net',
        'ssoProd': 'yfyb-income-income-zatech-foundation.test.za-tech.net',
        "oms": "yfyb-income-income-common-oms-web.test.za-tech.net",
        "sysEnquiry": "15897-yfyb-sompo-za-graphene-sompo-policy-web-customer-enquiry.test.za-tech.net",
        "sysQuery": "15661-yfyb-sompo-za-graphene-sompo-common-web-query-02.test.za-tech.net",
    }
};

module.exports = ENV;

```
