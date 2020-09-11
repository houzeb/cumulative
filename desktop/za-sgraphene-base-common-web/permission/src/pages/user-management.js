import React from 'react'
import SelectDom from '../component/SelectDom';
import ModalDom from './user-management-modal';
import mirrorx, { actions, connect, Router, Route } from 'mirrorx'
import { Row, Col, Button, Input, Form, Select, Table, Icon, Tabs, Pagination, Modal, DatePicker, TreeSelect, Tooltip } from 'antd';
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;
const defaultPageSize = 10;


if (!actions.systemUserManagement) {
    mirrorx.model({
        name: 'systemUserManagement',
        initialState: {
            visible: false,
            tableData: [], // 表格数据
            organizationList: [], // 所属机构组织数据
            departmentList: [], // 所属部门数据
            total: 0,
            pageIndex: 1,
            modalData: {}, // 弹窗的数据
            roleList: []// 角色数据
        },
        reducers: {
            setVisible(state, data) {
                return Object.assign({}, state, { visible: data });
            },
            setTableData(state, data) {
                return Object.assign({}, state, { tableData: data });
            },
            setOrganizationList(state, data) {
                return Object.assign({}, state, { organizationList: data });
            },
            setDepartmentList(state, data) {
                return Object.assign({}, state, { departmentList: data });
            },
            setTotal(state, data) {
                return Object.assign({}, state, { total: data });
            },
            setPageIndex(state, data) {
                return Object.assign({}, state, { pageIndex: data });
            },
            setModalData(state, data) {
                return Object.assign({}, state, { modalData: data });
            },
            setRoleList(state, data) {
                return Object.assign({}, state, { roleList: data });
            }
        },
        effects: {
            requestlistUser(data) {
                T.fetch({
                    url: '/user/listUser',
                    data: { ...data, pageSize: defaultPageSize }
                }).then(res => {
                    if (res.success &&
                        res.value &&
                        res.value.results.length >= 0) {
                        res.value.pageIndex = data.pageIndex;
                        actions.systemUserManagement.formatTableData(res.value);
                    }
                })
            },
            formatTableData(value) {

                const results = value.results;
                const total = value.total;
                const pageIndex = value.pageIndex;
                const statusObj = {
                    'VALID': window.LangMessage.manage_normal || '正常',
                    'INITIALIZED': window.LangMessage.manage_normal || '正常',
                    'FREEZE': window.LangMessage.frozen || '冻结'
                };
                const operateUserStatusObj = {
                    'VALID': window.LangMessage.frozen || '冻结',
                    'INITIALIZED': window.LangMessage.frozen || '冻结',
                    'FREEZE': window.LangMessage.thaw || '解冻'
                }
                actions.systemUserManagement.setTableData([]);
                const arr = [];
                results.map((item, index) => {
                    let key = (parseInt(pageIndex, 10) - 1) * defaultPageSize + index + 1;
                    const roleName = [];
                    const roleIds = [];
                    if (item.roles && item.roles.length) {
                        item.roles.map((item, index) => {
                            roleName.push(`${item.roleName}(${item.roleCode})`);
                            roleIds.push(item.roleId + '');
                        })
                    }
                    arr.push({
                        key: key,
                        userId: item.userId + '', // 用户id
                        userName: item.userName, // 用户名
                        userRealName: item.userRealName, // 姓名
                        //jobNo: item.jobNo, // 工号
                        organizationId: item.organizationId, // 机构id
                        organizationName: item.organizationName,
                        departmentId: item.departmentId, // 部门id
                        departmentName: item.departmentName,
                        roleNamesAll: roleName.join(', '),
                        roleName: roleName.length > 3 ? roleName.slice(0, 3).join(', ') + '...' : roleName.slice(0, 3).join(', '),
                        roleAllName: roleName.join(','),
                        roleIds: roleIds,
                        jobNo: item.jobNo, // 工号
                        mobile: item.mobile, // 手机
                        email: item.email, // 邮箱
                        userStatus: item.userStatus, // 状态 正常||冻结
                        userStatusText: statusObj[item.userStatus],
                        operateUserStatus: operateUserStatusObj[item.userStatus], // 操作中的冻结状态 冻结||解冻
                        createdTime: item.createdTime, // 创建时间
                        creator: item.creator, // 创建人
                        modifiedTime: item.modifiedTime, // 编辑时间
                        modifier: item.modifier, // 编辑人
                        offsetDate: item.offsetDate, // 设置的时间
                        defaultLanguage: item.defaultLanguage // 语言
                    })
                });
                // 根据返回的tableData个数，更新total分页的值

                actions.systemUserManagement.setTotal(total);
                actions.systemUserManagement.setTableData(arr);

            },
            requestOrganize() {
                T.fetch({
                    url: '/org/queryOrganizationTree'
                }).then(res => {
                    if (res.success &&
                        res.value &&
                        res.value.length > 0) {
                        const arr = actions.systemUserManagement.formatOrganize(res.value);
                        actions.systemUserManagement.setOrganizationList(arr);
                    }
                })
            },
            formatOrganize(results) {
                const arr = [];
                results.map((item, index) => {
                    const obj = {
                        value: item.organizationId + '',
                        label: item.organizationName,
                        key: item.organizationId,
                    };

                    if (item.children && item.children.length > 0) {
                        const childrenArr = actions.systemUserManagement.formatOrganize(item.children);
                        obj.children = childrenArr;
                    }
                    arr.push(obj);
                });
                return arr;
            },
            requestDepartment(organizationCode) {
                if (!organizationCode) {
                    actions.systemUserManagement.setDepartmentList([]);
                    return;
                }
                T.fetch({
                    url: '/org/queryDepartments',
                    data: {
                        organizationId: organizationCode || '',
                        // pageIndex: 1,
                        // pageSize: 100 // 这里是请求全部数据，但是接口为了兼容以后可分页的设置了分页参数。
                    }
                }).then(res => {
                    if (res.success &&
                        res.value &&
                        res.value.length >= 0) {
                        actions.systemUserManagement.formatDepartment(res.value);
                    }
                })
            },
            formatDepartment(results) {
                actions.systemUserManagement.setDepartmentList([]);
                const arr = [];
                results.map((item, index) => {
                    arr.push({
                        id: item.departmentId + '',
                        value: item.departmentName
                    })
                })
                actions.systemUserManagement.setDepartmentList(arr);
            },
            requestRoleList() {
                T.fetch({
                    url: 'user/queryRoles',
                    data: {
                        name: 1 // 这里随便传了一个参数。nodejs转发的时候{}的时候，body missing。而后台的空对象和空指针不一样.
                    },
                }).then(res => {
                    if (res && res.success && res.value && res.value.results && res.value.results.length) {
                        const results = res.value.results;
                        const roleList = actions.systemUserManagement.formatRoleList(results);
                        actions.systemUserManagement.setRoleList(roleList);
                    }
                })
            },
            formatRoleList(data) {
                return data.map((item, index) => {
                    return {
                        id: item.role.roleId,
                        value: `${item.role.roleName}(${item.role.roleCode})`,
                    }
                })
            }

        }
    })
}

