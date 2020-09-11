import React from 'react';
import ReactDOM from 'react-dom'
import mirror, { actions, connect } from 'mirrorx'
import { Row, Col, Button, Select, Table, Icon, Spin, Tabs } from 'antd';
const TabPane = Tabs.TabPane;



class CustomerQueryDetail extends React.Component {
    super(props) {
        this.props = props;
    }
    state = {
        customerDetailTable: [],
        customerDetail: {},
        policyTable: [],
        relationCustomerTable: [],
        spinning: false,
        certiTypeList: [
            {
                name: '身份证',
                value: 'SHENFENZHENG'
            },
            {
                name: '护照',
                value: 'HUZHAO'
            },
            {
                name: '户口簿',
                value: 'HUKOUBU'
            },
            {
                name: '军人身份证',
                value: 'JUNGUANZHENG'
            },
            {
                name: '武装警察身份证',
                value: 'POLICYID'
            },
            {
                name: '港澳居民来往内地通行证',
                value: 'GAJMLAIWANGCERTI'
            },
            {
                name: '台湾居民来往内地通行证',
                value: 'TAIBAOCERTI'
            },
            {
                name: '外国人永久居留身份证',
                value: 'WAIGUORENCERTI'
            },
            {
                name: '新加坡身份证',
                value: 'NRIC'
            },
            {
                name: '出生证',
                value: 'CHUSHENGZHENG'
            },
            {
                name: '其他',
                value: 'OTHER'
            }
        ],
        genderList: [
            {
                name: '男',
                value: 'MALE'
            },
            {
                name: '女',
                value: 'FMAIL'
            },
            {
                name: '未知',
                value: 'UNKNOWN'
            }
        ],
        enumeration: [
            {
                name: '被保人',
                value: 'POLICY_INSURED'
            },
            {
                name: '受益人',
                value: 'POLICY_BENEFICIARY'
            }
        ]
    }
    componentDidMount() {
        this.requestInsurredDetail();
        this.requestPolicydetail();
    }
    // 基本信息
    requestInsurredDetail = () => {
        const id = T.urlQuery('id');
        const params = {
            "option": "DETAIL",
            "partyId": id
        }
        T.fetch({
            url: '/customer/individual/common/query',
            data: params,
            method: 'post'
        }).then(res => {
            if (res.success) {
                if(res.value && res.value.customerDetail){
                    this.setState({
                        customerDetail: res.value.customerDetail || {}
                    })
                }
            }
        })
    }

    // 关联客户
    requestAssociatCustomer = (ids) => {
        const params = {
            partyIds: ids,
            option: 'PHONE'
        }
        T.fetch({
            url: '/customer/individual/common/batchQuery',
            data: params,
            method: 'post'
        }).then(res => {
            if (res.success) {
                let arr = res.value.map(item => {
                    item.dto.roleType = this.state.enumeration.find(i => i.value === item.dto.roleType).name
                    return item
                })
                console.log(arr)
                this.setState({
                    relationCustomerTable: arr || []
                })
            }
        })
    }

    // 保单信息
    requestPolicydetail = () => {
        const id = T.urlQuery('id');
        const params = {
            moduleName: 'person_policy_search',
            data: JSON.stringify({holder_id: id}),
            operatorId: '38005',
            pageSize: 100,
            currentPage: 1
        }
        T.fetch({
            url: '/query/index',
            data: params,
            method: 'post'
        }).then(res => {
            if (res.success) {
                const data = JSON.parse(res.value.data)
                this.setState({
                    policyTable: data.data || []
                })
                let ids = []
                console.log('policyTable', data.data)
                data.data.map(item => {
                    let str = item.insurantId + ',' + item.benefitId
                    str.split(',').map(ite => {
                        ids.push(`${ite}`)
                    })
                })
                this.requestAssociatCustomer(ids);
            }
        })
    }
    goBack = () => {
      this.props.history.goBack()
    }

    handlePageChange = (currentPage, pageSize) => {
        this.setState({
            currentPage: currentPage - 1,
        }, this.fetchResultTable)
    }

    // 查看保单，跳转到保单详情
    handlePolicyDetail = (record) => {
      actions.routing.push({
          pathname: '/policy-query-detail',
          search: '?id=' + record.policyId
      })
    }

