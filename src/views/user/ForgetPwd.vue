<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="LoginName">
                    <el-input v-model="ruleForm.LoginName" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <!--<span class="newPhone" @click="handleNewPhone('newPhone')">已换号？</span>-->
                 <el-form-item prop="SMSCode">
					<el-input v-model="ruleForm.SMSCode" placeholder="请输入验证码"></el-input>
					<phone-code class="code" v-bind:class="{'active':start,'no_active':!start}" :start='start' @countDown='start=false' @click.native='sendCode'></phone-code>
				</el-form-item>
                <el-form-item prop="Password">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.Password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                 <el-form-item prop="Password2">
                    <el-input type="password" placeholder="请再次输入密码" v-model="ruleForm.Password2" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="revise-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">立即修改</el-button>
                </div>
                <p class="register">记得密码？<span @click="handleLogin('login')">立即登录</span></p>
                </el-form>

        </div>
    </div>
</template>

<script>

	import phoneCode from './sendCode.vue'
    import {forgetPwd} from '../api/api';
    import {requestCode} from '../api/api';
    export default {
    	components: {
			phoneCode
		},
        data: function(){
            var PhonePatrn = /^1[3|4|5|7|8][0-9]{9}$/;
            var PwdPatrn = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)/;

			var validatePhone = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入手机号'));
				} else if(!PhonePatrn.exec(value)) {
					callback(new Error('请输入正确的手机号'));
				} else {
					callback();
				}
			}

			var validatePwd = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入密码'));
				} else if(!PwdPatrn.exec(value)) {
					callback(new Error('密码必须包含数字、字母和特殊字符两种以上'));
				} else {
					if(this.ruleForm.Password2 !== '') {
						this.$refs.ruleForm.validateField('Password2');
					}
					callback();
				}
			};
			var validatePwd2 = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请再次输入密码'));
				} else if(value !== this.ruleForm.Password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			}
            return {
            	start: false,
                ruleForm: {
                    LoginName: '',
					SMSCode: '',
					Password: '',
					Password2: '',
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
                }
            }
        },
        methods: {
             sendCode(value) {
				//前面发送ajax请求成功之后调用this.start = true开始短信倒计时

				const self = this;
				if(self.ruleForm.LoginName == "") {
					this.$message({
						message: '请先输入手机号',
						type: 'warning'
					});
				} else {
					this.start = true;
					if(self.ruleForm.LoginName != "") {
                        let codeParams = {
                            body:{
                                'LoginName': self.ruleForm.LoginName,
                                'OpType': 1
                            },
                            _method:"POST"
                        };
                        requestCode(codeParams).then((res) => {
							console.log("res:" + res)
								/*接口的传值是(200,获取信息成功),没有返回值说明没有成功*/
							if(res.status == 200) {
								this.$message({
									message: '短息已发送成功，请注意查收',
									type: 'success'
								});
							} else {
								this.$message.error('获取短信失败');
							}
						}).catch(function(error) {
							if(error.response) {
								//请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
								if(error.response.data.ErrMsg = "SMSCode error"){
									  self.$message.error('获取短信失败');
								}else if(error.response.data.ErrMsg = "SMSCode error"){
									  self.$message.error('获取短信失败');
								}
							} else {
                                self.$message.error('获取短信失败');
							}
						});
					} else {
                        self.$message.error('获取短信失败');
						return false;
					}
					/*self.$router.push('/homePage');*/

				};

			},

			submitForm(formName) {
				const self = this;
				self.$refs[formName].validate((valid) => {
					if(valid) {
                        let pwdParams = {
                            SMSCode:self.ruleForm.SMSCode,
                            body:{
                                "LoginName": self.ruleForm.LoginName,
                                "OpType": 1,
                                "OpArgs": '{\"newPassword\":\"'+ this.md5(self.ruleForm.Password) + '\"}',
                            },
                            _method:"POST"
                        };
                        forgetPwd(pwdParams).then((res) => {
							console.log("res:" + res)
								/*接口的传值是(200,获取信息成功),没有返回值说明没有成功*/
							if(res.status == 200) {
								this.$message({
									message: '密码修改成功，请登录',
									type: 'success'
								});
								this.$router.push('/login');
							} else {
								this.$message.error('密码修改失败');
							}

						}).catch(function(error) {
							if(error.response) {
								//请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
								if(error.response.data.ErrCode = "40000011"){
									  self.$message.error('验证码输入错误，请重新输入');
								}else{
									this.$message.error('密码修改失败');
								}
							} else {
								//一些错误是在设置请求的时候触发
								console.log('Error', error.message);
								this.$message.error('密码修改失败');
								return false;
							}
						});
					} else {
						console.log(error.config);
						return false;
					}
				});
				/*this.$router.push('/register2');*/
			},
             handleLogin(login) {
                    this.$router.push('/login');
            },

        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:270px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .revise-btn{
        text-align: center;
    }
    .revise-btn button{
        width:100%;
        height:36px;
    }
    .code{
    	font-size:12px;
    	line-height:36px;
    	color:#00d1b2;
    	text-align: right;
    	cursor: pointer;
    	display: block;
    	width: 70;
    	position: absolute;
    	right: 8px;
    	top: 0;
    }
    .register{
    	font-size:12px;
    	line-height:40px;
    	color:#999;
    	text-align: right;
    }
    .register span{
    	color:#00d1b2;
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