class UserManagement extends React.Component {
    super(props) {
        this.props = props;
    }
    state = {
        modalType: '', // 弹窗类型 新增||编辑||查看
        sortedInfo: null,
        value: undefined,
    }

    componentDidMount() {
        const { pageIndex } = this.props;
        actions.systemUserManagement.requestlistUser({ pageIndex: pageIndex }); // 请求表格分页数据
        actions.systemUserManagement.requestOrganize(); // 请求组织
        actions.systemUserManagement.requestRoleList(); // 请求角色list
    }
    changeOrganize = (organizationCode) => {
        this.props.form.setFieldsValue({
            'departmentId': ''
        });
        actions.systemUserManagement.requestDepartment(organizationCode);
    }
    queryUser = (e) => {
        // 点击查询时触发
        e.preventDefault();
        this.setState({
            sortedInfo: null
        });
        this.queryList(1);
    }

    handleTableChange = (pagination, filters, sorter) => {
        // 表格切换页码时触发
        const pageIndex = pagination.current;
        this.state.sortedInfo = sorter;
        this.setState(this.state.sortedInfo);
        this.queryList(pageIndex);
    }

    queryList = (pageIndex) => {
        // 请求表格数据
        const values = this.props.form.getFieldsValue();
        const sortedInfo = this.state.sortedInfo;
        const sqlSort = (sortedInfo && sortedInfo.order === 'ascend') ? 'ASC' : 'DESC';
        if (values.roleIds && values.roleIds.length) {
            values.roleIds = [values.roleIds];
        }
        else {
            values.roleIds = [];
        }
        const data = {
            ...values,
            pageIndex: pageIndex,
            sqlSort: sqlSort,
            fieldName: sortedInfo && sortedInfo.columnKey,
        }
        actions.systemUserManagement.setPageIndex(pageIndex);
        actions.systemUserManagement.requestlistUser(data);
    }

