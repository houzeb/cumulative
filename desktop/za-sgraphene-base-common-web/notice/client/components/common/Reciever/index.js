/*
 * @Author: za-yanqing
 * @Date: 2018-08-27 16:20:14
 * @Description: '理赔领款人业务封装组件'
 * @Last Modified by: za-weilin
 * @Last Modified time: 2018-11-15 18:36:21
 * @ToDo: ''
 */
import React, { Component } from 'react';
import { Table, Popconfirm, InputNumber, Divider } from 'antd';
import propType from 'prop-types';
import AddModal from './AddReciever';
import BlockAdd from '../BlockAdd';

class Reciever extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // visible: false,
            newTableData: null
        };
    }
    // 表格头按不同type显示不同列
    // param: type(string)
    // param: column(array)
    tableType(type, column) {
        if (type === 'report') {
            // 报案，立案阶段，增加一列删除
            column.push({
                title: '操作',
                key: 'action',
                render: (record) => (
                    <div>
                        <a href="#">编辑</a>
                        <Divider type="vertical" />
                        <Popconfirm title="确认删除?" onConfirm={() => this.props.columnDelete(record)}>
                            <a href="#">删除</a>
                        </Popconfirm>
                    </div>
                ),
            });
            return column;
        } else if (type === 'edit') {
            // 报案，立案阶段，增加一列删除
            column.push({
                title: '操作',
                key: 'action',
                render: (record) => (
                    <div>
                        <a href="#">编辑</a>
                    </div>
                ),
            });
            return column;
        } else if (type === 'check') {
            // 初审，增加一列领款金额
            column.push({
                title: '领款金额',
                key: 'money',
                render: (record, text, index) => (
                    <InputNumber
                        defaultValue={record.money}
                        min={0}
                        formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/￥\s?|(,*)/g, '')}
                        onChange={(val) => this.onNumChange(val, index)}
                    />
                ),
            });
            return column;
        } else if (type === 'close') {
            // 结案，增加一列领款金额展示
            column.push({
                title: '领款金额',
                key: 'money',
                dataIndex: 'money',
            });
            return column;
        }
    }
    // 领款金额change事件
    // param: val(当前值)
    // param: index(传入的tableData索引)
    onNumChange = (val, index) => {
        // 传入的表格数据，用来深度克隆
        let { tableData } = this.props;
        let { newTableData } = this.state;
        // 深度克隆
        let newData;
        newData = newTableData ? JSON.parse(JSON.stringify(newTableData)) : JSON.parse(JSON.stringify(tableData));
        newData[index].money = val;
        this.setState({
            newTableData: newData,
        });
    }
    // 外部访问静态函数获取表格数据
    getData = () => {
        let { tableData } = this.props;
        return this.state.newTableData || tableData;
    }
    render() {
        const { children, type, loading, tableData } = this.props;
        // let column = [{
        //     title: '姓名/机构名称',
        //     dataIndex: 'customerName',
        // }, {
        //     title: '证件类型',
        //     dataIndex: 'certiType',
        //     render: (text, record) => text && text.label
        // }, {
        //     title: '证件号/机构代码',
        //     dataIndex: 'certiNo',
        // }, {
        //     title: '支付方式',
        //     dataIndex: 'payMethod',
        //     render: (text, record) => text && text.label
        // }, {
        //     title: '开户行',
        //     render: (text, record) => record.bankCode && record.bankCode.label
        // }, {
        //     title: '账号',
        //     dataIndex: 'accountNo',
        //     // render: (text, record) => text && text.accountNo
        // }];
        let column = [{
            title: '支付方式',
            dataIndex: 'payMethod',
            render: (text, record) => text && text.label
        }, {
            title: '金融机关名',
            dataIndex: 'customerName1',
        }, {
            title: '分店名',
            dataIndex: 'customerName2',
        }, {
            title: '账号类型',
            dataIndex: 'certiType',
            render: (text, record) => text && text.label
        }, {
            title: '账号号码',
            dataIndex: 'certiNo',
        }, {
            title: '账号所属人',
            dataIndex: 'customerName',
        }, {
            title: '账号',
            dataIndex: 'accountNo',
            // render: (text, record) => text && text.accountNo
        }];
        // 通过不同type渲染不同的操作
        // report报案阶段显示删除操作
        // check初审阶段显示输入领款金额
        // close显示结案领款金额
        column = this.tableType(type, column);
        return (
            <div className="reciever">
                <div className="complex-table">
                    <Table columns={column} dataSource={tableData} pagination={false} loading={loading} />
                </div>
                {this.props.blockAdd && <BlockAdd
                    onClick={() => {
                        // this.setState({
                        //     visible: true
                        // });
                        this.props.addPayee();
                    }}
                />}
                <AddModal
                    visible={this.props.modalVisible}
                    onCancel={this.props.cancelAdd}
                    onSubmit={this.props.onSubmit}
                >
                    {children}
                </AddModal>
            </div>
        );
    }
}

Reciever.propTypes = {
    children: propType.object, // 传入的dom
    type: propType.string, // ‘report-报案’，'check-审核', 'close-结案'三个状态
    columnDelete: propType.func, // 报案，立案时表格的删除操作事件, 与report配合使用
    loading: propType.bool, // 表格的loading开关
    tableData: propType.array, // 表格数据
    onSubmit: propType.func,
    modalVisible: propType.bool,
    addPayee: propType.func, // 添加付款人
    cancelAdd: propType.func, // 取消添加
    blockAdd: propType.bool, // 新增弹框按钮
};

export default Reciever;
