/* eslint-disable */
import React, { Component } from 'react';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import req from '../request';
import { mapPropTypes } from './mapProps';
const echarts = require('echarts');

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuList: [],
            ticket: ''
        };
    }

    componentDidMount() {
        this.getSider();
    }

    // 选择菜单
    handleClick = item => {
        let pathCode = [`${item.id}`]
        if (item.childrenMenuViewList && item.childrenMenuViewList.length) {
            pathCode.push(`${item.childrenMenuViewList.id}`)
        }
        const path = `${item.url}?ticket=${this.state.ticket}`;
        this.props.test(pathCode, path);
	}

	// menu下面的子菜单点击
	sonMenuClick = (item, ite) => {
		let pathCode = [`${item.id}`, `${ite.id}`]
        const path = `${item.url + ite.url}?ticket=${this.state.ticket}`;
        this.props.test(pathCode, path);
	}

    // 获取菜单
    getSider = async() => {
        const res = await req.getSider({
            userId: this.props.state.userInfo.userId,
            systemCode: 'SYSTEM_ROOT',
            i18Local: 'CHINA'});
        const ticket = await req.getTicket();
        this.setState({
            menuList: res.value ? res.value.menuViewList : [],
            ticket: ticket.value
        });
        console.log('state: ', this.state);
        this.setEcharts()
    }

    // 画echarts曲线图
    setEcharts() {
        var myChart = echarts.init(this.refs.myChart);
        // 绘制图表
        myChart.setOption({
            xAxis: {
                name : '月份',
                type: 'category',
                boundaryGap: false,
                data: ['01/01', '02/01', '03/01', '04/01', '05/01', '06/01', '07/01', '08/01', '09/01', '10/01', '11/01', '12/01'],
                axisTick: {
                    alignWithLabel: true
                }
            },
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                    offset: 0, color: '#0d95e4'
                }, {
                    offset: 0.33, color: '#fccc77'
                }, {
                    offset: 0.66, color: '#f26245'
                }, {
                    offset: 1, color: '#8ae45b'
                }],
                global: false
            },
            backgroundColor: '#fff',
            tooltip : {
                trigger: 'axis',
                axisPointer : {
                    type : 'line'
                }
            },
            yAxis: {
                name : '销售额',
                type: 'value',
                min: 0,
                max: 35000,
                interval: 5000
            },
            series: [{
                data: [18000, 13000, 26000, 20000, 28000, 20000, 32000, 17000, 15000, 19000, 14000, 15500],
                areaStyle: {normal: {
                  color: new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                          {offset: 0, color: '#e4f5f6'},
                          {offset: 0.5, color: '#f6fefe'},
                          {offset: 1, color: '#fff'}
                      ]
                  )
                }},
                type: 'line',
                smooth: true
            }]
        });
    }

    render() {
        const { menuList } = this.state;
        const bg = {
          menu_product_chanpinzhongxin: '#2ac5ee, #1c7dff', // 产品中心
          menu_market_yingxiaozhongxin: '#23d3c1, #0baced', // 营销中心
          menu_channel_qudaozhongxin: '#fccc77, #fc773f', // 渠道中心
          menu_gateway_jieruzhongxin: '#8bde8b, #24c89e', // 接入中心
          menu_permission_shezhi: '#8ae45b, #5cc792', // 设置
          menu_query_tongyongchaxun: '#f4b384, #f26245', // 通用查询
          menu_qita: '#f69d8f, #ee516a' // 其他
        }
        return (
            <div className='pg_home' style={{ padding: '30px' }}>
                <div className='title_wrap'>
                    {
                        menuList.map((item, index) => {
                            return <Card className='list_card' style={{ width: 320 }} key={index}>
                                <Link to='/iframe' className='card_title' onClick={() => this.handleClick(item)} keypath={item.id} path={item.url} style={{ background: `linear-gradient(to right, ${bg[item.menuCode] || bg.menu_qita})` }}>{ item.menuName }</Link>
                                <div className='card_footer'>
                                    {
                                      item.childrenMenuViewList && item.childrenMenuViewList.length ? item.childrenMenuViewList.map((ite, ind) => {
                                        return <Link to='/iframe' key={ ind }><p onClick={() => this.sonMenuClick(item, ite)}>{ ite.menuName }</p></Link>
                                      }) : ''
                                    }
                                </div>
                            </Card>
                        })
                    }
                </div>
                <div className='echart_wrap' ref='myChart'></div>
            </div>
        );
    }
}
Home.propTypes = mapPropTypes;
export default Home;
