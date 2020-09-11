import React from 'react';
import ReactDOM from 'react-dom'
import SelectDom from '../../component/SelectDom';
import mirror, {actions, connect} from 'mirrorx'
import {Row, Col, Button, Input,Form,Select, Table, Icon,Modal,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


class AddBank extends React.Component {
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
        }else{
            this.setState({
                disabled: true
            })            
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
            console.log("bankLocations333,",this.state.bankLocations)
        });
    }
    saveBankSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('saveBankSubmit....', values);
                T.fetch({
                    url: "/bank/saveCorporationBankAccount",
                    data: {
                        ...values
                        /*directBankCode:values.directBankCode,
                        bankLocationCode:values.bankLocationCode,
                        accountDesc:values.accountDesc,
                        bankAccount:values.bankAccount*/
                    },
                    method: 'post'
                }).then((result) => {
                    if (result.success) {
                        this.props.form.resetFields()
                        message.success("提交成功")
                        this.setState({
                            disabled: true
                        })
                        actions.systemBankAccount.setAddVisible(false);
                    }
                }); 
            }
        });
    }
    render() {
      const { getFieldDecorator } = this.props.form;

      const options = this.state.bankLocations.map((item,index)=>{
          return (
            <Option value={item.code} key={item.code} title={item.name}>{item.name}</Option>
          )
      });

      return (
            <Form className="person-form" onSubmit={this.saveBankSubmit}>
                <Row className="mt10" type="flex" justify="start">
                    <Col span={12}>
                        <FormItem
                            label="所属银行"
                            labelCol={{ span: 8 }}
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
                                    className="system-input" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="银行网点"
                            labelCol={{ span: 8 }}
                        >
                            {getFieldDecorator('bankLocationCode', {
                                rules: [{
                                    required: true, 
                                    message: '请选择银行网点',
                                }]
                            })(
                                <Select
                                    mode="combobox"
                                    disabled={this.state.disabled}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.onSearch}
                                    onChange={this.locationsCityChange}
                                    className="system-input code-input " 
                                    placeholder="请输入所选城市"
                                >
                                    {options}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row className="mt10" type="flex" justify="start">
                    <Col span={12}>
                        <FormItem
                            label="银行账号"
                            labelCol={{ span: 8 }}
                        >
                            {getFieldDecorator('bankAccount', {
                                rules: [{
                                    required: true, 
                                    message: '请选择银行账号',
                                }]
                            })(
                                <Input className="system-input " />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="账号说明"
                            labelCol={{ span: 8 }}
                        >
                            {getFieldDecorator('accountDesc', {
                                rules: [{
                                    required: true, 
                                    message: '请选择账号说明',
                                }]
                            })(
                                <Input className="system-input " />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row className="mt15 mb10" type="flex" justify="center">
                    <Col>
                        { <Button htmlType="submit" type="primary" className="system-btn product-save-btn">提交</Button> }
                    </Col>
                </Row>
            </Form>
      );
    }
}

const WrappedAddBank = Form.create()(AddBank);

export default WrappedAddBank;