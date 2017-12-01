<template>
  <div>

    <div class="ms-doc">
      <h3 class="clearfix header">
        <span class="btn_back" @click="handleHome">设备信息</span>/<span class="btn_back" @click="handleBack">设备详情</span>/设备日志

        <el-button type="info" style="float: right" @click="handleLog()">获取实时LOG</el-button>
      </h3>
      <article>

        <span v-if="viewList">暂无数据</span>
        <!--<div class="col-md-8 message" v-for="message in messages">-->
          <!--{{ message.msg }}-->
        <!--</div>-->
        <!--<form v-on:submit="send">-->
          <!--<input id="message" v-model="message"/>-->
          <!--<button class="btn btn-primary">Send</button>-->
        <!--</form>-->


      </article>
    </div>

  </div>
</template>

<script>

  export default {
    data: function () {
      return {
        viewList: false,
        item: "",
        messages: [],
        message: null,
        channel:'channel'
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.detailView();
      })
    },
    methods: {
           detailView: function () {
        let self = this,
          DeviceId = sessionStorage.getItem('DeviceId'),
          _url = "/logs/" + DeviceId,
          _method = "GET",
          sign1 = sessionStorage.getItem('login_TokenId') + _url + _method,
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
          if (res.data == "") {
            this.viewList = false
          } else {
            this.viewList = true
            this.item = res.data
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
          };
        });
      },
      send : function(e) {
        e.preventDefault();
        console.log(this.message);
        if(this.message) {
          ws.send(this.message);
        }
        this.message = null;
      },

      handleLog() {
        var ws = new WebSocket("ws://116.62.23.166:8095/log");
             console.log(111)
        ws.onopen = function(){
          console.log('已连接')
         // console.log("message:",message)
          //ws.send(message);
        };
        ws.onmessage = function(evt){
          console.log(evt.data);
          //ws.close();
        };
        //        ws.onclose = function(evt){console.log('WebSocketClosed!');};
//        ws.onerror = function(evt){console.log('WebSocketError!');};

      },
      handleHome(back) {
        this.$router.go(-2);
      },
      handleBack(back) {
        this.$router.go(-1);
      },
    }
  }

</script>

<style scoped>

</style>
