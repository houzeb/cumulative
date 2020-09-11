/**
  * author: xielingjuan@zhongan.Icon
  * description: 资源管理-资源树菜单
  * date: 2017/11/26
  */
import React from 'react'
import ReactDOM from 'react-dom'
import mirror, { actions, connect } from 'mirrorx'
import { Tree } from 'antd';
import { locale } from 'moment';
const TreeNode = Tree.TreeNode;
  
mirror.model({
    name: 'treeModal',
    initialState: {
        resourceResult: {},
        permissionResult: {},
        isShowFeatureResource: false,
        dataSourceList: [],
        dataSourceValueList: [],
        dataSourcePermissionList: [],
        buttonList: [],
        fieldList: [],
        labelList: [],
        urlList: [],
        featureValueList: [],
    },
    reducers: {
        setResourceResult(state, data) {
            return Object.assign({}, state, { resourceResult: data });
        },
        setDataResourceList(state, data) {
            return Object.assign({}, state, { dataSourceList: data });
        },
        setDataResourceValueList(state, data) {
            return Object.assign({}, state, { dataSourceValueList: data });
        },
        setDataResourcePermissonList(state, data) {
            return Object.assign({}, state, { dataSourcePermissionList: data });
        },
        setIsShowFeatureResource(state, data) {
            return Object.assign({}, state, { isShowFeatureResource: data });
        },
        setButtonList(state, data) {
            return Object.assign({}, state, { buttonList: data });
        },
        setFieldList(state, data) {
            return Object.assign({}, state, { fieldList: data });
        },
        setLabelList(state, data) {
            return Object.assign({}, state, { labelList: data });
        },
        setUrlList(state, data) {
            return Object.assign({}, state, { urlList: data });
        },
        setFeatureValueList(state, data) {
            return Object.assign({}, state, { featureValueList: data });
        }

    },
    effects: {
      // 请求资源详情
        getResourceDetail(resourceData) {
            
            T.fetch({
            url: 'resource/querySubResources',
            data: {
                resourceId: +resourceData.resourceId
            }
            }).then(res => {
            if (res &&
                res.success &&
                res.value) {
                actions.treeModal.formateResourceDetail(res.value);
            }
            })
        },
        // 格式化资源
        formateResourceDetail(data) {
            const resourceMap = data.resourceMap;

            //初始化
            actions.treeModal.setDataResourceList([])
            actions.treeModal.setDataResourceValueList([])
            actions.treeModal.setDataResourcePermissonList([])
            actions.treeModal.setButtonList([])
            actions.treeModal.setFieldList([])
            actions.treeModal.setLabelList([])
            actions.treeModal.setUrlList([])
            actions.treeModal.setFeatureValueList([])
            
            let featureValueList = []
            let dataSourcePermission = []
            if (data.resourceMap && data.resourceMap['BUSINESS_DATA'] && data.resourceMap['BUSINESS_DATA'].length) {
                const arr = [];
                // const dataSourceList = [];
                const dataSourceValueList = []
                data.resourceMap['BUSINESS_DATA'].map((item, index) => {
                    arr.push({
                        key: index + 1,
                        priviledgeName: item.priviledges && item.priviledges[0] && item.priviledges[0].priviledgeName,
                        ...item
                    })
                    // dataSourceList.push({
                    //     value: item.resourceId,
                    //     label: item.resourceName
                    // })
                    dataSourceValueList.push(item)
                    if (item.priviledges) {
                        item.priviledges.map((pri, index)=>{
                            if (pri.operateType == 'WRITE') {
                                dataSourcePermission.push(pri)
                            }
                        })
                    }
                })
                data.resourceMap['BUSINESS_DATA'] = arr;
                actions.treeModal.setDataResourceList(data.resourceMap['BUSINESS_DATA']);
                actions.treeModal.setDataResourceValueList(dataSourceValueList)
                actions.treeModal.setDataResourcePermissonList(dataSourcePermission)
            }

            if (data.resourceMap && data.resourceMap['BUTTON'] && data.resourceMap['BUTTON'].length) {
                const buttonList = []
                data.resourceMap['BUTTON'].map((item, index) => {
                    buttonList.push({
                        value: item.resourceId,
                        label: item.resourceName
                    })
                    featureValueList.push(item)
                })
                actions.treeModal.setButtonList(data.resourceMap['BUTTON']);                
            }

            if (data.resourceMap && data.resourceMap['FIELD'] && data.resourceMap['FIELD'].length) {
                const fieldList = []
                data.resourceMap['FIELD'].map((item, index) => {
                    fieldList.push({
                        value: item.resourceId,
                        label: item.resourceName
                    })
                    featureValueList.push(item)                    
                })
                actions.treeModal.setFieldList(data.resourceMap['FIELD']);
            }

            if (data.resourceMap && data.resourceMap['LABLE'] && data.resourceMap['LABLE'].length) {
                const labelList = []
                data.resourceMap['LABLE'].map((item, index) => {
                    labelList.push({
                        value: item.resourceId,
                        label: item.resourceName
                    })
                    featureValueList.push(item)                    
                })
                actions.treeModal.setLabelList(data.resourceMap['LABLE']);
                
            }

            if (data.resourceMap && data.resourceMap['URL'] && data.resourceMap['URL'].length) {
                const urlList = []
                data.resourceMap['URL'].map((item, index) => {
                    urlList.push({
                        value: item.resourceId,
                        label: item.resourceName
                    })
                    featureValueList.push(item)                    
                })
                actions.treeModal.setUrlList(data.resourceMap['URL']);
            }

            actions.treeModal.setFeatureValueList(featureValueList);
            
            // 这里判断，有children的代表是父节点（父节点需要隐藏功能资源）
            const isParent = Object.keys(data.resourceMap).length && data.resourceMap['MENU'] ? true : false;
            actions.treeModal.setIsShowFeatureResource(!isParent);
            actions.treeModal.setResourceResult(data);
            
            
            
        },
        // 请求权限详情
        getPermissionDetail(permissionData) {
            T.fetch({
            url: 'resource/queryPriviledge',
            data: {
                resourceId: +permissionData.key,
                priviledgeId: +permissionData.priviledgeId || null
            }
            }).then(res => {
            if (res &&
                res.success &&
                res.value) {
                actions.treeModal.formatePermissionDetail(res.value[0]);
            }
            })
        },
        // 格式化权限数据
        formatePermissionDetail(data) {
            actions.treeModal.setPermissionResult(data);
        }
    }
  })
  
  class treeModal extends React.Component {
    super(props) {
      this.props = props;
    }
    state = {
      treeData: [],
      autoExpandParent: true,
      defaultSelectedKeys: []
    }
    componentDidMount = () => {
      this.getResourceTree();
    }
    // 获取左侧资源菜单树
    getResourceTree = () => {
        T.fetch({
            url: 'resource/queryMenuPriviledges',
        }).then(res => {
            if (res &&
            res.success &&
            res.value.length >= 0) {
            const value = res.value;
                const treeData = this.formatResourceTree(value);
                const urlResourceId = T.urlQuery('resourceId');
                const urlPriviledgeId = T.urlQuery('priviledgeId');
                const defaultResourceId = urlResourceId ? urlResourceId : treeData[0].key || ''; // 优先url中的id，否则默认根节点的id
                    actions.treeModal.getResourceDetail({ resourceId: defaultResourceId });
                this.setState({
                    treeData: treeData,
                    autoExpandParent: true,
                    defaultSelectedKeys: [defaultResourceId+ ''] // 默认根节点高亮
                })
            }
        })
    }
    // 格式化资源树数据
    formatResourceTree = (value) => {
      return value.map((item, index) => {
        const defaultData = {
          title: item.resourceName,
          key: item.resourceId,
        //   key: item.priviledgeId,
          priviledgeId: item.priviledgeId || null,
        };
        if (item.children && item.children.length) {
          return {
            ...defaultData,
            children: this.formatResourceTree(item.children)
          }
        }
        return {
          ...defaultData
        }
      })
    }
    // 渲染资源树dom
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children && item.children.length) {
                return (
                    <TreeNode title={item.title} key={item.priviledgeId} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode title={item.title} key={item.priviledgeId} dataRef={item} />;
        });
    }

    getCheckedKeys = () => {
        let { rolePriviledges }= this.props;
        const formatedRolePriviledges = []
        rolePriviledges.forEach((item, index)=>{
            formatedRolePriviledges.push(item+'')
        })
        return formatedRolePriviledges
    }
  
    selectTreeNode = (selectedKeys, e) => {
        let { rolePriviledges }= this.props
        const dataRef = e.node.props.dataRef;
        if (rolePriviledges.indexOf(dataRef.key) >= 0) {
            actions.systemRolePermissionSet.setEditStatus(true);
        } else {
            actions.systemRolePermissionSet.setEditStatus(false);
        }
        actions.routing.replace({
            search: '?resourceId=' + dataRef.key
        });
        actions.treeModal.getResourceDetail({resourceId: dataRef.key});
    }

    checkTreeNode = (checkedKeys, e) => {
        let { rolePriviledges }= this.props
        const resourceId = T.urlQuery('resourceId')
        const priviledgeId = e.node.props.dataRef.priviledgeId
        if (resourceId == priviledgeId) {
            actions.systemRolePermissionSet.setEditStatus(e.checked);
        }
        if (e.checked) {
            if (rolePriviledges.indexOf(priviledgeId) < 0){ 
                rolePriviledges.push(priviledgeId)
            }
        } else {
            if (rolePriviledges.indexOf(priviledgeId) >= 0){
                const count = rolePriviledges.indexOf(priviledgeId)
                rolePriviledges.splice(count, 1)
            }
        }
        actions.systemRoleManage.setRolePriviledges(checkedKeys)
        // console.log('rolePriviledges....', rolePriviledges)
    }
  
    // 获取某个资源的详细信息
    render() {
      const { autoExpandParent, defaultSelectedKeys, treeData } = this.state;
      const { roleAction } = this.props;
      const checkKeys = this.getCheckedKeys();
    //   let { rolePriviledges }= this.props
      const isShowTree = treeData.length ? true : false; // 这里保证有treeData的时候再去渲染dom，避免有些属性只在第一次渲染时才生效。
      return (
        <div className="treeDiv">
          <div className="treeTitle">
            <span>{window.LangMessage.subsystem_menu_resources || '子系统 / 菜单资源'}</span>
          </div>
          {
            isShowTree && (
              <Tree
                key={checkKeys}
                checkable
                // checkStrictly
                defaultExpandAll
                defaultSelectedKeys={defaultSelectedKeys}
                defaultCheckedKeys={checkKeys}
                onSelect={this.selectTreeNode}
                onCheck={this.checkTreeNode}
                autoExpandParent={true}
                disabled={roleAction==='view'}
              >
                {this.renderTreeNodes(treeData)}
              </Tree>
            )
          }
  
        </div>
      );
    }
  }
  export default connect(state => {
    return {
      ...state.treeModal,
      rolePriviledges: state.systemRoleManage.rolePriviledges
    }
  })(treeModal)