import React from 'react'
import ReactDOM from 'react-dom'
import SelectDom from '../../component/SelectDom';
import mirror, { actions, connect } from 'mirrorx'
import { Row, Col, Button, Input, Form, Select, Table, Icon, Tabs, Modal, Checkbox } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const featureObj = {
    BUTTON: window.LangMessage.buttonText || '按钮',
    FIELD: window.LangMessage.fieldText || '字段',
    LABLE: window.LangMessage.labelText || '标签',
    URL: window.LangMessage.linkText || '链接'
}

mirror.model({
    name: 'systemPermissionFeature',
    initialState: {

    },
    reducers: {

    },
    effects: {

    }
})
class PermissionFeature extends React.Component {
    super(props) {
        this.props = props;
    }
    state = {
        btnVisible: false,
        modalData: {},
        //isShowSaveFieldBtn: false,
        fieldData: []
    }
    //查看弹框
    btnShowModal = (data) => {
        this.setState({
            btnVisible: true,
            modalData: data
        });
    }
    btnHandleCancel = (e) => {
        this.setState({
            btnVisible: false,
        });
    }
    // 保存字段的读写
    handleSubmitField = (data) => {
        const parentResourceId = T.urlQuery('resourceId');
        // 字段的数据resourceMap['FIELD']
        const priviledges = this.formatFieldData(data);
        T.fetch({
            url: 'resource/savePriviledge',
            data: {
                "priviledges": priviledges
            }
        }).then(res => {
            if (res && res.success) {
                T.showSuccess(window.LangMessage.save_success || '保存成功');
                actions.treeDom.getResourceDetail({ resourceId: parentResourceId });
            }
        })

    }
    // 格式化checkbox-group数据，作为入参
    formatFieldData = (data) => {
        const fieldData = this.state.fieldData;
        const arr = [];
        data.map((item, index) => {
            if (fieldData.indexOf(+item.resourceId) >= 0 ) {
                arr.push({
                    priviledgeName: item.priviledges[0].priviledgeName,
                    resourceId: +item.resourceId,
                    resourceExtendValue: null,
                    operateType: 'WRITE',
                    resourceType: 'BUSINESS_DATA'
                })
            }
            else {
                arr.push({
                    priviledgeName: item.priviledges[0].priviledgeName,
                    resourceId: +item.resourceId,
                    resourceExtendValue: null,
                    operateType: 'READ',
                    resourceType: 'BUSINESS_DATA'
                })
            }
        })
        return arr;
    }
    changeFieldCheck = (checkedValues) => {
        // checkedValues格式为["read", 14006, 14004, 10997]
        this.setState({
            //isShowSaveFieldBtn: checkedValues.length > 1 ? true : false,
            fieldData: checkedValues.slice(1)
        });
    }
    // 渲染功能权限dom
    renderFeature = (resourceMap) => {
        const { getFieldDecorator } = this.props.form;
        const defaultValue = ['read'];
        if (resourceMap && resourceMap['FIELD']) {
            
            resourceMap['FIELD'].map((item,index) => {
                if (item.priviledges &&  item.priviledges.length > 0 && item.priviledges[0].operateType === 'WRITE') {
                    defaultValue.push(item.resourceId);
                }
            })
        }
        return ['BUTTON', 'URL', 'LABLE', 'FIELD'].map((featureItem, featureIndex) => {
            return (
                <Col span={6} key={featureIndex}>
                    <div className="feature-content">
                        <span className="title-hint">{featureObj[featureItem]}</span>
                        <div className="btn-feature mt30 pb10">
                            {
                                resourceMap && resourceMap[featureItem] && featureItem !== 'FIELD' &&
                                resourceMap[featureItem].map((item, index) =>
                                    item.priviledges && item.priviledges[0] &&

                                    (
                                        item.resourceType === featureItem &&
                                        <div className="featCon" key={featureIndex + index}>
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
                                        </div>
                                    )
                                )
                            }
                            {
                                resourceMap && resourceMap[featureItem] && featureItem === 'FIELD' &&
                                <div className="featCon">
                                    <CheckboxGroup defaultValue={defaultValue} onChange={this.changeFieldCheck}>
                                        <Row>

                                            {
                                                resourceMap[featureItem].map((item, index) =>
                                                    item.priviledges && item.priviledges[0] && 

                                                    (
                                                        item.resourceType === featureItem &&
                                                        <span key={featureIndex + index}>
                                                            <Col span={12}><span onClick={() => this.btnShowModal(item)}>
                                                                <b>A</b>
                                                                <span className={"featFont feat" + featureItem}>{item.resourceName}</span>
                                                            </span>
                                                            </Col>
                                                            <Col span={6}><Checkbox disabled value="read">
                                                            {window.LangMessage.read || '读'}</Checkbox></Col>
                                                            <Col span={6}><Checkbox value={item.resourceId}>
                                                            {window.LangMessage.write || '写'}</Checkbox></Col>
                                                        </span>
                                                    )
                                                )
                                            }
                                        </Row>
                                    </CheckboxGroup>
                                    <Button htmlType="submit" type="primary"  className="system-btn product-save-btn" onClick={() => this.handleSubmitField(resourceMap[featureItem])}>
                                    {window.LangMessage.save || '保存'}</Button>

                                </div>
                            }
                        </div>
                    </div>
                </Col>
            )
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;

        const { resourceMap } = this.props || {};
        const { resourceType, resourceName, resourceCode, url } = this.state.modalData;
        return (
            <div>
                {/* 功能资源4个卡片(按钮||链接||标签页||字段) */}
                <div className="main-feature pr20 pl20 pt20 pb30">
                    <Row gutter={16} >
                        {this.renderFeature(resourceMap)}
                    </Row>
                </div>
                <Modal
                    wrapClassName="vertical-center-modal"
                    title={window.LangMessage.resource_information || "资源信息"}
                    footer={null}
                    visible={this.state.btnVisible}
                    onCancel={this.btnHandleCancel}
                    className = "permission-feature-modal"
                >
                    <Form className="person-form">
                        <Row className="mt15" type="flex" justify="start">
                            <Col span={24}>
                                <FormItem
                                    label={window.LangMessage.resource_type || "资源类型"}
                                    labelCol={{ span: 9 }}
                                    wrapperCol={{ span: 11 }}
                                >
                                    <span>{resourceType}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="mt15" type="flex" justify="start">
                            <Col span={24}>
                                <FormItem
                                    label={window.LangMessage.resource_name || "资源名称"}
                                    labelCol={{ span: 9 }}
                                    wrapperCol={{ span: 11 }}
                                >
                                    <span>{resourceName}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="mt15" type="flex" justify="start">
                            <Col span={24}>
                                <FormItem
                                    label={window.LangMessage.resource_code || "资源编码"}
                                    labelCol={{ span: 9 }}
                                    wrapperCol={{ span: 11 }}
                                >
                                    <span>{resourceCode}</span>
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
                                            wrapperCol={{ span: 11 }}
                                        >
                                            <span>{url}</span>
                                        </FormItem>
                                    </Col>
                                </Row>
                            )
                        }
                    </Form>
                </Modal>
            </div>
        );
    }
}
const WrappedPermissionFeature = Form.create()(PermissionFeature);

export default connect(state => {
    return state.systemPermissionFeature
})(WrappedPermissionFeature)