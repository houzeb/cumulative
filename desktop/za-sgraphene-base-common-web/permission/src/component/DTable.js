import React, { Component } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import CollectionCreateForm from './DTableAddColumn';
import './DTable.scss';
import { error } from 'util';

const FormItem = Form.Item;

class DTable extends Component {
    constructor(props) {

        super(props);
        this.state = {
            visible: false,
            columns: this.props.columns,
            tableData: this.props.tableData,
            x: 1,
            y: 1,
            requireText: window.LangMessage.manage_required || '必填',
            errorMessage: {
                number: window.LangMessage.input_number || '请输入数字',
                text: window.LangMessage.enter_character || '请输入字符',
                interval: window.LangMessage.enter_interval_form || '请输入区间形式,例如：[0,9]'
            }
        };
        this.columns = this.props.columns;
        this.data = this.props.tableData;
        this.addRow = this.addRow.bind(this);
        this.addCol = this.addCol.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.saveFormRef = this.saveFormRef.bind(this);
        this.removeRow = this.removeRow.bind(this);
        this.removeCol = this.removeCol.bind(this);
    }
    // 外部访问get内部列和行数据
    validatorData() {
        let columns = this.state.columns;
        let data = this.state.tableData;
        let success = true;
        // 判断所有数据是否完整合法
        columns.forEach((item, index) => {
            // 判断column是否为空，显示错误
            if (item.title === '') {
                this.isError(item, this.state.requireText);
                success = false;
            } else {
                this.isRight(item);
            }
        });
        data.forEach((item, index) => {
            for (let i in item) {
                if (i !== 'key' && i.indexOf('error-') == -1 && i.indexOf('message-') == -1 && i.indexOf('class-') == -1) {
                    // 判断是否为空，显示错误
                    if (item[i] === '') {
                        this.isDataError(item, this.state.requireText, i);
                        success = false;
                    } else {
                        this.isDataRight(item, i);
                        // 判断是否符合该列数据格式
                        let type;
                        let columns = this.state.columns;
                        for (let j = 0; j < columns.length; j++) {
                            if (columns[j].dataIndex === i) {
                                // 确定了type
                                type = columns[j].type;
                            }
                        }
                        // 判断输入是否符合该type的数据类型
                        //console.log(item, i, type);
                        let result = this.isType(item, i, type);

                        if (result.result) {
                            this.isDataRight(item, i);
                        } else {
                            this.isDataError(item, result.message, i);
                            success = false;
                        }
                    }
                }
            }
        });
        // 更新state
        this.setState({
            columns,
            tableData: data
        });
        return {
            result: success,
            column: this.state.columns,
            data: this.state.tableData
        };
    }
    // 拿数据不判断完整合法性
    getData() {
        return {
            column: this.state.columns,
            data: this.state.tableData
        };
    }
    // reset validator
    resetValidator() {
        let columns = this.state.columns;
        let data = this.state.tableData;
        columns.forEach((item, index) => {
            item.error = false;
            item.message = '';
            item.class = '';
        });
        data.forEach((item, index) => {
            for (let i in item) {
                if (i.indexOf('error-') > -1) {
                    item[i] = false;
                } else if (i.indexOf('message-') > -1 || i.indexOf('class-') > -1) {
                    item[i] = '';
                }
            }
        });
        this.setState({
            columns,
            tableData: data
        })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            columns: nextProps.columns,
            tableData: nextProps.tableData
        })
    }
    // dialog事件
    handleCancel() {
        this.setState({ visible: false });
    }
    saveFormRef(form) {
        this.form = form;
    }
    // 增加行
    addRow() {
        let columns = this.state.columns;
        let data = this.state.tableData;
        let index = this.state.y;

        // 创建新条目
        let obj = {};
        obj.key = 'td' + index;
        columns.forEach((item, index) => {
            obj[item.dataIndex] = '';
        });
        data.push(obj);

        // 触发ui更新
        this.setState({
            y: this.state.y + 1,
            tableData: data
        });
    }
    // 删除行
    removeRow() {
        let data = this.state.tableData;
        data.splice(data.length - 1, 1);
        // 触发ui更新
        this.setState({
            tableData: data
        })
    }
    // 增加列
    addCol() {
        this.setState({ visible: true });
    }
    // 选择好类型后添加
    handleCreate() {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            // 这个key需要，在下面data增加一列时所需的object的key键
            let key = 'th' + this.state.x;

            // 增加一列
            let col = this.state.columns;
            let newCol = {
                title: '',
                dataIndex: key,
                key: key,
                message: '',
                error: false,
                class: '',
                type: values.sort  // Number/Text/Interval
            }
            col.push(newCol);

            // 表单reset，并且关闭对话框，赋值column对象触发ui修改，索引加1
            form.resetFields();
            this.setState({
                visible: false,
                columns: col,
                x: this.state.x + 1
            });

            // data里的数据增加一列
            let data = this.state.tableData;
            data.forEach((item, index) => {
                item[key] = '';
            })
        });
    }
    // 删除列
    removeCol() {
        // 删除th里的最后一个
        let columns = this.state.columns;
        let key = columns[columns.length - 1].dataIndex;
        columns.splice(columns.length - 1, 1);
        // 遍历tableData里，每条最后一个
        let data = this.state.tableData;
        data.forEach((item, index) => {
            delete item[key];
        });
        this.setState({
            columns,
            tableData: data
        });
    }
    // 更新state里的col
    thChange(e, index) {
        // 记录下新值
        let newVal = e.target.value;
        // 取所属索引条目
        let col = this.state.columns;
        let targetCol = col[index];
        // 赋予新值
        targetCol.title = newVal;
        // 判断是否为空，显示错误
        if (newVal === '') {
            this.isError(targetCol, this.state.requireText);
        } else {
            this.isRight(targetCol);
        }
        // 更新state
        this.setState({
            columns: col
        });
    }
    // 更新state里的data数据, 触发event对象，index当前事件所属obj的索引，key是所修改的key
    changeData(e, index, key) {
        // 记录下新值
        let newVal = e.target.value;
        // 取所属索引条目
        let data = this.state.tableData;
        let targetData = data[index];
        // 赋予新值
        targetData[key] = newVal;
        // 判断是否为空，显示错误
        if (newVal === '') {
            this.isDataError(targetData, this.state.requireText, key);
        } else {
            this.isDataRight(targetData, key);
            // 判断是否符合该列数据格式
            let type;
            let columns = this.state.columns;
            for (let i = 0; i < columns.length; i++) {
                if (columns[i].dataIndex === key) {
                    // 确定了type
                    type = columns[i].type;
                }
            }
            // 判断输入是否符合该type的数据类型
            let result = this.isType(targetData, key, type);
            console.log(result);
            if (result.result) {
                this.isDataRight(targetData, key);
            } else {
                this.isDataError(targetData, result.message, key);
            }
        }
        // 更新state
        this.setState({
            tableData: data
        });
    }
    // 单个判断必填错误
    isError(item, message) {
        item.error = true;
        item.message = message;
        item.class = 'error';
    }
    // 单个判断必填正确
    isRight(item) {
        item.error = false;
        item.message = '';
        item.class = '';
    }
    // data里的单个判断必填错误
    isDataError(item, message, key) {
        item['error-' + key] = true;
        item['message-' + key] = message;
        item['class-' + key] = 'error';
    }
    // data里的单个判断必填正确
    isDataRight(item, key) {
        item['error-' + key] = false;
        item['message-' + key] = '';
        item['class-' + key] = '';
    }
    // 通过规定类型判断并返回指定错误提示
    isType(item, key, type) {
        console.log(item,key,type);
        //console.log(item[key], type);
        if (type === 'Number') {
            var Reg = /^(\-|\+)?\d+(\.\d+)?$/;
            return {
                result: Reg.test(item[key]),
                message: this.state.errorMessage.number
            };
        } else if (type === 'String') {
            // var Reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
            var Reg = '';
            return {
                // result: Reg.test(item[key]),
                result: item[key].length > 0,
                message: this.state.errorMessage.text
            };
        } else if (type === 'Interval') {
            var Reg = /^(\(|\[)(-?\d+)(\.\d+)?\,(-?\d+)(\.\d+)?(\)|\])$/;
            return {
                result: Reg.test(item[key]),
                message: this.state.errorMessage.interval
            };
        }
    }
    render() {
        const { width } = this.props;
        const { columns, tableData } = this.state;
        const tabWidth = width ? width : '100%';
        const columnsMain = columns;
        let list = (item, index) => {
            let res = [];
            for (let i in item) {
                for (let j in columns) {
                    if (columns[j].dataIndex === i) {
                        res.push(
                            <td key={i}>
                                <Input maxLength={45} className={item['class-' + i]} value={item[i]} onChange={(e) => this.changeData(e, index, i)} />
                                <div className="error-message">{item['message-' + i]}</div>
                            </td>
                        )
                    }
                }
            }
            return res;
        }
        return (
            <div>
                <div className="c-table-con">
                    <table className="c-table" width={tabWidth}>
                        <thead>
                            <tr>
                                {
                                    columns.map((item, index) => {
                                        return (
                                            <th key={item.key}>
                                                <Input maxLength={45} className={item.class} value={item.title} onChange={(e) => this.thChange(e, index)} />
                                                <div className="error-message">{item.message}</div>
                                            </th>
                                        )
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tableData.map((item, index) => {
                                    return (
                                        <tr key={item.key}>
                                            {
                                                list(item, index)
                                            }
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div className="action">
                    <Button type="primary" className="" onClick={this.addRow}><span className="f16">+</span>{window.LangMessage.manage_line || "行"}</Button>
                    <Button onClick={this.removeRow} disabled={tableData.length < 1}><span className="f16">-</span>{window.LangMessage.manage_line || '行'}</Button>
                    <Button type="primary" className="" onClick={this.addCol}><span className="f16">+</span>{window.LangMessage.manage_column || '列'}</Button>
                    <Button onClick={this.removeCol} disabled={columns.length < 2}><span className="f16">-</span>{window.LangMessage.manage_column || '列'}</Button>
                </div>
                <CollectionCreateForm
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </div>
        )
    }
}

export default DTable;