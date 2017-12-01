<template>
  <div>
    <div class="ms-doc">
      <h3><span class="btn_back" @click="handleBack">模块管理</span>/添加新固件</h3>
      <article>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">

          <el-form-item label="固件类型：" prop="Type">
            <el-autocomplete
              class="inline-input"
              v-model="ruleForm.Type"
              :fetch-suggestions="querySearch"
              placeholder="请输入固件类型"
            ></el-autocomplete>
          </el-form-item>

          <el-form-item label="固件版本号：" prop="Version">
            <el-input v-model="ruleForm.Version"></el-input>
          </el-form-item>

          <el-form-item label="上传固件文件：">
            <el-upload
              class="upload-demo"
              action="iotadmin/firmwares/file"
              :on-change="handleChange"
              :file-list="fileList"
              :multiple="false"
              :on-error="handleError"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :auto-upload="true">
              <el-button size="small" type="primary" >点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传类型匹配的固件</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="版本说明：" prop="Description">
            <el-input type="textarea" v-model="ruleForm.Description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
            <el-button @click="escForm">取消</el-button>
          </el-form-item>
        </el-form>
      </article>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        // myHeaders:{
        //   'content-type': 'multipart/form‐data; boundary=‐‐‐‐‐‐‐‐‐‐e952703614f8bac',
        //      },
        restaurants: [],
        fileList: [],
        ruleForm: {
          FileUrl:'',
          FileSize:'',
          FileName:'',
          FileMd5:'',
          Type: '',
          Version: '',
          Description: '',
        },
        rules: {
          Type: [{
            required: true,
            message: '请输入固件类型',
          }],
          Version: [{
            required: true,
            message: '请输入固件版本号',
            trigger: 'blur'
          }],
          file: [{
            required: true,
            message: '请上传固件文件',
          }]
        }
      };
    },
    mounted() {
      this.restaurants = this.loadAll();
    },
    methods: {
       handleBack(back) {
				this.$router.go(-1);
			},
      //带建议的输入框
      loadAll() {
        return[
          { "value": "firmware"},
          { "value": "filesystem"},
        ];
      },
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.indexOf(queryString.toLowerCase()) === 0);
        };
      },

      handleRemove(file, fileList) {
      },
      handleChange(file, fileList) {
        this.fileList = fileList.slice(-1);
        this.ruleForm.FileName=file.name;
      },
      handleSuccess(response){
        this.ruleForm.FileUrl=response.FileUrl,
          this.ruleForm.FileSize=response.FileSize,
          this.ruleForm.FileMd5=response.FileMd5;
      },
      handleError(err,file,fileList){
console.log(err.response)
      },

      submitForm(formName) {
        let self = this,
          productId = sessionStorage.getItem('productId'),
          _url = "/products/" + productId + "/firmware",
          _method = "POST",
          _body = {            //定义要传过去的参数
            'Type': self.ruleForm.Type,
            'Version': self.ruleForm.Version,
            'Description': self.ruleForm.Description,
            'FileSize': self.ruleForm.FileSize,
            'FileMd5': self.ruleForm.FileMd5,
            'FileUrl': self.ruleForm.FileUrl,
            'Name': self.ruleForm.FileName,
          },
          body = JSON.stringify(_body),
          sign1 = sessionStorage.getItem('login_TokenId') + _url + _method + body,
          sign = this.md5(sign1) + "," + sessionStorage.getItem('login_Signature');
        //将对象转为字符串
            //验证数据后 与后台交互
            self.$refs[formName].validate((valid) => {
                if (valid) {
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
                        this.add_suc(res)

                    }).catch((error) => { //请求失败后
                        console.log("error:" + error)
                        this.add_err(error)
                    });
                } else {
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
            message: '添加新固件成功',
            type: 'success'
          });
          let newId = sessionStorage.getItem("productId"),
            newName = sessionStorage.getItem("productName");
          this.$router.push({
            path: '/firmwareList/:productId',
            name: 'firmwareList',
            params: {
              productId: newId,
              productName: newName
            }
          })
        } else {
          this.$message.error('添加新固件失败');
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
            self.$message.error('该固件已存在，请添加新产品');
          } else {
            self.$message.error('添加新固件失败，请稍候再试');
            return false;
          }
        } else {
          //一些错误是在设置请求的时候触发
          console.log('Error', error.message);
          self.$message.error('网络错误，请稍候再试');
          return false;
        }

      },

      escForm() {
        let newId = sessionStorage.getItem("productId"),
          newName = sessionStorage.getItem("productName");
        console.log('newId:' + newId)
        this.$router.push({
          path: '/firmwareList/:productId',
          name: 'firmwareList',
          params: {
            productId: newId,
            productName: newName
          }
        })
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
