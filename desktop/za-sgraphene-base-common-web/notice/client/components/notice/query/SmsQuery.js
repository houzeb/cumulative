import React, { Component } from 'react';
import components from 'income-common-components';
import { mapPropTypes } from '../../mapProps';
import { message } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import request from '../../../request';
const { QueryForm, Pagination } = components;

class App extends Component {
    handleSubmit = (values = {}) => {
        values.startTime = values.time[0].unix() * 1000;
        values.endTime = values.time[1].unix() * 1000;
        values.messageType = 'SMS';
        delete values.time;
        this.refs.pagination.handleSearch(values);
    }

    saveForm = (formRef) => {
        this.form = formRef;
    }

    // 重新发送
    resend = (id) => {
        const { LANG = {} } = this.props.state;
        request.messageResend({
            messageId: id
        }).then(res => {
            if (res.success) {
                message.success(LANG.perform_success || '操作成功');
                this.handleSubmit(this.form.props.form.getFieldsValue());
            }
        });
    }

    render() {
        const { LANG = {} } = this.props.state;
        const formItems = [
            {
                key: 'receiver',
                label: LANG.notify_phone || '手机号',
                type: 'input',
            },
            {
                key: 'businessNo',
                label: LANG.notify_businessNo || '业务单号',
                type: 'input',
            },
            {
                key: 'time',
                label: LANG.notify_sendTime || '发送时间',
                type: 'dateRange',
                initialValue: [moment().subtract(6, 'days'), moment()]
            }
        ];
        const columns = [{
            title: LANG.notify_phone || '手机号',
            dataIndex: 'receiver',
        }, {
            title: LANG.notify_sendTime || '发送时间',
            dataIndex: 'sendTime',
        }, {
            title: LANG.notify_SMS_content || '短信内容',
            dataIndex: 'content',
            width: 500
        }, {
            title: LANG.notify_business_event || '业务事件',
            dataIndex: 'eventName',
        }, {
            title: LANG.notify_businessNo || '业务单号',
            dataIndex: 'businessNo',
        }, {
            title: LANG.notify_sendStatus || '发送状态',
            dataIndex: 'status',
            render: (text) => {
                let val;
                [
                    {
                        id: 'TOSEND',
                        value: LANG.notify_TOSEND || '待发送'
                    },
                    {
                        id: 'FAILED',
                        value: LANG.notify_FAILED || '发送失败'
                    },
                    {
                        id: 'SENDED',
                        value: LANG.notify_SENDED || '已发送'
                    },
                    {
                        id: 'ARRIVED',
                        value: LANG.notify_ARRIVED || '送达'
                    },
                    {
                        id: 'NOTARRIVED',
                        value: LANG.notify_NOTARRIVED || '送达失败'
                    }
                ].map(item => {
                    if (text === item.id) val = item.value;
                });
                if (text === 'FAILED' || text === 'NOTARRIVED') {
                    return <span style={{ color: 'red' }}>{val}</span>;
                } else {
                    return val;
                }
            }
        }, {
            title: LANG.handle || '操作',
            render: (text, record) => (<a href='javascript:;' onClick={() => { this.resend(record.messageId); }}>{LANG.notify_resend || '重发'}</a>)
        }];
        return (
            <div>
                <div className='block query_new'>
                    <QueryForm formItem={formItems} onSubmit={this.handleSubmit}
                        wrappedComponentRef={this.saveForm} state={this.props.state} max={12} show />
                </div>
                <div className={`block block-registration`}>
                    <Pagination
                        columns={columns}
                        pagination
                        noLoad
                        ref='pagination'
                        request={request.messageSendPage}
                    />
                </div>
            </div>
        );
    }
}

App.propTypes = mapPropTypes;
App.contextTypes = {
    'router': PropTypes.object
};

export default App;
