/*
 * @Author: za-yanqing
 * @Date: 2018-08-24 16:20:14
 * @Description: '理赔右侧功能导航固钉块'
 * @Last Modified by: za-weilin
 * @Last Modified time: 2018-09-19 11:19:18
 * @ToDo: ''
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import propType from 'prop-types';
import './index.less';

class FixedNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrow: 'down',
            active: false
        };
    }
    render() {
        const { arrow, active } = this.state;
        const { position, icon, data } = this.props;
        // 鼠标悬浮显示下拉
        const onMouseEnterHandler = () => {
            this.setState({
                arrow: 'up',
                active: true
            });
        };
        // 鼠标移除隐藏
        const onMouseLeaveHandler = () => {
            this.setState({
                arrow: 'down',
                active: false
            });
        };
        return (
            <div className="fixed-nav" onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}>
                <div className="fixed-nav-btn">
                    <i className={`iconfont ${icon}`} />
                </div>
                <div className="fixed-nav-arrow">
                    <i className={`iconfont icon-chevron-${arrow}`} />
                </div>
                <ul className={`fixed-nav-menu ${active ? 'active' : ''}`} style={{ ...position }}>
                    {
                        data.map((item, index) => {
                            return (
                                <li key={index}>
                                    {item.link && <Link to={item.link}><i className={`iconfont ${item.icon}`} /><span>{item.text}</span></Link>}
                                    {item.onClick && <div onClick={item.onClick}><i className={`iconfont ${item.icon}`} /><span>{item.text}</span></div>}
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        );
    }
}

FixedNav.propTypes = {
    position: propType.object, // 位置（可fixed或absolute），类jsx写css语法
    icon: propType.string, // 主图标
    data: propType.array // 主数据数组，如：[{icon, link, text}]，含图标、链接、文本
};

export default FixedNav;
