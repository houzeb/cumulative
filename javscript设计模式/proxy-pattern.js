/*
  代理模式
  由于一个对象不能直接引用另一个对象
  常通过代理对象在两个对象之间起到中介的作用
*/

/*
  站长平台对页面统计
  原理: 在页面出发一些动作时向站长平台发送这类img的get请求，然后对请求做统计
*/
// 统计代理
var Count = (function() {
  // 缓存图片
  var img = new Image();
  // 返回统计函数
  return function(param) {
    // 统计请求字符串
    var str = 'http://www.count.com/a.gif?';
    // 拼接请求字符串
    for(var i in param) {
      str += i + '=' + param[i];
    }
    // 发送统计请求
    _img.src = str;
  }
})();
// 测试用例，统计num
Count({num: 10});

/*

*/
