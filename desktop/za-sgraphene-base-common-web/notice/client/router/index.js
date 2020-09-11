/*
 * @Author: za-yanqing
 * @Date: 2018-07-11 16:18:53
 * @Description: 路由配置页，懒加载通过统一函数封装再引用
 * @Last Modified by: za-huoyanpeng
 * @Last Modified time: 2019-02-01 14:27:06
 * @ToDo: ''
 */
import React from 'react';
import Bundle from '../components/Bundle';

import NotFound from 'bundle-loader?lazy!../components/404';
import NotificationInquiry from 'bundle-loader?lazy!../components/notice/NotificationInquiry';
import SendStatistics from 'bundle-loader?lazy!../components/notice/SendStatistics';
import TemplateManagement from 'bundle-loader?lazy!../components/notice/TemplateManagement';
import NotificationConfiguration from 'bundle-loader?lazy!../components/notice/NotificationConfiguration';

const TransBundle = (component) => {
    return (props) => (
        <Bundle load={component}>
            {(Container) => <Container {...props} />}
        </Bundle>
    );
};

const Routers = [
    { 'id': 1, 'path': '/notification-inquiry', 'component': TransBundle(NotificationInquiry) },
    { 'id': 2, 'path': '/send-statistics', 'component': TransBundle(SendStatistics) },
    { 'id': 3, 'path': '/template-management', 'component': TransBundle(TemplateManagement) },
    { 'id': 4, 'path': '/notification-configuration', 'component': TransBundle(NotificationConfiguration) },
    { id: 404, 'component': TransBundle(NotFound) },
];

export default Routers;
