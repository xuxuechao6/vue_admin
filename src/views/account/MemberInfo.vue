<template>
	<div>

		<div class="ms-doc">
			<h3 class="clearfix header">
				成员管理 
			</h3>
			<article>
				<el-row>
					<el-col :span="24">
暂无数据~~
					</el-col>
				</el-row>
			</article>
		</div>

	</div>
</template>

<script>
	export default {
		data: function() {
			return {

			}
		},
		methods: {
			handleBack(back) {
				this.$router.push('/deviceList');
			},

		}
	}
</script>

<style scoped>
	.ms-doc {
		width: 100%;
		max-width: 980px;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
	}
	
	.ms-doc h3 {
		padding: 9px 10px 10px;
		margin: 0;
		font-size: 14px;
		line-height: 25px;
		background-color: #f5f5f5;
		border: 1px solid #d8d8d8;
		border-bottom: 0;
		border-radius: 3px 3px 0 0;
	}
	
	.ms-doc article {
		padding: 45px;
		word-wrap: break-word;
		background-color: #fff;
		border: 1px solid #ddd;
		border-bottom-right-radius: 3px;
		border-bottom-left-radius: 3px;
	}
	
	.ms-doc article>div {
		padding: 10px 0;
	}
	
	.span_l {
		text-align: right;
		color: #999;
	}
	
	.publish {
		margin-top: 20px;
	}
	
	.delete {
		float: right;
		color: #ff4949;
		font-size: 24px;
		margin-right: 10px;
		cursor: pointer;
		display: block;
		width: 30px;
	}
	
	.edit {
		float: right;
		font-size: 24px;
		color: #00d1b2;
		margin-right: 25px;
		cursor: pointer;
		display: block;
		width: 30px;
	}
	
	.btn_back {
		color: #00d1b2;
		cursor: pointer;
	}
</style>