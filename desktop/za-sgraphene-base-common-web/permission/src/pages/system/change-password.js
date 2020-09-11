import React from 'react'
import ReactDOM from 'react-dom'
import SelectDom from '../../component/SelectDom';
import mirror, { actions, connect } from 'mirrorx'
import { Row, Col, Button, Input, Form, Select, Table, Icon, Tabs } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class ChangePassword extends React.Component {
    super(props) {
        this.props = props;
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const langMessage = window.LangMessage;
        const saveSuccessText = langMessage.save_success || '保存成功';
        const userId = this.props.userDetail.userId;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                T.fetch({
                    url: "user/changePassword",
                    data: {
                        userId: userId,
                        oldPassword: values.oldPassword,
                        newPassword: values.newPassword,
                        confirmPassword: values.confirmPassword
                    },
                    method: 'post'
                }).then((result) => {
                    if (result.success) {
                        T.showSuccess(saveSuccessText);
                        // intialized 用户为初始化状态时候，枪支跳转到修改密码页面，且其他页面不能使用.VALID
                        if (this.props.location && this.props.location.pathname === '/change-password') {
                            actions.routing.push('/');
                            location.reload();
                        }
                        else {
                            // 退出登陆
                            setTimeout(() => {
                                this.logoutClick();
                            }, 800);
                        }
                    }
                });
            }
        });
    }
    logoutClick = () => {
        T.fetch({
            url: "/logoutRequest"
        }).then((result) => {
            if (result.success) {
                let data = result.value || "/";
                location.href = data;
            }
        });
    }
    //新密码   
    newPassword = (rule, value, callback) => {
        const langMessage = window.LangMessage;
        const enterPasswordRule = langMessage.enter_password_rule || '请输入8-32位有字母，数字，符号的密码';
        const form = this.props.form;
        // 密码包含25个可输入的特殊字符：~!@#$%^&*()-_+\/'?:.(){}[]
        // 3种（字母、数字、特殊字符）选中2种
        // var regex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\~!@#\$%\^&\*\(\)\-_\+\\'\?\/:\.()\{\}\[\]]{8,32}$/;
        // 4种（大写字母、小写字母、数字、特殊字符）任意选中3种
        var regex = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\~!@#\$%\^&\*\(\)\-_\+\\'\?\/:\.()\{\}\[\]]+$)(?![a-z0-9]+$)(?![a-z\~!@#\$%\^&\*\(\)\-_\+\\'\?\/:\.()\{\}\[\]]+$)(?![0-9\~!@#\$%\^&\*\(\)\-_\+\\'\?\/:\.()\{\}\[\]]+$)[a-zA-Z0-9\~!@#\$%\^&\*\(\)\-_\+\\'\?\/:\.()\{\}\[\]]{8,30}$/;

        if (regex.test(value)) {
            if (value && value == form.getFieldValue('oldPassword')) {
                callback(window.LangMessage.new_old_cannot_duplicate || "新旧密码不能重复");
            }
            callback();
        } else {
            callback(enterPasswordRule);
        }

    }
    //确认密码
    checkPassword = (rule, value, callback) => {
        const langMessage = window.LangMessage;
        const confirmPasswordText = langMessage.confirm_password || '请再次输入密码';
        const form = this.props.form;
        if (!value) {
            callback(confirmPasswordText);
            return false
        }
        if (value && value !== form.getFieldValue('newPassword')) {
            callback(confirmPasswordText);
        } else {
            callback();
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const langMessage = window.LangMessage;
        const btnSaveText = langMessage.btn_save || '保存';
        const isReset = this.props.location && (this.props.location.pathname === '/change-password') ? true : false;
        return (
            <div>
                {
                    isReset ? (
                        <div className="pb30">
                            <div className="pb15 search-result-back">
                                <div style={{ width: 300 }}>
                                    <span className="mr5 strong">{window.LangMessage.system_settings || '系统设置'}</span>
                                    <Icon type="right" />
                                    <span className="ml5">{window.LangMessage.modifyPW || '修改密码'}</span>
                                </div>
                            </div>
                            <div className="system-set pl30 pr30">

                                <Form className="person-form passform" onSubmit={this.handleSubmit}>
                                    <Row className="mt15" type="flex" justify="start">

                                        <Col span={15} className="img-center">
                                            <FormItem
                                                label={window.LangMessage.old_password || '原密码'}
                                                labelCol={{ span: 9 }}
                                                wrapperCol={{ span: 15 }}
                                            >
                                                {getFieldDecorator('oldPassword', {
                                                    validateTrigger: 'onBlur',
                                                    rules: [{
                                                        required: true,
                                                        message: '请输入原密码'
                                                    }],
                                                })(
                                                    <Input type="password" maxLength="32" placeholder={'请输入原密码'} />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                label={window.LangMessage.ma_new_password || '新密码'}
                                                labelCol={{ span: 9 }}
                                                wrapperCol={{ span: 15 }}
                                            >
                                                {getFieldDecorator('newPassword', {
                                                    validateTrigger: 'onBlur',
                                                    rules: [{
                                                        validator: this.newPassword
                                                    },
                                                        // {
                                                        //     required: true,
                                                        //     message: window.LangMessage.please_input
                                                        // }
                                                    ],
                                                })(
                                                    <Input placeholder={'请输入新密码'} type="password" maxLength="32" />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                label={window.LangMessage.ma_confirm_password || '确认密码'}
                                                labelCol={{ span: 9 }}
                                                wrapperCol={{ span: 15 }}
                                            >
                                                {getFieldDecorator('confirmPassword', {
                                                    validateTrigger: 'onBlur',
                                                    rules: [{
                                                        validator: this.checkPassword
                                                    },
                                                        // {
                                                        //     required: true,
                                                        //     message: window.LangMessage.please_input
                                                        // }
                                                    ],
                                                })(
                                                    <Input placeholder={'请输入确认密码'} type="password" maxLength="32" />
                                                )}
                                            </FormItem>
                                            <Row className="mt25" type="flex" justify="center">
                                                <Col>
                                                    {<Button htmlType="submit" type="primary" className="system-btn product-save-btn">{btnSaveText}</Button>}
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </div>
                    ) : (
                            <div className="pb30">
                                <Form className="person-form passform" onSubmit={this.handleSubmit}>
                                    <Row className="mt15" type="flex" justify="start">
                                        <Col span={15}>
                                            <FormItem
                                                label={window.LangMessage.old_password || '原密码'}
                                                labelCol={{ span: 9 }}
                                                wrapperCol={{ span: 15 }}
                                            >
                                                {getFieldDecorator('oldPassword', {
                                                    validateTrigger: 'onBlur',
                                                    rules: [{
                                                        required: true,
                                                        message: '请输入原密码'
                                                    }],
                                                })(
                                                    <Input placeholder={'请输入原密码'} type="password" maxLength="32" />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                label={window.LangMessage.ma_new_password || '新密码'}
                                                labelCol={{ span: 9 }}
                                                wrapperCol={{ span: 15 }}
                                            >
                                                {getFieldDecorator('newPassword', {
                                                    validateTrigger: 'onBlur',
                                                    rules: [{
                                                        validator: this.newPassword
                                                    },
                                                        // {
                                                        //     required: true,
                                                        //     message: window.LangMessage.please_input
                                                        // }
                                                    ],
                                                })(
                                                    <Input placeholder={'请输入新密码'} type="password" maxLength="32" />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                label={window.LangMessage.ma_confirm_password || '确认密码'}
                                                labelCol={{ span: 9 }}
                                                wrapperCol={{ span: 15 }}
                                            >
                                                {getFieldDecorator('confirmPassword', {
                                                    validateTrigger: 'onBlur',
                                                    rules: [{
                                                        validator: this.checkPassword
                                                    },
                                                        // {
                                                        //     required: true,
                                                        //     message: window.LangMessage.please_input
                                                        // }
                                                    ],
                                                })(
                                                    <Input placeholder={'请输入确认密码'} type="password" maxLength="32" />
                                                )}
                                            </FormItem>
                                            <Row className="mt25" type="flex" justify="center">
                                                <Col>
                                                    {<Button htmlType="submit" type="primary" className="system-btn product-save-btn">{btnSaveText}</Button>}
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        )
                }

            </div>
        );
    }
}
const WrappedChangePassword = Form.create()(ChangePassword);

export default connect(state => {
    return {
        ...{ userDetail: state.mainPage.userDetail }
    }
})(WrappedChangePassword);
