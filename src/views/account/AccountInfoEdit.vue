<template>
	<div>
		<div class="ms-doc">
			<h3>编辑账户信息</h3>
			<article>
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">

					<el-form-item label="用户昵称" prop="DisplayName">
						<el-input v-model="ruleForm.DisplayName"></el-input>
					</el-form-item>
					<el-form-item label="邮箱" prop="Mail">
						<el-input v-model="ruleForm.Mail"></el-input>
					</el-form-item>
					<el-form-item label="企业名称" prop="EnterpriseName">
						<el-input v-model="ruleForm.EnterpriseName"></el-input>
					</el-form-item>

                    <el-form-item label="企业类型" prop="IndustryType">
                        <el-select v-model="ruleForm.IndustryType"  placeholder="请选择企业所属行业类型">
                            <el-option label="网络 " value="0"></el-option>
                            <el-option label="软件" value="1"></el-option>
                            <el-option label="集成电路" value="2"></el-option>
                            <el-option label="其它" value="3"></el-option>
                        </el-select>
                    </el-form-item>

					<el-form-item>
						<el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
						<el-button @click="escForm('ruleForm')">取消</el-button>
					</el-form-item>
				</el-form>
			</article>
		</div>

	</div>
</template>

<script>
    import md5 from 'js-md5';
	export default {
		data() {

				return {
					ruleForm: {
						DisplayName: sessionStorage.getItem('DisplayName'),
						Mail:sessionStorage.getItem('Mail'),
                        EnterpriseName: sessionStorage.getItem('EnterpriseName'),
                        IndustryType: sessionStorage.getItem('IndustryType').toString() ,
					},
					rules: {
						DisplayName: [{
							required: true,
							message: '请输入昵称',
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
                        EnterpriseName: [{
                            required: true,
                            message: '请输入企业名称',
                            trigger: 'blur'
                        }],
                        IndustryType: [{
                            required: true,
                        }],


					},
					}
			},
			methods: {
                submitForm(formName) {
                    let self = this,
                        usersId = sessionStorage.getItem('login_UserId'),
                        _url = "/users/"+usersId,
                        _method = "PUT",
                        _body = {            //定义要传过去的参数
                          /*  'IndustryType': parseInt(self.ruleForm.IndustryType),
                            'EnterpriseName': self.ruleForm.EnterpriseName,*/
                            'Mail': self.ruleForm.Mail,
                            'DisplayName': self.ruleForm.DisplayName,
                        },
                        body = JSON.stringify(_body),
                        sign1 = sessionStorage.getItem('login_TokenId') +_url + _method+body,
                        sign = this.md5(sign1) + "," + sessionStorage.getItem('login_Signature');
                    //将对象转为字符串
                    //签名的 定义过程

                    //验证数据后 与后台交互
                    self.$refs[formName].validate((valid) => {
                        if(valid) {
                            console.log(0);
                            //发起HTTP请求   然后定义需要请求的参数
                            this.$http({
                                url: "/iotadmin"+_url, //请求的地址
                                method: _method, //请求的方式
                                headers: { //定义 请求的头部内容
                                    'content-type': 'application/json',
                                    'Rtt-Sign': sign //自定义的请求的头部内容（签名作用）
                                },
                                data: body, //传过去的参数
                            }).then((res) => { //请求成功后
                                console.log(11111);
                                console.log("res:" + res)
                                this.add_suc(res)

                            }).catch((error) => { //请求失败后
                                console.log("error:" + error)
                                this.add_err(error)
                            });
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                    /*this.$router.push('/register2');*/
                },
                //发送数据成功后
                add_suc(res) {
                    console.log(55555)
                    /*接口的传值是(200,获取信息成功),没有返回值说明没有成功*/
                    if(res.status == 200) {
                        this.$notify({
                            title: 'GOOD',
                            message: '修改个人信息成功',
                            type: 'success'
                        });
                        this.$router.push('/accountInfo');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }

                },
                //发送数据失败后
                add_err(error) {
                    var self = this;
                    if(error.response) {
                        console.log(error.response.data);
                        console.log(error.response.data.ErrCode);
                        //请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
                        if(error.response.data.ErrCode == 40000101) {
                            self.$message.error('网络错误，请稍候再试');
                        } else {
                            self.$message.error('网络错误，请稍候再试');
                            return false;
                        }
                    } else {
                        //一些错误是在设置请求的时候触发
                        console.log('Error', error.message);
                        self.$message.error('网络错误，请稍候再试');
                        return false;
                    }

                },

			/*	submitForm(formName) {
					this.$refs[formName].validate((valid) => {
						if(valid) {
							this.$notify({
								title: 'GOOD',
								message: '修改个人信息成功',
								type: 'success'
							});
							this.$router.push('/accountInfo');
						} else {
							console.log('error submit!!');
							return false;
						}
					});
				},*/
				escForm(formName) {
					/*this.$refs[formName].resetFields();*/
					this.$router.push('/accountInfo');
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
