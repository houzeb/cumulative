import axios from 'axios'
export default {
  get: function (option) {
    if (!option.params) {
      axios.get(option.url)
        .then(function (response) {
          var data = response.data;
          if (data.result) {
            if (option.callBack) {
              option.callBack(data.model);
            }
          } else {
            option.this_.$alert(data.message);
          }
        })
    } else {
      axios.get(option.url, {
          params: option.params
        })
        .then(function (response) {
          var data = response.data;
          if (data.result) {
            if (option.callBack) {
              option.callBack(data.model)
            }
          } else {
            option.this_.$alert(data.message);
          }
        })
    }
  },
  post: function (option) {
    axios.post(option.url, option.params)
      .then(function (response) {
        var data = response.data;
        if (data.result) {
          if (option.callBack) {
            option.callBack(data.model)
          }
        } else {
          option.this_.$alert(data.message);
        }
      })
  },
  post_: function (option) {
    var params = setData(option.params)
     axios.post(option.url, params)
       .then(function (response) {
         var data = response.data;
         if (data.result) {
           if (option.callBack) {
             option.callBack(data.model)
           }
         } else {
           option.this_.$alert(data.message);
         }
       })
       .catch(function (error) {
         option.this_.$alert(error);
       });
   },
  setData(data){
    var fdata = new FormData();
    for(var attr in data){  
      fdata.append(attr,data[attr]);
    }
    return fdata;
  },
  post1: function (option) {
    var qs = require('qs');
    axios.post(option.url, qs.stringify(option.params))
      .then(function (response) {
        var data = response.data;
        if (data.result) {
          if (option.callBack) {
            option.callBack(data.model)
          }
        } else {
          option.this_.$alert(data.message);
        }
      })
      .catch(function (error) {
        option.this_.$alert(error);
      });
  }
}
// export default{
//     websocket:(url,callback)=>{

//     let websocket=null
//     if ("WebSocket" in window) {
//     // websocket = new WebSocket("ws://"+url);
//     websocket = new WebSocket(url);
// }
// else if ("MozWebSocket" in window) {
//     // websocket = new WebSocket("ws://"+url);
//     websocket = new WebSocket(url);
// }
// else {
//     // console.error("'不支持 WebSocKet");
// }
// //连接发生错误的回调方法
// websocket.onerror = () => console.log("error");
// //接收到消息的回调方法
// websocket.onopen = event => {
//     //接收到消息的回调方法

//     websocket.onmessage = event => {
//         if(callback){
//             if(event.data){
//                 try{
//                     callback(event.data);
//                 }catch(e){
//                 }
//             }else{
//                 callback()
//             }
//         }
//     };
//     //连接关闭的回调方法
//     // websocket.onclose = () => console.log("close");
//     //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
//     window.onbeforeunload = () => websocket.close();
//     //return websocket;
// };

// return websocket;
// },
// ajax_get:(url,param,callback,this_) => {
//     console.log(url)
//     console.log(param)
//     axios.get( url, { params:param }).then(res => {
//         let data= res.data
//         if(data.result){
//         if(callback){
//             if(data.model&&JSON.stringify(data.model).length>2){
//                 try{
//                     // console.log(data.model)
//                     callback(data.model)
//                 }catch(e){
//                     // console.log('异常了')
//                     // console.log(e)
//                 }
//             }else{
//                 callback(data.model)
//             }
//         }

//     }else{
//         this_.$alert(data.message,'系统提示');
//     }
// })
// },
// ajax_post: (url,data,param,callback,this_) => {
//     let qs = require('qs')
//     console.log(url)
//     console.log(data)
//     console.log(param)
//     // console.log(qs.stringify(data))
//     axios.post( url,qs.stringify(data), { params:param }).then(res => {
//         let data= res.data
//         // console.log(data)
//         if(data.result){
//         if(callback){
//             if(data.model&&JSON.stringify(data.model).length>2){
//                 try{
//                     // callback(JSON.parse(data.message,this_))
//                     // console.log(data.model)
//                     callback(data.model,this_)
//                 }catch(e){
//                     // console.log('异常了')
//                     // console.log(e)
//                 }
//             }else{
//                 callback(data.model,this_)
//             }
//         }
//     }else{
//         this_.$alert(data.message,'系统提示');
//     }
// })
// },
// ajax_post2: (url,data,param,callback,this_) => {
//     let qs = require('qs')
//     // console.log(url)
//     // console.log(data)
//     // console.log(param)
//     // console.log(qs.stringify(data))
//     axios.post( url,qs.stringify(data), { params:param }).then(res => {
//         let data= res.data
//         if(data.result){
//         if(callback){
//             if(data.model&&JSON.stringify(data.model).length>2){
//                 try{
//                     // callback(JSON.parse(data.message,this_))
//                     // console.log(data)
//                     callback(data)
//                 }catch(e){
//                     // console.log('异常了')
//                     // console.log(e)
//                 }
//             }else{
//                 callback(data.message,this_)
//             }
//         }
//     }else{
//         this_.$alert(data.message,'系统提示');
//     }
// })
// },
//   ajax_postAction: (url,data,param,callback,this_) => {
//         let qs = require('qs')
//         axios.post( url,qs.stringify(data), { params:param }).then(res => {
//             let data= res.data
//             if(data.result){
//                 try{
//                     callback(data.message)
//                 }catch(e){
//                     // console.log('异常了');
//                     // console.log(e)
//                 }
//             }else{
//                 this_.$alert(data.message,'系统提示');
//             }
//         })
//     },
// ajax_post1: (url,data,param,callback,this_) => {
//     console.log(url)
//     console.log(data)
//     console.log(param)
//     axios.post( url,data, { params:param }).then(res => {
//         let data= res.data
//         if(data.result){
//         if(callback){
//             if(data.model&&JSON.stringify(data.model).length>2){
//                 try{
//                     // callback(JSON.parse(data.message,this_))
//                     // console.log(data.model)
//                     callback(data.model)
//                 }catch(e){
//                     // console.log('异常了')
//                     // console.log(e)
//                 }
//             }else{
//                 callback(data.message,this_)
//             }
//         }
//     }else{
//         this_.$alert(data.message,'系统提示');
//     }
// })
// }
// }
