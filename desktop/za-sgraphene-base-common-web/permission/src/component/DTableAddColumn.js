import React, { Component } from 'react';
import { Button, Form, Select, Modal, Input } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class createForm extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        const { visible, onCancel, onCreate, form } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                visible={visible}
                title={window.LangMessage.increase_column || "增加列"}
                okText={window.LangMessage.okText || "确定"}
                cancelText={window.LangMessage.cancle_text || '取消'}
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form>
                    <FormItem label={window.LangMessage.increase_type || "增加类型"}>
                        {getFieldDecorator('sort', {
                            initialValue: 'Number'
                        })(
                            <Select>
                                <Option value="Number">{window.LangMessage.manage_number || '数字'}</Option>
                                <Option value="String">{window.LangMessage.manage_text || '文字'}</Option>
                                <Option value="Interval">{window.LangMessage.manage_interval || '区间'}</Option>
                            </Select>
                            )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

const CollectionCreateForm = Form.create()(createForm);

export default CollectionCreateForm;