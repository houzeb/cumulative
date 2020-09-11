import React from 'react';
import mirror, { connect, Router, Route, Link,Switch } from 'mirrorx'

import NoMatch from './pages/404';
import Empty from './pages/empty';
import PersonSet from './pages/system/person-set';
import UserManagement from './pages/user-management';
import ChangePassword from './pages/system/change-password';

import ResourceManage from './pages/resource/resource-manage';
import ResourceResult from './pages/resource/resource-result';
import FeatureResource from './pages/resource/feature-resource';
import PermissionManage from './pages/permission/permission-manage';
import PermissionFeature from './pages/permission/permission-feature';
import RoleManage from './pages/role/role-manage';
import RolePermissionSet from './pages/role/role-permission-set';

import BankAccount from './pages/finance/bank-account';
import CashAccount from './pages/finance/cash-account';

import Demo from './pages/demo';


class App extends React.Component {
    // 这里用来设置router是否在state变化的时候更新
    shouldComponentUpdate(){
     return false;
    }

     componentDidMount(){
        //console.log("router...")
    }

    render() {
        const {userStatus} = this.props;
        const routes = (
            
            <Switch>
                
                <Route exact path="/" component={PersonSet} />
                
                <Route path="/person-set" component={PersonSet} />
                <Route path="/user-management" component={UserManagement} />
                <Route path="/change-password" component={ChangePassword} />
                <Route path="/resource-manage" component={ResourceManage} />
                <Route path="/feature-resource" component={FeatureResource} />
                <Route path="/permission-manage" component={PermissionManage} />
                <Route path="/permission-feature" component={PermissionFeature} />
                <Route path="/role-manage" component={RoleManage} />
                <Route path="/role-permission-set" component={RolePermissionSet} />

                <Route path="/bank-account" component={BankAccount} />
                <Route path="/cash-account" component={CashAccount} />

                <Route path="/dtable-demo" component={Demo} />
                
                <Route path="/empty" component={Empty} />
                <Route component={NoMatch} />
            </Switch>
        );
        return (
            <Router forceRefresh={!('pushState' in window.history)}>
                {routes}
            </Router>
        );
    }
}

 export default connect(state => {
    return {
        ...{userStatus: state.mainPage.userDetail.userStatus},
    }
 })(App);
