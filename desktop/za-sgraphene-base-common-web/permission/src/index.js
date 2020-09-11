import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import  {render } from 'mirrorx'
import Main from './main'
import Lang from './lang'

init();

import "./sass/ant.less"; // 主色调
import "./sass/index.scss";// 样式
// import "antd/dist/antd.less";
// import "../node_modules/reset-antd/src/less/var_reset.less";

function init(){
    var second = 0;
    var interval = setInterval(()=>{
        if(window.LangMessage && !window.LangMessage.__unload){
            renderAction();
            clearInterval(interval);
        }
        second ++;
        if(second>5*5){//防止异常 无限循环
            renderAction();
            clearInterval(interval);
        }
    },200);
}

function renderAction(){
    render(
        <AppContainer>
            <Lang />
        </AppContainer>,
      document.getElementById('root')
    );
}

if (module && module.hot) { //热替换
	module.hot.accept();
}