/**
  * author: xielingjuan@zhongan.Icon
  * description: 资源管理-数据资源
  * date: 2017/11/26
  */
import React from 'react'
import SelectDom from '../../component/SelectDom'
import DTable from '../../component/DTable';
import mirror, { actions, connect } from 'mirrorx'
import { Row, Col, Button, Input, Form, Table, Modal } from 'antd';
import { setTimeout } from 'timers';
const FormItem = Form.Item;

mirror.model({
    name: 'systemDataResource',
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
        formatVisible: false,
        resourceDefinitionColumns: [],
        resourceDefinitionData: [],
        isShowEditTable: false,
        editColumns: [
            {
                title: window.LangMessage.text_index || '序号',
                dataIndex: 'Id',
                key: 'Id',
                message: '',
                error: false,
                class: '',
                type: 'String'  // Number/String/Interval
            }
        ],
        editData: []

    }
    // 打开弹窗，查看数据资源定义
    addBtnShowModal = () => {
        this.setState({
            addBtnVisible: true,
        });
    }
    // 新增数据资源
    handleSubmit = (e) => {
        e.preventDefault();
        const parentResourceId = +T.urlQuery('resourceId') || '';
        const editTableData = this.refs.dtable && this.refs.dtable.validatorData() || {};

        if (editTableData.column) {
            if (editTableData.column.length <= 1 && editTableData.data.length) {
                // 有行，但是只有一列
                T.showError(window.LangMessage.resource_least_two_columns || '资源定义至少要有两列');
                return;
            }
            if (editTableData.column.length > 1 && editTableData.data.length === 0) {
                // 有至少两列，但是没有行
                T.showError(window.LangMessage.resource_add_least_one_line || '资源定义至少要添加一行');
                return;
            }
            const hasSameColumn = this.checkHasSameColumn(editTableData);
            if (hasSameColumn) {
                // 有重复的列名
                T.showError(window.LangMessage.cannot_duplicate_column_names || '不能有重复的列名');
                return;
            }
            const isAllRight = editTableData.result;
            if (!isAllRight) {
                // 有没有填或者错误格式的值
                return;
            }
            // 后端校验 ：第一列不能有重复的值 && 除了第一列之外的其他列每行的值至少有一个不一样（不能完全一样）
        }
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const ajaxData = this.formatHandleSubmitData(values, editTableData)
                T.fetch({
                    url: 'resource/saveBussDataResource',
                    data: {
                        ...ajaxData,
                        parentResourceId: parentResourceId
                    }
                }).then(res => {
                    if (res && res.success) {
                        T.showSuccess(window.LangMessage.submit_success || '提交成功');
                        actions.treeDom.getResourceDetail({ resourceId: parentResourceId })
                        setTimeout(() => {
                            this.handleAddCancel();
                        }, 800)
                    }
                })

            }
        });
    }
    checkHasSameColumn = (data) => {
        const arr = [];
        data.column.map((item, index) => {
            arr.push(item.title);
        });
        // 判断是否有重复的列
        const hash = {};
        for (let i in arr) {
            if (hash[arr[i]])
                return true;
            hash[arr[i]] = true;
        }
        return false;
    }
    formatHandleSubmitData = (values, editTableData) => {
        const obj = {};
        // 资源定义非必传
        if (editTableData.data && editTableData.data.length) {
            const factors = [];
            let results = '';
            editTableData.column.map((item, index) => {
                if (index === 0) {
                    results = item.title;
                    return;
                }
                factors.push({
                    bussDataType: item.type.toUpperCase(),
                    factorName: item.title
                })
                //factors[item.title] = item.type.toUpperCase();
            })
            const resourceExtendValueRequestDTOList = [];
            editTableData.data.map(item => {
                const factorsObj = {};
                const resultsObj = {};
                editTableData.column.map((columnItem, columnIndex) => {
                    if (columnIndex === 0) {
                        resultsObj[columnItem.title] = item[columnItem.key];
                        return;
                    }
                    Object.keys(item).map((iiitem, iiidex) => {
                        if (iiitem === columnItem.key) {
                            factorsObj[columnItem.title] = item[iiitem];
                        }
                    })
                })
                resourceExtendValueRequestDTOList.push({
                    delFlag: false,
                    factors: factorsObj,
                    results: resultsObj
                })
            })
            obj.resourceExtendRequestDTO = {
                factors: factors,
                results: results
            }
            obj.resourceExtendValueRequestDTOList = resourceExtendValueRequestDTOList;
        }
        return {
            ...obj,
            resourceName: values.resourceName,
            resourceCode: values.resourceCode,
            resourceType: "BUSINESS_DATA",
            description: values.description,
        }
    }
    // 查看数据资源定义 
    checkBtnShowModal = (resourceId) => {
        this.setState({
            checkBtnVisible: true,
        });
        T.fetch({
            url: 'resource/queryBussDataResource',
            data: {
                resourceId: resourceId
            }
        }).then(res => {
            if (res &&
                res.success &&
                res.value &&
                res.value.resourceExtendValueResponseDTOList) {
                const value = res.value.resourceExtendValueResponseDTOList;
                this.formatResourceDefinition(value);
            }
        })
    }
    formatResourceDefinition = (data) => {
        const resourceDefinitionColumns = [];
        const resourceDefinitionData = [];

        data.map((item, index) => {
            const objFactors = JSON.parse(item.factors);
            const objResults = JSON.parse(item.results);
            const arr = [];
            Object.keys(objFactors).map((item, index) => {
                arr.push({
                    [item]: objFactors[item]
                })
            })
            arr.unshift(objResults);

            const obj = {};
            arr.map((child, childIndex) => {
                const childKey = Object.keys(child)[0];
                const childValue = Object.values(child)[0];
                if (index === 0) {
                    resourceDefinitionColumns.push({
                        title: childKey,
                        key: childKey,
                        dataIndex: childKey,
                        width: 180
                    })
                }
                obj[childKey] = childValue;
            })
            resourceDefinitionData.push({
                key: index,
                ...obj
            })
        })
        this.setState({
            resourceDefinitionColumns: resourceDefinitionColumns,
            resourceDefinitionData: resourceDefinitionData
        })
    }
    // 取消编辑
    handleCancel = () => {
        this.setState({
            checkBtnVisible: false,

        });
        setTimeout(() => {
            this.setState({
                resourceDefinitionColumns: [],
                resourceDefinitionData: []
            });
        }, 0)
    }
    handleAddCancel = () => {
        this.setState({
            addBtnVisible: false,
            editColumns: [
                {
                    title: window.LangMessage.text_index || '序号',
                    dataIndex: 'Id',
                    key: 'Id',
                    message: '',
                    error: false,
                    class: '',
                    type: 'String'  // Number/String/Interval
                }
            ],
            editData: []
        });
        this.props.form.resetFields();
    }
    //格式设置弹框
    formatsetShow = () => {
        this.setState({
            formatVisible: true,
        });
    }
    formatHandleOk = (e) => {
        this.setState({
            formatVisible: false,
        });
    }
    formatHandleCancel = (e) => {
        this.setState({
            formatVisible: false,
        });
    }
    isShowEditTable = (value) => {
        this.setState({
            isShowEditTable: value
        })
    }
    checkResourceName = (rule, value, callback) => {
        const form = this.props.form;
        const pattern = /^([A-Za-z0-9\s\-\_])+$/;
        if (!value || !value.trim().length) {
            callback('请输入资源编码');
        }
        else if (!pattern.test(value.trim())) {
            callback(window.LangMessage.please_enter_more_combination || '请输入大小写字母、数字、空格、-、_的组合');
        }
        callback();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { dataSource } = this.props;
        const { addBtnVisible, checkBtnVisible, resourceDefinitionData, resourceDefinitionColumns, editColumns, editData } = this.state;

        // 数据资源表格表头
        const columns = [{
            title: window.LangMessage.text_index || '序号',
            dataIndex: 'key',
        }, {
            title: window.LangMessage.resource_type || '资源类型',
            dataIndex: 'resourceTypeName',
        }, {
            title: window.LangMessage.resource_name || '资源名称',
            dataIndex: 'resourceName',
        }, {
            title: window.LangMessage.resource_code || '资源编码',
            dataIndex: 'resourceCode',
        }, {
            title: window.LangMessage.resource_definitions || '资源定义',
            dataIndex: 'resourceDefinition',
            render: (text, record) => (
                <span>
                    <a href="javascript:void(0)" onClick={() => this.checkBtnShowModal(record.resourceId)}>
                        {window.LangMessage.btn_look || '查看'}</a>
                    <Modal
                        wrapClassName="vertical-center-modal"
                        title={window.LangMessage.resource_definitions || "资源定义"}
                        footer={null}
                        visible={checkBtnVisible}
                        onCancel={this.handleCancel}
                    >

                        <Table pagination={false} bordered columns={resourceDefinitionColumns} dataSource={resourceDefinitionData} size="small" scroll={{ x: true }} />


                    </Modal>
                </span>
            ),
        }];
        const resourceTypeList = [{
            id: 'BUSINESS_DATA',
            value: window.LangMessage.business_data || '业务数据'
        }];// 数据资源类型，目前只有一个【业务数据】，写死。
        return (
            <div className="mt15 greenFont">
                <Row className="filterBox mb15" type="flex" justify="end">
                    <Col>
                        <Button onClick={this.addBtnShowModal} type="primary" className="product-btn product-save-btn">
                            {window.LangMessage.btn_add || '新增'}</Button>
                        <Modal
                            wrapClassName="vertical-center-modal"
                            title={window.LangMessage.new_data_resources || "新增数据资源"}
                            footer={null}
                            visible={addBtnVisible}
                            onCancel={this.handleAddCancel}
                        >
                            <Form className="person-form former" onSubmit={this.handleSubmit}>
                                <Row className="mt5" type="flex" justify="start">
                                    <Col span={24}>
                                        <FormItem
                                            label={window.LangMessage.resource_type || "资源类型"}
                                            labelCol={{ span: 11 }}
                                        >
                                            {getFieldDecorator('resourceType', {
                                                initialValue: 'BUSINESS_DATA'
                                            })(
                                                <SelectDom list={resourceTypeList} className="system-input " disabled />
                                            )}

                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row className="mt5" type="flex" justify="start">
                                    <Col span={24}>
                                        <FormItem
                                            label={window.LangMessage.resource_name || "资源名称"}
                                            labelCol={{ span: 11 }}
                                        >
                                            {getFieldDecorator('resourceName', {
                                                rules: [{
                                                    required: true,
                                                    message: '请输入资源名称',
                                                }],
                                            })(
                                                <Input placeholder={'请输入资源名称'} maxLength="45" />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row className="mt5" type="flex" justify="start">
                                    <Col span={24}>
                                        <FormItem
                                            label={window.LangMessage.resource_code || "资源编码"}
                                            labelCol={{ span: 11 }}
                                        >
                                            {getFieldDecorator('resourceCode', {
                                                rules: [{
                                                    required: true,
                                                    validator: this.checkResourceName
                                                    // message: window.LangMessage.text_input || '请输入资源编码',
                                                }],
                                            })(
                                                <Input placeholder={'请输入资源编码'} maxLength="45" />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row className="mt5" type="flex" justify="start">
                                    <Col span={24}>
                                        <FormItem
                                            label={window.LangMessage.resource_description || "资源描述"}
                                            labelCol={{ span: 11 }}
                                        >
                                            {getFieldDecorator('description', {
                                            })(
                                                <Input placeholder={'请输入资源描述'} maxLength="45" />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row className="mt5" type="flex" justify="start">
                                    <Col span={24}>
                                        <FormItem
                                            label={window.LangMessage.resource_definitions || "资源定义"}
                                            labelCol={{ span: 11 }}
                                        >
                                            {getFieldDecorator('resourceDefinition', {
                                            })(
                                                this.state.isShowEditTable ? (
                                                    <span className="showUnfold" onClick={() => this.isShowEditTable(false)}>
                                                        <span>{window.LangMessage.pack_up || '收起'}</span>
                                                        <i className="za-icon-arrow-up"></i>
                                                    </span>
                                                ) : (
                                                        <span className="showUnfold" onClick={() => this.isShowEditTable(true)}>
                                                            <span>{window.LangMessage.unfold || '展开'}</span>
                                                            <i className="za-icon-arrow-down"></i>
                                                        </span>
                                                    )
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                {
                                    this.state.isShowEditTable &&
                                    <Row className="editTable" type="flex" justify="start">
                                        <Col span={24}>
                                            <DTable ref="dtable" columns={editColumns} tableData={editData} />
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
                    </Col>
                </Row>
                <Table pagination={false} bordered columns={columns} dataSource={dataSource} />
            </div>
        )

    }
}

const WrappedDataResource = Form.create()(DataResource);

export default connect(state => {
    return state.systemDataResource
})(WrappedDataResource)
