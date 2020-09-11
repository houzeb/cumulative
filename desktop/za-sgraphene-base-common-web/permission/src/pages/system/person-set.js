import React from 'react'
import SelectDom from '../../component/SelectDom';
import mirror, { actions, connect, Router, Route } from 'mirrorx'
import { Row, Col, Button, Input, Form, Select, Table, Icon, Tabs } from 'antd';
import PersonMessage from './person-message'
import ChangePassword from './change-password'
import PersonLanguage from './person-language'
import PersonTime from './person-time'
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

mirror.model({
    name: 'systemPersonSet',
    initialState: {
    },
    reducers: {
    },
    effects: {
    }
})

class PersonSet extends React.Component {
    super(props) {
        this.props = props;
    }
    render() {
        const langMessage = window.LangMessage;
        const timeText = langMessage.time || '时间';

        // 判断只有sys这个用户才有修改时间权限, userDetail信息在redux，main-page里
        const showUserTime = () => {
            const { userDetail } = this.props;
            if (userDetail.userId === 1) {
                return (
                    <TabPane tab={timeText} key="4">
                        <PersonTime />
                    </TabPane>
                )
            }
        }

        return (
            <div>
                <div className="pb15 search-result-back">
                    <div >
                        <span className="mr5 strong">{window.LangMessage.system_settings || '系统设置'}</span>
                        <Icon type="right" />
                        <span className="ml5">{window.LangMessage.person_settings || '个人设置'}</span>
                    </div>
                </div>
                <div className="system-set pl30 pr30">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab={window.LangMessage.person_message || '个人信息'} key="1">
                            <PersonMessage />
                        </TabPane>
                        <TabPane tab={window.LangMessage.modifyPW || '修改密码'} key="2">
                            <ChangePassword />
                        </TabPane>
                        {/* <TabPane tab={window.LangMessage.language} key="3">
                            <PersonLanguage />
                        </TabPane> */}
                        {showUserTime()}
                    </Tabs>
                </div>
            </div>
        )
    }
}

const WrappedPersonSet = Form.create()(PersonSet);

export default connect(state => {
    return {
        ...state.mainPage,
    }
})(WrappedPersonSet)

