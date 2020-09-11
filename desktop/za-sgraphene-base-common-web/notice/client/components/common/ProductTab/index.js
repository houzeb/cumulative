/*
 * @Author: za-xielingjuan
 * @Date: 2018-07-10 14:38:45
 * @Description: 【业务组件】产品详情顶部TAB
 * @Last Modified by: za-xielingjuan
 * @Last Modified time: 2018-08-13 18:44:10
 * @ToDo: ''
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';

const TabPane = Tabs.TabPane;

class ProductTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultActiveKey: 0,
        };
    }

    componentDidMount() {
        this.getDefaultActiveKey();
    }

    getDefaultActiveKey = () => {
        const matchUrl = this.props.match.url;
        const locationUrl = this.props.location.pathname;
        if (matchUrl === locationUrl) {
            // 如果匹配的url刚好和当前的pathname相等，说明此时要展示的是第一个tab下的内容。
            // 第一个tab下的内容，在router中默认指向对应的components。
            // 例如：/product-manage/product-detail 指向产品基本信息。/product-manage/product-detail/product-liability指向产品级别约定下的寿险产品基本属性。
            this.setState({
                defaultActiveKey: '1'
            });
        } else {
            // 如果匹配的url不等于当前pathname，说明此时要展示的不是第一个tab下的内容。
            // 例如：生效日规则的tab渲染逻辑：
            // 先渲染 /product-manage/product-detail/product-liability
            // 再渲染 /product-manage/product-detail/product-liability/effective-date-rule
            const currentPath = '/' + locationUrl.substr(matchUrl.length + 1).split('/')[0];
            const currentTab = this.props.tabsData.find((x) => x.path === currentPath);
            this.setState({
                defaultActiveKey: currentTab.id + ''
            });
        }
    }

    changeTab = (value) => {
        const currentTab = this.props.tabsData.find((x) => x.id + '' === value);
        let search = this.props.location.search;
        const matchUrl = this.props.match.url;
        // 如果是【产品理赔责任】下【责任与责任约定】下的三级路由（基本约定/医疗费用约定），保留url上的libilityId.其他都去掉。
        const searchIndex = search.indexOf('liabilityId');
        console.log(matchUrl, matchUrl.indexOf('/product-manage/product-detail/claim-liability/'));
        if (matchUrl.indexOf('/product-manage/product-detail/claim-liability/') < 0 && searchIndex > 0) {
            search = search.slice(0, searchIndex - 1);
            console.log('search...', search);
        }
        this.props.history.push({
            pathname: matchUrl + currentTab.path,
            search
        });
    }

    render() {
        const { tabsData } = this.props;
        const lang = this.props.state.LANG;
        return (
            <div className="block">
                {
                    this.state.defaultActiveKey &&
                    <Tabs defaultActiveKey={this.state.defaultActiveKey} onChange={this.changeTab} animated={false}>
                        {
                            tabsData.map((tab) => {
                                if (tab.name) {
                                    return (
                                        <TabPane key={tab.id} disabled={this.props.disabled} tab={lang[tab.name]} />
                                    );
                                }
                            })
                        }
                    </Tabs>
                }
            </div>
        );
    }
}

ProductTab.propTypes = {
    location: PropTypes.object,
    history: PropTypes.object,
    tabsData: PropTypes.array,
    match: PropTypes.object,
    disabled: PropTypes.bool,
    state: PropTypes.object
};

export default ProductTab;
