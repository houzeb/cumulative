/* eslint-disable */
import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link
} from 'react-router-dom';
import { connect } from 'react-redux';
import 'normalize.css';
import '../style/index.less';
import '../asset/font/iconfont.css';
import { Layout, Menu, Icon, Row, Col } from 'antd';
import '../asset/fonts/iconfont.css';

import { mapStateToProps, mapDispatchToProps, mapPropTypes } from './mapProps';
import Bitmap from '../asset/image/Bitmap.png';
import qudaoImg from '../asset/image/qudao.png';
import shangxianImg from '../asset/image/shangxian.png';
import yewuImg from '../asset/image/yewu.png';
import wenquanImg from '../asset/image/wenquan.png';
import zhonganLogo from '../asset/image/zhongan.png';
import shanghairenshouLogo from '../asset/image/shanghairenshou.png';
import hezhongLogo from '../asset/image/hezhong.png';
import jixiangLogo from '../asset/image/jixiang.png';
import anbangLogo from '../asset/image/anbang.png';
import dingheLogo from '../asset/image/dinghe.png';
import hengqinLogo from '../asset/image/hengqin.png';
import newModelPng from '../asset/image/newModel.png';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 'home',
        };
    }
    menuHandleClick = e => {
        this.setState({
            current: e.key
        });
    }

    goDetail = () => {
        this.props.history.push('/404');
    }

    render() {
        return (
            <div className='home_layout'>
                <header style={{background: '#0A216E'}}>
                    <Row>
                        <Col span={12} className="ant-menu" style={{paddingLeft: '15%', lineHeight: '64px'}}>
                            <span className="iconfont iconlogo"></span>
                        </Col>
                        <Col span={12}>
                            <Menu onClick={this.menuHandleClick} selectedKeys={[this.state.current]} mode="horizontal">
                                <Menu.Item key="home">首页</Menu.Item>
                                <Menu.Item key="contactCentre">接入中心</Menu.Item>
                                <Menu.Item key="productIntroduce">产品介绍</Menu.Item>
                                <Menu.Item key="partner">合作伙伴</Menu.Item>
                                <Menu.Item key="aboutUs">关于我们</Menu.Item>
                            </Menu>
                        </Col>
                    </Row>
                </header>
                <div className="main_content">
                    <Row className="row_1">
                        <Col span={24} className="con_1">
                            <div className="title_wrap">
                                <h2>Graphene 迈向数字化“新保险”</h2>
                                <p>保险数字化中台：无需替换核心，快速赋能前台的解决方案</p>
                                    <span className="detail_btn">
                                        <a onClick={this.goDetail}>查看详情</a>
                                    </span>
                            </div>
                        </Col>
                    </Row>
                    <Row className="row_2">
                        <Col span={4}></Col>
                        <Col span={16} className="con_2">
                           <h1>我们的优势和特点</h1>
                           <p>我是一个副标题我是一个副标题我是一个副标题我是一个副标题我是一个副标题我是一个副标题</p>
                           <ul>
                                <li>
                                    <img src={qudaoImg} />
                                </li>
                                <li>
                                    <h3>外部渠道一键对接</h3>
                                    <p>内置当前主流第三方渠道接口，可一键对接1000+渠道。</p>
                                </li>
                                <li>
                                    <h3>产品快速上线</h3>
                                    <p>利用产品引擎（包含产品中心和营销中心），通过所见即所得方式配置产品和商品（1-3天） ，无需开发即可提供投保界面</p>
                                </li>
                                <li>
                                    <img src={shangxianImg} />
                                </li>
                                <li>
                                    <img src={yewuImg} />
                                </li>
                                <li>
                                    <h3>支持中高频业务</h3>
                                    <p>微服务、分布式架构， 天然支持高并发、高可用、高弹性业务需求，在真实案例中，出单峰值能达到32000tps， 日出单数量能达3亿</p>
                                </li>
                                <li>
                                    <h3>交互式问卷</h3>
                                    <p>支持个性化交互式问卷提高自核通过率</p>
                                </li>
                                <li>
                                    <img src={wenquanImg} />
                                </li>
                           </ul>
                        </Col>
                    </Row>
                    <div className="new_model">
                        <img src={newModelPng} />
                    </div>
                    <div className="insurance_support">
                        <div className="son_wrap">
                            <div className="centre">
                                {/* <img src={logoImg} /> */}
                                <p className="iconfont iconzhongan"></p>
                                <h2>全险种支持</h2>
                                <p>传统保险、意健险、财产险、责任险、创新财险、快速定义、可视化配置、新产品快速推向市场</p>
                            </div>
                            <p className="p1">健康和意外</p>
                            <p className="p2">财产险</p>
                            <p className="p3">传统寿险</p>
                            <p className="p4">创新财险</p>
                            <p className="p5">投资型寿险</p>
                        </div>
                    </div>
                    <div className="partner">
                        <h2>我们的合作伙伴</h2>
                        <Row>
                            <Col span={6}><img src={zhonganLogo} /></Col>
                            <Col span={6}><img src={shanghairenshouLogo} /></Col>
                            <Col span={6}><img src={hezhongLogo} /></Col>
                            <Col span={6}><img src={jixiangLogo} /></Col>
                        </Row>
                        <Row>
                            <Col span={8}><img src={anbangLogo} /></Col>
                            <Col span={8}><img src={dingheLogo} /></Col>
                            <Col span={8}><img src={hengqinLogo} /></Col>
                        </Row>
                    </div>
                </div>
                <footer>
                    <Row>
                        <Col span={3}></Col>
                        <Col span={18}>
                            <Row>
                            <Col span={5}>
                                <h3>联系我们</h3>
                                <p>商务合作  021-60273355</p>
                                <p>公司地址  中国（上海）圆明园路</p>
                                <p>邮编 201200</p>
                            </Col>
                            <Col span={5}>
                                <h3>客户服务</h3>
                                <p>客服热线：021-60276816</p>
                                <p>(周一至周五9:00-18:00)</p>
                                <p>客服邮箱  admin@zhongan.io</p>
                            </Col>
                            <Col span={5}>
                                <h3>Graphene 保险中台</h3>
                                <p>商业合作</p>
                                <p>关于我们</p>
                            </Col>
                            <Col span={4}></Col>
                            <Col span={5}>
                                <img src={Bitmap} />
                            </Col>
                            </Row>
                        </Col>
                        <Col span={3}></Col>
                    </Row>
                    <p className="Copyright">众安信息技术服务有限公司 Copyright &#169 2018 粤ICP16087086号-1 粤公网安备 44030502001034号</p>
                </footer>
            </div>
        );
    }
}

App.propTypes = mapPropTypes;
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
