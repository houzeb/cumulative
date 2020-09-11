import React, { Component } from 'react';
import { message, Breadcrumb, Form, Select, Menu, Upload, Input, Dropdown, Button, Tag } from 'antd';
import request from '../../../request';
import { mapPropTypes } from '../../mapProps';
import LzEditor from 'react-lz-editor';
import PropTypes from 'prop-types';
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            upListNew: [],
            upList: [],
            selectVal: 'SMS',
            prompt: []
        };
    }

    componentDidMount() {
        this.loadSelect();
        this.props2State();
    }

    componentWillReceiveProps(props, newProps) {
        console.log('props', props);
        console.log('newProps', newProps);
        // if (props !== newProps) {
        // this.props2State(newProps);
        // }
    }

    props2State = (newProps) => {
        const { selectVal } = newProps || this.props;
        this.setState({ selectVal });
    }

    handleChange = (selectVal) => {
        console.log('change', selectVal);
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

    // 上传附件
    uploadFile = ({ key }) => {
        let list = this.state.upListNew;
        if (key === 'ELECTRONIC_POLICY') {
            list.push({
                attachmentType: 'ELECTRONIC_POLICY',
                name: '电子保单'
            });
            this.setState({
                upListNew: list
            });
        } else if (key === 'ELECTRONIC_INVOICE') {
            list.push({
                attachmentType: 'ELECTRONIC_INVOICE',
                name: '电子发票'
            });
            this.setState({
                upListNew: list
            });
        }
    }

    // 删除
    deleteList = (type, index) => {
        if (type === 'old') {
            let { upList } = this.props;
            upList.splice(index, 1);
            this.setState({ upList });
        } else if (type === 'new') {
            let { upListNew } = this.state;
            upListNew.splice(index, 1);
            this.setState({
                upListNew: upListNew
            });
        }
    }

    receiver = (html) => {
        // console.log("recieved HTML content", html);
        // 转意符换成普通字符
        let escape2Html = (str) => {
            let arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
            return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, (all, t) => { return arrEntities[t]; });
        };
        this.setState({
            content: escape2Html(html)
        });
    }

    // 保存
    handleSubmit = (e) => {
        e && e.preventDefault();
        const { LANG } = this.props.state;
        this.props.form.validateFields((err, values) => {
            console.log('values', values);
            if (!err) {
                const { con } = this.props;
                let params = Object.assign({}, values, {
                    attachmentRequestDTOList: this.props.upList.concat(this.state.upListNew),
                    content: values.content ? values.content : this.state.content
                });
                if (con.id) {
                    params.id = con.id;
                }
                request.saveTemplate(params).then(res => {
                    if (res.success && res.value) {
                        if (con.id) {
                            message.success(LANG.modify_success || '修改成功');
                        } else {
                            message.success(LANG.add_success || '添加成功');
                        }
                        this.props.closeAndRefresh();
                    }
                });
            }
        });
    }

    render() {
        const { LANG = {} } = this.props.state;
        const { getFieldDecorator } = this.props.form;
        const { selDisable, con = {}, upList = [] } = this.props;
        const { prompt, upListNew, selectVal } = this.state;
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 },
        };
        const buttonItemLayout = {
            wrapperCol: { offset: 3 },
        };
        const upProps = {
            name: 'files',
            // action: '/api/notice/rest/notice/upload/attachments',
            showUploadList: false,
            beforeUpload: (file, fileList) => {
                // console.log('info', info);
                console.log('file', file);
                let fd = new FormData();
                fd.append('files', file);
                request.attachments(fd).then(res => {
                    if (res.success) {
                        message.success(LANG.upload_success || '上传成功');
                        let file = res.value;
                        let list = this.state.upListNew;
                        console.log(list);
                        file.map(item => {
                            list.push({
                                attachmentType: 'MANUAL_UPLOAD',
                                attachmentValue: item.fileID,
                                name: item.fileName
                            });
                        });
                        this.setState({
                            upListNew: list
                        });
                    }
                });
                return false;
                // if (info.file.status !== 'uploading' && info.file.response.success) {
                //     // console.log(info.file, info.fileList);
                //     let file = info.file.response.value;
                //     let list = this.state.upListNew;
                //     console.log(list);
                //     file.map(item => {
                //         list.push({
                //             attachmentType: 'MANUAL_UPLOAD',
                //             attachmentValue: item.fileID,
                //             name: item.fileName
                //         });
                //     });
                //     this.setState({
                //         upListNew: list
                //     });
                // }
                // if (info.file.status === 'done') {
                //     message.success(`${info.file.name} ${LANG.upload_success}`);
                // } else if (info.file.status === 'error') {
                //     message.error(`${info.file.name} ${LANG.upload_failed}`);
                // }
            },
        };
        const menu = (
            <Menu onClick={this.insert}>
                {
                    prompt && prompt.map(item => {
                        return <Menu.Item key={item.value}>{item.name}</Menu.Item>;
                    })
                }
            </Menu>
        );
        const uploadMenu = (
            <Menu onClick={this.uploadFile}>
                <Menu.Item key='ELECTRONIC_POLICY'>{LANG.elec_policy || '电子保单'}</Menu.Item>
                <Menu.Item key='ELECTRONIC_INVOICE'>{LANG.elec_invoice || '电子发票'}</Menu.Item>
                <Menu.Item key='MANUAL_UPLOAD'>
                    <Upload {...upProps}>
                        {LANG.artificial_upload || '人工上传'}
                    </Upload>
                </Menu.Item>
            </Menu>
        );
        console.log('selectVal', selectVal);
        return (
            <div>
                <div className='block block-default'>
                    <Form onSubmit={this.handleSubmit} layout='horizontal'>
                        <FormItem
                            label={LANG.temp_name || '模板名称'}
                            {...formItemLayout}
                        >
                            {getFieldDecorator('templateName', {
                                rules: [{ required: true, message: LANG.text_input || '请输入' }],
                                initialValue: con.templateName
                            })(
                                <Input placeholder={LANG.text_input || '请输入'} />
                            )}
                        </FormItem>
                        <FormItem
                            label={LANG.temp_type || '模板类型'}
                            required
                            {...formItemLayout}
                        >
                            {getFieldDecorator('messageType', {
                                initialValue: selectVal
                            })(
                                <Select onChange={this.handleChange} disabled={selDisable}>
                                    {
                                        [{
                                            id: 'SMS',
                                            value: LANG.text_sms || '短信'
                                        },
                                        {
                                            id: 'EMAIL',
                                            value: LANG.text_email || '邮件'
                                        }].map(item => {
                                            return <Option value={item.id} key={item.id}>{item.value}</Option>;
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        {
                            (selectVal === 'SMS')
                                ? <FormItem
                                    label={LANG.notify_SMS_content || '短信内容'}
                                    {...formItemLayout}
                                    wrapperCol={{ span: 18 }}
                                >
                                    {getFieldDecorator('content', {
                                        rules: [{ required: true, message: LANG.text_input || '请输入' }],
                                        initialValue: con.content
                                    })(
                                        <TextArea rows={8} placeholder={LANG.text_input || '请输入'} />
                                    )}
                                </FormItem>
                                : <div>
                                    <FormItem
                                        label={LANG.notify_email_subject || '邮件主题'}
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator('title', {
                                            rules: [{ required: true, message: LANG.text_input || '请输入' }],
                                            initialValue: con.title
                                        })(
                                            <Input placeholder={LANG.text_input || '请输入'} />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        label={LANG.notify_email_attachment || '邮件附件'}
                                        {...formItemLayout}
                                        wrapperCol={{ span: 18 }}
                                    >
                                        <Dropdown overlay={uploadMenu}>
                                            <Button style={{ marginRight: 20 }} icon='plus'>{LANG.text_add || '添加'}</Button>
                                        </Dropdown>
                                        {
                                            upList.map((item, index) => {
                                                return <Tag closable key={index} afterClose={() => { this.deleteList('old', index); }}>{item.name}</Tag>;
                                            })
                                        }
                                        {
                                            upListNew.map((item, index) => {
                                                return <Tag closable key={index} afterClose={() => { this.deleteList('new', index); }}>{item.name}</Tag>;
                                            })
                                        }
                                    </FormItem>
                                    <FormItem
                                        label={LANG.notify_email_content || '邮件正文'}
                                        {...formItemLayout}
                                        required
                                        wrapperCol={{ span: 18 }}
                                    >
                                        <Dropdown overlay={menu} placement='topLeft' trigger={['contextMenu']}>
                                            <div style={{ userSelect: 'none' }}>
                                                <LzEditor
                                                    active
                                                    importContent={con.content || ''}
                                                    cbReceiver={this.receiver}
                                                    image={false}
                                                    video={false}
                                                    audio={false}
                                                // uploadProps={uploadProps}
                                                // LANG='en'
                                                />
                                            </div>
                                        </Dropdown>
                                    </FormItem>
                                </div>
                        }
                        <FormItem {...buttonItemLayout}>
                            <Button type='primary' htmlType='submit'>{LANG.btn_save || '保存'}</Button>
                            <Button style={{ marginLeft: 30 }} onClick={() => { this.props.close(); }}>{LANG.text_back || '返回'}</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

App.propTypes = mapPropTypes;
App.contextTypes = {
    'router': PropTypes.object
};

export default Form.create()(App);
