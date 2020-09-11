import React, { Component } from 'react';
import { message, Breadcrumb, Form, Select, Menu, Upload, Input, Dropdown, Button, Tag } from 'antd';
import request from '../../../request';
import SelectDom from '../../common/SelectDom';
import { mapPropTypes } from '../../mapProps';
import PropTypes from 'prop-types';
const FormItem = Form.Item;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            upListNew: [],
            upList: [],
            selectVal: 'SMS',
            prompt: [],
            tempCon: '',
            tempList: []
        };
    }

    componentDidMount() {
        this.loadSelect();
        this.props2State();
    }

    props2State = (newProps) => {
        const { selectVal } = newProps || this.props;
        this.setState({ selectVal });
    }

    handleChange = (selectVal) => {
        this.setState({ selectVal });
        this.props.form.setFieldsValue({ messageType: selectVal });
    }

    loadSelect = () => {
        request.listPrompt().then(res => {
            if (res.success) {
                this.setState({
                    prompt: res.value
                });
            }
        });
    }

    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let list = [];
                let filter = (item, type) => {
                    let li = {
                        receiverType: type,
                        receiverValue: item,
                        receiverPersonType: 'USER_DEFINED'
                    };
                    if (item === 'HOLDER' || item === 'INSURANT') {
                        li = {
                            receiverType: type,
                            receiverPersonType: item
                        };
                    }
                    list.push(li);
                };
                if (values.receiver) values.receiver.map(item => { filter(item, 'RECEIVER'); });
                if (values.ccMails) values.ccMails.map(item => { filter(item, 'CCMAIL'); });
                delete values.receiver;
                delete values.ccMails;
                let paras = Object.assign({}, values, {
                    // id: T.urlQuery('id') ? T.urlQuery('id') : undefined,
                    messageType: this.props.selectVal,
                    receiverRequestDTOList: list
                });
                console.log('paras', paras);
                request.saveMessage(paras).then(res => {
                    if (res.success && res.value) {
                        this.props.closeAndRefresh();
                    }
                });
            }
        });
    }

    getEvent = (code) => {
        this.props.getEvent(code);
    }

    // 选择预览模版
    changeTemp = (temp) => {
        const { tempList } = this.props;
        tempList.map(item => {
            if (item.templateNo === temp) {
                this.setState({
                    tempCon: item.content
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { LANG } = this.props.state;
        const { content, tempList = [], eventList = [], eventSourceList = [] } = this.props;
        const { selectVal } = this.state;
        console.log('this.props', this.props);
        const list = [
            {
                id: 'HOLDER',
                key: 'HOLDER',
                value: LANG.policy_holder_name || '投保人'
            },
            {
                id: 'INSURANT',
                key: 'INSURANT',
                value: LANG.insurant_text || '被保人'
            }
        ];
        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 6 },
        };
        const buttonItemLayout = {
            wrapperCol: { offset: 9 },
        };
        const formWith = 220;
        let event, source;
        if (content.eventName) {
            eventList.map(item => {
                if (item.eventName === content.eventName) event = item.eventCode;
            });
        }
        if (content.sourceName) {
            eventSourceList.map(item => {
                if (item.sourceName === content.sourceName) source = item.sourceCode;
            });
        }
        // 处理收件人、抄送人
        let RECEIVER = [];
        let CCMAIL = [];
        content.receiverRespList && content.receiverRespList.map(item => {
            if (item.receiverType === 'RECEIVER') {
                if (item.receiverValue) {
                    RECEIVER.push(item.receiverValue);
                } else {
                    RECEIVER.push(item.receiverPersonType);
                }
            }
            if (item.receiverType === 'CCMAIL') {
                if (item.receiverPersonType) {
                    CCMAIL.push(item.receiverPersonType);
                } else {
                    CCMAIL.push(item.receiverValue);
                }
            }
        });
        const MessageType = [
            {
                id: 'SMS',
                value: LANG.text_sms || '短信'
            },
            {
                id: 'EMAIL',
                value: LANG.text_email || '邮件'
            }
        ];
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem label={LANG.notify_event_source || '事件来源'} {...formItemLayout}>
                        {getFieldDecorator('sourceCode', {
                            rules: [{ required: true, message: LANG.text_select || '请选择' }],
                            initialValue: source
                        })(
                            <SelectDom list={eventSourceList} onChange={(code) => { this.getEvent(code); }} idKey='sourceCode' valueKey='sourceName' style={{ width: formWith }} />
                        )}
                    </FormItem>
                    <FormItem label={LANG.notify_business_event || '事件'} {...formItemLayout}>
                        {getFieldDecorator('eventCode', {
                            rules: [{ required: true, message: LANG.text_select || '请选择' }],
                            initialValue: event
                        })(
                            <SelectDom list={eventList} idKey='eventCode' valueKey='eventName' style={{ width: formWith }} />
                        )}
                    </FormItem>
                    <FormItem label={LANG.notify_method_informe || '通知方式'} {...formItemLayout}>
                        {getFieldDecorator('messageType', {
                            rules: [{ required: true, message: LANG.text_select || '请选择' }],
                            initialValue: selectVal
                        })(
                            <SelectDom list={MessageType} idKey="id" valueKey="value" onChange={this.handleChange} style={{ width: formWith }} />
                        )}
                    </FormItem>
                    <FormItem label={LANG.notify_recipient || '收件人'} {...formItemLayout}>
                        {getFieldDecorator('receiver', {
                            rules: [{ required: true, message: LANG.text_select || '请选择' }],
                            initialValue: RECEIVER
                        })(
                            <SelectDom mode='tags' list={list} style={{ width: formWith }} idKey="id" valueKey="value" />
                        )}
                    </FormItem>
                    {
                        (selectVal === 'EMAIL') ? (
                            <FormItem label={LANG.notify_ccMails || '抄送人'} {...formItemLayout}>
                                {getFieldDecorator('ccMails', {
                                    rules: [{ required: false, message: LANG.text_select || '请选择' }],
                                    initialValue: CCMAIL
                                })(
                                    <SelectDom mode='tags' list={list} style={{ width: formWith }} idKey="id" valueKey="value" />
                                )}
                            </FormItem>
                        ) : ''
                    }
                    <FormItem label={LANG.notify_template || '模版'} {...formItemLayout}>
                        {getFieldDecorator('templateNo', {
                            rules: [{ required: true, message: LANG.text_select || '请选择' }],
                            initialValue: content.templateNo
                        })(
                            <SelectDom onChange={this.changeTemp} list={tempList} idKey='templateNo' valueKey='templateName' style={{ width: formWith }} />
                        )}
                    </FormItem>
                    {
                        (selectVal === 'SMS') ? (
                            <FormItem
                                label={LANG.notify_sign || '签名ID'}
                                {...formItemLayout}
                            >
                                {getFieldDecorator('messageSign', {
                                    rules: [{ required: true, message: LANG.text_input || '请输入' }],
                                    initialValue: content.messageSign
                                })(
                                    <Input placeholder={LANG.text_input || '请输入'} style={{ width: formWith }} />
                                )}
                            </FormItem>
                        ) : ''
                    }
                    <FormItem {...buttonItemLayout}>
                        <Button type='primary' htmlType='submit'>{LANG.btn_save || '保存'}</Button>
                        <Button style={{ marginLeft: 30 }} onClick={() => { this.props.close(); }
                        }>{LANG.text_back || '返回'}</Button>
                    </FormItem>
                </Form>
                <div className='tempCon' dangerouslySetInnerHTML={{ __html: this.state.tempCon }} />
            </div>
        );
    }
}

App.propTypes = mapPropTypes;
App.contextTypes = {
    'router': PropTypes.object
};

export default Form.create()(App);
