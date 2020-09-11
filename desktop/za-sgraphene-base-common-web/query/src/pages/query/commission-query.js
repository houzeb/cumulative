import React from 'react';
import ReactDOM from 'react-dom'
import SelectDom from '../../component/SelectDom';
import mirror, { actions, connect } from 'mirrorx'
import moment from 'moment';
import { Row, Col, Button, Input, Form, Select, Table, Icon, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


if (!actions.queryCustomerQuery) {
    mirror.model({
        name: 'queryCommissionQuery',
        initialState: {

        },
        reducers: {

        },
        effects: {

        }
    })
}
class CommissionQuery extends React.Component {
    super(props) {
        this.props = props;
    }
    state = {
        totalPage: 0,//总页数
        currentPage: 0,//当前页数
        pageSize: 10,//每页页数
        queryClaimsTable: [],
        filterOption: {},
        channelList: [],//渠道商
        transTypelList: [] //业务类型
    }
    componentDidMount() {
        this.selectTransType();
    }
    //业务类型
    selectTransType = (e) => {
        T.fetch({
            url: "/component/emum/list",
            data: { "moduleName": "common", "enumClassName": "TransTypeEnum" },
            method: 'post'
        }).then((res) => {
            console.log('TransTypeEnum............', res)
            this.setState({
                transTypelList: res.value
            })
        });
    }
    //查询 渠道号-保单号-业务类型
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.state.currentPage = 0
                this.setState({
                    currentPage: 0
                })
                if (values.product_name) {
                    const dataValues = {
                        channel_id: values.channel_id,
                        policy_no: values.policy_no,
                        product_name: values.product_name,
                        business_type: values.business_type
                    }
                    this.setState({
                        filterOption: dataValues
                    })
                    const params = {
                        "moduleName": "commission_product_db",
                        "data": JSON.stringify(dataValues),
                        "operatorId": "38005",
                        "pageSize": this.state.pageSize,
                        "currentPage": this.state.currentPage + 1,
                    }
                    T.fetch({
                        url: '/query/index',
                        data: params,
                        method: 'post'
                    }).then((result) => {
                        if (result.success) {
                            let fromString = result.value.data || {}
                            let fromJson = JSON.parse(fromString)
                            let fromData = fromJson.data || []
                            let pageData = fromJson || []

                            this.formatTableData(fromData)
                            this.setState({
                                queryClaimsTable: fromData,
                                currentPage: 0
                            })
                            this.setState({
                                totalPage: pageData.totalPage * this.state.pageSize
                            })
                        }
                    });
                } else if(values.channel_id || values.policy_no || values.business_type){
                    const dataValues = {
                        channel_id: values.channel_id,
                        policy_no: values.policy_no,
                        business_type: values.business_type
                    }
                    this.setState({
                        filterOption: dataValues
                    })
                    const params = {
                        "moduleName": "commission_db",
                        "data": JSON.stringify(dataValues),
                        "operatorId": "38005",
                        "pageSize": this.state.pageSize,
                        "currentPage": this.state.currentPage + 1,
                    }

                    T.fetch({
                        url: '/query/index',
                        data: params,
                        method: 'post'
                    }).then((result) => {
                        if (result.success) {
                            let fromString = result.value.data || {}
                            let fromJson = JSON.parse(fromString)
                            let fromData = fromJson.data || []
                            let pageData = fromJson || []

                            this.formatTableData(fromData)
                            this.setState({
                                queryClaimsTable: fromData,
                                currentPage: 0
                            })
                            this.setState({
                                totalPage: pageData.totalPage * this.state.pageSize
                            })
                        }
                    });
                }
            }
        });
    }
    formatTableData = (result) => {
        this.setState({
            queryClaimsTable: []
        })
        result.map((item, index) => {
            item.key = index + 1
            this.state.queryClaimsTable.push(item)
        })
        this.setState(this.state)
    }

    fetchResultTable = (values) => {
        const params = {
            "moduleName": "commission_db",
            "data": JSON.stringify(this.state.filterOption),
            "operatorId": "38005",
            "pageSize": this.state.pageSize,
            "currentPage": this.state.currentPage + 1,
        }
        T.fetch({
            url: '/query/index',
            data: params,
            method: 'post'
        }).then((result) => {
            if (result.success) {
                let fromString = result.value.data || {}
                let fromJson = JSON.parse(fromString)
                let fromData = fromJson.data || []
                let pageData = fromJson || []

                this.setState({
                    totalPage: pageData.totalPage * this.state.pageSize
                })
                this.formatTableData(fromData)
                this.setState({
                    queryCustomerTable: fromData
                })
            }
        });
    }

    handlePageChange = (currentPage, pageSize) => {
        this.setState({
            currentPage: currentPage - 1,
        }, this.fetchResultTable)
    }
    resetCondition = () => {
        this.props.form.resetFields()
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const general_search = window.LangMessage.general_search || '综合查询';
        const columns = [{
            title: window.LangMessage.text_index || '序号',
            dataIndex: 'key',
            render: (text, record) => <span>{text + this.state.pageSize * this.state.currentPage}</span>,
        }, {
            title: window.LangMessage.qu_distributors || "渠道商",
            dataIndex: 'channel_id',
        }, {
            title: window.LangMessage.label_policy_no || "保单号",
            dataIndex: 'policy_no',
        }, {
            title: window.LangMessage.qu_product_name || "产品名称",
            dataIndex: 'product_name',
        }, {
            title: window.LangMessage.qu_effective_date || "生效日期",
            dataIndex: 'effective_date',
            render: (text, record) => <span>{T.formatDate('yyyy-MM-dd', text)}</span>
        }, {
            title: window.LangMessage.qu_payment_date || "缴费日期",
            dataIndex: 'settle_date',
            render: (text, record) => <span>{T.formatDate('yyyy-MM-dd', text)}</span>
        }, {
            title: window.LangMessage.qu_business_type || "业务类型",
            dataIndex: 'business_type',
        }, {
            title: window.LangMessage.qu_premiums || "保费金额",
            dataIndex: 'premium_amount',
        }, {
            title: window.LangMessage.qu_commission_amount || "佣金金额",
            dataIndex: 'commission_amount',
        }];
        const paginationConfig = {
            onChange: this.handlePageChange,
            showQuickJumper: true,
            total: this.state.totalPage,
            defaultPageSize: this.state.pageSize,
            current: this.state.currentPage + 1
        }
        const formItemLayout = {
            // labelCol: { span: 6 },
            // wrapperCol: { span: 14 },
        };
        const channelIdList = [
            { id:1, value: window.LangMessage.PRODUCT_SELECT_SALECHANNEL_VALUE_1 || 'Broker1' },
            { id:2, value: window.LangMessage.PRODUCT_SELECT_SALECHANNEL_VALUE_2 || 'Broker2' },
            { id:3, value: window.LangMessage.PRODUCT_SELECT_SALECHANNEL_VALUE_3 || 'Broker3' },
            { id:4, value: window.LangMessage.PRODUCT_SELECT_SALECHANNEL_VALUE_4 || 'Broker4' },
        ]
        return (
            <div>
                <div className="pb15 search-result-back">
                    <div style={{ width: 300 }} onClick={() => actions.routing.push('/')}>
                        <span className="mr5 strong">{general_search}</span>
                        <Icon type="right" />
                        <span className="ml5">{window.LangMessage.qu_commission_query || '佣金查询'}</span>
                    </div>
                </div>
                <div className="user-management pb30">
                    <Form className="query-form pl20 pb20" onSubmit={this.handleSubmit} layout='vertical'>
                        <Row className="mt10" type="flex" justify="start">
                            <Col span={9}>
                                <FormItem
                                    label={window.LangMessage.qu_distributors || "渠道商"}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('channel_id', {
                                    })(
                                        <SelectDom
                                            placeholder={window.LangMessage.text_input || '请输入'}
                                            list={channelIdList}
                                            className="system-input width180" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={9}>
                                <FormItem
                                    label={window.LangMessage.policyNo || "保单号"}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('policy_no', {
                                    })(
                                        <Input className="system-input width180" placeholder={window.LangMessage.text_input || '请输入'} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="mt15" type="flex" justify="start" align='bottom'>
                            <Col span={9}>
                                <FormItem
                                    label={window.LangMessage.qu_product_name || "产品名称"}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('product_name', {
                                    })(
                                        <Input
                                            className="system-input width180"
                                            placeholder={window.LangMessage.text_input || '请输入'} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={9}>
                                <FormItem
                                    label={window.LangMessage.qu_business_type || "业务类型"}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('business_type', {
                                    })(
                                        <SelectDom
                                            placeholder={window.LangMessage.text_input || '请输入'}
                                            list={this.state.transTypelList}
                                            idKey="code"
                                            valueKey="desc"
                                            className="system-input width180" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6} className="tal">
                                <Button htmlType="submit" type="primary" className="product-filter-btn diy_background borderColor">{window.LangMessage.button_search || '查询'}</Button>
                                <Button onClick={this.resetCondition} type="primary" className="product-filter-btn diy_background borderColor">{window.LangMessage.btn_reset || '重置'}</Button>
                            </Col>
                        </Row>
                    </Form>

                    <div className="pl10 pr10 tdFirstMin greenFont">
                        <Table pagination={paginationConfig} bordered columns={columns} dataSource={this.state.queryClaimsTable} />
                    </div>
                </div>
            </div>
        );
    }
}

const WrappedCommissionQuery = Form.create()(CommissionQuery);

export default connect(state => {
    return state.queryCommissionQuery
})(WrappedCommissionQuery)