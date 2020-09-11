import React from 'react';
import PermissionFeature from './permission-feature';
import DataResource from './data-permission';
import mirror, { actions, connect } from 'mirrorx';
import { Row, Col, Form } from 'antd';
const FormItem = Form.Item;
class PermissionResult extends React.Component {
    super(props) {
        this.props = props;
    }

    render() {
        const { resourceResult, isShowFeatureResource } = this.props;
        const currentResource = resourceResult && resourceResult.currentResource || {};
        const { resourceName } = currentResource;
        const priviledgeName = currentResource && currentResource.priviledges && currentResource.priviledges.length > 0 && currentResource.priviledges[0].priviledgeName || '';
        const resourceMap = resourceResult && resourceResult.resourceMap || {}; // 要传入feature-resource的【功能权限】数据
        const dataSource = resourceMap['BUSINESS_DATA']; // 【数据权限】表格数据
        return (
            <div className="main-manage pb30">
                <Form className="manage-form" onSubmit={this.handleSubmit}>
                    <div className="manage-title">{window.LangMessage.permission_information || '权限信息'}</div>
                    <Row className="mt15" type="flex" justify="start">
                        <Col span={12}>
                            <FormItem
                                label={window.LangMessage.permission_name || "权限名称"}
                                labelCol={{ span: 9 }}
                                wrapperCol={{ span: 15 }}
                            >
                                <span>{priviledgeName}</span>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label={window.LangMessage.resources || "资源"}
                                labelCol={{ span: 9 }}
                                wrapperCol={{ span: 15 }}
                            >
                                <span>{resourceName}</span>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>

                {
                    // 判断resourceMap为非{}时展示功能资源
                    isShowFeatureResource && (
                        <div>
                            <div className="manage-title mt20">{window.LangMessage.functional_authority || '功能权限'}</div>
                            <PermissionFeature resourceMap={resourceMap} />
                        </div>
                    )
                }

                <div>
                    <div className="manage-title mt20">{window.LangMessage.data_access || '数据权限'}</div>
                    <DataResource dataSource={dataSource} />
                </div>

            </div>

        );
    }
}
const WrappedPermissionResult = Form.create()(PermissionResult);

export default connect(state => {
    return {
        isShowFeatureResource: state.treeDom.isShowFeatureResource
    }
})(WrappedPermissionResult)