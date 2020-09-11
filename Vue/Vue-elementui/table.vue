/**
 *
 *
 */
<template>
  <div>
    <slot></slot>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      :highlight-current-row="tableConfig.isHigh"
      @row-dblclick="dblClickEvent"
      @current-change="selectRowChange"
      @selection-change="handleSelectionChange"
      @header-click="headerClick"
      v-loading="tableConfig.loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :max-height="tableConfig.height">
      <el-table-column
        :selectable="selectable"
        v-if="tableConfig.isSelection"
        type="selection"
        width="55">
      </el-table-column>
      <!-- 序号列 -->
      <el-table-column header-align="center" align="center" label="序号" type="index" v-if="tableConfig.isOrder" width="50">
      </el-table-column>

      <el-table-column 
        v-for="(item,index) in tableConfig.colConfig"
        :label="item.label"
        v-if="item.type == 'img'"
        :width="setWidth(item.width)">
          <template scope="scope">
              <el-popover trigger="hover" placement="top">
                <div style="height:500px;width:100%;border:1px solid rgb(220, 223, 230);border-radius:5px;overflow:auto;">
                  <img :src="scope.row[item.field]" style="width:100%;max-height:100%;">
                </div>
                <div slot="reference" class="name-wrapper">
                  <img :src="scope.row[item.field]" width="60" height="60"/>
                </div>
            </el-popover>
          </template>
      </el-table-column>
      
      <el-table-column
        v-for="(item,index) in tableConfig.colConfig"
        :fixed="isFixed(item.fixed)"
        :prop="item.field"
        v-if="item.type == 'text'"
        :width="setWidth(item.width)"
        :sortable="item.isSort"
        :resizable="item.isResize"
        :show-overflow-tooltip="item.isShowTip"
        :label="item.label">
      </el-table-column>

      <el-table-column
        label="操作"
        header-align="center"
        align="center"
        v-if="tableConfig.isBtns">
        <template slot-scope="scope">
          <el-button size="mini" v-for="(item,index) in tableConfig.btns" :type="item.type" @click="btnClick(item.method,scope.$index, scope.row)"  :disabled="item.disabled" :icon="'el-icon-'+item.icon">{{item.btnName}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 10px;">
      <el-pagination
        v-if="tableConfig.isPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[20, 40, 60, 80]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="setTotal()">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      btnClick(val,index,row) {
        this.$emit(val,row)
      },
      // 基础配置
      isFixed(fix){
        if(fix==true||fix=='left'||fix=='right'){
          return fix
        }else{
          return false
        }
      },
      setWidth(width){
        if(parseInt(width)>0){
          return width
        }else{
          return false
        }
      },
      setTotal(){
        if(this.tableConfig.isPage){
          return this.tableConfig.total
        }else{
          return this.tableData.length
        }
      },
      // 事件处理
      dblClickEvent(val){
        this.$emit('dblClickEvent',val)
      },
      // 选择一行
      selectRowChange(val){
        if(this.tableConfig.isHigh){
          this.$emit('currentRowChange',val)
        }
      },
      // 复选框选择
      handleSelectionChange(val){
        this.$emit('selectChange',val)
      },
      // 当前页变化
      handleCurrentChange(val){
        this.currentPage=val
        this.$emit('pageChange',this.pageSize,this.currentPage)
      },
      // 当前条数变化
      handleSizeChange(val){
        this.pageSize=val
        this.$emit('sizeChange',this.pageSize,this.currentPage)
      },
      // 头部点击
      headerClick(val){
        this.$emit('headerClick',val)
      },
      init(){
        this.pageSize=20;
        this.currentPage=1;
      },
      selectable(row,index){
        if(this.tableConfig.selectable){
          if(row[this.tableConfig.disabledField]==this.tableConfig.field){
            return false
          }else{
            return true
          }
        }else{
          return true
        }
      }
    },
    data() {
      return {
        currentPage:1,
        pageSize:20,       
      }
    },
    watch:{
      tableConfig:{
        handler:function(){
          if(this.tableConfig.pageSize!=undefined&&this.tableConfig.pageSize){
            this.pageSize=this.tableConfig.pageSize;
          }
          if(this.tableConfig.currentPage!=undefined&&this.tableConfig.currentPage){
            this.currentPage=this.tableConfig.currentPage;
          }
        },
        deep:true
      }
    },
    mounted(){
      if(this.tableConfig.pageSize!=undefined&&this.tableConfig.pageSize){
        this.pageSize=this.tableConfig.pageSize;
      }
      if(this.tableConfig.currentPage!=undefined&&this.tableConfig.currentPage){
        this.currentPage=this.tableConfig.currentPage;
      }
    },
    props:['tableConfig','tableData'],
  }
</script>
