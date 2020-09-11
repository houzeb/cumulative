/*
 * @Author: za-zhouchiye
 * @Date: 2018-07-04 12:04:37
 * @Description: ''
 * @Last Modified by: za-huoyanpeng
 * @Last Modified time: 2019-03-13 15:27:11
 * @ToDo: ''
 */
import config from '../../config';
import axios from 'axios';
// import jsonp from 'jsonp';
import Lockr from 'lockr';
import { message } from 'antd';
let LANG = '';

// 拦截器
axios.interceptors.response.use((res) => {
    // Do something with response data
    // 接口返回101未登录时，跳转重新登录
    if (res.data.code === '101') {
        if (self !== top) {
            // iframe退出登录
            window.parent.goNsso();
        } else {
            window.location.href = '/logout';
        }
    }
    if (!res.data.success && !res.data.userId) {
        let msg = LANG[res.data.errorCode] || res.data.msg || LANG.COMMON_SYS_0000;
        console.log('msg', msg);
        if (res.data.code && res.data.code === 'BIZ_CLM_POLICY_COPY_VERSION_NOT_EQUAL') {
            // 如果是抄单失败，不提示错误信息，特殊处理
        } else {
            msg && message.error(msg);
        }
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

    // 获取oms配置 返回domain，解决跨域
    getOMSConfig: async() => {
        const res = await axios('/api/oms_web/getSysHost');
        return res.data.value;
    },

    // 国际化
    getlLang: async(currentLang) => {
        const res = await axios.post(`/api/i18n/i18n/resource/download.json?namespace=${config.namespace}&lang=${currentLang}`);
        if (res && res.data.value) {
            LANG = res.data.value;
            Lockr.set('lang_data', res.data.value);
            return res.data.value;
        } else {
            LANG = Lockr.get('lang_data');
            return Lockr.get('lang_data');
        }
    },
    // 查询用户权限信息
    queryUserPriviledges: async(userId) => {
        const res = await axios.post('/api/permission/user/queryUserPriviledges', { userId });
        return res.data;
    },
    messageSendPage: async(data) => {
        const res = await axios.post('/api/notice/rest/notice/query/messageSendPage', data);
        return res.data;
    },
    messageSendDetail: async(data) => {
        const res = await axios.post(`/api/notice/rest/notice/query/messageSendDetail?messageId=${data.messageId}`);
        return res.data;
    },
    messageResend: async(data) => {
        const res = await axios.post(`/api/notice/rest/notice/messageResend?messageId=${data.messageId}`);
        return res.data;
    },
    download: async(id) => {
        const res = await axios.get(`/api/notice/rest/notice/download/attachments?fileOperateType=DOWNLOAD_FILE&fileUniqueCode=${id}`);
        return res.data;
    },
    dailySend: async(data) => {
        const res = await axios.post('/api/notice/rest/notice/count/dailySend', data);
        return res.data;
    },
    queryTemplatePage: async(data) => {
        const res = await axios.post('/api/notice/rest/notice/query/queryTemplatePage', data);
        return res.data;
    },
    saveTemplate: async(data) => {
        const res = await axios.post('/api/notice/rest/notice/save/messageTemplate', data);
        return res.data;
    },
    listPrompt: async(data) => {
        const res = await axios.post('/api/notice/rest/notice/list/prompt', data);
        return res.data;
    },
    deleteTemplate: async(id) => {
        const res = await axios.post(`/api/notice/rest/notice/delete/messageTemplate?id=${id}`);
        return res.data;
    },
    queryTempById: async(id) => {
        const res = await axios.post(`/api/notice/rest/notice/query/messageTemplate?id=${id}`);
        return res.data;
    },
    attachments: async(data) => {
        const res = await axios.post('/api/notice/rest/notice/upload/attachments', data);
        return res.data;
    },
    queryEvent: async(code) => {
        const res = await axios.post(`/api/notice/rest/notice/query/eventDef`);
        return res.data;
    },
    queryEventCode: async(code) => {
        const res = await axios.post(`/api/notice/rest/notice/query/eventDef?sourceCode=${code}`);
        return res.data;
    },
    queryEventSource: async(data) => {
        const res = await axios.post('/api/notice/rest/notice/query/eventSource', data);
        return res.data;
    },
    queryMessageConfig: async(data) => {
        const res = await axios.post('/api/notice/rest/notice/query/messageConfig', data);
        return res.data;
    },
    updateMessageStatus: async(id) => {
        const res = await axios.post(`/api/notice/rest/notice/update/messageDefStatus?id=${id}`);
        return res.data;
    },
    saveMessage: async(data) => {
        const res = await axios.post('/api/notice/rest/notice/save/messageDef', data);
        return res.data;
    },
    configDetail: async(id) => {
        const res = await axios.post(`/api/notice/rest/notice/query/messageConfigDetail?id=${id}`);
        return res.data;
    },
};

export default req;
