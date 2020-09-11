import React from 'react';
import mirror, { connect, actions } from 'mirrorx';


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }
    render() {
        const langMessage = window.LangMessage;
        const synthesisText = langMessage.synthesis_text || '综合';
        const policyText = langMessage.policy_text || '保单';
        const clientText = langMessage.client_text || '客户';
        const orderText = langMessage.order_text || '订单';
        const receiptPayment = langMessage.receipt_payment || '收付费';
        const claimsText = langMessage.claims || "理赔";
        const queryText = langMessage.btn_query || '查询';
        const fundText = langMessage.fund || '基金'; 
        const fundPriceText = langMessage.fund_price || '基金价格';
        const policy_search = langMessage.policy_search || '保单查询';
        const customer_search = langMessage.customer_search || '客户查询';
        const order_search = langMessage.order_search || '订单查询';
        const claims_search = langMessage.claims_search || '理赔查询';
        const fund_search = langMessage.fund_search || '基金查询';
        const fund_price_search = langMessage.fund_price_search || '基金价格查询';

        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        const leftMainStyle = {
            maxHeight: (clientHeight - 60) + "px",
            height: (clientHeight - 60) + "px",
            overflowY: "auto"
        }
        const isPassword = true;
        return (
            <div>
                <div className="logo-wrap">
                    <div className="logo-box">
                        <i className="za-icon-logo"></i>
                        <span className="system-text">Graphene</span>
                    </div>
                </div>
                <div className="left-nav-wrap">
                    <ul className="left-nav-box" style={leftMainStyle}>
                        <li className="mt10">
                            {/* <div className="clearfix first-level-item" onClick={this.mainMenuClick} data-type="primary">
                                <span className="fl">
                                    <i className="za-icon-insure"></i>
                                    <span className="ml15">{synthesisText + queryText}</span>
                                </span>
                                <span className="fr">
                                                                    <i className="za-icon-arrow-up"></i>
                                                                </span>
                            </div> */}
                            <ul>
                                <li onClick={() => actions.routing.push("/policy-query")}>
                                    <div className="clearfix second-level-item">
                                        <span className="fl name-text">
                                            <span>{policy_search}</span>
                                        </span>
                                    </div>
                                </li>
                                <li onClick={() => actions.routing.push("/customer-query")}>
                                    <div className="clearfix second-level-item">
                                        <span className="fl name-text">
                                            <span>{customer_search}</span>
                                        </span>
                                    </div>
                                </li>
                                <li onClick={() => actions.routing.push("/order-query")}>
                                    <div className="clearfix second-level-item">
                                        <span className="fl name-text">
                                            <span>{order_search}</span>
                                        </span>
                                    </div>
                                </li>
                                {/* <li onClick={() => actions.routing.push("/accept-payment-query")}>
                                    <div className="clearfix second-level-item">
                                        <span className="fl name-text">
                                            <span>{receiptPayment + queryText}</span>
                                        </span>
                                    </div>
                                </li> */}
                                {/* <li onClick={() => actions.routing.push("/claims-query")}>
                                    <div className="clearfix second-level-item">
                                        <span className="fl name-text">
                                            <span>{claims_search}</span>
                                        </span>
                                    </div>
                                </li> */}
                                {/* <li onClick={() => actions.routing.push("/fund-query")}>
                                    <div className="clearfix second-level-item">
                                        <span className="fl name-text">
                                            <span>{fund_search}</span>
                                        </span>
                                    </div>
                                </li>
                                <li onClick={() => actions.routing.push("/fund-price-query")}>
                                    <div className="clearfix second-level-item">
                                        <span className="fl name-text">
                                            <span>{fund_price_search}</span>
                                        </span>
                                    </div>
                                </li>
                                <li onClick={() => actions.routing.push("/commission-query")}>
                                    <div className="clearfix second-level-item">
                                        <span className="fl name-text">
                                            <span>{window.LangMessage.qu_commission_query || '佣金查询'}</span>
                                        </span>
                                    </div>
                                </li> */}
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}


export default App;

