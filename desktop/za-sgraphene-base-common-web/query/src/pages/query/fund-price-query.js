import React from 'react';
import ReactDOM from 'react-dom'
import SelectDom from '../../component/SelectDom';
import mirror, {actions, connect} from 'mirrorx'
import {Row, Col, Button, Input,Form,Select, Table, Icon,message,DatePicker} from 'antd';
import { FormattedMessage} from 'react-intl';
const FormItem = Form.Item;
const Option = Select.Option;

mirror.model({
    name: 'fundPriceQuery',
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
        fundPriceTable:[],
        currencyList:[],
        filterOption:{},
        totalPage:0,
        currentPage: 0,
        pageSize: 10,
    }
    componentDidMount() {
        this.selectCurrency();
    }
    //币种
    selectCurrency = (e) => {
        T.fetch({
            url: "/component/emum/list",
            data: {
                "moduleName":"common",
                "enumClassName":"CurrencyEnum"
            },
            method: 'post'
        }).then((res) => {
            //console.log('CurrencyEnum............', res)
            this.setState({
                currencyList: res.value
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
                    currency:values.currency,
                    from_date:values.from_date && values.from_date.format('YYYY-MM-DD') || "",
                    to_date:values.to_date && values.to_date.format('YYYY-MM-DD') || ""
                };
                this.setState({
                    filterOption:data
                });
                const valueData = {
                    'moduleName':'fund_price_db',
                    'currentPage':1,
                    'pageSize':10,
                    'data': JSON.stringify(data),
                    'operatorId':'38005'
                }
                T.fetch({
                    url: '/query/index',
                    data: valueData,
                    method: 'post'
                }).then((result) => {
                    if (result.success) {
                        let  fromString = result.value.data || {};
                        let fromJson= JSON.parse(fromString);
                        let fromData = fromJson.data || [];
                        let pageData = fromJson || [];
                        console.log('pageData',pageData);
                        this.setState({
                            totalPage: pageData.totalPage * this.state.pageSize
                        })
                        this.formatTableData(fromData);
                        this.setState({
                            fundPriceTable: fromData,
                            currentPage:1,
                        })
                    }
                });
            }
        });
    }

    fetchResultTable = () => {
        const params = {
            'moduleName':'fund_price_db',
            'currentPage':this.state.currentPage,
            'pageSize':this.state.pageSize,
            'data': JSON.stringify(this.state.filterOption),
            'operatorId':'38005'
        };
        T.fetch({
            url: '/query/index',
            data: params,
            method: 'post'
        }).then((result) => {
            if (result.success) {
                let  fromString = result.value.data || {};
                let fromJson= JSON.parse(fromString);
                let fromData = fromJson.data || [];
                let pageData = fromJson || [];
                this.setState({
                    totalPage: pageData.totalPage * this.state.pageSize
                });
                this.formatTableData(fromData);
                this.setState({
                    fundPriceTable: fromData,
                })
            }
        });
    }

    formatTableData = (result) => {
        this.setState ({
            fundPriceTable:[]
        })
        result.forEach((item, index) => {
            item.key = index + 1
            this.state.fundPriceTable.push(item)
        })
        this.setState(this.state)
    }
    resetCondition = () => {
        this.props.form.resetFields()
    }
    handlePageChange = (currentPage,pageSize)=>{
        this.setState({
            currentPage: currentPage,
        }, this.fetchResultTable)
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const langMessage = window.LangMessage;
        const inputText = langMessage.text_input || '请输入';
        const synthesisText = langMessage.synthesis_text || '综合';
        const clientText = langMessage.client_text || '客户';
        const queryText = langMessage.button_search || '查询';
        const fund_price_search = langMessage.fund_price_search || '基金价格查询';
        const general_search = langMessage.general_search || '综合查询';

        const columns = [{
            title: window.LangMessage.text_index || '序号',
            dataIndex: 'key',
        },{
            title: langMessage.fund_code || "基金代码",
            dataIndex: 'fund_code',
        },{
            title: langMessage.fund_name || '基金名称',
            dataIndex: 'fund_name',
        },{
            title: langMessage.currency || '币种',
            dataIndex: 'currency',
        },{
            title: langMessage.price_date || '价格日期',
            dataIndex: 'fund_price_date',
            render: (text, record) => <span>{T.formatDate('yyyy-MM-dd', text)}</span>
        },{
            title: langMessage.bid_price || '买入价格',
            dataIndex: 'fund_bid_price',
        },{
            title: langMessage.offer_price || '卖出价格',
            dataIndex: 'fund_offer_price',
        }];
        const paginationConfig = {
            onChange: this.handlePageChange,
            showQuickJumper: true,
            total: this.state.totalPage,
            defaultPageSize: this.state.pageSize,
            current: this.state.currentPage
        }
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return (
            <div>
                <div className="pb15 search-result-back">
                    <div style={{ width: 300 }} onClick={() => actions.routing.push('/')}>
                        <span className="mr5 strong">{general_search}</span>
                        <Icon type="right" />
                        <span className="ml5">{fund_price_search}</span>
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
                                    label={langMessage.currency || '币种'}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('currency', {
                                    })(
                                        <SelectDom
                                            placeholder={window.LangMessage.text_select}
                                            list={this.state.currencyList}
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
                                    {getFieldDecorator('from_date', {
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
                                    {getFieldDecorator('to_date', {
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
                        <Table pagination={paginationConfig} bordered columns={columns} dataSource={this.state.fundPriceTable}/>
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