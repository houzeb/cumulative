/*
 * @Author: za-zhouzhe
 * @Date: 2018-07-12 11:14:14
 * @Description: '查询组件'
 * @Last Modified by: za-weilin
 * @Last Modified time: 2018-12-27 13:40:07
 * @ToDo: ''
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'antd';
import FormItemDom from '../FormItemDom';

class QueryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onSubmit(values);
            }
        });
    }
    // 重置表单数据
    handleReset = () => {
        this.props.form.resetFields();
    }
    render() {
        const { LANG } = this.props.state;
        const { col, hideRequiredMark } = this.props;
        const formLayout = 'vertical';
        const colClass = `col-${col}-item`;
        return (
            <div>
                <Form layout={formLayout} hideRequiredMark={hideRequiredMark} className={` ${colClass}`} onSubmit={this.handleSubmit}>
                    <FormItemDom formItemData={this.props.formItem} form={this.props.form} {...this.props} />
                    <div className="button-group">
                        {this.props.reset && <Button type="default" onClick={this.handleReset}>{LANG['btn_reset']}</Button>}
                        {this.props.submit && <Button type="primary" htmlType="submit">{LANG['btn_search']}</Button>}
                    </div>
                </Form>
            </div>
        );
    }
}

QueryForm.propTypes = {
    'form': PropTypes.object,
    'onSubmit': PropTypes.func,
    'formItem': PropTypes.array,
    'state': PropTypes.object,
    'reset': PropTypes.bool,
    'submit': PropTypes.bool,
    'col': PropTypes.number,
};
QueryForm.defaultProps = {
    'onSubmit': () => { },
    'reset': true,
    'submit': true,
    'col': 3,
};
const WrappedQueryForm = Form.create()(QueryForm);
export default WrappedQueryForm;
