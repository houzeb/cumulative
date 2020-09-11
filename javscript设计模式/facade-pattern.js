/*
  外观模式
  为一组复杂的子系统接口提供一个更高级的统一接口，通过这个接口是的对子系统接口的访问更容易。
*/

/*
  添加一个点击事件
  onclick是 DOM0 级事件，再次绑定click事件，相当于重复定义方法，覆盖
  因此使用 DOM2 级事件，但浏览器不兼容，需做兼容处理
*/

// 外观模式实现
function addEvent(dom, type, fn) {
  // 对于支持DOM2级事件处理程序 addEventListener 方法的浏览器
  if (dom.addEventListener) {
    dom.addEventListener(type, fn, false);
  } else if (dom.attchEvent) { // 对于不支持addEventListener方法但支持attachEvent方法的浏览器
    dom.attchEvent('on' + type, fn);
  } else { // 对于不支持addEventListener方法也不支持attachEvent方法，但支持on+'事件名'的浏览器
    dom['on' + type] = fn;
  }
}

// IE低版本浏览器中不兼容e.perventDefault() 和 e.target。 也可用外观模式解决
// 获取事件对象
var getEvent = function(event) {
  // 标准浏览器返回event，IE下window.event
  return event || window.event;
}
// 获取元素
var getTarget = function(event) {
  var event = getEvent(event);
  // 标准浏览器下event.target， IE下event.srcElement
  return event.target || event.srcElement;
}
// 阻止默认行为
var preventDefault = function(event) {
  var event = getEvent(event);
  // 标准浏览器
  if (event.preventDefault) {
    event.preventDefault();
  } else { // IE浏览器
    event.returnValue = false;
  }
}
