<template>
  <div>

    <div class="ms-doc">
      <h3 class="clearfix header">
        模块管理
        <el-button style="float: right;" type="primary" @click="handleAdd">+ 添加固件</el-button>
      </h3>
      <article>
        <span v-if="!showList" class="font_none">暂无模块</span>
        <el-table v-if="showList" :data="Results" border class="table"
                  :default-sort="{prop: 'date', order: 'descending'}">
          <el-table-column prop="Type" label="固件型号" align="center" width="110">
          </el-table-column>
          <el-table-column prop="Version" label="固件版本号" align="center" width="110">
          </el-table-column>
          <el-table-column prop="Name" label="文件名字" align="center" width="200">
          </el-table-column>
          <el-table-column prop="FileSize" :formatter="sizeFormat" label="文件大小" align="center" width="120">
          </el-table-column>
          <el-table-column prop="IsRelease" label="是否发布" :formatter="isReleaseFormat" align="center" width="95">
          </el-table-column>
          <el-table-column  label="下载固件" :v-html="fileUrlFormat" align="center" width="120">
            <template scope="scope">
           <!-- <a :href="handleDownLoad(scope.row)" @click="handleTouch(scope.row)" class="downLoad" :download="handleDownLoad2(scope.row)">下载</a>-->
              <a @click="handleTouch(scope.row)" class="downLoad">下载</a>
            </template>
          </el-table-column>
          <el-table-column prop="CreatedTime" :formatter="dateFormat"  label="创建时间" align="center" width="115">
          </el-table-column>
          <el-table-column label="操作" align="center" width="140">
            <template scope="scope">
              <el-button size="small" type="info" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="Description" label="描述">
          </el-table-column>
        </el-table>
      </article>
    </div>

  </div>
</template>

<script>
  import {formatDate} from './../format/data';
  export default {
    data: function () {

      return {
        showList: false,
        Results: [],
        Results2: [],
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
      sizeFormat:function(row, column) {
        let value=row.FileSize
        if(null==value||value==''){
          return "0 Bytes";
        }
        var unitArr = new Array("Bytes","KB","MB","GB","TB","PB","EB","ZB","YB");
        var index=0;
        var srcsize = parseFloat(value);
        index=Math.floor(Math.log(srcsize)/Math.log(1024));
        var size =srcsize/Math.pow(1024,index);
        size=size.toFixed(2);//保留的小数位数
        return size+"  "+unitArr[index];
      },
      dateFormat:function (row, column) {
        let date= new Date(row.CreatedTime*1000);
        return formatDate(date, "yyyy-MM-dd hh:mm");
      },
      fileUrlFormat:function (row, column) {
        let _url=row.FileUrl,
        _html ="<a href='"+_url+"' >下载</a>";
        return _html
      },
      isReleaseFormat(row,column){
        return row.IsRelease == 0 ? '否' : row.IsRelease == 1 ? '是' : '未知';
      },
      listView: function () {
        let productId = sessionStorage.getItem('productId');
        let _url = "/products/" + productId + "/firmware";
        let _method = "GET";
        let body = "";
        let sign1 = sessionStorage.getItem('login_TokenId') + _url + _method + body;
        let sign = this.md5(sign1) + "," + sessionStorage.getItem('login_Signature');
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
          if (res.data.Results == null) {
            console.log(2222)
            this.showList = false;
          } else {
            this.productNum = true
            this.Results = res.data.Results;
            this.showList = true;
            console.log(this.Results)
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

      handleAdd() {
        let newId = sessionStorage.getItem('productId');
        this.$router.push({
          path: '/addFirmware/:firmwareId',
          name: 'addFirmware',
          params: {
            firmwareId: newId
          }
        })
      },
      /*firmwareDetail() {
                this.$router.push('/firmwareDetail');
            },*/
      handleDownLoad(val) {
      return val.FileUrl
      },
      handleDownLoad2(val) {
        return val.Name
      },

      handleEdit(val) {
        sessionStorage.setItem("FirmwareId", val.FirmwareId)
        this.$router.push('/firmwareEdit');
      },
      handleTouch(val){
        let productId = sessionStorage.getItem('productId'),
          _url = "/firmwares/file"+val.FileUrl.substring(val.FileUrl.lastIndexOf("/")),
          _method = "GET",
          sign1 = sessionStorage.getItem('login_TokenId') + _url + _method,
          sign = this.md5(sign1) + "," + sessionStorage.getItem('login_Signature');
         fetch("/iotadmin" + _url, {
           isDownload: true,
          method: _method,
          headers: {
            "Access-Control-Allow-Origin":"*",
            "Content-Type":"application/font-woff",
            'Rtt-Sign': sign
          },
        }).then(res => {
             var a = document.createElement('a');
             var url = val.FileUrl;
             var filename = val.Name;
             a.href = url;
             a.download = filename;
             a.click();
         });
      },
      handleDelete(val) {
        this.$confirm('此操作将永久删除该产品信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(val)
          this.handleDelete2(val);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleDelete2(val){
        const self = this;
        let productId = sessionStorage.getItem('productId'),
          _url = "/products/" + productId + "/firmware/" + val.FirmwareId,
          _method = "DELETE",
          sign1 = sessionStorage.getItem('login_TokenId') + _url + _method,
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
          if (res.data == "") {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            this.showList = false,
              this.listView();

          } else {
            this.$message({
              type: 'info',
              message: '删除失败'
            });
          }
        }).catch(function (error) {
          if (error.response) {
            console.log(error)
            console.log(error.response.data);
            console.log(error.response.data.ErrCode);
            //请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
            if (error.response.data.ErrCode = "40000303") {
              self.$message.error('已发布版本的固件无法被删除');
            } else {
              self.$message.error('网络错误，请稍后再试');
              return false
            }
          } else {
            //一些错误是在设置请求的时候触发
            console.log('Error', error.message);
            return false
          };
        });
      }
    }
  }
</script>

<style scoped>
  .font_none {
    color: #999;
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

  .ms-doc article th {
    min-width: 120px;
    display: block;
    text-align: center !important;
  }
  .downLoad{
    color:#20a0ff;
  }
</style>
