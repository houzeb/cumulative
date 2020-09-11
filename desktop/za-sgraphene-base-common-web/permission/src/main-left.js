import React from 'react';
import mirror, { connect, actions } from 'mirrorx';
// import logoImg from '../public/assets/images/logo.png';

class App extends React.Component {
    render() {
        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        const leftMainStyle = {
            maxHeight: (clientHeight - 60) + "px",
            height: (clientHeight - 60) + "px",
            overflowY: "auto"
        }
        const { userStatus } = this.props;
        if (userStatus) {
            return (
                <div>
                    <div className="logo-wrap">
                        <div className="logo-box">
                            {/* <img src={logoImg} /> */}
                            <i className="za-icon-logo"></i>
                            <span className="system-text">Graphene</span>
                        </div>
                    </div>
                    <div className="left-nav-wrap">
                        <ul className="left-nav-box" style={leftMainStyle}>
                            <li>
                                {
                                    userStatus === 'VALID' ?
                                        (
                                            <ul>
                                                <li onClick={() => actions.routing.push("/person-set")}>
                                                    <div className="clearfix second-level-item">
                                                        <span className="fl name-text">
                                                            <span>{window.LangMessage.person_settings || '个人设置'}</span>
                                                        </span>
                                                    </div>
                                                </li>
                                                <li onClick={() => actions.routing.push("/role-manage")}>
                                                    <div className="clearfix second-level-item">
                                                        <span className="fl name-text">
                                                            <span>{window.LangMessage.role_manage || '角色管理'}</span>
                                                        </span>
                                                    </div>
                                                </li>
                                                <li onClick={() => actions.routing.push("/user-management")}>
                                                    <div className="clearfix second-level-item">
                                                        <span className="fl name-text">
                                                            <span>{window.LangMessage.user_manage || '用户管理'}</span>
                                                        </span>
                                                    </div>
                                                </li>
                                                <li onClick={() => actions.routing.push("/resource-manage")}>
                                                    <div className="clearfix second-level-item">
                                                        <span className="fl name-text">
                                                            <span>{window.LangMessage.resource_manage || '资源管理'}</span>
                                                        </span>
                                                    </div>
                                                </li>
                                                <li onClick={() => actions.routing.push("/permission-manage")}>
                                                    <div className="clearfix second-level-item">
                                                        <span className="fl name-text">
                                                            <span>{window.LangMessage.rights_manage || '权限管理'}</span>
                                                        </span>
                                                    </div>
                                                </li>
                                            </ul>
                                        ) : (
                                            <ul>
                                                <li onClick={() => actions.routing.push("/change-password")}>
                                                    <div className="clearfix second-level-item">
                                                        <span className="fl name-text">
                                                            <span>{window.LangMessage.modifyPW || '修改密码'}</span>
                                                        </span>
                                                    </div>
                                                </li>
                                            </ul>
                                        )
                                }
                            </li>
                        </ul>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div className="logo-wrap">
                        <div className="logo-box">
                            {/* <img src={logoImg} /> */}
                            <i className="za-icon-logo"></i>
                            <span className="system-text">Graphene</span>
                        </div>
                    </div>
                    {/**
                    <div className="logo-wrap">
                        <div className="logo-box">
                            <i className="za-icon-logo"></i>
                            <span className="system-text">Graphene</span>
                        </div>
                    </div>
                    <div className="left-nav-wrap">
                        <ul className="left-nav-box" style={leftMainStyle}>
                            <li>
                                <div className="clearfix first-level-item" onClick={this.mainMenuClick} data-type="primary">
                                    <span className="fl">
                                            <i className="za-icon-insure"></i> 
                                            <span>{window.LangMessage.system_settings || '系统设置'}</span>
                                            </span>
                                            </div>
                                            </li>
                                            </ul>
                                            </div>*/
                    }
                </div>
            )
        }
    }
}


export default connect(state => {
    return {
        ...{ userStatus: state.mainPage.userDetail.userStatus },
    }
})(App);

