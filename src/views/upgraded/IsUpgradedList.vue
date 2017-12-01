<template>
	<div>

		<div class="ms-doc">
			<h3 class="clearfix header">
				可升级设备列表
			</h3>

			<article>
				<el-form class="demo-ruleForm">
					<span v-if="!showList" style="color: #999">暂无数据</span>
					<el-table v-if="showList" :data="Results" border class="table" :default-sort="{prop: 'date', order: 'descending'}">
						<el-table-column prop="DeviceId" label="设备ID" width="180">
						</el-table-column>
						<el-table-column prop="Name" label="设备名称" width="95">
						</el-table-column>
						<el-table-column prop="SN" label="设备序列号(SN)" width="140">
						</el-table-column>
						<el-table-column prop="Mac" label="MAC地址" width="180">
						</el-table-column>
						<el-table-column prop="Description" label="备注" width="150">
						</el-table-column>
					</el-table>

					<el-form-item style="margin-top: 20px;text-align: center;">
						<el-button type="primary" @click="submitForm('form')">保存</el-button>
						<el-button @click="escForm('form')">取消</el-button>
					</el-form-item>
				</el-form>
			</article>
		</div>

	</div>
</template>

<script>
import { requestDeviceIdsList } from './../api/api';
export default {
	data: function () {
		return {
			showList: true,
			Results: [],
		}
	},
	watch: {
		'$route': 'listView'
	},
	mounted: function () {
		this.$nextTick(function () {
			this.listView();
		})
	},
	methods: {
		listView: function () {
			let ProductId = sessionStorage.getItem("productId"),
				_DeviceIds = JSON.parse(sessionStorage.getItem("AllowDevices"));
			console.log(_DeviceIds.length);
			console.log(_DeviceIds)
			var arr = new Array();

			for (var i in _DeviceIds) {
				arr.push(_DeviceIds[i].DeviceId);
			}
			console.log(3333)
			console.log(arr)
			var body = JSON.stringify({ "DeviceIds": arr })

			console.log(body)
			let deviceIdsListParams = {
				_url: "/devices/batch",
				_method: "POST",
				_body: body,
			};
			this.listLoading = true;
			requestDeviceIdsList(deviceIdsListParams).then((res) => {
				console.log(res.data)
				if (res.data.Results == null) {
					console.log(2222)
					this.showList = false
				} else {
					this.showList = true
					this.Results = res.data.Results;
					console.log(this.Results)
				}
				this.information = res.data;
			}).catch(function (error) {
				if (error.response) {
					console.log(error.response.data);
					console.log("222:" + error.response.status);
					console.log("333:" + error.response.header);
					//请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
					if (error.response.data.ErrCode = "40000004") {
						self.$message.error('网络错误，请稍后再试');
					} else {
						self.$message.error('网络错误，请稍后再试');
						return false
					}
				} else {
					console.log(error);
					//一些错误是在设置请求的时候触发
					console.log('Error', error.message);
					return false
				};
			});
		},
		submitForm(form) {
			this.$router.go(-1);
		},
		escForm(form) {
			this.$router.go(-1);
		}
	}
}
</script>

<style scoped>
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

.ms-doc article th {
	min-width: 120px;
	display: block;
	text-align: center !important;
}
</style>
