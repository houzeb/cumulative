/*
 * @Author: za-yanqing
 * @Date: 2018-08-27 23:50:33
 * @Description: '新增块的封装'
 * @Last Modified by: za-huxiaoyan
 * @Last Modified time: 2018-11-19 18:03:34
 * @ToDo: ''
 */
import React, { Component } from 'react';
import propType from 'prop-types';
import './index.less';

class BlockAdd extends Component {
    render() {
        const { onClick, disabled } = this.props;
        return (
            <div className={'add-reciever' + (disabled ? ' disabled' : '')} onClick={onClick}>
                <span>+</span>
                <span>新增</span>
            </div>
        );
    }
}

BlockAdd.propTypes = {
    disabled: propType.bool, // 是否禁止
    onClick: propType.func // 点击事件的传入
};
export default BlockAdd;
