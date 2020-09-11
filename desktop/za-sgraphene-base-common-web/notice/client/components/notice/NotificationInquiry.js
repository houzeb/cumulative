import React, { Component } from 'react';
import { Tabs, Breadcrumb } from 'antd';
import { mapPropTypes } from '../mapProps';
import PropTypes from 'prop-types';
import SmsQuery from './query/SmsQuery';
import EmailQuery from './query/EmailQuery';
const TabPane = Tabs.TabPane;
class App extends Component {
    render() {
        const { LANG } = this.props.state;
        return (
            <div className="block block-default">
                <Breadcrumb>
                    <Breadcrumb.Item>{LANG.c_notify_manage || '客户通知管理'}</Breadcrumb.Item>
                    <Breadcrumb.Item>{LANG.notify_query || '通知查询'}</Breadcrumb.Item>
                </Breadcrumb>
                <Tabs defaultActiveKey="1">
                    <TabPane tab={LANG.text_sms || '短信'} key="1">
                        <SmsQuery {...this.props} />
                    </TabPane>
                    <TabPane tab={LANG.text_email || '邮件'} key="2">
                        <EmailQuery {...this.props} />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

App.propTypes = mapPropTypes;
App.contextTypes = {
    'router': PropTypes.object
};

export default App;
