import React, { Component } from 'react';
import components from 'income-common-components';
import { message, Breadcrumb } from 'antd';
import { mapPropTypes } from '../mapProps';
import request from '../../request';
import moment from 'moment';
import echarts from 'echarts';
import PropTypes from 'prop-types';
const { QueryForm } = components;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            canQuery: true,
            sendTime: [moment().subtract(6, 'days'), moment()]
        };
    }

    handleSubmit = (values) => {
        const { canQuery } = this.state;
        const { LANG } = this.props.state;
        if (canQuery) {
            values.startTime = values.time[0].unix() * 1000;
            values.endTime = values.time[1].unix() * 1000;
            delete values.time;
            if (!values.templateNo) delete values.templateNo;
            const { sendTime } = this.state;
            let getDateList = () => {
                let dates = [];
                let currDate = moment(sendTime[0]).subtract(1, 'days').startOf('day');
                let lastDate = moment(sendTime[1]).startOf('day');
                while (currDate.add(1, 'days').diff(lastDate) < 1) {
                    dates.push(currDate.clone().format('YYYY-MM-DD'));
                }
                return dates;
            };
            let dateList = getDateList();
            request.dailySend(values).then(res => {
                const { success, value } = res;
                if (success && value) {
                    let list = res.value;
                    let chartsData = Array(4).fill(Array(dateList.length).fill(0));
                    chartsData[0] = dateList;
                    list.map(item => {
                        chartsData[0].map((date, index) => {
                            if (item.sendDate.slice(0, 10) === date) {
                                chartsData[1][index] = item.total;
                                chartsData[2][index] = item.successCount;
                                chartsData[3][index] = item.failCount;
                            }
                        });
                    });
                    let statisticsCharts = echarts.init(document.getElementById('charts'));
                    statisticsCharts.setOption({
                        title: {
                            text: LANG.send_statistics || '发送统计',
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: [LANG.notify_send_total || '发送总数', LANG.notify_send_success || '成功数', LANG.notify_send_fail || '失败数']
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                dataZoom: {
                                    yAxisIndex: 'none'
                                },
                                dataView: { readOnly: false },
                                magicType: { type: ['line', 'bar'] },
                                restore: {},
                                saveAsImage: {}
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: chartsData[0]
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [
                            {
                                name: LANG.notify_send_total || '发送总数',
                                type: 'line',
                                data: chartsData[1]
                            },
                            {
                                name: LANG.notify_send_success || '成功数',
                                type: 'line',
                                data: chartsData[2]
                            },
                            {
                                name: LANG.notify_send_fail || '失败数',
                                type: 'line',
                                data: chartsData[3]
                            }
                        ]
                    });
                } else {
                    message.info(LANG.des_no_content || '暂无数据');
                }
            });
        } else {
            message.error(LANG.notify_max_range_30 || '最大查询范围30天');
        }
    }

    onCalendarChange(dates) {
        if (dates.length > 1 && dates[1].diff(dates[0], 'days') > 29) {
            this.setState({
                canQuery: false
            });
        } else {
            this.setState({
                canQuery: true,
                sendTime: dates
            });
        }
    }

    render() {
        const { LANG = {} } = this.props.state;
        const formItems = [
            {
                label: LANG.notify_method_informe || '通知方式',
                type: 'select',
                key: 'messageType',
                rules: [{ required: true, message: LANG.text_select || '请选择' }],
                options: {
                    keyNickName: 'id',
                    valueNickName: 'value',
                },
                list: [{
                    id: 'SMS',
                    value: LANG.text_sms || '短信'
                }, {
                    id: 'EMAIL',
                    value: LANG.text_email || '邮件'
                }],
                initialValue: 'SMS'
            },
            {
                label: LANG.notify_template || '模板',
                key: 'templateNo',
                type: 'input'
            },
            {
                label: LANG.notify_sendTime || '发送时间',
                rules: [{ required: true, message: LANG.text_select || '请选择' }],
                key: 'time',
                type: 'dateRange',
                initialValue: [moment().subtract(6, 'days'), moment()],
                props: {
                    disabledDate: (current) => { return current > moment().endOf('day'); },
                    onCalendarChange: () => this.onCalendarChange
                }
            },
        ];
        return (
            <div>
                <div className='block block-default'>
                    <Breadcrumb>
                        <Breadcrumb.Item>{LANG.c_notify_manage || '客户通知管理'}</Breadcrumb.Item>
                        <Breadcrumb.Item>{LANG.send_statistics || '发送统计'}</Breadcrumb.Item>
                    </Breadcrumb>
                    <QueryForm formItem={formItems} onSubmit={this.handleSubmit}
                        wrappedComponentRef={this.saveForm} state={this.props.state} max={12} show />
                </div>
                <div id="charts" ref="charts" style={{ maxWidth: 1300, height: 500 }} />
            </div>
        );
    }
}

App.propTypes = mapPropTypes;
App.contextTypes = {
    'router': PropTypes.object
};

export default App;
