// 原型式继承
function inheritObject(o) {
  // 声明一个过渡函数对象
  function F() {}
  // 过渡对象的原型继承父对象
  F.prototype = o;
  // 返回过渡对象的一个实例
  return new F();
}

// 寄生式继承
function createBook(obj) {
  // 通过原型继承方式创建新对象
  var o = new inheritObject(obj);
  // 拓展新对象
  o.getName = function() {
    console.log("寄生式继承", name)
  }
  // 返回拓展后的新对象
  return o;
}
/*
  寄生式继承 继承原型(寄生组合式继承)
  传递参数 subClass 子类
  传递参数 superClass 父类
*/
function inheritPrototype(subClass, superClass) {
  // 复制一份父类的原型副本保存在变量中
  var p = inheritObject(superClass.prototype);
  // 修正因为重写子类原型导致子类的constructor属性被修改
  p.constructor = subClass;
  // 设置子类的原型
  subClass.prototype = p;
}
// +++++++++++++++++++++++测试方法

function SuperClass(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
SuperClass.prototype.getName = function() {
  console.log(this.name);
}
function SubClass(name, time) {
  SuperClass.call(this, name);
  this.time = time;
}
inheritPrototype(SubClass, SuperClass);
SubClass.prototype.getTime = function() {
  console.log(this.time);
}
var instance1 = new SubClass("js book", 2014);
var instance2 = new SubClass("css book", 2013);

instance1.colors.push("black");
console.log(instance1.colors);
console.log(instance2.colors);
instance2.getName();
instance2.getTime();
