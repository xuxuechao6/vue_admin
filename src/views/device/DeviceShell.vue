<template>
  <div class="main">

    <div id="main" @click="onFocus($event)" v-if="activeShell">
      <div class="tips">
        <p class="resp">
          【shell】命令行控制台 --当前用户：$username
        </p>
        <span class="resp">
          用法提示：<br/>  
           1.输入“命令 参数1 参数2 ……”回车<br/>  
           2.鼠标选中文本即可复制<br/>  
           3.输入空命令或“命令 ?”获取帮助<br/>
           4.按向上、向下键切换用过的命令,"cls"清屏<br/>
        </span>
      </div>
      <div>
        <div v-for="msg in messages">
          <p class="line">
            <span class="messageName" v-text="msg.name"> </span>
            <span class="message" v-text="msg.message"> </span>
          </p>
        </div>
        <div>
          <span id="host" class="resa">$username:></span>
          <input id="command" type="text" class="cmdp" autofocus="true" v-model="message" @keyup.enter="send"
                 @keyup.down="showList(down)" @keyup.up="showList(up)"/>
          <input id="copyIn" type="hidden"/></div>
      </div>

    </div>
  </div>
</template>

<script>

  export default {
    data: function () {
      return {
        down: 'down',
        up: 'up',
        socket: null,
        command: '',
        messages: [],
        myMessages: [],
        msgLength: 0,
        msgState: null,
        message: '',
        channel: 'channel'
      }
    },
    props : {
      activeShell : {
        type : Boolean
      }
    },
    watch : {
      activeShell (value,oldvalue) {
        if(value == false){
          this.socket.close();
          this.messages=[];
          console.log(1111)
          console.log('监听关闭')
          this.$router.go(0)
        }else {
          $("#command").focus();
        }
      }
    },
    created: function () {
      const self = this,
        shellUrl = sessionStorage.getItem('shellUrl'),
        deviceId = sessionStorage.getItem('deviceId'),
        signature = sessionStorage.getItem('login_Signature'),
        sign = sessionStorage.getItem('login_TokenId') + sessionStorage.getItem('deviceId');
      // 创建一个Socket实例
      this.socket = new WebSocket(shellUrl);
      self.messages.push({name: "$device:>", message: "开始连接服务器"});
      this.socket.addEventListener('open', function (event) {
        self.messages.push({name: "$device:>", message: "连接服务器成功"});
        const message = '{"deviceId": "' + deviceId + '",' +
          '"signature": "' + signature + '",' +
          '"sign": "' + self.md5(sign) + '"}'
        console.log("message:", message)
        self.socket.send(message);
        console.log("message:", '已经发送消息')
      });
// Listen for messages
      this.socket.addEventListener('message', function (event) {
        console.log(event);
        console.log(typeof(event.data));
        if(typeof event.data == 'object') {
          console.log(1111)
          const reader = new FileReader();
          reader.addEventListener('loadend', (e) => {
            const text = e.srcElement.result;
            console.log(text);
            self.messages.push({name: "$device:>", message: text});
          });
          reader.readAsText(event.data);
        }

        if(event.data instanceof ArrayBuffer){
          var buffer = event.data;
          console.log("Received arraybuffer");
        }

      });
      this.socket.addEventListener('close', function (event) {
        console.log('断开连接');
        self.messages.push({name: "$device:>", message: "与服务器断开连接"});
        console.log(2222)
        self.$router.go(0)

      });
    },
//    mounted: function () {
//      this.$nextTick(function () {
//        Terminal.init(document.getElementById("terminal"), sessionStorage.getItem('shellUrl'));
//      })
//    },
    methods: {
      onFocus(e) {
        if (e.target.id == "main") {
          $("#command").focus();
        }
      },
      send: function () {
        const self = this;
        if (this.message) {
          console.log("readyState:",self.socket.readyState)
          if (self.socket.readyState === WebSocket.OPEN) {
//open的时候即可发送
            console.log('已发送数据')
            self.socket.send(this.message);
            self.socket.send(String.fromCharCode('13'));
            console.log(this.message);
          } else {
            console.log('没有发送数据')
// Do something else in this case.
//Possibly ignore the data or enqueue it.
          }
        }
        self.messages.push(
          {name: "$username:>", message: self.message}
        );
        self.myMessages.push(
          {myMessage: self.message}
        );
        self.msgLength = self.myMessages.length;
        self.msgState = null;
        self.message = null
      },
      showList(val) {
        const self = this;
        if (self.myMessages != "") {
          if (self.msgState==null){
            self.msgState = self.msgLength;
            console.log(self.msgState)
            this.showBack(val);
          }else if(self.msgState<=self.msgLength&&self.msgState>=0) {
            this.showBack(val);
          }else{
            self.message = self.message
          }
        } else {
          console.log('还没有消息')
        }
      },
      showBack(val){
        const self = this;
        if (val == "down") {                          //判断向下按钮逻辑
          if (self.msgState+1>=self.msgLength) {      //返回到最后一个值的时候
            self.msgState=self.msgLength
            self.message = ""
          } else {
            self.msgState=self.msgState+1
            self.message = self.myMessages[self.msgState].myMessage
          }
        } else if (val == "up") {                     //判断向上按钮逻辑
          if (self.msgState == 0) {                   //返回到第一个值的时候
            self.msgState=self.msgState
            self.message = self.myMessages[self.msgState].myMessage
          } else {
            self.msgState = self.msgState - 1
            self.message = self.myMessages[self.msgState].myMessage
          }
        }
      },
      handleClose() {
        this.socket.close();
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
  .messageName {
    color: #337ab7;
  }
  .message {
    color: #cccc;
  }
  .main {
    width: 98%;
    height: 98%;
    overflow: auto;
    margin: 0px;
    padding: 10px;
    background-color: black;
    color: white;
    font-size: 14px;
  }

  .resp {
    margin: 5px 0;
    line-height: 25px;
  }
  .tips{
    margin-bottom: 15px;
  }
.line{
  height: 25px;
  line-height: 25px;
}
  .resa {
    margin: 5px 0px;
    display: inline-block;
    color: #337ab7;
  }

  .cmdp {
    color: white;
    margin: 5px 0px;
    width: 80%;
    font-size: 14px;
    background-color: black;
    border: 0px;
    display: inline-block;
    outline: none;

  }
</style>
