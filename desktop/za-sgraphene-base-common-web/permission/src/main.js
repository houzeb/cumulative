import React from 'react';
import { Button } from 'antd';
import mirror, { connect, actions } from 'mirrorx';
import SelectDom from './component/SelectDom';
import { browserHistory } from 'react-router';

import T from './lib/T';  //公共工具

import MainLeft from './main-left';
import PageRouter from './router';


if (!actions.mainPage) {
    mirror.model({
        name: 'mainPage',
        initialState: {
            userInfo: {},
            userDetail: {},
            avatar: '/assets/images/default_user_avatar.png'
        },
        reducers: {
            setUserInfo(state, data) {
                return Object.assign({}, state, { userInfo: data });
            },
            setUserDetail(state, data) {
                return Object.assign({}, state, { userDetail: data });
            },
            setAvatar(state, data) {
                return Object.assign({}, state, { avatar: data });
            }
        },
        effects: {
            requeryUserMessage() {
                T.fetch({
                    url: '/getUserInfo',
                }).then(res => {
                    if (res && res.success && res.value) {
                        const data = res.value || {};
                        actions.mainPage.setUserInfo(data);
                        actions.mainPage.requestUserDetail(data.userId);
                    }
                });
            },
            requestUserDetail(userId) {
                T.fetch({
                    url: '/user/getUser',
                    data: {
                        userId: userId
                    }
                }).then(res => {
                    if (res && res.success && res.value) {
                        const value = res.value;
                        actions.mainPage.setUserDetail(value);
                        if (value.avatar) {
                            actions.mainPage.setAvatar('data:image/png;base64,' + value.avatar);
                        }
                        // intialized 用户为初始化状态时候，枪支跳转到修改密码页面，且其他页面不能使用.VALID
                        if (res.value.userStatus === 'INITIALIZED') {
                            actions.routing.push("/change-password");
                        }
                    }
                });
            }
        }
    })
}

class App extends React.Component {
    async componentDidMount() {
        actions.mainPage.requeryUserMessage();
        this.checkIframe();
        if (self !== top) {
            var res = await T.fetch({
                url: '/getSysHost',
                method: 'get'
            }).then(data => data.value);
            document.domain = res.domain;
        }
    }
    checkIframe() {
        // console.log('在iframe中');
        if (self != top) this.refs.boxWrap.className += ' no-left';
    }
    logoutClick = () => {
        T.fetch({
            url: "/logoutRequest"
        }).then((result) => {
            if (result.success) {
                let data = result.value || "/";
                location.href = data;
            }
        });
    }
    render() {
        const { userInfo, userDetail, avatar } = this.props;
        const langMessage = window.LangMessage;
        const loginoutText = langMessage.btn_logout || '退出';
        const list = [
            { id: 1, value: loginoutText }
        ]
        /* 如果要隐藏左侧和head，可以再box-wrap+class+no-left */
        return (
            <div className="box-wrap clearfix" ref="boxWrap">

                <div className="left-nav fl">
                    <MainLeft />
                </div>
                <div className="right-wrap">
                    <div className="head-nav border">
                        <div className="head-box tar">
                            <img className="head-userimg" src={avatar} />
                            <span style={{ padding: '0 20px' }}>{userInfo.userRealName}</span>
                            <Button onClick={this.logoutClick}>{loginoutText}</Button>
                        </div>
                    </div>
                    <div className="page-box">
                        <div className="page-content">
                            <PageRouter />
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default connect(state => {
    return state.mainPage;
})(App)

