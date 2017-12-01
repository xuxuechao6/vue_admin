<template>
	<div>
		<div class="ms-doc">
			<h3>新建OTA版本</h3>
			<article>
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">

					<el-form-item label="选择固件" prop="name">
						<el-select v-model="value5" multiple placeholder="请选择">
							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="升级模式" prop="type">
						<el-select v-model="ruleForm.type" placeholder="请选择">
							<el-option label="可选升级" value="kexuan"></el-option>
							<el-option label="强制升级" value="qiangzhi"></el-option>
							<el-option label="静默升级" value="jingmo"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="升级时间" prop="model">
						<div class="block">

							<el-date-picker v-model="value3" type="datetimerange" placeholder="选择时间范围">
							</el-date-picker>
						</div>
					</el-form-item>
					<el-form-item label="升级顺序编号：" prop="num">
						<el-input v-model.number="ruleForm.num">100</el-input>
					</el-form-item>

					<el-form-item label="可升级设备列表：">
						<el-button type="text" @click="handleDetail('detail')">查看列表</el-button>
					</el-form-item>
					<el-form-item label="备注" prop="desc">
						<el-input type="textarea" v-model="ruleForm.desc"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
						<el-button @click="escForm('ruleForm')">取消</el-button>
					</el-form-item>
				</el-form>
			</article>
		</div>

	</div>
</template>

<script>
	export default {
		data() {
				var checkNum = (rule, value, callback) => {
					if(!value) {
						return callback(new Error('请输入升级编号'));
					}
					setTimeout(() => {
						if(!Number.isInteger(value)) {
							callback(new Error('请输入整数'));
						} else {
							if(value < 1) {
								callback(new Error('编号必须大于0'));
							} else {
								callback();
							}
						}
					}, 500);
				};
				return {
					options: [{
						value: '选项1',
						label: '黄金糕'
					}, {
						value: '选项2',
						label: '双皮奶'
					}, {
						value: '选项3',
						label: '蚵仔煎'
					}, {
						value: '选项4',
						label: '龙须面'
					}, {
						value: '选项5',
						label: '北京烤鸭'
					}],
					value5: [],
					ruleForm: {
						name: '',
						type: '',
						model: '',
						connect: '',
						num: '',
						desc:''
					},
					value3: [],
					rules: {
						type: [{
							required: true,
							message: '请选择升级模式',
							trigger: 'change'
						}],
						num: [{
							validator: checkNum,
							trigger: 'blur'
						}]
					}
				};
			},
			methods: {
				submitForm(formName) {
					this.$refs[formName].validate((valid) => {
						if(valid) {
							this.$notify({
								title: 'GOOD',
								message: '新建OTA版本成功',
								type: 'success'
							});
							this.$router.push('/upgradedList.vue');
						} else {
							console.log('error submit!!');
							return false;
						}
					});
				},
				escForm(formName) {
					this.$refs[formName].resetFields();
				},
				handleDetail(detail){
					this.$router.push('/isUpgradedList');
				}
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
		line-height: 17px;
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
	
	.ms-doc article .el-input {
		width: 300px;
	}
</style>