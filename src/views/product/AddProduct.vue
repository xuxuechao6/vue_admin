<template>
	<div>
		<div class="ms-doc">
			<h3>新建产品</h3>
			<article>
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">

					<el-form-item label="产品名称" prop="Name">
						<el-input v-model="ruleForm.Name"></el-input>
					</el-form-item>
          <el-form-item label="产品类型" prop="Type">
            <el-select v-model="ruleForm.Type" placeholder="请选择产品类型">
              <el-option label="智能家居" value="0"></el-option>
              <el-option label="安防，监控" value="1"></el-option>
              <el-option label="影音娱乐" value="2"></el-option>
              <el-option label="交通设备" value="3"></el-option>
              <el-option label="可穿戴设备" value="4"></el-option>
              <el-option label="工业设备" value="5"></el-option>
              <el-option label="智慧医疗" value="6"></el-option>
              <el-option label="儿童玩具" value="7"></el-option>
              <el-option label="其它" value="8"></el-option>
            </el-select>
          </el-form-item>
					<el-form-item label="产品型号" prop="Model">
						<el-input v-model="ruleForm.Model"></el-input>
					</el-form-item>



					<el-form-item label="设备连接类型" prop="LinkType">
						<el-select v-model="ruleForm.LinkType" placeholder="请选择">
							<el-option label="Wi-Fi设备" value="0"></el-option>
							<el-option label="Zigbee网关" value="1"></el-option>
							<el-option label="蓝牙设备" value="2"></el-option>
							<el-option label="蓝牙Mesh设备" value="3"></el-option>
							<el-option label="PC设备" value="4"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="设备数" prop="DeviceQuota">
						<el-input v-model.number="ruleForm.DeviceQuota">100</el-input>
					</el-form-item>
					<el-form-item label="产品描述" prop="Description">
						<el-input type="textarea" v-model="ruleForm.Description"></el-input>
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
					return callback(new Error('设备数不能为空'));
				}
				setTimeout(() => {
					if(!Number.isInteger(value)) {
						callback(new Error('请输入整数'));
					} else {
						if(value < 1) {
							callback(new Error('设备数必须大于0'));
						} else {
							callback();
						}
					}
				}, 500);
			};
			return {
				ruleForm: {
					Name: "",
					Model: "",
					Type: "",
					Description: "",
					LinkType: "",
					DeviceQuota: "",
				},
				rules: {
					Name: [{
						required: true,
						message: '请输入产品名称',
						trigger: 'blur'
					}],
          Type:[{
            required: true,
            message: '请选择产品类型',
            trigger: 'change'
          }],
					Model: [{
						required: true,
						message: '请输入产品型号',
						trigger: 'blur'
					}],
					LinkType: [{
						required: true,
						message: '请选择设备连接类型',
						trigger: 'change'
					}],
					DeviceQuota: [{
            required: true,
						validator: checkNum,
						trigger: 'blur'
					}]
				},
				}
		},
		methods: {
			submitForm(formName) {
                let self = this,
                    productId = sessionStorage.getItem('productId'),
                    _url = "/products",
                    _method = "POST",
                    _body = {            //定义要传过去的参数
                        'LinkType': parseInt(self.ruleForm.LinkType),
                        'Name': self.ruleForm.Name,
                        'DeviceQuota': self.ruleForm.DeviceQuota,
                        'Model': self.ruleForm.Model,
                        'Type': self.ruleForm.Type,
                        'Description': self.ruleForm.Description,
                    },
                    body = JSON.stringify(_body),
                    sign1 = sessionStorage.getItem('login_TokenId') +_url + _method+body,
                    sign = this.md5(sign1) + "," + sessionStorage.getItem('login_Signature');
                //将对象转为字符串
                //签名的 定义过程

				//验证数据后 与后台交互
				self.$refs[formName].validate((valid) => {
					if(valid) {
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
				/*接口的传值是(200,获取信息成功),没有返回值说明没有成功*/
				if(res.status == 200) {
					this.$notify({
						title: 'GOOD',
						message: '新建产品成功',
						type: 'success'
					});
                    this.$router.push("/homepage");
          this.$router.go(0);
				} else {
					this.$message.error('新建产品失败');
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
						self.$message.error('该产品已存在，请添加新产品');
					} else {
						self.$message.error('添加新产品失败，请稍候再试');
						return false;
					}
				} else {
					//一些错误是在设置请求的时候触发
					console.log('Error', error.message);
					self.$message.error('网络错误，请稍候再试');
					return false;
				}

			},

			escForm(formName) {
				this.$refs[formName].resetFields();
				this.$router.push("/homePage")
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
