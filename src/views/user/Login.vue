<template>
  <div class="login-wrap">
    <div class="ms-title">后台管理系统</div>
    <div class="ms-login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
        <el-form-item prop="LoginName">
          <el-input v-model="ruleForm.LoginName" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="Password">
          <el-input type="password" placeholder="请输入密码" v-model="ruleForm.Password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
        </el-form-item>
        <span class="forgetPwd" @click="handlePwd('forgetPwd')">忘记密码？</span>
        <div class="login-btn">
          <el-button type="primary" v-on:keyup.enter.native="submitForm" @click="submitForm('ruleForm')" :loading="loading">登录
          </el-button>
        </div>
        <p class="register">还没有帐号？
          <span @click="handleRegister('register')">立即注册</span>
        </p>
      </el-form>

    </div>
  </div>
</template>

<script>
import { requestLogin, requestUserInfo } from '../api/api';
import { PhonePatrn, PwdPatrn } from '../format/validate';

export default {
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
            callback();
            return
          } else
          {
            callback(new Error('未知错误'));
            return
          }

        }).catch(function (error) {
//          if (error.response.data.ErrCode == 40000015) {
//            callback(new Error('您输入的帐号不存在，请注册后在进行登录'));
//          } else {
//            callback(new Error('未知错误'));
//          }
        });
      }
    };
    const validatePwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (!PwdPatrn(value)) {
        callback(new Error('密码格式不正确'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      ruleForm: {
        LoginName: '',
        Password: ''
      },
      rules: {
        LoginName: [{
          validator: validatePhone,
          trigger: 'blur'
        }],
        Password: [{
          min: 8,
          max: 16,
          message: '密码长度在 8 到 16 个字符',
          trigger: 'blur'
        }, {
          validator: validatePwd,
          trigger: 'blur'
        }],
      }
    }
  },


  methods: {
    submitForm(formName) {
      const self = this;
      self.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          let loginParams = {
            body: {
              'LoginName': self.ruleForm.LoginName,
              'Password': this.md5(self.ruleForm.Password)
            },
            _method: "POST"
          };
          requestLogin(loginParams).then((res) => {
            if (res.status == 200) {
              sessionStorage.setItem("login_Signature", res.data.Signature);
              sessionStorage.setItem("login_TokenId", res.data.TokenId);
              sessionStorage.setItem('login_UserId', res.data.UserId);
              let userParams = {
                _url: "/users/" + res.data.UserId,
                userId: res.data.UserId,
                _method: "GET"
              };
              console.log(userParams)
              requestUserInfo(userParams).then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: '登陆成功',
                    type: 'success'
                  });
                  sessionStorage.setItem("showName", self.ruleForm.LoginName, );
                  sessionStorage.setItem("DisplayName", res.data.DisplayName, );
                  this.loading = false;
                  setTimeout(function () {
                    self.$router.push('/homePage');
                  }.bind(this), 100)
                } else {
                  self.$message.error('网络错误，请稍后再试');
                  console.log('error submit!!');
                  this.loading = false;
                  return false;
                }
              }).catch(function (error) {
              })
            } else {
              self.$message.error('网络错误，请稍后再试');
              console.log('error submit!!');
              this.loading = false;
              return false;
            }
          }).catch(function (error) {
            if (error.response) {
              console.log(error)
              console.log(error.response.data)
              console.log(error.response.data.ErrCode)
              //请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
              if (error.response.data.ErrCode = 40000013) {
                self.$message.error('密码输入有误，请重新输入');
                self.loading = false;
                self.ruleForm.Password = ""

              }
            } else {
              self.$message.error('网络错误，请稍后再试');
              self.loading = false;
              return false;
            }
            this.loading = false;
            console.log(error.config);
          });
        } else {
          console.log('error submit!!');
          this.loading = false;
          return false;
        }
        /*self.$router.push('/homePage');*/

      });
    },
    handlePwd(forgetPwd) {
      this.$router.push('/forgetPwd');
    },
    handleRegister(register) {
      this.$router.push('/register');
    }
  },

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
  margin-top: -230px;
  text-align: center;
  font-size: 30px;
  color: #fff;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 180px;
  margin: -150px 0 0 -190px;
  padding: 40px;
  border-radius: 5px;
  background: #fff;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
}

.forgetPwd {
  font-size: 12px;
  line-height: 30px;
  color: #00d1b2;
  text-align: right;
  cursor: pointer;
  display: block;
  margin-top: -15px;
  width: 70px;
  float: right;
}

.register {
  font-size: 12px;
  line-height: 40px;
  color: #999;
  text-align: right;
}

.register span {
  color: #00d1b2;
  cursor: pointer;
}
</style>
