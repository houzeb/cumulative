import React from 'react';
import { Button } from 'antd';
import mirror, { connect, actions } from 'mirrorx';
import SelectDom from './component/SelectDom';
import { browserHistory } from 'react-router';

import T from './lib/T';  //公共工具
import "./sass/index.scss";// 样式

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
                    }
                });
            }
        }
    })
}

class App extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            
        }

        this.langList = [{ id: "zh_CN", value: window.LangMessage.lang_zh_cn || "中文简体" }, 
        { id: "zh_TW", value: window.LangMessage.lang_zh_tw || "中文繁体" }, 
        { id: "en_US", value: window.LangMessage.lang_en_us || "English" }, 
        { id: "ja_JP", value: window.LangMessage.lang_ja_jp || "日语" }];
        this.currentLang = T.getAttrObject(this.langList, "id", T.cookie.get("lang"))[0] || {};
        
    }

    // componentDidMount() {
    //     actions.mainPage.requeryUserMessage();
    // }

    async componentDidMount() {
        actions.mainPage.requeryUserMessage();
        this.checkIframe();
        let REG = /\.zhongan\.io/
        if (self !== top && !REG.test(location.href)) {
            var res = await T.fetch({
                url: '/getSysHost',
                method: 'get'
            }).then(data => data.value);
            document.domain = res.domain;
        }
        if (REG.test(location.href)) {
          document.domain = 'zhongan.io';
        }
    }
    checkIframe() {
        if (self != top) {
            console.log('在iframe中');
            this.refs.boxWrap.className += ' no-left no-width';
        }
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

    changeLang = (lang) => {
        if (lang) {
            T.cookie.set("lang", lang);
        }

        setTimeout(function () {
            location.reload();
        }, 0);
    }
    
    render() {
        const { userInfo,userDetail, avatar } = this.props;
        const langMessage = window.LangMessage;
        const loginoutText = langMessage.btn_logout || '退出';
        const list = [
            { id: 1, value: loginoutText }
        ]
        return (
            <div className="box-wrap clearfix" ref='boxWrap'>

                <div className="left-nav fl">
                    <MainLeft />
                </div>
                <div className="right-wrap fr">
                    <div className="head-nav border">
                        <div className="head-box tar">
                            <SelectDom className="mr30" list={this.langList} onChange={this.changeLang} defaultValue={this.currentLang.id} width={90} />
                            <img className="head-userimg" src={avatar} />
                            <SelectDom list={list} placeholder={userInfo.userRealName} width={80} onChange={this.logoutClick}/>
                        </div>
                    </div>
                    <div className="page-box">
                        <div className="page-content">
                            <PageRouter ref="pageContent"/>
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

