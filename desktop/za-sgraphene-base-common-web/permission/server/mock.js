var express = require('express');
var router = express.Router();
var Mock = require("mockjs");


module.exports = function(options){
    var url = options.url;
    let value;
    console.log("mock",options)

    // var result = Mock.mock({
    //     "success": true,
    //     "value|1-9": [{
    //         "name|5-8": /[a-zA-Z]/,
    //         "id|+1": 1,
    //         "value|0-500": 20
    //     }]
    // });

    if(url.indexOf("/getProductTypeList")>-1){
        value = {
            primaryList:[{id:"1",name:"终身寿险"},{id:"2",name:"定期寿险"},{id:"3",name:"生存寿险"},
                          {id:"4",name:"两全寿险"},{id:"5",name:"万能寿险"}],
            attachList:[{id:"11",name:"年金险"},{id:"12",name:"投连险"},{id:"13",name:"生存寿险"},
                        {id:"14",name:"两全寿险"},{id:"15",name:"万能寿险"}]              
        }
    }else if(url.indexOf("/getProductList")>-1){
        let tid = options.data && options.data.id ||"";
        value = [{id:"2221"+ tid,name:"欢乐一生" + tid},{id:"2222"+ tid,name:"幸福一生"+ tid},{id:"22223"+ tid,name:"尊享一生"+ tid},
                {id:"2224"+ tid,name:"泰康人寿"+ tid},{id:"2225"+ tid,name:"太平洋寿险"+ tid}]
    }
    
    
    options.success && options.success(JSON.stringify({ success: true, value:value}));
};
