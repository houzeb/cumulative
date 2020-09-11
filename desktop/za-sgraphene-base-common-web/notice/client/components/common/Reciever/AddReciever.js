/*
 * @Author: za-yanqing
 * @Date: 2018-08-27 16:20:14
 * @Description: '理赔领款人业务新增领款人'
 * @Last Modified by: za-xudong
 * @Last Modified time: 2018-09-28 10:54:16
 * @ToDo: ''
 */
import React, { Component } from 'react';
import { Modal } from 'antd';
import propType from 'prop-types';

class RecieverModal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { visible, onCancel, children, onSubmit } = this.props;
        return (
            <Modal
                title="新增领款人"
                visible={visible}
                onOk={onSubmit}
                onCancel={onCancel}
                width={1030}
                centered
            >
                { children }
            </Modal>
        );
    }
}

RecieverModal.propTypes = {
    visible: propType.bool, // modal框的显示和隐藏
    onCancel: propType.func, // 取消的事件
    children: propType.object, // 传入的dom
    onSubmit: propType.func,

};

export default RecieverModal;
