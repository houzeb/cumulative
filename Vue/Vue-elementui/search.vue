/**
 *  formConfig:{
        defaultWidth: 100,
        colSpan: 12,
        custom: [
        //搜索配置
        { label: "市场类型", field: "marketId", type: "select", childrens:[] },
        { label: "产品大类", field: "categortyId", type: "cascader", childrens:[] },
        { label: "产品定义", field: "modelName", type: "input" },
        { label: "产品名称", field: "goodsName", type: "input" },
        { label: "是否已定价", field: "isPrice", type: "radio",childrens:[{name:'是',value:'是'},{name:'否',value:'否'}]},
        ]
      },
      formData:{
        data:{}
      },
 *formConfig  type  Object (必填) 
    属性:
        defaultWidth  number  表单的label宽度(必填)
        colSpan       number  搜索项所占个数,,优先级在custom里面的colSpan之下(可选)
        custom        array   搜索项的form表单配置,里面每一项为对象(可选)
            custom中的单项属性(必填)
                label   string  页面显示的字段名
                field   string  绑定的字段值
                type    string  搜索项的类型
                                      类型: select    下拉框   需加上childrens
                                            cascader  级联框   需加上childrens
                                            input     输入框
                                            textarea  多行文本框
                                            radio     单选按钮   需加上childrens
                                            checkbox  多选按钮   需加上childrens
                                            number    计数器
                                            date/datetimerange/daterange/datetime   多种时间选择器
                                            numRange  自定义组件,两个数值之间,形式为 0至10 
 *formData  type Object(必填)
    属性: 
        data  Object  用于form表单中数据绑定保存的对象
 */
<template>
  <div>
    <div class="box">
      <div class="fs-menu" :class="'fs-menu'+formConfig.id" @click="clickEvent" >
        <i class="el-icon-d-arrow-left"></i>
      </div>
      <div :class="'searchContent'+formConfig.id" class="searchContent">
        <div class="content" v-if="isShow">
          <el-form ref="form" :model="formData.data" :label-width="formConfig.defaultWidth+'px'">
            <el-row >
              <el-col v-for="(item,index) in formConfig.custom" :span="item.colSpan||formConfig.colSpan||8" >
                <el-form-item :label="item.label" size="mini" :label-width="getLabelWidth(item.labelWith)">
                  <el-input :disabled="item.disabled" v-model="formData.data[item.field]" v-if="item.type=='input'"></el-input>
                  <el-input :disabled="item.disabled" v-model="formData.data[item.field]" v-if="item.type=='textarea'" type="textarea" :autosize="{minRows: 2, maxRows: 4}"></el-input>
                  <el-date-picker :disabled="item.disabled" v-if="item.type=='datetime'||item.type=='date'||item.type=='datetimerange'||item.type=='daterange'" :type="item.type"  v-model="formData.data[item.field]"  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                  <!-- <el-date-picker v-if="item.type=='datetimerange'" v-model="formData.data[item.field]" style="width: 100%;" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker> -->
                  <el-radio-group :disabled="item.disabled"  v-if="item.type=='radio'" v-model="formData.data[item.field]">
                    <el-radio  v-for="child in item.childrens" :label="child.value" >{{child.name}}</el-radio>
                  </el-radio-group>
                  <el-checkbox-group :disabled="item.disabled" v-model="formData.data[item.field]" v-if="item.type=='checkbox'">
                    <el-checkbox-button v-for="child in item.childrens" :label="child.value" >{{child.name}}</el-checkbox-button>
                  </el-checkbox-group>
                  <el-input-number :disabled="item.disabled" v-if="item.type=='number'" v-model="formData.data[item.field]" :min="item.min" :max="item.max" :controls="item.isControls" :controls-position="item.controlPos"></el-input-number>
                  <el-select :disabled="item.disabled" v-model="formData.data[item.field]" clearable v-if="item.type=='select'">
                    <el-option
                      v-for="child in item.childrens"
                      :label="child.name"
                      :value="child.value">
                    </el-option>
                  </el-select>
                  <el-cascader
                    :disabled="item.disabled"
                    clearable
                    change-on-select
                    v-if="item.type=='cascader'"
                    :options="item.childrens"
                    :props="{'label':'name','value':'id','children':'children'}"
                    v-model="formData.data[item.field]">
                  </el-cascader>
                  <num-range
									 	v-if="item.type=='numRange'"
									 	v-model="formData.data[item.field]">
									</num-range>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="otherContent" v-else>
          <span class="search-laber" style="font-size:14px;">筛选条件：</span>
          <span class="search-con">
						<!-- <el-button type="text" class="toLeft" icon="el-icon-arrow-left "></el-button>
						<el-button type="text" class="toRight" icon="el-icon-arrow-right "></el-button> -->
						<span class="search-value-con">
							<span class="search-value" v-for="(item,index) in formConfig.custom" >
								<small v-if="formData.data[item.field]==''||formData.data[item.field]==null">{{item.label}}：全部</small>
								<small v-else-if="item.type=='select'">{{item.label}}：{{getSelectDate(formData.data[item.field],item.childrens)}}</small>
								<small v-else-if="formData.data[item.field].constructor==Array&&item.type!='numRange'&&item.type!='cascader'">{{item.label}}：{{getDate(formData.data[item.field])}}</small>
								<small v-else-if="formData.data[item.field].constructor==Array&&item.type=='numRange'">{{item.label}}：{{getRange(formData.data[item.field])}}</small>
								<small v-else-if="formData.data[item.field].constructor==Array&&item.type=='cascader'">{{item.label}}：{{getCascader(formData.data[item.field],item.childrens)}}</small>
								<small v-else-if="formData.data[item.field].constructor==Date">{{item.label}}：{{new Date().GMTToStr(formData.data[item.field])}}</small>
								<small v-else>{{item.label}}：{{formData.data[item.field]}}</small>
							</span>
						</span>
					</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import numRange from './numRanger.vue'

  export default{
    components:{
      numRange
    },
    props:['height','formData','formConfig'],
    data(){
      return{
        isShow:false,
      }
    },
    mounted(){
      this.$nextTick(function(){
        for(let d of this.formConfig.custom){
          if(d.type!='checkbox'&&d.type!='cascader'&&d.type!='numRange'){
            this.$set(this.formData.data,d.field,null)
          }else if(d.type=='numRange'){
            this.$set(this.formData.data,d.field,['',''])
          }else{
            this.$set(this.formData.data,d.field,[])
          }
        }
      })
    },
    methods:{
      // 数据配置
      getLabelWidth(width){
        if(width!=undefined&&width>0){
          return width+'px'
        }else{
          return this.formConfig.defaultWidth+'px'
        }
      },
      clickEvent(){
        var self=this
        console.log($('.fs-menu'+self.formConfig.id).children('i').hasClass('rotate'))
        if($('.fs-menu'+self.formConfig.id).children('i').hasClass('rotate')){
          // console.log(111)
          $('.fs-menu'+self.formConfig.id).children('i').removeClass('rotate')
          $('.fs-menu'+self.formConfig.id).siblings('.searchContent'+self.formConfig.id).css('height','auto')
        }else{
          // console.log(22)
          $('.fs-menu'+self.formConfig.id).children('i').addClass('rotate')
          $('.fs-menu'+self.formConfig.id).siblings('.searchContent'+self.formConfig.id).css('height',self.height+'px')
        }
        this.isShow=!this.isShow
      },
      getDate(array){
        var ary=[]
        for(let d of array){
          if(d.constructor==Date){
            ary.push(new Date().GMTToStr(d))
          }else{
            ary.push(d)
          }
        }
        return ary.join('至')
      },
      getRange(array){
        var ary=[]
        if(array[0]==''&&array[1]==''){
          return '全部'
        }else if(array[0]==''&&array[1]!=''){
          return '小于'+array[1]
        }else if(array[0]!=''&&array[1]==''){
          return '大于'+array[0]
        }else{
          return '大于'+array[0]+'且小于'+array[1]
        }
      },
      getCascader(ary,list){
        var str=[]
        var child=list
        if(ary.length>0){
          for(var i=0;i<ary.length;i++){
            // console.log(d,list)
            var index=child.findIndex(val=>val.value==ary[i])
            if(index>=0){
              str.push(child[index].name)
              if(child[index].children!=undefined){
                child=child[index].children
              }
            }
          }
          // alert(str)
          return str.join('/')
        }else{
          return '全部'
        }
      },
      getSelectDate(data,ary){
        var index=ary.findIndex(val=>val.value==data)
        if(index>=0){
          return ary[index].name
        }else{
          return '全部'
        }
      }
    }
  }