    render() {
        const phoneColumns = [
            {
                title: "序号",
                width: 100,
                render:(text, record, index) => `${index + 1}`
            },
            {
              title: "手机号码",
              width: 240,
              dataIndex: 'phoneNo'
            },
            {
              title: "其他",
              dataIndex: 'other'
            }
        ];
        const emailColumns = [
            {
                title: "序号",
                width: 100,
                render:(text, record, index) => `${index + 1}`
            },
            {
              title: "邮箱",
              dataIndex: 'email'
            }
        ];
        const addressColumns = [
            {
                title: "序号",
                width: 100,
                render:(text, record, index) => `${index + 1}`
            },
            {
                title: "邮编",
                width: 200,
                dataIndex: 'zipCode'
            },
            {
                title: "地址",
                dataIndex: 'detail'
            }
        ];
        const policyColumns = [
            {
                title: "序号",
                render:(text, record, index) => `${index + 1}`
            },
            {
                title: "险种",
                dataIndex: 'zipCode'
            },
            {
                title: "商品名称",
                dataIndex: 'goodsName'
            },
            {
                title: "保单号",
                dataIndex: 'policyNo'
            },
            {
                title: "保额",
                dataIndex: 'sumInsured'
            },
            {
                title: "保费",
                dataIndex: 'periodPremium'
            },
            {
                title: "投保人",
                dataIndex: 'holderName'
            },
            {
                title: "被保险人",
                dataIndex: 'insurantName'
            },
            {
                title: '操作',
                width: 60,
                dataIndex: 'opreate',
                render: (text, record) => <a style={{color: '#14C287'}} onClick={this.handlePolicyDetail.bind(this, record)}>查看保单</a>
            }
        ];
        const customerColumns = [
            {
                title: "序号",
                render:(text, record, index) => `${index + 1}`
            },
            {
                title: "姓名",
                dataIndex: 'dto.customerDetail.name'
            },
            {
                title: "联系方式",
                dataIndex: 'dto.customerDetail.phones[0].phoneNo'
            },
            {
                title: "关联关系",
                dataIndex: 'dto.roleType'
            }
        ];
        const {partyId, name, gender, certiType, certiNo, emails, addresses, phones} = this.state.customerDetail
        const { certiTypeList, genderList, policyTable, relationCustomerTable } = this.state
        let Gender = genderList.find(i => i.value == gender)
        let CertiType = certiTypeList.find(i => i.value == certiType)
        // const paginationConfig = {
        //     onChange: this.handlePageChange,
        //     showQuickJumper: true,
        //     total: this.state.totalPage,
        //     defaultPageSize: this.state.pageSize,
        //     current: this.state.currentPage + 1
        // }
        //   const formItemLayout = {
        //       labelCol: { span: 6 },
        //       wrapperCol: { span: 14 },
        //   };
        return (
            <div>
                <Tabs type="card">
                    <TabPane tab="基本信息" key="1">
                        <div className="pl15 pt15 pr15 pb15">
                            <Row className="pb10">
                                <Col span={24}><span className="fb">客户ID:</span><span className="ml15">{partyId}</span></Col>
                            </Row>
                            <Row className="pb10">
                                <Col span={12}><span className="fb">姓名:</span><span className="ml15">{name}</span></Col>
                                <Col span={12}><span className="fb">性别:</span><span className="ml15">{Gender && Gender.name}</span></Col>
                            </Row>
                            <Row className="pb10">
                                <Col span={12}><span className="fb">证件类型:</span><span className="ml15">{CertiType && CertiType.name}</span></Col>
                                <Col span={12}><span className="fb">证件号码:</span><span className="ml15">{certiNo}</span></Col>
                            </Row>
                        </div>
                        <div className="pt30 pl20 pr20 tdFirstMin greenFont">
                            <h3 className="pb10 fb">联系电话</h3>
                            <Table key="key" pagination={false} bordered columns={phoneColumns} dataSource={phones} />
                        </div>
                        <div className="pt30 pl20 pr20 tdFirstMin greenFont">
                            <h3 className="pb10 fb">邮箱地址</h3>
                            <Table key="key" pagination={false} bordered columns={emailColumns} dataSource={emails} />
                        </div>
                        <div className="pt30 pl20 pr20 tdFirstMin greenFont">
                            <h3 className="pb10 fb">地址</h3>
                            <Table key="key" pagination={false} bordered columns={addressColumns} dataSource={addresses} />
                        </div>
                    </TabPane>
                    <TabPane tab="保单信息" key="2">
                        <div className="pl15 pt15 pr15 pb15">
                            <h3 className="pb10 fb">保单列表</h3>
                            <Table key="key" pagination={false} bordered columns={policyColumns} dataSource={policyTable} />
                        </div>
                    </TabPane>
                    <TabPane tab="关联客户" key="3">
                        <div className="pl15 pt15 pr15 pb15">
                            <h3 className="pb10 fb">关联客户列表</h3>
                            <Table key="key" pagination={false} bordered columns={customerColumns} dataSource={relationCustomerTable} />
                        </div>
                    </TabPane>
                </Tabs>
                <div className="pt20 pb20" style={{textAlign: 'center'}}>
                    <Button type="primary" className="product-filter-btn diy_background borderColor" size="large" style={{width: '120px'}} onClick={this.goBack}>返回</Button>
                </div>
            </div>
        );
    }
}


export default CustomerQueryDetail;