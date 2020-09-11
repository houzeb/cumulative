<template>
	<div>
		<div class="toolbar clearfix">
			<div class="toolleft">
				<el-button size="mini" v-for="(item,index) in toolbarConfig.leftBtns" :key="index" :type="item.type" :icon="'el-icon-'+item.icon" :disabled="toolbarConfig.leftBtnStatus[index]" @click="btnClick(item.method,index)">{{item.alias}}</el-button>
			</div>
			<div class="toolright">
				<el-button size="mini" v-for="(item,index) in toolbarConfig.rightBtns" :key="index" :type="item.type" :icon="'el-icon-'+item.icon" :disabled="toolbarConfig.rightBtnStatus[index]" @click="btnClick(item.method,index)">{{item.alias}}</el-button>
			</div>
		</div>
	</div>
</template>
<style type="text/css" scoped lang="less">
	.toolbar{
		// height: 50px;
		// line-height: 50px;
		.toolleft{
			float: left;
		}
		.toolright{
			float: right;
		}
	}
</style>
<script type="text/javascript">
	export default{
		props:['toolbarConfig'],
		data(){
			return{
				
			}
		},
		methods:{
			btnClick(val){
				this.$emit(val,val)
			}
		}
	}
</script>