/*
 * @Author: za-xudong
 * @Date: 2018-08-27 16:07:07
 * @Description: '报案信息组件'
 * @Last Modified by: za-weilin
 * @Last Modified time: 2018-09-19 16:42:27
 * @ToDo: ''
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Radio, Input } from 'antd';
import { ComplexTable } from '../Table';
import QueryForm from '../QueryForm';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class ReportInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            addTypeValue: 1,
            formItem: [{
                'label': '出险类型',
                'key': 'productType',
                'type': 'select',
                'list': [],
            }, {
                'label': '出险原因',
                'key': 'productCategory',
                'type': 'select',
                'list': [],
                'options': {
                    'keyNickName': 'id',
                    'valueNickName': 'categoryName'
                },
            }, {
                'label': '出险地点',
                'key': 'productCode',
                'type': 'input',
            }, {
                'label': '事故日期',
                'key': 'productName',
                'type': 'date',
            }, {
                'label': '事故性质',
                'key': 'productName2',
                'type': 'select',
                'list': [],
                'options': {
                    'keyNickName': 'id',
                    'valueNickName': 'categoryName'
                },
            }],
        };
    }

    componentDidMount() {
        // this.requestTable();
        this.getSource = setTimeout(() => {
            this.setState({
                'dataSource': this.getDataSource(),
                'loading': false,
                'currentRow': [],
            });
        }, 1000);
    }

    getDataSource = () => {
        let data = [{
            'key': '0',
            'code': '110copy',
            'name': '第一被保人全残责任险',
            'main': '主险',
            'type': '寿险',
            'state': '在售'
        }, {
            'key': '1',
            'code': '110copy',
            'name': '第一被保人全残责任险',
            'main': '主险',
            'type': '寿险',
            'state': '在售'
        }, {
            'key': '2',
            'code': '110',
            'name': '第一被保人全残责任险',
            'main': '主险',
            'type': '寿险',
            'state': '审核中'
        }];
        for (let i = 0; i < 20; i++) {
            data.push({
                'key': i + 3,
                'code': 'ZA',
                'name': '第一被保人全残责任险',
                'main': '主险',
                'type': '寿险',
                'state': '通过审核'
            });
        }
        return data;
    }

    getColumns = () => {
        let arr = [{
            'title': '出险日期',
            'dataIndex': 'code',
        }, {
            'title': '出险类型',
            'dataIndex': 'name',
        }, {
            'title': '出险原因',
            'dataIndex': 'main',
        }, {
            'title': '事故性质',
            'dataIndex': 'type',
        }];
        return arr;
    }

    renderAccident = () => {
        const { addTypeValue } = this.state;
        let accident = null;
        if (addTypeValue === 1) {
            accident = (
                <QueryForm
                    {...this.props}
                    reset={false}
                    submit={false}
                    // wrappedComponentRef={this.saveFormRef}
                    formItem={this.state.formItem}
                    onSubmit={() => { }}
                />
            );
        } else if (addTypeValue === 2) {
            accident = (
                <div>
                    <ComplexTable
                        {...this.props}
                        dataSource={this.state.objectSource}
                        columns={this.getColumns()}
                        onSelect={this.handleSelect}
                        loading={this.state.loading}
                        selectionType='radio'
                        theme='complex'
                    />
                    <Form layout="vertical" className="former" onSubmit={this.handleSubmit}>
                        <FormItem
                            label={'出险地点'}
                        >
                            <Input placeholder={'请输入'} />
                        </FormItem>
                    </Form>
                </div>
            );
        }
        return accident;
    }

    handleSelect = (row) => {
        console.log(row);
        this.setState({ 'currentRow': row });
    }

    addTypeChange = (e) => {
        this.setState({
            addTypeValue: e.target.value,
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onSubmit(values);
            }
        });
    }
    // 重置表单数据
    handleReset = () => {
        this.props.form.resetFields();
    }
    render() {
        // const { LANG } = this.props.state;
        // const formLayout = 'vertical';
        return (
            <div className="dialog">
                <h2 className="title">报案信息</h2>
                <div className="block block-default">
                    <FormItem label='选择'>
                        <RadioGroup onChange={this.addTypeChange} value={this.state.addTypeValue}>
                            <Radio value={1}>{'录入新事故'}</Radio>
                            <Radio value={2}>{'选择历史事故'}</Radio>
                        </RadioGroup>
                    </FormItem>
                    {this.renderAccident()}
                </div>
            </div>
        );
    }
}

ReportInfo.propTypes = {
    'form': PropTypes.object,
    'onSubmit': PropTypes.func,
    // 'state': PropTypes.object,
};
ReportInfo.defaultProps = {
    'onSubmit': () => { },
};
const WrappedReportInfo = Form.create()(ReportInfo);
export default WrappedReportInfo;
