/*
 * @Author: za-zhouzhe
 * @Date: 2018-07-12 11:14:14
 * @Description: '新增表单组件'
 * @Last Modified by: za-zhouzhe
 * @Last Modified time: 2018-08-15 14:43:36
 * @ToDo: ''
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'antd';
import request from '../../../request';
import FormItemDom from '../FormItemDom';

class AddForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formulaFormItem: [{
                label: this.props.state.LANG['formula_category'],
                key: 'formulaType',
                type: 'select',
                onChange: this.queryFormulaData,
                list: [],
                options: {
                    keyNickName: 'formulaTableTypeId',
                    valueNickName: 'formulaTypeName'
                }
            },
            {
                label: this.props.state.LANG['formular_name'],
                key: 'survivalPaymentFormula',
                type: 'select',
                list: [],
                options: {
                    keyNickName: 'formulaCode',
                    valueNickName: 'formulaName'
                },
                rules: [{
                    required: true,
                    message: '请选择领取方式'
                }]
            }]
        };
    }
    componentDidMount() {
        if (this.props.hasFormula) {
            this.getFomula();
            this.queryFormulaData();
        }
    }
    // 获取公式分类
    getFomula = () => {
        const formulaFormItem = this.state.formulaFormItem;
        request.queryFormulaType({})
            .then(res => {
                if (res && res.success && res.value) {
                    formulaFormItem.forEach((item, index) => {
                        if (item.key === 'formulaType') {
                            formulaFormItem[index].list = res.value;
                        }
                    });
                    return formulaFormItem;
                }
            })
            .then(formulaFormItem => {
                this.setState({
                    formulaFormItem
                });
            });
    }
    // 获取公式名称
    queryFormulaData = (data) => {
        const formulaFormItem = this.state.formulaFormItem;
        this.props.form.setFields({ survivalPaymentFormula: '' });
        data = data ? { formulaType: data } : {};
        request.queryFormulaData(data)
            .then(res => {
                if (res && res.success && res.value) {
                    formulaFormItem.forEach((item, index) => {
                        if (item.key === 'survivalPaymentFormula') {
                            formulaFormItem[index].list = res.value;
                        }
                    });
                    return formulaFormItem;
                }
            })
            .then(formulaFormItem => {
                this.setState({
                    formulaFormItem
                });
            });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onSubmit(values);
            }
        });
    }
    render() {
        const { LANG } = this.props.state;
        const formLayout = 'vertical';
        const formulaFormItem = this.state.formulaFormItem;
        return (
            <div>
                <Form layout={formLayout} className="former" onSubmit={this.handleSubmit}>
                    {
                        <FormItemDom formItemData={this.props.formItem} form={this.props.form} {...this.props} />
                    }
                    {
                        this.props.hasFormula && formulaFormItem &&
                        <div>
                            <FormItemDom formItemData={formulaFormItem} form={this.props.form} {...this.props} />
                            <Button type="outline" size="default" style={{ verticalAlign: 'bottom' }}><i className="anticon anticon-plus" /><span>{LANG['add_formula']}</span></Button>
                        </div>
                    }
                    <div className="buttonBar_left">
                        <Button type="primary" htmlType="submit">{LANG['fd_add_new']}</Button>
                    </div>
                </Form>
            </div>
        );
    }
}

AddForm.propTypes = {
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    formItem: PropTypes.array,
    hasFormula: PropTypes.bool,
    state: PropTypes.object,
};
AddForm.defaultProps = {
    'onSubmit': () => {},
};
const WrappedAddForm = Form.create()(AddForm);
export default WrappedAddForm;
