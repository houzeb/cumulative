/**
 * author: xielingjuan@zhongan.Icon
 * description: 资源管理-功能资源
 * date: 2017/11/26
 */

import React from 'react'
import ReactDOM from 'react-dom'
import mirror, { actions, connect } from 'mirrorx'
import { Row, Col, Button, Input, Form, Select, Table, Icon, Tabs, Modal, Checkbox } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

const featureObj = {
    BUTTON: window.LangMessage.buttonText || '按钮',
    FIELD: window.LangMessage.fieldText || '字段',
    LABLE: window.LangMessage.labelText || '标签',
    URL: window.LangMessage.linkText || '链接'
}
mirror.model({
    name: 'systemFeatureResource',
    initialState: {

    },
    reducers: {

    },
    effects: {

    }
})
class FeatureResource extends React.Component {
    super(props) {
        this.props = props;
    }
    state = {
        btnVisible: false,
        modalData: {}
    }
    // 打开弹窗，编辑功能资源
    btnShowModal = (data) => {
        this.setState({
            btnVisible: true,
            modalData: data
        });
    }
    // 编辑功能资源
    btnHandleOk = (e) => {
        this.setState({
            btnVisible: false,
        });
    }
    // 取消编辑
    btnHandleCancel = (e) => {
        this.props.form.resetFields();
        this.setState({
            btnVisible: false,
        });
    }
    deleteResource = (data) => {
        const parentResourceId = +T.urlQuery('resourceId');
        confirm({
            title: window.LangMessage.determine_delete_resource || '确定删除该资源？',
            content: window.LangMessage.delete_tip || '删除后无法恢复',
            okText: window.LangMessage.ok_text || '确定',
            cancelText: window.LangMessage.cancle_text || '取消',
            onOk: () => {
                T.fetch({
                    url: '/resource/deleteResource',
                    data: {
                        resourceId: data.resourceId || null
                    }
                }).then(res => {
                    if (res && res.success) {
                        T.showSuccess(window.LangMessage.delete_success || '删除成功');
                        actions.treeDom.getResourceDetail({ resourceId: parentResourceId });
                        setTimeout(() => {
                            this.btnHandleCancel();
                        }, 800);
                    }
                })
            }
        })
    }
    // 提交功能资源
    handleSubmit = (e) => {
        e.preventDefault();
        const modalData = this.state.modalData;
        const resourceId = modalData.resourceId;
        const parentResourceId = +T.urlQuery('resourceId');


        this.props.form.validateFields((err, values) => {

            if (values.resourceType === 'FIELD' && err && err.url) {
                delete err.url;
                err = Object.keys(err).length === 0 ? false : true;
            }
            if (!err) {
                T.fetch({
                    url: 'resource/saveResource',
                    data: {
                        ...values,
                        parentResourceId: parentResourceId,
                        resourceId: resourceId || null
                    }
                }).then(res => {
                    if (res && res.success) {
                        T.showSuccess(window.LangMessage.save_success || '保存成功');
                        actions.treeDom.getResourceDetail({ resourceId: parentResourceId });
                        setTimeout(() => {
                            this.btnHandleCancel();
                        }, 800);
                    }
                })
            }
        });
    }
    // 渲染功能资源dom
    renderFeature = (resourceMap) => {

        return ['BUTTON', 'URL', 'LABLE', 'FIELD'].map((featureItem, index) => {
            return (
                <Col span={6} key={index}>
                    <div className="feature-content">
                        <span className="title-hint">{featureObj[featureItem]}</span>
                        <div className="btn-feature mt30 pb10">
                            {
                                resourceMap && resourceMap[featureItem] &&
                                resourceMap[featureItem].map((item, index) =>
                                    item.resourceType === featureItem &&
                                    <div className="featCon" key={item.resourceId}>
                                        {/* 这里的dom结构后续优化下，不用一个一个判断类型 */}
                                        {featureItem === 'BUTTON' &&
                                            <Button className={"featFont feat" + featureItem} onClick={() => this.btnShowModal(item)}>{item.resourceName}</Button>
                                        }
                                        {featureItem === 'URL' &&
                                            <div className={"featFont feat" + featureItem} onClick={() => this.btnShowModal(item)}>{item.resourceName}</div>
                                        }
                                        {featureItem === 'LABLE' &&
                                            <span className={"featFont feat" + featureItem} onClick={() => this.btnShowModal(item)}>{item.resourceName}</span>
                                        }
                                        {featureItem === 'FIELD' &&
                                            <span onClick={() => this.btnShowModal(item)}>
                                                <b>A</b>
                                                <span className={"featFont feat" + featureItem}>{item.resourceName}</span>
                                            </span>
                                        }

                                        <i onClick={() => this.deleteResource(item)}>×</i>
                                    </div>
                                )
                            }
                            <div className="featCon" onClick={() => this.btnShowModal({ resourceType: featureItem })}><Button className="addButton mt5">+</Button></div>
                        </div>
                    </div>
                </Col>
            )
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { resourceMap } = this.props;
        const { resourceType, resourceName, resourceCode, url } = this.state.modalData;
        // 功能资源类型，接口提供之后从接口获取，不在前端写死。
        const resourceTypeList = [
            { id: 'BUTTON', value: window.LangMessage.buttonText || '按钮' },
            { id: 'URL', value: window.LangMessage.linkText || '链接' },
            { id: 'LABLE', value: window.LangMessage.tabText || '标签页' },
            { id: 'FIELD', value: window.LangMessage.fieldText || '字段' },
        ]
        return (
            <div>
                {/* 功能资源4个卡片(按钮||链接||标签页||字段) */}
                <div className="main-feature pr20 pl20 pt20 pb30">
                    <Row gutter={16} >
                        {this.renderFeature(resourceMap)}
                    </Row>
                </div>
                {/* 点击各功能资源的弹窗 */}
                <Modal
                    wrapClassName="vertical-center-modal"
                    title={window.LangMessage.resource_information || "资源信息"}
                    footer={null}
                    visible={this.state.btnVisible}
                    onOk={this.btnHandleOk}
                    onCancel={this.btnHandleCancel}
                >
                    <Form className="person-form" onSubmit={this.handleSubmit}>
                        <Row className="mt15" type="flex" justify="start">
                            <Col span={24}>
                                <FormItem
                                    label={window.LangMessage.resource_type || "资源类型"}
                                    labelCol={{ span: 9 }}
                                    wrapperCol={{ span: 13 }}
                                    >
                                    {getFieldDecorator('resourceType', {
                                        initialValue: resourceType
                                    })(
                                        <Input maxLength="45" className="system-input " disabled />
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="mt15" type="flex" justify="start">
                            <Col span={24}>
                                <FormItem
                                    label={window.LangMessage.resource_name || "资源名称"}
                                    labelCol={{ span: 9 }}
                                    wrapperCol={{ span: 13 }}
                                    >
                                    {getFieldDecorator('resourceName', {
                                        initialValue: resourceName,
                                        rules: [{
                                            required: true, 
                                            message: '请输入资源名称',
                                        }],
                                    })(
                                        <Input maxLength="45" placeholder='请输入资源名称' className="system-input " />
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="mt15" type="flex" justify="start">
                            <Col span={24}>
                                <FormItem
                                    label={window.LangMessage.resource_code || "资源编码"}
                                    labelCol={{ span: 9 }}
                                    wrapperCol={{ span: 13 }}
                                >
                                    {getFieldDecorator('resourceCode', {
                                        initialValue: resourceCode,
                                        rules: [{
                                            required: true, 
                                            message: '请输入资源编码',
                                        }],
                                    })(
                                        <Input maxLength="45" placeholder='请输入资源编码' className="system-input " />
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        {
                            resourceType !== 'FIELD' && (
                                <Row className="mt15" type="flex" justify="start">
                                    <Col span={24}>
                                        <FormItem
                                            label="URL"
                                            labelCol={{ span: 9 }}
                                            wrapperCol={{ span: 13 }}
                                        >
                                            {getFieldDecorator('url', {
                                                initialValue: url,
                                                rules: [{
                                                    required: true, 
                                                    message: '请输入URL',
                                                }],
                                            })(
                                                <Input maxLength="45" placeholder='请输入URL' className="system-input " />
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            )
                        }
                        <Row className="mt25 mb10" type="flex" justify="center">
                            <Col>
                                {<Button htmlType="submit" type="primary" className="system-btn product-save-btn">
                                {window.LangMessage.save || '保存'}</Button>}
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
}
const WrappedFeatureResource = Form.create()(FeatureResource);

export default connect(state => {
    return state.systemFeatureResource
})(WrappedFeatureResource)