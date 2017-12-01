<template>
  <div>
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
  </div>
</template>

<script>
  export default {
    data () {
      return {
        ruleForm2: {
          SN:'',
          Name: '',
          Mac: '',
          Description: ''
        },
      }
    },

    watch : {

    },
    methods: {
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
  }
</script>
