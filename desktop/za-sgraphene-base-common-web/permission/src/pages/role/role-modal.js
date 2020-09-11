import React from 'react'
import ReactDOM from 'react-dom'
import SelectDom from '../../component/SelectDom';
import RolePermissionSet from './role-permission-set';
import mirror, { actions, connect } from 'mirrorx'
import { Row, Col, Button, Input, Form, Select, Table, Icon, Tabs, Modal, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

mirror.model({
    name: 'systemRoleModal',
    initialState: {
    },
    reducers: {
    },
    effects: {
    }
})
class RoleModal extends React.Component {
    super(props) {
        this.props = props;
    }
    state = {
    }

    componentWillReceiveProps(next) {
        // console.log(next);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        // const validateItem = ['roleName']
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { roleAction } = this.props
                const url = '/user/saveRole'
                let data = {
                    roleName: values.roleName,
                }
                if (roleAction == 'create') {
                    data = {
                        roleName: values.roleName,
                        roleCode: values.roleCode,
                        privilegeIds: this.props.rolePriviledges
                    }
                }
                if (roleAction == 'edit') {
                    data = {
                        roleId: this.props.roleId,
                        roleName: values.roleName,
                        roleCode: values.roleCode,
                        privilegeIds: this.props.rolePriviledges
                    }
                }
                if (roleAction == 'copy') {
                    data = {
                        roleName: values.roleName,
                        roleCode: values.roleCode,
                        privilegeIds: this.props.rolePriviledges
                    }
                }
                T.fetch({
                    url: url,
                    data: data
                }).then(res => {
                    if (res.success) {
                        message.success(window.LangMessage.perform_success || '操作成功')
                        this.props.form.resetFields(['roleName', 'roleCode'])
                        actions.systemRoleManage.roleAction('close')
                        this.props.freshTable()
                    }
                })
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const saveBtnShow = (this.props.roleAction == 'create' || this.props.roleAction == 'edit' || this.props.roleAction == 'copy') || false
        return (
            <Form className="" onSubmit={this.handleSubmit}>
                <Row className="mt15 mb10" type="flex" justify="start">
                    <Col span={12}>
                        <FormItem
                            label={window.LangMessage.character_name || "角色名称"}
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}
                        >
                            {getFieldDecorator('roleName', {
                                initialValue: this.props.roleName,
                                rules: [{
                                    required: true,
                                    message: '请输入角色名称',
                                }],
                            })(
                                <Input maxLength="45" className="system-input " disabled={this.props.roleAction == 'view'} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label={window.LangMessage.character_code || "角色代码"}
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}
                        >
                            {getFieldDecorator('roleCode', {
                                initialValue: this.props.roleCode,
                                rules: [{
                                    required: true,
                                    message: '请输入角色代码',
                                }],
                            })(
                                <Input maxLength="45" className="system-input " disabled={this.props.roleAction == 'view'} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row className="mt15 mb10" type="flex" justify="end">
                    <Col span={24}>
                        <FormItem
                            label={window.LangMessage.purview_setting || "权限设置"}
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 20 }}>
                            <RolePermissionSet status={this.props.roleAction} />
                        </FormItem>
                    </Col>
                </Row>
                <div className={saveBtnShow ? '' : 'hidden'}>
                    <Row className="mt10 mb15" type="flex" justify="center">
                        <Col>
                            {<Button htmlType="submit" type="primary" className="system-btn" htmlType="submit">
                                {window.LangMessage.save || '保存'}</Button>}
                        </Col>
                    </Row>
                </div>
            </Form>
        )
    }
}
const WrappedRoleModal = Form.create()(RoleModal);

export default connect(state => {
    return {
        ...state.systemRoleModal,
        ...{
            roleAction: state.systemRoleManage.roleAction,
            roleName: state.systemRoleManage.roleName,
            roleId: state.systemRoleManage.roleId,
            rolePriviledges: state.systemRoleManage.rolePriviledges
        }
    }
})(WrappedRoleModal)