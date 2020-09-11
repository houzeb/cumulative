/* eslint-disable */
import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link
} from 'react-router-dom';
import { connect } from 'react-redux';
import Routers from '../router';
import 'normalize.css';
import '../style/index.less';
import '../asset/font/iconfont.css';
import default_avatar from '../asset/image/default_avatar.png';
import config from '../../config';
import req from '../request';
import { Layout, Menu, Dropdown, Icon, LocaleProvider, Alert } from 'antd';
import { mapStateToProps, mapDispatchToProps, mapPropTypes } from './mapProps';
// import logoImg from '../asset/image/icon.png';
import Cookies from 'universal-cookie';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import zh_TW from 'antd/lib/locale-provider/zh_TW';
import en_US from 'antd/lib/locale-provider/en_US';
import ja_JP from 'antd/lib/locale-provider/ja_JP';
const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const cookies = new Cookies();
const antdLocale = {
    zh_CN: zh_CN,
    zh_TW: zh_TW,
    en_US: en_US,
    ja_JP: ja_JP
};
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCollaps: true,
            collapsed: true,
            homeSelectedKeys: [],
            defaultOpenKeys: [],
            menuList: [],
            path: '',
            avatar: '',
            beingExpire: false // 用户是否过期
        };
    }
    async componentWillMount(){
        await this.props.updateUserInfo();
    }
    async componentDidMount() {
        let res = await req.getOMSConfig();
        if (self !== top) document.domain = res.domain;
        // document.domain = res.domain;
        // yqq
        // await this.props.updateUserInfo();
        console.log('config', config);
        if (!cookies.get('lang')) {
            cookies.set('lang', config.defaultLanguage, { path: '/' });
        }
        window.updateUserInfo = this.props.updateUserInfo();
        const currentLang = cookies.get('lang') || 'zh_CN';
        this.props.updateLanguage(currentLang);
        this.getSider();
        window.getUserInfoDetail = this.getUserInfoDetail;
        window.getUserInfoDetail();
        // 判断用户密码是否即将过期
        // this.userPasswordExpire();
    }
    getUserInfoDetail = () => {
        const { userId } = this.props.state.userInfo;
        if (!userId) return;
        req.getUserDetail(userId).then(res => {
            const { beingExpire, avatar } = res.value;
            this.setState({
                beingExpire,
                avatar
            });
        });
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
    }
    // 隐藏菜单
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    // 选择语言
    handleChange = (value) => {
        cookies.set('lang', value, { path: '/' });
        this.props.updateLanguage(value);
    }
    // 传入home组件的函数
    handleHome = (id, path) => {
		console.log('id', id)
        this.setState({
            collapsed: true,
            defaultOpenKeys: [id[0]],
            homeSelectedKeys: id,
            path
      });
    }
    // 选择菜单
    change = async({ item, key, keyPath }) => {
		this.setState({ homeSelectedKeys: keyPath, defaultOpenKeys: [] });
        // 点击时再验证一次用户有效性
        const res = await req.getSider({
            userId: this.props.state.userInfo.userId,
            systemCode: 'SYSTEM_ROOT',
            i18Local: 'CHINA'});
        if (res.success) {
            let path = (item.props.path && item.props.path.indexOf('?') > -1) ? `${item.props.path}&ticket=${this.state.ticket}` : `${item.props.path}?ticket=${this.state.ticket}`;
            // console.log(item);
            // let path = item.props.path;
            this.setState({ path });
            this.setState({
                collapsed: true
            });
        }
    }
    // 判断用户密码是否即将过期
    // userPasswordExpire = () => {
    //     const { userId } = this.props.state.userInfo;
    //     if (!userId) return;
    //     req.getUserDetail(userId).then(res => {
    //         const { beingExpire } = res.value;
    //         this.setState({
    //             beingExpire
    //         });
    //     });
    // }
    render() {
        const { avatar, collapsed, menuList, path, beingExpire, homeSelectedKeys, defaultOpenKeys } = this.state;
        const { LANG } = this.props.state;
        const currentLang = cookies.get('lang');
        const menuIcon = {
            // name: '综合查询',
            system_all_query: 'icon-zonghechaxun-',
            // name: '产品中心',
            system_product_center_config: 'icon-chanpinguanli',
            // name: '营销中心',
            system_market_config: 'icon-yingxiaozhongxin-',
            // name: '人工核保',
            system_underwrite_config: 'icon-rengonghebao-',
            // name: '收付费',
            system_payment_config: 'icon-shoufufei-',
            // name: '人工理赔',
            system_nonautoclaim_config: 'icon-rengonglipei',
            // name: '协同平台',
            system_coordinateplatform_config: 'icon-xietongpingtai-',
            // name: '统一配置中心', 公共功能
            main_commonfunctions_config: 'icon-tongyipeizhizhongxin-',
            // name: 'CMS',
            system_cms_config: 'icon-cms-',
            // name: '客户通知管理',
            system_customer_notice: 'icon-tongzhi-',
            // name: 'API管理',
            system_api_config: 'icon-api-',
            // name: '系统设置',
            system_system_setup_config: 'icon-xitongshezhi-',
        };
        // 用户菜单
        const userMenu = (
            <Menu>
                {/* <Menu.Item>
                    {LANG.set}
                </Menu.Item> */}
                <Menu.Item>
                    <a href='/logout'>{LANG.btn_logout}</a>
                </Menu.Item>
            </Menu>
        );
        // 判断是否显示用户密码即将过期提示
        const isShowAlert = (beingExpire) => {
            return beingExpire ? <Alert type='error' message={LANG.passwordExpire || '您的密码即将过期！'} banner closable /> : '';
        };
        return (
            <Layout className='layout' style={{minWidth: collapsed ? '1300px' : '1440px'}}>
                { isShowAlert(beingExpire) }
                <Header className='header'>
                    <i className='iconfont icon-logo' />
                    <span className='title'>Graphene</span>
                    {/* <span className='img-logo'>
                        <img src={logoImg} />
                    </span> */}
                    <span className='fold-icon'>
                        <Icon onClick={this.toggle} type={collapsed ? 'menu-unfold' : 'menu-fold'} theme='outlined' />
                    </span>
                    <div className='header-right'>
                        <span className='user'>
                            <img className='avatar' src={avatar ? `data:image/png;base64,${avatar}` : default_avatar} />
                            <Dropdown overlay={userMenu}>
                                <span className='name' >{this.props.state.userInfo.userRealName} <Icon type='down' /></span>
                            </Dropdown>
                        </span>
                    </div>
                </Header>
                <LocaleProvider locale={antdLocale[currentLang] || antdLocale.en_US}>
                    <Router store={this.title}>
                        <Layout>
                            <div className='wrapper'>
                                <Sider
                                    trigger={null}
                                    className='sider'
                                    collapsible
                                    collapsedWidth={0}
                                    width={208}
                                    collapsed={this.state.collapsed}
                                >
                                    <Menu theme='light' mode='inline' selectedKeys={homeSelectedKeys.length ? homeSelectedKeys : ['1']}  defaultOpenKeys= {defaultOpenKeys} onClick={this.change}>
                                        {/* <SubMenu
                                            key='top'
                                            // onTitleClick={this.toggle}
                                            title={
                                                <span>
                                                    <i className={`iconfont ${collapsed ? 'icon-zhankai' : 'icon-icon_'}`} />
                                                    <span className='title-text'>{collapsed ? '' : ' 全部菜单'}</span>
                                                </span>
                                            }
                                        /> */}
                                        <Menu.Item className='topMenu' key='1'>
                                            <Link to='/'>首页</Link>
                                        </Menu.Item>
                                        {
                                            menuList.map((item, index) => {
                                                return item.childrenMenuViewList.length === 0 ? <Menu.Item className='topMenu' key={item.id} path={item.url} title={item.menuName}>
                                                    <Link to='/iframe'>{item.menuName}</Link>
                                                </Menu.Item> : <SubMenu key={item.id} title={<span><i className={`iconfont ${menuIcon[item.menuCode]}`} /> <span className='title-text' title={item.menuName}>{collapsed ? '' : item.menuName}</span></span>}>
                                                    {
                                                        item.childrenMenuViewList && item.childrenMenuViewList.map((list, key) => {
                                                            return <Menu.Item key={list.id} path={item.url + list.url} title={list.menuName}>
                                                                <Link to='/iframe'>{list.menuName}</Link>
                                                            </Menu.Item>;
                                                        })
                                                    }
                                                </SubMenu>;
                                            })
                                        }
                                    </Menu>
                                </Sider>
                            </div>
                            <Content className='content'>
                                <Switch>
                                    {
                                        Routers.map((route) => {
                                            return <Route
                                                key={route.id}
                                                exact={route.exact}
                                                path={route.path}
                                                render={(props) => (<route.component test={this.handleHome} src={path} {...this.props} {...props} />)}
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