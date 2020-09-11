import React from 'react'
import ReactDOM from 'react-dom'
import SelectDom from '../../component/SelectDom';
import TreeModal from '../../component/TreeModal';
import mirror, {actions, connect} from 'mirrorx'
import moment from 'moment';
import {Row,Col,Button,Input,Form,Select,Table,Icon,Tabs,DatePicker,Modal,Checkbox,Radio} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const operateTypeMap = {
    READ: window.LangMessage.read || '读',
    WRITE: window.LangMessage.write || '写'
}

mirror.model({
    name: 'systemRolePermissionSet',
    initialState: {
        editStatus: true
    },
    reducers: {
        setEditStatus(state, data) {
            // console.log(data)
            return Object.assign({}, state, { editStatus: data });
        },
    },
    effects: {

    }
})

class RolePermissionSet extends React.Component {
    super(props) {
        this.props = props;
    } 
    state = { 
        radioValue: null,
        viewVisible: false,

        featureCheckedList: [],//功能权限 数据
        featureCheckAll: false,
        featIndeterminate: true,
        numberCheckedList: [],//数据权限 数据
        numberCheckAll: false,
        numIndeterminate: true,
        featureCheckList: [],
        numberCheckList: []
    }
    componentDidMount = () => {
        // this.getResourceTree();
        // T.urlQuery("edit")
    }

    componentWillUpdate() {
        this.key = Math.round(Math.random()*100000000);
    }
    //render数据资源
    renderDataSourceList = () => {
        const { editStatus } = this.props
        if (this.props.dataSourcePermissionList) {
            const { rolePriviledges }= this.props
            return this.props.dataSourcePermissionList.map((item, index)=>{
                let checked = false
                if (rolePriviledges.indexOf(item.priviledgeId)>=0) {
                    checked = true
                }
                // const sourcePri = item.priviledges
                // sourcePri.forEach(element => {
                //     if (rolePriviledges.indexOf(element.priviledgeId)>=0) {
                //         checked = true
                //     }
                // });
                return (
                    <div className="font-ellipsis" key={index}>
                        <Checkbox 
                            className="max-width200" 
                            // disabled={this.props.roleAction=='view' || !editStatus}
                            disabled={this.props.roleAction=='view'}
                            key={item.priviledgeId}
                            value={item.priviledgeId} 
                            defaultChecked={checked} 
                            onChange={(e)=>{this.resourceChange(e, item)}} >
                            {item.priviledgeName}
                        </Checkbox>
                    </div>
                )
            })
        }
    }

    //render功能权限
    renderButtonList = () => {
        const { editStatus } = this.props        
        if (this.props.buttonList) {
            const { rolePriviledges }= this.props
            const styleBtn ={
                'minWidth': '100px',
                'maxWidth': '220px',
                'textAlign': 'center',
                'overflow': 'hidden',
                'whiteSpace': 'nowrap',
                'textOverflow': 'ellipsis',
            }
            return this.props.buttonList.map((item, index)=>{
                let checked = false
                const sourcePri = item.priviledges
                sourcePri.forEach(element => {
                    if (rolePriviledges.indexOf(element.priviledgeId)>=0) {
                        checked = true
                    }
                });
                return (
                    <div key={index}>
                        <Checkbox value={item.resourceId} defaultChecked={checked} onChange={(e)=>{this.featureChange(e, item)}} disabled={this.props.roleAction=='view'}>
                            <Button style={styleBtn} className="featBtn" title={item.resourceName}>{item.resourceName}</Button>
                        </Checkbox>
                    </div>
                )
            })
        }
    }

    renderFieldList = () => {
        const { editStatus } = this.props
        if (this.props.fieldList) {
            const { rolePriviledges }= this.props
            return this.props.fieldList.map((item, index)=>{
                const showRadio = item.priviledges && item.priviledges.length > 1 || false                
                let checked = false
                const sourcePri = item.priviledges
                sourcePri.forEach(element => {
                    if (rolePriviledges.indexOf(element.priviledgeId)>=0) {
                        checked = true
                    }
                });
                return (
                    <div key={index}>
                        <Checkbox value={item.resourceId} defaultChecked={checked} onChange={(e)=>{this.featureChange(e, item)}} disabled={this.props.roleAction=='view'}>
                            <b>A</b>
                            <span className="featFont featDate" title={item.resourceName}>{item.resourceName}</span>
                            <RadioGroup onChange={this.RadioChange} value={this.state.radioValue} className={showRadio ? '' : 'none'}>
                                {item.priviledges.map((item, index)=>{
                                    return (
                                        <Radio value={item.priviledgeId} key={index}>{operateTypeMap[item.operateType]}</Radio>
                                    )
                                })}
                            </RadioGroup>
                        </Checkbox>
                    </div>
                )
            })
        }
    }

