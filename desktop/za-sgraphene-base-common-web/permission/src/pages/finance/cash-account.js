import React from 'react';
import ReactDOM from 'react-dom'
import SelectDom from '../../component/SelectDom';
import mirror, { actions, connect } from 'mirrorx';
import { Row, Col, Button, Input, Form, Select, Table, Icon, Modal, TreeSelect, message } from 'antd';
import T from '../../lib/T';
import WrapperForm from './cash-account-add';
const FormItem = Form.Item;
const Option = Select.Option;

mirror.model({
    name: 'systemCashAccount',
    initialState: {

    },
    reducers: {

    },
    effects: {

    }
})
class CashAccount extends React.Component {
    super(props) {
        this.props = props;
    }
    state = {
        addVisible: false,
        orgList: [],
        diffOption: [],
        methodOption: [],
        currency: [],
        bankOption: [],
        tableData: [],
        status: []
    }
    // 组件渲染完成后
    componentDidMount() {
        this.getOrganization();
        // 币种
        this.getOption(
            {
                "moduleName": "common",
                "enumClassName": "CurrencyEnum"
            },
            'currency'
        );
        // 收付区分
        this.getOption(
            {
                "moduleName": "mdm",
                "enumClassName": "PayFlagEnum"
            },
            'diffOption'
        );
        // 收付方式
        this.getOption(
            {
                "moduleName": "bcp",
                "enumClassName": "PayMethodEnum"
            },
            'methodOption'
        );
        // 新增里的状态选项
        this.getOption(
            {
                "moduleName": "mdm",
                "enumClassName": "CorporationBankStatusEnum"
            },
            'status'
        );
        // 银行列表下拉
        this.getBankList();
        this.onSearchTable();
    }
    // format格式化树数据格式
    formatOrganize(results) {
        const arr = [];
        results.map((item, index) => {
            const obj = {
                value: item.organizationCode + '',
                label: item.organizationName,
                key: item.organizationCode,
            };

            if (item.children && item.children.length > 0) {
                const childrenArr = this.formatOrganize(item.children);
                obj.children = childrenArr;
            }
            arr.push(obj);
        });
        return arr;
    };
    // 获取组织结构
    getOrganization() {
        T.fetch({
            url: '/org/queryOrganizationTree',
            data: {
            }
        }).then(res => {
            if (res.success) {
                let orgList = this.formatOrganize(res.value);
                this.setState({
                    orgList: orgList
                })
            }
        });

    }
    // 拿收付区分、收付方式、币种通用下拉方法
    getOption(data, state) {
        T.fetch({
            url: '/component/emum/list',
            data
        }).then(res => {
            if (res.success) {
                let json = {};
                json[state] = res.value;
                this.setState(json);
            }
        });
    }
    // 所属银行
    getBankList() {
        T.fetch({
            url: '/bank/listBank'
        }).then(res => {
            if (res.success) {
                this.setState({
                    bankOption: res.value
                });
            }
        });
    }
    // 查询
    onSearchTable() {
        this.props.form.validateFields((err, values) => {
            T.fetch({
                url: '/bank/listCashAccount',
                data: {
                    orgCode: values.orgCode,
                    payFlag: values.payFlag,
                    payWay: values.payWay,
                    accountDesc: values.accountDesc,
                    directBankCode: values.directBankCode,
                    bankAccount: values.bankAccount
                }
            }).then(res => {
                let arr = res.value;
                arr.forEach((item, index) => {
                    item.key = index + 1;
                });
                this.setState({
                    tableData: arr
                });
            })
        })
    };
    //新增弹框
    addShowModal() {
        this.setState({ addVisible: true });
    }
    saveFormRef(form) {
        this.formDialog = form;
    }
    dialogOk() {
        this.formDialog.validateFields((err, values) => {
            if (!err) {
                T.fetch({
                    url: '/bank/saveCashAccount',
                    data: {
                        "orgCode": values.orgCode,
                        "payFlag": values.payFlag,
                        "payWay": values.payWay,
                        "currency": values.currency,
                        "directBankCode": values.directBankCode,
                        "bankAccountId": values.bankAccountId,
                        "accountDesc": values.accountDesc,
                        "status": values.status
                    }
                }).then(res => {
                    if (res.success) {
                        message.success('新增成功');
                        this.formDialog.resetFields();
                        this.setState({ addVisible: false });
                        this.onSearchTable();
                    }
                })
            }
        });
    }
    dialogCancel() {
        this.formDialog.resetFields();
        this.setState({ addVisible: false });
    }
    render() {
        const { getFieldDecorator } = this.props.form;

        const columns = [{
            title: '序号',
            dataIndex: 'key',
        }, {
            title: '组织机构',
            dataIndex: 'orgName',
        }, {
            title: '收付区分',
            dataIndex: 'payFlag',
        }, {
            title: '收付方式',
            dataIndex: 'payWay',
        }, {
            title: '币种',
            dataIndex: 'currency',
        }, {
            title: '所属银行',
            dataIndex: 'directBankCode',
        }, {
            title: '银行账号',
            dataIndex: 'bankAccount',
        }, {
            title: '银行说明',
            dataIndex: 'accountDesc',
        }, {
            title: '状态',
            dataIndex: 'status',
        }];
        return (
            <div>
                <div className="pb15 search-result-back">
                    <div style={{ width: 300 }} >
                        <span className="mr5 strong">财务设置</span>
                        <Icon type="right" />
                        <span className="ml5">银行设置</span>
                        <Icon type="right" />
                        <span className="ml5">现金账号</span>
                    </div>
                </div>
                <div className="user-management pb30">
                    <Form className="finance-form pl10 pr10 pb20" onSubmit={this.handleSubmit}>
                        <Row className="mt10" type="flex" justify="start">
                            <Col span={9}>
                                <FormItem
                                    label="组织机构"
                                    labelCol={{ span: 6 }}
                                >
                                    {getFieldDecorator('orgCode', {
                                    })(
                                        <TreeSelect
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            treeData={this.state.orgList}
                                            treeDefaultExpandAll
                                            placeholder="请选择"
                                            style={{ width: 180, display: 'inline-block' }}
                                        />
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={9}>
                                <FormItem
                                    label="收付区分"
                                    labelCol={{ span: 6 }}
                                >
                                    {getFieldDecorator('payFlag', {
                                    })(
                                        <Select className="system-input " placeholder="请选择">
                                            {
                                                this.state.diffOption.map((item, index) =>
                                                    <Option value={item.code.toString()} key={item.code.toString()}>{item.desc}</Option>
                                                )
                                            }
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="mt10" type="flex" justify="start">
                            <Col span={9}>
                                <FormItem
                                    label="收付方式"
                                    labelCol={{ span: 6 }}
                                >
                                    {getFieldDecorator('payWay', {
                                    })(
                                        <Select className="system-input " placeholder="请选择">
                                            {
                                                this.state.methodOption.map((item, index) =>
                                                    <Option value={item.enumName} key={item.code.toString()}>{item.desc}</Option>
                                                )
                                            }
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={9}>
                                <FormItem
                                    label="币种"
                                    labelCol={{ span: 6 }}
                                >
                                    {getFieldDecorator('accountDesc', {
                                    })(
                                        <Select className="system-input " placeholder="请选择">
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
                        <Row className="mt15" type="flex" justify="start">
                            <Col span={9}>
                                <FormItem
                                    label="所属银行"
                                    labelCol={{ span: 6 }}
                                >
                                    {getFieldDecorator('directBankCode', {
                                    })(
                                        <Select className="system-input " placeholder="请选择">
                                            {
                                                this.state.bankOption.map((item, index) =>
                                                    <Option value={item.directBankCode} key={item.directBankCode}>{item.name}</Option>
                                                )
                                            }
                                        </Select>
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
                                        <Input className="system-input " />
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={6} className="tar">
                                <Button htmlType="submit" onClick={this.onSearchTable.bind(this)} type="primary" className="product-filter-btn">查询</Button>
                                <Button onClick={this.addShowModal.bind(this)} htmlType="submit" type="primary" className="product-filter-btn">新增</Button>
                            </Col>
                        </Row>
                    </Form>

                    <div className="middle-line"><p></p></div>
                    <div className="mt15 pl10 pr10 pt15 greenFont">
                        <Table pagination={false} bordered columns={columns} dataSource={this.state.tableData} />

                        <Row className="mt30" type="flex" justify="center">
                            <Col>
                                {<Button htmlType="submit" type="primary" className="system-btn product-save-btn">退出</Button>}
                            </Col>
                        </Row>
                    </div>
                </div>
                <WrapperForm
                    addVisible={this.state.addVisible}
                    title='现金账号设置'
                    onOk={this.dialogOk.bind(this)}
                    onCancel={this.dialogCancel.bind(this)}
                    ref={this.saveFormRef.bind(this)}
                    orgList={this.state.orgList}
                    diffOption={this.state.diffOption}
                    methodOption={this.state.methodOption}
                    currency={this.state.currency}
                    bankOption={this.state.bankOption}
                    status={this.state.status}
                />
            </div>
        );
    }
}

const WrappedCashAccount = Form.create()(CashAccount);

export default connect(state => {
    return state.systemCashAccount
})(WrappedCashAccount)