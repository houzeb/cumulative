/*
 * @Author: za-yanqing
 * @Date: 2018-07-11 16:59:38
 * @Description: '上下布局主界面'
 * @Last Modified by: za-huoyanpeng
 * @Last Modified time: 2019-03-13 15:21:30
 * @ToDo: ''
 */
import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
    Link
} from 'react-router-dom';
import { connect } from 'react-redux';
import Routers from '../router';
import 'normalize.css';
import '../style/index.less';
import '../asset/font/iconfont.css';
import avatar from '../asset/image/default_avatar.png';
import config from '../../config';
import { Layout, Icon, Select, Button, LocaleProvider, Menu } from 'antd';
import { mapStateToProps, mapDispatchToProps, mapPropTypes } from './mapProps';
import Cookies from 'universal-cookie';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import zh_TW from 'antd/lib/locale-provider/zh_TW';
import en_US from 'antd/lib/locale-provider/en_US';
import ja_JP from 'antd/lib/locale-provider/ja_JP';
import req from '../request';
const { Header, Sider, Content } = Layout;
const Option = Select.Option;
const cookies = new Cookies();
const antdLocale = {
    'zh_CN': zh_CN,
    'zh_TW': zh_TW,
    'en_US': en_US,
    'ja_JP': ja_JP
};
const SubMenu = Menu.SubMenu;

class App extends Component {
    rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];
    constructor(props) {
        super(props);
        this.state = {
            'showCollaps': true,
            'collapsed': false,
            'avatar': avatar,
            openKeys: ['sub1'],
        };
    }
    async componentDidMount() {
        // 解决oms跨域
        let res = await req.getOMSConfig();
        if (self !== top) document.domain = res.domain;
        // 获取用户信息，node接口处理，在node的controller层中
        this.props.updateUserInfo();
        // 国际化切换
        const currentLang = cookies.get('lang') || config.defaultLanguage;
        cookies.set('lang', currentLang, { 'path': '/' });
        this.props.updateLanguage(currentLang);
        // 刷新之后，更新左侧菜单选中
        const { updateCurrentPath } = this.props;
        updateCurrentPath(window.location.pathname.match(/^\/[a-zA-Z0-9-]+/g)[0]);
    }

    // 隐藏菜单
    toggle = () => {
        this.setState({
            'collapsed': !this.state.collapsed,
        });
    }

    // 退出登录
    logout = () => {
        window.location.href = '/logout';
    }

    // 选择语言
    handleChange = (value) => {
        cookies.set('lang', value, { 'path': '/' });
        window.location.reload();
        // this.props.updateLanguage(value);
    }
    onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }

    render() {
        const { avatar } = this.state;
        const { LANG } = this.props.state;
        // console.log(LANG.notify_method_informe);
        const { updateCurrentPath } = this.props;
        const currentLang = cookies.get('lang') || 'en_US';
        // const data = [
        //     {
        //         // 'path': '/example',
        //         name: '変更解約',
        //         type: 'subMenu',
        //         order: 1,
        //         icon: 'icon-product-center',
        //         list: [
        //             { order: 1, path: '', name: '変更处理' },
        //             { order: 2, path: '', name: '変更取消' },
        //         ]
        //     },
        //     // {
        //     //     'path': '/example-japan',
        //     //     'name': '日本组件',
        //     //     'order': 2,
        //     //     'icon': 'icon-product-center',
        //     // }
        // ];

        // console.log('layout', this.props);
        return (
            <Layout className={`layout graphere ${self !== top ? 'no-left' : ''}`}>
                <Header className='header'>
                    <div className="logo_div">
                        <i className='iconfont icon-logo logo' />
                        <span className='title'>Graphene</span>
                    </div>
                    {
                        this.state.showCollaps
                            ? <div className="trigger_div"><Icon
                                className='trigger'
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                            /></div> : ''
                    }
                    <div className='header-right'>
                        {/*
                            <span>{config.language.filter(x => x.key === config.defaultLanguage)[0].name}</span>
                            <Select defaultValue={currentLang} placeholder='Language' style={{ 'width': 100 }} onChange={this.handleChange}>
                            {
                                config.language.map(item => {
                                    return <Option value={item.key} key={item.key}>{item.name}</Option>;
                                })
                            }
                        </Select> */}
                        <span className='user'>
                            <img className='avatar' src={avatar} />
                            <span className='name' >{this.props.state.userInfo.userRealName}</span>
                        </span>
                        <Button className='logout' onClick={() => { this.logout(); }}>{LANG.btn_logout || 'logout'}</Button>
                    </div>
                </Header>
                <LocaleProvider locale={antdLocale[currentLang] || antdLocale.en_US}>
                    <Router store={this.title}>
                        <Layout>
                            <Sider
                                trigger={null}
                                className='sider'
                                collapsible
                                collapsedWidth={0}
                                width={208}
                                collapsed={this.state.collapsed}
                            >
                                <Menu
                                    mode="inline"
                                    openKeys={this.state.openKeys}
                                    onOpenChange={this.onOpenChange}
                                >
                                    <SubMenu key="sub1" title={<span><i className='icon-product-center iconfont' /><span className="title">{LANG.c_notify_manage || 'Customer Notification Management'}</span></span>}>
                                        <Menu.Item key="1">
                                            <Link to='/notification-inquiry'>
                                                <span>{LANG.notify_query || '通知查询'}</span>
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item key="2">
                                            <Link to='/send-statistics'>
                                                <span>{LANG.send_statistics || '发送统计'}</span>
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item key="3">
                                            <Link to='/template-management'>
                                                <span>{LANG.temp_manage || '模板管理'}</span>
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item key="4">
                                            <Link to='/notification-configuration'>
                                                <span>{LANG.notify_config || '通知配置'}</span>
                                            </Link>
                                        </Menu.Item>
                                    </SubMenu>
                                </Menu>
                            </Sider>
                            <Content className='content'>
                                <Switch>
                                    <Redirect exact from='/' to='/notification-inquiry' />
                                    {
                                        Routers.map((route) => {
                                            return <Route
                                                key={route.id}
                                                exact={route.exact}
                                                path={route.path}
                                                render={(props) => (<route.component {...this.props} {...props} />)}
                                            />;
                                        })
                                    }
                                </Switch>
                            </Content>
                        </Layout>
                    </Router>
                </LocaleProvider>
            </Layout>
        );
    }
}

App.propTypes = mapPropTypes;
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
