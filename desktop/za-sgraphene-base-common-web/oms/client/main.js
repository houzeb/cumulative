import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';

// 3.0.0之后需要结构取方法，redux的log中间件
import { createLogger } from 'redux-logger';
import reducer from './reducer/reducer';

import promise from 'redux-promise';
// import axios from 'axios';

// lodash库
// import _ from 'lodash';
// console.log(_);
// iframe父级函数，给与子系统跳转到nsso使用
window.goNsso = async() => {
    window.location.href = window.location.protocol + '//' + window.location.host + '/userTimeOut';
};

const logger = createLogger();
const store = createStore(
    reducer,
    applyMiddleware(promise, logger)
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root')
);
