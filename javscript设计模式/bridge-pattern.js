/*
  桥接模式
  在系统沿着多个维度变化的同时，又不增加其复杂度并已达到解耦。
  有时页面的小细节改变常因逻辑相似导致大片臃肿的代码，让页面苦涩不堪
*/

/*
var spans = document.getElementsByTagName('span');
// 为用户名绑定特效
spans[0].onmouseover = function() {
  this.style.color = 'red';
  this.style.background = '#ddd';
};
spans[0].onmouseout = function() {
  this.style.color = '#333';
  this.style.background = 'f5f5f5';
}
......
*/

// 抽象
function changeColor(dom, color, bg) {
  // 设置元素的字体颜色
  dom.style.color = color;
  dom.style.background = bg;
}

/*
var spans = document.getElementsByTagName('span');
spans[0].onmouseover = function() {
  changeColor(this, 'red', '#ddd');
}
*/

// 桥接模式是先抽象提取共用部分，然后将实现与抽象通过侨界方法链接在一起，实现解耦

// 多元化对象
// 多维变量类
// 运动单元
function Speed(x, y) {
  this.x = x;
  this.y = y;
}
Speed.prototype.run = function() {
  //运动
}
// 着色单元
function Color(cl) {
  this.color = cl;
}
Color.prototype.draw = function() {
  // 绘制颜色
}
// 变形单元
function Shape(sp) {
  this.shape = sp;
}
Shape.prototype.change = function() {
  // 改变形状
}
// 说话单元
function Speek(wd) {
  this.word = wd;
}
Speek.prototype.say = function() {
  // 书写字体
}

// 创建一个球类，并且可以运动，可以着色
function Ball(x, y, c) {
  // 实现运动单元
  this.speed = new Speed(x, y);
  // 实现着色单元
  this.color = new Color(c);
}
Ball.prototype.init = function() {
  this.speed.run();
  // 实现着色
  this.color.draw();
}
// 创建一个人物类，可以运动，可以说话
function People(x, y, f) {
  this.speed = new Speed(x, y);
  this.font = new Speek(f);
}
People.prototype.init = function() {
  this.speed.run();
  this.font.say();
}
// 创建一个精灵类，让它可以运动可以着色可以改变形状
function Spirite(x, y, c, s) {
  this.speed = new Speed(x, y);
  this.color = new Color(c);
  this.shape = new Shape(s);
}
Spirite.prototype.init = function() {
  this.speed.run();
  this.color.draw();
  this.shape.change();
}

var = new People(10, 12, 16);
p.init();






/*















*/
