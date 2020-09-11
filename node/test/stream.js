//**************从流中读取数据******************
// var fs = require("fs");
// var data = "";
//
// // 创建可读流
// var readerStream = fs.createReadStream('input.txt');
//
// // 设置编码为 utf8
// readerStream.setEncoding('UTF8');
//
// // 处理流事件 --> data, end, and error
// readerStream.on('data', function(chunk) {
//   data += chunk;
// });
//
// readerStream.on('end', function() {
//   console.log(data);
// });
//
// readerStream.on('error', function() {
//   console.log(err.stack);
// });
//
// console.log("程序执行完毕");

//***************写入流************************
// var fs = require('fs');
// var data = '菜鸟教程官网地址：www.ruboob.com';
//
// // 创建一个可以写入的流，写入到文件 output.txt中
// var writeStream = fs.createWriteStream('output.txt');
//
// // 使用 utf8 编码写入数据
// writeStream.write(data, 'UTF8');
//
// // 标记文件末尾
//
// writeStream.end();
//
// // 处理流事件 --> data, end, and error
// writeStream.on('finish', function() {
//   console.log('写入完成');
// })
//
// writeStream.on('error', function() {
//   console.log(err.stack);
// })
//
// console.log('程序执行完毕');

//**************管道流***********************
var fs = require('fs');

// 创建一个可读流
var readerStream = fs.createReadStream('input.txt');

// 创建一个可写流
var writeStream = fs.createWriteStream('output.txt');

// 管道读写操作
// 读取 input.txt 文件内容， 并将内容写入到 output.txt 文件中
readerStream.pipe(writeStream);

console.log('程序执行完毕');
