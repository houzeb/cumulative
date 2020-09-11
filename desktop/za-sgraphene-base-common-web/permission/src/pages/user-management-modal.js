import React from 'react';
import mirrorx, { actions, connect } from 'mirrorx';
import { Row, Col, Button, Input, Form, Select, Modal, TreeSelect } from 'antd';
import SelectDom from '../component/SelectDom';
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class UserManagementModal extends React.Component {

    state = {
        confirmLoading: false,
        userId: null,
    }
    componentDidMount = () => {

    }
    changeOrganize = (organizationId) => {
        this.props.form.setFieldsValue({
            'departmentId': ''
        });
        actions.systemUserManagement.setDepartmentList([]); // 选择所属机构的时候，先清空之前的部门
        actions.systemUserManagement.requestDepartment(organizationId);
    }
    showModal = () => {
        actions.systemUserManagement.setVisible(true);
    }
    handleOk = (e) => {
        const userId = this.props.modalData.userId;
        console.log(this.props.modalData);
        const type = this.props.type;
        const systemUserId = this.props.userDetail.userId;
        e.preventDefault();
        this.setState({
            confirmLoading: true,
        });
        // this.queryList();
        this.props.form.validateFields((err, values) => {
            //values.offsetDate = values.offsetDate && T.formatDate('yyyy-MM-dd hh:mm:ss', values.offsetDate._d) || undefined;
            if (!err) {
                T.fetch({
                    url: '/user/saveUser',
                    data: {
                        modifier: systemUserId,
                        userId: userId + '' ? +userId : null,
                        ...values
                    }
                }).then(res => {
                    if (res && res.value) {
                        const langMessage = window.LangMessage;
                        const editSuccessText = langMessage.modify_success || '修改成功';
                        const addSuccessText = langMessage.add_success || '新增成功';
                        const successMessage = (type === 'INSERT') ? addSuccessText : editSuccessText;
                        T.showSuccess(successMessage);
                        setTimeout(() => {

                            this.setState({
                                confirmLoading: false,
                            });
                            if (systemUserId === userId) {
                                let language = values.defaultLanguage || '';
                                if (language == 'zh-tw') {
                                    language = 'zh-TW';
                                }
                                else {
                                    language = 'zh-CN';
                                }
                                T.cookie.set('lang', language);
                                location.reload();
                                return;
                            }
                            actions.systemUserManagement.setVisible(false);
                            actions.systemUserManagement.setPageIndex(1);

                            const values = this.props.form.getFieldsValue();
                            actions.systemUserManagement.requestlistUser({ pageIndex: 1 });
                            this.props.form.resetFields();
                        }, 1000);
                    }
                })
            }
        })
    }
    showConfirm = (record) => {
        const userId = this.props.modalData.userId;
        const langMessage = window.LangMessage;
        const sureDeleteThisUser = langMessage.sureDeleteThisUser || '确认删除该用户?';
        const deleteTipText = langMessage.delete_tip || '删除后无法恢复！';
        const deleteSuccessText = langMessage.delete_success || '删除成功';

        const systemUserId = this.props.userDetail.userId;
        confirm({
            title: sureDeleteThisUser,
            content: deleteTipText,
            okText: window.LangMessage.ok_text || '确定',
            cancelText: window.LangMessage.cancle_text || '取消',
            onOk() {
                T.fetch({
                    url: '/user/saveUser',
                    data: {
                        userId: userId,
                        modifier: systemUserId,
                        userStatus: 'INVALID'
                    }
                }).then(res => {
                    if (res && res.value && res.value.userId) {
                        T.showSuccess(deleteSuccessText);
                        actions.systemUserManagement.setVisible(false);
                        actions.systemUserManagement.requestlistUser({ current: 1 });
                    }
                })
            }
        })
    }
    handleCancel = () => {
        actions.systemUserManagement.setVisible(false);
    }
    checkUserName = (rule, value, callback) => {
        const form = this.props.form;
        const langMessage = window.LangMessage;
        const pleaseInput = '请输入用户名';
        const userNameText = langMessage.user_name || '用户名';
        const userNameRule = langMessage.user_name_rule || '长度不能超过20';
        if (!value) {
            callback(pleaseInput);
        }
        else if (value && value.length > 20) {
            callback(userNameRule);
        }
        else {
            callback();
        }
    }
    checkJobNo = (rule, value, callback) => {
        const langMessage = window.LangMessage;
        const userNameRule = langMessage.user_name_rule || '长度不能超过20';
        if (value && value.length > 20) {
            callback(userNameRule);
        }
        else {
            callback();
        }
    }
    changeDatePicker = (v) => {
        console.log(this.props);
        console.log(' this.refs', this.refs);
        console.log(v);

    }
    render() {

        const { type, visible, organizationList, modalData, departmentList, roleList } = this.props;
        const { getFieldDecorator } = this.props.form;

        const langMessage = window.LangMessage;
        const userNameText = langMessage.user_name || '用户名';
        const nameText = langMessage.name || '姓名';
        const jobNumberText = langMessage.job_number || '工号';
        const thisOrganizeText = langMessage.the_organize || '所属机构';
        const thisDepartmentText = langMessage.the_department || '所属部门';
        const mobileText = langMessage.mobile || '手机';
        const roleText = langMessage.role || '角色';
        const emailText = langMessage.email || '邮箱';
        const btnSaveText = langMessage.btn_save || '保存';
        const pleaseInput = langMessage.text_input || '请输入';
        const checkText = langMessage.btn_look || '查看';
        const editText = langMessage.text_edit || '编辑';
        const setText = langMessage.set || '设置';
        const userText = langMessage.user || '用户';
        const pleaseSelectText = langMessage.text_select || '请选择';
        // const addText = langMessage.add || '新增';
        // const messageText = langMessage.message || '信息';
        const cnText = '中文简体';
        const twText = '中文繁体';
        const enText = 'English';
        const jpText = '日本語';
        const timeText = langMessage.time || '时间';
        const createText = langMessage.create || '创建';
        const peopleText = langMessage.people || '人';
        const deleteText = langMessage.delete || '删除';
        const everText = langMessage.ever || '未';
        const pleaseInputCorrect = langMessage.text_input_correct || '请输入正确的格式';

        let title = '';
        switch (type) {
            case 'INSERT':
                title = langMessage.add_user || '用户新增';
                break;
            case 'UPDATE':
                title = langMessage.edit_user || '用户编辑';
                break;
            case 'CHECK':
                title = langMessage.view_user || '用户查看';
                break;
        }
        const lang = [
            { id: 'zh-cn', value: cnText },
            { id: 'zh-tw', value: twText },
            { id: 'en-us', value: enText },
            { id: 'ja-jp', value: jpText },
        ]
        let langText = '';
        lang.map((item, index) => {
            if (item.id === modalData.defaultLanguage) {
                langText = item.value;
            }
        })

        const noSetText = everText + setText;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            }
        }
        const children = [];
        roleList.map((item, index) => {
            children.push(<Option key={item.id}>{`${item.value}`}</Option>);
        })
        return (
            <div>
                {type === 'CHECK' ?
                    (
                        <Modal
                            title={title}
                            visible={visible}
                            onCancel={this.handleCancel}
                            footer={null}
                        >
                            <Form className="model-form">
                                <Row type="flex" justify="start">
                                    <Col className="mt5" span={24}>
                                        <FormItem
                                            label={userNameText}
                                            {...formItemLayout}
                                        >
                                            <span>{modalData.userName || noSetText}</span>

                                        </FormItem>
                                        <FormItem
                                            label={nameText}
                                            {...formItemLayout}
                                        >
                                            <span>{modalData.userRealName || noSetText}</span>
                                        </FormItem>
                                        <FormItem
                                            label={jobNumberText}
                                            {...formItemLayout}
                                        >
                                            <span>{modalData.jobNo || noSetText}</span>
                                        </FormItem>
                                        <FormItem
                                            label={thisOrganizeText}
                                            {...formItemLayout}
                                        >
                                            <span>{modalData.organizationName || noSetText}</span>
                                        </FormItem>
                                        <FormItem
                                            label={thisDepartmentText}
                                            {...formItemLayout}
                                        >
                                            <span>{modalData.departmentName || noSetText}</span>
                                        </FormItem>
                                        <FormItem
                                            label={roleText}
                                            {...formItemLayout}
                                        >
                                            <span>{modalData.roleNamesAll.length ? modalData.roleNamesAll : noSetText}</span>
                                        </FormItem>
                                        <FormItem
                                            label={mobileText}
                                            {...formItemLayout}
                                        >
                                            <span>{modalData.mobile || noSetText}</span>
                                        </FormItem>
                                        <FormItem
                                            label={emailText}
                                            {...formItemLayout}
                                        >
                                            <span>{modalData.email || noSetText}</span>
                                        </FormItem>
                                        {/* <FormItem
                                            label={languageText}
                                            {...formItemLayout}
                                        >
                                            <span>{langText || cnText}</span>
                                        </FormItem> */}
                                        <FormItem
                                            label={timeText}
                                            {...formItemLayout}
                                        >
                                            <span>{modalData.offsetDate || noSetText}</span>
                                        </FormItem>
                                        <FormItem
                                            label={createText + peopleText}
                                            {...formItemLayout}
                                        >
                                            <span>{modalData.creator || noSetText}</span>
                                        </FormItem>
                                        <FormItem
                                            label={createText + timeText}
                                            {...formItemLayout}
                                        >
                                            <span>{modalData.createdTime || noSetText}</span>
                                        </FormItem>
                                        <FormItem
                                            label={editText + peopleText}
                                            {...formItemLayout}
                                        >
                                            <span>{modalData.modifier || noSetText}</span>
                                        </FormItem>
                                        <FormItem
                                            label={editText + timeText}
                                            {...formItemLayout}
                                        >
                                            <span>{modalData.modifiedTime || noSetText}</span>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                        </Modal>
                    ) : (
                        <Modal title={title}
                            visible={visible}
                            footer={null}
                            confirmLoading={this.state.confirmLoading}
                            onCancel={this.handleCancel}
                        >
                            <Form className="person-form" onSubmit={this.handleOk}>
                                <Row type="flex" justify="start">
                                    <Col className="mt5" span={24}>
                                        <FormItem
                                            label={userNameText}
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('userName', {
                                                initialValue: modalData.userName || '',
                                                rules: [{
                                                    required: true,
                                                    validator: this.checkUserName
                                                }],
                                            })(
                                                <Input maxLength={20} placeholder={'请输入用户名'} />
                                            )}
                                        </FormItem>
                                        <FormItem
                                            label={nameText}
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('userRealName', {
                                                initialValue: modalData.userRealName || '',
                                                rules: [{
                                                    required: true,
                                                    message: `${pleaseInput}姓名`,
                                                }],
                                            })(
                                                <Input maxLength={28} placeholder={'请输入姓名'} />
                                            )}
                                        </FormItem>
                                        <FormItem
                                            label={jobNumberText}
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('jobNo', {
                                                initialValue: modalData.jobNo || '',
                                                rules: [{
                                                    validator: this.checkJobNo
                                                }]

                                            })(
                                                <Input maxLength={20} placeholder={'请输入工号'} />
                                            )}
                                        </FormItem>
                                        <FormItem
                                            label={thisOrganizeText}
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('organizationId', {
                                                initialValue: modalData.organizationId && modalData.organizationId + '' || '',
                                                rules: [{
                                                    required: true,
                                                    message: `${pleaseInput}所属机构`,
                                                }],
                                            })(
                                                <TreeSelect
                                                    className="auto-width"
                                                    allowClear
                                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                    placeholder={`${pleaseSelectText}所属机构`}
                                                    treeData={organizationList}
                                                    treeDefaultExpandAll
                                                    onChange={this.changeOrganize}
                                                >
                                                </TreeSelect>
                                            )}
                                        </FormItem>
                                        <FormItem
                                            label={thisDepartmentText}
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('departmentId', {
                                                initialValue: modalData.departmentId && modalData.departmentId + '' || '',
                                                rules: [{
                                                    required: true,
                                                    message: `${pleaseInput}所属部门`,
                                                }],
                                            })(
                                                <SelectDom list={departmentList} text_select={'所属部门'} className="auto-width" />
                                            )}
                                        </FormItem>
                                        <FormItem
                                            label={roleText}
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('roleIds', {
                                                initialValue: modalData.roleIds,
                                            })(
                                                <Select
                                                    mode="multiple"
                                                    placeholder={'请选择角色'}
                                                    className="auto-width"
                                                >
                                                    {children}
                                                </Select>
                                            )}
                                        </FormItem>
                                        <FormItem
                                            label={mobileText}
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('mobile', {
                                                initialValue: modalData.mobile || '',
                                                validateTrigger: 'onBlur',
                                                rules: [{
                                                    pattern: /^((\+)?86|((\+)?86)?)0?1[34578]\d{9}$/,
                                                    message: pleaseInputCorrect
                                                }],
                                            })(
                                                <Input maxLength={11} placeholder={'请输入手机号码'} />
                                            )}
                                        </FormItem>
                                        {/* <FormItem
                                            label={timeText}
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('offsetDate', {
                                                initialValue: modalData.offsetDate && moment(modalData.offsetDate, 'YYYY-MM-DD HH:mm:ss') || undefined,
                                            })(
                                                <DatePicker ref={this.datePicker}  onChange={this.changeDatePicker} showTime={{ format: 'HH:mm:ss' }} format="YYYY-MM-DD HH:mm:ss" placeholder={pleaseSelectText + timeText} />
                                                )}
                                        </FormItem> */}
                                        <FormItem
                                            label={emailText}
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('email', {
                                                initialValue: modalData.email || '',
                                                // validateTrigger: 'onBlur',
                                                rules: [{
                                                    type: 'email', message: pleaseInputCorrect
                                                }, {
                                                    required: true, message: `${pleaseInput}邮箱`,
                                                }],
                                            })(
                                                <Input maxLength={45} placeholder={'请输入邮箱'} />
                                            )}
                                        </FormItem>
                                        <FormItem
                                            label={window.LangMessage.language}
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('defaultLanguage', {
                                                // initialValue: modalData.defaultLanguage || 'ja-jp', // 默认是日文
                                            })(
                                                <SelectDom className="auto-width" text_select={'语言'} list={lang} />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row className="mt15 mb20" type="flex" justify="center">
                                    <Col>
                                        <Button type="primary" className="system-btn product-save-btn" htmlType="submit">{btnSaveText}</Button>
                                        {
                                            type === 'UPDATE' &&
                                            <Button type="primary" className="system-btn product-save-btn" onClick={this.showConfirm}>{deleteText}</Button>
                                        }

                                    </Col>
                                </Row>
                            </Form>
                        </Modal>
                    )
                }
            </div>
        )
    }
}


const WrappedUserManagementModal = Form.create()(UserManagementModal);

export default connect(state => {
    return {
        ...state.systemUserManagement.visible,
        userDetail: state.mainPage.userDetail
    }
})(WrappedUserManagementModal);