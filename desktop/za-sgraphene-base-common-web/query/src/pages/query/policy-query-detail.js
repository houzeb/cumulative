import React from 'react';
import ReactDOM from 'react-dom'
import mirror, { actions, connect } from 'mirrorx'
import { Tabs, Row, Col, Button, Select, Table, Icon, Card } from 'antd';
import moment from 'moment';
const TabPane = Tabs.TabPane;



class PolicyQueryDetail extends React.Component {
    super(props) {
        this.props = props;
    }
    state = {
        policyDetail: {},
        dutyList: [],
        insurantList: [],
        beneficiaryList: []
    }
    componentDidMount() {
        this.requestPolicyDetail();
    }
    requestPolicyDetail = () => {
        const id = T.urlQuery('id');
        const params = {
            "policyId": id
        }
        T.fetch({
            url: '/policyPatcher',
            data: params,
            method: 'post'
        }).then(res => {
            if (res.success) {
                this.setState({
                    policyDetail: res.value || {}
                })

                // 保障责任列表
                let dutyList = []
                res.value.policyProductEsList.map(item => {
                  console.log(item.policyProductLiabilityResponseDTOS)
                    if (item.policyProductLiabilityResponseDTOS) {
                      item.policyProductLiabilityResponseDTOS.map((group, index) => {
                          dutyList.push({...group, key: index})
                      })
                    }
                })
                this.setState({
                    dutyList: dutyList || []
                })
                // 被保人列表信息/受益人列表信息
                let insurantList = []
                let beneficiaryList = []
                res.value.policyProductEsList.map((item, index) => {
                    item.policyInsurantEsList.map((group, ind) => {
                        if (group.customerDetailInfoDTO && group.customerDetailInfoDTO.birthday) {
                            group.customerDetailInfoDTO.birthday = moment(group.customerDetailInfoDTO.birthday).format('YYYY-MM-DD')
                        }
                        group.key = ind
                        insurantList.push(group)
                        group.beneficiaryList.map((ul, i) => {
                            if (ul.customerDetailInfoDTO && ul.customerDetailInfoDTO.birthday) {
                                ul.customerDetailInfoDTO.birthday = moment(ul.customerDetailInfoDTO.birthday).format('YYYY-MM-DD')
                            }
                            ul.key = i
                            beneficiaryList.push(ul)
                        })
                    })
                })
                this.setState({
                    insurantList,
                    beneficiaryList
                })
                console.log('insurantList', insurantList)
                console.log('beneficiaryList', beneficiaryList)
            }
        })
    }

    goBack = () => {
      this.props.history.goBack()
    }

    downLoad = record => {
    }

