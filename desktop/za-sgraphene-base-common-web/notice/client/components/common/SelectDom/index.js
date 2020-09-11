/*
 * @Author: za-xielingjuan
 * @Date: 2018-07-10 14:38:45
 * @Description: 选择框组件
 * @Last Modified by: za-weilin
 * @Last Modified time: 2018-12-19 17:31:00
 * @ToDo: ''
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Select, Icon } from 'antd';
import './index.less';
const Option = Select.Option;

class SelectDom extends React.Component {
    render() {
        const { list, idKey, valueKey, ...rest } = this.props;
        let selectDom = <Select allowClear {...rest} >
            {
                this.props.list.map((item, index) => {
                    return <Option key={index} value={item[idKey]}>
                        {item[valueKey]}
                    </Option>;
                })
            }
        </Select>;
        if (rest.showSearch) {
            return (
                <div className='search-select-dom'>
                    <Icon type="search" />
                    {selectDom}
                </div>
            );
        } else {
            return selectDom;
        }
    }
}

SelectDom.propTypes = {
    list: PropTypes.array,
    idKey: PropTypes.string,
    valueKey: PropTypes.string,
};

export default SelectDom;
