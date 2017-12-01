<template>
	<div>

		<div class="ms-doc">
			<h3 class="clearfix header">
				<span class="btn_back" @click="handleBack('back')">设备信息</span>/设备详情
				<i class="el-icon-delete delete" @click="handleDelete(item.DeviceId)"></i>
				<i class="el-icon-edit edit" @click= "handleEdit(item)"></i>
			</h3>
      <!-- 激活设备 -->
      <el-dialog title="激活设备" :visible.sync="activeDevice">
        <el-form :model="ruleForm3" :rules="rules" ref="ruleForm">
          <el-form-item label="设备序列号(SN)" >
            <el-input v-model="ruleForm3.SN" readonly></el-input>
          </el-form-item>
          <el-form-item label="设备名称" prop="Name">
            <el-input v-model="ruleForm3.Name" readonly></el-input>
          </el-form-item>
          <el-form-item label="MAC地址：" prop="Mac">
            <el-input v-model="ruleForm3.Mac" readonly></el-input>
          </el-form-item>
          <el-form-item label="描述：" prop="Description">
            <el-input type="textarea" v-model="ruleForm3.Description" readonly></el-input>
          </el-form-item>
          <el-form-item label="产品密钥(产品信息中查看)" prop="ProductKey">
            <el-input v-model="ruleForm3.ProductKey"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="activeDevice = false">取 消</el-button>
          <el-button type="primary" @click="submitForm3('ruleForm')">激活</el-button>
        </div>
      </el-dialog>

			<!-- 更新设备 -->
			<el-dialog title="更新设备信息" :visible.sync="updateDevice">
				<el-form :model="ruleForm2" :rules="rules" ref="ruleForm2">
          <el-form-item label="设备序列号(SN)" >
            <el-input v-model="ruleForm2.SN" readonly></el-input>
          </el-form-item>
					<el-form-item label="设备名称" prop="Name">
						<el-input v-model="ruleForm2.Name" ></el-input>
					</el-form-item>
					<el-form-item label="MAC地址：" prop="Mac">
						<el-input v-model="ruleForm2.Mac"></el-input>
					</el-form-item>
					<el-form-item label="描述：" prop="Description">
						<el-input type="textarea" v-model="ruleForm2.Description"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="updateDevice = false">取 消</el-button>
					<el-button type="primary" @click="submitForm2('ruleForm2')">确 定</el-button>
				</div>
			</el-dialog>

      <!-- shell -->
      <el-dialog class="shellCmd" :visible.sync="activeShell" size="full">
        <deviceShell :activeShell="activeShell"> </deviceShell>
      </el-dialog>

			<article v-if="listLoading">
				<el-row :gutter="20">
					<el-col :span="8" class="span_l">设备ID：</el-col>
					<el-col :span="16" class="span_r">{{item.DeviceId}}</el-col>
				</el-row>
                <el-row :gutter="20">
					<el-col :span="8" class="span_l">设备序列号(SN)：</el-col>
					<el-col :span="16" class="span_r">{{item.SN}}</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="8" class="span_l">设备名称：</el-col>
					<el-col :span="16" class="span_r">{{item.Name}}</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="8" class="span_l">MAC地址：</el-col>
					<el-col :span="16" class="span_r">{{item.Mac}}</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="8" class="span_l">状态：</el-col>
					<el-col :span="16" class="span_r">{{item.IsActive | formatIsActive(item.IsActive)}}</el-col>
				</el-row>
				<el-row :gutter="20" v-if="isActive">
					<el-col :span="8" class="span_l">激活时间：</el-col>
					<el-col :span="16" class="span_r">{{item.ActiveDate | formatDate(item.ActiveDate)  }}</el-col>
				</el-row>
				<el-row :gutter="20"  v-if="isActive">
					<el-col :span="8" class="span_l">是否在线：</el-col>
					<el-col :span="16" class="span_r">{{item.IsOnline | formatIsOnline(item.IsOnline) }}</el-col>
				</el-row>
				<el-row :gutter="20"  v-if="isActive">
					<el-col :span="8" class="span_l">最近登录时间：</el-col>
					<el-col :span="16" class="span_r">{{item.LastLogin | formatDate(item.LastLogin) }}</el-col>
				</el-row>
				<el-row :gutter="20"  v-if="isActive">
					<el-col :span="8" class="span_l">最近登陆IP：</el-col>
					<el-col :span="16" class="span_r">{{item.LastLoginIp}}</el-col>
				</el-row>
				<el-row :gutter="20"  v-if="isActive">
					<el-col :span="8" class="span_l">MCU型号：</el-col>
					<el-col :span="16" class="span_r">{{item.McuModel}}</el-col>
				</el-row>
				<el-row :gutter="20"  v-if="isActive">
					<el-col :span="8" class="span_l">MCU软件版本：</el-col>
					<el-col :span="16" class="span_r">{{item.McuVersion}}</el-col>
				</el-row>
				<el-row :gutter="20"  v-if="isActive">
					<el-col :span="8" class="span_l">固件型号：</el-col>
					<el-col :span="16" class="span_r">{{item.FirmwareModel}}</el-col>
				</el-row>
				<el-row :gutter="20"  v-if="isActive">
					<el-col :span="8" class="span_l">固件版本号：</el-col>
					<el-col :span="16" class="span_r">{{item.FirmwareVersion}}</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="8" class="span_l">创建时间：</el-col>
					<el-col :span="16" class="span_r">{{item.CreatedTime | formatDate(item.CreatedTime)  }}</el-col>
				</el-row>
				<el-row :gutter="20"  v-if="isActive">
					<el-col :span="8" class="span_l">更新时间：</el-col>
					<el-col :span="16" class="span_r">{{item.UpdatedTime | formatDate(item.UpdatedTime) }}</el-col>
				</el-row>
        <el-row :gutter="20"  v-if="isActive">
          <el-col :span="8" class="span_l">DeviceKey：</el-col>
          <span v-if="!deviceActive" :span="16" class="span_r deviceLog" @click="handleActive(item.DeviceId)">点击获取</span>
          <span v-if="deviceActive"  :span="16" class="span_r">{{DeviceKey}}</span>
        </el-row>

        <el-row :gutter="20"  v-if="isActive">
          <el-col :span="8" class="span_l">开启日志功能：</el-col>
          <span :span="16" class="span_r deviceLog" @click="handleOpenLog(item.DeviceId)">开启</span>
          <span :span="16" class="span_r deviceLog" @click="handleCloseLog(item.DeviceId)">关闭</span>
        </el-row>

                <el-row :gutter="20"  v-if="isActive">
					<el-col :span="8" class="span_l">查看设备日志：</el-col>
					<span :span="16" class="span_r deviceLog" @click="handleLog(item.DeviceId)">日志列表</span>
				</el-row>
                  <el-row :gutter="20"  v-if="isActive">
					<el-col :span="8" class="span_l">shell：</el-col>
					<span :span="16"  v-if="shellLink" class="span_r deviceLog" @click="handleShell(item.DeviceId)">连接</span>
                    <span :span="16"  v-if="!shellLink" class="span_r deviceLog" >已连接</span>
				</el-row>
        <el-row :gutter="20">
          <el-col :span="8" class="span_l">描述：</el-col>
          <el-col :span="16" class="span_r">{{item.Description}}</el-col>
        </el-row>
				<el-row :gutter="20" class="publish">
					<el-col :span="12" :offset="6">
						<el-button type="primary" @click="handleNew()">更新</el-button>
					</el-col>
				</el-row>
			</article>
		</div>

	</div>
