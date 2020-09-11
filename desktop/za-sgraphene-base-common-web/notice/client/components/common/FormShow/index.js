/*
 * @Author: za-zhouzhe
 * @Date: 2018-07-12 11:14:14
 * @Description: '查询组件'
 * @Last Modified by: za-huxiaoyan
 * @Last Modified time: 2018-12-07 15:56:13
 * @ToDo: ''
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
const FormItem = Form.Item;

class FormShow extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderFormItem = () => {
        const { formItem } = this.props;
        const formItemLayout = {
            // labelCol: { span: 10 },
            // wrapperCol: { span: 14 },
        };
        return formItem.map((item, index) => {
            if (item.type === 'space') {
                return <FormItem key={index} />;
            } else {
                return (
                    <FormItem key={index} {...formItemLayout} label={`${item.label}：`}><span>{item.value || '-'}</span></FormItem>
                );
            }
        });
    }

    render() {
        return (
            <div className='formShow-dialog block'>
                <Form layout='horizontal' onSubmit={this.handleSubmit} style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {this.renderFormItem()}
                </Form>
            </div>
        );
    }
}

FormShow.propTypes = {
    'formItem': PropTypes.array,
};
FormShow.defaultProps = {
    'formItem': [],
};
const WrappedFormShow = Form.create()(FormShow);
export default WrappedFormShow;
