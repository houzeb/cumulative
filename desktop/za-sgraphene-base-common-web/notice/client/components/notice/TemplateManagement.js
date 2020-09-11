import React, { Component } from 'react';
import components from 'income-common-components';
import { message, Breadcrumb, Divider, Tooltip, Button, Drawer, Modal } from 'antd';
import ViewEmail from './email/ViewEmail';
import { mapPropTypes } from '../mapProps';
import request from '../../request';
import PropTypes from 'prop-types';
import Template from './template/Template';
const { QueryForm, Pagination } = components;
const confirm = Modal.confirm;
class App extends Component {
    constructor(props) {
        super(props);
        const { LANG } = this.props.state;
        this.state = {
            emailvisible: false,
            visible: false,
            disabled: false,
            selectVal: 'SMS',
            emailContent: {},
            title: '',
            list: [{
                id: 'SMS',
                value: LANG.text_sms || '短信'
            }, {
                id: 'EMAIL',
                value: LANG.text_email || '短信'
            }]
        };
    }

    handleSubmit = (values) => {
        this.refs.pagination.handleSearch(values);
    }
    add = () => {
        const { LANG = {} } = this.props.state;
        this.setState({
            disabled: false,
            selectVal: 'SMS',
            visible: true,
            title: LANG.add || '新增',
            con: {},
            upList: [],
        });
    }
    edit = (id, selectVal) => {
        const { LANG = {} } = this.props.state;
        request.queryTempById(id).then(res => {
            if (res.success) {
                console.log('res.value', res.value);
                this.setState({
                    disabled: true,
                    con: res.value,
                    upList: res.value.attachmentResponseDTOList,
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

    render() {
        const { LANG = {} } = this.props.state;
        const formItems = [
            {
                label: LANG.temp_type || '模板类型',
                type: 'select',
                key: 'messageType',
                options: {
                    keyNickName: 'id',
                    valueNickName: 'value',
                },
                list: this.state.list,
            }, {
                label: LANG.temp_name || '模板名称',
                type: 'input',
                key: 'templateName',
            }
        ];
        const columns = [{
            title: 'No.',
            dataIndex: 'key',
            width: 60,
            key: 'key',
        }, {
            title: LANG.temp_type || '模板类型',
            dataIndex: 'messageType',
            width: 120,
            key: 'messageType',
            render: (text) => {
                let val = '';
                const { list = [] } = this.state;
                list.map(item => {
                    if (item.id === text) val = item.value;
                });
                return val;
            }
        }, {
            title: LANG.temp_name || '模板名称',
            dataIndex: 'templateName',
            width: 220,
            key: 'templateName'
        }, {
            title: LANG.temp_content || '模板内容',
            dataIndex: 'content',
            key: 'content',
            render: (text, record) => {
                if (record.messageType === 'EMAIL') {
                    return <a href="javascript:;" onClick={() => { this.showEmail(record.id); }}>{LANG.btn_look || '查看'}</a>;
                } else {
                    return <Tooltip title={text}>{text}</Tooltip>;
                }
            }
        }, {
            title: LANG.handle || '操作',
            key: 'action',
            width: 120,
            render: (text, record) => (
                <span>
                    <a href="javascript:;" onClick={() => { this.edit(record.id, record.messageType); }}>{LANG.text_edit || '编辑'}</a>
                    <Divider type="vertical" />
                    <a href="javascript:;" onClick={() => this.deleteTemp(record.id)}>{LANG.delete || '删除'}</a>
                </span>
            )
        }];
        const { selectVal, disabled, title, con, upList } = this.state;
        return (
            <div>
                <div className='block query_new'>
                    <Breadcrumb>
                        <Breadcrumb.Item>{LANG.c_notify_manage || '客户通知管理'}</Breadcrumb.Item>
                        <Breadcrumb.Item>{LANG.temp_manage || '模板管理'}</Breadcrumb.Item>
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
                        param={{}}
                        ref='pagination'
                        request={request.queryTemplatePage}
                    />
                </div>
                <Modal
                    title={<Breadcrumb>
                        <Breadcrumb.Item>{LANG.c_notify_manage || '客户通知管理'}</Breadcrumb.Item>
                        <Breadcrumb.Item>{LANG.temp_manage || '模板管理'}</Breadcrumb.Item>
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
                    <Template {...this.props} con={con} upList={upList} selectVal={selectVal} disabled={disabled} close={this.close} closeAndRefresh={this.closeAndRefresh} />
                </Modal>
                <Modal visible={this.state.emailvisible} title={LANG.notify_email_view || '邮件内容查看'}
                    width={1000}
                    footer={null}
                    onCancel={this.handleCancel}><ViewEmail showTemp content={this.state.emailContent} {...this.props} /></Modal>
            </div>
        );
    }
}

App.propTypes = mapPropTypes;
App.contextTypes = {
    'router': PropTypes.object
};

export default App;
