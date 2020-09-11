/** 
   滑动侧边栏
 */
<template>
  <div class="sidebar" :style="{marginLeft:-sidebarLeft+'px'}">
    <div class="sidebar-header">
      数据仓库
        <el-cascader
          :options="dataWH"
          size="small"
          v-model="dataWHCurr"
          @change="change"
          :show-all-levels="false"
        ></el-cascader>
    </div>
    <!-- <i class="el-icon-d-arrow-right sidebar-bar" @click="sidebarLeft = sidebarLeft==0?260:0" :class="sidebarLeft==0?'sidebar-bar-back':'sidebar-bar-go'"></i> -->
    <el-row>
       <el-col :span="24" v-for="item in modelData">
           <div class="sidebar-model" :class="{'sidebar-model-active':item.id==currModel.id}" @click="modelClick(item)">{{item.modelDesc}}</div>
       </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data () {
      return {
        //侧边位移
        sidebarLeft:0,
        //下拉列表数据
        dataWH:[],
        dataWHCurr:[],
        modelData:[],
        currModel:''
      }
  },
  mounted () {
     this.$http.get({url:this.$api.slidesPerGroup.treeList,callBack:(data)=>{
               this.setData(data);
               this.dataWH = data;
     },this_:this})
  },
  methods: {
     setData(arr){//修改数据
       for(var i = 0;i<arr.length;i++){
           arr[i]['value'] = arr[i].id;
           arr[i]['label'] = arr[i].dwName;
           if(Array.isArray(arr[i].children)){
              this.setData(arr[i].children);
           }
       }
     },
     change(attr){//当绑定值变化时触发的事件
          var result = attr[attr.length-1];
               this.$http.get({url:this.$api.slidesPerGroup.selectModelList,params:{dwId:result},callBack:(data)=>{
                 this.modelData = data;
              },this_:this})
     },
     modelClick(value){//模型点击
        this.currModel = value;
        this.$emit('sidebarBack',value);//回调事件
     }
  }
}
</script>
<style lang="less">
  .sidebar {
    width: 240px;
    padding: 10px 10px;
    background-color: #FAFAFA;
    min-height: 700px;
    transition: 0.5s;
    position: relative;
    float: left;
    margin-top: 15px;
    .sidebar-header {
      color: #606266;
      text-align: center;
      font-size: 14px;
      line-height: 30px;
    }
    .sidebar-dataSelect{
      width: 150px;
      margin-left: 5px;
    }
    .sidebar-model{
      text-align: center;
      margin: 5px auto;
      background-color: #656E79;
      width: 80%;
      padding: 7px;
      color: WHITE;
      font-size: 14px;
      cursor: pointer;
    }
    .sidebar-model-active{
      background-color: #409EFF;
    }
    // .sidebar-bar{
    //   position: absolute;
    //   top: 50%;
    //   margin-top: -25px;
    //   width: 25px;
    //   height: 50px;
    //   background-color: #63aaf4;
    //   line-height: 50px;
    //   text-align: center;
    //   font-size: 20px;
    //   font-weight: 800;
    //   border-radius: 0 5px 5px 0;
    //   color: white;
    //   transition: 0.4s;
    //   cursor: pointer;
    // }
    // .sidebar-bar-go{
    //     right: -25px;
    // }
    // .sidebar-bar-back{
    //     right: 0;
    //     transform: rotate(180deg)
    // }
  }

</style>