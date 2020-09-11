import React from 'react';
import ReactDOM from 'react-dom'
import SelectDom from '../../component/SelectDom';
import mirror, { actions, connect } from 'mirrorx'
import { Row, Col, Button, Input, Form, Select, Table, Icon, message, DatePicker, AutoComplete } from 'antd';
import hostUrl from './env'

// import ExportJsonExcel from 'js-export-excel'
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const RangePicker = DatePicker.RangePicker;


if (!actions.orderPolicyQuery) {
    mirror.model({
        name: 'orderPolicyQuery',
        initialState: {

        },
        reducers: {

        },
        effects: {

        }
    })
}
class OrderQuery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queryPolicyTable: [],
            totalPage: 1,
            currentPage: 1,
            pageSize: 10,
            channelDataSource: [],
            productDataSource: []
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.getData();
        // let result = []
        // this.props.form.validateFieldsAndScroll({first:true, force: true},(err, values) => {
        //   result.push(!!err)
        // })
        // let check = result.findIndex((ele,idx) => {
        //   return ele === true
        // })
    
        // let data = this.props.form.getFieldsValue()

        // console.log('data', data)
    
        // if(check < 0){
        //     //todo
        //     this.getData();
        // }
    
    }

    getData = (cur = 1) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const channel_no = this.state.channelDataSource.find(item => item.name === values.channel_no)
                const goods_id = this.state.productDataSource.find(item => item.goodsName === values.goods_id)
                const data = {
                    "channel_no": channel_no ? channel_no.code : channel_no,
                    "policy_no": values.policy_no,
                    "order_no": values.order_no,
                    "goods_id": goods_id ? goods_id.goodsId : goods_id,
                    "holder_name": values.holder_id,
                    "insure_date": values.insure_date,
                    "insurant_name": values.insurant_id,
                    "policy_status": values.policy_status
                }
                if (values.insure_date && values.insure_date.length > 0) {
                    let first = T.formatDate('yyyy-MM-dd', values.insure_date[0]);
                    let second = T.formatDate('yyyy-MM-dd', values.insure_date[1]);
                    data.insure_start_date = T.formatDate('yyyy-MM-dd', first) + ' 00:00:00';
                    data.insure_end_date = T.formatDate('yyyy-MM-dd', second) + ' 23:59:59'
                    delete data.insure_date
                }
                for (const key in data) {
                    if (data[key] === '') {
                        delete data[key]
                    }
                }
                T.fetch({
                    url: '/query/index',
                    data: {
                        "moduleName":"issuance_search",
                        "data": JSON.stringify(data),
                        "operatorId": "38005",
                        "pageSize": 10,
                        "currentPage": cur
                    },
                    method: 'post'
                }).then((result) => {
                    if (result.success) {
                        let fromString = result.value.data || {};
                        let fromJson = JSON.parse(fromString);
                        if (fromJson.totalPage >= 1000) return message.error('查询结果过多，请输入更加准确的查询条件，重新查询')
                        let fromData = fromJson.data || [];
                        fromData.map(item => {
                          item.orgnizationName = '众安科技'
                          // item.payment_period = paymentPeriod[item.payment_period]
                        })
                        console.log(fromData)
                        this.formatTableData(fromData);
                        let total = Math.ceil(fromJson.totalPage * 10);
                        this.setState({
                            currentPage: fromJson.currentPage,
                            totalPage: total,
                            pageSize: fromJson.pageSize
                        })
                        this.setState({
                            queryPolicyTable: fromData || []
                        })
                    }
                });
            }
        });
    }

    formatTableData = (result) => {
        this.setState({
            queryPolicyTable: []
        })
        result.forEach((item, index) => {
            item.key = index + 1
            this.state.queryPolicyTable.push(item)
        })
        this.setState(this.state)
    }

    resetCondition = () => {
        this.props.form.resetFields()
    }

    handleChannelSearch = (value) => {
        if (!value) return
        T.fetch({
            url: '/channelConfig/pageQuery',
            data: {
                "condition": {
                    "channelName": value
                    },
                "limit": 10,
                "pageIndex": 1
            },
            method: 'post'
        }).then(res => {
            if (res.success) {
                const data = res.value.results
                this.setState({
                    channelDataSource: data
                })
            }
        })
    }

    onSelect = _ => {
        // console.log('value', value)
    }

    clickPolicyId = (record) => {
      actions.routing.push({
          pathname: '/order-query-detail',
          search: '?id=' + record.issuanceId
      })
    }

    handleProductSearch = (value, flag) => {
        if (!value) return
        T.fetch({
            url: '/market/queryBasicGoodsInfo',
            data: {
                "condition": {
                    "goodsName": value
                },
                "limit": 10,
                "pageIndex": 1
            },
            method: 'post'
        }).then(res => {
            if (res.success) {
                const data = res.value.results
                this.setState({
                    productDataSource: data
                })
            }
        })
    }
    exportResult = _ => {
        if (!this.state.queryPolicyTable.length) return  message.error('暂无查询结果')
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const channel_no = this.state.channelDataSource.find(item => item.name === values.channel_no)
                const goods_id = this.state.productDataSource.find(item => item.goodsName === values.goods_id)
                const data = {
                    "channel_no": channel_no ? channel_no.code : channel_no,
                    "policy_no": values.policy_no,
                    "order_no": values.order_no,
                    "goods_id": goods_id ? goods_id.goodsId : goods_id,
                    "holder_name": values.holder_id,
                    "insure_date": values.insure_date,
                    "insurant_name": values.insurant_id,
                    "policy_status": values.policy_status
                }
                for (const key in data) {
                    if (data[key] === '') {
                        delete data[key]
                    }
                }
                if (values.insure_date && values.insure_date.length > 0) {
                    let first = T.formatDate('yyyy-MM-dd', values.insure_date[0]);
                    let second = T.formatDate('yyyy-MM-dd', values.insure_date[1]);
                    data.insure_start_date = T.formatDate('yyyy-MM-dd', first) + ' 00:00:00';
                    data.insure_end_date = T.formatDate('yyyy-MM-dd', second) + ' 23:59:59'
                    delete data.insure_date
                }
                window.location.href = `${hostUrl}/generateIssuanceExcel?data=${JSON.stringify(data)}`
            }
        })
        // 此功能只是前端导出当前页的excel,需要从接口获取导出全部excel
        // let formateData = []
        // const fields = ['key', 'issuanceNo', 'policyNo', 'channelName', 'goodsName', 'orgnizationName', 'holderName', 'insurantName', 'insureDate', 'issueDate', 'effectiveDate', 'policyStatus']

        // this.state.queryPolicyTable.map(item => {
        //     let obj = {}
        //     fields.map(li => {
        //         item[li] ? item[li] = item[li] : item[li] = ''
        //         Object.keys(item).map(ul => {
        //             if (ul === li) {
        //                 obj[li] = item[li]
        //             }
        //         })
        //     })
        //     formateData.push(obj)
        // })

        // let sheetData = []
        // formateData.map(item => {
        //     let obj = {}
        //     let arr = Object.values(item)
        //     for (let [index, elem] of arr.entries()) {
        //         obj[index + 1] = elem
        //     }
        //     sheetData.push(obj)
        // })

        // var option = {}
        // const sheetHeader = ['序号', '订单号', '保单号', '销售渠道', '商品名称', '保险公司', '投保人', '被保险人', '投保时间', '出单时间', '保险起期', '状态']
        // const sheetFilter = sheetHeader.map((item, index) => `${index + 1}`)
        // const columnWidths = [2, 10, 8, 8, 8, 5, 5, 5, 8, 8, 8, 3]
        // option.fileName = '保单查询结果'
        // option.datas = [
        //     {
        //         sheetData,
        //         sheetName: 'sheet1',
        //         sheetFilter,
        //         sheetHeader,
        //         columnWidths
        //     }
        // ]

        // var toExcel = new ExportJsonExcel(option)
        // toExcel.saveExcel()
        {/* <InputGroup compact>
                                            <Select defaultValue="policy_no" onSelect={this.handleSelect}>
                                                <Option value="policy_no">保单号</Option>
                                                <Option value="order_no">订单号</Option>
                                            </Select>
                                            <Input className='system-input policyErr height32 width180' placeholder={inputText} />
                                        </InputGroup> */}
    } 
    

    render() {
        const langMessage = window.LangMessage;
        const synthesisText = langMessage.synthesis_text || '综合';
        const policyText = langMessage.policy_text || '保单';
        const queryText = langMessage.button_search || '查询';
        const general_search = langMessage.general_search || '综合查询';
        const policy_search = langMessage.policy_search || '保单查询'; 
        const policyNo = LangMessage.q_product_code || '产品代码';
        const effective = LangMessage.effective || '有效期限';
        const next_due_date = LangMessage.next_due_date || '下期应缴日';

        const numText = langMessage.numberText || '号';
        const indexText = langMessage.text_index || '序号';
        const applicantText = langMessage.applicant_text || '投保人';
        const name = langMessage.name || '姓名';
        const mainRisks = langMessage.main_risks_text || '主险';
        const nameText = langMessage.name_text || '名称';
        const coverageText = langMessage.coverage_text || '保额';
        const currency = langMessage.currency || '币种';
        const effectiveDate = langMessage.effective_date || '生效日期';
        const expiryDate = langMessage.expiry_Date || '失效日期';
        const status = langMessage.status || '状态';
        const nextPayDay = langMessage.next_pay_day || '下期应缴日';
        const inputText = langMessage.text_input || '请输入';
        const email = LangMessage.email_query || '邮箱';
        const main_product = LangMessage.main_product || '主险名称';
        const startDate = LangMessage.startDate || '开始日期';
        const endDate = LangMessage.endDate || '结束日期';

        const columns = [
            {
                title: indexText,
                dataIndex: 'key',
                render: (text, record) => <span>{text + this.state.pageSize * (this.state.currentPage - 1)}</span>,
                width: 50
            }, {
                title: '订单号',
                dataIndex: 'orderNo',
                width: 140
            }, {
                title: '保单号',
                dataIndex: 'policyNo',
                width: 120
            }, {
                title: '销售渠道',
                dataIndex: 'channelName',
                width: 120
            }, {
                title: '商品名称',
                dataIndex: 'goodsName',
                width: 120
            }, {
                title: '保险公司',
                dataIndex: 'orgnizationName',
                width: 80
            }, {
                title: '投保人',
                dataIndex: 'holderName',
                width: 80
            }, {
                title: '被保险人',
                dataIndex: 'insurantName',
                width: 80
            }, {
                title: '投保时间',
                dataIndex: 'insureDate',
                width: 130
            }, {
                title: '承保时间',
                dataIndex: 'issueDate',
                width: 130
            }, {
                title: '保险起期',
                dataIndex: 'effectiveDate',
                width: 130
            }, {
                title: '投保状态',
                dataIndex: 'policyStatus',
                width: 70
            }, {
                title: '订单状态',
                dataIndex: 'orderStatus',
                width: 70
            }, {
                title: '操作',
                width: 50,
                render: (text, record) =>  <a onClick={() => this.clickPolicyId(record)}>查看</a>
            }
        ];

        const selectOptions = [
            {
                name: '生效',
                value: '生效'
            },
            {
                name: '保单终止',
                value: '保单终止'
            },
            {
                name: '失效',
                value: '失效'
            }
        ]

        let pagination = {
            current: this.state.currentPage,
            pageSize: this.state.pageSize,
            showQuickJumper: true,
            total: this.state.totalPage,
            onChange: (page) => {
                this.getData(page)
            }
        }

        const {channelDataSource, productDataSource, labelName} = this.state
        const { getFieldDecorator, getFieldValue } = this.props.form;
        return (
            <div>
                <div className="pb15 search-result-back">
                    <div style={{ width: 300 }} onClick={() => actions.routing.push('/')}>
                        <span className="mr5 strong">{general_search}</span>
                        <Icon type="right" />
                        <span className="ml5">订单查询</span>
                    </div>
                </div>
                <div className="user-management pb30">
                    <Form className="query-form pl20 pb20" onSubmit={this.handleSubmit} layout='vertical'>
                        <Row className="mt10" type="flex" justify="start">
                            <Col span={8}>
                                <FormItem
                                    colon={false}
                                    label={'销售渠道'}
                                >
                                    {getFieldDecorator('channel_no', {
                                        rules: [{
                                            // required: true,
                                            message: inputText + policyText + numText
                                        }],
                                    })(
                                        <AutoComplete
                                            dataSource={channelDataSource.map(item => item.name)}
                                            style={{ width: 180 }}
                                            onSearch={this.handleChannelSearch}
                                            onSelect={this.onSelect}
                                            placeholder="请选择"
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem colon={false} label="保单号">
                                    {getFieldDecorator('policy_no', {
                                        rules: [{
                                            message: inputText
                                        }]
                                    })(
                                        <Input className='system-input policyErr height32 width180' placeholder={inputText} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem colon={false} label="订单号">
                                    {getFieldDecorator('order_no', {
                                        rules: [{
                                            message: inputText
                                        }]
                                    })(
                                        <Input className='system-input policyErr height32 width180' placeholder={inputText} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem colon={false} label={'商品名称'}>
                                    {getFieldDecorator('goods_id', {
                                        rules: [{
                                            message: '请输入商品名称' 
                                        }],
                                    })(
                                        <AutoComplete
                                            dataSource={productDataSource.map(item => item.goodsName)}
                                            style={{ width: 180 }}
                                            onSearch={this.handleProductSearch}
                                            onSelect={this.onSelect}
                                            placeholder="请选择"
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem colon={false} label={'投保人'}>
                                    {getFieldDecorator('holder_id', {
                                        rules: [{
                                            message: inputText
                                        }]
                                    })(
                                        <Input className='system-input policyErr height32 width180' placeholder={inputText} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem colon={false} label={'投保时间'}>
                                    {getFieldDecorator('insure_date', {})(
                                        <RangePicker format='YYYY-MM-DD' className='system-input policyErr height32 width180' placeholder={[startDate,endDate]} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem colon={false} label={'被保人'}>
                                    {getFieldDecorator('insurant_id', {
                                        rules: [{
                                            message: inputText
                                        }]
                                    })(
                                        <Input className='system-input policyErr height32 width180' placeholder={inputText} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem colon={false} label={'状态'}>
                                    {getFieldDecorator('policy_status', {
                                        rules: [{
                                            message: inputText
                                        }]
                                    })(
                                      <SelectDom idKey='name' valueKey='value' style={{ width: 180 }} list={selectOptions} placeholder={window.LangMessage.mms_pleaseSelect || '请选择'} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="mt10" type="flex" justify="start" align='bottom'>
                            <Col span={16} className="tal mb10"></Col>
                            <Col span={8} className="tal mb10">
                                <Button onClick={this.exportResult} type="primary" className="product-filter-btn diy_background borderColor">导出查询结果</Button>
                                <Button htmlType="submit" type="primary" className="product-filter-btn diy_background borderColor">{queryText}</Button>
                                <Button onClick={this.resetCondition} type="primary" className="product-filter-btn diy_background borderColor">{window.LangMessage.btn_reset || '重置'}</Button>
                            </Col>
                        </Row>
                    </Form>

                    <div className="pl10 pr10 tdFirstMin greenFont">
                        <Table pagination={pagination} bordered columns={columns} scroll={{ x: 1600 }} dataSource={this.state.queryPolicyTable} />
                    </div>
                </div>
            </div>
        );
    }
}

const WrappedPolicyQuery = Form.create()(OrderQuery);

export default connect(state => {
    return state.orderPolicyQuery
})(WrappedPolicyQuery)