<template>
    <div class="tag">
        <div v-for="item in config" style="width:100%">
            <div class="tag-item" @click="backOn(item)" :class="{'tag-active':item.fieldName==active}">
                {{item.chineseName}}
                <i class="el-icon-minus tag-icon" @click.stop="remove(item.fieldName)"></i>
            </div>
         </div>
    </div>
</template>
<script>
export default {
    props:['config'],
    data () {
        return {
          active:''  
        }
    },
    methods: {
        remove(key){
       this.$confirm('确定移除该属性吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         var index =  this.config.findIndex((item)=>{
               return item.fieldName === key;
           }) 
          var name =  this.config[index].fieldName;
          this.config.splice(index,1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.$emit('tagDelBack',name);//回调
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        },
        backOn(data){
            this.$emit('tagBack',data);
        }
    },
    watch: {
       'config':function(){
           this.active = '';
       } 
    }
}
</script>
<style lang="less">
    .tag{
       text-align: center;
       .tag-item{
        //    background-color: #DCDFE6;
           margin-top: 5px;
           overflow: hidden;
           text-overflow: ellipsis;
           white-space: nowrap;
           line-height: 25px;
           display: inline-block;
           width: 100px;
           cursor: pointer;
           padding-right: 25px;
           padding-left: 10px;
           position: relative;
           border: 2px solid transparent;
       }
       .tag-icon{
           position: absolute;
           right: 8px;
           margin-top: 4px;
           border: 1px solid #C5C5C5;
       
       }
       .tag-active{
           border: 2px dashed #aaa;
        //    color: white;
       }
    }
           
</style>

