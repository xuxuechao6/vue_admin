<template>
  <div>
    <div class="ms-doc">
      <h3>新建OTA版本</h3>
      <article>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
          <el-form-item label="版本号：" prop="Version">
            <el-input v-model="ruleForm.Version" placeholder="请输入版本号"></el-input>
          </el-form-item>
          <div v-for=" (Firmware, index) in ruleForm.Firmwares" :key="index">
            <el-form-item :label="'选择固件'+Firmware.Index" :prop="'Firmwares.' + index + '.FirmwareId'">
              <el-select v-model="Firmware.Firmware" filterable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.FirmwareId"
                  :label="item.Type"
                  :value="item">
                  <span style="float: left">{{ item.Type }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Version }}</span>
                </el-option>
              </el-select>
              <el-button v-if="index>0" type="danger" @click="deleteModel(index)">删除模块</el-button>
                <p>下边是绑定的一个string： </p>
              <p v-text="Firmware.Firmware"></p>
            </el-form-item>
            <el-form-item label="升级模式" :prop="'Firmwares.' + index + '.UpgradeMode'">
              <el-select v-model="Firmware.UpgradeMode" placeholder="请选择">
                <el-option label="可选升级" value="1"></el-option>
                <el-option label="强制升级" value="2"></el-option>
                <el-option label="静默升级" value="3"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="升级顺序编号：" :prop="'Firmwares.' + index + '.Index'">
              <el-input v-model.number="Firmware.Index" placeholder="请输入数字"></el-input>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button @click="addModel">新增模块</el-button>
          </el-form-item>

          <el-form-item label="可升级设备列表：">
            <span v-if="!showDevices" style="color: #999"> 请先添加设备</span>
            <el-transfer
              v-if="showDevices"
              :titles="['设备列表', '可升级设备列表']"
              :button-texts="['移除', '添加']"
              v-model="AllowDevicesId"
              :props="{
               key: 'DeviceId',
               label: 'SN'
               }"
              :data="Devices">
            </el-transfer>
          </el-form-item>
          <el-form-item label="备注" prop="Description">
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
        if (!value) {
          return callback(new Error('请输入升级编号'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入整数'));
          } else {
            if (value < 1) {
              callback(new Error('编号必须大于0'));
            } else {
              callback();
            }
          }
        }, 500);
      };
      return {
        showDevices: true,
        form: {
          names: [{
            text: ""
          }]
        },
        AllowDevicesId: [],
        Devices: [],
        //DevicesId:[],
        _data1: [],
        options: [],
        value5: [],
        ruleForm: {
          Firmwares: [
            {
              Index: 1,
              UpgradeMode: "1",
              Firmware: "",
            },
          ],
          Version: '',
          Description: ''
        },
        rules: {
          Index: [{
            validator: checkNum,
            trigger: 'blur'
          }]
        }
      };
    },
    mounted: function () {
      this.$nextTick(function () {
        this.listView();
        this.listView2();
      })
    },
    computed: {
      DevicesId: {
        // getter 应返回计算后的值
        get: function () {
          const _date1 = [];
          this.Devices.forEach((Devices) => {
            _date1.push({
              DeviceId: Devices.DeviceId,
            });
          });
          return _date1
        },
      },
      AllowDevices: {
        get: function () {
          const _data2 = [];
          this.AllowDevicesId.forEach((Devices) => {
            _data2.push({
              DeviceId: Devices,
            });
          });
          return _data2
        },
      },
      DenyDevices: {
        get: function () {
          const arr1 = [];
          this.Devices.forEach((Devices) => {
            arr1.push({
              DeviceId: Devices.DeviceId,
            });
          });
          const arr2 = [];
          this.AllowDevicesId.forEach((Devices) => {
            arr2.push({
              DeviceId: Devices,
            });
          });
          for (var i = arr1.length - 1; i >= 0; i--) {
            const a = arr1[i].DeviceId;
            for (var j = arr2.length - 1; j >= 0; j--) {
              const b = arr2[j].DeviceId;
              if (a === b) {
                arr1.splice(i, 1);
                arr2.splice(j, 1);
                break;
              }
            }
          }
          return arr1
        }
      }
    },
    methods: {
      addModel() {
        this.ruleForm.Firmwares.push({
          Index: this.ruleForm.Firmwares.length + 1,
          UpgradeMode: "1",
          Firmware: ""
        });
        console.log(this.ruleForm.Firmwares.length)
      },

      deleteModel(val, index) {
        console.log(val)
          const L =this.ruleForm.Firmwares.length
        this.ruleForm.Firmwares.splice(L-1, 1)
      },
      listView: function () {
        let productId = sessionStorage.getItem('productId');
        let _url = "/products/" + productId + "/firmware";
        let _method = "GET";
        let body = "";
        let sign1 = sessionStorage.getItem('login_TokenId') + _url + _method + body;
        let sign = this.md5(sign1) + "," + sessionStorage.getItem('login_Signature');
        this.$http({
          url: "/iotadmin" + _url,
          method: _method,
          headers: {
            'content-type': 'application/json',
            'Rtt-Sign': sign
          },
        }).then((res) => {
          console.log(res.data)
          this.options = res.data.Results;
          console.log(this.options)
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
        });
      },
      listView2: function () {
        let productId = sessionStorage.getItem('productId');
        let _url = "/products/" + productId + "/devices";
        let _method = "GET";
        let body = "";
        let sign1 = sessionStorage.getItem('login_TokenId') + _url + _method + body;
        let sign = this.md5(sign1) + "," + sessionStorage.getItem('login_Signature');
        this.$http({
          url: "/iotadmin" + _url,
          method: _method,
          headers: {
            'content-type': 'application/json',
            'Rtt-Sign': sign
          },
        }).then((res) => {
          if (res.data.Results == null) {
            this.showDevices = false;
          } else {
            this.Devices = res.data.Results;
            this.showDevices = true;
            console.log("Devices")
            console.log(this.Devices)
          }
        }).catch(function (error) {
          if (error.response) {
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
        const _Firmwares = this.ruleForm.Firmwares,
          _data = [];
        _Firmwares.forEach((Firmwares) => {
          _data.push({
            Index: Firmwares.Index,
            UpgradeMode: parseInt(Firmwares.UpgradeMode),
            Type: Firmwares.Firmware.Type,
            Version: Firmwares.Firmware.Version,
            Name: Firmwares.Firmware.Name,
            FileSize: Firmwares.Firmware.FileSize,
            FileUrl: Firmwares.Firmware.FileUrl,
            FileMd5: Firmwares.Firmware.FileMd5,
            FirmwareId: Firmwares.Firmware.FirmwareId,
            Description: Firmwares.Firmware.Description,
          });
        });
        console.log(_data, "_data");
        console.log(this.DevicesId, "DevicesId");
        console.log(this.Devices, "Devices");
        console.log(this.AllowDevices, "AllowDevices");
        console.log(this.DenyDevices, "DenyDevices");

         let self = this,
           productId = sessionStorage.getItem('productId'),
           _url = "/products/" + productId + "/upgrade",
           _method = "POST",
           _body = {            //定义要传过去的参数
             'Version': self.ruleForm.Version,
             'Firmwares': _data,
             'AllowDevices': this.AllowDevices,
             'DenyDevices': this.DenyDevices,
             'Description': self.ruleForm.Description,
           },
           body = JSON.stringify(_body),
           sign1 = sessionStorage.getItem('login_TokenId') + _url + _method + body,
           sign = this.md5(sign1) + "," + sessionStorage.getItem('login_Signature');
         console.log(body,"body")
         console.log(_url,"_url")
         console.log(self.ruleForm)

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
        if (res.status == 200) {
          this.$notify({
            title: 'GOOD',
            message: '新建OTA版本成功',
            type: 'success'
          });
          let newId = sessionStorage.getItem("productId"),
            newName = sessionStorage.getItem("productName");
          console.log('productId:' + newId)
          console.log('productName:' + newName)
          this.$router.push({
            name: 'upgradedList',
            params: {
              productId: newId,
              productName: newName
            }
          })
        } else {
          this.$message.error('新建OTA版本失败');
        }

      },
      //发送数据失败后
      add_err(error) {
        var self = this;
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.data.ErrCode);
          //请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
          if (error.response.data.ErrCode == 40000101) {
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
        this.$router.go(-1)
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