    renderLabelList = () => {
        const { editStatus } = this.props;
        const styleLable ={
            'minWidth': '100px',
            'maxWidth': '220px',
            'textAlign': 'center',
            'overflow': 'hidden',
            'whiteSpace': 'nowrap',
            'textOverflow': 'ellipsis',
        }  
        if (this.props.labelList) {
            const { rolePriviledges }= this.props            
            return this.props.labelList.map((item, index)=>{
                let checked = false
                const sourcePri = item.priviledges
                sourcePri.forEach(element => {
                    if (rolePriviledges.indexOf(element.priviledgeId)>=0) {
                        checked = true
                    }
                });
                return (
                    <div key={index}>
                        <Checkbox value={item.resourceId} defaultChecked={checked} onChange={(e)=>{this.featureChange(e, item)}} disabled={this.props.roleAction=='view'}>
                            <span style={styleLable} className="featLABLE" title={item.resourceName}>{item.resourceName}</span>
                        </Checkbox>
                    </div>
                )
            })
        }
    }

    renderUrlList = () => {
        const { editStatus } = this.props        
        if (this.props.urlList) {
            const { rolePriviledges }= this.props
            return this.props.urlList.map((item, index)=>{
                let checked = false
                const sourcePri = item.priviledges
                sourcePri.forEach(element => {
                    if (rolePriviledges.indexOf(element.priviledgeId) >= 0) {
                        checked = true
                    }
                });
                return (
                    <div key={index}>
                        <Checkbox value={item.resourceId} defaultChecked={checked} onChange={(e)=>{this.featureChange(e, item)}} disabled={this.props.roleAction=='view'}>
                            <a href={item.url} className="featFont featURL" title={item.resourceName}>{item.resourceName}</a>
                        </Checkbox>
                    </div>
                )
            })
        }
    }

    featureChange = (e, resource) => {
        if (resource.priviledges && resource.priviledges.length) {
            let { rolePriviledges }= this.props         
            const priviledgeId = resource.priviledges[0].priviledgeId
            if (e.target.checked) {
                if (rolePriviledges.indexOf(priviledgeId) < 0){ 
                    rolePriviledges.push(priviledgeId)
                }
            } else {
                if (rolePriviledges.indexOf(priviledgeId) >= 0){
                    const count = rolePriviledges.indexOf(priviledgeId)
                    rolePriviledges.splice(count, 1)
                }
            }
            // console.log('rolePriviledges....', rolePriviledges)
            actions.systemRoleManage.setRolePriviledges(rolePriviledges)
            console.log('rolePriviledges....', this.props.rolePriviledges)
        }
    }

    resourceChange = (e, resource) => {
        // if (resource.priviledges && resource.priviledges.length && resource.priviledges.length > 1) {
        //     return
        // }
        let { rolePriviledges }= this.props         
        const priviledgeId = resource.priviledgeId
        if (e.target.checked) {
            if (rolePriviledges.indexOf(priviledgeId) < 0){ 
                rolePriviledges.push(priviledgeId)
            }
        } else {
            if (rolePriviledges.indexOf(priviledgeId) >= 0){
                const count = rolePriviledges.indexOf(priviledgeId)
                rolePriviledges.splice(count, 1)
            }
        }
        // console.log('rolePriviledges....', rolePriviledges)
        actions.systemRoleManage.setRolePriviledges(rolePriviledges)
        console.log('rolePriviledges....', this.props.rolePriviledges)
    }

