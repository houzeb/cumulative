import React, { Component } from 'react';
import components from 'income-common-components';
import { message, Breadcrumb, Divider, Tooltip, Button, Drawer, Modal } from 'antd';
import ViewEmail from './email/ViewEmail';
import Config from './config/Config';
import { mapPropTypes } from '../mapProps';
import request from '../../request';
import PropTypes from 'prop-types';
const { QueryForm, Pagination } = components;
const confirm = Modal.confirm;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            eventList: [],
            content: {},
            eventSourceList: [],
            tempList: []
        };
    }

    componentDidMount() {
        this.loadSelect();
    }
    loadSelect = () => {
        request.queryEvent().then(res => {
            if (res.success && res.value) {
                this.setState({ eventList: res.value });
            }
        });
        request.queryEventSource().then(res => {
            if (res.success && res.value) {
                this.setState({ eventSourceList: res.value });
            }
        });
    }

    handleSubmit = (values) => {
        this.refs.pagination.handleSearch(values);
    }
    add = () => {
        const { LANG = {} } = this.props.state;
        request.queryTemplatePage({
            condition: {
                messageType: 'SMS'
            }
        }).then(res => {
            if (res.success && res.value && res.value.results) {
                this.setState({ tempList: res.value.results });
            }
        });
        this.setState({
            disabled: false,
            selectVal: 'SMS',
            visible: true,
            title: LANG.add || '新增',
        });
    }
    edit = (id, selectVal) => {
        const { LANG = {} } = this.props.state;
        request.queryTemplatePage({
            condition: {
                messageType: selectVal
            }
        }).then(res => {
            if (res.success && res.value && res.value.results) {
                this.setState({ tempList: res.value.results });
            }
        });
        request.configDetail(id).then(res => {
            if (res.success && res.value) {
                this.setState({ content: res.value });
            }
        });
        request.queryTempById(id).then(res => {
            if (res.success) {
                console.log('res.value', res.value);
                this.setState({
                    disabled: true,
                    con: res.value,
                    selectVal,
                    visible: true,
                    title: LANG.text_edit || '编辑'
                });
            }
        });
    }

    saveForm = (formRef) => {
        this.form = formRef;
    }

    getEvent = () => {

    }

    close = () => {
        this.setState({ visible: false });
    }

    closeAndRefresh = () => {
        this.setState({ visible: false });
        this.refs.pagination.handleSearch(this.form.props.form.getFieldsValue());
    }

    // 删除模版
    deleteTemp = (id) => {
        const { LANG } = this.props.state;
        const that = this;
        confirm({
            title: LANG.notify_delete_temp || '删除后将禁用关联通知配置，是否确认删除？',
            onOk() {
                request.deleteTemplate(id).then(res => {
                    if (res.success) {
                        message.success(LANG.delete_success || '删除成功');
                        that.refs.pagination.handleSearch(that.form.props.form.getFieldsValue());
                    }
                });
            }
        });
    }
    showEmail(id) {
        request.queryTempById(id).then(res => {
            if (res.success) {
                this.setState({ emailContent: res.value, emailvisible: true });
            }
        });
    }

    handleCancel = () => {
        this.setState({ emailvisible: false });
    }

    updateStatus = (id) => {
        request.updateMessageStatus(id).then(res => {
            res.success && this.handleSubmit(this.form.props.form.getFieldsValue());
        });
    }

    render() {
        const { LANG = {} } = this.props.state;
        const list = [
            {
                id: 'SMS',
                value: LANG.text_sms || '短信'
            },
            {
                id: 'EMAIL',
                value: LANG.text_email || '邮件'
            }
        ];
        const recipient = {
            HOLDER: LANG.policy_holder_name || '投保人',
            INSURANT: LANG.insurant_text || '被保人'
        };
        const formItems = [
            {
                label: LANG.temp_type || '模板类型',
                type: 'select',
                key: 'eventCode',
                options: {
                    keyNickName: 'eventCode',
                    valueNickName: 'eventName',
                },
                list: this.state.eventList,
            }
        ];
        const columns = [{
            title: LANG.notify_business_event || '事件',
            dataIndex: 'eventName',
        }, {
            title: LANG.notify_event_source || '事件来源',
            dataIndex: 'sourceName',
        }, {
            title: LANG.notify_method_informe || '通知方式',
            dataIndex: 'messageType',
            render: (text, record) => {
                let val = '';
                list.map(item => {
                    if (item.id === text) val = item.value;
                });
                return val;
            }
        }, {
            title: LANG.notify_recipient || '收件人',
            dataIndex: 'receiver',
            render: (text, record) => {
                const list = record.receiverRespList || [];
                return list.map((item, index) => {
                    if (item.receiverValue) {
                        return <div key={index}>{item.receiverValue}</div>;
                    } else {
                        return <div key={index}>{recipient[item.receiverPersonType]}</div>;
                    }
                });
            }
        }, {
            title: LANG.notify_template || '模版',
            dataIndex: 'templateNo',
        }, {
            title: LANG.notify_sign || '签名ID',
            dataIndex: 'messageSign',
        }, {
            title: LANG.status || '状态',
            dataIndex: 'status',
            render: (text, record) => {
                return text === 1 ? (LANG.notify_activated || '已启用') : (LANG.notify_disabled || '已禁用');
            }
        }, {
            title: LANG.handle || '操作',
            render: (text, record) => (
                <span>
                    <a href="javascript:;" onClick={() => {
                        // actions.routing.push(`/notify-config-edit?id=${record.id}&type=${record.messageType}`);
                        // actions.TemplatePage.updateLocatSub(LANG.text_edit || '编辑');
                        // actions.ConfigEditPage.setSelectVal(record.messageType);
                        // actions.TemplateEditPage.setSelDisable(true);
                        this.edit(record.id, record.messageType);
                    }}>{LANG.text_edit || '编辑'}</a>
                    <Divider type="vertical" />
                    <a href="javascript:;" onClick={() => this.updateStatus(record.id)}>
                        {
                            record.status === 1 ? (LANG.notify_disable || '禁用') : (LANG.notify_enable || '启用')
                        }
                    </a>
                </span>
            )
        }];
        const { selectVal, disabled, title, con, eventList, eventSourceList, content, tempList } = this.state;
        return (
            <div>
                <div className='block query_new'>
                    <Breadcrumb>
                        <Breadcrumb.Item>{LANG.c_notify_manage || '客户通知管理'}</Breadcrumb.Item>
                        <Breadcrumb.Item>{LANG.notify_config || '通知配置'}</Breadcrumb.Item>
                    </Breadcrumb>
                    <QueryForm formItem={formItems} onSubmit={this.handleSubmit}
                        wrappedComponentRef={this.saveForm} state={this.props.state} max={12} show />
                </div>
                <div className='block table_new'>
                    <div className='query-page-bar'>
                        <Button type='primary' onClick={this.add}>{LANG.register_new || '登记'}</Button>
                    </div>
                    <Pagination
                        columns={columns}
                        pagination
                        // noLoad
                        ref='pagination'
                        request={request.queryMessageConfig}
                    />
                </div>
                <Modal
                    title={<Breadcrumb>
                        <Breadcrumb.Item>{LANG.c_notify_manage || '客户通知管理'}</Breadcrumb.Item>
                        <Breadcrumb.Item>{LANG.notify_config || '通知配置'}</Breadcrumb.Item>
                        <Breadcrumb.Item>{title}</Breadcrumb.Item>
                    </Breadcrumb>}
                    destroyOnClose
                    placement={'right'}
                    closable={false}
                    onClose={this.close}
                    visible={this.state.visible}
                    width={980}
                    footer={null}
                >
                    <Config {...this.props} close={this.close} closeAndRefresh={this.closeAndRefresh} selectVal={selectVal}
                        getEvent={this.getEvent} eventList={eventList} eventSourceList={eventSourceList} content={content} tempList={tempList} />
                </Modal>
            </div>
        );
    }
}

App.propTypes = mapPropTypes;
App.contextTypes = {
    'router': PropTypes.object
};

export default App;
