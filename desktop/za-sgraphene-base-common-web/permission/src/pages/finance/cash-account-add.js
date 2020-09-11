import React from 'react';
import ReactDOM from 'react-dom'
import SelectDom from '../../component/SelectDom';
import mirror, { actions, connect } from 'mirrorx';
import { Row, Col, Button, Input, Form, Select, Table, Icon, Modal, TreeSelect } from 'antd';
import T from '../../lib/T';
const FormItem = Form.Item;
const Option = Select.Option;

mirror.model({
    name: 'systemCashAccountAdd',
    initialState: {},
    reducers: {},
    effects: {},
})
class CashAccountAdd extends React.Component {
    super(props) {
        this.props = props;
    }
    state = {
        orgList: this.props.orgList,
        diffOption: this.props.diffOption,
        methodOption: this.props.methodOption,
        currency: this.props.currency,
        bankOption: this.props.bankOption,
        status: this.props.status,
        accountList: []
    }
    componentWillReceiveProps(nextProps) {
        let list;
        if(!this.props.form.getFieldValue('directBankCode')) {
            list = [];
        }else {
            list = this.state.accountList;
        }
        this.setState({
            orgList: nextProps.orgList,
            diffOption: nextProps.diffOption,
            methodOption: nextProps.methodOption,
            currency: nextProps.currency,
            bankOption: nextProps.bankOption,
            status: nextProps.status,
            accountList: list
        });
    }
    // 所属银行改变，刷新账号列表
    onBankChange(val) {
        let bankCode = val;
        T.fetch({
            url: '/bank/listCorporationBankAccount',
            data: {
                directBankCode: val
            }
        }).then(res => {
            if(res.success) {
                this.setState({
                    accountList: res.value
                })
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { orgList, diffOption, methodOption, currency, bankOption, status, accountList } = this.state;
        return (
            <Modal
                wrapClassName="vertical-center-modal"
                title={this.props.title}
                visible={this.props.addVisible}
                onOk={this.props.onOk}
                onCancel={this.props.onCancel}
            >
                <Form className="person-form">
                    <Row className="mt10" type="flex" justify="start">
                        <Col span={12}>
                            <FormItem
                                label="组织机构"
                                labelCol={{ span: 8 }}
                            >
                                {getFieldDecorator('orgCode', {
                                    rules: [{
                                        required: true,
                                        message: "必填"
                                    }]
                                })(
                                    <TreeSelect
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        treeData={this.state.orgList}
                                        treeDefaultExpandAll
                                        placeholder="请选择"
                                        style={{ width: 150, display: 'inline-block' }}
                                    />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="收付区分"
                                labelCol={{ span: 8 }}
                            >
                                {getFieldDecorator('payFlag', {
                                    rules: [{
                                        required: true,
                                        message: "必填"
                                    }]
                                })(
                                    <Select className="system-input width150" placeholder="请选择">
                                        {
                                            this.state.diffOption.map((item, index) =>
                                                <Option value={item.enumName} key={item.code.toString()}>{item.desc}</Option>
                                            )
                                        }
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className="mt10" type="flex" justify="start">
                        <Col span={12}>
                            <FormItem
                                label="收付方式"
                                labelCol={{ span: 8 }}
                            >
                                {getFieldDecorator('payWay', {
                                    rules: [{
                                        required: true,
                                        message: "必填"
                                    }]
                                })(
                                    <Select className="system-input width150" placeholder="请选择">
                                        {
                                            this.state.methodOption.map((item, index) =>
                                                <Option value={item.enumName} key={item.code.toString()}>{item.desc}</Option>
                                            )
                                        }
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="币种"
                                labelCol={{ span: 8 }}
                            >
                                {getFieldDecorator('currency', {
                                    rules: [{
                                        required: true,
                                        message: "必填"
                                    }]
                                })(
                                    <Select className="system-input width150" placeholder="请选择">
                                        {
                                            this.state.currency.map((item, index) =>
                                                <Option value={item.enumName} key={item.code.toString()}>{item.desc}</Option>
                                            )
                                        }
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className="mt10" type="flex" justify="start">
                        <Col span={12}>
                            <FormItem
                                label="所属银行"
                                labelCol={{ span: 8 }}
                            >
                                {getFieldDecorator('directBankCode', {
                                    rules: [{
                                        required: true,
                                        message: "必填"
                                    }]
                                })(
                                    <Select className="system-input width150" placeholder="请选择" onChange={this.onBankChange.bind(this)}>
                                            {
                                                this.state.bankOption.map((item, index) =>
                                                    <Option value={item.directBankCode} key={item.directBankCode}>{item.name}</Option>
                                                )
                                            }
                                        </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="银行账号"
                                labelCol={{ span: 8 }}
                            >
                                {getFieldDecorator('bankAccountId', {
                                    rules: [{
                                        required: true,
                                        message: "必填"
                                    }]
                                })(
                                    <Select className="system-input width150" placeholder="请选择">
                                            {
                                                this.state.accountList.map((item, index) =>
                                                    <Option value={item.id} key={index}>{item.bankAccount}</Option>
                                                )
                                            }
                                        </Select>
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className="mt10" type="flex" justify="start">
                        <Col span={12}>
                            <FormItem
                                label="账号说明"
                                labelCol={{ span: 8 }}
                            >
                                {getFieldDecorator('accountDesc', {
                                    rules: [{
                                        required: true,
                                        message: "必填"
                                    }]
                                })(
                                    <Input className="system-input width150" placeholder="请输入" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="状态"
                                labelCol={{ span: 8 }}
                            >
                                {getFieldDecorator('status', {
                                    rules: [{
                                        required: true,
                                        message: "必填"
                                    }]
                                })(
                                    <Select className="system-input width150" placeholder="请选择">
                                        {
                                            status.map((item, index) =>
                                                <Option value={item.enumName} key={item.code.toString()}>{item.desc}</Option>
                                            )
                                        }
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
}

const WrappedCashAccountAdd = Form.create()(CashAccountAdd);

export default WrappedCashAccountAdd;