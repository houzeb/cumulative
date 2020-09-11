/**
  * author: xielingjuan@zhongan.Icon
  * description: 资源管理-数据资源
  * date: 2017/11/26
  */
import React from 'react'
import ReactDOM from 'react-dom'
import SelectDom from '../../component/SelectDom';
import mirror, { actions, connect } from 'mirrorx'
import { Row, Col, Button, Input, Form, Select, Table, Icon, Tabs, Modal, Checkbox } from 'antd';
import { setTimeout } from 'timers';
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const confirm = Modal.confirm;

mirror.model({
    name: 'systemDataPermission',
    initialState: {

    },
    reducers: {

    },
    effects: {

    }
})

class DataResource extends React.Component {

    super(props) {
        this.props = props;
    }
    state = {
        addBtnVisible: false,
        checkBtnVisible: false,
        resourceDefinitionColumns: [],
        resourceDefinitionData: [],
        resourceCheckData: [],
        modalData: {}, // 编辑弹窗数据
        selectedRows: [], // 弹窗中表格选中的行 
        canSelectDataResource: true, // 编辑时固定死。新增时可选
        selectedRowKeys: [],
        isAdd: true ,// 是否新增按钮
        priviledgeId: ''
    }
    // 保存数据权限
    handleSubmit = (e) => {
        e.preventDefault();
        const parentResourceId = +T.urlQuery('resourceId');
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.state.resourceDefinitionData.length > 0 && this.state.selectedRowKeys.length <= 0) {
                    // 有资源定义，则必须勾选一个。否则不必须。
                    T.showError(window.LangMessage.please_least_check_one || '请至少勾选一个权限');
                    return;
                }
                const selectedRows = this.formatSelectedRows(this.state.selectedRows);
                const isAppend = this.state.isAdd;
                const priviledgeId = this.state.isAdd ? '' : this.state.priviledgeId;
                T.fetch({
                    url: 'resource/savePriviledge',
                    data: {
                        "priviledges":
                            [
                                {
                                    "priviledgeName": values.priviledgeName,
                                    "priviledgeId": priviledgeId,
                                    "resourceId": +values.resourceId,
                                    "resourceExtendValue": selectedRows,
                                    "operateType": "WRITE",
                                    "resourceType": "BUSINESS_DATA",
                                    
                                }
                            ],
                        append: isAppend
                    }
                }).then(res => {
                    if (res && res.success) {
                        setTimeout(() => {
                            this.handleCancel();
                        }, 800);
                        actions.treeDom.getResourceDetail({ resourceId: parentResourceId });
                        T.showSuccess(window.LangMessage.request_success || '请求成功');
                    }
                })

            }
        });
    }
    // 把表格数据格式化再保存,返回[1,2,3]格式
    formatSelectedRows = (data) => {
        return data.map(item => {
            return item.id
        });
    }
    // 查看数据资源定义 
    checkBtnShowModal = (record) => {
        this.setState({
            checkBtnVisible: true,
        });
        T.fetch({
            url: 'resource/queryPriviledge',
            data: {
                resourceId: +record.resourceId,
                priviledgeId: record.priviledgeId
            }
        }).then(res => {
            if (res &&
                res.success && res.value && res.value[0] &&  res.value[0].resourceBussDataResponseDTO) {
                const value = res.value[0];
                const resourceExtendValueResponseDTOList = value.resourceBussDataResponseDTO && value.resourceBussDataResponseDTO.resourceExtendValueResponseDTOList;
                this.formatResourceDefinition(resourceExtendValueResponseDTOList);
            }
        })
    }
    // 编辑 || 新增
    addBtnShowModal = (record) => {
        this.setState({
            modalData: {},
            addBtnVisible: true,
            isAdd: record ? false : true
        })
        if (record) {
            this.queryPriviledge(record);
            this.setState({
                priviledgeId: record.priviledgeId
            })
        }
    }
    // 请求数据权限详情
    queryPriviledge = (record) => {
        const resourceId = record.resourceId || T.urlQuery('resourceId');
        this.setState({
            modalData: {}
        })
        T.fetch({
            url: 'resource/queryPriviledge',
            data: {
                resourceId: +resourceId,
                priviledgeId: record.priviledgeId
            }
        }).then(res => {

            if (res &&
                res.success && res.value) {
                const value = res.value[0];
                const resourceExtendValueResponseDTOList = value.resourceBussDataResponseDTO && value.resourceBussDataResponseDTO.resourceExtendValueResponseDTOList || '';
                if (resourceExtendValueResponseDTOList) {
                    this.formatResourceDefinition(resourceExtendValueResponseDTOList);
                }
                
                const modalData = {
                    resourceId: value.resourceId + '',
                    priviledgeName: value.priviledgeName
                }
                this.setState({
                    modalData: modalData,
                    canSelectDataResource: false // 编辑时，disabled数据资源
                })
            }
        })
    }
    // 格式化数据权限详情
    formatResourceDefinition = (data) => {
        const resourceDefinitionColumns = [];
        const resourceDefinitionData = [];
        const selectedRowKeys = [];
        const resourceCheckData = [];
        this.setState({
            resourceDefinitionColumns: [],
            resourceDefinitionData: [],
            selectedRowKeys: [],
            resourceCheckData: []
        })
        const resultsKey = Object.keys(JSON.parse(data[0].results))[0];
        resourceDefinitionColumns.push({
            title: resultsKey,
            key: resultsKey,
            dataIndex: resultsKey
        })
        data.map((item, index) => {
            const result = JSON.parse(item.results);
            
            const obj = JSON.parse(item.factors);
            Object.keys(obj).map((child, childIndex) => {
                if (index === 0) {

                    resourceDefinitionColumns.push({
                        title: child,
                        key: child,
                        dataIndex: child
                    })
                }
            })
            resourceDefinitionData.push({
                key: index,
                ...obj,
                ...item,
                ...result
            })
        })

        resourceDefinitionData.map((item, index) => {
            if (item.selectedFlag) {
                selectedRowKeys.push(index);
                resourceCheckData.push({
                    ...item
                })
            }
        })
        this.setState({
            resourceDefinitionColumns: resourceDefinitionColumns,
            resourceDefinitionData: resourceDefinitionData,
            selectedRowKeys: selectedRowKeys,
            resourceCheckData: resourceCheckData
        })

    }
    // 删除数据权限
    deleteBtnShowModal = (data) => {
        const parentResourceId = +T.urlQuery('resourceId');
        confirm({
            title: window.LangMessage.determine_delete_resource || '确定删除该资源？',
            content: window.LangMessage.delete_tip || '删除后无法恢复',
            okText: window.LangMessage.ok_text || '确定',
            cancelText: window.LangMessage.cancle_text || '取消',
            onOk: () => {
                T.fetch({
                    url: 'resource/savePriviledge',
                    data: {
                        priviledges:
                            [
                                {
                                    priviledgeId: data.priviledgeId,
                                    operateType: "READ"
                                }
                            ]
                    }
                }).then(res => {
                    if (res && res.success) {
                        actions.treeDom.getResourceDetail({ resourceId: parentResourceId });
                        T.showSuccess(window.LangMessage.delete_success || '删除成功');
                    }
                })
            }
        })
    }
    // 取消编辑
    handleCancel = (e) => {
        this.setState({
            addBtnVisible: false,
            checkBtnVisible: false
        });
        setTimeout(() => {
            this.setState({
                resourceDefinitionColumns: [],
                resourceDefinitionData: [],
                canSelectDataResource: true
            });
            // 重置表格数据
            this.props.form.resetFields();
        },0)
    }
    renderDataTable = (data) => {

        // 数据资源表格表头
        const columns = [{
            title: window.LangMessage.permission_name || '权限名称',
            dataIndex: 'priviledgeName',
        }, {
            title: window.LangMessage.resource_name || '资源名称',
            dataIndex: 'resourceName',
        }, {
            title: window.LangMessage.resource_code || '资源编码',
            dataIndex: 'resourceCode',
        }, {
            title: window.LangMessage.handle || '操作',
            dataIndex: 'operate',
            render: (text, record) => (
                <span>
                    <a href="javascript:void(0)" onClick={() => this.checkBtnShowModal(record)}>
                    {window.LangMessage.check_detail || '查看明细'}</a>
                    <span className="ant-divider" />
                    <a href="javascript:void(0)" onClick={() => this.addBtnShowModal(record)}>
                    {window.LangMessage.text_edit || '编辑'}</a>
                    <span className="ant-divider" />
                    <a href="javascript:void(0)" onClick={() => this.deleteBtnShowModal(record)}>
                    {window.LangMessage.delete || '删除'}</a>
                    <Modal
                        wrapClassName="vertical-center-modal"
                        title={window.LangMessage.check_detail || "查看明细"}
                        footer={null}
                        visible={this.state.checkBtnVisible}
                        onCancel={this.handleCancel}
                    >

                        <Table pagination={false} bordered columns={this.state.resourceDefinitionColumns} dataSource={this.state.resourceCheckData} size="small" scroll={{ x: true }}/>

                    </Modal>
                </span>
            ),
        }];
        const dataSource = [];
        if (data) {
            data.map((item, index) => {
                if (item.priviledges &&
                    item.priviledges.length > 0) {
                    item.priviledges.map((child, childIndex) => {
                        if (child.operateType === 'WRITE') {
                            dataSource.push({
                                ...child,
                                key: index + '-' + childIndex
                            })
                        }
                    })
                }
            });
        }
        return (
            <Table pagination={false} bordered columns={columns} dataSource={dataSource} />
        )

    }
    // 查询资源权限。
    changeDataResource = (resourceId) => {
        T.fetch({
            url: 'resource/queryBussDataResource',
            data: {
                resourceId: +resourceId
            }
        }).then(res => {
            if (res &&
                res.success) {
                const value = res.value;
                const resourceExtendValueResponseDTOList = value.resourceExtendValueResponseDTOList;
                this.formatResourceDefinition(resourceExtendValueResponseDTOList);
            }
        })
    }
    checkPriviledgeName = (rule, value, callback) => {
        const form = this.props.form;
        const pattern = /^([A-Za-z0-9\s\-\_])+$/;
        if (!value || !value.trim().length) {
            callback('请输入权限名称');
        }
        else if (!pattern.test(value.trim())) {
            callback(window.LangMessage.please_enter_more_combination || '请输入大小写字母、数字、空格、-、_的组合');
        }
        callback();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { dataSource, dataSourceList } = this.props;
        const { addBtnVisible, checkBtnVisible, resourceDefinitionData, resourceDefinitionColumns, modalData } = this.state;


        // 数据资源类型，目前只有一个【业务数据】，写死。
        const resourceTypeList = [{
            id: 'BUSINESS_DATA',
            value: window.LangMessage.business_data || '业务数据'
        }];
        // 新增||编辑弹窗的表格selection
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRows: selectedRows,
                    selectedRowKeys: selectedRowKeys
                });
            },
            selectedRowKeys: this.state.selectedRowKeys
        };
        return (
            <div className="mt15 greenFont">
                <Row className="filterBox mb15" type="flex" justify="end">
                    <Col>
                        <Button onClick={() => this.addBtnShowModal()} type="primary" className="product-btn product-save-btn">
                        {window.LangMessage.btn_add || '新增'}</Button>
                    </Col>
                </Row>
                {/* 新增||编辑的modal */}
                <Modal
                    wrapClassName="vertical-center-modal"
                    title={this.state.isAdd ? window.LangMessage.new_data_permissions || "新增数据权限" : window.LangMessage.edit_data_permissions || "编辑数据权限"}
                    footer={null}
                    visible={addBtnVisible}
                    onCancel={this.handleCancel}
                >
                    <Form className="person-form former" onSubmit={this.handleSubmit}>

                        <Row className="mt5" type="flex" justify="start">
                            <Col span={24}>
                                <FormItem
                                    label={window.LangMessage.permission_name || "权限名称"}
                                    labelCol={{ span: 11 }}
                                    // wrapperCol={{ span: 11 }}
                                >
                                    {getFieldDecorator('priviledgeName', {
                                        initialValue: modalData.priviledgeName || '',
                                        rules: [
                                            {
                                                required: true,
                                                validator: this.checkPriviledgeName
                                            }
                                        ],
                                    })(
                                        <Input placeholder={'请输入权限名称'}  maxLength="45" />
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="mt5" type="flex" justify="start">
                            <Col span={24}>
                                <FormItem
                                    label={window.LangMessage.data_resources || "数据资源"}
                                    labelCol={{ span: 11 }}
                                    // wrapperCol={{ span: 11 }}
                                >
                                    {getFieldDecorator('resourceId', {
                                        initialValue: modalData.resourceId || '',
                                        rules: [{
                                            required: true, 
                                            message: '请选择数据资源',
                                        }],
                                    })(
                                        <Select
                                            placeholder={"请选择数据资源"}
                                            onChange={this.changeDataResource} 
                                            disabled={!this.state.canSelectDataResource}>
                                            {dataSourceList && dataSourceList.length > 0 && dataSourceList.map(item =>
                                                <Option key={item.id}>{item.value}</Option>
                                            )}
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        {
                            resourceDefinitionData.length > 0 &&
                            <Row className="editTable" type="flex" justify="start">
                                <Col span={24}>
                                    <Table pagination={false} rowSelection={rowSelection} bordered columns={resourceDefinitionColumns} dataSource={resourceDefinitionData} size="small" scroll={{ x: true }}/>
                                </Col>
                            </Row>
                        }

                        <Row className="mt25 mb10" type="flex" justify="center">
                            <Col>
                                {<Button htmlType="submit" type="primary" className="system-btn product-save-btn">
                                {window.LangMessage.save || '保存'}</Button>}
                            </Col>
                        </Row>
                    </Form>
                </Modal>

                {this.renderDataTable(dataSource)}

            </div>

        )

    }
}

const WrappedDataResource = Form.create()(DataResource);

export default connect(state => {
    return {
        dataSourceList: state.treeDom.dataSourceList
    }
})(WrappedDataResource)
