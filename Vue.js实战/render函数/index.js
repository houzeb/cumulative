// 图片组件选项
var ImgItem = {
  props: ['data'],
  render: function(createElement) {
    return createElement('div', [
      createElement('p', '图片组件'),
      createElement('img', {
        attrs: {
          src: this.data.url
        }
      })
    ]);
  }
};
// 视频组件选项
var VideoItem = {
  props: ['data'],
  render: function(createElement) {
    return createElement('div', [
      createElement('p', '图片组件'),
      createElement('video', {
        attrs: {
          src: this.data.url,
          controls: 'controls',
          autoplay: 'autoplay'
        }
      })
    ]);
  }
};
// 纯文本组件选项
var TextItem = {
  props: ['data'],
  render: function(createElement) {
    return createElement('div', [
      createElement('p', '纯文本组件'),
      createElement('p', this.data.text)
    ]);
  }
};
Vue.component('smart-item', {
  // 函数化组件
  /*
    functional Boolean
    true时使组件无状态和无实例(没有data和this上下文)
    这样使用render函数返回虚拟节点可以更容易渲染
    因为函数化组件只是一个函数，渲染开销小
  */
  functional: true,
  render: function (createElement, context) {
    // 根据传入的数据，只能判断显示哪种组件
    function getComponent () {
      var data = context.props.data;
      // 判断 prop: data 的 type字段是属于哪种类型的组件
      if (data.type === 'img') return ImgItem;
      if (data.type === 'video') return VideoItem;
      return TextItem;
    }
    return createElement(
      getComponent(),
      {
        props: {
          // 把 smart-item 的 prop: data 传给上面只能选择的组件
          data: context.props.data
        }
      },
      context.children
    )
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  }
});

var app = new Vue({
  el: '#app',
  data: {
    data: {}
  },
  methods: {
    // 切换不同类型组件的数据
    change: function (type) {
      if (type === 'img') {
        this.data = {
          type: 'img',
          url: 'https://raw.githubusercontent.com/iview/iview/master/assets/logo.png'
        }
      } else if (type === 'video') {
        this.data = {
          type: 'video',
          url: 'http://vjs.zencdn.net/v/oceans.mp4'
        }
      } else if (type === 'text') {
        this.data = {
          type: 'text',
          content: '这是一段纯文本'
        }
      }
    }
  },
  created: function () {
    // 初始化时，默认设置图片组件的数据
    this.change('img');
  }
})




/*












*/
