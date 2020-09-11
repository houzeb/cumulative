var http = require('http');
var fs = require('fs');
var url = require('url');


//  创建服务器
http.createServer(function(req, res) {
  // 解析请求，包括文件名
  console.log(req);
  var pathname = url.parse(req.url).pathname;

  // 从文件系统中读取请求的文件内容
  fs.readFile(pathname.substr(1), function(err, data) {
    if(err) {
      console.log(err);
      // HTTP 状态码  404  NOT FOUND
      res.writeHead(404, {'Content-Type': 'text/html'});
    } else {
      // HTTP  状态码 200 OK
      res.writeHead(200, {'Content-Type': 'text/html'});

      // 响应文件内容
      res.write(data.toString());
    }

    // 发送响应数据
    res.end();
  });
}).listen(8081);

// 控制台输出一下信息
console.log('Server running at http://localhost:8081/');
