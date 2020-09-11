/*
  享元模式
  运用共享技术有效地支持大量的细粒度的对象，避免对象间拥有相同内容造成多余的开销
*/

// 新闻翻页功能

var article = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],  // 新闻数据
    dom = null,             // 缓存创建的新闻标题元素
    paper = 0,              // 当前页数
    num = 5,                // 每页显示新闻数目
    i = 0,                  // 创建新闻元素时保存变量
    len = article.length;   // 新闻数据长度
for (; i < len; i++) {
  dom = document.createElement('div');
  dom.innerHTML = article[i];
  if (i >= num) {
    dom.style.display = 'none';
  }
  document.getElementById('container').appendChild(dom);
}
// 下一页绑定事件
document.getElementById('next_page').onclick = function() {
  var div = document.getElementById('container').getElementsByTagName('div'),
      j = k = n = 0;
      n = ++paper % Math.cell(len / num) * num;
  for(; j < len; j++) {
    div[j].style.display = 'none';
  }
  for(; k < 5; k++) {
    if(div[n + k])
      div[n + k].style.display = 'block';
  }
}

// 提供一个操作方式
var Flyweight = function() {
  // 已创建的元素
  var created = [];
  // 创建一个新闻包装容器
  function create () {
    var dom = document.createElement('div');
    // 将容器插入新闻列表容器中
    document.getElementById('container').appendChild(dom);
    // 缓存新创建的元素
    created.push(dom);
    // 返回创建的新元素
    return dom;
  }
  return {
    getDiv: function() {
      if (created.length < 5) {
        return create();
      } else {
        var div = created.shift();
        created.push(div);
        return div;
      }
    }
  }
}
/*















*/
