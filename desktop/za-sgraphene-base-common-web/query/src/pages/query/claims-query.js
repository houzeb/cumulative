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
        name: 'queryClaimsQuery',
        initialState: {

        },
        reducers: {

        },
        effects: {

        }
    })
}
class ClaimsQuery extends React.Component {
    super(props) {
        this.props = props;
    }
    state = {
        totalPage: 0,//总页数
        currentPage: 0,//当前页数
        pageSize: 10,//每页页数
        queryClaimsTable: [],
        filterOption: {}
    }
    componentDidMount() {
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (!Object.keys(values).some(x => values[x])) {
                    return false
                } else {
                    const dataValues = {
                        report_no: values.report_no,
                        policy_no: values.policy_no,
                        name: values.name,
                        ceti_no: values.ceti_no
                    }
                    const params = {
                        "moduleName": "claim_db",
                        "data": JSON.stringify(dataValues),
                        "operatorId": "38005",
                        // "pageSize": this.state.pageSize,
                        // "currentPage": this.state.currentPage + 1,
                    }
                    let tableList = [];
                    T.fetch({
                        url: '/query/index',
                        data: params,
                        method: 'post'
                    }).then((result) => {
                        //console.log("result1111111.....", result)
                        if (result.success) {
                            let fromString = result.value.data || {}
                            let fromJson = JSON.parse(fromString)
                            let fromData = fromJson.data || []
                            let pageData = fromJson || []

                            fromData.map(item => {
                                tableList.push(item);
                            })
                        }

                        const dataValues = {
                            report_no: values.report_no,
                            policy_no: values.policy_no,
                            name: values.name,
                            ceti_no: values.ceti_no
                        }
                        const params = {
                            "moduleName": "smart_claim_db",
                            "data": JSON.stringify(dataValues),
                            "operatorId": "38005",
                            // "pageSize": this.state.pageSize,
                            // "currentPage": this.state.currentPage + 1,
                        }
                        T.fetch({
                            url: '/query/index',
                            data: params,
                            method: 'post'
                        }).then((result) => {
                            //console.log("result2222222.....", result)
                            if (result.success) {
                                let fromString = result.value.data || {}
                                let fromJson = JSON.parse(fromString)
                                let fromData = fromJson.data || []
                                let pageData = fromJson || []

                                fromData.map(item => {
                                    tableList.push(item);
                                })
                                tableList.map((item, index) => {
                                    item.key = index + 1;
                                })
                                this.setState({
                                    queryClaimsTable: tableList,
                                })
                            }
                        });

                    });

                }
            }
        });
    }
    // formatTableData = (result) => {
    //     this.setState({
    //         queryClaimsTable: []
    //     })
    //     result.map((item, index) => {
    //         item.key = index + 1
    //         this.state.queryClaimsTable.push(item)
    //     })
    //     this.setState(this.state)
    // }





    resetCondition = () => {
        this.props.form.resetFields()
    }
    render() {
        const { getFieldDecorator } = this.props.form;

        const langMessage = window.LangMessage;
        const synthesisText = langMessage.synthesis_text || '综合';
        const clientText = langMessage.client_text || '客户';
        const queryText = langMessage.button_search || '查询';
        const general_search = langMessage.general_search || '综合查询';
        const claims_search = langMessage.claims_search || '理赔查询';

        const name = langMessage.name || '姓名';
        const certificate = langMessage.certificate_text || '证件';
        const numberText = langMessage.number_text || '号码';
        const birthText = langMessage.date_of_birth || '出生日期';
        const indexText = langMessage.text_index || '序号';
        const genderText = langMessage.gender_text || '性别';
        const typeText = langMessage.type_text || '类型';
        const status = langMessage.status || '状态';
        const inputText = langMessage.text_input || '请输入';

        const columns = [{
            title: indexText,
            dataIndex: 'key',
            render: (text, record) => <span>{text + this.state.pageSize * this.state.currentPage}</span>,
        }, {
            title: window.LangMessage.caseNo || "案件号",
            dataIndex: 'report_no',
        }, {
            title: window.LangMessage.label_policy_no || "保单号",
            dataIndex: 'source_policy_no',
        }, {
            title: window.LangMessage.insured_name || "被保人姓名",
            dataIndex: 'insurance_name',
        }, {
            title: window.LangMessage.insured_number || "被保人证件号",
            dataIndex: 'insurance_ceti_no',
        }, {
            title: window.LangMessage.claims_type || "理赔类型",
            dataIndex: 'loss_code',
        }, {
            title: window.LangMessage.claims_money || "理赔金额",
            dataIndex: 'paid_amount',
        }, {
            title: window.LangMessage.state_Case || "案件状态",
            dataIndex: 'status',
        }, {
            title: window.LangMessage.settlementDate || "结案日期",
            dataIndex: 'close_date',
            render: (text, record) => <span>{T.formatDate('yyyy-MM-dd', text)}</span>
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
        return (
            <div>
                <div className="pb15 search-result-back">
                    <div style={{ width: 300 }} onClick={() => actions.routing.push('/')}>
                        <span className="mr5 strong">{general_search}</span>
                        <Icon type="right" />
                        <span className="ml5">{claims_search}</span>
                    </div>
                </div>
                <div className="user-management pb30">
                    <Form className="query-form pl20 pb20" onSubmit={this.handleSubmit} layout='vertical'>
                        <Row className="mt10" type="flex" justify="start">
                            <Col span={9}>
                                <FormItem
                                    label={window.LangMessage.report_no || "报案号"}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('report_no', {
                                    })(
                                        <Input className="system-input width180" placeholder={inputText} />
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
                                        <Input className="system-input width180" placeholder={inputText} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="mt15" type="flex" justify="start" align='bottom'>
                            <Col span={9}>
                                <FormItem
                                    label={window.LangMessage.insured_name || "被保人姓名"}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('name', {
                                    })(
                                        <Input className="system-input width180" placeholder={inputText} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={9}>
                                <FormItem
                                    label={window.LangMessage.insured_number || "被保人证件号"}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('ceti_no', {
                                    })(
                                        <Input
                                            placeholder={inputText}
                                            className="system-input width180"
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6} className="tal">
                                <Button htmlType="submit" type="primary" className="product-filter-btn diy_background borderColor">{queryText}</Button>
                                <Button onClick={this.resetCondition} type="primary" className="product-filter-btn diy_background borderColor">{window.LangMessage.btn_reset || '重置'}</Button>
                            </Col>
                        </Row>
                    </Form>

                    <div className="pl10 pr10 tdFirstMin greenFont">
                        <Table pagination={false} bordered columns={columns} dataSource={this.state.queryClaimsTable} />
                    </div>
                </div>
            </div>
        );
    }
}

const WrappedClaimsQuery = Form.create()(ClaimsQuery);

export default connect(state => {
    return state.queryClaimsQuery
})(WrappedClaimsQuery)