/*
 * @Author: za-huoyanpeng
 * @Date: 2018-07-12 14:03:55
 * @Description: '左侧菜单组件'
 * @Last Modified by: za-yanqing
 * @Last Modified time: 2018-08-16 14:38:27
 * @ToDo: ''
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

const MenuItem = Menu.Item;

class CommonMenu extends React.Component {
    getMenuItems = () => {
        const data = this.props.data;
        return data.sort((x, y) => x.order - y.order).map(item => (
            <MenuItem key={item.path}>
                <Link to={item.path}>
                    <i className={`iconfont ${item.icon ? item.icon : 'icon-product-center'}`} />
                    <span>{item.name}</span>
                </Link>
            </MenuItem>
        ));
    }

    render() {
        return (
            <Menu
                theme={this.props.theme}
                mode={this.props.mode}
                selectedKeys={this.props.selectedKeys}
                onClick={(item) => this.props.onClick(item)}
            >
                {this.getMenuItems()}
            </Menu>
        );
    }
}

CommonMenu.propTypes = {
    'data': PropTypes.array.isRequired,
    'theme': PropTypes.string,
    'mode': PropTypes.string,
    'selectedKeys': PropTypes.array.isRequired,
    'onClick': PropTypes.func.isRequired
};

CommonMenu.defaultProps = {
    'theme': 'light',
    'mode': 'inline',
    'data': []
};

export default CommonMenu;
