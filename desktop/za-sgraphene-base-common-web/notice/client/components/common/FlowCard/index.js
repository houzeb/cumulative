/*
 * @Author:
 * @Date: 2018-07-05 11:40:03
 * @Description: ''
 * @Last Modified by: za-huxiaoyan
 * @Last Modified time: 2018-11-15 16:21:18
 * @ToDo: ''
 * @example:  const FlowList = ['事故報告', '請求受付', '査定', '承認'];
 *            <FlowCard flowList={FlowList} current={1} type='normal' />
 */
import React, { Component } from 'react';
import { mapPropTypes } from '../../mapProps';
import { Icon } from 'antd';
import './index.less';

class FlowCard extends Component {
    render() {
        const { current, flowList, type } = this.props;
        let flowNode = (index, current) => {
            if (type === 'normal') {
                return (<div className={'number-node ' + ((index === current) ? 'active' : '')} >
                    {
                        index + 1
                    }
                </div>);
            } else {
                return (<div className={'number-node ' + ((index <= current) ? 'active' : '')} >
                    {
                        (index >= current) ? index + 1 : <Icon type='check' />
                    }
                </div>);
            }
        };
        let className = 'flow-container' + (type === 'normal' ? ' horizen' : '');
        return (
            <div className={className}>
                {flowList.map((item, index) => {
                    return (
                        <div key={index} className={'flow-node ' + ((index === current) ? 'active' : '')}>
                            {
                                flowNode(index, current)
                            }
                            <p>{item}</p>
                            {
                                type === 'normal' && <div className='lineae' />
                            }
                        </div>
                    );
                })}
            </div>
        );
    }
}

FlowCard.propTypes = mapPropTypes;
export default FlowCard;
