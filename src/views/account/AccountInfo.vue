<template>
  <div>

    <div class="ms-doc">
      <h3 class="clearfix header">
        账户信息
        <i class="el-icon-edit edit" @click="handleEdit('accountInfo')"></i>
      </h3>
      <article>
        <el-row style="margin-bottom: 20px;">
          <el-col :span="24">
            <span class="displayName">{{item.DisplayName}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><span class="span_line"><span>角色：</span>管理员</span>
          </el-col>
          <el-col :span="12">
						<span class="span_line">
						<span>密码：</span>
						<el-button type="text" class="updatePwd" @click="handleUpdatePwd = true">修改密码</el-button>
						</span>
          </el-col>
        </el-row>

        <!-- 新建设备 -->
        <el-dialog title="修改密码" :visible.sync="handleUpdatePwd">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item label="旧密码" prop="oldPwd">
              <el-input type="password" v-model="ruleForm.oldPwd"></el-input>
            </el-form-item>
            <el-form-item label="新密码：" prop="Password">
              <el-input type="password" v-model="ruleForm.Password"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码：" prop="Password2">
              <el-input type="password" v-model="ruleForm.Password2"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleUpdatePwd = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
          </div>
        </el-dialog>

        <el-row>
          <el-col :span="12"><span class="span_line"><span>手机号：</span>{{item.LoginName}}</span>
          </el-col>
          <el-col :span="12"><span class="span_line"><span>邮箱：</span>{{item.Mail}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><span class="span_line"><span>企业名称：</span>{{item.EnterpriseName}}</span>
          </el-col>
          <el-col :span="12"><span class="span_line"><span>企业类型：</span>{{item.IndustryType | formatType(item.IndustryType)}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><span class="span_line"><span>创建时间：</span>{{item.CreateTime | formatDate(item.CreateTime)}}</span>
          </el-col>
        </el-row>
      </article>
    </div>

  </div>
</template>

<script>
  import {requestUserInfo} from '../api/api';
import { PwdPatrn } from '../format/validate';
  import { formatDate } from './../format/data';

  export default {
    data: function () {

      let validatePwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!PwdPatrn(value)) {
          callback(new Error('密码必须包含数字、字母和特殊字符两种以上'));
        } else if (value == this.ruleForm.oldPwd) {
          callback(new Error('新密码不能跟旧密码相同'));
        } else {
          if (this.ruleForm.Password2 !== '') {
            this.$refs.ruleForm.validateField('Password2');
          }
          callback();
        }
      };
      let validatePwd2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.Password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        item: {},
        ruleForm: {
          oldPwd: '',
          Password: '',
          Password2: ''
        },
        rules: {
          oldPwd: [{
            required: true,
            message: '请输入旧密码',
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


        },
        handleUpdatePwd: false,
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.detailView();
      })
    },

    methods: {
      detailView: function () {
        let UserId = sessionStorage.getItem('login_UserId'),
          _url = "/users/" + UserId,
          _method = "GET",
          body = "",
          sign1 = sessionStorage.getItem('login_TokenId') + _url + _method + body,
          sign = this.md5(sign1) + "," + sessionStorage.getItem('login_Signature');
        this.$http({
          url: "/iotadmin" + _url,
          method: _method,
          headers: {
            'content-type': 'application/json',
            'Rtt-Sign': sign
          },
        }).then((res) => {
          console.log(res.data)
          if (res.data == null) {
            console.log(2222)
            self.$message.error('网络错误，请稍后再试');
          } else {
            this.item = res.data;
            sessionStorage.setItem('DisplayName', res.data.DisplayName),
              sessionStorage.setItem('EnterpriseName', res.data.EnterpriseName),
              sessionStorage.setItem('Mail', res.data.Mail),
              sessionStorage.setItem('IndustryType', res.data.IndustryType),

              console.log(this.item)
          }
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
          }
          ;
        });
      },
      submitForm(formName) {
        let self = this,
          usersId = sessionStorage.getItem('login_UserId'),
          _url = "/users/" + usersId + "/updatePassword",
          _method = "PUT",
          _body = {            //定义要传过去的参数
            'OldPassword': this.md5(self.ruleForm.oldPwd),
            'NewPassword': this.md5(self.ruleForm.Password),
          },
          body = JSON.stringify(_body),
          sign1 = sessionStorage.getItem('login_TokenId') + _url + _method + body,
          sign = this.md5(sign1) + "," + sessionStorage.getItem('login_Signature');
        //将对象转为字符串
        //签名的 定义过程

        //验证数据后 与后台交互
        self.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(0);
            //发起HTTP请求   然后定义需要请求的参数
            this.$http({
              url: "/iotadmin" + _url, //请求的地址
              method: _method, //请求的方式
              headers: { //定义 请求的头部内容
                'content-type': 'application/json',
                'Rtt-Sign': sign //自定义的请求的头部内容（签名作用）
              },
              data: body, //传过去的参数
            }, body).then((res) => { //请求成功后
              console.log(11111);
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
        if (res.status == 200) {
          this.$notify({
            title: 'GOOD',
            message: '密码修改成功',
            type: 'success'
          }, 500);
          let newId = sessionStorage.getItem('productId');
          console.log('newId:' + newId)
          /*this.$router.push({
              path: '/deviceList/:productId',
              name: 'deviceList',
              params: {
                  productId: newId
              }
          })*/
          this.$refs['ruleForm'].resetFields();
          this.handleUpdatePwd = false,
            this.detailView();
        } else {
          this.$message.error('网络错误，密码修改失败');
          this.$refs['ruleForm'].resetFields();
          this.handleUpdatePwd = false,
            this.detailView();
        }

      },
      //发送数据失败后
      add_err2(error) {
        var self = this;
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.data.ErrCode);
          //请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
          if (error.response.data.ErrCode == 40000013) {
            self.$message.error('请输入正确的密码');
          } else {
            self.$message.error('密码修改失败，请稍候再试');
            this.$refs['ruleForm'].resetFields();
            this.handleUpdatePwd = false,
              this.detailView();
            return false;
          }
        } else {
          //一些错误是在设置请求的时候触发
          console.log('Error', error.message);
          self.$message.error('网络错误，请稍候再试');
          this.$refs['ruleForm'].resetFields();
          this.handleUpdatePwd = false,
            this.detailView();
          return false;
        }

      },

      handleEdit() {
        this.$router.push('/accountInfoEdit');
      }
    },
     filters: {
          formatDate(val) {

            if (val == undefined || val == "") {
                return "无"
            } else {
                let date = new Date(val * 1000);
                return formatDate(date, "yyyy-MM-dd hh:mm");
            }

        },
        formatType(val){
          if (val == undefined) {
                return "无"
            } else {
                  return val == "0" ? '网络' : val == "1" ? '软件' : val == "2" ? '集成电路' : '其它';
            }
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

  .ms-doc article > div {
    padding: 10px 0;
  }

  .displayName {
    font-weight: 600;
    font-size: 22px;
  }

  .span_line {
    border-bottom: 1px solid #CCCCCC;
    padding: 10px 5px;
  }

  .span_line > span {
    color: #999;
  }

  .edit {
    float: right;
    font-size: 24px;
    color: #00d1b2;
    margin-right: 20px;
    cursor: pointer;
    display: block;
    width: 30px;
  }

  .updatePwd {
    font-size: 15px;
    color: #ff4949;
  }
</style>
