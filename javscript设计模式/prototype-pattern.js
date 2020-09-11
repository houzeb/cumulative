/*
  原型模式
  用原型实例指向创建对象的类，使用于创建新的对象的类共享原型对象的属性以及方法
*/
/*
  一、创建一个焦点图
*/
// 图片轮播类
var LoopImages = function(imgArr, container) {
  this.imagesArray = imgArr; // 轮播图片数组
  this.container = container; // 轮播图片容器
}
LoopImages.prototype = {
  // 创建轮播图片
  createImage: function () {
    console.log('LoopImages createImage function');
  },
  // 切换下一张图片
  changeImage: function () {
    console.log('LoopImages changeImage function');
  }
}

// 上下滑动切换类
var SlideLoopImg = function(imgArr, container) {
  // 构造函数继承图片轮播类
  LoopImages.call(this, imgArr, container);
}
SlideLoopImg.prototype = new LoopImages();
SlideLoopImg.prototype.changeImage = function() {
  console.log('SlideLoopImg changeImage function');
}

// 渐隐切换类
var FadeLoopImg = function(imgArr, container, arrow) {
  LoopImages.call(this, imgArr, container);
  // 切换箭头私有变量
  this.arrow = arrow;
}
FadeLoopImg.prototype = new LoopImages();
FadeLoopImg.prototype.changeImage = function() {
  console.log('FadeLoopImage changeImage function');
}

// 实例化一个渐隐切换图片类
var fadeImg = new FadeLoopImg([
  '01.jpg',
  '02.jpg',
  '03.jpg',
  '04.jpg'
], 'slide', [
  'left.jpg',
  'right.jpg'
]);
fadeImg.changeImage();


/*
  原型继承
*/
/*
  基于已经存在的模板对象克隆出新对象的模式
  arguments[0], arguments[1], arguments[2]: 参数1，参数2，参数3 表示模板对象
  注意： 这里对模板引用类型的属性实质上进行了潜复制(引用类型属性共享)
*/

function prototypeExtend() {
  var F = function() {},
      args = arguments,
      i = 0,
      len = args.length;
    for(; i < len; i++) {
      // 遍历每个模板对象中的属性
      for(var j in args[i]) {
        F.prototype[j] = args[i][j];
      }
    }
    // 返回缓存类的一个实例
    return new F();
}





 /*







 */
