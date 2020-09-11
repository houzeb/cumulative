//遍历API
function ergodic(obj, result) {
    for (var attr in obj) {
        if (typeof obj[attr] === 'object') {
            ergodic(obj[attr], result)
        } else {
            if (typeof obj[attr] === 'string') {
                obj[attr] = result + obj[attr];
            }
        }
    }
}
//数据接口
export default {
    setProt: function (result)//动态设置端口
    {
        ergodic(this, result)
    },
    slidesPerGroup: {//筛选方案
        treeList: '/dataContre/DataWareHouseController/treeList',//仓库数
        selectModelList: '/dataContre/ModelController/selectModelList',//获取仓库模型
        findQueryScheme: '/dataContre/queryScheme/findQueryScheme',//查询模型所有方案
        insertQueryScheme: '/dataContre/queryScheme/insertQueryScheme',//添加筛选方案
        reNameQueryScheme: '/dataContre/queryScheme/reNameQueryScheme',//方案重命名
        delQueryScheme: '/dataContre/queryScheme/delQueryScheme',//方案删除
        defaultQueryScheme: '/dataContre/queryScheme/defaultQueryScheme',//默认方案
        findByModelId: '/dataContre/ModelController/findByModelId',//查询模型字段
        findQuerySchemeConfig: '/dataContre/queryScheme/findQuerySchemeConfig',//查询筛选配置信息
        insertQuerySchemeConfig: '/dataContre/queryScheme/insertQuerySchemeConfig'//保存筛选配置信息
    },
    collectionConfiguration: {//采集配置
        findTaskList: '/dataContre/dcTask/findTaskList',//查询任务列表
        dataCollection: '/dataContre/ModelController/dataCollection'//批量更新
    },
    screeningConfiguration: {//维护配置
        insertMaintainScheme: '/dataContre/maintainScheme/insertMaintainScheme',//添加维护方案
        reNameMaintainScheme: '/dataContre/maintainScheme/reNameMaintainScheme',//维护方案重命名
        delMaintainScheme: '/dataContre/maintainScheme/delMaintainScheme',//批量删除维护方案
        defaultMaintainScheme: '/dataContre/maintainScheme/defaultMaintainScheme',//设置默认方案
        findMaintainScheme: '/dataContre/maintainScheme/findMaintainScheme',//查询维护方案
        insertMaintainSchemeConfig: '/dataContre/maintainScheme/insertMaintainSchemeConfig',//保存维护配置信息
        findMaintainSchemeConfig: '/dataContre/maintainScheme/findMaintainSchemeConfig'//查询维护配置信息
    },
    displayConfiguration: {/*展示方案*/
        insertShowScheme: '/dataContre/showScheme/insertShowScheme',/*添加展示方案*/
        reNameShowScheme: '/dataContre/showScheme/reNameShowScheme',/*维护方案重命名*/
        delShowScheme: '/dataContre/showScheme/delShowScheme',/*批量删除展示方案*/
        defaultShowScheme: '/dataContre/showScheme/defaultShowScheme',/*默认方案*/
        findShowScheme: '/dataContre/showScheme/findShowScheme',/*查询展示方案*/
        findByModelId: '/dataContre/ModelController/findByModelId',/*查询模型字段*/
        insertShowSchemeDetail: '/dataContre/showScheme/insertShowSchemeDetail',/*保存展示详情参数*/
    },
    dataMaintenance: {/*数据维护*/
        treeList: '/dataContre/DataWareHouseController/treeList',/*数据仓库树*/
        selectModelList: '/dataContre/ModelController/selectModelList',/*查询模型列表*/
        findShowScheme: '/dataContre/showScheme/findShowScheme',/*展示配置*/
        findMaintainScheme: '/dataContre/maintainScheme/findMaintainScheme',/*维护配置*/
        findQueryScheme: '/dataContre/queryScheme/findQueryScheme',/*筛选配置*/
        paging: '/dataContre/dataMaintain/paging',/*分页查询*/
        add: '/dataContre/dataMaintain/add',/*新增数据*/
        update: '/dataContre/dataMaintain/update',/*修改数据*/
        delete: '/dataContre/dataMaintain/delete',/*删除数据*/
        findQuerySchemeConfig: '/dataContre/queryScheme/findQuerySchemeConfig',/*查询筛选配置信息*/
        findMaintainSchemeConfig: '/dataContre/maintainScheme/findMaintainSchemeConfig',/*查询维护配置信息*/
        findShowScheme: '/dataContre/showScheme/findShowScheme',/*查询展示配置信息*/
    },
     /* 任务管理 */
     taskManage: {
        /* 任务列表 */
        findTaskList: '/dataContre/dcTask/findTaskList',
        insertTaskList: '/dataContre/dcTask/insert',
        updateTask: '/dataContre/dcTask/updateTask',
        deleteTask: '/dataContre/dcTask/delete',
        selectTaskLogList: '/dataContre/dcTask/selectTaskLogList',
        findTaskJobList: '/dataContre/dcTask/findTaskJobList',
        insertTaskJob: '/dataContre/dcTask/insertTaskJob',
        updateTaskJob: '/dataContre/dcTask/updateTaskJob',
        deleteTaskJob: '/dataContre/dcTask/deleteTaskJob',
        enable: '/dataContre/dcTask/enable'
    },
    /* 运行记录 */
    taskRecord: {
        taskLogList: '/dataContre/dcTask/selectTaskLogList',
        taskJobLogList: '/dataContre/dcTask/selectTaskJobLogList',
    },
    /**运行管理 */
    operationManagement: {
        /**脚本管理 */
        scriptManagement: {
            getScriptList: '/dataContre/JobController/selectList', //分页查询脚本列表
            addScriptList: '/dataContre/JobController/insert', //新增脚本列表
            updateScriptList: '/dataContre/JobController/update', //修改脚本列表
            deleteScriptList: '/dataContre/JobController/delete', //删除脚本列表
            getParamList: '/dataContre/JobController/selectParamList', //获取参数列表数据
            addParamList: '/dataContre/JobController/insertParam', //新增脚本参数
            getScriptFile: '/dataContre/JobController/findFileByJobId', //得到脚本文件
            uploadUrl: '/dataContre/file/fileUpload', //上传脚本文件
            updateScriptFile: '/dataContre/JobController/updateJobFile', //修改脚本文件
            updateParamList: '/dataContre/JobController/updateJobParam', //编辑脚本参数
            deleteParamList: '/dataContre/JobController/deleteParam', //删除脚本参数
            getScriptDetail: '/dataContre/JobController/findLongText', //获取脚本详情
            updateScriptDetail:'/dataContre/JobController/updateLongText', //修改脚本详情
            autoScriptCode: '/dataContre/JobController/selectJbCode', //自动获取脚本编码
            autoParamCode: '/dataContre/JobController/selectJbParamCode', //自动获取参数编码
            getTypeArr: '/dataContre/SysData/selectDirData', //通过类型名称获取类型数组
        }
    },
    /**数据建模 */
    dataModeling:{
        /**数据仓库 */
        dataWarehouse: {
            getTreeList: '/dataContre/DataWareHouseController/treeList', //得到树
            changeState: '/dataContre/DataWareHouseController/enable', //改变启用停用状态
            addTreeNode: '/dataContre/DataWareHouseController/insert', //新增树
            autoDWCode: '/dataContre/DataWareHouseController/selectDWCode', //自动生成码
            updateTreeNode: '/dataContre/DataWareHouseController/update', //修改树
            deleteTreeNode: '/dataContre/DataWareHouseController/delete', //删除树
            moveTreeNode: '/dataContre/DataWareHouseController/moveRecord', //迁移树
            wareHouseDetail: '/dataContre/DataWareHouseController/findById' //获取仓库详情
        },
        /**数据模型 */
        dataModel: {
            getModelList: '/dataContre/ModelController/selectModelList', //获得数据模型
            addDataModel: '/dataContre/ModelController/insert', //新增数据模型
            updateDataModel: '/dataContre/ModelController/updateModel', //修改数据模型
            deleteDataModel: '/dataContre/ModelController/delete', //删除数据模型
            changeState: '/dataContre/ModelController/enable', //启用停用
            getModelField: '/dataContre/ModelController/findByModelId', //获取模型字段表格数据
            addModelField: '/dataContre/ModelController/insertModelField', //新增模型字段
            updateModelField: '/dataContre/ModelController/updateModelField', //修改模型字段
            deleteModelField: '/dataContre/ModelController/deleteModelField', //删除模型字段
            autoModelCode: '/dataContre/ModelController/selectModelCode', //自动生成模型编码
            autoFieldCode: '/dataContre/ModelController/selectModelFieldCode', //自动生成字段编码
            getDataWarehouse: '/dataContre/ModelController/selectDwName', //通过仓库id获取仓库
        },
    },
    /* 数据字典 */
    dataDictionary: {
        SysDirTree: "/dataContre/DirlController/SysDirTree",//(一)获取数据字典树
        addDataDir: '/dataContre/DirlController/addDataDir',//(二)插入一个基础数据字典对象
        modifyDataDir: '/dataContre/DirlController/modifyDataDir',//(四)修改字典
        delDataDir: '/dataContre/DirlController/delDataDir',//(三)删除字典
        sysDataList: '/dataContre/SysData/sysDataList',//(一)获取数据定义树
        addsysData: '/dataContre/SysData/addsysData', //(二)插入一个数据字典对象
        delsysData: '/dataContre/SysData/delsysData',//(三)删除字典定义
        modifysysData: '/dataContre/SysData/modifysysData'//(四)修改字典对象
    },
}

