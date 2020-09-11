import React from 'react'
import ReactDOM from 'react-dom'
import SelectDom from '../../component/SelectDom';
import RolePermissionSet from './role-permission-set';
import RoleModal from './role-modal';
import mirror, { actions, connect } from 'mirrorx'
import { Row, Col, Button, Input, Form, Select, Table, Icon, Tabs, Modal, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

mirror.model({
    name: 'systemRoleManage',
    initialState: {
        roleAction: null,
        roleModalVisible: false,
        roleName: null,
        roleCode: null,
        roleId: null,
        roleDetail: {},
        rolePriviledges: [],
    },
    reducers: {
        setRoleAction(state, data) {
            return Object.assign({}, state, { roleAction: data });
        },
        setRoleModal(state, data) {
            return Object.assign({}, state, { roleModalVisible: data });
        },
        setRoleName(state, data) {
            return Object.assign({}, state, { roleName: data });
        },
        setRoleCode(state, data) {
            return Object.assign({}, state, { roleCode: data });
        },
        setRoleId(state, data) {
            return Object.assign({}, state, { roleId: data });
        },
        setRoleDetail(state, data) {
            return Object.assign({}, state, { roleDetail: data })
        },
        setRolePriviledges(state, data) {
            return Object.assign({}, state, { rolePriviledges: data })
        }
    },
    effects: {
        roleAction(action) {
            switch (action) {
                case 'view':
                    actions.systemRoleManage.setRoleAction('view')
                    actions.systemRoleManage.setRoleModal(true)
                    break
                case 'create':
                    actions.systemRoleManage.setRoleAction('create')
                    actions.systemRoleManage.setRoleModal(true)
                    break
                case 'edit':
                    actions.systemRoleManage.setRoleAction('edit')
                    actions.systemRoleManage.setRoleModal(true)
                    break
                case 'copy':
                    actions.systemRoleManage.setRoleAction('copy')
                    actions.systemRoleManage.setRoleModal(true)
                    break
                case 'cancel':
                    actions.systemRoleManage.setRoleModal(false)
                    break
                case 'close':
                    actions.systemRoleManage.setRoleModal(false)
                    break
            }
        },
        setRoleInfo(info) {
            actions.systemRoleManage.setRoleName(info.roleName)
            actions.systemRoleManage.setRoleCode(info.roleCode)
            actions.systemRoleManage.setRoleId(info.roleId)
        },
    }
})
class RoleManage extends React.Component {
    super(props) {
        this.props = props;
    }
    state = {
        tableData: [],
        pageSize: 10,
        pageIndex: 1,
        total: 0,
        addVisible: false,
        viewVisible: false,
        editVisible: false,
        copyVisible: false,
        modalTitle: null,
        condition: {}, // 查询条件
    }

    componentDidMount = () => {
        // this.getResourceTree();
        // T.urlQuery("edit")
        console.log('哈哈')
        this.queryTable()
    }
    //新增弹框
    addShowModal = () => {
        actions.systemRoleManage.roleAction('create')
        actions.systemRoleManage.setRoleInfo({
            roleName: null,
            roleCode: null,
            roleId: null,
        })
        actions.systemRoleManage.setRoleDetail({})
        actions.systemRoleManage.setRolePriviledges([])
        this.setState({
            modalTitle: window.LangMessage.create_role || '创建角色',
        });
    }
    addHandleOk = (e) => {
        this.setState({
            addVisible: false,
        });
    }
    addHandleCancel = (e) => {
        this.setState({
            addVisible: false,
        });
    }
    //查看弹框
    viewShowModal = (record) => {
        actions.systemRoleManage.roleAction('view')
        this.setState({
            modalTitle: window.LangMessage.check_role || '查看角色',
        });
        actions.systemRoleManage.setRoleInfo({
            roleName: record.role.roleName,
            roleCode: record.role.roleCode,
            roleId: record.role.roleId,
        })
        this.queryRole(record.role.roleId)
    }
    viewHandleOk = (e) => {
        this.setState({
            viewVisible: false,
        });
        actions.routing.replace({
            search: ''
        });
    }
    viewHandleCancel = (e) => {
        actions.systemRoleManage.roleAction('cancel');
        actions.systemRoleManage.setRoleInfo({
            roleName: '',
            roleCode: '',
            // roleId: null,
        })
        this.roleModal.props.form.resetFields(['roleName', 'roleCode']);
        actions.systemRoleManage.setRolePriviledges([]);
        actions.routing.replace({
            search: ''
        });

    }
    //编辑
    editShowModal = (record) => {
        console.log('1212121')
        actions.systemRoleManage.roleAction('edit')
        this.setState({
            modalTitle: window.LangMessage.edit_role || '编辑角色',
        });
        actions.systemRoleManage.setRoleInfo({
            roleName: record.role.roleName,
            roleCode: record.role.roleCode,
            roleId: record.role.roleId,
        })
        this.queryRole(record.role.roleId)
    }
    editHandleOk = (e) => {
        this.setState({
            editVisible: false,
        });
        this.roleModal.props.form.resetFields(['roleName', 'roleCode'])
    }
    editHandleCancel = (e) => {
        this.setState({
            editVisible: false,
        });
        actions.systemRoleManage.setRolePriviledges([])
    }
    //复制
    copyShowModal = (record) => {
        actions.systemRoleManage.roleAction('copy')
        this.setState({
            modalTitle: window.LangMessage.copy_role || '复制角色',
        });
        // actions.systemRoleManage.setRoleInfo({
        //     roleName: record.role.roleName,
        //     roleId: record.role.roleId,
        // })
        this.queryRole(record.role.roleId)
    }
    copyHandleOk = (e) => {
        this.setState({
            copyVisible: false,
        });
    }
    copyHandleCancel = (e) => {
        this.setState({
            copyVisible: false,
        });
    }

    handlePageChange = (page, pageSize) => {
        this.setState({
            pageIndex: page
        }, this.queryTable)
    }

    queryTable = () => {
        const data = {
            roleName: this.state.condition.roleName,
            roleCode: this.state.condition.roleCode,
            pageIndex: this.state.pageIndex,
            pageSize: this.state.pageSize,
        }
        T.fetch({
            url: '/user/queryRoles',
            data: data
        }).then(res => {
            if (res.success) {
                let tableData = this.formatTable(res.value.results)
                this.setState({
                    tableData: tableData,
                    total: res.value.total
                })
            }
        })
    }

    formatTable = (list) => {
        list.forEach((item, index) => {
            item.role.index = this.state.pageSize * (this.state.pageIndex - 1) + index + 1
            Object.assign(item, { ...item.role })
        })
        return list
    }

    // 查询角色详情
    queryRole = (roleId) => {
        const data = {
            queryPriviledges: true,
            roleId: roleId
        }
        T.fetch({
            url: '/user/queryRoles',
            data: data
        }).then(res => {
            if (res.success) {
                actions.systemRoleManage.setRoleDetail(res.value.results[0])
                const rolePriviledges = res.value.results[0].priviledges
                let tempPriviledges = []
                rolePriviledges.forEach((item, index) => {
                    tempPriviledges.push(item.priviledgeId)
                })
                actions.systemRoleManage.setRolePriviledges(tempPriviledges)
            }
        })
    }

    //删除角色
    deleteRole = (record) => {
        confirm({
            title: window.LangMessage.confirm_delete_now || '确认删除所选项?',
            content: window.LangMessage.delete_no_back || '删除后数据将无法还原',
            okText: window.LangMessage.ok_text || '确定',
            cancelText: window.LangMessage.exit_text || '退出',
            onOk: () => {
                T.fetch({
                    url: '/user/saveRole',
                    data: {
                        roleId: record.role.roleId,
                        deleteRole: true
                    },
                    method: 'post'
                }).then((res) => {
                    if (res.success) {
                        message.success(window.LangMessage.delete_success || '删除成功', 1)
                        this.props.form.resetFields(['roleName'])
                        T.fetch({
                            url: '/user/queryRoles',
                            data: {
                                pageIndex: this.state.pageIndex,
                                pageSize: this.state.pageSize,
                            }
                        }).then(res => {
                            if (res.success) {
                                // this.setState({
                                //     tableData: res.value.results
                                // })
                                this.setState({
                                    pageIndex: 1
                                }, this.queryTable)
                            }
                        })
                    }
                });
            },
            onCancel() { },
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const validateItem = ['searchRoleName', 'searchRoleCode']
        this.props.form.validateFields(validateItem, (err, values) => {
            if (!err) {
                // const data = {
                //     roleName: values.roleName,
                //     pageIndex: this.state.pageIndex,
                //     pageSize: this.state.pageSize,
                // }
                // console.log('Received values of form: ', values);
                // T.fetch({
                //     url: '/user/queryRoles',
                //     data: data
                // }).then(res => {
                //     if (res.success) {
                //         if (res.value && res.value.results) {
                //             this.formatTable(res.value.results)
                //             this.setState({
                //                 // tableData: res.value.results,
                //                 total: res.value.total
                //             })
                //         }
                //     }
                // })
                // console.log(values);
                this.setState({
                    condition: {
                        roleName: values.searchRoleName,
                        roleCode: values.searchRoleCode
                    }
                }, this.queryTable)
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const columns = [{
            title: window.LangMessage.text_index || 'NO.',
            dataIndex: 'index',
            //   render: (text, record) => record.role.index
        }, {
            title: window.LangMessage.character_name || '角色名称',
            dataIndex: 'roleName',
            //   render: (text, record) => record.role.roleName
        },
        {
            title: window.LangMessage.character_code || '角色编码',
            dataIndex: 'roleCode',
            //   render: (text, record) => record.role.roleName       
        },
        {
            title: window.LangMessage.handle || '操作',
            //   dataIndex: 'delete',
            render: (text, record) => (
                <span>
                    <a href="#" onClick={() => { this.viewShowModal(record) }}>
                        {window.LangMessage.btn_look || '查看'}</a>
                    <span className="ant-divider" />
                    <a onClick={() => { this.editShowModal(record) }} href="#">
                        {window.LangMessage.text_edit || '编辑'}</a>
                    <span className="ant-divider" />
                    <a onClick={() => { this.copyShowModal(record) }} href="#">
                        {window.LangMessage.copy || '复制'}</a>
                    <span className="ant-divider" />
                    <a href="#" onClick={() => { this.deleteRole(record) }}>
                        {window.LangMessage.btn_delete || '删除'}</a>
                </span>
            ),
        }];
        const rowSelection = {
            // selectedRowKeys: 'productId',
        }
        const data = [{
            key: '1',
            name: window.LangMessage.underwriting_commissioner || "核保专员"
        }, {
            key: '2',
            name: window.LangMessage.the_admin || "管理员"
        }]

        const list = [
            { id: 1, value: "UW Level1" },
            { id: 2, value: "UW Level2" },
            { id: 3, value: "UW Level3" }
        ]
        const paginationConfig = {
            onChange: this.handlePageChange,
            total: this.state.total,
            defaultPageSize: this.state.pageSize,
            showQuickJumper: true,
            current: this.state.pageIndex
        }
        return (
            <div>
                <div className="pb15 search-result-back">
                    <div >
                        <span className="mr5 strong">{window.LangMessage.system_settings || '系统设置'}</span>
                        <Icon type="right" />
                        <span className="ml5">{window.LangMessage.role_manage || '角色管理'}</span>
                    </div>
                </div>
                <div className="user-management">
                    <Form className='former' style={{ maxWidth: 1000 }} onSubmit={this.handleSubmit}>
                        <Row>
                            <Col span={8}>
                                <FormItem
                                    label={window.LangMessage.character_name || "角色名称"}
                                >
                                    {getFieldDecorator('searchRoleName', {
                                    })(
                                        <Input maxLength="45" placeholder={'请输入角色名称'} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label={window.LangMessage.character_code || "角色代码"}
                                >
                                    {getFieldDecorator('searchRoleCode', {
                                    })(
                                        <Input maxLength="45" placeholder={'请输入角色代码'} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={2}>
                                <Button type="primary" className="product-filter-btn button-offset" htmlType="submit">
                                    {window.LangMessage.btn_query || '查询'}</Button>
                            </Col>
                        </Row>
                    </Form>
                    <div className="middle-line"><p></p></div>
                    <Row className="mt15" type="flex" justify="end">
                        <Col>
                            <Button onClick={this.addShowModal} type="primary" className="product-filter-btn">
                                {window.LangMessage.add || '新增'}</Button>
                        </Col>
                    </Row>
                    <div className="mt15 greenFont">
                        <Table pagination={paginationConfig} bordered rowKey="roleId" columns={columns} dataSource={this.state.tableData} onChange={this.handleTableChange} />
                    </div>
                </div>
                <Modal
                    title={this.state.modalTitle}
                    className="permissionModal"
                    wrapClassName="vertical-center-modal"
                    footer={null}
                    visible={this.props.roleModalVisible}
                    onOk={this.editHandleOk}
                    onCancel={this.viewHandleCancel}>
                    <RoleModal
                        {...this.props}
                        key={this.props.roleId}
                        freshTable={this.queryTable}
                        wrappedComponentRef={(formRef) => { this.roleModal = formRef; }}
                    />
                </Modal>
            </div>
        );
    }
}
const WrappedRoleManage = Form.create()(RoleManage);

export default connect(state => {
    return {
        ...state.systemRoleManage
    }
})(WrappedRoleManage)