    render() {
        const dutyColumns = [
            {
                title: "项目责任",
                dataIndex: 'liabilityName'
            }, {
                title: "保障金额",
                dataIndex: 'sumInsured',
                width: 160,
            }
        ]
        const fileColumns = [
            {
                title: "描述",
            }, {
                title: "操作",
                render: (text, record) =>  <a onClick={() => this.downLoad(record)}>下载</a>,
                width: 160,
            }
        ]
        const insurantColumns = [
            {
                title: "姓名",
                dataIndex: 'customerDetailInfoDTO.name',
            }, {
                title: "性别",
                dataIndex: 'genderName',
            }, {
                title: "出生日期",
                dataIndex: 'customerDetailInfoDTO.birthday',
            }, {
                title: "证件类型",
                dataIndex: 'certiTypeName',
            }, {
                title: "证件号码",
                dataIndex: 'customerDetailInfoDTO.certiNo',
            }, {
                title: "邮箱",
                dataIndex: 'customerDetailInfoDTO.emails[0].email',
            }, {
                title: "手机号码",
                dataIndex: 'customerDetailInfoDTO.phones[0].phoneNo',
            }, {
                title: "与投保人关系",
                dataIndex: 'relationshipWithHolder',
            }
        ]
        const beneficiaryColumns = [
            {
                title: "姓名",
                dataIndex: 'customerDetailInfoDTO.name',
            }, {
                title: "性别",
                dataIndex: 'genderName',
            }, {
                title: "出生日期",
                dataIndex: 'customerDetailInfoDTO.birthday',
            }, {
                title: "证件类型",
                dataIndex: 'certiTypeName',
            }, {
                title: "证件号码",
                dataIndex: 'customerDetailInfoDTO.certiNo',
            }, {
                title: "邮箱",
                dataIndex: 'customerDetailInfoDTO.emails[0].email',
            }, {
                title: "手机号码",
                dataIndex: 'customerDetailInfoDTO.phones[0].phoneNo',
            }, {
                title: "与被保人关系",
                dataIndex: 'relationshipWithInsurant',
            }
        ]
        let insurantPagination = {
            current: 1,
            pageSize: 10,
            total: 0,
            onChange: (page) => {
                this.getData(page)
            }
        }
        let beneficiaryPagination = {
            current: 1,
            pageSize: 10,
            total: 0,
            onChange: (page) => {
                this.getData(page)
            }
        }
        const { issuanceNo,
            policyNo,
            channelName,
            goodsName,
            insureDate,
            effectiveDate,
            expiryDate,
            issueDate,
            premiumCurrencyType,
            periodPremium,
            policyStatus,
            sumInsuredCurrencyType,
            sumInsured,
            underwriteDecision,
            policyHolderEsDTO
        } = this.state.policyDetail
        const policyPayerList = this.state.policyDetail.policyPayerList || []
        const {dutyList, insurantList, beneficiaryList} = this.state

        return (
            <div className="card-container policy-query-detail">
                <Tabs type="card">
                    <TabPane tab="保单信息" key="1">
                        <Row className="pb10">
                            <Col span={8}><span className="fb">订单编号:</span><span className="ml15">{issuanceNo}</span></Col>
                            <Col span={8}><span className="fb">保单号:</span><span className="ml15">{policyNo}</span></Col>
                            <Col span={8}><span className="fb">销售渠道:</span><span className="ml15">{channelName}</span></Col>
                        </Row>
                        <Row className="pb10">
                            <Col span={8}><span className="fb">商品名称:</span><span className="ml15">{goodsName}</span></Col>
                            <Col span={8}><span className="fb">保险公司:</span><span className="ml15">众安科技</span></Col>
                            <Col span={8}><span className="fb">投保时间:</span><span className="ml15">{insureDate}</span></Col>
                        </Row>
                        <Row className="pb10">
                            <Col span={8}><span className="fb">保险起期:</span><span className="ml15">{effectiveDate}</span></Col>
                            <Col span={8}><span className="fb">保险止期:</span><span className="ml15">{expiryDate}</span></Col>
                            <Col span={8}><span className="fb">出单时间:</span><span className="ml15">{issueDate}</span></Col>
                        </Row>
                        <Row className="pb10">
                            <Col span={8}><span className="fb">保费币种:</span><span className="ml15">{premiumCurrencyType}</span></Col>
                            <Col span={8}><span className="fb">保费:</span><span className="ml15">{periodPremium}</span></Col>
                            <Col span={8}><span className="fb">状态:</span><span className="ml15">{policyStatus}</span></Col>
                        </Row>
                        <Row className="pb10">
                            <Col span={8}><span className="fb">保额币种:</span><span className="ml15">{sumInsuredCurrencyType}</span></Col>
                            <Col span={8}><span className="fb">保额:</span><span className="ml15">{sumInsured}</span></Col>
                            {
                                policyPayerList.map((item, index) => <Col key={index} span={8}><span className="fb">投保账户:</span><span className="ml15">{item.bankCardNo}</span></Col>)
                            }
                        </Row>
                        <h3 className="my_title pb10 fb">保障责任</h3>
                        <Table className="pt15 pb15" pagination={false} bordered columns={dutyColumns} dataSource={dutyList} />
                        <h3 className="my_title pb10 fb">附件信息</h3>
                        <Table className="pt15 pb15" pagination={false} bordered columns={fileColumns} dataSource={[]} />
                        <h3 className="my_title pb10 fb">核保意见</h3>
                        <Card className="mt15">
                            <p>{underwriteDecision}</p>
                        </Card>
                    </TabPane>
                    <TabPane tab="用户信息" key="2">
                        <h3 className="my_title pb10 fb" style={{marginTop: '-16px', borderTop: '1px solid #eee'}}>投保人信息</h3>
                        <Row className="pb10 pt10">
                            <Col span={8}><span className="fb">姓名:</span><span className="ml15">{policyHolderEsDTO ? policyHolderEsDTO.customerDetailInfoDTO.name : ''}</span></Col>
                            <Col span={8}><span className="fb">证件类型:</span><span className="ml15">{policyHolderEsDTO ? policyHolderEsDTO.certiTypeName : ''}</span></Col>
                            <Col span={8}><span className="fb">证件号码:</span><span className="ml15">{policyHolderEsDTO ? policyHolderEsDTO.customerDetailInfoDTO.certiNo : ''}</span></Col>
                        </Row>
                        <Row className="pb10">
                            <Col span={8}><span className="fb">邮箱:</span><span className="ml15">{policyHolderEsDTO ? policyHolderEsDTO.customerDetailInfoDTO.emails[0].email : ''}</span></Col>
                            <Col span={8}><span className="fb">手机号码:</span><span className="ml15">{policyHolderEsDTO ? policyHolderEsDTO.customerDetailInfoDTO.phones[0].phoneNo : ''}</span></Col>
                            <Col span={8}><span className="fb">性别:</span><span className="ml15">{policyHolderEsDTO ? policyHolderEsDTO.genderName : ''}</span></Col>
                        </Row>
                        <Row className="pb10">
                            <Col span={8}><span className="fb">出生日期:</span><span className="ml15">{policyHolderEsDTO ?  moment(policyHolderEsDTO.customerDetailInfoDTO.birthday).format('YYYY-MM-DD') : ''}</span></Col>
                        </Row>
                        <h3 className="my_title pb10 fb">被保人信息</h3>
                        <Table className="pt15 pb15"  pagination={insurantPagination} bordered columns={insurantColumns} dataSource={insurantList} />
                        <h3 className="my_title pb10 fb">受益人信息</h3>
                        <Table className="pt15 pb15"  pagination={beneficiaryPagination} bordered columns={beneficiaryColumns} dataSource={beneficiaryList} />
                    </TabPane>
                </Tabs>
                <div className="pt20 pb20" style={{textAlign: 'center'}}>
                    <Button type="primary" className="product-filter-btn diy_background borderColor" size="large" style={{width: '120px'}} onClick={this.goBack}>返回</Button>
                </div>
            </div>
        );
    }
}


export default PolicyQueryDetail;