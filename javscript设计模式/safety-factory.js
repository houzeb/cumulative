/*
  安全模式创建的工厂类
*/
var Factory = function(type, content) {
  if(this instanceof Factory) {
    var s = new this[type](content);
    return s;
  } else {
    return new Factory(type, content);
  }
}

// 工厂原型中设置创建所有类型数据对象的基类
Factory.prototype = {
  Java : function(content) {
    // ....
  },
  JavaScript : function(content) {
    // ....
  },
  UI : function(content) {
    this.content = content;
    (function(content) {
      console.log(content);
    })(content);
  },
  php : function(content) {
    // ......
  }
};

var data = [
  {type: 'JavaScript', content: 'JavaScript哪家强'},
  {type: 'Java', content: 'Java哪家强'},
  {type: 'php', content: 'php哪家强'},
  {type: 'UI', content: 'UI哪家强'}
];


for (var i = data.length - 1; i >= 0; i--) {
  Factory(data[i].type, data[i].content);
}
