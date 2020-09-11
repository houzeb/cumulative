### node常用命令
**npm 安装 Node.js 模块语法格式:**

    npm install <Module Name>
**查看安装信息**

    npm list -g  # 查看所有

    npm list grunt  # 查看某个
**卸载模块**

    npm uninstall <Module Name>
**更新模块**

    npm update <Module Name>
### node常用模块依赖安装
#### web框架模块 express
    npm install express     # 本地安装
    npm isntall express -g  # 全局安装
**需要与express框架一起安装的**

    npm install body-parser --save  # 用于处理 JSON,Raw,Text 和 URL编码的数据
    npm install cookie-parser --sace  # 用来解析cookie,通过req.cookies可以取到传过来的cookie,并转成对象
    npm install multer --save  # 处理 enctype="multipart/form-data"(设置表单的MIME编码)的表单数据
#### node中使用加密
把密码存到数据库的时候一般要加密，加密的方式主要有md5和sha1

**utility库**

    npm install utility --save-dev
**使用方式**
```javascript
var express=require("express");
var utility=require("utility");
var app=express();

app.get("/",function(req,res){
  var name=req.query.name;
  console.log("receive name info:"+name);
  var sha1Value=utility.sha1(name);
  res.send("your name is :"+sha1Value);
  var md5Value=utility.md5(name);
  res.send("your name is :"+md5Value);
});

app.listen(3000,function(){
  console.log("server is running ......");    
});
```
#### mysql
    npm install mysql
**连接数据库**

根据实际配置修改数据库用户名、密码及数据库名

<font color=#ff00f0>test.js 文件代码:</font>
```javascript
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  port     : '8080',
  user     : 'root',
  password : '123456',
  database : 'test'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
```
<center>参数  | <center>描述</center>
--------  | ----
<center>host  | <center>主机地址(默认：localhost)
<center>user  | <center>用户名
<center>password  | <center>密码
<center>port  | <center>端口号(默认：3306)
<center>database  | <center>数据库名
<center>charset   | <center>连接字符集(默认：'UTF8_GENERAL_CI',注意字符集的字母都要大写)
<center>localAddress  | <center>此IP用于TCP连接(可选)
<center>socketPath    | <center>连接到unix域路径,当使用 host 和 port 时会被忽略
<center>timezone  |<center>时区(默认：'local')
<center>connectTimeout  |<center>连接超时（默认：不限制；单位：毫秒）
<center>stringifyObjects  |<center>是否序列化对象
<center>typeCast  |<center>是否将列值转化为本地JavaScript类型值 （默认：true）
<center><center>queryFormat   |<center>自定义query语句格式化方法
<center>supportBigNumbers   |<center>数据库支持bigint或decimal类型列时，需要设此option为true （默认：false）
<center>bigNumberStrings  |<center>supportBigNumbers和bigNumberStrings启用 强制bigint或decimal列以JavaScript字符串类型返回（默认：false）
<center>dateStrings   |<center>强制timestamp,datetime,data类型以字符串类型返回，而不是JavaScript Date类型（默认：false）
<center>debug   |<center>开启调试（默认：false）
<center>multipleStatements  |<center>是否许一个query中有多个MySQL语句 （默认：false）
<center>flags   |<center>用于修改连接标志
<center>ssl   |<center>使用ssl参数（与crypto.createCredenitals参数格式一至）或一个包含ssl配置文件名称的字符串，目前只捆绑Amazon RDS的配置文件
