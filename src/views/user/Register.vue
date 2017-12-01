<template>
	<div class="login-wrap">
		<div class="ms-title">后台管理系统</div>
		<div class="ms-login">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
				<el-form-item prop="LoginName">
					<el-input v-model="ruleForm.LoginName" placeholder="请输入手机号" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item prop="SMSCode">
					<el-input v-model="ruleForm.SMSCode" placeholder="请输入验证码"></el-input>
					<phone-code class="code" v-bind:class="{'active':start,'no_active':!start}" :start='start' @countDown='start=false' @click.native='sendCode'></phone-code>
				</el-form-item>
				<el-form-item prop="Password">
					<el-input type="password" placeholder="请输入密码" v-model="ruleForm.Password"></el-input>
				</el-form-item>
				<el-form-item prop="Password2">
					<el-input type="password" placeholder="请再次输入密码" v-model="ruleForm.Password2" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item prop="Mail">
					<el-input type="email" placeholder="请输入常用邮箱" v-model="ruleForm.Mail" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item prop="DisplayName">
					<el-input type="pickName" placeholder="请输入用户显示名称" v-model="ruleForm.DisplayName"></el-input>
				</el-form-item>
				<el-form-item prop="EnterpriseName">
					<el-input type="company" placeholder="请输入企业名称" v-model="ruleForm.EnterpriseName"></el-input>
				</el-form-item>
				<el-form-item prop="IndustryType">
					<el-select v-model="ruleForm.IndustryType" style="width: 100%" placeholder="请选择企业所属行业类型">
						<el-option label="网络 " value="0"></el-option>
						<el-option label="软件" value="1"></el-option>
						<el-option label="集成电路" value="2"></el-option>
						<el-option label="其它" value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-button class="register_btn" type="primary" @click="submitForm('ruleForm')">注册</el-button>
	
				<p class="login">已有帐号？
					<span @click="handleLogin('login')">立即登录</span>
				</p>
			</el-form>
		</div>
	</div>
</template>

