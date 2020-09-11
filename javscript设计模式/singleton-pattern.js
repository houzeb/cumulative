/*
  单例模式
  又被称为单体模式，是只允许实例化一次的对象类。
  这种模式常为我们提供一个命名空间。
*/


// 创建一个小型代码库

var A = {
  Util: {
    util_method1: function() {},
    util_method2: function() {}
  },
  Tool: {
    tool_method1: function() {},
    tool_method2: function() {}
  },
  Ajax: {
    get: function() {},
    post: function() {}
  },
  others: {

  }
}

// 无法改变的静态变量
var Conf = (function() {
  // 私有变量
  var conf = {
    MAX_NUM: 100,
    MIN_NUM: 1,
    COUNT: 1000
  }
  // 返回取值器对象
  return {
    get: function(name) {
      return conf[name] ? conf[name] : null;
    }
  }
})();

var count = Conf.get('COUNT');
console.log(count);


/*
  惰性单例
  单例还有一种延迟创建的形式，为‘惰性创建’
*/

var LazySingle = (function() {
  // 单例实例引用
  var _instance = null;
  // 单例
  function Single() {
    return {
      publiceMethod: function() {},
      publicProperty: '1.0'
    }
  }
  // 获取单例对象接口
  return function() {
    // 如果是创建单例 将 创建单例
    if (!_instance) {
      _instance = Single();
    }
    return _instance;
  }
})();
