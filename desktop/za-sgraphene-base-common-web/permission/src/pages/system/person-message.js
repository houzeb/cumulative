import React from 'react'
import ReactDOM from 'react-dom'
import SelectDom from '../../component/SelectDom';
import mirror, { actions, connect } from 'mirrorx'
import { Row, Col, Button, Input, Form, Select, Table, Icon, Tabs, Upload, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

mirror.model({
    name: 'systemPersonMessage',
    initialState: {

    },
    reducers: {

    },
    effects: {
    }
})
class PersonMessage extends React.Component {
    super(props) {
        this.props = props;
    }
    state = {
        userDetail: {},
    }
    componentDidMount() {

    }
    // handleSubmit = (e) => {
    //     e.preventDefault();
    //     this.props.form.validateFields((err, values) => {
    //         if (!err) {
    //             const langMessage = window.LangMessage;
    //             const saveSuccessText = langMessage.save_success || '保存成功';
    //             const userId = this.props.userDetail.userId;
    //             T.fetch({
    //                 url: '/user/saveUser',
    //                 data: {
    //                     userId: userId,
    //                     email: values.email,
    //                     mobile: values.mobile
    //                 }
    //             }).then(res => {
    //                 if (res.success) {
    //                     T.showSuccess(saveSuccessText);
    //                     this.changeEmail(values.email);
    //                 }
    //             });
    //         }
    //     });
    // }
    changeEmail = (lang) => {
        setTimeout(() => {
            location.reload();
        }, 0);
    }
    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    changeImg = (info) => {
        if (info.file.status === 'done') {

            this.getBase64(info.file.originFileObj, function (avatar) {
                actions.mainPage.setAvatar(avatar);
            });
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { userDetail, avatar } = this.props;

        const imgProps = {
            className: "avatar-uploader",
            name: "imageFile",
            action: '/ajax/user/changeAvatar',
            accept: 'image/jpeg, image/jpg, image/png',

            data: {
                userId: userDetail.userId,
                modifier: userDetail.modifier
            },
            showUploadList: false,
            listType: "picture-card",
            onChange: this.changeImg

        };
        const langMessage = window.LangMessage;
        const userNameText = langMessage.user_name || '用户名';
        const nameText = langMessage.name || '姓名';
        const jobNumberText = langMessage.job_number || '工号';
        const thisOrganizeText = langMessage.this_organize || '所属机构';
        const thisDepartmentText = langMessage.this_department || '所属部门';
        const mobileText = langMessage.mobile || '手机';
        const emailText = langMessage.email || '邮箱';
        return (
            <div>
                <div className="main-system pb30">
                    <Form className="person-form">
                        <Row className="mt5" type="flex" justify="start">
                            <Col className="mt5" span={12}>
                                <FormItem
                                    label={userNameText}
                                    labelCol={{ span: 9 }}
                                    wrapperCol={{ span: 13 }}
                                >
                                    <span>{userDetail.userName}</span>
                                </FormItem>
                                <FormItem
                                    label={nameText}
                                    labelCol={{ span: 9 }}
                                    wrapperCol={{ span: 13 }}
                                >
                                    <span>{userDetail.userRealName}</span>
                                </FormItem>
                                <FormItem
                                    label={jobNumberText}
                                    labelCol={{ span: 9 }}
                                    wrapperCol={{ span: 13 }}
                                >
                                    <span>{userDetail.jobNo}</span>
                                </FormItem>
                                <FormItem
                                    label={thisOrganizeText}
                                    labelCol={{ span: 9 }}
                                    wrapperCol={{ span: 13 }}
                                >
                                    <span>{userDetail.organizationName}</span>
                                </FormItem>
                                <FormItem
                                    label={thisDepartmentText}
                                    labelCol={{ span: 9 }}
                                    wrapperCol={{ span: 13 }}
                                >
                                    <span>{userDetail.departmentName}</span>
                                </FormItem>
                                <FormItem
                                    label={mobileText}
                                    labelCol={{ span: 9 }}
                                    wrapperCol={{ span: 13 }}
                                >
                                    <span>{userDetail.mobile}</span>
                                    {/*getFieldDecorator('mobile', {
                                        validateTrigger: 'onBlur',
                                        rules: [{
                                            pattern: /^((\+)?86|((\+)?86)?)0?1[3458]\d{9}$/,
                                            message: pleaseInputCorrect
                                        }],
                                        initialValue: userDetail.mobile
                                    })(
                                        <Input className="system-input " />
                                    ))*/}
                                </FormItem>
                                <FormItem
                                    label={emailText}
                                    labelCol={{ span: 9 }}
                                    wrapperCol={{ span: 13 }}
                                >
                                    <span>{userDetail.email}</span>
                                    {/*getFieldDecorator('email', {
                                        rules: [{
                                            type: 'email', message: pleaseInputCorrect
                                        }, { 
                                            required: true, message: pleaseInput,
                                        }],
                                        initialValue: userDetail.email
                                    })(
                                        <Input className="system-input" />
                                    )*/}
                                </FormItem>
                                {/*
                                <Row className="mt25" type="flex" justify="center">
                                    <Col>
                                        {<Button htmlType="submit" type="primary" className="system-btn product-save-btn">{btnSaveText}</Button>}
                                    </Col>
                                </Row>
                                */}
                            </Col>
                            <Col span={11} offset={1} className="mt15">
                                <Upload {...imgProps} >
                                    {
                                        avatar ?
                                            <img src={avatar} alt="" className="avatar" /> :
                                            <Icon type="plus" className="avatar-uploader-trigger" />
                                    }
                                </Upload>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div >
        );
    }
}


const WrappedPersonMessage = Form.create()(PersonMessage);

export default connect(state => {
    return {
        ...{
            userDetail: state.mainPage.userDetail,
            avatar: state.mainPage.avatar
        },

    }
})(WrappedPersonMessage)