</template>

<script>
  import deviceShell from './DeviceShell'
  import {formatDate} from './../format/data';
	export default {
    components: {
      deviceShell
    },
		data: function() {
			return {
        activeShell:false,
        deviceActive:false,
        activeDevice:false,
			  isActive:true,
        DeviceKey:'',
        shellUrl:'',
        shellLink:true,
			    item:{

          },
				ruleForm2: {
          SN:'',
					Name: '',
					Mac: '',
          Description: ''
				},
        ruleForm3: {
          SN:'',
          Name: '',
          Mac: '',
          Description: ''
        },
				rules: {
          SN: [{
            required: true,
            message: '请输入设备序列号',
            trigger: 'blur'
          }],
          ProductKey: [{
						required: true,
						message: '请输入产品秘钥',
						trigger: 'blur'
					}],
				},
				updateDevice: false,
                listLoading: false,
			}
		},
        mounted: function() {
            this.$nextTick(function() {
                this.detailView();
            })
        },
        filters:{
            formatLinkType(val,column){
                return val == "1" ? 'Wi-Fi设备' : val == "2" ? 'Zigbee网关' : val == "3" ? '蓝牙设备' : val == "4" ? '蓝牙Mesh设备' : val == "5" ? 'PC设备' : '未知';
            },
            formatLinkType(val,column){
                return val == "1" ? 'Wi-Fi设备' : val == "2" ? 'Zigbee网关' : val == "3" ? '蓝牙设备' : val == "4" ? '蓝牙Mesh设备' : val == "5" ? 'PC设备' : '未知';
            },
            formatIsActive(val,column){
                return val == 0 ? '未激活' : val == 1 ? '已激活'  : '未知';
            },
            formatIsOnline(val,column){
                return val == 0 ? '不在线' : val == 1 ? '在线'  : '未知';
            },
            formatTime(val){
              if(val==undefined||val==""){
                return "无"
              }else {
                return  val+'  小时';
              }

            },
          formatDate(val) {
            if(val==undefined||val==""){
              return "无"
            }else {
              let date = new Date(val*1000);
              return formatDate(date, "yyyy-MM-dd hh:mm");
            }

          },
        },
		methods: {
            detailView: function() {
                let self = this,
                    productId = sessionStorage.getItem('productId'),
                    deviceId = sessionStorage.getItem('deviceId'),
                    _url = "/products/" + productId+"/devices/" + deviceId,
                    _method = "GET",
                    sign1 = sessionStorage.getItem('login_TokenId') +_url + _method ,
                    sign = this.md5(sign1) + "," + sessionStorage.getItem('login_Signature');
                //将对象转为字符串
                //签名的 定义过程
                this.$http({
                    url: "/iotadmin" + _url,
                    method: _method,
                    headers: {
                        'content-type': 'application/json',
                        'Rtt-Sign': sign
                    },
                }).then((res) => {
                    console.log(res.data)
                    if(res.data == null) {
                        self.$message.error('网络错误，请稍后再试');
                    } else {
                        this.listLoading=true,
                        this.item = res.data;
                        console.log(typeof (res.data),"type")
                      const json1=res.data;
                        const string1= json1.toString();
                        console.log(typeof (string1),"type2");
                        console.log(string1);
                    }
                }).catch(function(error) {
                    if(error.response) {
                        console.log(error.response.data);
                        console.log("222:" + error.response.status);
                        console.log("333:" + error.response.header);
                        //请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
                        if(error.response.data.ErrCode = "40000004") {
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

			handleBack(back) {
				this.$router.go(-1);
			},
			handleNew() {
                this.listLoading=false,
                this.detailView();
			},

            handleDelete(val) {
                this.$confirm('此操作将永久删除该产品信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let self = this,
                        productId = sessionStorage.getItem('productId'),
                        _url = "/products/" + productId+"/devices/" + val,
                        _method = "DELETE",
                        sign1 = sessionStorage.getItem('login_TokenId') + _url + _method,
                        sign = this.md5(sign1) + "," + sessionStorage.getItem('login_Signature');
                    console.log(sign1)
                    console.log(sign)
                    this.$http({
                        url: "/iotadmin" + _url,
                        method: _method,
                        headers: {
                            'content-type': 'application/json',
                            'Rtt-Sign': sign
                        },
                    }).then((res) => {
                        console.log(res.data)
                        if(res.data == "") {
                            this.$message({
                                    type: 'success',
                                    message: '删除成功!',
                                },
                                this.$router.push('/deviceList'));
                          let newId = sessionStorage.getItem('productId'),
                            newName = sessionStorage.getItem('productName');
                          this.$router.push({
                            name: 'deviceList',
                            params: {
                              productId: newId,
                              productName: newName
                            }
                          })
                        } else {
                            this.$message({
                                type: 'info',
                                message: '删除失败'
                            });
                        }
                        this.information = res.data;
                    }).catch(function(error) {
                        if(error.response) {
                            console.log(error.response.data);
                            console.log("222:" + error.response.status);
                            console.log("333:" + error.response.header);
                            //请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
                            if(error.response.data.ErrCode = "40000004") {
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

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            handleEdit(val){
                console.log(val)
                let self =this;
                self.ruleForm2={
                  SN: val.SN,
                    Name: val.Name,
                    Mac: val.Mac,
                  Description: val.Description,
                };
              sessionStorage.setItem('DeviceId',val.DeviceId)
                self.updateDevice=true;

            },
      handleActive(val) {
        let self =this;
        self.ruleForm3 = {
          SN: self.item.SN,
          Name: self.item.Name,
          Mac: self.item.Mac,
          DeviceId: self.item.DeviceId
        };
        self.activeDevice = true;
      },

      submitForm3(formName){
        let self = this,
          productId = sessionStorage.getItem('productId'),
          _url = "/devices/active",
          _method = "POST",
          _body = {            //定义要传过去的参数
            'SN': self.ruleForm3.SN,
            'ProductId': productId,
            'Sign': this.md5(self.ruleForm3.ProductKey+self.ruleForm3.SN),
          },
          body = JSON.stringify(_body);
        //发起HTTP请求   然后定义需要请求的参数
        this.$http({
          url: "/iotadmin" + _url, //请求的地址
          method: _method, //请求的方式
          data: body, //传过去的参数
        }, body).then((res) => { //请求成功后
          console.log(res)
          this.$notify({
            title: 'GOOD',
            message: '获取成功',
            type: 'success'
          });
          console.log(res.data.DeviceKey)
          self.DeviceKey=res.data.DeviceKey
          this.$refs['ruleForm'].resetFields();
          self.activeDevice = false;
          self.deviceActive = true;
        }).catch((error) => { //请求失败后
          console.log("error:" + error)
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.data.ErrCode);
            //请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
            if (error.response.data.ErrCode == 40000101) {
              self.$message.error('激活设备失败，请稍候再试');
            } else {
              self.$message.error('激活设备失败，请稍候再试');
              return false;
            }
          } else {
            //一些错误是在设置请求的时候触发
            console.log('Error', error.message);
            self.$message.error('网络错误，请稍候再试');
            return false;
          }
        });
      },

            submitForm2(formName) {
                let self = this,
                    productId = sessionStorage.getItem('productId'),
                    DeviceId = sessionStorage.getItem('DeviceId'),
                    _url = "/products/"+productId+"/devices/"+DeviceId,
                    _method = "PUT",
                    _body = {            //定义要传过去的参数
                        'Name': self.ruleForm2.Name,
                        'Mac': self.ruleForm2.Mac,
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
                            console.log("res:" + res)
                            this.add_suc2(res)

                        }).catch((error) => { //请求失败后
                            console.log("error:" + error)
                            this.add_err2(error)
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
                /*this.$router.push('/register2');*/
            },

            //发送数据成功后
            add_suc2(res) {
                console.log(55555)
                /*接口的传值是(200,获取信息成功),没有返回值说明没有成功*/
                if(res.status == 200) {
                    this.$notify({
                        title: 'GOOD',
                        message: '更新设备信息成功',
                        type: 'success'
                    });
                    let newId = sessionStorage.getItem('productId');
                    console.log('newId:' + newId);
                    this.$refs['ruleForm2'].resetFields();
                    this.updateDevice=false,
                    this.listLoading=false,
                        this.detailView();
                } else {
                    this.$message.error('更新设备信息失败');
                }

            },
            //发送数据失败后
            add_err2(error) {
                var self = this;
                if(error.response) {
                    console.log(error.response.data);
                    console.log(error.response.data.ErrCode);
                    //请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
                    if(error.response.data.ErrCode == 40000101) {
                        self.$message.error('更新数据失败，请稍候再试');
                    } else {
                        self.$message.error('更新数据失败，请稍候再试');
                        return false;
                    }
                } else {
                    //一些错误是在设置请求的时候触发
                    console.log('Error', error.message);
                    self.$message.error('网络错误，请稍候再试');
                    return false;
                }

            },
            handleLog(val){
             sessionStorage.setItem("DeviceId",val);
             this.$router.push("/deviceLog")
        },
      handleOpenLog(val){
console.log(val)
        let self = this,
          productId = sessionStorage.getItem('productId'),
          _url = "/logs/" + val+"/open",
          _method = "POST",
          sign1 = sessionStorage.getItem('login_TokenId') + _url + _method,
          sign = this.md5(sign1) + "," + sessionStorage.getItem('login_Signature');
        console.log(sign1)
        console.log(sign)
        this.$http({
          url: "/iotadmin" + _url,
          method: _method,
          headers: {
            'content-type': 'application/json',
            'Rtt-Sign': sign
          },
        }).then((res) => {
          console.log(res.data)
          if(res.data == "") {
            this.$message({
                type: 'success',
                message: '日志功能开启成功!',
              })

          } else {
            this.$message({
              type: 'info',
              message: '日志功能开启失败'
            });
          }
        }).catch(function(error) {
          if(error.response) {
            console.log(error.response.data);
            console.log("222:" + error.response.data);
            console.log("333:" + error.response.data.ErrCode);
            //请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
            if(error.response.data.ErrCode = "40000202") {
              self.$message.error('设备不在线，请开启设备');
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
      handleCloseLog(val){
        console.log(val)
        let self = this,
          productId = sessionStorage.getItem('productId'),
          _url = "/logs/" + val+"/close",
          _method = "POST",
          sign1 = sessionStorage.getItem('login_TokenId') + _url + _method,
          sign = this.md5(sign1) + "," + sessionStorage.getItem('login_Signature');
        console.log(sign1)
        console.log(sign)
        this.$http({
          url: "/iotadmin" + _url,
          method: _method,
          headers: {
            'content-type': 'application/json',
            'Rtt-Sign': sign
          },
        }).then((res) => {
          console.log(res.data)
          if(res.data == "") {
            this.$message({
              type: 'success',
              message: '日志功能关闭成功!',
            })

          } else {
            this.$message({
              type: 'info',
              message: '日志功能关闭失败'
            });
          }
        }).catch(function(error) {
          if(error.response) {
            console.log(error.response.data);
            console.log("222:" + error.response.data);
            console.log("333:" + error.response.data.ErrCode);
            //请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
            if(error.response.data.ErrCode = "40000202") {
              self.$message.error('设备不在线，请开启设备');
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
        handleShell(val){
//          this.activeShell=true
          console.log(val)
          let self = this,
            _url = "/shell/" + val+"/open",
            _method = "POST",
            sign1 = sessionStorage.getItem('login_TokenId') + _url + _method,
            sign = this.md5(sign1) + "," + sessionStorage.getItem('login_Signature');
          console.log(sign1)
          console.log(sign)
          this.$http({
            url: "/iotadmin" + _url,
            method: _method,
            headers: {
              'content-type': 'application/json',
              'Rtt-Sign': sign
            },
          }).then((res) => {
            if(res.data != "") {
              console.log(res.data)
              sessionStorage.setItem('shellUrl',res.data.URL)
              this.shellUrl=res.data.URL;
              this.activeShell=true
            } else {
              this.$message({
                type: 'info',
                message: '开启失败，请稍后再试'
              });
            }
          }).catch(function(error) {
            if(error.response) {
              console.log(error.response.data);
              console.log("222:" + error.response.data);
              console.log("333:" + error.response.data.ErrCode);
              //请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
              if(error.response.data.ErrCode = "40000202") {
                self.$message.error('设备不在线，请开启设备');
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


        }
    }

</script>

<style>
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
    .deviceLog{
        color: #00d1b2;
        cursor: pointer;
    }
    .shellCmd  .el-dialog,
  .shellCmd .el-dialog__header,
  .shellCmd .el-dialog__body{
background: #000;
  }
</style>