<script>
import { requestRegister, requestCode } from '../api/api';
import { PhonePatrn, PwdPatrn } from '../format/validate';
import phoneCode from './sendCode.vue'
export default {
	components: {
		phoneCode
	},
	data: function () {

		const validatePhone = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入手机号'));
			} else if (!PhonePatrn(value)) {
				callback(new Error('请输入正确的手机号'));
			} else {
				const self = this;
				let _url = "/iotadmin/users/loginName/" + value,
					_method = "POST";
				this.$http({
					url: _url,
					method: _method,
				}).then((res) => {
					if (res.status == 200) {
						callback(new Error('您的账号已存在，请直接登录'));
					} elss
					{
						callback(new Error('未知错误'));
					}
				}).catch(function (error) {
					if (error.response.data.ErrCode == 40000015) {
						callback();
					} else {
						callback(new Error('未知错误'));
					}

				});
			}
		};

		var validatePwd = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入密码'));
			} else if (!PwdPatrn(value)) {
				callback(new Error('密码必须包含数字、字母和特殊字符两种以上'));
			} else {
				if (this.ruleForm.Password2 !== '') {
					this.$refs.ruleForm.validateField('Password2');
				}
				callback();
			}
		};
		var validatePwd2 = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请再次输入密码'));
			} else if (value !== this.ruleForm.Password) {
				callback(new Error('两次输入密码不一致!'));
			} else {
				callback();
			}
		}
		return {
			start: false,
			//验证注册时所需要填写的内容
			ruleForm: {
				LoginName: '',
				SMSCode: '',
				Password: '',
				Password2: '',
				Mail: '',
				DisplayName: '',
				EnterpriseName: '',
				IndustryType: '',
			},
			rules: {
				LoginName: [{
					validator: validatePhone,
					trigger: 'blur'
				}],

				SMSCode: [{
					required: true,
					message: '请输入验证码',
					trigger: 'blur'
				}, {
					min: 6,
					max: 6,
					message: '请输入正确的验证码',
					trigger: 'blur'
				}],
				Password: [{
					validator: validatePwd,
					trigger: 'blur'
				}, {
					min: 8,
					max: 16,
					message: '密码长度在 8 到 16 个字符',
					trigger: 'blur'
				}],
				Password2: [{
					validator: validatePwd2,
					trigger: 'blur'
				}],
				Mail: [{
					required: true,
					message: '请输入邮箱地址',
					trigger: 'blur'
				}, {
					type: 'email',
					message: '请输入正确的邮箱地址',
					trigger: 'blur'
				}],
				DisplayName: [{
					required: true,
					message: '请输入用户显示名称',
					trigger: 'blur'
				}],
				EnterpriseName: [{
					required: true,
					message: '请输入企业名称',
					trigger: 'blur'
				}],
				IndustryType: [{
					required: true,
					message: '请选择企业所属类型',
					trigger: 'change'
				}],
			},
		}
	},

	methods: {
		sendCode(value) {
			//前面发送ajax请求成功之后调用this.start = true开始短信倒计时

			const self = this;
			if (self.ruleForm.LoginName == "") {
				this.$message({
					message: '请先输入手机号',
					type: 'warning'
				});
			} else {
				this.start = true;
				if (self.ruleForm.LoginName != "") {
					let codeParams = {
						body: {
							'LoginName': self.ruleForm.LoginName,
							'OpType': 0
						},
						_method: "POST"
					};
					requestCode(codeParams).then((res) => {
						console.log("res:" + res)
						/*接口的传值是(200,获取信息成功),没有返回值说明没有成功*/
						if (res.status == 200) {
							this.$message({
								message: '短息已发送成功，请注意查收',
								type: 'success'
							});
						} else {
							this.$message.error('获取短信失败');
						}
					}).catch(function (error) {
						if (error.response) {
							//请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
							if (error.response.data.ErrCode = "40000004") {
								self.$message.error('网络错误，请稍后再试');
							} else {
								self.$message.error('网络错误，请稍后再试');
							}
						} else {
							//一些错误是在设置请求的时候触发
							console.log('Error', error.message);
							self.$message.error('网络错误，请稍后再试');
						}
						console.log(error.config);
						self.$message.error('网络错误，请稍后再试');
					});
				} else {
					console.log('error submit!!');
					self.$message.error('网络错误，请稍后再试');
					return false;
				}
				/*self.$router.push('/homePage');*/

			};
		},
		submitForm(formName) {
			const self = this;
			var url = '/iotadmin/users';
			self.$refs[formName].validate((valid) => {
				if (valid) {
					let RegisterParams = {
						body: {
							'LoginName': self.ruleForm.LoginName,
							'SMSCode': self.ruleForm.SMSCode,
							'Password': this.md5(self.ruleForm.Password),
							'Mail': self.ruleForm.Mail,
							'DisplayName': self.ruleForm.DisplayName,
							'EnterpriseName': self.ruleForm.EnterpriseName,
							'IndustryType': parseInt(self.ruleForm.IndustryType),
						},
						_method: "POST"
					};
					requestRegister(RegisterParams).then((res) => {

						console.log("res:" + res)
						/*接口的传值是(200,获取信息成功),没有返回值说明没有成功*/
						if (res.status == 200) {
							this.$message({
								message: '恭喜你 注册成功，请登录',
								type: 'success'
							});
							this.$router.push('/login');
						} else {
							this.$message.error('注册失败');
						}

					}).catch(function (error) {
						if (error.response) {
							if (error.response.data.ErrCode == 40000004) {
								self.$message.error('该手机号已注册，请直接登录');
								return false;
							} else if (error.response.data.ErrCode == 40000011) {
								self.$message.error('验证码错误，请输入正确的验证码');
								return false;
							} else {
								self.$message.error('注册失败');
								return false;
							}
						} else {
							self.$message.error('注册失败');
							return false;
						}
					});
				} else {
					self.$message.error('注册失败');
					return false;
				}
			});
			/*this.$router.push('/register2');*/
		},
		handleLogin(login) {
			this.$router.push('/login');
		}
	}

}
</script>

<style scoped>
.login-wrap {
	position: relative;
	width: 100%;
	height: 100%;
}

.ms-title {
	position: absolute;
	top: 50%;
	width: 100%;
	margin-top: -333px;
	text-align: center;
	font-size: 30px;
	color: #fff;
}

.ms-login {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 300px;
	height: 515px;
	margin: -280px 0 0 -190px;
	padding: 40px;
	border-radius: 5px;
	background: #fff;
}

.register-btn {
	text-align: center;
}

.register_btn {
	width: 100%;
	height: 36px;
}

.login {
	font-size: 12px;
	line-height: 40px;
	color: #999;
	text-align: right;
}

.login span {
	color: #00d1b2;
	cursor: pointer;
}

.code {
	position: absolute;
	right: 10px;
	top: 0;
	color: #00d1b2;
	display: block;
	width: 85px;
	height: 35px;
	cursor: pointer;
	text-align: right;
}

.code.active {
	color: #999;
	cursor: default;
}
</style>
