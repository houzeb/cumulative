<template>
  <div class="model-info">
    <h3 class="header">数据模型简介</h3>
    <div class="dcg-info-list clearfix">
      <p class="item">模型编码：
        <span>{{config.code}}</span>
      </p>
      <p class="item">模型名称：
        <span>{{config.name}}</span>
      </p>
      <p class="item">启停标识：
        <span>{{config.identification}}</span>
      </p>
    </div>
    <div class="dcg-info-list clearfix">
      <p class="item">模型描述：
        <span>{{config.describe}}</span>
      </p>
    </div>
  </div>
</template>
<script>
/**
 * 名称 config 
 * 类型 type  Object
 * 属性
 *  code  string  模型编码
 *  name  string  模型名称
 *  identification  string  启停标识
 *  describe  string  模型描述
 */
  export default {
      props:['config']
  }

</script>

<style lang="less">
.model-info{
      .header{
        font-size: 18px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 25px;
      } 
      .dcg-info-list{
         margin-top: 15px;
         padding-left: 40px;
         color: #606266;
           .item{
               float: left;
               margin-right: 50px;
               span{
                   color: #909399;
                   font-size: 15px;
               }
           }
      }
   }
</style>
