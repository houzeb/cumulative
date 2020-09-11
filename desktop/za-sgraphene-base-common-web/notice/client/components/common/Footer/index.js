/*
 * @Author: za-xudong
 * @Date: 2018-08-31 15:44:04
 * @Description: '理赔底部 footer'
 * @Last Modified by: za-xudong
 * @Last Modified time: 2018-08-31 16:31:35
 * @ToDo: ''
 */
import React, { Component } from 'react';
import propType from 'prop-types';
import './index.less';

class Footer extends Component {
    renderContent = () => {
        const {rightContent} = this.props;
        return rightContent;
    }

    render() {
        // const { onClick } = this.props;
        return (
            <div className="claim-footer">
                <div className="footer">
                    {this.renderContent()}
                </div>
            </div>
        );
    }
}

Footer.propTypes = {
    rightContent: propType.any // 点击事件的传入
};
export default Footer;
