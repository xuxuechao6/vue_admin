export function getList(date, fmt) {
    this.$http({
        url: "/iotadmin"+ _url,
        method: _method,
        headers: {
            'content-type': 'application/json',
            'Rtt-Sign': sign
        },
    }).then((res) => {
        console.log(res.data)
        if(res.data.Results == null) {
            console.log(2222)
            this.showList = false
        } else {
            this.showList = true
            this.Results = res.data.Results;
            console.log(this.Results)
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
    return fmt;
};
