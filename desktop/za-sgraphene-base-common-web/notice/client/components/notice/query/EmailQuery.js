import React, { Component } from 'react';
import ViewEmail from '../email/ViewEmail';
import { mapPropTypes } from '../../mapProps';
import { message, Tooltip, Modal } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import request from '../../../request';
import components from 'income-common-components';
const { QueryForm, Pagination } = components;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            emailContent: {}
        };
    }
    handleSubmit = (values = {}) => {
        values.startTime = values.time[0].unix() * 1000;
        values.endTime = values.time[1].unix() * 1000;
        values.messageType = 'EMAIL';
        delete values.time;
        this.refs.pagination.handleSearch(values);
    }

    viewEmail = (messageId) => {
        request.messageSendDetail({ messageId }).then(res => {
            if (res.success) {
                this.setState({ emailContent: res.value, visible: true });
            }
        });
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

    handleCancel = () => {
        this.setState({ visible: false });
    }

    render() {
        const { LANG = {} } = this.props.state;
        const formItems = [
            {
                key: 'receiver',
                label: LANG.text_email || '邮箱',
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
            title: LANG.text_email || '邮箱',
            dataIndex: 'receiver',
            render: (text, record) => {
                if (record.ccMails) {
                    return (
                        <div>
                            <p>{`To：${text}`}</p>
                            {
                                record.ccMails.length > 1 ? (
                                    <Tooltip placement='top' title={record.ccMails.join('，')}>
                                        <p>{`Cc：${record.ccMails[0]} ...`}</p>
                                    </Tooltip>
                                ) : <p>{`Cc：${record.ccMails[0]}`}</p>
                            }
                        </div>
                    );
                } else {
                    return `To：${text}`;
                }
            }
        }, {
            title: LANG.notify_sendTime || '发送时间',
            dataIndex: 'sendTime',
        }, {
            title: LANG.notify_email_subject || '邮件主题',
            dataIndex: 'title',
        }, {
            title: LANG.notify_email_content || '邮件内容',
            render: (text, record) => (<a href='javascript:;' onClick={() => { this.viewEmail(record.messageId); }}>{LANG.btn_look || '查看'}</a>)
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
                <Modal visible={this.state.visible} title={LANG.notify_email_view || '邮件内容查看'}
                    width={1000}
                    footer={null}
                    onCancel={this.handleCancel}><ViewEmail showTemp={false} content={this.state.emailContent} {...this.props} /></Modal>
            </div>
        );
    }
}

App.propTypes = mapPropTypes;
App.contextTypes = {
    'router': PropTypes.object
};

export default App;