    //新增弹框
    showInsertModel = () => {
        actions.systemUserManagement.setVisible(true);
        actions.systemUserManagement.setModalData({});
        this.setState({ modalType: 'INSERT' });
    }
    //编辑弹框
    showUpdateModel = (record) => {
        console.log(record);
        actions.systemUserManagement.requestDepartment(record.organizationId);

        actions.systemUserManagement.setVisible(true);
        actions.systemUserManagement.setModalData(record);
        this.setState({ modalType: 'UPDATE' });

    }
    //查看弹框
    showCheckModel = (record) => {
        actions.systemUserManagement.setVisible(true);
        actions.systemUserManagement.setModalData(record);
        this.setState({ modalType: 'CHECK' });
    }
    // 重置密码modal
    showResetPasswordModal = (record) => {
        const langMessage = window.LangMessage;
        const sureResetPassword = langMessage.sureResetPassword || '确认重置密码?';
        const tipText = langMessage.reset_tip || '重置后新密码会发送至您的个人邮箱，密码仅能使用1次，登录后请尽快修改密码!';
        const resetSuccessText = langMessage.reset_success_change_password || '密码重置成功！请查询您的个人邮箱，并尽快修改密码！';

        const systemUserId = this.props.userDetail.userId;
        confirm({
            title: sureResetPassword,
            content: tipText,
            okText: window.LangMessage.ok_text || '确定',
            cancelText: window.LangMessage.exit_text || '取消',
            onOk() {
                T.fetch({
                    url: 'user/resetPassword',
                    data: {
                        userId: record.userId,
                        modifier: systemUserId
                    }
                }).then(res => {
                    if (res && res.success) {
                        T.showSuccess(resetSuccessText);
                    }
                })
            }
        })
    }
    showFreezeModal = (record) => {
        const langMessage = window.LangMessage;
        const userStatus = record.userStatus === 'FREEZE' ? 'VALID' : 'FREEZE';
        const modify_success = langMessage.modify_success || '修改成功';
        // 新增冻结和解冻两个完整句子
        const frozenAllText = langMessage.frozen_user_confirm || '确认是否冻结该用户';
        const thawAllText = langMessage.thaw_user_confirm || '确认是否解冻该用户';

        const userStatusText = record.userStatus === 'FREEZE' ? thawAllText : frozenAllText;

        const systemUserId = this.props.userDetail.userId;
        confirm({
            title: userStatusText,
            onOk() {
                T.fetch({
                    url: 'user/saveUser',
                    data: {
                        userId: record.userId,
                        modifier: systemUserId,
                        userStatus: userStatus
                    }
                }).then(res => {
                    if (res && res.value && res.value.userId) {
                        T.showSuccess(modify_success);
                        actions.systemUserManagement.requestlistUser({ pageIndex: 1 });
                    }
                })
            }
        })
    }
    render() {
        const { organizationList, visible, total, tableData, pageIndex, modalData, departmentList, roleList } = this.props;
        const pagination = {
            current: pageIndex,
            total: total,
            defaultPageSize: defaultPageSize,
            showQuickJumper: true,
        }
        const { getFieldDecorator } = this.props.form;

        let { sortedInfo } = this.state;
        sortedInfo = sortedInfo || {};

        const langMessage = window.LangMessage;
        const userNameText = langMessage.user_name || '用户名';
        const nameText = langMessage.name || '姓名';
        const thisOrganizeText = langMessage.the_organize || '所属机构';
        const thisDepartmentText = langMessage.the_department || '所属部门';
        const roleText = langMessage.role || '角色';
        const emailText = langMessage.email || '邮箱';
        const statusText = langMessage.status || '状态';
        const operateText = langMessage.handle || '操作';
        const checkText = langMessage.btn_look || '查看';
        const queryText = langMessage.btn_query || '查询';
        const editText = langMessage.text_edit || '编辑';
        const btnResetText = langMessage['btn-reset'] || '重置';
        const passwordText = langMessage.password || '密码';
        const pleaseSelectText = '请选择所属机构';
        const addText = langMessage.btn_add || '新增';

        const columns = [{
            title: 'No.',
            dataIndex: 'userId',
            key: 'userId',
            width: 100
        }, {
            title: userNameText,
            dataIndex: 'userName',
            key: 'userName',
            sorter: (a, b) => a.age - b.age,
            sortOrder: sortedInfo.columnKey === 'userName' && sortedInfo.order,
            width: 120
        }, {
            title: nameText,
            dataIndex: 'userRealName',
            key: 'userRealName',
            sorter: (a, b) => a.key.length - b.key.length,
            sortOrder: sortedInfo.columnKey === 'userRealName' && sortedInfo.order,
            width: 120
        }, {
            title: thisOrganizeText,
            dataIndex: 'organizationName',
            key: 'organizationId',
            width: 160,
            sorter: (a, b) => a.key.length - b.key.length,
            sortOrder: sortedInfo.columnKey === 'organizationId' && sortedInfo.order,
        }, {
            title: thisDepartmentText,
            dataIndex: 'departmentName',
            key: 'departmentId',
            width: 160,
            sorter: (a, b) => a.key.length - b.key.length,
            sortOrder: sortedInfo.columnKey === 'departmentId' && sortedInfo.order,
        }, {
            title: roleText,
            dataIndex: 'roleName',
            key: 'roleName',
            sorter: (a, b) => a.key.length - b.key.length,
            sortOrder: sortedInfo.columnKey === 'roleName' && sortedInfo.order,
            render: (text, record) => {
                return (
                    <Tooltip title={record.roleAllName}>{text}</Tooltip>
                )
            }
        }, {
            title: emailText,
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.key.length - b.key.length,
            width: 200,
            sortOrder: sortedInfo.columnKey === 'email' && sortedInfo.order,
        }, {
            title: statusText,
            dataIndex: 'userStatusText',
            render: text => <span>{text}</span>,
            key: 'userStatus',
            sorter: (a, b) => a.key.length - b.key.length,
            sortOrder: sortedInfo.columnKey === 'userStatus' && sortedInfo.order,
            width: 90
        }, {
            title: operateText,
            dataIndex: 'operateUserStatus',
            fixed: 'right',
            width: 340,
            render: (text, record) => (
                <span>
                    <a href="#" onClick={() => { this.showCheckModel(record) }}>{checkText}</a>
                    <span className="ant-divider" />
                    <a href="#" onClick={() => { this.showUpdateModel(record) }}>{editText}</a>
                    <span className="ant-divider" />
                    <a href="#" onClick={() => { this.showResetPasswordModal(record) }}>{window.LangMessage.resetpwd || '重置密码'}</a>
                    <span className="ant-divider" />
                    <a href="#" onClick={() => { this.showFreezeModal(record) }}>{text}</a>
                </span>
            ),
        }];
        return (
            <div>
                <div className="pb15 search-result-back">
                    <div>
                        <span className="mr5 strong">{window.LangMessage.system_settings || '系统设置'}</span>
                        <Icon type="right" />
                        <span className="ml5">{window.LangMessage.user_manage || '用户管理'}</span>
                    </div>
                </div>
                <div className="user-management">
                    <Form layout="inline" className="pt15 pb15 person-form former" style={{ maxWidth: 1000 }} onSubmit={this.queryUser}>
                        <Row>
                            <Col span={8}>
                                <FormItem
                                    label={userNameText}
                                    labelCol={{ span: 9 }}
                                >
                                    {getFieldDecorator('userName', {
                                    })(
                                        <Input maxLength={20} placeholder={'请输入用户名'} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label={roleText}
                                    labelCol={{ span: 9 }}
                                >
                                    {getFieldDecorator('roleIds', {
                                    })(
                                        <SelectDom width={300} list={roleList} text_select={'角色'} allowClear />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label={emailText}
                                    labelCol={{ span: 9 }}
                                >
                                    {getFieldDecorator('email', {
                                    })(
                                        <Input maxLength={45} placeholder={'请输入邮箱'} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="mt15">
                            <Col span={8}>
                                <FormItem
                                    label={nameText}
                                    labelCol={{ span: 9 }}
                                >
                                    {getFieldDecorator('userRealName', {
                                    })(
                                        <Input maxLength={28} placeholder={'请输入姓名'} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label={thisOrganizeText}
                                    labelCol={{ span: 9 }}
                                >
                                    {getFieldDecorator('organizationId', {
                                    })(
                                        <TreeSelect
                                            allowClear
                                            style={{ width: 300 }}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            placeholder={pleaseSelectText}
                                            treeData={organizationList}
                                            treeDefaultExpandAll
                                            onChange={this.changeOrganize}
                                        >
                                        </TreeSelect>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label={thisDepartmentText}
                                    labelCol={{ span: 9 }}
                                >
                                    {getFieldDecorator('departmentId', {
                                    })(
                                        <SelectDom width={300} list={departmentList} text_select={'所属部门'} allowClear />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="button-group">
                            <Col>
                                <Button type="primary" className="product-filter-btn" htmlType="submit">{queryText}</Button>
                            </Col>
                        </Row>
                    </Form>
                    <div className="middle-line"><p></p></div>
                    <Row className="mt15" type="flex" justify="end">
                        <Col>
                            <Button onClick={this.showInsertModel} type="primary" className="product-filter-btn">{addText}</Button>
                        </Col>
                    </Row>
                    <div className="mt15 greenFont">
                        <Table pagination={pagination} scroll={{ x: 1600 }} bordered columns={columns} dataSource={tableData} onChange={this.handleTableChange} rowKey={record => record.userId}/>
                    </div>
                    <ModalDom type={this.state.modalType} visible={visible} organizationList={organizationList} modalData={modalData} departmentList={departmentList} roleList={roleList}></ModalDom>
                </div>
            </div>
        )
    }
}

const WrappedUserManagement = Form.create()(UserManagement);

export default connect(state => {
    return {
        ...state.systemUserManagement,
        userDetail: state.mainPage.userDetail
    }
})(WrappedUserManagement)


