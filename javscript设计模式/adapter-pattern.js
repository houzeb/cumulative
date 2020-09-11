/*
  适配器模式
  将一个类（对象）的接口（方法或者属性）转化成另外一个接口，以满足用户需求，使类（对象）之间接口的不兼容问题通过适配器得以解决
*/
// 自己封装的框架 A 与第三方框架如jQuery做适配，只需在jQuery加载完之后
// window.A = A = jQuery;

/*
  参数适配器
  方法可能需要传递多个参数，但记住参数顺序是很困难的
  所以经常以一个参数对象方式传入
*/

/*
  obj.name: name
  obj.title: title
  obj.age: age
  obj.color: color
  obj.size: size
  obj.prize: prize
*/
function doSomeThing(obj) {
  var _adapter = {
    name: '雨夜清荷',
    title: '设计模式',
    age: 24,
    color: 'pink',
    size: 100,
    prize: 50
  };
  for (var i in _adapter) {
    _adapter[i] = obj[i] || _adapter[i];
  }
}

/*
  数据适配
*/

var arr = ['JavaScript', 'book', '前端编程语言', '8月1日'];
/*
  数组中的每个成员意义不同，因此数据结构语义不好
  通常适配成对象形式
*/
function arrToObjAdapter(arr) {
  return {
    name: arr[0],
    type: arr[1],
    title: arr[2],
    data: arr[3]
  }
}
var adapterData = arrToObjAdapter(arr);
console.log(adapterData);
