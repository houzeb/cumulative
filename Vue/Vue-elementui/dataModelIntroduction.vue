/** 数据模型简介 */
<template>
	<div class="dataModelIntroduction">
		<p class="title">数据模型简介</p>
		<div class="content">
			<el-row>
				<el-col :span="8">模型编码：<span>{{modelData.code}}</span></el-col>
				<el-col :span="8">模型名称：<span>{{modelData.name}}</span></el-col>
				<el-col :span="8">启停标识：<span>{{modelData.flag}}</span></el-col>
			</el-row>
			<el-row>
				<el-col :span="24">模型描述：<span>{{modelData.desc}}</span></el-col>
			</el-row>
		</div>
		
	</div>
</template>

<script>
	export default {
	   props:['modelData']
	}
</script>

<style lang='less'>
	.dataModelIntroduction {
		width: 500px;
		.title {
			font-size: 18px;
			padding: 10px 0;
		}
		.content {
			margin-left: 20px;
		}
	}


  	@media screen and (min-width: 1500px) {
	    .dataModelIntroduction {
	      	width: 800px;
	    }
  	}
  	@media screen and (min-width: 1600px) {
	    .dataModelIntroduction {
	      	width: 900px;
	    }
  	}
  	@media screen and (min-width: 1700px) {
    	.dataModelIntroduction {
     	 	width: 1000px;
    	}
  	}
  	@media screen and (min-width: 1800px) {
    	.dataModelIntroduction {
      	width: 1100px;
    	}
  	}
  	@media screen and (min-width: 1900px) {
    	.dataModelIntroduction {
      		width: 1200px;
    	}
  	}
</style>