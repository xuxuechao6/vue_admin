<template>
  <div>

    <div class="ms-doc">
      <h3 class="clearfix header">
        设备列表
        <el-button style="float: right;" type="primary" @click="addDevice = true">+ 新建设备</el-button>
      </h3>

      <!-- 新建设备 -->
      <el-dialog title="新建设备" :visible.sync="addDevice">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="设备序列号(SN)" prop="SN">
            <el-input v-model="ruleForm.SN" placeholder="设备序列号最长不能超过32位"></el-input>
          </el-form-item>
          <el-form-item label="设备名称" prop="Name">
            <el-input v-model="ruleForm.Name"></el-input>
          </el-form-item>
          <el-form-item label="MAC地址：" prop="Mac">
            <el-input v-model="ruleForm.Mac"></el-input>
          </el-form-item>
          <el-form-item label="描述：" prop="desc">*
            <el-input type="textarea" v-model="ruleForm.desc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDevice = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>


      <!--&lt;!&ndash; 激活设备 &ndash;&gt;-->
      <!--<el-dialog title="激活设备" :visible.sync="activeDevice">-->
        <!--<el-form :model="ruleForm3" :rules="rules" ref="ruleForm">-->
          <!--<el-form-item label="设备序列号(SN)" >-->
            <!--<el-input v-model="ruleForm3.SN" readonly></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="设备名称" prop="Name">-->
            <!--<el-input v-model="ruleForm3.Name" readonly></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="MAC地址：" prop="Mac">-->
            <!--<el-input v-model="ruleForm3.Mac" readonly></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="描述：" prop="desc">-->
            <!--<el-input type="textarea" v-model="ruleForm3.desc" readonly></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="产品密钥(产品信息中查看)" prop="ProductKey">-->
            <!--<el-input v-model="ruleForm3.ProductKey"></el-input>-->
          <!--</el-form-item>-->
        <!--</el-form>-->
        <!--<div slot="footer" class="dialog-footer">-->
          <!--<el-button @click="activeDevice = false">取 消</el-button>-->
          <!--<el-button type="primary" @click="submitForm3('ruleForm')">激活</el-button>-->
        <!--</div>-->
      <!--</el-dialog>-->

      <article>
        <span v-if="!showList" style="color: #999">暂无设备</span>
        <el-table v-if="showList" :data="Results" border highlight-current-row v-loading="listLoading"
                  @selection-change="selsChange" class="table" :default-sort="{prop: 'date', order: 'descending'}">
          <el-table-column prop="DeviceId" label="设备ID" sortable align="center" width="170">
          </el-table-column>
          <el-table-column prop="SN" label="设备序列号(SN)"  align="center" width="150">
          </el-table-column>
          <el-table-column prop="Name" label="设备名称" align="center" width="110">
          </el-table-column>
          <el-table-column prop="Mac" label="MAC地址" align="center" width="180">
          </el-table-column>
          <el-table-column prop="IsOnline" :formatter="formatNum2" label="是否在线" align="center" width="110">
          </el-table-column>
          <el-table-column label="操作" align="center" >
            <template scope="scope">
       <!--       <el-button size="small" type="info" @click="handleLog(scope.row)">设备日志</el-button>
              <el-button size="small" type="primary" @click="handleShell(scope.row)">shell</el-button>-->
              <el-button size="small" type="info" @click="handleEdit(scope.row)">编辑</el-button>
               <!--<el-button size="small" type="info" @click="handleActive(scope.row)">激活</el-button>-->
              <el-button size="small" type="danger" @click="handleDelete(scope.row.DeviceId)">删除</el-button>
                <el-button type="primary" size="small" @click="handleDetail(scope.row.DeviceId)">详情</el-button>
            </template>
          </el-table-column>

        </el-table>
      </article>

      <!-- 更新设备 -->
      <el-dialog title="更新设备信息" :visible.sync="updateDevice">
        <el-form :model="ruleForm2" :rules="rules" ref="ruleForm2">
          <el-form-item label="设备序列号(SN)" prop="SN">
            <el-input v-model="ruleForm2.SN" readonly></el-input>
          </el-form-item>
          <el-form-item label="设备名称" prop="Name">
            <el-input v-model="ruleForm2.Name"></el-input>
          </el-form-item>
          <el-form-item label="MAC地址：" prop="Mac">
            <el-input v-model="ruleForm2.Mac"></el-input>
          </el-form-item>
          <el-form-item label="描述：" prop="desc">
            <el-input type="textarea" v-model="ruleForm2.desc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateDevice = false">取 消</el-button>
          <el-button type="primary" @click="submitForm2('ruleForm2')">确 定</el-button>
        </div>
      </el-dialog>


      <!-- 设备LOG -->
      <el-dialog title="设备日志" :visible.sync="deviceLog">
        <template>
          <el-table
            :data="tableData3"
            height="250"
            border
            style="width: 100%">
            <el-table-column
              prop="date"
              label="时间"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="问题"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="描述">
            </el-table-column>
          </el-table>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click="deviceLog = false">取 消</el-button>
          <el-button type="primary" @click="">更新</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  import md5 from 'js-md5'; //加密
  export default {
    data: function () {
      return {
        filters: {
          Name: ''
        },
        tableData3: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        Results: [],
        showList: false,
        addDevice: false,
        updateDevice: false,
        activeDevice: false,
        listLoading: false,
        deviceLog: false,
        deviceShell: false,
        ruleForm: {
          Name: '',
          Mac: '',
          desc: '',
          SN: ''
        },
        ruleForm2: {
          Name: '',
          Mac: '',
          desc: '',
          SN: ''
        },
        ruleForm3: {
          ProductKey: '',
          Name: '',
          Mac: '',
          desc: '',
          SN: ''
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

      selsChange: function (sels) {
        this.sels = sels;
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getUsers();
      },
      //显示转换
      formatNum: function (val, column) {
        return val.IsActive == 1 ? '是' : val.IsActive == 0 ? '否' : '未知';
      },
      formatNum2: function (val, column) {
        return val.IsOnline == 1 ? '是' : val.IsOnline == 0 ? '否' : '未知';
      },
      formatTime: function (val, column) {
        if (null == val.OnlineDuration || val.OnlineDuration == '') {
          return "无";
        }
        return val.OnlineDuration + "  小时"
      },
      //以名字查询
      getUsers() {
        /* let para = {
             page: this.page,
             name: this.filters.name
         };
         this.listLoading = true;
         //NProgress.start();
         getUserListPage(para).then((res) => {
             this.total = res.data.total;
             this.users = res.data.users;
             this.listLoading = false;
             //NProgress.done();
         });*/
      },

      listView: function () {
        let productId = sessionStorage.getItem('productId');
        let _url = "/products/" + productId + "/devices";
        let _method = "GET";
        let body = "";
        let sign1 = sessionStorage.getItem('login_TokenId') + _url + _method + body;
        let sign = md5(sign1) + "," + sessionStorage.getItem('login_Signature');
        console.log('sign',sign)
        console.log('login_Signature', sessionStorage.getItem('login_Signature'))
        this.$http({
          url: "/iotadmin" + _url,
          method: _method,
          headers: {
            'content-type': 'application/json',
            'Rtt-Sign': sign
          },
        }).then((res) => {
          if (res.data.Results == null) {
            this.showList = false;
          } else {
            this.productNum = true
            this.Results = res.data.Results;
            this.showList = true;
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
        let self = this,
          productId = sessionStorage.getItem('productId'),
          _url = "/products/" + productId + "/devices",
          _method = "POST",
          _body = {            //定义要传过去的参数
            'SN': self.ruleForm.SN,
            'Name': self.ruleForm.Name,
            'Mac': self.ruleForm.Mac,
            'Description': self.ruleForm.desc,
          },
          body = JSON.stringify(_body),
          sign1 = sessionStorage.getItem('login_TokenId') + _url + _method + body,
          sign = md5(sign1) + "," + sessionStorage.getItem('login_Signature');
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
        if (res.status == 200) {
          this.$notify({
            title: 'GOOD',
            message: '新建设备成功',
            type: 'success'
          });
          this.$refs['ruleForm'].resetFields();
          this.addDevice = false,
            this.listView();
        } else {
          this.$message.error('新建设备失败');
        }

      },
      //发送数据失败后
      add_err(error) {
        let self = this;
        console.log(5555555555)
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.data.ErrCode);
          //请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
          if (error.response.data.ErrCode == 40000201) {

            self.$message.error('该设备名已存在，请勿重复添加');
          } else if (error.response.data.ErrCode == 40000203) {
            self.$message.error('该设备MAC地址已存在，请勿重复添加');
          } else if (error.response.data.ErrCode == 40000204) {
            self.$message.error('该设备序列号已存在，请勿重复添加');
          } else if (error.response.data.ErrCode == 50000002) {
            self.$message.error('设备序列号最长不能超过32位');
          } else {
            this.$refs['ruleForm'].resetFields();
            this.addDevice = false;
            self.$message.error('网络错误，请稍候再试');
            return false;
          }
        } else {
          //一些错误是在设置请求的时候触发
          console.log('Error', error.message);
          self.$message.error('网络错误，请稍候再试');
          this.$refs['ruleForm'].resetFields();
          this.addDevice = false;
          return false;
        }

      },

      handleDelete(val) {
        this.$confirm('此操作将永久删除该产品信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let self = this,
            productId = sessionStorage.getItem('productId'),
            _url = "/products/" + productId + "/devices/" + val,
            _method = "DELETE",
            sign1 = sessionStorage.getItem('login_TokenId') + _url + _method,
            sign = md5(sign1) + "," + sessionStorage.getItem('login_Signature');
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
            if (res.data == "") {
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
              this.listView()
            } else {
              this.$message({
                type: 'info',
                message: '删除失败'
              });
              this.listView()
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
                this.listView()
              } else {
                self.$message.error('网络错误，请稍后再试');
                this.listView()
                return false
              }
            } else {
              console.log(error);
              //一些错误是在设置请求的时候触发
              console.log('Error', error.message);
              this.listView()
              return false
            }
            ;
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
          this.listView()
        });
      },
      handleEdit(val) {
        console.log(val)
        let self = this;
        self.ruleForm2 = {
          SN: val.SN,
          Name: val.Name,
          Mac: val.Mac,
          DeviceId: val.DeviceId
        };
        sessionStorage.setItem('DeviceId', val.DeviceId)
        self.updateDevice = true;
      },
      handleLog(val) {
        console.log(val)
        let self = this;
        sessionStorage.setItem('DeviceId', val.DeviceId)
        self.deviceLog = true;
      },
      handleShell(val) {
        console.log(val)
        let self = this;
        sessionStorage.setItem('DeviceId', val.DeviceId)
        self.deviceShell = true;
      },

      submitForm2(formName) {
        let self = this,
          productId = sessionStorage.getItem('productId'),
          DeviceId = sessionStorage.getItem('DeviceId'),
          _url = "/products/" + productId + "/devices/" + DeviceId,
          _method = "PUT",
          _body = {            //定义要传过去的参数
            'SN': self.ruleForm2.SN,
            'Name': self.ruleForm2.Name,
            'Mac': self.ruleForm2.Mac,
            'Description': self.ruleForm2.desc,
          },
          body = JSON.stringify(_body),
          sign1 = sessionStorage.getItem('login_TokenId') + _url + _method + body,
          sign = md5(sign1) + "," + sessionStorage.getItem('login_Signature');
        //将对象转为字符串
        //签名的 定义过程

        //验证数据后 与后台交互
        self.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(body);
            //发起HTTP请求   然后定义需要请求的参数
            this.$http({
              url: "/iotadmin" + _url, //请求的地址
              method: _method, //请求的方式
              headers: { //定义 请求的头部内容
                'content-type': 'application/json',
                'Rtt-Sign': sign //自定义的请求的头部内容（签名作用）
              },
              data: body, //传过去的参数
            }).then((res) => { //请求成功后
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
        /*接口的传值是(200,获取信息成功),没有返回值说明没有成功*/
        if (res.status == 200) {
          this.$notify({
            title: 'GOOD',
            message: '更新设备信息成功',
            type: 'success'
          });
          let newId = sessionStorage.getItem('productId');
          console.log('newId:' + newId)
          /*this.$router.push({
              path: '/deviceList/:productId',
              name: 'deviceList',
              params: {
                  productId: newId
              }
          })*/
          this.updateDevice = false;
          this.listView()
        } else {
          this.$message.error('更新设备信息失败');
        }

      },
      //发送数据失败后
      add_err2(error) {
        var self = this;
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.data.ErrCode);
          //请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
          if (error.response.data.ErrCode == 40000101) {
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
//             handleActive(val) {
//                console.log(val)
//               let self =this;
//               self.ruleForm3 = {
//                 SN: val.SN,
//                 Name: val.Name,
//                 Mac: val.Mac,
//                 DeviceId: val.DeviceId
//               };
//               self.activeDevice = true;
//            },
//      submitForm3(formName){
//        let self = this,
//          productId = sessionStorage.getItem('productId'),
//          _url = "/devices/active",
//          _method = "POST",
//          _body = {            //定义要传过去的参数
//            'SN': self.ruleForm3.SN,
//            'ProductId': productId,
//            'Sign': this.md5(self.ruleForm3.ProductKey+self.ruleForm3.SN),
//          },
//          body = JSON.stringify(_body);
//        //发起HTTP请求   然后定义需要请求的参数
//        this.$http({
//          url: "/iotadmin" + _url, //请求的地址
//          method: _method, //请求的方式
//          data: body, //传过去的参数
//        }, body).then((res) => { //请求成功后
//          console.log(res)
//          this.$notify({
//            title: 'GOOD',
//            message: '激活设备成功',
//            type: 'success'
//          });
//          this.$refs['ruleForm'].resetFields();
//          self.activeDevice = false;
//        }).catch((error) => { //请求失败后
//          console.log("error:" + error)
//          if (error.response) {
//            console.log(error.response.data);
//            console.log(error.response.data.ErrCode);
//            //请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
//            if (error.response.data.ErrCode == 40000101) {
//              self.$message.error('激活设备失败，请稍候再试');
//            } else {
//              self.$message.error('激活设备失败，请稍候再试');
//              return false;
//            }
//          } else {
//            //一些错误是在设置请求的时候触发
//            console.log('Error', error.message);
//            self.$message.error('网络错误，请稍候再试');
//            return false;
//          }
//        });
//      },
      handleDetail(val) {
        sessionStorage.setItem("deviceId", val);
        let newId = val;
        console.log('newId' + newId)
        this.$router.push({
          name: 'deviceDetail',
          params: {
            productId: newId
          }
        })
      },
      formatter(row, column) {
        return row.address;
      },

    }
  }
</script>

<style scoped>
  .ms-doc {
    width: 100%;
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
  .el-dialog{
    min-height: 300px;
  }
  th.el-table_1_column_6>.cell{
    width: 220px;
  }
</style>