    //功能权限-全选
    // featureCheckChange = (featureCheckedList) => {
    //     this.setState({
    //         featureCheckedList,
    //         featIndeterminate: !!featureCheckedList.length && (featureCheckedList.length < this.props.featureValueList.length),
    //         featureCheckAll: featureCheckedList.length === this.props.featureValueList.length,
    //     });
    // }
    featureCheckAllChange = (e) => {
        // console.log(e)
        let {rolePriviledges, featureValueList} = this.props
        if (e.target.checked) {
            // console.log(1111, featureValueList)
            // console.log(2222, rolePriviledges)
            featureValueList.forEach((item, index)=>{
                // console.log(item)
                if (rolePriviledges.indexOf(item.priviledges[0].priviledgeId) < 0) {
                    rolePriviledges.push(item.priviledges[0].priviledgeId)
                }
            })
        } else {
            featureValueList.forEach((item, index)=>{
                // console.log(item)
                if (rolePriviledges.indexOf(item.priviledges[0].priviledgeId) >= 0) {
                    const count = rolePriviledges.indexOf(item.priviledges[0].priviledgeId)
                    rolePriviledges.splice(count, 1)
                }
            })
        }
        // this.setState(this.state)
        actions.systemRoleManage.setRolePriviledges(rolePriviledges)
        console.log(this.props.rolePriviledges)
        this.setState({
            // featureCheckedList: e.target.checked ? this.props.featureValueList : [],
            featIndeterminate: false,
            featureCheckAll: e.target.checked,
        });
    }
    //数据权限-全选
    // numberCheckChange = (numberCheckedList) => {
    //     this.setState({
    //         numberCheckedList,
    //         numIndeterminate: !!numberCheckedList.length && (numberCheckedList.length < this.props.dataSourceList.length),
    //         numberCheckAll: numberCheckedList.length === this.props.dataSourceList.length,
    //     });
    // }
    numberCheckAllChange = (e) => {
        console.log(e)        
        this.setState({
            numberCheckedList: e.target.checked ? this.props.dataSourceValueList : [],
            numIndeterminate: false,
            numberCheckAll: e.target.checked,
        });
    }
    //查看弹框
    viewShowModal = () => {
        this.setState({
            viewVisible: true,
        });
    }
    viewHandleOk = (e) => {
        this.setState({
            viewVisible: false,
        });
    }
    viewHandleCancel = (e) => {
        this.setState({
            viewVisible: false,
        });
    }
    RadioChange = (e) => {
        //console.log('radio checked', e.target.value);
        this.setState({
            radioValue: e.target.value,
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }
    render() {
      return (
        <div>        
            <div className="main-role">
                <Row>
                    <Col span={9}>
                        <TreeModal {...this.props} />
                    </Col>
                    <Col span={15}>
                        <Row className="pr20 pl20">
                            <Col span={12}>
                                <div className="perTitle">{window.LangMessage.functional_authority || '功能权限'}</div>
                                <div>
                                    {/* <Checkbox
                                        className="allCheck"
                                        indeterminate={this.state.featIndeterminate}
                                        onChange={this.featureCheckAllChange}
                                        checked={this.state.featureCheckAll}>
                                        全选
                                    </Checkbox> */}
                                </div>
                                {/* <CheckboxGroup value={this.state.featureCheckedList} onChange={this.featureCheckChange} > */}
                                    <div className="btn-feature alignLeft">
                                        {this.renderButtonList()}
                                        {this.renderUrlList()}
                                        {this.renderLabelList()}
                                        {this.renderFieldList()}
                                        {/* <div>
                                            <Checkbox value="按钮1" onChange={(e)=>this.dataSourceChange(e)}>
                                                <Button className="featFont featBtn">按钮1</Button>
                                            </Checkbox>
                                        </div>
                                        <div>
                                            <Checkbox value="链接1">
                                                <a className="featFont featA">链接1</a>
                                            </Checkbox>
                                        </div>
                                        <div>
                                            <Checkbox value="个人信息">
                                                <span className="featFont featSpan">个人信息</span>
                                            </Checkbox>
                                        </div>
                                        <div>
                                            <Checkbox value="字段1">
                                                <b>A</b>
                                                <span className="featFont featDate">字段1</span>
                                                <RadioGroup onChange={this.RadioChange} value={this.state.radioValue}>
                                                  <Radio value={1}>读</Radio>
                                                  <Radio value={2}>写</Radio>
                                                </RadioGroup>
                                            </Checkbox>
                                        </div> */}
                                    </div>
                                {/* </CheckboxGroup> */}
                            </Col>
                            <Col span={12}>
                                <div className="perTitle">{window.LangMessage.data_access || '数据权限'}</div>
                                <div>
                                    {/* <Checkbox
                                        className="allCheck"
                                        indeterminate={this.state.numIndeterminate}
                                        onChange={this.numberCheckAllChange}
                                        checked={this.state.numberCheckAll}
                                      >
                                        全选
                                    </Checkbox> */}
                                </div>
                                {/* <CheckboxGroup value={this.state.numberCheckedList} onChange={this.numberCheckChange}> */}
                                    <div className="btn-feature alignLeft">
                                        {this.renderDataSourceList()}
                                        {/* <div className="font-ellipsis">
                                            <Checkbox value="链接1">
                                                <a onClick={this.viewShowModal} className="featFont featA">链接1</a>
                                            </Checkbox>
                                            <Modal
                                                wrapClassName="vertical-center-modal"
                                                title="资源定义"
                                                footer={null}
                                                visible={this.state.viewVisible}
                                                onOk={this.viewHandleOk}
                                                onCancel={this.viewHandleCancel}
                                            >
                                                <Table pagination={false} bordered columns={colsmodal} dataSource={datamodal} />
                                            </Modal>
                                        </div> */}
                                    </div>
                                {/* </CheckboxGroup> */}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </div>
      );
    }
}
const WrappedRolePermissionSet = Form.create()(RolePermissionSet);

export default connect(state => {
    return {
        ...state.systemRolePermissionSet,
        ...{
            roleAction: state.systemRoleManage.roleAction,
            dataSourceList: state.treeModal.dataSourceList,
            dataSourceValueList: state.treeModal.dataSourceValueList,
            dataSourcePermissionList: state.treeModal.dataSourcePermissionList,
            buttonList: state.treeModal.buttonList,
            fieldList: state.treeModal.fieldList,
            labelList: state.treeModal.labelList,
            urlList: state.treeModal.urlList,
            featureValueList: state.treeModal.featureValueList,
            roleDetail: state.systemRoleManage.roleDetail,
            rolePriviledges: state.systemRoleManage.rolePriviledges
        }
    }
})(WrappedRolePermissionSet)