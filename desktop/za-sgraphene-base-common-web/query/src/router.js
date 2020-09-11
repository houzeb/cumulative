import React from 'react';
import mirror, { connect, Router, Route, Link,Switch } from 'mirrorx'

import NoMatch from './pages/404';
import Empty from './pages/empty';
import Home from './pages/home';

import PolicyQuery from './pages/query/policy-query';
import PolicyQueryDetail from './pages/query/policy-query-detail';
import CustomerQuery from './pages/query/customer-query';
import queryOrderQuery from './pages/query/order-query';
import OrderQueryDetail from './pages/query/order-query-detail';
import AcceptPayment from './pages/query/accept-payment-query';
import CustomerQueryDetail from './pages/query/customer-query-detail';
import fundQuery from './pages/query/fund-query';
import fundPriceQuery from './pages/query/fund-price-query';
import ClaimsQuery from './pages/query/claims-query';
import CommissionQuery from './pages/query/commission-query';

const routes = (
    <Switch>
        <Route exact path="/" component={PolicyQuery} />

        <Route path="/policy-query" component={PolicyQuery} />
        <Route path="/policy-query-detail" component={PolicyQueryDetail} />
        <Route path="/customer-query" component={CustomerQuery} />
        <Route path="/order-query" component={queryOrderQuery} />
        <Route path="/order-query-detail" component={OrderQueryDetail} />
        <Route path="/accept-payment-query" component={AcceptPayment} />
        <Route path="/customer-query-detail" component={CustomerQueryDetail} />
        <Route path="/fund-query" component={fundQuery} />
        <Route path="/fund-price-query" component={fundPriceQuery} />
        <Route path="/claim-query" component={ClaimsQuery} />
        <Route path="/commission-query" component={CommissionQuery} />

        <Route path="/empty" component={Empty} />
        <Route component={NoMatch} />
    </Switch>
);
class App extends React.Component {
    shouldComponentUpdate(){
     return false;
    }

     componentDidMount(){
        //console.log("router...")
    }

    render() {
        return (
            <Router forceRefresh={!('pushState' in window.history)}>
                {routes}
            </Router>
        );
    }
}

 export default App;

