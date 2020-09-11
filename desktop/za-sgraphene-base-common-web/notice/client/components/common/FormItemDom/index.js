/*
 * @Author: za-xielingjuan
 * @Date: 2018-07-10 14:38:45
 * @Description: 表单项统一管理组件
 * @Last Modified by: za-huxiaoyan
 * @Last Modified time: 2019-01-04 16:25:55
 * @ToDo: ''
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Input, Form, DatePicker, Radio, Cascader } from 'antd';
import SelectDom from '../SelectDom';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

class FormItemDom extends React.Component {
    renderFormItem = (item) => {
        const { LANG } = this.props.state;
        const { getFieldDecorator } = this.props.form;
        let prefixSelector;
        switch (item.type) {
        case 'select':
            return <SelectDom allowClear={item.allowClear} disabled={item.disabled} list={item.list} placeholder={LANG['text_select']} onChange={item.onChange} idKey={(item.options && item.options.keyNickName) || 'dictValue'} valueKey={(item.options && item.options.valueNickName) || 'dictValueName'} labelInValue={(item.options && item.options.labelInValue) || false} />;
        case 'multipleSelect':
            return <SelectDom allowClear={item.allowClear} list={item.list} placeholder={LANG['text_select']} onChange={item.onChange} mode="multiple" idKey={(item.options && item.options.keyNickName) || 'dictValue'} valueKey={(item.options && item.options.valueNickName) || 'dictValueName'} labelInValue={(item.options && item.options.labelInValue) || false} />;
        case 'input':
            return <Input placeholder={LANG['text_input']} disabled={item.disabled} onBlur={item.onBlur} maxLength={item.maxLength} />;
        case 'inputGroup':
            prefixSelector = getFieldDecorator(item.prefixKey, {
            })(
                <SelectDom list={item.list} placeholder={LANG['text_select']} onChange={item.onChange} idKey={(item.options && item.options.keyNickName) || 'dictValue'} valueKey={(item.options && item.options.valueNickName) || 'dictValueName'} labelInValue={(item.options && item.options.labelInValue) || false} />
            );
            return <Input addonBefore={prefixSelector} placeholder={LANG['text_input']} />;
        case 'date':
            return <DatePicker allowClear={item.allowClear} placeholder={LANG['text_select']} showTime={item.showTime} format={item.format || 'YYYY-MM-DD'} onChange={item.onChange} disabledDate={item.disabledDate} disabledTime={item.disabledTime} />;
        case 'rangeDate':
            return <RangePicker />;
        case 'radio':
            return (
                <RadioGroup placeholder={LANG['text_select']} >
                    {item.list.map((radioItem, index) => {
                        return (
                            <Radio key={index} value={radioItem.key}>{radioItem.value}</Radio>
                        );
                    })}
                </RadioGroup>
            );
        case 'mark':
            return (
                <TextArea className="mark-content" placeholder={LANG['text_input']} style={item.style} maxLength={item.maxLength} />
            );
        case 'address':
            return (
                <Cascader placeholder={LANG['text_select']}
                    options={item.provinces}
                    loadData={item.loadAddress}
                    fieldNames={{ label: 'name', value: 'code', children: 'children' }}
                    onChange={item.addressChange}
                />
            );
        case 'space':
            return <span />;
        default:
            return <Input placeholder={LANG['text_input']} disabled={item.disabled} />;
        }
    }

    render() {
        const { formItemData, form } = this.props;
        const { getFieldDecorator } = form;
        return (
            formItemData.map((item, index) => {
                return (
                    <FormItem
                        className={item.size === 'oneline' ? 'oneline' : ''}
                        label={item.label}
                        key={index}
                    >
                        {getFieldDecorator(item.key, {
                            rules: item.rules,
                            initialValue: item.initialValue
                        })(
                            this.renderFormItem(item)
                        )}
                    </FormItem>
                );
            })
        );
    }
}

FormItemDom.propTypes = {
    formItemData: PropTypes.array,
    form: PropTypes.object,
    state: PropTypes.object,
};

export default FormItemDom;
