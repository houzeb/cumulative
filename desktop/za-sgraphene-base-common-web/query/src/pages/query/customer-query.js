import React from 'react';
import ReactDOM from 'react-dom'
import SelectDom from '../../component/SelectDom';
import mirror, {actions, connect} from 'mirrorx'
import moment from 'moment';
import {Row, Col, Button, Input,Form,Select, Table, Icon,DatePicker} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

if (!actions.queryCustomerQuery1) {
    mirror.model({
        name: 'queryCustomerQuery1',
        initialState: {

        },
        reducers: {

        },
        effects: {

        }
    })
}
class CustomerQuery extends React.Component {
    super(props) {
        this.props = props;
    }
    state = {
        totalPage: 0,//总页数
        currentPage: 0,//当前页数
        pageSize: 10,//每页页数
        queryCustomerTable:[],
        Gender: [
          {
            name: '男',
            value: '1'
          },
          {
            name: '女',
            value: '2'
          }
        ],
        CertiType: [
          {
            valueKey: '身份证',
            idKey: '1'
          },
          {
            valueKey: '护照',
            idKey: '2'
          },
          {
            valueKey: '户口簿',
            idKey: '3'
          },
          {
            valueKey: '军人身份证',
            idKey: '4'
          },
          {
            valueKey: '武装警察身份证',
            idKey: '5'
          },
          {
            valueKey: '港澳居民来往内地通行证',
            idKey: '6'
          },
          {
            valueKey: '台湾居民来往内地通行证',
            idKey: '7'
          },
          {
            valueKey: '外国人永久居留身份证',
            idKey: '8'
          },
          {
            valueKey: '出生证',
            idKey: '13'
          }
        ],
        filterOption:{}
    }
    componentDidMount() {
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {

                const form = this.props.form;
                // const birthdayValue = form.getFieldValue('birthday')
                // let birthdayData = null
                // if (birthdayValue == null) {
                //     birthdayData = birthdayValue
                // }else{
                //     birthdayData = birthdayValue.format('YYYY-MM-DD')
                // }

                this.state.currentPage = 0
                this.setState({
                    currentPage: 0
                })

                const dataValues = {
                    party_id: values.customer_id,
                    name: values.name,
                    certi_type: values.certi_type,
                    certi_no: values.certi_no,
                    phone_no: values.phone_no
                }
                for (const key in dataValues) {
                  if (dataValues[key] === '') {
                    delete dataValues[key]
                  }
                }
                const params={
                    "moduleName":"customer_search",
                    "data":JSON.stringify(dataValues),
                    "operatorId":"38005",
                    "pageSize":this.state.pageSize,
                    "currentPage":this.state.currentPage + 1,
                }
                this.setState({
                    filterOption: dataValues
                })

                T.fetch({
                    url: '/query/index',
                    data: params,
                    method: 'post'
                }).then((result) => {
                    if (result.success) {
                        let  fromString = result.value.data || {}
                        let fromJson= JSON.parse(fromString)
                        let fromData = fromJson.data || []
                        let pageData = fromJson || []

                        this.formatTableData(fromData)
                        this.setState({
                            // queryCustomerTable: fromData,
                            currentPage: 0
                        })
                        this.setState({
                            totalPage: pageData.totalPage * this.state.pageSize
                        })
                    }
                });
            }
        });
    }
    formatTableData = (result) => {
        this.setState ({
            queryCustomerTable:[]
        })
        result.map((item, index) => {
            item.key = index + 1
            if (item.gender) {
              item.gender = this.state.Gender.find(i => i.value == item.gender).name
            }
            if (`${item.certi_type}`) {
              let a = this.state.CertiType.find(i => i.idKey == `${item.certi_type}`)
              item.certi_type = a && a.valueKey
            }
            if (item.birthday) {
              item.birthday = moment(item.birthday).format('YYYY-MM-DD')
            }
            this.state.queryCustomerTable.push(item)
        })
        this.setState(this.state)
    }

    // formatTableData = (result) => {
    //     return result.map((item, index) => {
          // if (item.gender) {
          //   item.gender = Gender.find(i => i.value == item.gender).name
          // } else if (item.certi_type.toString()) {
          //   item.certi_type = CertiType.find(i => i.value == item.certi_type.toString).name
          // }
    //     })
    // }

    fetchResultTable = (values) => {
        const params={
            "moduleName":"customer_search",
            "data":JSON.stringify(this.state.filterOption),
            "operatorId":"38005",
            "pageSize": this.state.pageSize,
            "currentPage":this.state.currentPage + 1,
        }
        T.fetch({
            url: '/query/index',
            data: params,
            method: 'post'
        }).then((result) => {
            if (result.success) {
                let fromString = result.value.data || {}
                let fromJson= JSON.parse(fromString)
                let fromData = fromJson.data || []
                let pageData = fromJson || []

                this.setState({
                    totalPage: pageData.totalPage * this.state.pageSize
                })
                this.formatTableData(fromData)
                // this.setState({
                //     queryCustomerTable: fromData
                // })
            }
        });
    }

    handlePageChange = (currentPage, pageSize) => {
        this.setState({
            currentPage: currentPage - 1,
        }, this.fetchResultTable)
    }
    clickCustomerId = (record) => {
        actions.routing.push({
            pathname: '/customer-query-detail',
            search: '?id=' + record.party_id
        })
    }
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
        const customer_search = langMessage.customer_search || '客户查询';

        const name = langMessage.name || '姓名';
        const certificate = langMessage.certificate_text || '证件';
        const numberText = langMessage.number_text || '号码';
        const birthText = langMessage.date_birth || '出生日期';
        const indexText = langMessage.text_index || '序号';
        const genderText = langMessage.gender_text || '性别';
        const typeText = langMessage.type_text || '类型';
        const phone = langMessage.phone || '手机';
        const status = langMessage.status || '状态';
        const inputText = langMessage.text_input || '请输入';

        const columns = [{
            title: indexText,
            dataIndex: 'key',
            width: 50,
            render: (text, record) => <span>{text + (this.state.pageSize - 10) * this.state.currentPage}</span>,
        }, {
            title: clientText + ' ID',
            width: 80,
            dataIndex: 'party_id'
        }, {
            title: name,
            width: 70,
            dataIndex: 'name'
        }, {
            title: genderText,
            width: 50,
            dataIndex: 'gender'
        },{
            title: birthText,
            width: 90,
            dataIndex: 'birthday'
        },{
            title: certificate + typeText,
            width: 90,
            dataIndex: 'certi_type'
        },{
            title: certificate + numberText,
            width: 120,
            dataIndex: 'certi_no'
        },{
            title: '手机',
            width: 90,
            dataIndex: 'phone_no'
        },{
            title: '邮箱',
            width: 120,
            dataIndex: 'email'
        },{
            title: '地址',
            width: 150,
            dataIndex: 'address'
        },{
          title: '操作',
          width: 60,
          dataIndex: 'detail',
          render: (text, record) => <a onClick={() => this.clickCustomerId(record)}>查看</a>
        }
        // {
        //     title: clientText + status,
        //     dataIndex: 'status',
        // }
        ];
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
                        <span className="ml5">{customer_search}</span>
                    </div>
                </div>
                <div className="user-management pb30">
                    <Form className="query-form pl20 pb20" onSubmit={this.handleSubmit} layout='vertical'>
                        <Row className="mt10" type="flex" justify="start" align='middle'>
                            <Col span={9}>
                                <FormItem
                                    label={clientText + ' ID'}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('customer_id', {
                                    })(
                                        <Input className="system-input width180" placeholder={inputText} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={9}>
                                <FormItem
                                    label={clientText + '姓名'}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('name', {
                                    })(
                                        <Input className="system-input width180" placeholder={inputText} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="mt10" type="flex" justify="start" align='middle'>
                            <Col span={9}>
                                <FormItem
                                    label={certificate + typeText}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('certi_type', {
                                    })(
                                        <SelectDom idKey='idKey' valueKey='valueKey' style={{ width: 180 }} list={this.state.CertiType} placeholder={window.LangMessage.mms_pleaseSelect || '请选择'} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={9}>
                                <FormItem
                                    label={certificate + numberText}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('certi_no', {
                                    })(
                                        <Input className="system-input width180" placeholder={inputText} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="mt15" type="flex" justify="start" align='middle'>
                            
                            <Col span={9}>
                                <FormItem
                                    label={phone + numberText}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('phone_no', {
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

                    <div className="pl10 pr10 tdFirstMin greenFont">
                        <Table pagination={paginationConfig} bordered columns={columns} scroll={{ x: 1200 }} dataSource={this.state.queryCustomerTable} />
                    </div>
                </div>
            </div>
        );
    }
}

const WrappedCustomerQuery = Form.create()(CustomerQuery);

export default connect(state => {
    return state.queryCustomerQuery1
})(WrappedCustomerQuery)