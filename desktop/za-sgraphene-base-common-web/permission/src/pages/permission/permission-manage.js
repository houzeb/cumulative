import React from 'react'
import TreeDom from '../../component/TreeDom';
import PermissionResult from './permission-result';
import mirror, { actions, connect } from 'mirrorx'
import { Row, Col, Form, Icon } from 'antd';

class PermissionManage extends React.Component {
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
                        <span className="ml5">{window.LangMessage.rights_manage || '权限管理'}</span>
                    </div>
                </div>
                <div className="main-resource">
                    <Row>
                        <Col span={6}>
                            <TreeDom type="permission"></TreeDom>
                        </Col>
                        <Col span={18}>
                            <PermissionResult resourceResult={resourceResult} />
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}
const WrappedPermissionManage = Form.create()(PermissionManage);

export default connect(state => {
    return {
        resourceResult: state.treeDom.resourceResult
    }
})(WrappedPermissionManage)