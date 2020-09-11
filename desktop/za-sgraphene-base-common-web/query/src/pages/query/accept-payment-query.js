import React from 'react';
import ReactDOM from 'react-dom'
import SelectDom from '../../component/SelectDom';
import mirror, {actions, connect} from 'mirrorx'
import {Row, Col, Button, Input,Form,Select, Table, Icon,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

mirror.model({
    name: 'queryAcceptPayment',
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
        queryPaymentTable:[]
    }
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          const langMessage = window.LangMessage;
          const orderPolicyNoEmpty = langMessage.order_policy_no_empty || '订单号和保单号中有一个不能为空';

          const form = this.props.form;
          const policyNoValue = form.getFieldValue('policy_no')
          const orderNoValue = form.getFieldValue('order_no')
          if( policyNoValue || orderNoValue){
              const data = {
                policy_no: values.policy_no,
                order_no: values.order_no
              }
              const valueData = {
                  'moduleName':'bcp_db',
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
                        queryPaymentTable: fromData,
                        currentPage: 0
                    })
                }
              });
          }else{
              message.error(orderPolicyNoEmpty)
          }
        }
      });
    }
    formatTableData = (result) => {
        this.setState ({
          queryPaymentTable:[]
        })
        result.forEach((item, index) => {
            item.key = index + 1
            this.state.queryPaymentTable.push(item)
        })
        this.setState(this.state)
    }
    
    resetCondition = () => {
        this.props.form.resetFields()
    }
    render() {
      const { getFieldDecorator } = this.props.form;
      const langMessage = window.LangMessage;
      const synthesisText = langMessage.synthesis_text || '综合';
      const receiptPayment = langMessage.receipt_payment || '收付费';
      const queryText = langMessage.btn_query || '查询';

      const inputText = langMessage.text_input || '请输入';
      const indexText = langMessage.text_index || '序号';
      const orderNo = langMessage.label_order_no || '订单号';
      const policyNo = langMessage.label_policy_no || '保单号';
      const voucherNo = langMessage.label_voucher_no || '凭证号';
      const batchNo = langMessage.label_batch_no || '批次号';
      const operationDate = langMessage.operation_date || '操作日期';
      const transactionType = langMessage.transactionType || '交易类型';
      const money = langMessage.money || '金额';
      const currency = langMessage.currency || '币种';
      const away = langMessage.away || '方式';
      const policyText = langMessage.policy_text || '保单';
      const moneyAccount = langMessage.money_account || '余额账户';
      const costStatus = langMessage.cost_status || '费用状态';

      const columns = [{
          title: indexText,
          dataIndex: 'key',
        }, {
          title: orderNo,
          dataIndex: 'order_no',
        }, {
          title: policyNo,
          dataIndex: 'policy_no',
          //render: (text, record) => <a href="">{this.state.queryPaymentTable[0].policy_no}</a>,
        }, {
          title: operationDate,
          dataIndex: 'bill_confirm_date',
          render: (text, record) => <span>{T.formatDate('yyyy年MM月dd日', text)}</span>
        },{
          title: transactionType,
          dataIndex: 'ar_ap',
      }, {
          title: money,
          dataIndex: 'bill_amount',
        }, {
          title: currency,
          dataIndex: 'currency',
        }, {
          title: receiptPayment + away,
          dataIndex: 'arap_account_type',
        },{
          title: voucherNo,
          dataIndex: 'bill',//bill_id
      }, {
          title: batchNo,
          dataIndex: 'payee',//payee_id
        }, {
          title: policyText + currency + money,
          dataIndex: 'total_install_premium',
        }, {
          title: policyText + currency,
          dataIndex: 'money_id',
        },{
          title: moneyAccount,
          dataIndex: 'trans_type',
      },{
          title: costStatus,
          dataIndex: 'bill_status',
      }];
      const formItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 14 },
      };
      return (
        <div>
            <div className="pb15 search-result-back">
                <div style={{ width: 300 }} onClick={() => actions.routing.push('/')}>
                    <span className="mr5 strong">{synthesisText + queryText}</span>
                    <Icon type="right" />
                    <span className="ml5">{receiptPayment + queryText}</span>
                </div>
            </div>
            <div className="user-management pb30">
                <Form className="query-form pl20 pb20" onSubmit={this.handleSubmit}>
                    <Row className="mt10" type="flex" justify="start">
                        <Col span={9}>
                            <FormItem
                                label={orderNo}
                                {...formItemLayout}
                            >
                                {getFieldDecorator('order_no', {
                                })(
                                    <Input className="system-input width180" placeholder={inputText}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={9}>
                            <FormItem
                                label={policyNo}
                                {...formItemLayout}
                            >
                                {getFieldDecorator('policy_no', {
                                })(
                                    <Input className="system-input width180" placeholder={inputText} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className="mt15" type="flex" justify="start">
                        <Col span={9}>
                            <FormItem
                                label={voucherNo}
                                {...formItemLayout}
                            >
                                {getFieldDecorator('pz', {
                                })(
                                    <Input className="system-input width180" placeholder={inputText} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={9}>
                            <FormItem
                                label={batchNo}
                                {...formItemLayout}
                            >
                                {getFieldDecorator('pici', {
                                })(
                                    <Input className="system-input width180" placeholder={inputText} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6} className="tal">
                          <Button htmlType="submit" type="primary" className="product-filter-btn diy_background borderColor">{queryText}</Button>
                                <Button onClick={this.resetCondition} type="primary" className="product-filter-btn diy_background borderColor">{window.LangMessage.btn_reset || '重置'}</Button>
                        </Col>
                    </Row>
                </Form>

                <div className=" pl10 pr10 tdFirstMin greenFont">
                    <Table pagination={false} bordered columns={columns} dataSource={this.state.queryPaymentTable}/>
                </div>
            </div>
        </div>
      );
    }
}

const WrappedAcceptPayment = Form.create()(AcceptPayment);

export default connect(state => {
    return state.queryAcceptPayment
})(WrappedAcceptPayment)