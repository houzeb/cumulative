/*
 * @Author: za-yanqing
 * @Date: 2018-07-11 16:40:07
 * @Description: '入口文件，引入redux中间件，lodash库'
 * @Last Modified by: za-huoyanpeng
 * @Last Modified time: 2019-01-14 15:19:04
 * @ToDo: ''
 */
'use strict';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './components/Layout';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
// 3.0.0之后需要结构取方法，redux的log中间件
import { createLogger } from 'redux-logger';
import reducer from './reducer/reducer';
import promise from 'redux-promise';
import config from './../config';
import { updateLang } from './action/action';
import Cookies from 'universal-cookie';
import req from './request';
const cookies = new Cookies();

const logger = createLogger();
const store = createStore(
    reducer,
    applyMiddleware(promise, logger)
);

// ReactDOM.render(
//     <Provider store={store}>
//         <Layout />
//     </Provider>
//     , document.getElementById('root')
// );

const init = async() => {
    // 应用渲染前获取国际化
    const currentLang = cookies.get('lang') || config.defaultLanguage;
    cookies.set('lang', currentLang, { 'path': '/' });
    let res = await req.getlLang(currentLang);
    store.dispatch(updateLang(res));

    // 渲染
    ReactDOM.render(
        <Provider store={store}>
            <Layout />
        </Provider>
        , document.getElementById('root')
    );
};
init();
