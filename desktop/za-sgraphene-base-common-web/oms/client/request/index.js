/*
 * @Author: za-zhouchiye
 * @Date: 2018-07-04 12:04:37
 * @Description: ''
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-03-26 11:45:13
 * @ToDo: ''
 */
import config from '../../config';
import axios from 'axios';
// import jsonp from 'jsonp';
import Lockr from 'lockr';
import { message } from 'antd';
let LANG = '';

// 错误分为BIZ开头的报相关错误，SYS开头的报系统错误
const errorCodeFunc = (RegCode, res) => {
    switch (RegCode) {
    case 'BIZ':
        return res.data.msg;
    case 'SYS':
        return LANG.COMMON_SYS_0000;
    default:
        return LANG.COMMON_SYS_0000;
    }
};

// 拦截器
axios.interceptors.request.use((config) => {
    // 如果是get请求，后面加上时间戳，防止浏览器缓存
    if (config.method === 'get') {
        let tag = new Date().getTime();
        config.url += `?${tag}`;
    }
    config.headers['Cache-Control'] = 'no-cache';
    return config;
});
axios.interceptors.response.use((res) => {
    // Do something with response data
    // 接口返回101未登录时，跳转重新登录
    if (res.data.code === '101') {
        window.location.href = '/userTimeOut';
    }
    if (!res.data.success && !res.data.userId) {
        // 提取错误code
        const errorCode = res.data.code || '';
        // 匹配Code的特征字符
        const RegCode = errorCode.split('_')[0];
        let msg = errorCodeFunc(RegCode, res);
        msg && message.error(msg);
    }
    return res;
}, (error) => {
    console.error('error', error);
    // Do something with response error
    message.error(LANG.system_unusual_againTry);
    return Promise.reject(error);
});

const req = {
    // 获取用户信息
    getUser: async() => {
        const res = await axios('/getUserInfo');
        return res.data;
    },

    // 获取用户信息
    getTicket: async() => {
        const res = await axios('/getTicket');
        return res.data;
    },

    // 获取oms配置 返回domain，解决跨域
    getOMSConfig: async() => {
        const res = await axios('/api/oms_web/getSysHost');
        return res.data.value;
    },

    // 国际化
    getlLang: async(currentLang) => {
        const res = await axios.post(`api/i18n/i18n/resource/download.json?namespace=${config.namespace}&lang=${currentLang}`);
        if (res && res.data.value) {
            LANG = res.data.value;
            Lockr.set('lang_data', res.data.value);
            return res.data.value;
        } else {
            return Lockr.get('lang_data');
        }
    },

    // 菜单列表
    getSider: async(data) => {
        if (!data) {
            data = {
                userId: 263002,
                systemCode: 'SYSTEM_ROOT',
                i18Local: 'CHINA'
            };
        }
        const res = await axios.post('api/permission/resource/listMenu', data);
        return res.data;
    },

    // 用户信息查询
    getUserDetail: async(userId) => {
        const res = await axios.post('api/permission/backend/user/getUser', { userId });
        return res.data;
    },
};

export default req;
