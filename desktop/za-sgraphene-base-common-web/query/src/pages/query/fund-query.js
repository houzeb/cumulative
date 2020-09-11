import React from 'react';
import ReactDOM from 'react-dom'
import SelectDom from '../../component/SelectDom';
import mirror, {actions, connect} from 'mirrorx'
import {Row, Col, Button, Input,Form,Select, Table, Icon,message,DatePicker} from 'antd';
import { FormattedMessage} from 'react-intl';
const FormItem = Form.Item;
const Option = Select.Option;

mirror.model({
    name: 'fundQuery',
    initialState: {

    },
    reducers: {

    },
    effects: {

    }
})
class AcceptPayment extends React.Component {
    super(props) {
        this.props = props;
    }
    state = {
        funQueryTable:[],
        fundDataList:{}
    }
    componentDidMount() {
        this.selectFundList();
    }
    selectFundList = (e) => {
        T.fetch({
            url: "/component/query/enum",
            data: [
                {"moduleName":"common","enumClassName":"CurrencyEnum"},//币种
                {"moduleName":"investment","enumClassName":"FundStatusEnum"},//基金状态
                {"moduleName":"investment","enumClassName":"FundTypeEnum"},//基金类型
            ],
            method: 'post'
        }).then((res) => {
            console.log('selection............', res)
            this.setState({
                fundDataList: res.value
            })
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                const data = {
                    fund_code:values.fund_code,
                    fund_name: values.fund_name,
                    fund_type:values.fund_type,
                    fund_status:values.fund_status,
                    currency:values.currency,
                    start_date:values.start_date && values.start_date.format('YYYY-MM-DD') || "",
                    end_date:values.end_date && values.end_date.format('YYYY-MM-DD') || ""
                }
                const valueData = {
                    'moduleName':'fund_db',
                    'data': JSON.stringify(data),
                    'operatorId':'38005'
                }
                T.fetch({
                    url: '/query/index',
                    data: valueData,
                    method: 'post'
                }).then((result) => {
                    //console.log("result....",result)
                    if (result.success) {
                        let  fromString = result.value.data || {}
                        let fromJson= JSON.parse(fromString)
                        let fromData = fromJson.data || []
                        let pageData = fromJson || []
                        this.formatTableData(fromData)
                        this.setState({
                            funQueryTable: fromData,
                            currentPage: 0
                        })
                    }
                });
            }
        });
    }
    formatTableData = (result) => {
        this.setState ({
            funQueryTable:[]
        })
        result.forEach((item, index) => {
            item.key = index + 1
            this.state.funQueryTable.push(item)
        })
        this.setState(this.state)
    }
    resetCondition = () => {
        this.props.form.resetFields()
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const langMessage = window.LangMessage;
        const inputText = langMessage.text_input || '请输入';
        const synthesisText = langMessage.synthesis_text || '综合';
        const clientText = langMessage.client_text || '客户';
        const queryText = langMessage.button_search || '查询';
        const fundText = langMessage.fund || '基金';
        const fund_search = langMessage.fund_search || '基金查询';
        const general_search = langMessage.general_search || '综合查询';

        const columns = [{
            title: langMessage.text_index || '序号',
            dataIndex: 'key',
        },{
            title: langMessage.fund_code || "基金代码",
            dataIndex: 'fund_code',
        },{
            title: langMessage.fund_name || "基金名称",
            dataIndex: 'fund_name',
        },{
            title: langMessage.fund_type || "基金类型",
            dataIndex: 'fund_type',
        },{
            title: langMessage.fund_status || "基金状态",
            dataIndex: 'fund_status',
        },{
            title: langMessage.currency || "币种",
            dataIndex: 'currency',
        },{
            title: langMessage.start_date || "开始日期",
            dataIndex: 'start_date',
            render: (text, record) => <span>{T.formatDate('yyyy-MM-dd', text)}</span>
        },{
            title: langMessage.end_date || "结束日期",
            dataIndex: 'end_date',
            render: (text, record) => <span>{T.formatDate('yyyy-MM-dd', text)}</span>
        }];
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
                        <span className="ml5">{fund_search}</span>
                    </div>
                </div>
                <div className="user-management pb30">
                    <Form className="query-form pl20 pb20" onSubmit={this.handleSubmit} layout='vertical'>
                        <Row className="mt10" type="flex" justify="start">
                            <Col span={9}>
                                <FormItem
                                    label={langMessage.fund_code || '基金代码'}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('fund_code', {
                                    })(
                                        <Input className="system-input width180" placeholder={inputText}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={9}>
                                <FormItem
                                    label={langMessage.fund_name || '基金名称'}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('fund_name', {
                                    })(
                                        <Input className="system-input width180" placeholder={inputText} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="mt10" type="flex" justify="start">
                            <Col span={9}>
                                <FormItem
                                    label={langMessage.fund_type || '基金类型'}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('fund_type', {
                                    })(
                                        <SelectDom
                                            placeholder={window.LangMessage.text_select}
                                            list={this.state.fundDataList['investment.FundTypeEnum']}
                                            idKey="code"
                                            valueKey="desc"
                                            className="system-input width180" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={9}>
                                <FormItem
                                    label={langMessage.fund_status || '基金状态'}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('fund_status', {
                                    })(
                                        <SelectDom
                                            placeholder={window.LangMessage.text_select}
                                            list={this.state.fundDataList['investment.FundStatusEnum']}
                                            idKey="code"
                                            valueKey="desc"
                                            className="system-input width180" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="mt10" type="flex" justify="start">
                            <Col span={9}>
                                <FormItem
                                    label={langMessage.currency || '币种'}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('currency', {
                                    })(
                                        <SelectDom
                                            placeholder={window.LangMessage.text_select}
                                            list={this.state.fundDataList['common.CurrencyEnum']}
                                            idKey="code"
                                            valueKey="desc"
                                            className="system-input width180" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={9}>
                                <FormItem
                                    label={langMessage.start_date || '开始日期'}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('start_date', {
                                    })(
                                        <DatePicker
                                            format="YYYY-MM-DD"
                                            placeholder={inputText}
                                            className="system-input width180"
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="mt10" type="flex" justify="start" align='bottom'>
                            <Col span={9}>
                                <FormItem
                                    label={langMessage.end_date || '结束日期'}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('end_date', {
                                    })(
                                        <DatePicker
                                            format="YYYY-MM-DD"
                                            placeholder={inputText}
                                            className="system-input width180"
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <Button htmlType="submit" type="primary" className="product-filter-btn diy_background borderColor">{queryText}</Button>
                                <Button onClick={this.resetCondition} type="primary" className="product-filter-btn diy_background borderColor">{window.LangMessage.btn_reset || '重置'}</Button>
                            </Col>
                        </Row>
                    </Form>

                    <div className=" pl10 pr10 tdFirstMin greenFont">
                        <Table pagination={false} bordered columns={columns} dataSource={this.state.funQueryTable}/>
                    </div>
                </div>
            </div>
        );
    }
}

const WrappedAcceptPayment = Form.create()(AcceptPayment);

export default connect(state => {
    return state.fundQuery
})(WrappedAcceptPayment)