/*
  组合模式，又称部分-整体模式
  将对象组合成树形结构以表示“部分整体”的层次结构。组合模式使得用户对单个对象和组合对象的使用具有一致性
*/

/*
  对于新闻模块
  让所有的新闻都继承一个新闻虚拟父类News
*/
var News = function() {
  // 子组件容器
  this.children = [];
  // 当前组件元素
  this.element = null;
}
News.prototype = {
  init: function() {
    throw new Error('请重写你的方法');
  },
  add: function() {
    throw new Error('请重写你的方法');
  },
  getElement: function() {
    throw new Error('请重写你的方法');
  }
}
/*
  在组合模式中用到了继承，可以用寄生组合式继承显现新闻模块容器类
*/
/*
  容器类构造函数
*/
var Container = function(id, parent) {
  // 构造函数继承父类
  News.call(this);
  // 模块id
  this.id = id;
  // 模块的父容器
  this.parent = parent;
  // 构建方法
  this.init();
};
// 寄生式继承父类原型方法
function inheritObject(o) {
  // 声明一个过渡函数对象
  function F() {}
  // 过渡对象的原型继承父对象
  F.prototype = o;
  // 返回过渡对象的一个实例
  return new F();
}
function inheritPrototype(subClass, superClass) {
  // 复制一份父类的原型副本保存在变量中
  var p = inheritObject(superClass.prototype);
  // 修正因为重写子类原型导致子类的constructor属性被修改
  p.constructor = subClass;
  // 设置子类的原型
  subClass.prototype = p;
}
inheritPrototype(Container, News);
// 构建方法
Container.prototype.init = function() {
 this.element = document.createElement('ul');
 this.element.id = this.id;
 this.element.className = 'new-container';
};
// 添加子元素方法
Container.prototype.add = function(child) {
  // 在子元素容器中插入子元素
  this.children.push(child);
  // 插入当前组件元素树中
  this.element.appendChild(child.getElement());
  return this;
}

// 获取当前元素方法
Container.prototype.getElement = function() {
  return this.element;
}

// 显示方法
Container.prototype.show = function() {
  this.parent.appendChild(this.element);
}

// 行成员集合类
var Item = function(classname) {
  News.call(this);
  this.classname = classname || "";
  this.init();
}
inheritPrototype(Item, News);
Item.prototype.init = function() {
  this.element = document.createElement('li');
  this.element.className = this.classname;
}
Item.prototype.add = function(child) {
  // 在子元素容器中插入子元素
  this.children.push(child);
  // 插入当前组件元素树中
  this.element.appendChild(child.getElement());
  return this;
}
Item.prototype.getElement = function() {
  return this.element;
}
// 新闻组合体类
var NewsGroup = function(classname) {
  News.call(this);
  this.classname = classname || '';
  this.init();
}
inheritPrototype(NewsGroup, News);
NewsGroup.prototype.init = function() {
  this.element = document.createElement('div');
  this.element.className = this.classname;
}
NewsGroup.prototype.add = function(child) {
  this.children.push(child);
  this.element.appendChild(child.getElement());
  return this;
}
NewsGroup.prototype.getElement = function() {
  return this.element;
}


/*
  新闻成员类
*/
// 图片新闻类
var ImageNews = function(url, href, classname) {
  News.call(this);
  this.url = url || '';
  this.href = href || '#';
  this.classname = classname || 'normal';
  this.init();
}
inheritPrototype(ImageNews, News);
ImageNews.prototype.init = function() {
  this.element = document.createElement('a');
  var img = new Image();
  img.src = this.url;
  this.element.appendChild(img);
  this.element.className = 'image-news ' + this.classname;
  this.element.href = this.href;
}
ImageNews.prototype.add = function() {}
ImageNews.prototype.getElement = function() {
  return this.element;
}

var IconNews = function(text, href, type) {
  News.call(this);
  this.text = text || '';
  this.href = href || '#';
  this.type = type || 'video';
  this.init();
}
inheritPrototype(IconNews, News);
IconNews.prototype.init = function() {
  this.element = document.createElement('a');
  this.element.innerHTML = this.text;
  this.element.href = this.href;
  this.element.className = 'icon ' + this.type;
}
IconNews.prototype.add = function() {}
IconNews.prototype.getElement = function() {
  return this.element;
}

var EasyNews = function(text, href) {
  News.call(this);
  this.text = text || '';
  this.href = href || '#';
  this.init();
}
inheritPrototype(EasyNews, News);
EasyNews.prototype.init = function() {
  this.element = document.createElement('a');
  this.element.innerHTML = this.text;
  this.element.href = this.href;
  this.element.className = 'text';
}
EasyNews.prototype.add = function() {}
EasyNews.prototype.getElement = function() {
  return this.element;
}

var TypeNews = function(text, href, type, pos) {
  News.call(this);
  this.text = text || '';
  this.href = href || '#';
  this.type = type || '';
  this.pos = pos || 'left';
  this.init();
}
inheritPrototype(TypeNews, News);
TypeNews.prototype.init = function() {
  this.element = document.createElement('a');
  if(this.pos === 'left') {
    this.element.innerHTML = '[' + this.type + '] ' + this.text;
  } else {
    this.element.innerHTML = this.text + ' [' + this.type + ']';
  }
  this.element.href = this.href;
  this.element.className = 'text';
}
TypeNews.prototype.add = function() {}
TypeNews.prototype.getElement = function() {
  return this.element;
}

var news1 = new Container('news', document.body);
news1.add(
  new Item('normal1').add(
    new IconNews('梅西不拿金球也伟大', '#', 'video')
  )
).add(
  new Item('normal1').add(
    new IconNews('保护强国强队用意明显', '#', 'live')
  )
).add(
  new Item('normal1').add(
    new NewsGroup('has-img').add(
      new ImageNews('img/1.jgp', '#', 'small')
    ).add(
      new EasyNews('从240斤胖子成功变型男', '#')
    ).add(
      new EasyNews('五大雷人跑步机', '#')
    )
  )
).add(
  new Item('normal1').add(
    new TypeNews('AK47不愿为费城打球', '#', 'NBA', 'left')
  )
).add(
  new Item('normal1').add(
    new TypeNews('火炮飙6三分创新高', '#', 'CBA', 'right')
  )
).show();




/*


















*/