</script>
<style type="text/css" lang="less">
  .searchContent{
    .el-col{
      height: 46px;
    }
  }
</style>
<style lang="less" scoped>
  .box{
    width: 100%;
    height: auto;
    margin-bottom: 0px;
    position: relative;
    overflow: visible;
    .otherContent{
      line-height: 36px;
      padding-left: 10px;
      height: auto;
      overflow: auto;
      display: flex;
      .search-laber{
        width: 70px;
        font-size:12px;
      }
      .search-con{
        flex:1;
        padding-left: 20px;
        padding-right: 20px;
        .search-value-con{
          .search-value{
            background:#20a0ff;
            display: inline-block;
            padding:2px 5px;
            height: 20px;
            line-height: 20px;
            margin-left:5px;
            color:#fff;
            font-size: 12px;
          }
        }
      }
    }
    .searchContent{
      height: auto;
      width: 100%;
      background: #F6F6FC;
      position: relative;
      border: 1px solid #F6F6FC;
      border-top: none;
      overflow: hidden;
      // overflow: hidden;
      transition: all 0.3s ease;
      .content{
        padding: 20px;
        // height: 80%;
        // width: 80%;
        overflow: hidden;
      }
    }
    .fs-menu{
      background: #F6F6FC;
      position: absolute;
      bottom: -20px;
      left: 50%;
      margin-left: -40px;
      width: 80px;
      height: 20px;
      text-align: center;
      z-index: 10;
      border-radius: 0 0 5px 5px;
      border: 1px solid #F6F6FC;
      border-top: none;
      i{
        position: absolute;
        top: -2px;
        left: 50%;
        margin-left: -8px;
        transform:rotate(-90deg);
        color: black;
        font-weight: 900;
        font-size: 16px;
        animation: moveAnimation 1s infinite linear;
        &.rotate{
          transform:rotate(90deg);
        }
      }
    }
  }
  .el-cascader-menu{
    height: auto !important;
  }
  @keyframes moveAnimation{
    from {top: -2px;}
    to {top: 2px;}
  }
</style>
