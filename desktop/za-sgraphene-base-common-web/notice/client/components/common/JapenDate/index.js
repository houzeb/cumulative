/*
 * @Author: za-zhouzhe
 * @Date: 2018-07-16 14:22:41
 * @Description: '和历和西历转换'
 * @Last Modified by: za-zhouzhe
 * @Last Modified time: 2018-08-16 15:19:11
 * @ToDo: ''
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Input, Select, message } from 'antd';
import moment from 'moment';
import axios from 'axios';
const Option = Select.Option;

class JapenDate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            DateValue: '',
            basicsData: [],
            minYear: '1912',
            selectValue: undefined,
            date: new Date()
        };
    }
    componentDidMount() {
        const date = this.props.defaultValue;
        this.fetchDate(() => {
            this.setState({ DateValue: this.getDate(date), selectValue: this.getDateNumber(date) });
        });
    }
    handleChange = (date, dateString) => {
        if (date === null) {
            this.setState({ DateValue: '' });
            this.props.onChange('', '');
            return;
        }
        this.props.onChange(date, this.getDate(date));
        this.setState({ DateValue: this.getDate(date), selectValue: this.getDateNumber(date) });
    }
    fetchDate = (callback) => {
        this.setState({ loading: true });
        axios.post('/api/mdm/data/list/resData', {
            categoryCode: 'za-graphene-basedata-region-tilte'
        }).then((res) => {
            if (res.data.success) {
                let resData = res.data.value || [];
                let arr = [];
                resData.forEach(i => arr.push(this.getYear(i.itemName)));
                resData = resData.map((i, k) => {
                    i.itemName = this.getYear(i.itemName);
                    let max = k === 0 ? 2099 : arr[k - 1];
                    return {
                        itemName: i.itemName,
                        itemCode: i.itemCode,
                        min: i.itemName,
                        max
                    };
                });
                this.setState({
                    basicsData: resData,
                    loading: false,
                    minYear: resData[resData.length - 1].itemName
                }, () => {
                    callback && callback();
                });
            }
        });
    }
    getYear = (value) => {
        return new Date(Number(value)).getFullYear();
    }
    getDate = (date) => {
        const {basicsData} = this.state;
        if (basicsData.length === 0) return;
        let year = date.format('YYYY');
        let m = date.format('MM');
        let d = date.format('DD');
        let newArr = basicsData.filter((i) => year >= i.itemName);
        let num = year - parseInt(newArr[0].itemName) + 1;
        return `${num === 1 ? '元' : num}年${m}月${d}日`;
    }
    // 获取年号
    getDateNumber = (date) => {
        const {basicsData} = this.state;
        if (basicsData.length === 0) return;
        let year = +date.format('YYYY');
        let newArr = basicsData.filter((i) => year >= i.itemName);
        return newArr[0].itemName;
    }
    disabledMinDate = (current) => {
        return current && current < moment(`${this.state.minYear}`).startOf('year');
    }
    handleSelectChange = (value) => {
        const { DateValue } = this.state;
        this.setState({ selectValue: value });
        let rValue = this.validate(DateValue);
        if (typeof rValue === 'string') {
            message.error(rValue);
        } else {
            let m = DateValue.slice(DateValue.indexOf('年') + 1);
            let yearNumber = DateValue.slice(0, DateValue.indexOf('年')) !== '元' ? +DateValue.slice(0, DateValue.indexOf('年')) : 1;
            let year = value + yearNumber - 1;
            let rYear = this.vaildateYear(year, value);
            if (typeof rYear === 'string') {
                message.error(rYear);
            } else {
                let date = `${year}年${m}`;
                this.setState({ date: date.replace('年', '/').replace('月', '/').replace('日', '') });
            }
        }
    }
    handleInputchange = (e) => {
        this.setState({ DateValue: e.target.value });
    }
    // 输入框失去焦点
    handleBlur = (e) => {
        const { selectValue } = this.state;
        let value = e.target.value;
        let rValue = this.validate(value);
        if (typeof rValue === 'string') {
            message.error(rValue);
        } else {
            let m = value.slice(value.indexOf('年') + 1);
            let yearNumber = value.slice(0, value.indexOf('年')) !== '元' ? +value.slice(0, value.indexOf('年')) : 1;
            let year = selectValue + yearNumber - 1;
            let rYear = this.vaildateYear(year, selectValue);
            if (typeof rYear === 'string') {
                message.error(rYear);
            } else {
                let date = `${year}年${m}`;
                this.setState({ date: date.replace('年', '/').replace('月', '/').replace('日', '') });
            }
        }
    }
    // 校验年号是否合理
    vaildateYear = (year, selectValue) => {
        const { basicsData } = this.state;
        let arr = basicsData.filter(i => i.itemName === selectValue);
        if (year >= arr[0].min && year < arr[0].max) {
            return true;
        } else {
            return '年号错误';
        }
    }
    // 校验输入框日期格式
    validate = (data) => {
        var re = /^(\d{1,2}|元)年(0[1-9]|1[0-2])月(0[1-9]|[1-2][0-9]|3[0-1])日$/;
        if (!re.test(data)) {
            return '日期格式输入错误';
        }
        return true;
    }
    render() {
        const { loading, DateValue, basicsData, selectValue } = this.state;
        return (
            <div className="Japen-date" style={{width: '300px'}}>
                <DatePicker
                    size={this.props.size}
                    format={this.props.format}
                    showToday={this.props.showToday}
                    defaultValue={this.props.defaultValue}
                    onChange={this.handleChange}
                    disabledDate={this.disabledMinDate}
                    value={moment(this.state.date, 'YYYY/MM/DD')}
                />
                <div className={loading ? 'date-input is-loading' : 'date-input'}>
                    <Select style={{ width: '80px', marginRight: '10px' }} placeholder={'请选择'} onChange={this.handleSelectChange} value={selectValue}>
                        {
                            basicsData.map((item, key) => {
                                return (<Option key={key} value={item.itemName}>{item.itemCode}</Option>);
                            })
                        }
                    </Select>
                    <Input
                        style={{width: '180px'}}
                        value={DateValue}
                        size={this.props.size}
                        onChange={this.handleInputchange}
                        onBlur={this.handleBlur}
                    />
                </div>
            </div>
        );
    }
}

JapenDate.propTypes = {
    'size': PropTypes.string,
    'format': PropTypes.string,
    'showToday': PropTypes.bool,
    'defaultValue': PropTypes.object,
    'onChange': PropTypes.func
};

JapenDate.defaultProps = {
    'size': 'default',
    'format': 'YYYY/MM/DD',
    'showToday': false,
    'defaultValue': moment(moment().format(), 'YYYY/MM/DD'),
    'onChange': () => {}
};

export default JapenDate;
