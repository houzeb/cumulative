/**
  * author: xielingjuan@zhongan.Icon
  * description: 资源管理-右侧资源结果页
  * date: 2017/11/26
  */

import React from 'react'
import ReactDOM from 'react-dom'
import FeatureResource from './feature-resource';
import DataResource from './data-resource';
import mirror, {actions, connect} from 'mirrorx'
import {Row,Col,Form} from 'antd';
const FormItem = Form.Item;

class ResourceResult extends React.Component {
    super(props) {
        this.props = props;
    } 
    render() {
      const { resourceResult, isShowFeatureResource } =  this.props;
      const {resourceId, resourceName, resourceCode, resourceType, url, sort, parentResourceId} = resourceResult.currentResource || {};
      const resourceMap = resourceResult.resourceMap || {}; // 要传入feature-resource的【功能资源】数据
      const dataSource = resourceMap['BUSINESS_DATA']; // 【数据资源】表格数据
      return (
        <div className="main-manage pb30">
            <Form className="manage-form">
                <div className="manage-title">{window.LangMessage.resource_information || '资源信息'}</div>
                <Row className="mt15" type="flex" justify="start">
                    <Col span={12}>
                        <FormItem
                            label={window.LangMessage.resources_id || "资源ID"}
                            labelCol={{ span: 9 }}
                        >
                            <span>{ resourceId}</span>
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label={window.LangMessage.resource_name || "资源名称"}
                            labelCol={{ span: 9 }}
                        >
                            <span>{resourceName}</span>
                        </FormItem>
                    </Col>
                </Row>
                <Row className="mt10" type="flex" justify="start">
                    <Col span={12}>
                        <FormItem
                            label={window.LangMessage.resource_code || "资源编码"}
                            labelCol={{ span: 9 }}
                        >
                            <span>{resourceCode}</span>
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label={window.LangMessage.resource_type || "资源类型"}
                            labelCol={{ span: 9 }}
                        >
                            <span>{resourceType}</span>
                        </FormItem>
                    </Col>
                </Row>
                <Row className="mt10" type="flex" justify="start">
                    <Col span={12}>
                        <FormItem
                            label="URL"
                            labelCol={{ span: 9 }}
                        >
                            <span>{url}</span>
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label={window.LangMessage.the_order || "顺序"}
                            labelCol={{ span: 9 }}
                        >
                            <span>{sort}</span>
                        </FormItem>
                    </Col>
                </Row>
                <Row className="mt10" type="flex" justify="start">
                    <Col span={12}>
                        <FormItem
                            label={window.LangMessage.superior_resource_id || "上级资源ID"}
                            labelCol={{ span: 9 }}
                        >
                            <span>{parentResourceId}</span>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            {
                // 判断resourceMap为非{}时展示功能资源
                isShowFeatureResource && (
                    <div>
                    <div className="manage-title mt20">{window.LangMessage.functional_resources || '功能资源'}</div>
                    <FeatureResource resourceMap={resourceMap}/>
                    </div>
                )
            }
            
            <div>
                <div className="manage-title mt20">{window.LangMessage.data_resources || '数据资源'}</div>
                <DataResource dataSource={dataSource}/>
            </div>
        </div>
      );
    }
}
const WrappedResourceResult = Form.create()(ResourceResult);

export default connect(state => {
    return {
        isShowFeatureResource: state.treeDom.isShowFeatureResource
    }
})(WrappedResourceResult)