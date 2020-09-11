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
  name: 'treeDom',
  initialState: {
    resourceResult: {},
    permissionResult: {},
    isShowFeatureResource: false
  },
  reducers: {
    setResourceResult(state, data) {
      return Object.assign({}, state, { resourceResult: data });
    },
    setDataResourceList(state, data) {
      return Object.assign({}, state, { dataSourceList: data });
    },
    setIsShowFeatureResource(state, data) {
      return Object.assign({}, state, { isShowFeatureResource: data });
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
          actions.treeDom.formateResourceDetail(res.value);
        }
      })
    },
    // 格式化资源
    formateResourceDetail(data) {
      const resourceMap = data.resourceMap;
      if (data.resourceMap && data.resourceMap['BUSINESS_DATA'] && data.resourceMap['BUSINESS_DATA'].length) {
        const arr = [];
        const dataSourceList = [];
        data.resourceMap['BUSINESS_DATA'].map((item, index) => {
          arr.push({
            key: index + 1,
            priviledgeName: item.priviledges && item.priviledges[0] && item.priviledges[0].priviledgeName,
            resourceTypeName: window.LangMessage.business_data || '业务数据',
            ...item
          })
          dataSourceList.push({
            id: item.resourceId,
            value: item.resourceName
          })
        })
        data.resourceMap['BUSINESS_DATA'] = arr;
        actions.treeDom.setDataResourceList(dataSourceList);
      }
      
      // 这里判断，有children的代表是父节点（父节点需要隐藏功能资源）
      const isParent = Object.keys(data.resourceMap).length && data.resourceMap['MENU'] ? true : false;
      actions.treeDom.setIsShowFeatureResource(!isParent);
      actions.treeDom.setResourceResult(data);
      
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
            actions.treeDom.formatePermissionDetail(res.value[0]);
        }
      })
    },
    // 格式化权限数据
    formatePermissionDetail(data) {
      actions.treeDom.setPermissionResult(data);
    }
  }
})

class TreeDom extends React.Component {
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
          actions.treeDom.getResourceDetail({ resourceId: defaultResourceId });
        actions.routing.replace({
          search: '?resourceId=' + defaultResourceId
        });
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
        priviledgeId: item.priviledges && item.priviledges.length && item.priviledges[0].priviledgeId || null,
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
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} />;
    });
  }

  selectTreeNode = (selectedKeys, e) => {
    const dataRef = e.node.props.dataRef;
      actions.routing.replace({
        search: '?resourceId=' + dataRef.key
      });
      actions.treeDom.getResourceDetail({resourceId: dataRef.key});
  }

  // 获取某个资源的详细信息
  render() {
    const { autoExpandParent, defaultSelectedKeys, treeData } = this.state;
    const type = this.props.type;
    const isShowTree = treeData.length ? true : false; // 这里保证有treeData的时候再去渲染dom，避免有些属性只在第一次渲染时才生效。
    return (
      <div className="treeDiv">
        <div className="treeTitle">
          <span>{window.LangMessage.subsystem_menu || '子系统 / 菜单'}{type==='resource' ? window.LangMessage.resources || '资源':window.LangMessage.manage_permissions || '权限'}</span>
        </div>
        {
          isShowTree && (
            <Tree
              defaultExpandAll
              defaultSelectedKeys={defaultSelectedKeys}
              onSelect={this.selectTreeNode}
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
    ...state.treeDom
  }
})(TreeDom)