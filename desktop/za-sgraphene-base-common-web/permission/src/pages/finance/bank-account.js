import React from 'react';
import ReactDOM from 'react-dom'
import SelectDom from '../../component/SelectDom';
import AddBank from './add-bank';
import mirror, {actions, connect} from 'mirrorx'
import {Row, Col, Button, Input,Form,Select, Table, Icon,Modal,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

mirror.model({
    name: 'systemBankAccount',
    initialState: {
        addVisible: false
    },
    reducers: {
        setAddVisible(state,data) {
            return Object.assign({}, state,{addVisible: data});
        }
    },
    effects: {
         
    }
})

class BankAccount extends React.Component {
    super(props) {
        this.props = props;
    }  
    state = { 
        bankList:[],//所属银行
        bankCode:'',//所属银行code
        bankLocations:[],//银行网点
        bankQueryTable:[],//表格数据
        locationsCityMap:[],//网点城市code数组 
        locationsCity:[],//网点城市数据
        disabled: true
    }
    componentDidMount() {
      this.selectBankList();
    }
    selectBankList = (e) => {
        //所属银行
        T.fetch({
            url: "/bank/listBank",
            data: {},
            method: 'post'
        }).then((res) => {
            this.setState({
              bankList: res.value
            })
        }); 
    }
    selectbankLocations = (code) => {
        console.log("code",code)
        if(code){
            this.setState({
                disabled: false
            })
            //所属银行code
            T.fetch({
                url: "/bank/listBankLocations",
                data: {
                    directBankCode: code,
                },
                method: 'post'
            }).then((res) => {
                this.setState({
                    bankCode: res.value[0].directBankCode
                })
            });
        }
    }
    locationsCityChange = (value) => {
        T.fetch({
            url: "/bank/queryBankStandardareas",
            data: {
                "name":value
            },
            method: 'post'
        }).then((res) => {
            if(res.success){
                let locationsCity = res.value || [];
                this.setState({
                    locationsCity: locationsCity
                });
                if(res.value == false){
                    this.state.locationsCity.map((item,index)=>{
                        this.state.locationsCityMap[0];
                    });
                }else{
                    this.state.locationsCity.map((item,index)=>{
                        this.state.locationsCityMap[index] = item.code
                    });
                    this.bankLocations();
                }
            }
        }); 
    }
    bankLocations = () => {
        //银行网点
        T.fetch({
            url: "/bank/listBankLocations",
            data: {
                directBankCode: this.state.bankCode,
                standardAreaCodes: this.state.locationsCityMap 
            },
            method: 'post'
        }).then((res) => {
            this.setState({
                bankLocations: res.value
            })
            //console.log("bankLocations333,",this.state.bankLocations)
        });
    }
    //点击查询
    bankAccountSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                T.fetch({
                    url: "/bank/listCorporationBankAccount",
                    data: {
                        ...values
                    },
                    method: 'post'
                }).then((result) => {
                    if (result.success) {
                        let  fromData = result.value || []
                        this.formatTableData(fromData)
                        this.setState({
                            bankQueryTable: fromData
                        })                        
                    }
                }); 
            }
        });
    }
    formatTableData = (result) => {
        this.setState({
            bankQueryTable: []
        })
        result.forEach((item, index) => {
            item.key = index + 1
            this.state.bankQueryTable.push(item)
        })
        this.setState(this.state)
    }
    //新增弹框
    addShowModal = () => {
        actions.systemBankAccount.setAddVisible(true);
    }
    addOK = () => {
        actions.systemBankAccount.setAddVisible(false);
        this.props.form.resetFields()
        this.setState({
            disabled: true
        })
    }
    addChange = () => {
        actions.systemBankAccount.setAddVisible(false);
        this.props.form.resetFields()
        this.setState({
            disabled: true
        })
    }
    render() {
      const { getFieldDecorator } = this.props.form;

      const options = this.state.bankLocations.map((item,index)=>{
          return (
            <Option key={item.code} value={item.code} title={item.name}>{item.name}</Option>
          )
      });

      const columns = [{
          title: '序号',
          dataIndex: 'key',
        }, {
          title: '银行账号',
          dataIndex: 'bankAccount',
        }, {
          title: '所属银行',
          dataIndex: 'bankName',
        }, {
          title: '银行网点',
          dataIndex: 'bankLocationName',
        },{
          title: '账户说明',
          dataIndex: 'accountDesc',
      }];
      return (
        <div>
            <div className="pb15 search-result-back">
                <div style={{ width: 300 }} >
                    <span className="mr5 strong">财务设置</span>
                    <Icon type="right" />
                    <span className="ml5">银行设置</span>
                    <Icon type="right" />
                    <span className="ml5">银行账号</span>
                </div>
            </div>
            <div className="user-management pb30">
                <Form className="finance-form pl10 pr10 pb20" onSubmit={this.bankAccountSubmit}>
                    <Row className="mt10" type="flex" justify="start">
                        <Col span={9}>
                            <FormItem
                                label="所属银行"
                                labelCol={{ span: 6 }}
                            >
                                {getFieldDecorator('directBankCode', {
                                    rules: [{
                                        required: true, 
                                        message: '请选择所属银行',
                                    }]
                                })(
                                    <SelectDom 
                                        onChange={this.selectbankLocations} 
                                        list={this.state.bankList} 
                                        idKey="directBankCode" 
                                        valueKey="name" 
                                        className="system-input bankErr width240" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={9}>
                            <FormItem
                                label="银行账号"
                                labelCol={{ span: 6 }}
                            >
                                {getFieldDecorator('bankAccount', {
                                })(
                                    <Input className="system-input width240" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className="mt15" type="flex" justify="start">
                        <Col span={9}>
                            <FormItem
                                label="银行网点"
                                labelCol={{ span: 6 }}
                            >
                                {getFieldDecorator('bankLocationCode', {
                                })(
                                    <Select
                                        mode="combobox"
                                        disabled={this.state.disabled}
                                        showArrow={false}
                                        filterOption={false}
                                        onSearch={this.onSearch}
                                        onChange={this.locationsCityChange}
                                        className="system-input code-input width240" 
                                        placeholder="请输入所选城市"
                                    >
                                        {options}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={9}>
                            <FormItem
                                label="账户说明"
                                labelCol={{ span: 6 }}
                            >
                                {getFieldDecorator('accountDesc', {
                                })(
                                    <Input className="system-input width240" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6} className="tar">
                            <Button htmlType="submit" type="primary" className="product-filter-btn">查询</Button>
                            <Button onClick={this.addShowModal} type="primary" className="product-filter-btn">新增</Button>
                            <Modal
                                wrapClassName="vertical-center-modal"
                                width="700px"
                                title="银行账号设置"
                                footer={null}
                                onOk={this.addOk}
                                onCancel={this.addChange}
                                visible={this.props.addVisible}
                            >
                                <AddBank />
                            </Modal>
                        </Col>
                    </Row>
                </Form>

                <div className="middle-line"><p></p></div>
                <div className="mt15 pl10 pr10 pt15 greenFont">
                    <Table pagination={false} bordered columns={columns} dataSource={this.state.bankQueryTable} />
                </div>
            </div>
        </div>
      );
    }
}

const WrappedBankAccount = Form.create()(BankAccount);

export default connect(state => {
    return state.systemBankAccount
})(WrappedBankAccount)