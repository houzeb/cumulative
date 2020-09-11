/**
  * author: xielingjuan@zhongan.Icon
  * description: 资源管理
  * date: 2017/11/26
  */

import React from 'react'
import TreeDom from '../../component/TreeDom';
import ResourceResult from './resource-result';
import mirror, { actions, connect } from 'mirrorx'
import { Row, Col, Form, Icon } from 'antd';

class ResourceManage extends React.Component {
    super(props) {
        this.props = props;
    }
    render() {
        const { resourceResult } = this.props;
        return (
            <div>
                <div className="pb15 search-result-back">
                    <div >
                        <span className="mr5 strong">{window.LangMessage.system_settings || '系统设置'}</span>
                        <Icon type="right" />
                        <span className="ml5">{window.LangMessage.resource_manage || '资源管理'}</span>
                    </div>
                </div>
                <div className="main-resource">
                    <Row>
                        <Col span={6}>
                            <TreeDom type="resource"></TreeDom>
                        </Col>
                        <Col span={18}>
                            <ResourceResult resourceResult={resourceResult} />
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default connect(state => {
    return {
        resourceResult: state.treeDom.resourceResult
    }
})(ResourceManage)